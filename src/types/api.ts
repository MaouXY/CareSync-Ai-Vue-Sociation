// API接口相关类型定义

/* 登录相关类型定义 */
// 通用API响应格式
export interface ResultLoginVO {
  code: number;
  msg: string | null;
  data: LoginVO;
}

// API错误响应
export interface ApiError {
  code: number;
  message: string;
  timestamp?: string;
}

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

/* 社工首页相关类型定义 */
// 社工首页数据
export interface HomeStatisticsDTO {
  childCount: number;
  pendingTaskCount: number;
  completedSchemeCount: number;
  aiAnalysisCount: number;
}

// 待处理任务
export interface PendingTaskVO {
  id: number;
  childId: number;
  childName: string;
  target: string;
  endTime: string;
  remainingDays: number;
}

// 最近活动记录
export interface RecentActivityVO {
  id: number;
  schemeId: number;
  childId: number;
  childName: string;
  week: number;
  recordContent: string;
  createTime: string;
}

// 情感分析图表数据
export interface EmotionChartDataVO {
  data: number[];
  name: string;
  type: string;
}

// 情感分析雷达图数据
export interface RadarChartDataVO {
  [key: string]: number;
}

// 社工首页数据
export interface SocialWorkerHomeVO {
  statistics: HomeStatisticsDTO;
  emotionChartData: EmotionChartDataVO[];
  emotionChartTimeAxis: string[];
  radarChartData: RadarChartDataVO;
  pendingTasks: PendingTaskVO[];
  recentActivities: RecentActivityVO[];
}

// 社工首页API响应
export interface ResultSocialWorkerHomeVO {
  code: number;
  msg: string | null;
  data: SocialWorkerHomeVO;
}

/* 儿童管理相关类型定义 */
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

// 儿童队列VO
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

// 分页结果
export interface PageResultChildQueueVO {
  total: number;
  records: ChildQueueVO[];
}

// 儿童队列分页结果API响应
export interface ResultPageResultChildQueueVO {
  code: number;
  msg?: string;
  data: PageResultChildQueueVO;
}

// 儿童详情VO
export interface ChildInfoVO {
  id: number;
  childNo: string;
  serviceStatus: ServiceStatus;
  riskLevel: RiskLevel;
  name: string;
  age: number;
  gender: string;
  birthDate: string;
  idCard: string;
  address: string;
  notes: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  hasNewChat: boolean;
  aiStructInfo: AIData;
  aiAnalysisTime: string;
  createTime: string;
  updateTime: string;
}

// 儿童详情API响应
export interface ResultChildInfoVO {
  code: number;
  msg?: string;
  data: ChildInfoVO;
}

// 解析后的AI分析信息
export interface AIData {
  coreNeeds: string[];
  description: string;
  keyFindings: string[];
  emotion_trend: string[];
  emotionScores: {
    [key: string]: number;
  };
  emotionHistory: {
    date: string;
    scores: {
      [key: string]: number;
    };
  }[];
  latestAnalysis: string;
  recommendations: {
    title: string;
    priority: string;
    description: string;
  }[];
  potentialProblems?: string;
}

// 风险等级类型
export type RiskLevel = '低风险' | '中风险' | '高风险' | '紧急风险';

// 服务状态类型
export type ServiceStatus = '待服务' | '服务中' | '已完成' | '暂停服务';

// 情感历史记录项
export interface EmotionHistoryItem {
  date: string;
  scores: {
    [key: string]: number;
  };
}

// 服务建议
export interface Recommendation {
  title: string;
  description: string;
  priority: string;
}

// AI分析结果VO
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

// 分页结果
export interface PageResultAiAnalysisResultVO {
  total: number;
  records: AiAnalysisResultVO[];
}

// 分页结果API响应
export interface ResultPageResultAiAnalysisResultVO {
  code: number;
  msg?: string;
  data: PageResultAiAnalysisResultVO;
}

// AI分析结果详情API响应
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