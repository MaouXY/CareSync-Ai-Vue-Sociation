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

// 儿童管理相关类型定义
export interface ChildQueryDTO {
  childNo?: string;
  name?: string;
  gender?: string;
  riskLevel?: string;
  minAge?: number;
  maxAge?: number;
  hasNewChat?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ChildQueueVO {
  id: number;
  childNo: string;
  name: string;
  age: number;
  gender: string;
  riskLevel: string;
  serviceStatus: string;
  guardianName: string;
  guardianPhone: string;
  phone: string;
  address: string;
  hasNewChat: boolean;
  createTime: string;
  updateTime: string;
}

export interface PageResultChildQueueVO {
  total: number;
  records: ChildQueueVO[];
}

export interface ResultPageResultChildQueueVO {
  code: number;
  msg?: string;
  data: PageResultChildQueueVO;
}

export interface ChildInfoVO {
  id: number;
  childNo: string;
  name: string;
  age: number;
  hasNewChat: boolean;
  aiStructInfo: string; // JSON字符串
  aiAnalysisTime: string;
  createTime: string;
  updateTime: string;
}

export interface ResultChildInfoVO {
  code: number;
  msg?: string;
  data: ChildInfoVO;
}

// 解析后的AI分析信息
export interface AIData {
  core_needs: string[];
  description: string;
  key_findings: string[];
  emotion_trend: string[];
  emotion_scores: {
    [key: string]: number;
  };
  emotion_history: {
    date: string;
    scores: {
      [key: string]: number;
    };
  }[];
  latest_analysis: string;
  recommendations: {
    title: string;
    priority: string;
    description: string;
  }[];
  potential_problems?: string;
}

// 风险等级类型
export type RiskLevel = 'low' | 'medium' | 'high' | 'urgent';

// 服务状态类型
export type ServiceStatus = 'pending' | 'inProgress' | 'completed' | 'paused';

// AI分析结果相关类型定义
export interface EmotionHistoryItem {
  date: string;
  scores: {
    [key: string]: number;
  };
}

export interface Recommendation {
  title: string;
  description: string;
  priority: string;
}

export interface AiAnalysisResultVO {
  id: number;
  childId: number;
  sessionIds: string[];
  analysisResult: any;
  triggerType: string;
  createTime: string;
  updateTime: string;
  childName: string;
  emotionTrendTags: string[];
  potentialProblems: string;
  description: string;
  latestAnalysis: string;
  emotionScores: {
    [key: string]: number;
  };
  emotionHistory: EmotionHistoryItem[];
  keyFindings: string[];
  recommendations: Recommendation[];
  aiStructInfo: any;
}

export interface PageResultAiAnalysisResultVO {
  total: number;
  records: AiAnalysisResultVO[];
}

export interface ResultPageResultAiAnalysisResultVO {
  code: number;
  msg?: string;
  data: PageResultAiAnalysisResultVO;
}

export interface ResultAiAnalysisResultVO {
  code: number;
  msg?: string;
  data: AiAnalysisResultVO;
}

// AI分析结果查询参数
export interface AiAnalysisQueryDTO {
  name?: string;
  potentialProblems?: string;
  emotionTrend?: string;
  page?: number;
  pageSize?: number;
}

/* 服务方案相关类 */
// 服务措施建议详情
export interface MeasuresSuggestDetails {
  content: string;
  status: string;
  assist_track_log_id: number;
}

// 服务措施建议
export interface MeasuresSuggest {
  week: string;
  details: MeasuresSuggestDetails[];
}

// 服务方案状态枚举
export type SchemeStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';

// 服务方案列表查询参数
export interface SchemeQueryDTO {
  childId?: number | null;
  workerId?: number | null;
  target?: string | null;
  schemeStatus?: string | null;
  name?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  page?: number;
  pageSize?: number;
}

// 服务方案详情
export interface AssistSchemeVO {
  id: number;
  childId: number;
  workerId: number;
  target: string;
  measures: string[];
  cycle: number;
  schemeStatus: string;
  targetSuggest: string[];
  measuresSuggest: MeasuresSuggest[];
  workerAdjustReason?: string;
  aiAnalysisId?: number;
  evaluationIndex?: any;
  createTime: string;
  updateTime: string;
  childName: string;
  childAge: string;
  workerName: string;
}

// 分页结果
export interface PageResultAssistSchemeVO {
  total: number;
  records: AssistSchemeVO[];
}

// API响应结果
export interface ResultPageResultAssistSchemeVO {
  code: number;
  msg: string;
  data: PageResultAssistSchemeVO;
}