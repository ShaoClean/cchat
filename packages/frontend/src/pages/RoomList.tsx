import { MessageCircle } from 'lucide-react';
import { RoomEntity } from '@/components/room-card';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomCard from '@/components/room-card';

export default function RoomPage() {
    const [rooms, setRooms] = useState<RoomEntity[] | []>([]);
    const navigate = useNavigate();
    const fetchRooms = async () => {
        const fetchRes = await fetch('http://localhost:3000/api/room/get_all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const rooms = await fetchRes.json();
        console.log(rooms);
        setRooms(rooms);
    };

    const onJoin = async (room: RoomEntity) => {
        console.log('join', room);
        navigate(`/chat?id=${room.uuid}`);
    };
    useEffect(() => {
        fetchRooms();
    }, []);
    return (
        <div className="flex h-full">
            <div className="flex items-center justify-center w-full">
                <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-medium text-gray-600 mb-2">欢迎使用聊天应用</h2>
                    <p className="text-gray-500">项目已初始化完成</p>
                </div>

                <RoomCard rooms={rooms} onJoin={onJoin} />
            </div>
        </div>
    );
}
