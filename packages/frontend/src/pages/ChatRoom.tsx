import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Users, Wifi, WifiOff } from 'lucide-react';
import { Flex, Timeline, TimelineItemProps } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks.ts';
import { Bubble } from '@ant-design/x';
import { UserOutlined } from '@ant-design/icons';
import { io, Socket } from 'socket.io-client';

interface Message {
    message: string;
    username: string;
    timestamp: Date;
}
const fooAvatar: React.CSSProperties = {
    color: '#f56a00',
    backgroundColor: '#fde3cf',
};

const barAvatar: React.CSSProperties = {
    color: '#fff',
    backgroundColor: '#87d068',
};

const hideAvatar: React.CSSProperties = {
    visibility: 'hidden',
};

export enum ClientEvents {
    CONNECT = 'connect',
    RECEIVE_MESSAGE = 'receive-message',
    USER_JOIN = 'user-joined',
    USER_LEAVE = 'user-left',
}

export enum ServerEvents {
    JOIN_ROOM = 'join-room',
    LEAVE_ROOM = 'leave-room',
    SEND_MESSAGE = 'send-message',
}
export default function ChatRoom() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('general');
    const [isConnected, setIsConnected] = useState(false);
    const [isInRoom, setIsInRoom] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [timeLine, setTimeLine] = useState<TimelineItemProps[]>([]);
    const [chat, setChat] = useState<{ username: string; content: string }[]>([]);
    const navigate = useNavigate();
    // 获取路由参数 /room/:roomId
    // const { id } = useParams<{ roomId: string }>();

    // 获取查询参数 ?username=xxx&room=yyy
    const [searchParams] = useSearchParams();
    const roomUid = searchParams.get('id');

    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        const newSocket = io('http://localhost:3001');

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const onClientConnected = () => {
        setIsConnected(true);
        joinRoom();
    };

    const onClientDisconnected = () => {
        setIsConnected(false);
        setIsInRoom(false);
    };

    const onClientReceiveMessage = (data: Message) => {
        if (data.username !== user?.username) {
            setChat(pre => [...pre, { username: data.username, content: data.message }]);
        }
    };

    const onUserJoin = (data: { userId: string; username: string }) => {
        setTimeLine(pre => [...pre, { children: `👋 用户 ${data.username} 加入了房间`, position: 'left', color: 'green' }]);
    };

    const onUserLeave = (data: { userId: string; username: string }) => {
        setTimeLine(pre => [...pre, { children: `🚪 用户 ${data.username} 离开了房间`, position: 'right', color: 'red' }]);
    };

    useEffect(() => {
        if (!socket) return;
        socket.on(ClientEvents.CONNECT, onClientConnected);
        socket.on('disconnect', onClientDisconnected);
        socket.on(ClientEvents.RECEIVE_MESSAGE, onClientReceiveMessage);
        socket.on(ClientEvents.USER_JOIN, onUserJoin);
        socket.on(ClientEvents.USER_LEAVE, onUserLeave);

        return () => {
            socket.off(ClientEvents.CONNECT, onClientConnected);
            socket.off('disconnect', onClientDisconnected);
            socket.off(ClientEvents.RECEIVE_MESSAGE, onClientReceiveMessage);
            socket.off(ClientEvents.USER_JOIN, onUserJoin);
            socket.off(ClientEvents.USER_LEAVE, onUserLeave);
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const joinRoom = () => {
        const roomUid = searchParams.get('id');
        if (socket && user) {
            socket.emit(ServerEvents.JOIN_ROOM, { room: roomUid, username: user.username });
            setTimeLine(pre => [...pre, { children: `👋 用户 ${user.username} 加入了房间`, position: 'left', color: 'green' }]);
            setIsInRoom(true);
        }
    };

    const sendMessage = () => {
        const roomUid = searchParams.get('id');
        if (socket && user && inputMessage.trim() && isInRoom) {
            socket.emit('send-message', {
                room: roomUid,
                message: inputMessage.trim(),
                username: user.username,
            });
            setChat(pre => [...pre, { username: user.username, content: inputMessage.trim() }]);
            setInputMessage('');
        }
    };

    const leaveRoom = () => {
        if (socket && room && isInRoom && user) {
            socket.emit(ServerEvents.LEAVE_ROOM, { roomUid, username: user.username, userId: user.uuid });
            setMessages([]);
            setIsInRoom(false);
            navigate('/room_list');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isInRoom) {
                sendMessage();
            } else {
                joinRoom();
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                        <h1 className="text-xl font-semibold text-gray-900">ChatGateway Demo</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isConnected ? (
                            <>
                                <Wifi className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600 font-medium">已连接</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-4 h-4 text-red-600" />
                                <span className="text-sm text-red-600 font-medium">未连接</span>
                            </>
                        )}
                    </div>
                </div>

                {!isInRoom ? (
                    <div className="space-y-3"></div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="text-sm">
                                <span className="text-gray-600">用户:</span>
                                <span className="font-medium text-gray-900 ml-1">{username}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-600">房间:</span>
                                <span className="font-medium text-gray-900 ml-1">#{room}</span>
                            </div>
                        </div>
                        <button onClick={leaveRoom} className="px-4 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md font-medium">
                            离开房间
                        </button>
                    </div>
                )}
            </div>

            {isInRoom && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-row">
                        <div className="space-y-3 flex-[8]">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    {chat.length > 0 ? (
                                        <Flex gap="middle" vertical>
                                            {chat.map(data => {
                                                const isSelf = data.username === user?.username;
                                                return (
                                                    <Bubble placement={isSelf ? 'end' : 'start'} content={data.content} avatar={{ icon: <UserOutlined />, style: isSelf ? barAvatar : fooAvatar }} />
                                                );
                                            })}
                                        </Flex>
                                    ) : (
                                        <p>还没有消息，开始聊天吧！</p>
                                    )}
                                </div>
                            ) : (
                                messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}>
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                                                msg.username === username ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 border border-gray-200'
                                            }`}
                                        >
                                            {msg.username !== username && <div className="text-xs font-medium text-blue-600 mb-1">{msg.username}</div>}
                                            <p className="break-words">{msg.message}</p>
                                            <div className={`text-xs mt-1 ${msg.username === username ? 'text-blue-100' : 'text-gray-500'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="flex-[2]">
                            <Timeline mode="alternate" items={timeLine} reverse style={{ width: '100%' }} />
                        </div>
                    </div>

                    <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
                        <div className="flex space-x-3">
                            <input
                                type="text"
                                placeholder="输入消息..."
                                value={inputMessage}
                                onChange={e => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                <Send className="w-4 h-4" />
                                <span className="hidden sm:inline">发送</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
