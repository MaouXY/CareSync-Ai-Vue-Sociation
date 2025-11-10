import axios from 'axios';
import type { ResultLoginVO, ApiError } from '@/types/api';

// axios 1.x 版本的类型定义
type AxiosInstance = typeof axios;
type AxiosRequestConfig = any;
type AxiosResponse = any;

// 创建axios实例
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 从localStorage获取token
      const token = localStorage.getItem('token');
      console.log('请求头:', token);
      if (token && config.headers) {
        config.headers.Authorization = `${token}`;
      }
      
      // 添加时间戳防止缓存
      if (config.method === 'get' && config.params) {
        config.params._t = Date.now();
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      console.log('响应拦截器:', response.data);
      return response.data;
    },
    (error) => {
      // 处理HTTP错误
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            // Token过期或无效，清除本地存储并跳转到登录页
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
            break;
          case 403:
            console.error('权限不足');
            break;
          case 500:
            console.error('服务器内部错误');
            break;
          default:
            console.error('请求错误:', data?.message || error.message);
        }
        
        // 返回统一的错误格式
        return Promise.reject({
          code: status,
          message: data?.message || error.message,
          timestamp: new Date().toISOString(),
        } as ApiError);
      } else if (error.request) {
        // 网络错误
        return Promise.reject({
          code: -1,
          message: '网络连接失败，请检查网络设置',
          timestamp: new Date().toISOString(),
        } as ApiError);
      } else {
        // 其他错误
        return Promise.reject({
          code: -2,
          message: error.message,
          timestamp: new Date().toISOString(),
        } as ApiError);
      }
    }
  );

  console.log('创建axios实例:', instance);
  return instance;
};

// 创建axios实例
export const http = createAxiosInstance();