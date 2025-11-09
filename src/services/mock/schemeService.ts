// 服务方案模拟数据服务

// 服务方案接口
export interface ServiceScheme {
  id: string;
  title: string;
  description: string;
  childId: string;
  childName: string;
  childAge: number;
  category: 'emotional' | 'academic' | 'behavioral' | 'social' | 'comprehensive';
  status: 'draft' | 'active' | 'completed' | 'paused';
  startTime?: string;
  endTime?: string;
  targetGoals: string[];
  interventions: Intervention[];
  progress: number;
  evaluation?: {
    overallScore: number;
    strengths: string[];
    areasForImprovement: string[];
    conclusion: string;
  };
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  createTime: string;
  updateTime: string;
  lastReviewTime?: string;
}

// 干预措施接口
export interface Intervention {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  duration: string; // 例如: '30分钟', '1小时'
  responsiblePerson: string;
  resourcesNeeded: string[];
  startDate?: string;
  endDate?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  completionRate: number;
  notes?: string[];
}

// 方案执行日志接口
export interface SchemeExecutionLog {
  id: string;
  schemeId: string;
  interventionId: string;
 执行人: string;
  executionDate: string;
  content: string;
  progress: number;
  attachments?: Attachment[];
  createTime: string;
}

// 附件接口
export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

// 模拟干预措施数据
const generateMockInterventions = (): Intervention[] => {
  return [
    {
      id: `intervention-${Date.now()}-1`,
      name: '情绪疏导会话',
      description: '通过一对一交流，帮助儿童表达和管理情绪',
      frequency: 'weekly',
      duration: '45分钟',
      responsiblePerson: '李社工',
      resourcesNeeded: ['情绪卡片', '绘画工具', '舒适的交流环境'],
      status: 'not_started',
      completionRate: 0
    },
    {
      id: `intervention-${Date.now()}-2`,
      name: '社交技能训练',
      description: '通过小组活动培养社交能力和团队协作意识',
      frequency: 'biweekly',
      duration: '60分钟',
      responsiblePerson: '王社工',
      resourcesNeeded: ['活动道具', '小组活动场地', '评估表格'],
      status: 'not_started',
      completionRate: 0
    },
    {
      id: `intervention-${Date.now()}-3`,
      name: '学习辅导',
      description: '针对学习难点提供个性化辅导和学习方法指导',
      frequency: 'weekly',
      duration: '60分钟',
      responsiblePerson: '张老师',
      resourcesNeeded: ['教材', '练习资料', '学习工具'],
      status: 'not_started',
      completionRate: 0
    }
  ];
};

// 模拟服务方案数据
const mockServiceSchemes: ServiceScheme[] = [
  {
    id: '1',
    title: '张明情感陪伴计划',
    description: '针对张明活泼开朗的性格特点，制定的综合性情感陪伴和能力提升方案',
    childId: '1',
    childName: '张明',
    childAge: 8,
    category: 'comprehensive',
    status: 'active',
    startTime: '2024-01-01',
    targetGoals: [
      '保持积极乐观的情绪状态',
      '提升数学学习能力和兴趣',
      '培养良好的社交礼仪和合作精神',
      '增加户外活动时间，促进身心健康'
    ],
    interventions: [
      {
        id: '1-1',
        name: '数学思维拓展',
        description: '通过趣味数学游戏和问题解决，培养逻辑思维能力',
        frequency: 'weekly',
        duration: '45分钟',
        responsiblePerson: '张老师',
        resourcesNeeded: ['数学游戏道具', '趣味数学题集'],
        startDate: '2024-01-02',
        status: 'in_progress',
        completionRate: 60,
        notes: ['参与度高，对挑战问题表现出浓厚兴趣']
      },
      {
        id: '1-2',
        name: '户外体育活动',
        description: '每周安排两次户外体育活动，增强体质和团队意识',
        frequency: 'weekly',
        duration: '90分钟',
        responsiblePerson: '李教练',
        resourcesNeeded: ['运动器材', '安全防护装备'],
        startDate: '2024-01-03',
        status: 'in_progress',
        completionRate: 75
      },
      {
        id: '1-3',
        name: '情绪管理训练',
        description: '学习识别和表达情绪，掌握基本的情绪调节方法',
        frequency: 'biweekly',
        duration: '45分钟',
        responsiblePerson: '王社工',
        resourcesNeeded: ['情绪卡片', '绘本故事'],
        startDate: '2024-01-05',
        status: 'in_progress',
        completionRate: 50
      }
    ],
    progress: 62,
    createdBy: {
      id: 'staff-001',
      name: '李社工',
      role: '儿童社工'
    },
    createTime: '2023-12-28 09:00:00',
    updateTime: '2024-01-15 10:30:00',
    lastReviewTime: '2024-01-10 16:00:00'
  },
  {
    id: '2',
    title: '李华内向性格改善方案',
    description: '针对李华内向性格特点，制定的社交能力提升和情绪疏导方案',
    childId: '2',
    childName: '李华',
    childAge: 10,
    category: 'social',
    status: 'active',
    startTime: '2024-01-02',
    targetGoals: [
      '提升社交自信和沟通能力',
      '通过绘画疗法促进情绪表达',
      '逐步适应集体活动和陌生环境',
      '建立健康的情绪表达方式'
    ],
    interventions: [
      {
        id: '2-1',
        name: '绘画疗法',
        description: '通过绘画创作表达内心感受，促进情绪宣泄和自我认知',
        frequency: 'weekly',
        duration: '60分钟',
        responsiblePerson: '陈老师',
        resourcesNeeded: ['绘画工具', '画纸', '引导教材'],
        startDate: '2024-01-03',
        status: 'in_progress',
        completionRate: 40,
        notes: ['在绘画过程中表现出较高的专注度和创造力']
      },
      {
        id: '2-2',
        name: '小组社交活动',
        description: '参与小型社交活动，逐步提升社交能力和自信心',
        frequency: 'biweekly',
        duration: '90分钟',
        responsiblePerson: '周社工',
        resourcesNeeded: ['活动道具', '小组活动指南'],
        startDate: '2024-01-05',
        status: 'in_progress',
        completionRate: 30
      }
    ],
    progress: 35,
    createdBy: {
      id: 'staff-002',
      name: '王社工',
      role: '心理咨询师'
    },
    createTime: '2023-12-29 14:00:00',
    updateTime: '2024-01-14 11:00:00',
    lastReviewTime: '2024-01-08 15:30:00'
  },
  {
    id: '3',
    title: '王强情绪危机干预方案',
    description: '针对王强情绪低落状况，制定的紧急干预和心理支持方案',
    childId: '3',
    childName: '王强',
    childAge: 12,
    category: 'emotional',
    status: 'active',
    startTime: '2024-01-01',
    targetGoals: [
      '改善情绪低落状态，预防抑郁倾向',
      '建立规律的作息时间，改善睡眠质量',
      '重新建立学习兴趣和动力',
      '逐步恢复社交活动参与'
    ],
    interventions: [
      {
        id: '3-1',
        name: '专业心理咨询',
        description: '由专业心理咨询师提供一对一心理疏导和干预',
        frequency: 'weekly',
        duration: '60分钟',
        responsiblePerson: '赵医生',
        resourcesNeeded: ['心理咨询室', '评估量表'],
        startDate: '2024-01-01',
        status: 'in_progress',
        completionRate: 80,
        notes: ['情绪状态有所改善，但仍需持续关注']
      },
      {
        id: '3-2',
        name: '生活作息调整',
        description: '制定规律的时间表，改善睡眠和饮食习惯',
        frequency: 'daily',
        duration: '持续',
        responsiblePerson: '监护人配合',
        resourcesNeeded: ['作息时间表', '健康饮食指南'],
        startDate: '2024-01-01',
        status: 'in_progress',
        completionRate: 65
      },
      {
        id: '3-3',
        name: '兴趣培养活动',
        description: '尝试多种活动，重新激发学习和生活兴趣',
        frequency: 'biweekly',
        duration: '90分钟',
        responsiblePerson: '孙社工',
        resourcesNeeded: ['活动材料', '兴趣评估表'],
        startDate: '2024-01-06',
        status: 'in_progress',
        completionRate: 40
      }
    ],
    progress: 62,
    createdBy: {
      id: 'staff-003',
      name: '赵医生',
      role: '心理医生'
    },
    createTime: '2023-12-31 16:00:00',
    updateTime: '2024-01-13 14:00:00',
    lastReviewTime: '2024-01-12 10:00:00'
  },
  {
    id: '4',
    title: '陈静学习能力提升方案',
    description: '针对陈静优秀的学习能力，制定的能力拓展和创造力培养方案',
    childId: '4',
    childName: '陈静',
    childAge: 9,
    category: 'academic',
    status: 'draft',
    targetGoals: [
      '提供更具挑战性的学习内容',
      '培养创造性思维和问题解决能力',
      '提升阅读深度和写作表达能力',
      '发展领导能力和团队协作精神'
    ],
    interventions: generateMockInterventions(),
    progress: 0,
    createdBy: {
      id: 'staff-004',
      name: '张老师',
      role: '教学主管'
    },
    createTime: '2024-01-14 09:00:00',
    updateTime: '2024-01-14 10:00:00'
  },
  {
    id: '5',
    title: '赵伟注意力培养方案',
    description: '针对赵伟注意力持续时间短的特点，制定的注意力训练和行为引导方案',
    childId: '5',
    childName: '赵伟',
    childAge: 7,
    category: 'behavioral',
    status: 'draft',
    targetGoals: [
      '延长注意力持续时间',
      '培养自我控制能力',
      '通过体育活动释放能量并学习规则',
      '提升团队协作意识'
    ],
    interventions: generateMockInterventions(),
    progress: 0,
    createdBy: {
      id: 'staff-005',
      name: '刘社工',
      role: '儿童社工'
    },
    createTime: '2024-01-15 09:00:00',
    updateTime: '2024-01-15 09:00:00'
  }
];

// 模拟执行日志数据
const mockExecutionLogs: SchemeExecutionLog[] = [
  {
    id: 'log-1',
    schemeId: '1',
    interventionId: '1-1',
    执行人: '张老师',
    executionDate: '2024-01-15',
    content: '今天进行了趣味数学游戏活动，张明表现非常积极，能够快速解决逻辑推理问题。对于难度较高的题目，在引导下也能独立思考并找到解决方案。整体参与度100%，情绪状态良好。',
    progress: 20,
    createTime: '2024-01-15 11:30:00'
  },
  {
    id: 'log-2',
    schemeId: '2',
    interventionId: '2-1',
    执行人: '陈老师',
    executionDate: '2024-01-14',
    content: '本次绘画疗法主题是"我的家庭"，李华画了一幅奶奶和自己一起做饭的场景。通过画面分析，能够感受到她对奶奶的依赖和对家庭温暖的渴望。在分享环节，虽然开始有些腼腆，但在鼓励下能够简单描述自己的作品。',
    progress: 15,
    createTime: '2024-01-14 16:45:00'
  },
  {
    id: 'log-3',
    schemeId: '3',
    interventionId: '3-1',
    执行人: '赵医生',
    executionDate: '2024-01-13',
    content: '本次心理咨询主要探讨了王强最近的情绪变化和睡眠情况。他表示最近入睡时间有所提前，睡眠时间达到了7小时左右，但仍然容易早醒。在谈到学校生活时，表现出一定的抵触情绪，但愿意尝试参加感兴趣的计算机社团。建议下周安排一次校园环境适应活动。',
    progress: 10,
    attachments: [
      {
        id: 'att-1',
        name: '情绪评估量表.pdf',
        type: 'application/pdf',
        url: '#',
        size: 102400
      }
    ],
    createTime: '2024-01-13 16:00:00'
  }
];

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 服务方案服务类
export class SchemeService {
  // 获取服务方案列表
  async getServiceSchemes(params?: {
    page?: number;
    pageSize?: number;
    childId?: string;
    status?: string;
    category?: string;
  }): Promise<{ list: ServiceScheme[]; total: number; page: number; pageSize: number }> {
    await delay(300);
    
    let filtered = [...mockServiceSchemes];
    
    // 筛选条件
    if (params?.childId) {
      filtered = filtered.filter(scheme => scheme.childId === params.childId);
    }
    
    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(scheme => scheme.status === params.status);
    }
    
    if (params?.category && params.category !== 'all') {
      filtered = filtered.filter(scheme => scheme.category === params.category);
    }
    
    // 按更新时间降序排序
    filtered.sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime());
    
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
  
  // 获取单个服务方案
  async getServiceSchemeById(id: string): Promise<ServiceScheme | null> {
    await delay(200);
    const scheme = mockServiceSchemes.find(scheme => scheme.id === id);
    return scheme || null;
  }
  
  // 创建服务方案
  async createServiceScheme(scheme: Omit<ServiceScheme, 'id' | 'createTime' | 'updateTime' | 'progress'>): Promise<ServiceScheme> {
    await delay(500);
    
    const newScheme: ServiceScheme = {
      ...scheme,
      id: Date.now().toString(),
      progress: 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    mockServiceSchemes.unshift(newScheme);
    return newScheme;
  }
  
  // 更新服务方案
  async updateServiceScheme(id: string, updates: Partial<ServiceScheme>): Promise<ServiceScheme | null> {
    await delay(400);
    
    const index = mockServiceSchemes.findIndex(scheme => scheme.id === id);
    if (index === -1) return null;
    
    mockServiceSchemes[index] = {
      ...mockServiceSchemes[index],
      ...updates,
      updateTime: new Date().toISOString()
    };
    
    return mockServiceSchemes[index];
  }
  
  // 删除服务方案
  async deleteServiceScheme(id: string): Promise<boolean> {
    await delay(300);
    
    const index = mockServiceSchemes.findIndex(scheme => scheme.id === id);
    if (index === -1) return false;
    
    mockServiceSchemes.splice(index, 1);
    return true;
  }
  
  // 更新方案状态
  async updateSchemeStatus(id: string, status: ServiceScheme['status']): Promise<ServiceScheme | null> {
    await delay(300);
    
    const index = mockServiceSchemes.findIndex(scheme => scheme.id === id);
    if (index === -1) return null;
    
    const updates: Partial<ServiceScheme> = { status, updateTime: new Date().toISOString() };
    
    // 如果状态变为active，设置开始时间
    if (status === 'active' && !mockServiceSchemes[index].startTime) {
      updates.startTime = new Date().toISOString().split('T')[0];
    }
    
    // 如果状态变为completed，设置结束时间和进度
    if (status === 'completed') {
      updates.endTime = new Date().toISOString().split('T')[0];
      updates.progress = 100;
      // 更新所有干预措施状态为completed
      updates.interventions = mockServiceSchemes[index].interventions.map(intervention => ({
        ...intervention,
        status: 'completed' as const,
        completionRate: 100,
        endDate: new Date().toISOString().split('T')[0]
      }));
    }
    
    mockServiceSchemes[index] = { ...mockServiceSchemes[index], ...updates };
    return mockServiceSchemes[index];
  }
  
  // 添加干预措施
  async addIntervention(schemeId: string, intervention: Omit<Intervention, 'id'>): Promise<ServiceScheme | null> {
    await delay(300);
    
    const index = mockServiceSchemes.findIndex(scheme => scheme.id === schemeId);
    if (index === -1) return null;
    
    const newIntervention: Intervention = {
      ...intervention,
      id: `intervention-${schemeId}-${Date.now()}`
    };
    
    mockServiceSchemes[index].interventions.push(newIntervention);
    mockServiceSchemes[index].updateTime = new Date().toISOString();
    
    return mockServiceSchemes[index];
  }
  
  // 更新干预措施
  async updateIntervention(schemeId: string, interventionId: string, updates: Partial<Intervention>): Promise<ServiceScheme | null> {
    await delay(300);
    
    const schemeIndex = mockServiceSchemes.findIndex(scheme => scheme.id === schemeId);
    if (schemeIndex === -1) return null;
    
    const interventionIndex = mockServiceSchemes[schemeIndex].interventions.findIndex(
      intervention => intervention.id === interventionId
    );
    
    if (interventionIndex === -1) return null;
    
    mockServiceSchemes[schemeIndex].interventions[interventionIndex] = {
      ...mockServiceSchemes[schemeIndex].interventions[interventionIndex],
      ...updates
    };
    
    // 重新计算方案进度
    const totalCompletionRate = mockServiceSchemes[schemeIndex].interventions.reduce(
      (sum, intervention) => sum + intervention.completionRate,
      0
    );
    mockServiceSchemes[schemeIndex].progress = Math.round(
      totalCompletionRate / mockServiceSchemes[schemeIndex].interventions.length
    );
    mockServiceSchemes[schemeIndex].updateTime = new Date().toISOString();
    
    return mockServiceSchemes[schemeIndex];
  }
  
  // 删除干预措施
  async deleteIntervention(schemeId: string, interventionId: string): Promise<ServiceScheme | null> {
    await delay(300);
    
    const schemeIndex = mockServiceSchemes.findIndex(scheme => scheme.id === schemeId);
    if (schemeIndex === -1) return null;
    
    mockServiceSchemes[schemeIndex].interventions = mockServiceSchemes[schemeIndex].interventions.filter(
      intervention => intervention.id !== interventionId
    );
    
    // 重新计算方案进度
    if (mockServiceSchemes[schemeIndex].interventions.length > 0) {
      const totalCompletionRate = mockServiceSchemes[schemeIndex].interventions.reduce(
        (sum, intervention) => sum + intervention.completionRate,
        0
      );
      mockServiceSchemes[schemeIndex].progress = Math.round(
        totalCompletionRate / mockServiceSchemes[schemeIndex].interventions.length
      );
    } else {
      mockServiceSchemes[schemeIndex].progress = 0;
    }
    
    mockServiceSchemes[schemeIndex].updateTime = new Date().toISOString();
    return mockServiceSchemes[schemeIndex];
  }
  
  // 获取执行日志
  async getExecutionLogs(params?: {
    schemeId?: string;
    interventionId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ list: SchemeExecutionLog[]; total: number; page: number; pageSize: number }> {
    await delay(300);
    
    let filtered = [...mockExecutionLogs];
    
    // 筛选条件
    if (params?.schemeId) {
      filtered = filtered.filter(log => log.schemeId === params.schemeId);
    }
    
    if (params?.interventionId) {
      filtered = filtered.filter(log => log.interventionId === params.interventionId);
    }
    
    if (params?.startDate) {
      filtered = filtered.filter(log => log.executionDate >= params.startDate);
    }
    
    if (params?.endDate) {
      filtered = filtered.filter(log => log.executionDate <= params.endDate);
    }
    
    // 按执行日期降序排序
    filtered.sort((a, b) => new Date(b.executionDate).getTime() - new Date(a.executionDate).getTime());
    
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
  
  // 添加执行日志
  async addExecutionLog(log: Omit<SchemeExecutionLog, 'id' | 'createTime'>): Promise<SchemeExecutionLog> {
    await delay(300);
    
    const newLog: SchemeExecutionLog = {
      ...log,
      id: `log-${Date.now()}`,
      createTime: new Date().toISOString()
    };
    
    mockExecutionLogs.unshift(newLog);
    
    // 更新对应干预措施的进度
    const schemeIndex = mockServiceSchemes.findIndex(scheme => scheme.id === log.schemeId);
    if (schemeIndex !== -1) {
      const interventionIndex = mockServiceSchemes[schemeIndex].interventions.findIndex(
        intervention => intervention.id === log.interventionId
      );
      
      if (interventionIndex !== -1) {
        mockServiceSchemes[schemeIndex].interventions[interventionIndex].completionRate = log.progress;
        mockServiceSchemes[schemeIndex].interventions[interventionIndex].status = 
          log.progress >= 100 ? 'completed' : 'in_progress';
        
        // 如果开始日期为空，设置开始日期
        if (!mockServiceSchemes[schemeIndex].interventions[interventionIndex].startDate) {
          mockServiceSchemes[schemeIndex].interventions[interventionIndex].startDate = log.executionDate;
        }
        
        // 如果进度达到100%，设置结束日期
        if (log.progress >= 100 && !mockServiceSchemes[schemeIndex].interventions[interventionIndex].endDate) {
          mockServiceSchemes[schemeIndex].interventions[interventionIndex].endDate = log.executionDate;
        }
        
        // 重新计算方案进度
        const totalCompletionRate = mockServiceSchemes[schemeIndex].interventions.reduce(
          (sum, intervention) => sum + intervention.completionRate,
          0
        );
        mockServiceSchemes[schemeIndex].progress = Math.round(
          totalCompletionRate / mockServiceSchemes[schemeIndex].interventions.length
        );
        mockServiceSchemes[schemeIndex].updateTime = new Date().toISOString();
      }
    }
    
    return newLog;
  }
  
  // 获取统计数据
  async getStatistics(): Promise<{
    totalSchemes: number;
    activeSchemes: number;
    completedSchemes: number;
    averageProgress: number;
    schemesByCategory: Record<string, number>;
  }> {
    await delay(200);
    
    const totalSchemes = mockServiceSchemes.length;
    const activeSchemes = mockServiceSchemes.filter(scheme => scheme.status === 'active').length;
    const completedSchemes = mockServiceSchemes.filter(scheme => scheme.status === 'completed').length;
    
    const totalProgress = mockServiceSchemes.reduce((sum, scheme) => sum + scheme.progress, 0);
    const averageProgress = totalSchemes > 0 ? Math.round(totalProgress / totalSchemes) : 0;
    
    // 按类别统计方案数量
    const schemesByCategory: Record<string, number> = {};
    mockServiceSchemes.forEach(scheme => {
      schemesByCategory[scheme.category] = (schemesByCategory[scheme.category] || 0) + 1;
    });
    
    return {
      totalSchemes,
      activeSchemes,
      completedSchemes,
      averageProgress,
      schemesByCategory
    };
  }
}

// 导出服务实例
export const schemeService = new SchemeService();