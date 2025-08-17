import { useRoutes } from 'react-router-dom';
import { useEffect } from 'react';
import setupAxiosInterceptors from './utils/axiosSetup';
import initializeApiAuth from './utils/apiAuthSetup';
import routes from '@/router';
import { Spin } from 'antd';
import { useAppSelector } from '@/store/hooks.ts';
import { LoadingOutlined } from '@ant-design/icons';

function App() {
    const { isLoading } = useAppSelector(state => state.auth);
    useEffect(() => {
        // 为直接使用axios的场景设置拦截器
        setupAxiosInterceptors();

        // 为swagger生成的API客户端设置认证管理
        initializeApiAuth();
    }, []);

    return (
        <>
            <Spin spinning={isLoading} fullscreen size={'large'} indicator={<LoadingOutlined />} />
            <div className="h-screen bg-secondary">{useRoutes(routes)}</div>
        </>
    );
}

export default App;
