// 服务方案API接口

import http from '../http';

// API响应数据类型定义
export interface DetailSchemeVO {
  id: number;
  target: string;
  createTime: string;
  cycle: number;
  schemeStatus: string;
  workerAdjustReason: string;
  workerId: number;
  workerName: string;
  childInfo: ChildDetailInfo;
  targetSuggest: string[];
  measuresSuggest: WeeklyMeasure[];
}

export interface ChildDetailInfo {
  id: number;
  name: string;
  age: number;
  gender: string;
  riskLevel: string;
  emotionScores: Record<string, number>;
  emotionTrend: string[];
}

export interface WeeklyMeasure {
  week: string;
  details: TaskDetail[];
}

export interface TaskDetail {
  content: string;
  status: string;
  assistTrackLogId: number;
}

// 适配后的数据类型，用于兼容现有页面组件
export interface AdaptedSchemeDetail {
  id: string;
  title: string;
  description: string;
  childId: string;
  childName: string;
  childAge: number;
  childGender: string;
  childRiskLevel: string;
  childEmotionScores: Record<string, number>;
  childEmotionTrend: string[];
  category: 'emotional' | 'academic' | 'behavioral' | 'social' | 'comprehensive';
  status: 'draft' | 'active' | 'completed' | 'paused';
  startTime?: string;
  endTime?: string;
  targetGoals: string[];
  interventions: Intervention[];
  progress: number;
  cycle: number;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  createTime: string;
  updateTime: string;
  lastReviewTime?: string;
}

export interface Intervention {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  duration: string;
  responsiblePerson: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  completionRate: number;
  notes?: string[];
}

export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// 状态映射（支持大小写）
const statusMapping: Record<string, 'draft' | 'active' | 'completed' | 'paused'> = {
  'draft': 'draft',
  'DRAFT': 'draft',
  'active': 'active',
  'ACTIVE': 'active',
  'completed': 'completed',
  'COMPLETED': 'completed',
  'paused': 'paused',
  'PAUSED': 'paused',
  'pending': 'draft',
  'PENDING': 'draft',
  'in_progress': 'active',
  'IN_PROGRESS': 'active',
  'finished': 'completed',
  'FINISHED': 'completed',
  'suspended': 'paused',
  'SUSPENDED': 'paused'
};

// 措施状态映射
const measureStatusMapping: Record<string, 'not_started' | 'in_progress' | 'completed' | 'delayed'> = {
  'not_started': 'not_started',
  'in_progress': 'in_progress',
  'completed': 'completed',
  'delayed': 'delayed',
  'pending': 'not_started',
  'doing': 'in_progress',
  'done': 'completed',
  'overdue': 'delayed'
};

// 适配函数：将API数据转换为页面组件期望的格式
function adaptSchemeDetail(apiData: DetailSchemeVO): AdaptedSchemeDetail {
  // 根据目标推断类别
  const inferCategory = (target: string, suggestions: string[]): 'emotional' | 'academic' | 'behavioral' | 'social' | 'comprehensive' => {
    const text = (target + ' ' + suggestions.join(' ')).toLowerCase();
    if (text.includes('情感') || text.includes('情绪') || text.includes('心理')) {
      return 'emotional';
    } else if (text.includes('学习') || text.includes('学业') || text.includes('成绩')) {
      return 'academic';
    } else if (text.includes('行为') || text.includes('习惯')) {
      return 'behavioral';
    } else if (text.includes('社交') || text.includes('人际')) {
      return 'social';
    } else {
      return 'comprehensive';
    }
  };

  // 适配干预措施
  const adaptedInterventions: Intervention[] = apiData.measuresSuggest.flatMap((measure, measureIndex) => {
    return measure.details.map((detail, detailIndex) => {
      const interventionId = `${apiData.id}-${measureIndex}-${detailIndex}`;
      return {
        id: interventionId,
        name: `${measure.week}任务`,
        description: detail.content,
        frequency: 'weekly' as const,
        duration: '60分钟',
        responsiblePerson: apiData.workerName,
        status: measureStatusMapping[detail.status] || 'not_started',
        completionRate: measureStatusMapping[detail.status] === 'completed' ? 100 : 
                        measureStatusMapping[detail.status] === 'in_progress' ? 50 : 0,
        notes: [measure.week, `任务ID: ${detail.assistTrackLogId}`]
      };
    });
  });

  // 计算进度
  const progress = adaptedInterventions.length > 0 ? 
    Math.round(adaptedInterventions.reduce((sum, intervention) => sum + intervention.completionRate, 0) / adaptedInterventions.length) : 0;

  return {
    id: apiData.id.toString(),
    title: `${apiData.childInfo.name}的服务方案`,
    description: apiData.target,
    childId: apiData.childInfo.id.toString(),
    childName: apiData.childInfo.name,
    childAge: apiData.childInfo.age,
    childGender: apiData.childInfo.gender,
    childRiskLevel: apiData.childInfo.riskLevel,
    childEmotionScores: apiData.childInfo.emotionScores,
    childEmotionTrend: apiData.childInfo.emotionTrend,
    category: inferCategory(apiData.target, apiData.targetSuggest),
    status: statusMapping[apiData.schemeStatus] || 'draft',
    startTime: undefined, // API中没有提供，设为undefined
    endTime: undefined,   // API中没有提供，设为undefined
    targetGoals: apiData.targetSuggest,
    interventions: adaptedInterventions,
    progress,
    cycle: apiData.cycle,
    createdBy: {
      id: apiData.workerId.toString(),
      name: apiData.workerName,
      role: '社工'
    },
    createTime: apiData.createTime,
    updateTime: apiData.createTime, // API中没有updateTime，使用createTime
    lastReviewTime: undefined
  };
}

// 获取方案详情
export async function getSchemeDetail(id: string): Promise<AdaptedSchemeDetail> {
  try {
    // 由于http拦截器会处理响应格式，我们直接调用并处理结果
    const apiData = await http.get<DetailSchemeVO>(`/api/social-worker/scheme/detail/${id}`);
    return adaptSchemeDetail(apiData);
  } catch (error) {
    console.error('获取方案详情失败:', error);
    throw new Error('获取方案详情失败');
  }
}

// 获取模拟数据（用于开发测试）
export async function getMockSchemeDetail(id: string): Promise<AdaptedSchemeDetail> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 返回模拟数据
  return {
    id: id,
    title: '张明情感陪伴计划',
    description: '针对张明活泼开朗的性格特点，制定的综合性情感陪伴和能力提升方案',
    childId: '1',
    childName: '张明',
    childAge: 8,
    childGender: '男',
    childRiskLevel: '低风险',
    childEmotionScores: {
      '情绪稳定性': 85,
      '快乐指数': 92,
      '社交能力': 78,
      '学习积极性': 88,
      '自我认知': 80
    },
    childEmotionTrend: ['开心', '平静', '兴奋', '满足', '愉悦'],
    category: 'comprehensive',
    status: 'active',
    startTime: '2024-01-01',
    endTime: '2024-03-31',
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
        responsiblePerson: '李社工',
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
        responsiblePerson: '李社工',
        status: 'in_progress',
        completionRate: 75,
        notes: []
      },
      {
        id: '1-3',
        name: '情绪管理训练',
        description: '学习识别和表达情绪，掌握基本的情绪调节方法',
        frequency: 'biweekly',
        duration: '45分钟',
        responsiblePerson: '李社工',
        status: 'in_progress',
        completionRate: 50,
        notes: []
      }
    ],
    progress: 62,
    cycle: 12,
    createdBy: {
      id: 'staff-001',
      name: '李社工',
      role: '儿童社工'
    },
    createTime: '2023-12-28 09:00:00',
    updateTime: '2024-01-15 10:30:00',
    lastReviewTime: '2024-01-10 16:00:00'
  };
}