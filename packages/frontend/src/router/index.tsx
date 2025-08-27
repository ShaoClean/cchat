import { Login } from '@/pages/Login.tsx';
import ChatRoom from '@/pages/ChatRoom.tsx';
import RoomPage from '@/pages/RoomList.tsx';
import { ProtectedRoute } from '@/components/ProtectedRoute.tsx';
import { Navigate } from 'react-router-dom';
import { Redirect } from '@/pages/Redirect.tsx';

export default [
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
    {
        path: '/redirect',
        element: <Redirect />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/room_list',
        element: (
            <ProtectedRoute>
                <RoomPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/room',
        element: (
            <ProtectedRoute>
                <ChatRoom />
            </ProtectedRoute>
        ),
    },
];
