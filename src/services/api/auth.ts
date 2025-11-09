import { http } from './index';
import type { SocialWorkerLoginDTO, ResultLoginVO } from '@/types/api';

/**
 * 认证相关API服务
 */
export const authApi = {
  /**
   * 社工登录
   * @param loginData 登录参数
   * @returns 登录结果
   */
  login: async (loginData: SocialWorkerLoginDTO): Promise<any> => {
    const response = await http.post('/api/social-worker/login', loginData);
    console.log('登录结果:', response);
    return response; // 返回完整的响应对象
  },

  /**
   * 退出登录
   */
  logout: async (): Promise<void> => {
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    
    // 可以调用后端退出接口（如果有的话）
    // await http.post('/social-worker/logout');
  },

  /**
   * 刷新token（如果需要）
   */
  refreshToken: async (): Promise<any> => {
    const response = await http.post('/api/social-worker/refresh-token');
    return response; // 返回完整的响应对象
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async (): Promise<any> => {
    const response = await http.get('/api/social-worker/current');
    return response; // 返回完整的响应对象
  }
};