import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { showMessage } from '@/utils/message'

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 添加认证 token（如果需要）
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 统一处理响应数据
    const { code, message, data } = response.data
    
    // 如果是业务错误，显示提示
    if (code !== 200 && code !== 0) {
      showMessage(message || '请求失败', 'error')
      return Promise.reject(new Error(message || '请求失败'))
    }
    
    return response
  },
  (error) => {
    // 处理网络错误
    let errorMessage = '网络请求失败'
    
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response
      switch (status) {
        case 400:
          errorMessage = data?.message || '请求参数错误'
          break
        case 401:
          errorMessage = data?.message || '未授权，请登录'
          // 可以在这里处理登录跳转
          break
        case 403:
          errorMessage = data?.message || '拒绝访问'
          break
        case 404:
          errorMessage = data?.message || '请求的资源不存在'
          break
        case 500:
          errorMessage = data?.message || '服务器内部错误'
          break
        default:
          errorMessage = data?.message || `请求失败：${status}`
      }
    } else if (error.request) {
      // 网络错误
      if (error.code === 'ECONNABORTED') {
        errorMessage = '请求超时，请检查网络连接'
      } else {
        errorMessage = '网络连接失败，请检查网络设置'
      }
    } else {
      // 其他错误
      errorMessage = error.message || errorMessage
    }
    
    showMessage(errorMessage, 'error')
    return Promise.reject(error)
  }
)

export default http

// 导出一些常用的方法
export const get = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return http.get<T>(url, config)
}

export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return http.post<T>(url, data, config)
}

export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return http.put<T>(url, data, config)
}

export const del = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return http.delete<T>(url, config)
}

export const patch = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return http.patch<T>(url, data, config)
}