import { MessageCircle, LogOut, User } from 'lucide-react';
import { RoomEntity } from '@/components/room-card';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import RoomCard from '@/components/room-card';
import roomApis from 'apis/Room.ts';

export default function RoomPage() {
    const [rooms, setRooms] = useState<RoomEntity[] | []>([]);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);

    const fetchRooms = async () => {
        const res = await roomApis.getAll();
        console.log(res);
        setRooms(res.data);
    };

    const onJoin = async (room: RoomEntity) => {
        console.log('join', room);
        navigate(`/chat?id=${room.uuid}`);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <User className="w-4 h-4" />,
            label: '个人信息',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogOut className="w-4 h-4" />,
            label: '退出登录',
            onClick: handleLogout,
        },
    ];

    useEffect(() => {
        fetchRooms();
    }, []);
    return (
        <div className="flex h-full flex-col">
            {/* Header with user info */}
            <div className="flex justify-between items-center p-4 border-b bg-white">
                <h1 className="text-xl font-semibold text-gray-800">聊天室列表</h1>
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <div className="flex items-center cursor-pointer hover:bg-gray-100 rounded-lg p-2">
                        <Avatar src={user?.avatar} size={32} className="mr-2">
                            {user?.username?.[0]?.toUpperCase()}
                        </Avatar>
                        <span className="text-gray-700">{user?.username}</span>
                    </div>
                </Dropdown>
            </div>

            {/* Main content */}
            <div className="flex flex-1">
                <div className="flex items-center justify-center w-full">
                    <div className="text-center">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h2 className="text-xl font-medium text-gray-600 mb-2">欢迎使用聊天应用</h2>
                        <p className="text-gray-500">项目已初始化完成</p>
                    </div>

                    <RoomCard rooms={rooms} onJoin={onJoin} />
                </div>
            </div>
        </div>
    );
}
