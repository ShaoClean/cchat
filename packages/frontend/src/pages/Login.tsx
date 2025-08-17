import { LockOutlined, MobileOutlined, TaobaoOutlined, UserOutlined, WeiboOutlined } from '@ant-design/icons';
import { LoginFormPage, ProConfigProvider, ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { Button, Divider, Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginStart, loginSuccess, loginFailure, loginEnd } from '../store/authSlice';
import authApi from 'apis/Auth.ts';
import thirdPartApi from 'apis/ThirdPart.ts';
import { GithubIcon } from 'lucide-react';
import axios from 'axios';
type LoginType = 'register' | 'login';

const iconStyles: CSSProperties = {
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '18px',
    verticalAlign: 'middle',
    cursor: 'pointer',
};
const GITHUB_REDIRECT_URL = 'http://localhost:3001/third-part/github/login_redirect';
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_LOGIN_URL = `${GITHUB_AUTH_URL}?client_id=Ov23li3EHy3oIzPNBHIa&redirect_uri=${GITHUB_REDIRECT_URL}`;

const Page = () => {
    const [loginType, setLoginType] = useState<LoginType>('register');
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const [searchParams] = useSearchParams();
    const thirdLoginType = searchParams.get('type');

    const handleGithubAuth = async () => {
        dispatch(loginStart());
        const loginCode = searchParams.get('code');
        if (loginCode) {
            try {
                const res = await thirdPartApi.fetchGithubToken({ code: loginCode });
                const token = res.data.access_token;
                // 如果成功获取token，可以在这里处理后续登录逻辑
                if (token) {
                    const gitHubRes = (
                        await axios({
                            method: 'get',
                            url: 'https://api.github.com/user',
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            data: {
                                access_token: token,
                            },
                        })
                    ).data;
                    // 根据github token 查询后端数据库 该用户是否注册过
                    const queryRes = await thirdPartApi.queryUser({ correlationId: gitHubRes.id });
                    if (!queryRes.data) {
                        const registerRes = await authApi.register({
                            username: gitHubRes.name,
                            password: new Date().getTime().toString(),
                        });

                        if (registerRes.data.access_token) {
                            await thirdPartApi.createUser({
                                user_uuid: registerRes.data.user.uuid,
                                correlationId: gitHubRes.id,
                            });
                            dispatch(
                                loginSuccess({
                                    user: registerRes.data.user,
                                    token: registerRes.data.access_token,
                                }),
                            );
                            message.success('登录成功！');
                            navigate('room_list');
                        }
                    } else {
                        const res = await thirdPartApi.loginWithGithub({
                            correlationId: gitHubRes.id,
                        });
                        dispatch(
                            loginSuccess({
                                user: res.data.user,
                                token: res.data.access_token,
                            }),
                        );
                    }
                }
            } catch (error: any) {
                dispatch(loginFailure());
                // 超出github登录限制  60min / 60次
                if (error && error.response && error.response.data && error.response.data.message) {
                    message.error(error.response.data.message);
                    return;
                }
                console.log('登录失败:', error);
            } finally {
                dispatch(loginEnd());
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/room_list');
        } else if (thirdLoginType === 'github') {
            handleGithubAuth();
        }
    }, [isAuthenticated, navigate, thirdLoginType]);

    return (
        <div
            style={{
                backgroundColor: 'white',
                height: '100vh',
            }}
        >
            <LoginFormPage
                backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
                logo="https://github.githubassets.com/favicons/favicon.png"
                backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
                title="Github"
                containerStyle={{
                    backgroundColor: 'rgba(0, 0, 0,0.65)',
                    backdropFilter: 'blur(4px)',
                }}
                onFinish={async formData => {
                    if (loginType === 'register') {
                        try {
                            const data = await authApi.register({
                                username: formData.username,
                                password: formData.password,
                            });
                            console.log(data);
                            message.success('注册成功！');
                            setLoginType('login');
                        } catch (error) {
                            message.error('注册失败，请重试！');
                        }
                    } else {
                        try {
                            dispatch(loginStart());
                            const loginRes = await authApi.login({
                                username: formData.username,
                                password: formData.password,
                            });
                            if (loginRes.data.access_token) {
                                dispatch(
                                    loginSuccess({
                                        user: loginRes.data.user,
                                        token: loginRes.data.access_token,
                                    }),
                                );
                                message.success('登录成功！');
                            }
                        } catch (error) {
                            dispatch(loginFailure());
                            message.error('登录失败，请检查用户名和密码！');
                        }
                    }
                }}
                subTitle="全球最大的代码托管平台"
                activityConfig={{
                    style: {
                        boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
                        color: token.colorTextHeading,
                        borderRadius: 8,
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(4px)',
                    },
                    title: '活动标题，可配置图片',
                    subTitle: '活动介绍说明文字',
                    action: (
                        <Button
                            size="large"
                            style={{
                                borderRadius: 20,
                                background: token.colorBgElevated,
                                color: token.colorPrimary,
                                width: 120,
                            }}
                        >
                            去看看
                        </Button>
                    ),
                }}
                actions={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Divider plain>
                            <span
                                style={{
                                    color: token.colorTextPlaceholder,
                                    fontWeight: 'normal',
                                    fontSize: 14,
                                }}
                            >
                                其他登录方式
                            </span>
                        </Divider>
                        <Space align="center" size={24}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: 40,
                                    width: 40,
                                    border: '1px solid ' + token.colorPrimaryBorder,
                                    borderRadius: '50%',
                                }}
                            >
                                <a href={GITHUB_LOGIN_URL}>
                                    <GithubIcon style={{ ...iconStyles, color: '#1677FF' }} />
                                </a>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: 40,
                                    width: 40,
                                    border: '1px solid ' + token.colorPrimaryBorder,
                                    borderRadius: '50%',
                                }}
                            >
                                <TaobaoOutlined style={{ ...iconStyles, color: '#FF6A10' }} />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: 40,
                                    width: 40,
                                    border: '1px solid ' + token.colorPrimaryBorder,
                                    borderRadius: '50%',
                                }}
                            >
                                <WeiboOutlined style={{ ...iconStyles, color: '#1890ff' }} />
                            </div>
                        </Space>
                    </div>
                }
            >
                <Tabs centered activeKey={loginType} onChange={activeKey => setLoginType(activeKey as LoginType)}>
                    <Tabs.TabPane key={'register'} tab={'注册'} />
                    <Tabs.TabPane key={'login'} tab={'登录'} />
                </Tabs>

                {loginType === 'login' && (
                    <>
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <UserOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            placeholder={'用户名: admin or user'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <LockOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            placeholder={'密码: ant.design'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                        />
                    </>
                )}
                {loginType === 'register' && (
                    <>
                        <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <MobileOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            name="username"
                            placeholder={'用户账号'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入账号！',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <LockOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            placeholder={'密码: ant.design'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                        />
                        <ProFormCaptcha
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <LockOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            captchaProps={{
                                size: 'large',
                            }}
                            placeholder={'请输入验证码'}
                            captchaTextRender={(timing, count) => {
                                if (timing) {
                                    return `${count} ${'获取验证码'}`;
                                }
                                return '获取验证码';
                            }}
                            name="captcha"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入验证码！',
                                },
                            ]}
                            onGetCaptcha={async () => {
                                message.success('获取验证码成功！验证码为：1234');
                            }}
                        />
                    </>
                )}

                <div
                    style={{
                        marginBlockEnd: 24,
                    }}
                >
                    <ProFormCheckbox noStyle name="autoLogin">
                        自动登录
                    </ProFormCheckbox>
                    <a
                        style={{
                            float: 'right',
                        }}
                    >
                        忘记密码
                    </a>
                </div>
            </LoginFormPage>
        </div>
    );
};

export const Login = () => {
    return (
        <ProConfigProvider dark>
            <Page />
        </ProConfigProvider>
    );
};
