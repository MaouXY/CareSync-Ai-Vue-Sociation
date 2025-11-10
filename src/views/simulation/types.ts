// AI模拟训练相关类型定义

export interface SimulationScenario {
  id: number;
  scenarioName: string;
  scenarioType: string;
  description: string;
  difficultyLevel: 1 | 2 | 3; // 1-基础，2-进阶，3-挑战
}

export interface TrainingSession {
  id: number;
  workerId: number;
  scenarioId: number;
  sessionStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startTime: string;
  endTime?: string;
  totalRounds: number;
  overallScore?: number;
  createTime: string;
  updateTime: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface TrainingMessageRequest {
  sessionId: number;
  prompt: string;
  history: ChatMessage[];
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