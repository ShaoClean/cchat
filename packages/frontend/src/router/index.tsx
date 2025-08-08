import { Login } from '@/pages/Login.tsx';
import ChatPage from '@/pages/ChatPage.tsx';

export default [
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/chat',
        element: <ChatPage />,
    }
];
