import { useRoutes } from 'react-router-dom';
import { useEffect } from 'react';
import setupAxiosInterceptors from './utils/axiosSetup';
import initializeApiAuth from './utils/apiAuthSetup';
import routes from '@/router';

function App() {
    useEffect(() => {
        // 为直接使用axios的场景设置拦截器
        setupAxiosInterceptors();
        
        // 为swagger生成的API客户端设置认证管理
        initializeApiAuth();
    }, []);

    return <div className="h-screen bg-secondary">{useRoutes(routes)}</div>;
}

export default App;
