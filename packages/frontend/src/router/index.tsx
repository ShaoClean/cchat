import { Login } from '@/pages/Login.tsx';
import Chat from '@/pages/Chat.tsx';
import RoomPage from '@/pages/RoomList.tsx';

export default [
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/room_list',
        element: <RoomPage />,
    },
    {
        path: '/chat',
        element: <Chat />,
    },
];
