<template>
  <AppLayout title="AI分析详情 - CareSync AI">
    <div class="analysis-detail-container">
      <!-- 页面头部和操作栏 -->
      <div class="page-header">
        <div class="header-left">
          <Button @click="handleGoBack" variant="text" class="back-button">
            <i class="icon-back">←</i> 返回列表
          </Button>
        </div>
        <div class="header-right">
          <Button @click="handleCreateScheme" class="create-scheme-button">
            <i class="icon-scheme">📋</i> 创建服务方案
          </Button>
          <Button variant="primary" @click="handleEdit" class="edit-button">
            <i class="icon-edit">✏️</i> 编辑
          </Button>
        </div>
      </div>

      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">加载中...</p>
      </div>
      <div v-else-if="!analysisRecord" class="error-container">
        <div class="error-icon">❌</div>
        <h3 class="error-title">分析记录不存在</h3>
        <p class="error-description">找不到指定的AI分析记录，请检查是否输入了正确的ID。</p>
        <Button @click="handleGoBack">返回分析列表</Button>
      </div>

      <div v-else class="analysis-detail-content">
        <!-- 分析概览卡片 -->
        <div class="basic-info-card p-12 mb-6">
          <div class="overview-header">
            <div class="analysis-basic-info">
              <div class="analysis-type-section">
                <span :class="['analysis-type-badge', 'type-comprehensive']">
                  AI智能分析
                </span>
                <span class="analysis-date">{{ formatDate(analysisRecord.createTime) }}</span>
              </div>
              <div class="child-info-section">
                <div class="child-profile">
                  <div class="child-avatar">
                    <img :src="defaultAvatar" :alt="analysisRecord.childName" />
                  </div>
                  <div class="child-details">
                    <h2 class="child-name">{{ analysisRecord.childName }}</h2>
                    <div class="child-meta">
                      <span class="meta-item">ID: {{ analysisRecord.childId }}</span>
                      <span class="meta-item">分析ID: {{ analysisRecord.id }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="analysis-summary-section">
              <div class="summary-card">
                <dl class="summary-data">
                  <dt class="summary-label">触发类型</dt>
                  <dd class="summary-value">{{ analysisRecord.triggerType || '常规分析' }}</dd>
                  <dt class="summary-label">分析状态</dt>
                  <dd class="summary-value">
                    <span class="risk-badge risk-low">已完成</span>
                  </dd>
                  <dt class="summary-label">会话数量</dt>
                  <dd class="summary-value">{{ analysisRecord.sessionIds?.length || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- 情绪趋势图表 -->
        <div class="basic-info-card p-12 mb-6">
          <div class="card-header-title">
            <i class="icon-trend">📈</i> 情绪趋势分析
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div 
                  v-for="(item, index) in emotionTrendData" 
                  :key="index" 
                  class="chart-bar"
                >
                  <div 
                    class="bar-fill" 
                    :style="{ 
                      height: item.score + '%',
                      backgroundColor: getEmotionColor(item.score)
                    }"
                  ></div>
                  <div class="bar-label">{{ item.date }}</div>
                </div>
              </div>
            </div>
            <div class="trend-summary">
              <div class="trend-item">
                <span class="trend-label">平均情绪分数：</span>
                <span class="trend-value">{{ trendStats.avgScore }}</span>
              </div>
              <div class="trend-item">
                <span class="trend-label">最高分：</span>
                <span class="trend-value">{{ trendStats.highScore }}</span>
              </div>
              <div class="trend-item">
                <span class="trend-label">最低分：</span>
                <span class="trend-value">{{ trendStats.lowScore }}</span>
              </div>
              <div class="trend-item trend-direction">
                <span class="trend-label">趋势方向：</span>
                <span :class="['trend-direction-badge', `trend-${trendStats.direction}`]">
                  {{ getTrendDirectionText(trendStats.direction) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 关键发现 -->
        <div class="basic-info-card p-12 mb-6">
          <div class="card-header-title">
            <i class="icon-findings">🔍</i> 关键发现
          </div>
          <div v-if="keyFindings.length > 0" class="findings-list">
            <div 
              v-for="(finding, index) in keyFindings" 
              :key="index" 
              class="finding-item"
            >
              <div class="finding-icon">{{ index + 1 }}</div>
              <div class="finding-content">
                <p class="finding-text">{{ finding }}</p>
              </div>
            </div>
          </div>
          <div v-else class="no-data">
            <p>暂无关键发现</p>
          </div>
        </div>

        <!-- 情绪趋势标签 -->
        <div class="basic-info-card p-12 mb-6">
          <div class="card-header-title">
            <i class="icon-trends">📈</i> 情绪趋势标签
          </div>
          <div v-if="emotionTrendTags.length > 0" class="trends-cloud">
            <span 
              v-for="(tag, index) in emotionTrendTags" 
              :key="index" 
              class="trend-tag"
            >
              {{ tag }}
            </span>
          </div>
          <div v-else class="no-data">
            <p>暂无情绪趋势标签</p>
          </div>
        </div>

        <!-- 潜在问题和建议 -->
        <div class="risk-recommendations-section">
          <div class="basic-info-card p-12">
            <div class="card-header-title">
              <i class="icon-risk">⚠️</i> 潜在问题
            </div>
            <div class="risk-content">
              <div v-if="potentialProblems" class="potential-problems">
                <p class="problems-text">{{ potentialProblems }}</p>
              </div>
              <div v-else class="no-data">
                <p>未发现明显潜在问题</p>
              </div>
              
              <!-- 情绪分数详情 -->
              <div v-if="Object.keys(emotionScores).length > 0" class="emotion-scores-detail">
                <h4 class="section-subtitle">情绪分数详情</h4>
                <div class="scores-grid">
                  <div 
                    v-for="(score, emotion, index) in emotionScores" 
                    :key="emotion" 
                    class="score-item"
                  >
                    <div class="score-label">{{ getEmotionLabel(emotion) }}</div>
                    <div class="score-value">{{ score }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="basic-info-card p-12">
            <div class="card-header-title">
              <i class="icon-recommendations">💡</i> 干预建议
            </div>
            <div v-if="recommendations.length > 0" class="recommendations-content">
              <div 
                v-for="(recommendation, index) in recommendations" 
                :key="index" 
                class="recommendation-item"
              >
                <div class="recommendation-header">
                  <div class="recommendation-icon">💡</div>
                  <div class="recommendation-title">{{ recommendation.title }}</div>
                  <span :class="['priority-badge', `priority-${recommendation.priority?.toLowerCase()}`]">
                    {{ getPriorityText(recommendation.priority) }}
                  </span>
                </div>
                <div class="recommendation-content">
                  <p class="recommendation-description">{{ recommendation.description }}</p>
                </div>
              </div>
            </div>
            <div v-else class="no-data">
              <p>暂无建议</p>
            </div>
          </div>
        </div>

        <!-- AI结构化信息 -->
        <div class="basic-info-card p-12 mb-6" v-if="Object.keys(aiStructInfo).length > 0">
          <div class="card-header-title">
            <i class="icon-ai">🤖</i> AI结构化分析数据
          </div>
          <div class="ai-struct-content">
            <pre class="ai-struct-json">{{ JSON.stringify(aiStructInfo, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue';
import Card from '@/components/common/Card.vue';
import Button from '@/components/common/Button.vue';
import { aiAnalysisService } from '@/services/api/aiAnalysis';
import type { AiAnalysisResultVO, EmotionHistoryItem, Recommendation } from '@/types/api';

// 路由实例
const route = useRoute();
const router = useRouter();

// 加载状态
const isLoading = ref(true);

// 默认头像
const defaultAvatar = 'https://picsum.photos/60/60?random=default';

// 分析记录
const analysisRecord = ref<AiAnalysisResultVO | null>(null);

// 情绪趋势数据（从emotionHistory转换）
const emotionTrendData = computed(() => {
  if (!analysisRecord.value?.emotionHistory) return [];
  
  return analysisRecord.value.emotionHistory.map((item: EmotionHistoryItem) => {
    // 计算综合情绪分数（所有分数的平均值）
    const scores = Object.values(item.scores).filter(score => typeof score === 'number');
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
    
    return {
      date: item.date,
      happiness: item.scores.happiness || 0,
      anxiety: item.scores.anxiety || 0,
      confidence: item.scores.confidence || 0,
      stress: item.scores.stress || 0,
      score: avgScore // 综合分数用于趋势图
    };
  });
});

// 情绪分数详情（用于雷达图等）
const emotionScores = computed(() => {
  return analysisRecord.value?.emotionScores || {};
});

// 建议数据
const recommendations = computed(() => {
  return analysisRecord.value?.recommendations || [];
});

// 关键发现
const keyFindings = computed(() => {
  return analysisRecord.value?.keyFindings || [];
});

// 潜在问题
const potentialProblems = computed(() => {
  return analysisRecord.value?.potentialProblems || '';
});

// AI结构化信息
const aiStructInfo = computed(() => {
  return analysisRecord.value?.aiStructInfo || {};
});

// 情绪趋势标签
const emotionTrendTags = computed(() => {
  return analysisRecord.value?.emotionTrendTags || [];
});

// 趋势统计数据
const trendStats = computed(() => {
  if (emotionTrendData.value.length === 0) {
    return {
      avgScore: 0,
      highScore: 0,
      lowScore: 0,
      direction: 'stable'
    };
  }
  
  const scores = emotionTrendData.value.map(item => item.score);
  const avgScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  const highScore = Math.max(...scores);
  const lowScore = Math.min(...scores);
  
  // 计算趋势方向
  let direction = 'stable';
  if (emotionTrendData.value.length > 1) {
    const recentScore = emotionTrendData.value[emotionTrendData.value.length - 1].score;
    const previousScore = emotionTrendData.value[emotionTrendData.value.length - 2].score;
    if (recentScore > previousScore + 5) {
      direction = 'up';
    } else if (recentScore < previousScore - 5) {
      direction = 'down';
    }
  }
  
  return {
    avgScore,
    highScore,
    lowScore,
    direction
  };
});

// 获取分析详情
const fetchAnalysisDetail = async () => {
  try {
    isLoading.value = true;
    const id = Number(route.params.id);
    
    if (isNaN(id)) {
      throw new Error('无效的分析ID');
    }
    
    const response = await aiAnalysisService.getAnalysisDetail(id);
    console.log('获取分析详情响应:', response);
    analysisRecord.value = response;
  } catch (error) {
    console.error('获取分析详情失败:', error);
    analysisRecord.value = null;
    // 可以显示错误消息给用户
  } finally {
    isLoading.value = false;
  }
};

// 获取分析类型文本
const getAnalysisTypeText = (type: string): string => {
  const typeMap = {
    emotion: '情绪分析',
    behavior: '行为分析',
    academic: '学业分析',
    comprehensive: '综合分析'
  };
  return typeMap[type as keyof typeof typeMap] || type;
};

// 获取风险等级文本
const getRiskLevelText = (level: string): string => {
  const levelMap = {
    low: '低风险',
    medium: '中风险',
    high: '高风险'
  };
  return levelMap[level as keyof typeof levelMap] || level;
};

// 获取情绪颜色
const getEmotionColor = (score: number): string => {
  if (score >= 80) return '#22C55E';
  if (score >= 60) return '#F59E0B';
  return '#EF4444';
};

// 获取趋势方向文本
const getTrendDirectionText = (direction: string): string => {
  const directionMap = {
    up: '上升',
    down: '下降',
    stable: '稳定'
  };
  return directionMap[direction as keyof typeof directionMap] || direction;
};

// 获取建议图标
const getRecommendationIcon = (type: string): string => {
  const iconMap = {
    emotional: '❤️',
    behavioral: '🧠',
    academic: '📚',
    social: '👥',
    environmental: '🏠'
  };
  return iconMap[type as keyof typeof iconMap] || '💡';
};

// 获取优先级文本
const getPriorityText = (priority: string): string => {
  const priorityMap = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  };
  return priorityMap[priority as keyof typeof priorityMap] || priority;
};

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 获取情绪标签文本
const getEmotionLabel = (emotion: string): string => {
  const emotionMap: Record<string, string> = {
    'happiness': '快乐',
    'anxiety': '焦虑',
    'confidence': '自信',
    'stress': '压力',
    'sadness': '悲伤',
    'anger': '愤怒',
    'fear': '恐惧',
    'surprise': '惊讶'
  };
  return emotionMap[emotion] || emotion;
};

// 返回上一页
const handleGoBack = () => {
  router.push('/analysis');
};

// 编辑分析
const handleEdit = () => {
  router.push(`/analysis/edit/${route.params.id}`);
};

// 创建服务方案
const handleCreateScheme = () => {
  if (analysisRecord.value) {
    router.push(`/schemes/create?childId=${analysisRecord.value.childId}`);
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  fetchAnalysisDetail();
});
</script>

<style scoped>
.basic-info-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease-in-out;
}



.analysis-detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-right {
  display: flex;
  gap: 12px;
}

/* 加载和错误状态 */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #E5E7EB;
  border-top: 3px solid #4F46E5;
  border-radius: 50%;
  margin-bottom: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text,
.error-description {
  color: #6B7280;
  font-size: 16px;
  margin-bottom: 20px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 12px 0;
}

/* 分析概览卡片 */
.analysis-overview-card {
  margin-bottom: 24px;
}

.overview-header {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.analysis-basic-info {
  flex: 1;
}

.analysis-type-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.analysis-type-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.type-emotion {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4F46E5;
}

.type-behavior {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.type-academic {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.type-comprehensive {
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.analysis-date {
  color: #6B7280;
  font-size: 14px;
}

.child-info-section {
  margin-top: 16px;
}

.child-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.child-avatar {
  width: 60px;
  height: 60px;
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
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.child-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  color: #6B7280;
  font-size: 14px;
}

.analysis-summary-section {
  min-width: 280px;
}

.summary-card {
  background-color: #F9FAFB;
  padding: 20px;
  border-radius: 12px;
}

.summary-data {
  margin: 0;
  padding: 0;
}

.summary-data dt {
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 4px;
}

.summary-data dd {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.summary-data .emotion-score {
  color: #4F46E5;
  font-size: 24px;
  font-weight: 700;
}

.risk-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.risk-low {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.risk-medium {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.risk-high {
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

/* 图表和数据卡片 */
.card-header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.emotion-trend-card {
  margin-bottom: 24px;
}

.chart-container {
  display: flex;
  gap: 32px;
  align-items: center;
}

.chart-placeholder {
  flex: 1;
  height: 300px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 20px 0;
}

.chart-bars {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 80px;
}

.bar-fill {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}

.bar-label {
  font-size: 12px;
  color: #6B7280;
  text-align: center;
}

.trend-summary {
  min-width: 240px;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #E5E7EB;
}

.trend-label {
  color: #6B7280;
  font-size: 14px;
}

.trend-value {
  font-weight: 600;
  color: #1F2937;
  font-size: 16px;
}

.trend-direction-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.trend-up {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.trend-down {
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.trend-stable {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6B7280;
}

/* 发现和关键词区域 */
.findings-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.key-findings-card,
.keywords-card {
  height: 100%;
}

.findings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.finding-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.finding-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #4F46E5;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}

.finding-content {
  flex: 1;
}

.finding-text {
  margin: 0;
  color: #374151;
  line-height: 1.6;
}

.keywords-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 0;
}

.keyword-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background-color: #F3F4F6;
  color: #6B7280;
  transition: transform 0.2s ease;
}

.keyword-tag:hover {
  transform: scale(1.05);
}

.keyword-high {
  font-size: 20px;
  color: #4F46E5;
  background-color: rgba(79, 70, 229, 0.1);
}

.keyword-medium {
  font-size: 16px;
  color: #22C55E;
  background-color: rgba(34, 197, 94, 0.1);
}

.keyword-low {
  font-size: 14px;
  color: #6B7280;
  background-color: rgba(107, 114, 128, 0.1);
}

/* 风险和建议区域 */
.risk-recommendations-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.risk-assessment-card,
.recommendations-card {
  height: 100%;
}

.risk-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.risk-score-container {
  text-align: center;
}

.risk-score {
  font-size: 64px;
  font-weight: 700;
  color: #4F46E5;
  line-height: 1;
  margin-bottom: 16px;
}

.risk-scale {
  padding: 0 20px;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.scale-label {
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
}

.scale-bar {
  height: 8px;
  background-color: #E5E7EB;
  border-radius: 4px;
  position: relative;
}

.risk-indicator {
  position: absolute;
  top: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #4F46E5;
  border: 4px solid #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: left 0.5s ease;
}

.risk-factors {
  margin-top: 16px;
}

.section-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 12px 0;
}

.risk-factors-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.risk-factor-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #E5E7EB;
}

.factor-label {
  color: #374151;
  font-size: 14px;
}

.factor-score {
  color: #6B7280;
  font-size: 13px;
  font-weight: 500;
}

.recommendations-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-item {
  background-color: #F9FAFB;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #4F46E5;
}

.recommendation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.recommendation-icon {
  font-size: 18px;
}

.recommendation-title {
  font-weight: 600;
  color: #1F2937;
  flex: 1;
}

.priority-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.priority-high {
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.priority-medium {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.priority-low {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.recommendation-description {
  margin: 0;
  color: #6B7280;
  font-size: 14px;
  line-height: 1.6;
}

/* 详细报告 */
.analysis-report-card {
  margin-bottom: 24px;
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #E5E7EB;
}

.report-paragraph {
  margin: 0;
  color: #374151;
  line-height: 1.8;
  font-size: 15px;
}

/* AI结构化信息 */
.ai-struct-card {
  margin-bottom: 24px;
}

.ai-struct-content {
  max-height: 400px;
  overflow-y: auto;
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
}

.ai-struct-json {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 潜在问题样式 */
.potential-problems {
  margin-bottom: 16px;
}

.problems-text {
  margin: 0;
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
}

/* 情绪分数详情样式 */
.emotion-scores-detail {
  margin-top: 20px;
}

.section-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 12px 0;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.score-item {
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

.score-label {
  font-size: 12px;
  color: #64748B;
  margin-bottom: 4px;
}

.score-value {
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
}

/* 无数据状态样式 */
.no-data {
  text-align: center;
  padding: 32px 16px;
  color: #64748B;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .overview-header {
    flex-direction: column;
    gap: 24px;
  }
  
  .analysis-summary-section {
    min-width: auto;
  }
  
  .chart-container {
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }
  
  .trend-summary {
    min-width: auto;
  }
  
  .findings-section,
  .risk-recommendations-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analysis-detail-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .child-profile {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .child-meta {
    flex-direction: column;
    gap: 4px;
  }
  
  .chart-placeholder {
    height: 200px;
  }
  
  .risk-factor-item {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .child-name {
    font-size: 20px;
  }
  
  .risk-score {
    font-size: 48px;
  }
  
  .header-right {
    flex-wrap: wrap;
  }
  
  .chart-bar {
    max-width: 40px;
  }
  
  .bar-label {
    font-size: 10px;
  }
}
</style>