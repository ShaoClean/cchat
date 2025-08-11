import { Login } from '@/pages/Login.tsx';
import Chat from '@/pages/Chat.tsx';
import RoomPage from '@/pages/RoomList.tsx';
import { ProtectedRoute } from '@/components/ProtectedRoute.tsx';
import { Navigate } from 'react-router-dom';

export default [
    {
        path: '/',
        element: <Navigate to="/login" replace />,
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
        path: '/chat',
        element: (
            <ProtectedRoute>
                <Chat />
            </ProtectedRoute>
        ),
    },
];
