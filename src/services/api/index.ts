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
    timeout: 10000, // 默认10秒超时
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 从localStorage获取token（使用统一的名称'token'）
      const token = localStorage.getItem('token');
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
      
      // 统一处理后端响应格式
      const result = response.data;
      
      // 如果后端返回统一格式 {code, msg, data}，则根据code判断成功/失败
      if (result && typeof result === 'object' && 'code' in result) {
        if (result.code === 1) {
          // 成功，返回数据部分
          return result.data;
        } else {
          // 失败，抛出统一错误格式
          return Promise.reject({
            code: result.code,
            message: result.msg || '请求失败',
            timestamp: new Date().toISOString(),
          } as ApiError);
        }
      }
      
      // 如果不是统一格式（如文件流等），直接返回原始数据
      return result;
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

// 创建AI专用的axios实例（更长超时时间）
const createAIHttpInstance = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 120000, // AI请求专用2分钟超时
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 从localStorage获取token（使用统一的名称'token'）
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `${token}`;
      }
      
      // 添加时间戳防止缓存
      if (config.method === 'get' && config.params) {
        config.params._t = Date.now();
      }
      
      console.log('AI请求:', config.url, '超时时间:', config.timeout);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      console.log('AI响应:', response.data);
      
      // 统一处理后端响应格式
      const result = response.data;
      
      // 如果后端返回统一格式 {code, msg, data}，则根据code判断成功/失败
      if (result && typeof result === 'object' && 'code' in result) {
        if (result.code === 1) {
          // 成功，返回数据部分
          return result.data;
        } else {
          // 失败，抛出统一错误格式
          return Promise.reject({
            code: result.code,
            message: result.msg || 'AI请求失败',
            timestamp: new Date().toISOString(),
          } as ApiError);
        }
      }
      
      // 如果不是统一格式（如文件流等），直接返回原始数据
      return result;
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
            console.error('AI请求权限不足');
            break;
          case 500:
            console.error('AI服务服务器内部错误');
            break;
          default:
            console.error('AI请求错误:', data?.message || error.message);
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
          message: 'AI服务网络连接失败，请检查网络设置',
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

  console.log('创建AI专用axios实例，超时时间120秒');
  return instance;
};

// 创建axios实例
export const http = createAxiosInstance();

// 创建AI专用axios实例（更长超时时间）
export const aiHttp = createAIHttpInstance();