import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Users, Wifi, WifiOff } from 'lucide-react';
import { CleanSocket, ClientEvents } from 'clean-socket';
import { Timeline, TimelineItemProps } from 'antd';

interface Message {
    message: string;
    username: string;
    timestamp: Date;
}

export default function ChatDemoPage() {
    const [socket, setSocket] = useState<CleanSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('general');
    const [isConnected, setIsConnected] = useState(false);
    const [isInRoom, setIsInRoom] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [timeLine, setTimeLine] = useState<TimelineItemProps[]>([]);

    useEffect(() => {
        // const newSocket = io('http://localhost:3001');
        //
        // newSocket.on('connect', () => {
        //   console.log('Connected to server');
        //   setIsConnected(true);
        // });
        //
        // newSocket.on('disconnect', () => {
        //   console.log('Disconnected from server');
        //   setIsConnected(false);
        //   setIsInRoom(false);
        // });
        //
        // newSocket.on('receive-message', (data: Message) => {
        //   setMessages(prev => [...prev, data]);
        // });
        //
        // newSocket.on('user-joined', (data: { userId: string }) => {
        //   console.log('User joined:', data.userId);
        // });
        //
        // newSocket.on('user-left', (data: { userId: string }) => {
        //   console.log('User left:', data.userId);
        // });
        const cs = new CleanSocket();
        cs.setConfig({ serverUrl: 'http://localhost:3001' });
        cs.registerEvents(ClientEvents.CONNECT, a => {
            console.log('Connected to server', a);
        });
        cs.registerEvents(ClientEvents.USER_JOIN, (data: any) => {
            console.log('join room ', data);
            setTimeLine(pre => [...pre, { children: `👋 用户 ${data.userName} 加入了房间`, position: 'left', color: 'green' }]);
        });
        cs.registerEvents(ClientEvents.RECEIVE_MESSAGE, a => {
            console.log('receive message ', a);
        });
        cs.registerEvents(ClientEvents.USER_LEAVE, (data: any) => {
            console.log('leaving room', data);
            setTimeLine(pre => [...pre, { children: `🚪 用户 ${data.userName} 离开了房间`, position: 'right', color: 'red' }]);
        });
        const newSocket = cs.connect();
        if (!newSocket) {
            console.log('connect to server error');
            // setIsConnected(false);
            return;
        }
        setIsConnected(true);

        setSocket(cs);

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const joinRoom = () => {
        if (socket && username.trim() && room.trim()) {
            // socket.emit('join-room', { room });
            //  roomName: 'room1', userName: 'clean-web'
            socket.setConfig({ roomUid: room, userName: username });
            socket.joinRoom();
            setTimeLine(pre => [...pre, { children: `👋 用户 ${username} 加入了房间`, position: 'left', color: 'green' }]);
            setIsInRoom(true);
        }
    };

    const sendMessage = () => {
        if (socket && inputMessage.trim() && username && room && isInRoom) {
            // socket.emit('send-message', {
            //     room,
            //     message: inputMessage.trim(),
            //     username,
            // });
            setInputMessage('');
        }
    };

    const leaveRoom = () => {
        if (socket && room && isInRoom) {
            // socket.emit('leave-room', { room });
            socket.leaveRoom();
            setMessages([]);
            setIsInRoom(false);
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
            <Timeline mode="alternate" items={timeLine} reverse />
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
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                                <input
                                    type="text"
                                    placeholder="请输入用户名"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">房间名</label>
                                <input
                                    type="text"
                                    placeholder="请输入房间名"
                                    value={room}
                                    onChange={e => setRoom(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            onClick={joinRoom}
                            disabled={!username.trim() || !room.trim() || !isConnected}
                            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            <Users className="w-4 h-4" />
                            <span>加入房间</span>
                        </button>
                    </div>
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
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-3">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>还没有消息，开始聊天吧！</p>
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
