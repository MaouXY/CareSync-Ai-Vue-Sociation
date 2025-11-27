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

        <!-- 服务措施和AI分析 -->
        <div class="basic-info-card p-12" v-if="trackingDetail?.workerAdjustReason || trackingDetail?.aiAnalysisId">
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
              <div class="measures-details" v-if="trackingDetail?.measuresSuggest && trackingDetail.measuresSuggest.length > 0">
                <div 
                  v-for="(weekMeasure, weekIndex) in trackingDetail?.measuresSuggest" 
                  :key="weekIndex" 
                  class="week-measure"
                >
                  <h4 class="week-title">{{ weekMeasure.week }}</h4>
                  <div class="measure-tasks">
                    <div 
                      v-for="(task, taskIndex) in weekMeasure.details" 
                      :key="taskIndex" 
                      class="task-item"
                    >
                      <div class="task-header">
                        <span class="task-number">{{ taskIndex + 1 }}</span>
                        <span 
                          :class="['task-status', `status-${task.status?.toLowerCase()}`]"
                          :style="{
                            backgroundColor: getStatusColor(task.status || '').bg,
                            color: getStatusColor(task.status || '').color,
                            borderColor: getStatusColor(task.status || '').border
                          }"
                        >
                          {{ getStatusText(task.status) }}
                        </span>
                      </div>
                      <div class="task-content">{{ task.content }}</div>
                      <div class="task-meta">
                        <span class="task-id">ID: {{ task.assist_track_log_id }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- <Card class="ai-analysis-card" v-if="trackingDetail?.aiAnalysisId">
            <div class="card-header">
              <h2 class="card-title">AI分析</h2>
            </div>
            <div class="card-content">
              <div class="ai-analysis-info">
                <p class="analysis-id">AI分析ID: {{ trackingDetail?.aiAnalysisId }}</p>
                <div class="evaluation-index" v-if="trackingDetail?.evaluationIndex && Object.keys(trackingDetail.evaluationIndex).length > 0">
                  <h4 class="evaluation-title">评估指标</h4>
                  <div class="evaluation-details">
                    <pre class="evaluation-content">{{ JSON.stringify(trackingDetail.evaluationIndex, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </Card> -->
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
    trackingDetail.value = response;
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

.week-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
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
  text-align: right;
}

.task-id {
  font-size: 12px;
  color: #9ca3af;
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
}
</style>