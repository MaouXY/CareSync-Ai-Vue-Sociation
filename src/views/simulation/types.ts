// AI模拟训练相关类型定义

export interface SimulationScenario {
  id: number;
  title: string; // 场景标题
  type: string; // 场景类型
  description: string;
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'; // 难度等级
  estimatedDuration: number; // 预计时长（分钟）
  metadata?: any; // 元数据
}

export interface TrainingSession {
  id: number;
  workerId: number;
  scenarioId: number;
  scenarioTitle?: string; // 场景标题
  sessionStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startTime: string;
  endTime?: string;
  totalRounds: number;
  overallScore?: number;
  duration?: number; // 训练时长（秒）
  messageCount?: number; // 消息数量
  createTime: string;
  updateTime: string;
}

export interface ChatMessage {
  id: string; // 消息唯一标识
  content: string; // 消息内容
  senderType: 'user' | 'ai'; // 发送者类型
  role: 'user' | 'ai'; // 角色
  timestamp: Date; // 时间戳
  isTyping?: boolean; // 是否正在输入
  isStreaming?: boolean; // 是否正在流式接收
  streamContent?: string; // 完整的流式内容
  emotionAnalysis?: string; // 情感分析（JSON字符串）
  aiGuidance?: string; // AI指导
}

export interface TrainingMessageRequest {
  sessionId: number;
  prompt: string;
  chatHistory: ChatMessage[];
}

export interface EmotionAnalysis {
  detected_emotions: Array<{
    emotion: string;
    confidence: number;
  }>;
  emotion_intensity: number;
}

export interface TrainingChatResponse {
  sessionId: number;
  childReply: string;
  emotionAnalysis: string; // JSON string
  aiGuidance: string;
  timestamp: string;
}

export interface TrainingEvaluation {
  id: number;
  sessionId: number;
  empathyScore: number; // 共情能力
  communicationScore: number; // 沟通技巧
  problemSolvingScore: number; // 问题解决能力
  emotionalRecognitionScore: number; // 情感识别能力
  strengths: string; // 优点
  areasForImprovement?: string; // 改进领域
  aiComprehensiveComment?: string; // AI综合评价
  createTime: string;
}

export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// 训练会话状态枚举
export enum SessionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// 难度等级枚举
export enum DifficultyLevel {
  BASIC = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3
}