// AI分析模拟数据服务

// 分析记录接口
export interface AnalysisRecord {
  id: string;
  childId: string;
  childName: string;
  analysisType: 'emotion' | 'behavior' | 'academic' | 'comprehensive';
  emotionScore: number;
  keyFindings: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  analysisDate: string;
  confidence: number;
  details?: {
    [key: string]: any;
  };
  createTime: string;
}

// 情感趋势数据接口
export interface EmotionTrendData {
  date: string;
  score: number;
}

// 关键词云接口
export interface KeywordCloud {
  text: string;
  value: number;
}

// 风险评估接口
export interface RiskAssessment {
  riskType: string;
  score: number;
  description: string;
  suggestions: string[];
}

// 模拟分析记录数据
const mockAnalysisRecords: AnalysisRecord[] = [
  {
    id: '1',
    childId: '1',
    childName: '张明',
    analysisType: 'comprehensive',
    emotionScore: 85,
    keyFindings: [
      '整体情绪状态良好，积极向上',
      '学习热情高涨，对数学特别感兴趣',
      '社交能力较强，能与同伴和谐相处',
      '需要关注的是户外活动时间略显不足'
    ],
    recommendations: [
      '继续保持良好的学习态度和社交行为',
      '适当增加户外活动时间，促进身心健康发展',
      '可以提供更多数学相关的挑战和资源',
      '建议家长多关注孩子的兴趣发展'
    ],
    riskLevel: 'low',
    analysisDate: '2024-01-15',
    confidence: 0.92,
    details: {
      subScores: {
        happiness: 88,
        enthusiasm: 90,
        calmness: 82,
        sadness: 15,
        anger: 10
      },
      activityDistribution: {
        study: 40,
        play: 30,
        social: 20,
        rest: 10
      }
    },
    createTime: '2024-01-15 14:30:00'
  },
  {
    id: '2',
    childId: '2',
    childName: '李华',
    analysisType: 'emotion',
    emotionScore: 65,
    keyFindings: [
      '情绪较为稳定但略显低落',
      '在陌生环境中表现出一定的焦虑',
      '喜欢独处，社交互动较少',
      '通过绘画表达情绪的倾向明显'
    ],
    recommendations: [
      '鼓励参与集体活动，逐步提升社交能力',
      '通过绘画等艺术形式进行情绪疏导',
      '建立规律的生活作息，提供安全感',
      '建议家长多与孩子进行情感交流'
    ],
    riskLevel: 'medium',
    analysisDate: '2024-01-14',
    confidence: 0.88,
    details: {
      subScores: {
        happiness: 60,
        enthusiasm: 55,
        calmness: 70,
        sadness: 35,
        anger: 20
      },
      triggers: ['陌生人接触', '学习压力', '家庭话题']
    },
    createTime: '2024-01-14 09:15:00'
  },
  {
    id: '3',
    childId: '3',
    childName: '王强',
    analysisType: 'comprehensive',
    emotionScore: 45,
    keyFindings: [
      '情绪持续低落，表现出明显的抑郁倾向',
      '学习兴趣下降，注意力难以集中',
      '睡眠质量差，经常失眠或早醒',
      '对社交活动完全回避，喜欢独处'
    ],
    recommendations: [
      '建议专业心理咨询介入',
      '家长应给予更多关注和情感支持',
      '调整学习任务难度，减轻压力',
      '建立规律的作息时间表，改善睡眠'
    ],
    riskLevel: 'high',
    analysisDate: '2024-01-13',
    confidence: 0.94,
    details: {
      subScores: {
        happiness: 30,
        enthusiasm: 25,
        calmness: 40,
        sadness: 70,
        anger: 55
      },
      warningSigns: [
        '持续的情绪低落超过两周',
        '对以往感兴趣的事情失去兴趣',
        '睡眠和食欲明显改变',
        '社交退缩'
      ]
    },
    createTime: '2024-01-13 16:45:00'
  },
  {
    id: '4',
    childId: '4',
    childName: '陈静',
    analysisType: 'academic',
    emotionScore: 88,
    keyFindings: [
      '学习能力强，记忆力和理解力出色',
      '自主学习能力强，有良好的学习习惯',
      '阅读兴趣浓厚，知识面广泛',
      '在创造性思维方面有一定发展空间'
    ],
    recommendations: [
      '提供更具挑战性的学习材料',
      '鼓励参与阅读分享和写作活动',
      '适当培养创造性思维和实践能力',
      '建议家长关注孩子的全面发展'
    ],
    riskLevel: 'low',
    analysisDate: '2024-01-15',
    confidence: 0.90,
    details: {
      subjectScores: {
        chinese: 95,
        math: 90,
        english: 92,
        science: 88,
        art: 85
      },
      learningStyles: ['visual', 'reading/writing']
    },
    createTime: '2024-01-15 11:20:00'
  },
  {
    id: '5',
    childId: '5',
    childName: '赵伟',
    analysisType: 'behavior',
    emotionScore: 75,
    keyFindings: [
      '精力充沛，活动量大，喜欢体育运动',
      '注意力持续时间较短，容易分心',
      '情绪表达直接，有时略显冲动',
      '团队协作意识有待提高'
    ],
    recommendations: [
      '通过体育活动释放能量，培养规则意识',
      '进行注意力训练，逐步延长专注时间',
      '引导学习情绪管理和表达方式',
      '鼓励参与团队运动，提升协作能力'
    ],
    riskLevel: 'low',
    analysisDate: '2024-01-14',
    confidence: 0.85,
    details: {
      behaviorPatterns: {
        activityLevel: 'high',
        attentionSpan: 'short',
        emotionalExpression: 'direct',
        socialSkills: 'developing'
      },
      strengths: ['physical coordination', 'curiosity', 'quick thinking'],
      challenges: ['impulse control', 'sustained attention']
    },
    createTime: '2024-01-14 15:30:00'
  }
];

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成情感趋势数据
const generateEmotionTrendData = (childId: string): EmotionTrendData[] => {
  const data: EmotionTrendData[] = [];
  const today = new Date();
  const baseScore = mockAnalysisRecords.find(r => r.childId === childId)?.emotionScore || 70;
  
  // 生成过去30天的数据
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // 添加一些随机波动
    const randomOffset = (Math.random() - 0.5) * 20;
    let score = baseScore + randomOffset;
    
    // 确保分数在0-100范围内
    score = Math.max(0, Math.min(100, score));
    
    data.push({
      date: date.toISOString().split('T')[0],
      score: Math.round(score)
    });
  }
  
  return data;
};

// 生成关键词云数据
const generateKeywordCloud = (analysisType: string): KeywordCloud[] => {
  const keywordMap: Record<string, number> = {};
  
  mockAnalysisRecords
    .filter(r => r.analysisType === analysisType || analysisType === 'all')
    .forEach(record => {
      [...record.keyFindings, ...record.recommendations].forEach(text => {
        // 简单分词（实际应用中应使用更复杂的分词算法）
        const words = text
          .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ')
          .split(' ')
          .filter(w => w.length > 1);
        
        words.forEach(word => {
          keywordMap[word] = (keywordMap[word] || 0) + 1;
        });
      });
    });
  
  // 转换为所需格式并排序
  return Object.entries(keywordMap)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);
};

// 生成风险评估数据
const generateRiskAssessments = (childId: string): RiskAssessment[] => {
  const childAnalysis = mockAnalysisRecords.find(r => r.childId === childId);
  if (!childAnalysis) return [];
  
  const assessments: RiskAssessment[] = [];
  
  // 基于情绪分数生成风险评估
  if (childAnalysis.emotionScore < 60) {
    assessments.push({
      riskType: '情绪健康风险',
      score: 100 - childAnalysis.emotionScore,
      description: '儿童情绪状态较低落，可能存在心理健康风险',
      suggestions: [
        '建议进行专业心理咨询',
        '增加与儿童的情感交流时间',
        '创造积极向上的生活环境',
        '关注儿童的兴趣爱好，提供支持'
      ]
    });
  }
  
  // 基于分析类型和发现生成不同的风险评估
  if (childAnalysis.analysisType === 'academic' || childAnalysis.analysisType === 'comprehensive') {
    assessments.push({
      riskType: '学习发展风险',
      score: Math.random() * 40 + 20, // 20-60之间的随机分数
      description: '学习表现和发展需要持续关注和支持',
      suggestions: [
        '定期跟踪学习进度',
        '根据学习风格调整教育方法',
        '培养良好的学习习惯',
        '提供适当的学习资源和指导'
      ]
    });
  }
  
  if (childAnalysis.analysisType === 'behavior' || childAnalysis.analysisType === 'comprehensive') {
    assessments.push({
      riskType: '行为发展风险',
      score: Math.random() * 30 + 10, // 10-40之间的随机分数
      description: '行为模式需要正确引导和培养',
      suggestions: [
        '建立明确的行为规范',
        '采用正面激励的教育方式',
        '培养自我控制能力',
        '提供适当的社交技能训练'
      ]
    });
  }
  
  return assessments;
};

// AI分析服务类
export class AnalysisService {
  // 获取分析记录列表
  async getAnalysisRecords(params?: {
    page?: number;
    pageSize?: number;
    childId?: string;
    analysisType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ list: AnalysisRecord[]; total: number; page: number; pageSize: number }> {
    await delay(300);
    
    let filtered = [...mockAnalysisRecords];
    
    // 筛选条件
    if (params?.childId) {
      filtered = filtered.filter(record => record.childId === params.childId);
    }
    
    if (params?.analysisType && params.analysisType !== 'all') {
      filtered = filtered.filter(record => record.analysisType === params.analysisType);
    }
    
    if (params?.startDate) {
      filtered = filtered.filter(record => record.analysisDate >= params.startDate);
    }
    
    if (params?.endDate) {
      filtered = filtered.filter(record => record.analysisDate <= params.endDate);
    }
    
    // 按分析日期降序排序
    filtered.sort((a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime());
    
    // 分页
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedList = filtered.slice(start, end);
    
    return {
      list: paginatedList,
      total: filtered.length,
      page,
      pageSize
    };
  }
  
  // 获取单个分析记录
  async getAnalysisRecordById(id: string): Promise<AnalysisRecord | null> {
    await delay(200);
    const record = mockAnalysisRecords.find(record => record.id === id);
    return record || null;
  }
  
  // 获取情感趋势数据
  async getEmotionTrend(childId: string): Promise<EmotionTrendData[]> {
    await delay(300);
    return generateEmotionTrendData(childId);
  }
  
  // 获取关键词云数据
  async getKeywordCloud(analysisType: string): Promise<KeywordCloud[]> {
    await delay(200);
    return generateKeywordCloud(analysisType);
  }
  
  // 获取风险评估
  async getRiskAssessments(childId: string): Promise<RiskAssessment[]> {
    await delay(200);
    return generateRiskAssessments(childId);
  }
  
  // 创建新的分析记录
  async createAnalysis(analysis: Omit<AnalysisRecord, 'id' | 'createTime'>): Promise<AnalysisRecord> {
    await delay(800); // 模拟AI分析耗时
    
    const newAnalysis: AnalysisRecord = {
      ...analysis,
      id: Date.now().toString(),
      createTime: new Date().toISOString()
    };
    
    mockAnalysisRecords.unshift(newAnalysis);
    return newAnalysis;
  }
  
  // 获取统计数据
  async getStatistics(): Promise<{
    totalRecords: number;
    averageScore: number;
    riskDistribution: { low: number; medium: number; high: number };
    recentAnalysisCount: number;
  }> {
    await delay(200);
    
    const totalRecords = mockAnalysisRecords.length;
    const averageScore = Math.round(
      mockAnalysisRecords.reduce((sum, record) => sum + record.emotionScore, 0) / totalRecords
    );
    
    const riskDistribution = {
      low: mockAnalysisRecords.filter(record => record.riskLevel === 'low').length,
      medium: mockAnalysisRecords.filter(record => record.riskLevel === 'medium').length,
      high: mockAnalysisRecords.filter(record => record.riskLevel === 'high').length
    };
    
    // 计算最近7天的分析记录数
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentAnalysisCount = mockAnalysisRecords.filter(
      record => new Date(record.analysisDate) >= sevenDaysAgo
    ).length;
    
    return {
      totalRecords,
      averageScore,
      riskDistribution,
      recentAnalysisCount
    };
  }
}

// 导出服务实例
export const analysisService = new AnalysisService();