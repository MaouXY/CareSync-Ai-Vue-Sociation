// API接口相关类型定义

// 登录请求参数
export interface SocialWorkerLoginDTO {
  workerNo?: string;
  password?: string;
}

// 登录响应数据
export interface LoginVO {
  id: number;
  name: string;
  token: string;
  role: number;
}

// 通用API响应格式
export interface ResultLoginVO {
  code: number;
  msg: string | null;
  data: LoginVO;
}

// 用户信息
export interface UserInfo {
  id: number;
  name: string;
  role: number;
  token: string;
}

// 登录状态
export interface LoginState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  loading: boolean;
}

// API错误响应
export interface ApiError {
  code: number;
  message: string;
  timestamp?: string;
}