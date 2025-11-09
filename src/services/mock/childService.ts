// 儿童管理模拟数据服务

// 儿童信息接口
export interface Child {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  avatar?: string;
  school: string;
  grade: string;
  guardian: {
    name: string;
    relationship: string;
    phone: string;
  };
  contactPhone: string;
  address: string;
  emotionScore: number;
  lastInteractionTime: string;
  status: 'normal' | 'attention' | 'urgent';
  tags: string[];
  createTime: string;
  updateTime: string;
}

// 模拟儿童数据
const mockChildren: Child[] = [
  {
    id: '1',
    name: '张明',
    age: 8,
    gender: 'male',
    avatar: 'https://picsum.photos/200/200?random=1',
    school: '希望小学',
    grade: '三年级',
    guardian: {
      name: '张奶奶',
      relationship: '奶奶',
      phone: '138****1234'
    },
    contactPhone: '138****1234',
    address: '北京市海淀区中关村南大街5号',
    emotionScore: 85,
    lastInteractionTime: '2024-01-15 14:30:00',
    status: 'normal',
    tags: ['活泼开朗', '喜欢数学', '留守儿童'],
    createTime: '2023-09-01 00:00:00',
    updateTime: '2024-01-15 14:30:00'
  },
  {
    id: '2',
    name: '李华',
    age: 10,
    gender: 'female',
    avatar: 'https://picsum.photos/200/200?random=2',
    school: '阳光小学',
    grade: '五年级',
    guardian: {
      name: '李爷爷',
      relationship: '爷爷',
      phone: '139****5678'
    },
    contactPhone: '139****5678',
    address: '北京市朝阳区建国路88号',
    emotionScore: 65,
    lastInteractionTime: '2024-01-14 09:15:00',
    status: 'attention',
    tags: ['性格内向', '喜欢画画', '留守儿童'],
    createTime: '2023-09-01 00:00:00',
    updateTime: '2024-01-14 09:15:00'
  },
  {
    id: '3',
    name: '王强',
    age: 12,
    gender: 'male',
    avatar: 'https://picsum.photos/200/200?random=3',
    school: '星光中学',
    grade: '初一',
    guardian: {
      name: '王奶奶',
      relationship: '奶奶',
      phone: '137****9012'
    },
    contactPhone: '137****9012',
    address: '北京市西城区西单北大街120号',
    emotionScore: 45,
    lastInteractionTime: '2024-01-13 16:45:00',
    status: 'urgent',
    tags: ['情绪低落', '学习压力大', '留守儿童'],
    createTime: '2023-09-01 00:00:00',
    updateTime: '2024-01-13 16:45:00'
  },
  {
    id: '4',
    name: '陈静',
    age: 9,
    gender: 'female',
    avatar: 'https://picsum.photos/200/200?random=4',
    school: '希望小学',
    grade: '四年级',
    guardian: {
      name: '陈爷爷',
      relationship: '爷爷',
      phone: '136****3456'
    },
    contactPhone: '136****3456',
    address: '北京市海淀区中关村北大街15号',
    emotionScore: 88,
    lastInteractionTime: '2024-01-15 11:20:00',
    status: 'normal',
    tags: ['聪明伶俐', '喜欢读书', '留守儿童'],
    createTime: '2023-09-01 00:00:00',
    updateTime: '2024-01-15 11:20:00'
  },
  {
    id: '5',
    name: '赵伟',
    age: 7,
    gender: 'male',
    avatar: 'https://picsum.photos/200/200?random=5',
    school: '阳光小学',
    grade: '二年级',
    guardian: {
      name: '赵奶奶',
      relationship: '奶奶',
      phone: '135****7890'
    },
    contactPhone: '135****7890',
    address: '北京市朝阳区望京街道8号',
    emotionScore: 75,
    lastInteractionTime: '2024-01-14 15:30:00',
    status: 'normal',
    tags: ['好动', '喜欢体育', '留守儿童'],
    createTime: '2023-09-01 00:00:00',
    updateTime: '2024-01-14 15:30:00'
  }
];

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 儿童服务类
export class ChildService {
  // 获取儿童列表
  async getChildren(params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    status?: string;
  }): Promise<{ list: Child[]; total: number; page: number; pageSize: number }> {
    await delay(300);
    
    let filtered = [...mockChildren];
    
    // 关键字搜索
    if (params?.keyword) {
      const keyword = params.keyword.toLowerCase();
      filtered = filtered.filter(child =>
        child.name.toLowerCase().includes(keyword) ||
        child.school.toLowerCase().includes(keyword) ||
        child.guardian.name.toLowerCase().includes(keyword)
      );
    }
    
    // 状态筛选
    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(child => child.status === params.status);
    }
    
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
  
  // 获取单个儿童信息
  async getChildById(id: string): Promise<Child | null> {
    await delay(200);
    const child = mockChildren.find(child => child.id === id);
    return child || null;
  }
  
  // 创建儿童信息
  async createChild(child: Omit<Child, 'id' | 'createTime' | 'updateTime'>): Promise<Child> {
    await delay(500);
    const newChild: Child = {
      ...child,
      id: Date.now().toString(),
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    mockChildren.unshift(newChild);
    return newChild;
  }
  
  // 更新儿童信息
  async updateChild(id: string, updates: Partial<Child>): Promise<Child | null> {
    await delay(400);
    const index = mockChildren.findIndex(child => child.id === id);
    if (index === -1) return null;
    
    mockChildren[index] = {
      ...mockChildren[index],
      ...updates,
      updateTime: new Date().toISOString()
    };
    return mockChildren[index];
  }
  
  // 删除儿童信息
  async deleteChild(id: string): Promise<boolean> {
    await delay(300);
    const index = mockChildren.findIndex(child => child.id === id);
    if (index === -1) return false;
    
    mockChildren.splice(index, 1);
    return true;
  }
  
  // 获取统计数据
  async getStatistics(): Promise<{
    total: number;
    normal: number;
    attention: number;
    urgent: number;
    averageEmotionScore: number;
  }> {
    await delay(200);
    
    const total = mockChildren.length;
    const normal = mockChildren.filter(child => child.status === 'normal').length;
    const attention = mockChildren.filter(child => child.status === 'attention').length;
    const urgent = mockChildren.filter(child => child.status === 'urgent').length;
    const averageEmotionScore = Math.round(
      mockChildren.reduce((sum, child) => sum + child.emotionScore, 0) / total
    );
    
    return {
      total,
      normal,
      attention,
      urgent,
      averageEmotionScore
    };
  }
  
  // 获取最近更新的儿童列表
  async getRecentChildren(limit: number = 5): Promise<Child[]> {
    await delay(200);
    return [...mockChildren]
      .sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime())
      .slice(0, limit);
  }
}

// 导出服务实例
export const childService = new ChildService();