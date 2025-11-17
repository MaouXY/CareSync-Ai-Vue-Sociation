<template>
  <AppLayout title="服务方案详情 - CareSync AI">
    <div class="scheme-detail-container">
      <!-- 页面头部和操作栏 -->
      <div class="page-header">
        <div class="header-left">
          <Button @click="handleGoBack" variant="secondary" class="back-button">
            <i class="icon-arrow-left">←</i> 返回列表
          </Button>
          <h1 class="page-title">{{ schemeDetail?.title || '服务方案详情' }}</h1>
        </div>
        <div class="header-actions">
          <Button 
            @click="handleGenerateReport" 
            variant="secondary" 
            class="report-button"
          >
            <i class="icon-file-text">📊</i> 生成报告
          </Button>
          <Button 
            @click="handleEditScheme" 
            variant="primary" 
            class="edit-button"
            v-if="schemeDetail?.status !== 'completed'"
          >
            <i class="icon-edit">✏️</i> 编辑方案
          </Button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">加载中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">❌</div>
        <h3 class="error-title">加载失败</h3>
        <p class="error-message">{{ error }}</p>
        <Button @click="fetchSchemeDetail" variant="primary">重试</Button>
      </div>

      <!-- 服务方案详情内容 -->
      <div v-else-if="schemeDetail" class="scheme-detail-content">
        <!-- 基本信息卡片 -->
        <Card class="basic-info-card">
          <div class="card-header">
            <h2 class="card-title">基本信息</h2>
            <span 
              :class="['status-badge', `status-${schemeDetail?.status}`]"
              class="status-indicator"
              :style="{
                backgroundColor: getStatusColor(schemeDetail?.status || '').bg,
                color: getStatusColor(schemeDetail?.status || '').color,
                borderColor: getStatusColor(schemeDetail?.status || '').border
              }"
            >
              {{ getStatusText(schemeDetail?.status) }}
            </span>
          </div>
          <div class="card-content">
            <div class="info-section">
              <div class="scheme-overview">
                <div class="overview-item">
                  <span class="label">方案标题：</span>
                  <span class="value">{{ schemeDetail?.title }}</span>
                </div>
                <div class="overview-item">
                  <span class="label">方案类别：</span>
                  <span :class="['category-badge', `category-${schemeDetail?.category}`]">
                    {{ getCategoryText(schemeDetail?.category) }}
                  </span>
                </div>
                <div class="overview-item">
                  <span class="label">创建日期：</span>
                  <span class="value">{{ formatDate(schemeDetail?.createTime) }}</span>
                </div>
                <div class="overview-item">
                  <span class="label">负责人：</span>
                  <span class="value">{{ schemeDetail?.createdBy?.name || '-' }}</span>
                </div>
                <div class="overview-item">
                  <span class="label">方案周期：</span>
                  <span class="value">
                    {{schemeDetail?.cycle}}周
                  </span>
                </div>
              </div>

              <div class="child-info-section">
                <div class="child-profile">
                  <div class="child-avatar">
                    <img 
                      :src="defaultAvatar" 
                      :alt="schemeDetail?.childName"
                    />
                  </div>
                  <div class="child-details">
                    <div class="child-name">{{ schemeDetail?.childName }}</div>
                    <div class="child-meta">
                      {{ schemeDetail?.childAge }}岁
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 完成进度 -->
            <div class="progress-section">
              <div class="progress-header">
                <h3 class="progress-title">完成进度</h3>
                <span class="progress-percentage">{{ schemeDetail?.progress || 0 }}%</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: (schemeDetail?.progress || 0) + '%' }"
                  :class="getProgressClass(schemeDetail?.progress || 0)"
                ></div>
              </div>
            </div>
          </div>
        </Card>

        <!-- 问题概述和目标 -->
        <div class="two-column-grid">
          <Card class="problem-overview-card">
            <div class="card-header">
              <h2 class="card-title">问题概述</h2>
            </div>
            <div class="card-content">
              <p class="description-text">{{ schemeDetail?.description }}</p>
            </div>
          </Card>

          <Card class="goals-card">
            <div class="card-header">
              <h2 class="card-title">服务目标</h2>
            </div>
            <div class="card-content">
              <ul class="goals-list">
                <li 
                  v-for="(goal, index) in schemeDetail?.targetGoals || []" 
                  :key="index" 
                  class="goal-item"
                >
                  <span class="goal-number">{{ index + 1 }}</span>
                  <span class="goal-text">{{ goal }}</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>

        <!-- 干预措施 -->
        <Card class="interventions-card">
          <div class="card-header">
            <h2 class="card-title">干预措施</h2>
            <Button 
              @click="handleAddIntervention" 
              size="small" 
              variant="primary"
              v-if="schemeDetail?.status !== 'completed'"
            >
              添加措施
            </Button>
          </div>
          <div class="card-content">
            <!-- 按周分组的干预措施 -->
            <div v-if="groupedInterventions && Object.keys(groupedInterventions).length > 0">
              <div 
                v-for="(weekInterventions, weekKey) in groupedInterventions" 
                :key="weekKey" 
                class="week-group"
              >
                <div class="week-header">
                  <h3 class="week-title">{{ weekKey }}</h3>
                  <div class="week-progress">
                    <span class="progress-text">
                      {{ getWeekCompletedCount(weekInterventions) }}/{{ weekInterventions.length }} 已完成
                    </span>
                    <div class="mini-progress-bar">
                      <div 
                        class="mini-progress-fill" 
                        :style="{ width: (getWeekProgress(weekInterventions)) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div 
                  v-for="(intervention, index) in weekInterventions" 
                  :key="intervention.id || index" 
                  class="intervention-item"
                >
                  <div class="intervention-header">
                    <div class="intervention-info">
                      <span class="intervention-number">{{ index + 1 }}</span>
                      <h3 class="intervention-title">{{ intervention.name }}</h3>
                      <span 
                        :class="['completion-badge', `completion-${intervention.status}`]"
                        :style="{
                          backgroundColor: getStatusColor(intervention.status || '').bg,
                          color: getStatusColor(intervention.status || '').color,
                          borderColor: getStatusColor(intervention.status || '').border
                        }"
                      >
                        {{ getInterventionStatusText(intervention.status) }}
                      </span>
                    </div>
                    <div class="intervention-actions">
                      <Button 
                        size="small" 
                        @click="handleEditIntervention(intervention.originalIndex)"
                        v-if="schemeDetail?.status !== 'completed'"
                      >
                        编辑
                      </Button>
                      <Button 
                        size="small" 
                        variant="danger" 
                        @click="handleDeleteIntervention(intervention.originalIndex)"
                        v-if="schemeDetail?.status !== 'completed'"
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                  <div class="intervention-details">
                    <div class="detail-row">
                      <span class="detail-label">具体内容：</span>
                      <span class="detail-value">{{ intervention.description }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">实施频率：</span>
                      <span class="detail-value">{{ intervention.frequency }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">负责人：</span>
                      <span class="detail-value">{{ intervention.responsiblePerson || '-' }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">完成进度：</span>
                      <span class="detail-value">{{ intervention.completionRate }}%</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">持续时间：</span>
                      <span class="detail-value">{{ intervention.duration || '-' }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">备注：</span>
                      <span class="detail-value">{{ (intervention.notes && intervention.notes.length > 0) ? intervention.notes.join(', ') : '-' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 如果没有干预措施 -->
            <div v-else class="empty-interventions">
              <p>暂无干预措施</p>
            </div>
          </div>
        </Card>

        <!-- 效果评估 --><Card class="evaluation-card">
          <div class="card-header">
            <h2 class="card-title">效果评估</h2>
          </div>
          <div class="card-content">
            <div v-if="schemeDetail?.status !== 'completed' && !schemeDetail?.evaluation">
              <p class="evaluation-notice">
                服务方案尚未完成，完成后可添加效果评估
              </p>
            </div>
            <div v-else-if="schemeDetail?.evaluation" class="evaluation-details">
              <div class="evaluation-item">
                <span class="evaluation-label">总体效果：</span>
                <div class="effect-score">
                  <div class="stars">
                    <span 
                      v-for="n in 5" 
                      :key="n" 
                      :class="['star', n <= parseInt(schemeDetail.evaluation.score) ? 'filled' : 'empty']"
                    >★</span>
                  </div>
                  <span class="score-text">{{ schemeDetail.evaluation.score }}分</span>
                </div>
              </div>
              <div class="evaluation-item">
                <span class="evaluation-label">评估内容：</span>
                <div class="evaluation-content">{{ schemeDetail.evaluation.content }}</div>
              </div>
              <div class="evaluation-item">
                <span class="evaluation-label">经验总结：</span>
                <div class="evaluation-summary">{{ schemeDetail.evaluation.summary || '-' }}</div>
              </div>
              <div class="evaluation-meta">
                <span class="meta-item">评估人：{{ schemeDetail.evaluation.evaluator }}</span>
                <span class="meta-item">评估日期：{{ formatDate(schemeDetail.evaluation.date) }}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue';
import Card from '@/components/common/Card.vue';
import Button from '@/components/common/Button.vue';
import { getSchemeDetail, getMockSchemeDetail, type AdaptedSchemeDetail } from '@/services/api/schemeApi';
import {AssistSchemeVO} from '@/services/api/vo/schemeVo';

// 路由实例
const router = useRouter();
const route = useRoute();

// 状态管理
const isLoading = ref(false);
const error = ref<string | null>(null);
const schemeDetail = ref<AssistSchemeVO>(null);
const defaultAvatar = 'https://picsum.photos/40/40?random=default';

// 获取方案详情
const fetchSchemeDetail = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const id = route.params.id as string;
    
    // 优先使用真实API，失败时回退到模拟数据
    try {
      const scheme = await getSchemeDetail(id);
      schemeDetail.value = scheme;
    } catch (apiError) {
      console.warn('真实API调用失败，使用模拟数据:', apiError);
      const scheme = await getMockSchemeDetail(id);
      schemeDetail.value = scheme;
    }
  } catch (err) {
    error.value = '获取方案详情失败';
    console.error('获取方案详情失败:', err);
  } finally {
    isLoading.value = false;
  }
};

// 返回列表
const handleGoBack = () => {
  router.push('/schemes');
};

// 生成报告
const handleGenerateReport = () => {
  // 实现报告生成逻辑
  console.log('生成报告');
};

// 编辑方案
const handleEditScheme = () => {
  if (schemeDetail.value) {
    router.push(`/schemes/edit/${schemeDetail.value.id}`);
  }
};

// 添加干预措施
const handleAddIntervention = () => {
  // 实现添加干预措施逻辑
  console.log('添加干预措施');
};

// 编辑干预措施
const handleEditIntervention = (index: number) => {
  // 实现编辑干预措施逻辑
  console.log('编辑干预措施', index);
};

// 删除干预措施
const handleDeleteIntervention = async (index: number) => {
  // 实现删除干预措施逻辑
  console.log('删除干预措施', index);
};

// 按周分组的干预措施
const groupedInterventions = computed(() => {
  if (!schemeDetail.value || !schemeDetail.value.interventions) {
    return {};
  }
  
  const groups: Record<string, any[]> = {};
  
  schemeDetail.value.interventions.forEach((intervention, index) => {
    // 从notes中提取周标题信息
    let weekKey = '未分组';
    
    if (intervention.notes && intervention.notes.length > 0) {
      // 使用第一个note作为周标题
      weekKey = intervention.notes[0];
    }
    
    // 如果没有找到周数信息，尝试从name中提取
    if (weekKey === '未分组' && intervention.name) {
      // 从name中提取周标题（去掉"任务"后缀）
      weekKey = intervention.name.replace('任务', '');
    }
    
    // 初始化分组（如果不存在）
    if (!groups[weekKey]) {
      groups[weekKey] = [];
    }
    
    // 添加原始索引，用于编辑和删除操作
    groups[weekKey].push({
      ...intervention,
      originalIndex: index
    });
  });
  
  // 按周标题排序（按字母顺序）
  const sortedGroups: Record<string, any[]> = {};
  const weekKeys = Object.keys(groups);
  
  // 按字母顺序排序
  weekKeys.sort((a, b) => {
    return a.localeCompare(b, 'zh-CN');
  });
  
  weekKeys.forEach(key => {
    sortedGroups[key] = groups[key];
  });
  
  return sortedGroups;
});

// 从字符串中提取周数（保留此函数以防将来需要）
const extractWeekNumber = (weekString: string): number | null => {
  const match = weekString.match(/第(\d+)周/);
  return match ? parseInt(match[1]) : null;
};

// 获取本周已完成任务数
const getWeekCompletedCount = (weekInterventions: any[]): number => {
  return weekInterventions.filter(intervention => intervention.status === 'completed').length;
};

// 获取本周进度百分比
const getWeekProgress = (weekInterventions: any[]): number => {
  if (weekInterventions.length === 0) return 0;
  
  const completedCount = getWeekCompletedCount(weekInterventions);
  return Math.round((completedCount / weekInterventions.length) * 100);
};

// 方案状态管理：草稿(DRAFT)→进行中(IN_PROGRESS)→完成(COMPLETED)

// 获取状态文本（支持大小写）
const getStatusText = (status: string): string => {
  const statusMap = {
    DRAFT: '草稿',
    draft: '草稿',
    IN_PROGRESS: '进行中',
    in_progress: '进行中',
    ACTIVE: '进行中',
    active: '进行中',
    COMPLETED: '已完成',
    completed: '已完成',
    PAUSED: '已暂停',
    paused: '已暂停',
    PENDING: '待处理',
    pending: '待处理',
    FINISHED: '已完成',
    finished: '已完成',
    SUSPENDED: '已暂停',
    suspended: '已暂停',
    CANCELLED: '已取消',
    cancelled: '已取消',
    DELAYED: '已延迟',
    delayed: '已延迟'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

// 获取状态颜色映射
const getStatusColor = (status: string) => {
  const colorMap = {
    DRAFT: { bg: '#F3F4F6', color: '#6B7280', border: '#D1D5DB' },
    draft: { bg: '#F3F4F6', color: '#6B7280', border: '#D1D5DB' },
    IN_PROGRESS: { bg: '#DBEAFE', color: '#1D4ED8', border: '#3B82F6' },
    ACTIVE: { bg: '#DBEAFE', color: '#1D4ED8', border: '#3B82F6' },
    active: { bg: '#DBEAFE', color: '#1D4ED8', border: '#3B82F6' },
    COMPLETED: { bg: '#D1FAE5', color: '#059669', border: '#10B981' },
    completed: { bg: '#D1FAE5', color: '#059669', border: '#10B981' },
    PAUSED: { bg: '#FEF3C7', color: '#D97706', border: '#F59E0B' },
    paused: { bg: '#FEF3C7', color: '#D97706', border: '#F59E0B' },
    CANCELLED: { bg: '#FEE2E2', color: '#DC2626', border: '#EF4444' },
    cancelled: { bg: '#FEE2E2', color: '#DC2626', border: '#EF4444' },
    PENDING: { bg: '#FEF3C7', color: '#D97706', border: '#F59E0B' },
    pending: { bg: '#FEF3C7', color: '#D97706', border: '#F59E0B' },
    DELAYED: { bg: '#FEE2E2', color: '#DC2626', border: '#EF4444' },
    delayed: { bg: '#FEE2E2', color: '#DC2626', border: '#EF4444' }
  };
  return colorMap[status as keyof typeof colorMap] || colorMap.draft;
};

// 检查状态流转是否合法：草稿→进行中→完成
const isValidStatusTransition = (currentStatus: string, newStatus: string): boolean => {
  const validTransitions: Record<string, string[]> = {
    DRAFT: ['IN_PROGRESS', 'ACTIVE', 'CANCELLED'],
    draft: ['IN_PROGRESS', 'ACTIVE', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'PAUSED'],
    ACTIVE: ['COMPLETED', 'PAUSED'],
    active: ['COMPLETED', 'PAUSED'],
    COMPLETED: [], // 已完成状态不能流转
    completed: [], // 已完成状态不能流转
    PAUSED: ['IN_PROGRESS', 'ACTIVE', 'CANCELLED'],
    paused: ['IN_PROGRESS', 'ACTIVE', 'CANCELLED'],
    CANCELLED: [], // 已取消状态不能流转
    cancelled: [] // 已取消状态不能流转
  };
  
  const validNextStates = validTransitions[currentStatus] || [];
  return validNextStates.includes(newStatus);
};

// 获取下一状态选项
const getNextStatusOptions = (currentStatus: string): string[] => {
  const transitionMap: Record<string, string[]> = {
    DRAFT: ['IN_PROGRESS', 'CANCELLED'],
    draft: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'PAUSED'],
    ACTIVE: ['COMPLETED', 'PAUSED'],
    active: ['COMPLETED', 'PAUSED'],
    PAUSED: ['IN_PROGRESS', 'ACTIVE', 'CANCELLED'],
    paused: ['IN_PROGRESS', 'ACTIVE', 'CANCELLED'],
    COMPLETED: [],
    completed: [],
    CANCELLED: [],
    cancelled: []
  };
  
  return transitionMap[currentStatus] || [];
};

// 获取类别文本
const getCategoryText = (category: string): string => {
  const categoryMap = {
    emotional: '情感支持',
    academic: '学业提升',
    behavioral: '行为引导',
    social: '社交能力',
    comprehensive: '综合方案'
  };
  return categoryMap[category as keyof typeof categoryMap] || category;
};

// 格式化日期
const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 获取进度样式类
const getProgressClass = (progress: number): string => {
  if (progress >= 80) return 'progress-high';
  if (progress >= 40) return 'progress-medium';
  return 'progress-low';
};

// 获取干预措施状态文本
const getInterventionStatusText = (status: string): string => {
  const statusMap = {
    'not_started': '未开始',
    'in_progress': '进行中',
    'completed': '已完成',
    'delayed': '已延迟'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

// 组件挂载时获取数据
onMounted(() => {
  fetchSchemeDetail();
});
</script>

<style scoped>
scheme-detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #E5E7EB;
  border-top: 3px solid #4F46E5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

/* @keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
} */

.loading-text {
  color: #6B7280;
  font-size: 14px;
  margin: 0;
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 8px 0;
}

.error-message {
  color: #6B7280;
  font-size: 14px;
  margin: 0 0 20px 0;
}

/* 详情内容区域 */
.scheme-detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片通用样式 */
Card {
  border: none;
  border-radius: 0;
  box-shadow: none;
  background-color: transparent;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
  background-color: #F9FAFB;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.card-content {
  padding: 24px;
}

/* 基本信息卡片 */
.info-section {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  margin-bottom: 24px;
}

.scheme-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.overview-item .label {
  font-weight: 500;
  color: #6B7280;
  min-width: 100px;
}

.overview-item .value {
  color: #1F2937;
}

.child-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #F9FAFB;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
}

.child-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}

.child-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.child-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.child-name {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.child-meta {
  font-size: 14px;
  color: #6B7280;
}

/* 进度条 */
.progress-section {
  padding: 16px 0 0;
  border-top: 1px solid #E5E7EB;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.progress-percentage {
  font-size: 18px;
  font-weight: 700;
  color: #4F46E5;
}

.progress-bar {
  height: 12px;
  background-color: #E5E7EB;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  /* transition: width 0.3s ease; */
  border-radius: 6px;
}

.progress-fill.progress-low {
  background-color: #EF4444;
}

.progress-fill.progress-medium {
  background-color: #F59E0B;
}

.progress-fill.progress-high {
  background-color: #22C55E;
}

/* 两列布局 */
.two-column-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* 问题概述和目标卡片 */
.description-text {
  color: #1F2937;
  line-height: 1.6;
  margin: 0;
}

.goals-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.goal-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background-color: #F9FAFB;
  border-radius: 6px;
  border-left: 4px solid #4F46E5;
}

.goal-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #4F46E5;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  border-radius: 50%;
  flex-shrink: 0;
}

.goal-text {
  color: #1F2937;
  line-height: 1.5;
}

/* 干预措施卡片 */
.week-group {
  margin-bottom: 24px;
}

.week-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #F9FAFB;
  border-radius: 8px;
  border-left: 4px solid #4F46E5;
}

.week-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.week-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 14px;
  color: #6B7280;
  white-space: nowrap;
}

.mini-progress-bar {
  width: 100px;
  height: 8px;
  background-color: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background-color: #4F46E5;
  transition: width 0.3s ease;
}

.intervention-item {
  padding: 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 16px;
  /* transition: box-shadow 0.2s ease; */
}

/* .intervention-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
} */

.intervention-item:last-child {
  margin-bottom: 0;
}

.empty-interventions {
  text-align: center;
  padding: 40px 20px;
  color: #6B7280;
}

.intervention-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.intervention-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  flex-wrap: wrap;
}

.intervention-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: #F3F4F6;
  color: #6B7280;
  font-size: 14px;
  font-weight: 600;
  border-radius: 50%;
  flex-shrink: 0;
}

.intervention-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
  flex: 1;
}

.intervention-actions {
  display: flex;
  gap: 8px;
}

.intervention-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #F3F4F6;
}

.detail-row {
  display: flex;
  gap: 12px;
}

.detail-label {
  font-weight: 500;
  color: #6B7280;
  min-width: 100px;
  flex-shrink: 0;
}

.detail-value {
  color: #1F2937;
  line-height: 1.5;
  flex: 1;
}

/* 执行日志卡片 */
.empty-logs {
  text-align: center;
  padding: 40px 20px;
  color: #6B7280;
}

.empty-text {
  margin: 0;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.log-item {
  padding: 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 16px;
  flex-wrap: wrap;
}

.log-date {
  font-weight: 600;
  color: #4F46E5;
}

.log-author {
  color: #6B7280;
  font-size: 14px;
}

.log-content {
  color: #1F2937;
  line-height: 1.6;
  margin-bottom: 12px;
  padding: 12px;
  background-color: #F9FAFB;
  border-radius: 6px;
}

.log-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 效果评估卡片 */
.evaluation-notice {
  color: #6B7280;
  font-style: italic;
  text-align: center;
  padding: 40px 20px;
  margin: 0;
}

.evaluation-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.evaluation-item {
  display: flex;
  gap: 16px;
}

.evaluation-label {
  font-weight: 600;
  color: #374151;
  min-width: 100px;
  flex-shrink: 0;
}

.effect-score {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  display: flex;
  gap: 4px;
}

.star {
  font-size: 24px;
}

.star.filled {
  color: #F59E0B;
}

.star.empty {
  color: #E5E7EB;
}

.score-text {
  font-weight: 600;
  color: #1F2937;
}

.evaluation-content,
.evaluation-summary {
  color: #1F2937;
  line-height: 1.6;
  flex: 1;
  padding: 12px;
  background-color: #F9FAFB;
  border-radius: 6px;
}

.evaluation-meta {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.meta-item {
  color: #6B7280;
  font-size: 14px;
}

/* 状态和类别标签 */
.status-badge,
.category-badge,
.completion-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-draft {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6B7280;
}

.status-active {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.status-completed {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4F46E5;
}

.status-paused {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.category-emotional {
  background-color: rgba(236, 72, 153, 0.1);
  color: #EC4899;
}

.category-academic {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4F46E5;
}

.category-behavioral {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.category-social {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.category-comprehensive {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6B7280;
}

.completion-planned {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6B7280;
}

.completion-in_progress {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.completion-completed {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .two-column-grid {
    grid-template-columns: 1fr;
  }
  
  .info-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .scheme-detail-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  
  .card-header {
    padding: 16px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .card-content {
    padding: 20px;
  }
  
  .intervention-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .intervention-info {
    width: 100%;
  }
  
  .intervention-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .log-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .evaluation-item {
    flex-direction: column;
    gap: 8px;
  }
  
  .evaluation-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .card-header {
    padding: 12px 16px;
  }
  
  .card-content {
    padding: 16px;
  }
  
  .child-profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .progress-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .effect-score {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>