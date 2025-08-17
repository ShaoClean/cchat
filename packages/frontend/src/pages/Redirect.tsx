import { Spin } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const Redirect = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get('code');
    const type = searchParams.get('type');

    useEffect(() => {
        if (code && type) {
            console.log('Redirecting with code:', code, 'type:', type);
            // 重定向到登录页面，携带参数
            navigate(`/login?type=${type}&code=${code}`, { replace: true });
        } else {
            // 如果没有必要参数，重定向到登录页面
            navigate('/login', { replace: true });
        }
    }, [code, type, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Spin size="large" tip="正在重定向..." />
        </div>
    );
};
