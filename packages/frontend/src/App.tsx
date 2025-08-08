import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import ChatDemoPage from '@/pages/ChatDemoPage.tsx';
import { Login } from '@/pages/Login.tsx';

function App() {
    return (
        <Router>
            <div className="h-screen bg-secondary">
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
