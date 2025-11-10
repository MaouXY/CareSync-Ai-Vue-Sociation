<template>
  <div class="work-home">
    <!-- 页眉 -->
    <WorkHeader />
    
    <!-- 主要内容区域 -->
    <main class="work-main-content">
      <div class="work-container">
        <!-- 欢迎信息 -->
        <div class="welcome-section">
          <h1 class="welcome-title">欢迎回来，{{ userName }}社工</h1>
          <p class="welcome-subtitle">
            今天是 {{ currentDate }}，已有 {{ currentChildCount }} 名儿童等待您的关注
          </p>
        </div>

        <!-- 统计卡片区域 -->
        <div class="statistics-section">
          <div class="statistics-grid">
            <div 
              v-for="stat in statistics" 
              :key="stat.key"
              class="statistics-card"
              :class="`statistics-card-${stat.theme}`"
            >
              <div class="statistics-card-header">
                <h3 class="statistics-card-title">{{ stat.title }}</h3>
                <div class="statistics-card-icon" :class="`statistics-icon-${stat.theme}`">
                  <i :class="stat.icon"></i>
                </div>
              </div>
              <div class="statistics-card-content">
                <div class="statistics-value-row">
                  <span class="statistics-value">{{ stat.value }}</span>
                  <span v-if="stat.change" class="statistics-change" :class="`statistics-change-${stat.changeType}`">
                    <i :class="stat.changeType === 'up' ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i>
                    {{ stat.change }}
                  </span>
                </div>
                <p class="statistics-description">{{ stat.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="charts-section">
          <div class="charts-grid">
            <!-- 情绪趋势图 -->
            <div class="chart-card chart-card-large">
              <div class="chart-header">
                <div class="chart-title-section">
                  <h3 class="chart-title">儿童情感趋势分析</h3>
                  <p class="chart-subtitle">显示所有服务儿童的整体情绪状态分布趋势</p>
                </div>
                <div class="chart-tabs">
                  <button 
                    v-for="tab in chartTabs" 
                    :key="tab.key"
                    :class="['chart-tab', { 'chart-tab-active': activeChartTab === tab.key }]"
                    @click="activeChartTab = tab.key"
                  >
                    {{ tab.label }}
                  </button>
                </div>
              </div>
              <div ref="emotionChartRef" class="chart-container"></div>
              <!-- 数据摘要 -->
              <div class="chart-summary">
                <div class="summary-item" v-for="summary in chartSummaries" :key="summary.label">
                  <p class="summary-label">{{ summary.label }}</p>
                  <p class="summary-value" :class="`summary-value-${summary.type}`">{{ summary.value }}</p>
                </div>
              </div>
            </div>

            <!-- 能力分布图（替换为饼图） -->
            <div class="chart-card">
              <h3 class="chart-title">能力分布情况</h3>
              <div ref="pieChartRef" class="chart-container"></div>
            </div>
          </div>
        </div>

        <!-- 待处理任务和近期活动 -->
        <div class="content-section">
          <div class="content-grid">
            <!-- 待处理任务 -->
            <div class="content-card">
              <div class="content-card-header">
                <h3 class="content-card-title">待处理任务</h3>
                <a href="#" class="content-card-link" @click="viewAllTasks">查看全部</a>
              </div>
              <div v-if="homeData?.pendingTasks?.length" class="task-list">
                <div
                  v-for="task in homeData.pendingTasks"
                  :key="task.id"
                  class="task-item"
                  :class="`task-item-${getTaskPriority(task)}`"
                >
                  <div class="task-info">
                    <div class="task-header">
                      <div class="task-icon">
                        <i :class="getTaskIcon(task)"></i>
                      </div>
                      <div class="task-details">
                        <h4 class="task-title">{{ task.childName }} - {{ task.target }}</h4>
                        <p class="task-meta">儿童：{{ task.childName }}</p>
                      </div>
                    </div>
                    <div class="task-content">
                      <p class="task-description">{{ getTaskDescription(task) }}</p>
                    </div>
                    <div class="task-footer">
                      <span class="task-time">{{ formatDate(task.endTime) }}</span>
                      <div class="task-actions">
                        <button class="btn btn-outline" @click="postponeTask(task)">
                          稍后处理
                        </button>
                        <button class="btn btn-primary" @click="handleTask(task)">
                          立即处理
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="task-priority">
                    <span :class="`task-priority-badge task-priority-${getTaskPriority(task)}`">
                      {{ getTaskPriorityText(task) }}
                    </span>
                  </div>
                </div>
              </div>
              <a-empty v-else description="暂无待办任务" />
            </div>

            <!-- 近期活动 -->
            <div class="content-card">
              <div class="content-card-header">
                <h3 class="content-card-title">近期活动</h3>
                <a href="#" class="content-card-link" @click="viewAllActivities">查看全部</a>
              </div>
              <div v-if="homeData?.recentActivities?.length" class="activity-list">
                <div
                  v-for="(activity, index) in homeData.recentActivities"
                  :key="activity.id"
                  class="activity-item"
                >
                  <div class="activity-timeline">
                    <div class="activity-dot" :class="`activity-dot-${getActivityType(activity)}`">
                      <i :class="getActivityIcon(activity)"></i>
                    </div>
                    <div v-if="index < homeData.recentActivities.length - 1" class="activity-line"></div>
                  </div>
                  <div class="activity-content">
                    <div class="activity-header">
                      <h4 class="activity-title">{{ activity.childName }} - 第{{ activity.week }}周</h4>
                      <span class="activity-time">{{ formatRelativeTime(activity.createTime) }}</span>
                    </div>
                    <p class="activity-description">{{ activity.recordContent }}</p>
                  </div>
                </div>
              </div>
              <a-empty v-else description="暂无最近活动" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 加载状态 -->
    <a-spin :loading="loading" class="page-loading">
      <div></div>
    </a-spin>

    <!-- 错误信息 -->
    <a-result
      v-if="error"
      status="error"
      :title="error"
      class="error-result"
    >
      <template #extra>
        <a-button type="primary" @click="loadData">重试</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { 
  IconUser, 
  IconClockCircle, 
  IconCheckCircle, 
  IconRobot 
} from '@arco-design/web-vue/es/icon';
//import { message } from '@arco-design/web-vue/es/message';
import * as echarts from 'echarts';

import WorkHeader from '@/components/layout/WorkHeader.vue';
import { socialWorkerApi } from '@/services/api/socialWorker';
import { useAuthStore } from '@/stores';
import type { SocialWorkerHomeVO } from '@/types/api';

// 状态管理
const authStore = useAuthStore();

// 初始化认证状态，从本地存储恢复用户信息
authStore.initialize();

// 响应式数据
const homeData = ref<SocialWorkerHomeVO | null>(null);
const loading = ref(false);
const error = ref('');
const emotionChartRef = ref<HTMLElement>();
const pieChartRef = ref<HTMLElement>();
const activeChartTab = ref('week');

// 图表实例
let emotionChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;

// 计算属性
const userName = computed(() => {
  return authStore.userName || '李';
});

const currentDate = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[now.getDay()];
  
  return `${year}年${month}月${day}日 ${weekday}`;
});

const currentChildCount = computed(() => {
  return homeData.value?.statistics.childCount || 0;
});

// 统计数据
const statistics = computed(() => [
  {
    key: 'childCount',
    title: '服务儿童',
    value: homeData.value?.statistics.childCount || 0,
    icon: 'fa fa-child',
    theme: 'primary',
    change: '12%',
    changeType: 'up',
    description: '相比上月增长'
  },
  {
    key: 'pendingTaskCount',
    title: '待处理任务',
    value: homeData.value?.statistics.pendingTaskCount || 0,
    icon: 'fa fa-tasks',
    theme: 'accent',
    change: '8%',
    changeType: 'up',
    description: '相比上月增长'
  },
  {
    key: 'completedSchemeCount',
    title: '已完成方案',
    value: homeData.value?.statistics.completedSchemeCount || 0,
    icon: 'fa fa-check-circle',
    theme: 'secondary',
    change: '15%',
    changeType: 'up',
    description: '完成率 85%'
  },
  {
    key: 'aiAnalysisCount',
    title: 'AI分析结果',
    value: homeData.value?.statistics.aiAnalysisCount || 0,
    icon: 'fa fa-bar-chart',
    theme: 'primary',
    change: '20%',
    changeType: 'up',
    description: '本月新增'
  }
]);

// 图表标签
const chartTabs = [
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' }
];

// 图表摘要
const chartSummaries = [
  { label: '平均积极情绪', value: '82%', type: 'success' },
  { label: '情绪稳定性', value: '76%', type: 'primary' },
  { label: '需关注儿童', value: '3人', type: 'danger' }
];

// 方法
const loadData = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    console.log('开始加载社工首页数据...');
    homeData.value = await socialWorkerApi.getHomeData();
    console.log('首页数据加载成功:', homeData.value);
    
    // 等待DOM更新后渲染图表
    await nextTick();
    renderCharts();
    
  } catch (err) {
    console.error('加载首页数据失败:', err);
    error.value = err instanceof Error ? err.message : '加载数据失败';
    message.error('加载数据失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 渲染图表
const renderCharts = () => {
  if (!homeData.value) return;
  
  renderEmotionChart();
  renderPieChart();
};

// 渲染情绪趋势图
const renderEmotionChart = () => {
  if (!emotionChartRef.value || !homeData.value?.emotionChartData) return;
  
  const chartData = homeData.value.emotionChartData;
  const timeAxis = homeData.value.emotionChartTimeAxis;
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: chartData.map(item => item.name),
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeAxis,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100
    },
    series: chartData.map(item => ({
      name: item.name,
      type: 'line',
      stack: false,
      data: item.data,
      smooth: true,
      lineStyle: {
        width: 2
      }
    }))
  };
  
  if (emotionChart) {
    emotionChart.dispose();
  }
  emotionChart = echarts.init(emotionChartRef.value);
  emotionChart.setOption(option);
};

// 渲染饼图（替换雷达图）
const renderPieChart = () => {
  if (!pieChartRef.value || !homeData.value?.radarChartData) return;
  
  const radarData = homeData.value.radarChartData;
  const pieData = Object.keys(radarData).map(key => ({
    name: key,
    value: radarData[key]
  }));
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: pieData.map(item => item.name)
    },
    series: [
      {
        name: '能力分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: pieData,
        color: ['#4F46E5', '#10B981', '#F97316', '#8B5CF6', '#F59E0B']
      }
    ]
  };
  
  if (pieChart) {
    pieChart.dispose();
  }
  pieChart = echarts.init(pieChartRef.value);
  pieChart.setOption(option);
};

// 任务相关方法
const getTaskPriority = (task: any) => {
  if (task.remainingDays <= 1) return 'urgent';
  if (task.remainingDays <= 3) return 'warning';
  return 'normal';
};

const getTaskIcon = (task: any) => {
  const priority = getTaskPriority(task);
  const iconMap = {
    urgent: 'fa fa-bell',
    warning: 'fa fa-file-text-o',
    normal: 'fa fa-calendar-check-o'
  };
  return iconMap[priority] || 'fa fa-tasks';
};

const getTaskPriorityText = (task: any) => {
  const priority = getTaskPriority(task);
  const textMap = {
    urgent: '紧急',
    warning: '待审核',
    normal: '常规'
  };
  return textMap[priority] || '常规';
};

const getTaskDescription = (task: any) => {
  const priority = getTaskPriority(task);
  const descMap = {
    urgent: `${task.childName}报告身体不适，需要尽快联系确认情况。`,
    warning: `AI已生成${task.childName}的服务方案，等待您的审核确认。`,
    normal: `${task.childName}的服务方案已实施两周，需要更新跟踪记录。`
  };
  return descMap[priority] || `需要处理${task.target}相关事务。`;
};

const handleTask = (task: any) => {
  message.info(`处理任务: ${task.target}`);
  // 这里可以跳转到任务详情页或打开任务处理弹窗
};

const postponeTask = (task: any) => {
  message.info(`稍后处理任务: ${task.target}`);
};

// 活动相关方法
const getActivityType = (activity: any) => {
  // 根据活动内容判断类型
  const content = activity.recordContent.toLowerCase();
  if (content.includes('完成') || content.includes('成功')) return 'success';
  if (content.includes('新增') || content.includes('添加')) return 'info';
  if (content.includes('分析') || content.includes('报告')) return 'accent';
  return 'default';
};

const getActivityIcon = (activity: any) => {
  const type = getActivityType(activity);
  const iconMap = {
    success: 'fa fa-check',
    info: 'fa fa-user-plus',
    accent: 'fa fa-file-text-o',
    default: 'fa fa-circle'
  };
  return iconMap[type] || 'fa fa-circle';
};

// 通用方法
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  const years = now.getFullYear() - date.getFullYear();

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatMonthDay = (date: Date) => {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatYearMonth = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  // 超过一年：显示年份和月份
  if (years >= 1) {
    return formatYearMonth(date);
  }
  
  // 超过三天：显示月日
  if (days > 3) {
    return formatMonthDay(date);
  }
  
  // 三天内：显示相对时间
  if (days === 0) {
    return `今天 ${formatTime(date)}`;
  } else if (days === 1) {
    return `昨天 ${formatTime(date)}`;
  } else if (days === 2) {
    return `前天 ${formatTime(date)}`;
  } else {
    return formatMonthDay(date);
  }
};

const viewAllTasks = () => {
  message.info('跳转到任务列表页');
  // 跳转到任务列表页面
};

const viewAllActivities = () => {
  message.info('跳转到活动列表页');
  // 跳转到活动列表页面
};

// 响应式处理
const handleResize = () => {
  if (emotionChart) {
    emotionChart.resize();
  }
  if (pieChart) {
    pieChart.resize();
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize);
});

// 组件卸载时清理
onMounted(() => {
  return () => {
    window.removeEventListener('resize', handleResize);
    if (emotionChart) {
      emotionChart.dispose();
    }
    if (pieChart) {
      pieChart.dispose();
    }
  };
});
</script>

<style scoped>
.work-home {
  min-height: 100vh;
  background: var(--light);
}

.work-main-content {
  padding-top: 72px; /* Header高度 */
  min-height: 100vh;
}

.work-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* 欢迎信息区域 */
.welcome-section {
  margin-bottom: 2rem;
}

.welcome-title {
  margin: 0 0 0.25rem 0;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--dark);
  line-height: 1.2;
}

.welcome-subtitle {
  margin: 0;
  color: var(--neutral);
  font-size: 1rem;
  line-height: 1.5;
}

/* 统计卡片区域 */
.statistics-section {
  margin-bottom: 2rem;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.statistics-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.statistics-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary);
  opacity: 0.8;
}

.statistics-card-primary::before {
  background: var(--primary);
}

.statistics-card-accent::before {
  background: var(--accent);
}

.statistics-card-secondary::before {
  background: var(--secondary);
}

.statistics-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.statistics-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.statistics-card-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--neutral);
}

.statistics-card-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.statistics-icon-primary {
  background:var(--primary);
}

.statistics-icon-accent {
  background: var(--accent);
}

.statistics-icon-secondary {
  background: var(--secondary);
}

.statistics-card-content {
  margin-top: 0.5rem;
}

.statistics-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.statistics-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark);
  line-height: 1;
}

.statistics-change {
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.statistics-change-up {
  color: var(--success);
}

.statistics-change-down {
  color: var(--danger);
}

.statistics-description {
  margin: 0;
  font-size: 0.75rem;
  color: var(--neutral);
}

/* 图表区域 */
.charts-section {
  margin-bottom: 2rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.chart-card-large {
  grid-column: span 1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.chart-title-section {
  flex: 1;
}

.chart-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--dark);
}

.chart-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--neutral);
  line-height: 1.4;
}

.chart-tabs {
  display: flex;
  gap: 0.5rem;
}

.chart-tab {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 9999px;
  background: var(--light);
  color: var(--neutral);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-tab:hover {
  background: rgba(79, 70, 229, 0.1);
  color: var(--primary);
}

.chart-tab-active {
  background: var(--primary);
  color: white;
}

.chart-container {
  width: 100%;
  height: 300px;
  margin-bottom: 1rem;
}

.chart-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.summary-item {
  text-align: center;
}

.summary-label {
  margin: 0 0 0.25rem 0;
  font-size: 0.75rem;
  color: var(--neutral);
}

.summary-value {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.summary-value-success {
  color: var(--success);
}

.summary-value-primary {
  color: var(--primary);
}

.summary-value-danger {
  color: var(--danger);
}

/* 内容区域 */
.content-section {
  margin-bottom: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.content-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.content-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.content-card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--dark);
}

.content-card-link {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.875rem;
}

.content-card-link:hover {
  text-decoration: underline;
}

/* 任务列表 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

/* 美化任务列表滚动条 */
.task-list::-webkit-scrollbar {
  width: 6px;
}

.task-list::-webkit-scrollbar-track {
  background: var(--light);
  border-radius: 3px;
}

.task-list::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.3);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.task-list::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.5);
}

/* Firefox浏览器滚动条样式 */
.task-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(79, 70, 229, 0.3) var(--light);
}

.task-item {
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.task-item:hover {
  border-color: rgba(79, 70, 229, 0.3);
  background: rgba(79, 70, 229, 0.02);
}

.task-item-urgent {
  border-left: 4px solid var(--danger);
}

.task-item-warning {
  border-left: 4px solid var(--warning);
}

.task-item-normal {
  border-left: 4px solid var(--neutral);
}

.task-info {
  flex: 1;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.task-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
}

.task-item-urgent .task-icon {
  background: var(--danger);
}

.task-item-warning .task-icon {
  background: var(--warning);
}

.task-item-normal .task-icon {
  background: var(--neutral);
}

.task-details {
  flex: 1;
}

.task-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark);
  line-height: 1.3;
}

.task-meta {
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: var(--neutral);
}

.task-content {
  margin: 0.5rem 0;
}

.task-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--neutral);
  line-height: 1.4;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
}

.task-time {
  font-size: 0.75rem;
  color: var(--neutral);
}

.task-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

/* 取消按钮焦点边框 */
.btn:focus {
  outline: none;
  box-shadow: none;
}

.btn:active {
  transform: none;
}

.task-priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.task-priority-urgent {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.task-priority-warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.task-priority-normal {
  background: rgba(107, 114, 128, 0.1);
  color: var(--neutral);
}

/* 活动列表 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
}

/* 美化活动列表滚动条 */
.activity-list::-webkit-scrollbar {
  width: 6px;
}

.activity-list::-webkit-scrollbar-track {
  background: var(--light);
  border-radius: 3px;
}

.activity-list::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.3);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.activity-list::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.5);
}

/* Firefox浏览器滚动条样式 */
.activity-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(79, 70, 229, 0.3) var(--light);
}

.activity-item {
  display: flex;
  gap: 1rem;
  position: relative;
}

.activity-timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.activity-dot {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  z-index: 2;
}

.activity-dot-success {
  background: var(--primary);
}

.activity-dot-info {
  background: var(--secondary);
}

.activity-dot-accent {
  background: var(--accent);
}

.activity-dot-default {
  background: var(--neutral);
}

.activity-line {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: calc(100% + 1rem);
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.activity-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark);
}

.activity-time {
  font-size: 0.75rem;
  color: var(--neutral);
  white-space: nowrap;
}

.activity-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--neutral);
  line-height: 1.4;
}

/* 加载和错误状态 */
.page-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.error-result {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.btn-primary:hover {
  background: #4338CA;
  border-color: #4338CA;
}

.btn-outline {
  background: transparent;
  color: var(--neutral);
  border-color: #D1D5DB;
}

.btn-outline:hover {
  color: var(--primary);
  border-color: var(--primary);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card-large {
    grid-column: span 1;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .work-container {
    padding: 1rem;
  }
  
  .statistics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .chart-tabs {
    justify-content: center;
  }
  
  .chart-summary {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .task-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .task-actions {
    justify-content: stretch;
  }
  
  .task-actions .btn {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .work-main-content {
    padding-top: 64px;
  }
  
  .statistics-grid {
    grid-template-columns: 1fr;
  }
  
  .statistics-card {
    padding: 1rem;
  }
  
  .chart-card {
    padding: 1rem;
    min-height: 350px;
  }
  
  .content-card {
    padding: 1rem;
  }
  
  .task-item {
    padding: 0.75rem;
  }
  
  .activity-item {
    gap: 0.75rem;
  }
  
  .activity-dot {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.625rem;
  }
}
</style>