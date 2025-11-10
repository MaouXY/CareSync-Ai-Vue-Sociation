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

// 社工首页相关类型定义
export interface HomeStatisticsDTO {
  childCount: number;
  pendingTaskCount: number;
  completedSchemeCount: number;
  aiAnalysisCount: number;
}

export interface PendingTaskVO {
  id: number;
  childId: number;
  childName: string;
  target: string;
  endTime: string;
  remainingDays: number;
}

export interface RecentActivityVO {
  id: number;
  schemeId: number;
  childId: number;
  childName: string;
  week: number;
  recordContent: string;
  createTime: string;
}

export interface EmotionChartDataVO {
  data: number[];
  name: string;
  type: string;
}

export interface RadarChartDataVO {
  [key: string]: number;
}

export interface SocialWorkerHomeVO {
  statistics: HomeStatisticsDTO;
  emotionChartData: EmotionChartDataVO[];
  emotionChartTimeAxis: string[];
  radarChartData: RadarChartDataVO;
  pendingTasks: PendingTaskVO[];
  recentActivities: RecentActivityVO[];
}

export interface ResultSocialWorkerHomeVO {
  code: number;
  msg: string | null;
  data: SocialWorkerHomeVO;
}