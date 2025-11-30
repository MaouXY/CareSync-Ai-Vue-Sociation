<template>
  <AppLayout title="服务跟踪详情 - CareSync AI">
    <div class="tracking-detail-container">
      <!-- 页面头部和操作栏 -->
      <div class="page-header">
        <div class="header-left">
          <Button @click="handleGoBack" variant="secondary" class="back-button">
            <i class="icon-arrow-left">←</i> 返回列表
          </Button>
          <h1 class="page-title">{{ trackingDetail?.childName }} - 服务跟踪详情</h1>
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
            @click="handleEditTracking" 
            variant="primary" 
            class="edit-button"
            v-if="trackingDetail?.schemeStatus !== 'COMPLETED'"
          >
            <i class="icon-edit">✏️</i> 编辑跟踪
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
        <Button @click="fetchTrackingDetail" variant="primary">重试</Button>
      </div>

      <!-- 成功消息 -->
      <div v-if="successMessage" class="message success-message">
        <span class="message-icon">✅</span>
        <span class="message-text">{{ successMessage }}</span>
        <Button @click="successMessage = null" variant="text" size="small" class="message-close">关闭</Button>
      </div>

      <!-- 错误消息 -->
      <div v-if="errorMessage" class="message error-message">
        <span class="message-icon">❌</span>
        <span class="message-text">{{ errorMessage }}</span>
        <Button @click="errorMessage = null" variant="text" size="small" class="message-close">关闭</Button>
      </div>

      <!-- 服务跟踪详情内容 -->
      <div v-else-if="trackingDetail" class="tracking-detail-content">
        <!-- 基本信息卡片 -->
        <div class="basic-info-card p-12">
          <div class="card-header">
            <h2 class="card-title">基本信息</h2>
            <span 
              :class="['status-badge', `status-${trackingDetail?.schemeStatus?.toLowerCase()}`]"
              class="status-indicator"
              :style="{
                backgroundColor: getStatusColor(trackingDetail?.schemeStatus || '').bg,
                color: getStatusColor(trackingDetail?.schemeStatus || '').color,
                borderColor: getStatusColor(trackingDetail?.schemeStatus || '').border
              }"
            >
              {{ getStatusText(trackingDetail?.schemeStatus) }}
            </span>
          </div>
          <div class="card-content">
            <div class="info-section">
              <div class="tracking-overview">
                <div class="overview-item">
                  <span class="label">儿童姓名：</span>
                  <span class="value">{{ trackingDetail?.childName }}</span>
                </div>
                <div class="overview-item">
                  <span class="label">儿童年龄：</span>
                  <span class="value">{{ trackingDetail?.childAge }}岁</span>
                </div>
                <div class="overview-item">
                  <span class="label">服务人员：</span>
                  <span class="value">{{ trackingDetail?.workerName }}</span>
                </div>
                <div class="overview-item">
                  <span class="label">服务周期：</span>
                  <span class="value">{{ trackingDetail?.cycle }}周</span>
                </div>
                <div class="overview-item">
                  <span class="label">创建时间：</span>
                  <span class="value">{{ formatDate(trackingDetail?.createTime) }}</span>
                </div>
                <div class="overview-item">
                  <span class="label">更新时间：</span>
                  <span class="value">{{ formatDate(trackingDetail?.updateTime) }}</span>
                </div>
              </div>
            </div>

            <!-- 完成进度 -->
            <div class="progress-section">
              <div class="progress-header">
                <h3 class="progress-title">任务进度</h3>
                <div class="progress-stats">
                  <span class="progress-percentage">{{ trackingDetail?.progress || 0 }}%</span>
                  <span class="progress-count">{{ trackingDetail?.progress || 0 }}/{{ trackingDetail?.totalTasks || 0 }} 任务完成</span>
                </div>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: (trackingDetail?.progress || 0) + '%' }"
                  :class="getProgressClass(trackingDetail?.progress || 0)"
                ></div>
              </div>
              <div class="task-breakdown">
                <div class="task-item">
                  <span class="task-label">已完成：</span>
                  <span class="task-value">{{ trackingDetail?.progress || 0 }}</span>
                </div>
                <div class="task-item">
                  <span class="task-label">进行中：</span>
                  <span class="task-value">{{ trackingDetail?.inProgressTasks || 0 }}</span>
                </div>
                <div class="task-item">
                  <span class="task-label">总计：</span>
                  <span class="task-value">{{ trackingDetail?.totalTasks || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 服务目标和措施 -->
        <div class="basic-info-card p-12">
          <div class="service-target-card">
            <div class="card-header">
              <h2 class="card-title">服务目标</h2>
            </div>
            <div class="card-content">
              <div class="target-content">
                <p class="main-target">{{ trackingDetail?.target }}</p>
                <div class="ai-suggestions" v-if="trackingDetail?.targetSuggest && trackingDetail.targetSuggest.length > 0">
                  <h4 class="suggestions-title">AI目标建议</h4>
                  <ul class="suggestions-list">
                    <li 
                      v-for="(suggestion, index) in trackingDetail?.targetSuggest" 
                      :key="index" 
                      class="suggestion-item"
                    >
                      {{ suggestion }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 服务调整原因 -->
          <div class="adjustment-card" v-if="trackingDetail?.workerAdjustReason">
            <div class="card-header">
              <h2 class="card-title">服务调整原因</h2>
            </div>
            <div class="card-content">
              <p class="adjustment-text">{{ trackingDetail?.workerAdjustReason }}</p>
            </div>
          </div>
        </div>

        <!-- 服务措施和执行详情 -->
        <div class="basic-info-card p-12" v-if="trackingDetail?.workerAdjustReason || trackingDetail?.measuresSuggest">
          <div class="service-measures-card">
            <div class="card-header">
              <h2 class="card-title">服务措施</h2>
              <div class="measures-tags">
                <span 
                  v-for="(measure, index) in trackingDetail?.measures || []" 
                  :key="index" 
                  class="measure-tag"
                >
                  {{ measure }}
                </span>
              </div>
            </div>
            <div class="card-content">
              <!-- 按周分组的服务措施 -->
              <div v-if="trackingDetail?.measuresSuggest && trackingDetail.measuresSuggest.length > 0">
                <div 
                  v-for="(weekMeasure, weekKey) in trackingDetail?.measuresSuggest" 
                  :key="weekKey" 
                  class="week-group"
                >
                  <div class="week-header">
                    <h3 class="week-title">{{ weekMeasure.week }}</h3>
                    <div class="week-progress">
                      <span class="progress-text">
                        {{ getWeekCompletedCount(weekMeasure.details) }}/{{ weekMeasure.details.length }} 已完成
                      </span>
                      <div class="mini-progress-bar">
                        <div 
                          class="mini-progress-fill" 
                          :style="{ width: (getWeekProgress(weekMeasure.details)) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    v-for="(task, taskIndex) in weekMeasure.details" 
                    :key="taskIndex" 
                    class="intervention-item"
                  >
                    <div class="intervention-header">
                      <div class="intervention-info">
                        <span class="intervention-number">{{ taskIndex + 1 }}</span>
                        <h3 class="intervention-title">{{ task.content }}</h3>
                        <div class="status-selector-container">
                          <select 
                            v-model="task.status" 
                            @change="updateTaskStatus(task.assist_track_log_id, task.status)"
                            :class="['status-selector', { 'loading': updatingTasks.has(task.assist_track_log_id) }]"
                            :disabled="updatingTasks.has(task.assist_track_log_id)"
                          >
                            <option value="pending">待处理</option>
                            <option value="in_progress">进行中</option>
                            <option value="completed">已完成</option>
                          </select>
                          <div v-if="updatingTasks.has(task.assist_track_log_id)" class="status-loading">
                            <div class="loading-spinner-small"></div>
                          </div>
                        </div>
                      </div>
                      <div class="intervention-meta">
                        <span class="task-id">ID: {{ task.assist_track_log_id }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 如果没有服务措施 -->
              <div v-else class="empty-interventions">
                <p>暂无服务措施</p>
              </div>
            </div>
          </div>

          <!-- 服务调整原因 -->
          <div class="adjustment-card" v-if="trackingDetail?.workerAdjustReason">
            <div class="card-header">
              <h2 class="card-title">服务调整原因</h2>
            </div>
            <div class="card-content">
              <p class="adjustment-text">{{ trackingDetail?.workerAdjustReason }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue';
import Card from '@/components/common/Card.vue';
import Button from '@/components/common/Button.vue';
import { http } from '@/services/api';

// 路由实例
const router = useRouter();
const route = useRoute();

// 状态管理
const isLoading = ref(false);
const error = ref<string | null>(null);
const trackingDetail = ref<TrackingDetailVO | null>(null);
const updatingTasks = ref<Set<number>>(new Set());
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

// 接口响应数据类型定义
interface MeasuresSuggestDetails {
  content: string;
  status: string;
  assist_track_log_id: number;
}

interface MeasuresSuggest {
  week: string;
  details: MeasuresSuggestDetails[];
}

interface TrackingDetailVO {
  id: number;
  childId: number;
  workerId: number;
  target: string;
  measures: string[];
  cycle: number;
  schemeStatus: string;
  progress: number;
  inProgressTasks: number;
  totalTasks: number;
  targetSuggest: string[];
  measuresSuggest: MeasuresSuggest[];
  workerAdjustReason?: string;
  aiAnalysisId?: number;
  evaluationIndex?: Record<string, any>;
  createTime: string;
  updateTime: string;
  childName: string;
  childAge: string;
  workerName: string;
}

// 获取跟踪详情
const fetchTrackingDetail = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const id = route.params.id as string;
    
    // 调用接口获取跟踪详情
    const response = await http.get(`/api/social-worker/track/scheme/${id}`);
    trackingDetail.value = response.data;
  } catch (err) {
    error.value = '获取跟踪详情失败';
    console.error('获取跟踪详情失败:', err);
  } finally {
    isLoading.value = false;
  }
};

// 返回列表
const handleGoBack = () => {
  router.push('/tracking');
};

// 生成报告
const handleGenerateReport = () => {
  console.log('生成报告');
};

// 编辑跟踪
const handleEditTracking = () => {
  if (trackingDetail.value) {
    router.push(`/tracking/edit/${trackingDetail.value.id}`);
  }
};

// 获取状态文本（复用已有逻辑）
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

// 获取状态颜色映射（复用已有逻辑）
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
    delayed: { bg: '#FEE2E2', color: '#DC2626', border: '#EF4444' },
    SUSPENDED: { bg: '#FEF3C7', color: '#D97706', border: '#F59E0B' },
    suspended: { bg: '#FEF3C7', color: '#D97706', border: '#F59E0B' },
    FINISHED: { bg: '#D1FAE5', color: '#059669', border: '#10B981' },
    finished: { bg: '#D1FAE5', color: '#059669', border: '#10B981' }
  };
  return colorMap[status as keyof typeof colorMap] || { bg: '#F3F4F6', color: '#6B7280', border: '#D1D5DB' };
};

// 获取进度样式类
const getProgressClass = (progress: number) => {
  if (progress >= 80) return 'progress-success';
  if (progress >= 50) return 'progress-warning';
  return 'progress-normal';
};

// 获取本周已完成任务数
const getWeekCompletedCount = (details: any[]) => {
  return details.filter(detail => detail.status === 'completed').length;
};

// 获取本周进度百分比
const getWeekProgress = (details: any[]) => {
  if (details.length === 0) return 0;
  const completedCount = getWeekCompletedCount(details);
  return Math.round((completedCount / details.length) * 100);
};

// 更新任务状态
const updateTaskStatus = async (taskId: number, newStatus: string) => {
  try {
    // 添加到更新中的任务集合
    updatingTasks.value.add(taskId);
    // 清除之前的消息
    successMessage.value = null;
    errorMessage.value = null;
    
    // 调用接口更新状态
    await http.put(`/api/social-worker/track/log/${taskId}`, {
      id: taskId,
      completionStatus: newStatus
    });
    
    // 更新成功
    successMessage.value = '任务状态更新成功';
    // 3秒后清除成功消息
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
    
    // 重新获取跟踪详情，确保数据最新
    fetchTrackingDetail();
  } catch (err) {
    // 更新失败
    errorMessage.value = '任务状态更新失败';
    console.error('更新任务状态失败:', err);
    // 3秒后清除错误消息
    setTimeout(() => {
      errorMessage.value = null;
    }, 3000);
  } finally {
    // 从更新中的任务集合中移除
    updatingTasks.value.delete(taskId);
  }
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN');
};

// 组件挂载时获取数据
onMounted(() => {
  fetchTrackingDetail();
});
</script>

<style scoped>
.tracking-detail-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #6b7280;
  font-size: 16px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.error-message {
  color: #6b7280;
  margin-bottom: 20px;
}

.tracking-detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.basic-info-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease-in-out;
}

/* .basic-info-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
} */

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid;
}

.overview-item {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.label {
  font-weight: 500;
  color: #374151;
  min-width: 100px;
  margin-right: 12px;
}

.value {
  color: #1f2937;
  flex: 1;
}

.progress-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
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
  color: #1f2937;
  margin: 0;
}

.progress-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.progress-percentage {
  font-size: 20px;
  font-weight: 700;
  color: #4f46e5;
}

.progress-count {
  font-size: 14px;
  color: #6b7280;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-fill.progress-success {
  background-color: #10b981;
}

.progress-fill.progress-warning {
  background-color: #f59e0b;
}

.progress-fill.progress-normal {
  background-color: #4f46e5;
}

.task-breakdown {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.task-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  min-width: 80px;
}

.task-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.task-value {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.two-column-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.measures-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.measure-tag {
  padding: 4px 8px;
  background-color: #e0e7ff;
  color: #3730a3;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.main-target {
  font-size: 16px;
  color: #1f2937;
  line-height: 1.6;
  margin-bottom: 16px;
}

.ai-suggestions {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.suggestions-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  color: #6b7280;
  font-size: 14px;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.week-measure {
  margin-bottom: 20px;
}

.week-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.week-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.week-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
}

.mini-progress-bar {
  width: 80px;
  height: 4px;
  background-color: #f3f4f6;
  border-radius: 2px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background-color: #4f46e5;
  transition: width 0.3s ease;
}

.task-item {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #4f46e5;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
}

.task-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
}

.task-content {
  color: #374151;
  line-height: 1.5;
  margin-bottom: 8px;
}

.task-meta {
  font-size: 12px;
  color: #9ca3af;
}

.empty-measures {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.adjustment-card {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.adjustment-text {
  color: #374151;
  line-height: 1.6;
}

.analysis-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.adjustment-text {
  color: #374151;
  line-height: 1.6;
}

.ai-analysis-info {
  color: #374151;
}

.analysis-id {
  font-weight: 500;
  margin-bottom: 16px;
}

.evaluation-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.evaluation-content {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  font-size: 12px;
  color: #6b7280;
  overflow-x: auto;
}

/* 周分组样式 */
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

/* 干预措施项样式 */
.intervention-item {
  padding: 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 16px;
}

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

.intervention-meta {
  display: flex;
  gap: 8px;
  align-items: center;
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

/* 状态选择器样式 */
.status-selector-container {
  position: relative;
  display: inline-block;
}

.status-selector {
  padding: 6px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background-color: #FFFFFF;
  color: #1F2937;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.status-selector:hover:not(:disabled) {
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.status-selector:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.status-selector:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-selector.loading {
  opacity: 0.6;
}

/* 状态加载样式 */
.status-loading {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #E5E7EB;
  border-top: 2px solid #4F46E5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* 消息提示样式 */
.message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.success-message {
  background-color: #D1FAE5;
  color: #059669;
  border: 1px solid #A7F3D0;
}

.error-message {
  background-color: #FEE2E2;
  color: #DC2626;
  border: 1px solid #FECACA;
}

.message-icon {
  font-size: 18px;
}

.message-text {
  flex: 1;
}

.message-close {
  padding: 0;
  margin-left: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tracking-detail-container {
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
  
  .two-column-grid,
  .analysis-section {
    grid-template-columns: 1fr;
  }
  
  .task-breakdown {
    flex-direction: column;
    gap: 12px;
  }
  
  .intervention-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .intervention-info {
    width: 100%;
  }
  
  .intervention-meta {
    width: 100%;
    justify-content: flex-start;
  }
  
  .status-selector {
    min-width: 100px;
    font-size: 13px;
  }
  
  .message {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .message-close {
    align-self: flex-end;
  }
}
</style>