import { store } from '../store';
import { logout } from '../store/authSlice';
import { GlobalAuthManager } from 'apis/http-client';

/**
 * 初始化API认证管理器
 * 将Redux store与swagger生成的API客户端集成
 */
export const initializeApiAuth = () => {
  // 监听store中的token变化，同步到GlobalAuthManager
  let currentToken = store.getState().auth.token;
  
  // 初始设置token
  GlobalAuthManager.setToken(currentToken);
  
  // 订阅store变化
  store.subscribe(() => {
    const newToken = store.getState().auth.token;
    if (newToken !== currentToken) {
      currentToken = newToken;
      GlobalAuthManager.setToken(newToken);
    }
  });
  
  // 设置token过期处理回调
  GlobalAuthManager.setOnTokenExpired(() => {
    store.dispatch(logout());
    // 跳转到登录页面
    window.location.href = '/login';
  });
};

export default initializeApiAuth;