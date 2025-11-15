<template>
  <div class="tracking-list-container">
    <WorkHeader />
    <main class="tracking-main-content">
      <!-- 页面标题和操作栏 -->
      <div class="page-header pt-4">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 class="page-title">服务跟踪管理</h1>
            <p class="page-subtitle">实时跟踪所有服务方案的执行进度，支持数据可视化和详情查看</p>
          </div>
          <div class="flex items-center ml-auto space-x-4 mt-4 sm:mt-0">
            <a-button 
              id="exportBtn" 
              type="primary"
              class="btn btn-primary"
              @click="handleExport"
            >
              <template #icon>
                <icon-plus />
              </template>
              导出进度报告
            </a-button>
          </div>
        </div>
      </div>

      <!-- 数据概览卡片 -->
      <div class="stats-grid">
        <div class="stats-card">
          <div class="stats-card-content">
            <div class="stats-info">
              <p class="stats-label">总方案数</p>
              <h3 class="stats-value">{{ totalSchemes }}</h3>
            </div>
            <div class="stats-icon bg-primary">
              <icon-file />
            </div>
          </div>
          <div class="stats-footer">
            <span class="stats-trend text-success">
              <icon-arrow-up />
              12%
            </span>
            <span class="stats-note">较上月</span>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-card-content">
            <div class="stats-info">
              <p class="stats-label">进行中方案</p>
              <h3 class="stats-value">{{ inProgressSchemes }}</h3>
            </div>
            <div class="stats-icon bg-secondary">
              <icon-loading />
            </div>
          </div>
          <div class="stats-footer">
            <span class="stats-trend text-success">
              <icon-arrow-up />
              8%
            </span>
            <span class="stats-note">较上月</span>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-card-content">
            <div class="stats-info">
              <p class="stats-label">已完成方案</p>
              <h3 class="stats-value">{{ completedSchemes }}</h3>
            </div>
            <div class="stats-icon bg-success">
              <icon-check-circle />
            </div>
          </div>
          <div class="stats-footer">
            <span class="stats-trend text-success">
              <icon-arrow-up />
              15%
            </span>
            <span class="stats-note">较上月</span>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-card-content">
            <div class="stats-info">
              <p class="stats-label">平均完成率</p>
              <h3 class="stats-value">{{ averageCompletionRate }}%</h3>
            </div>
            <div class="stats-icon bg-warning">
              <icon-bar-chart />
            </div>
          </div>
          <div class="stats-footer">
            <span class="stats-trend text-danger">
              <icon-arrow-down />
              3%
            </span>
            <span class="stats-note">较上月</span>
          </div>
        </div>
      </div>

      <!-- 进度统计图表 -->
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">方案状态分布</h3>
            <div class="chart-controls">
              <select class="chart-select" v-model="statusChartPeriod" @change="updateStatusChart">
                <option value="30">近30天</option>
                <option value="90">近90天</option>
                <option value="365">全年</option>
              </select>
            </div>
          </div>
          <div class="chart-container">
            <canvas ref="statusChartRef"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">服务进度趋势</h3>
            <div class="chart-controls">
              <select class="chart-select" v-model="progressChartPeriod" @change="updateProgressChart">
                <option value="8">近8周</option>
                <option value="12">近12周</option>
                <option value="24">近24周</option>
              </select>
            </div>
          </div>
          <div class="chart-container">
            <canvas ref="progressChartRef"></canvas>
          </div>
        </div>
      </div>
      
      <!-- 搜索和筛选 -->
      <div class="search-filters-card">
        <div class="filters-header">
          <h3 class="filters-title">筛选条件</h3>
          <div class="filters-actions">
            <a-button type="outline" size="small" @click="handleReset" class="reset-btn">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
            <a-button type="primary" size="small" @click="handleSearch" class="search-btn">
              <template #icon>
                <icon-search />
              </template>
              筛选
            </a-button>
          </div>
        </div>
        
        <div class="filters-content">
          <!-- 主要筛选条件 -->
          <div class="main-filters">
            <div class="filter-group">
              <label class="filter-label">方案名称/儿童姓名</label>
              <a-input 
                v-model="searchParams.name"
                placeholder="请输入方案名称或儿童姓名" 
                class="search-input-primary"
                @keyup.enter="handleSearch"
                allow-clear
              >
                <template #prefix>
                  <icon-search />
                </template>
              </a-input>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">方案状态</label>
              <a-select
                v-model="searchParams.schemeStatus"
                placeholder="请选择方案状态"
                allow-clear
                class="filter-select-primary"
                @change="handleSearch"
              >
                <a-option value="">所有方案状态</a-option>
                <a-option value="IN_PROGRESS">进行中</a-option>
                <a-option value="COMPLETED">已完成</a-option>
                <a-option value="PENDING">待审核</a-option>
                <a-option value="DELAYED">已延迟</a-option>
                <a-option value="PAUSED">已暂停</a-option>
              </a-select>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">方案类型</label>
              <a-select
                v-model="searchParams.schemeType"
                placeholder="请选择方案类型"
                allow-clear
                class="filter-select-primary"
                @change="handleSearch"
              >
                <a-option value="">所有方案类型</a-option>
                <a-option value="emotional">情感陪伴</a-option>
                <a-option value="educational">教育支持</a-option>
                <a-option value="behavioral">行为引导</a-option>
                <a-option value="family">家庭沟通</a-option>
                <a-option value="comprehensive">综合服务</a-option>
              </a-select>
            </div>
          </div>

          <!-- 日期筛选 -->
          <div class="date-filters">
            <div class="filter-group">
              <label class="filter-label">开始日期</label>
              <a-input 
                v-model="searchParams.startDate"
                type="date"
                placeholder="开始日期"
                class="date-input"
                @keyup.enter="handleSearch"
                allow-clear
              />
            </div>
            <div class="filter-group">
              <label class="filter-label">结束日期</label>
              <a-input 
                v-model="searchParams.endDate"
                type="date"
                placeholder="结束日期"
                class="date-input"
                @keyup.enter="handleSearch"
                allow-clear
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 服务跟踪列表 -->
      <div class="table-wrapper">
        <a-space direction="vertical" size="large" fill>
          <a-table
            row-key="id"
            :columns="columns"
            :data="trackingData"
            :loading="isLoading"
            :pagination="false"
            :row-selection="rowSelection"
            v-model:selectedKeys="selectedIds"
          />
        </a-space>
        
        <!-- 增强版分页组件 -->
        <div v-if="!isLoading && trackingData.length > 0">
          <EnhancedPagination
            v-model:currentPage="currentPage"
            v-model:pageSize="pageSize"
            :total="total"
            :pageSizeOptions="[5, 10, 20, 30, 50]"
            showTotal
            showJumper
            showSizeChanger
            @change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, h } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import type { TableColumnData } from '@arco-design/web-vue';
import { http } from '@/services/api';
import EnhancedPagination from '@/components/common/EnhancedPagination.vue';
import WorkHeader from '@/components/layout/WorkHeader.vue';
import { 
  IconRefresh,
  IconPlus,
  IconEye,
  IconDelete,
  IconSearch,
  IconArrowDown,
  IconArrowUp,
  IconFilter,
  IconLoading,
  IconCheckCircle,
  IconBarChart,
} from '@arco-design/web-vue/es/icon'

// 路由
const router = useRouter();

// 响应式数据
const isLoading = ref(false);
const trackingData = ref<any[]>([]);
const total = ref(0);
const selectedIds = ref<string[]>([]);

// 统计数据
const totalSchemes = ref(32);
const inProgressSchemes = ref(18);
const completedSchemes = ref(10);
const averageCompletionRate = ref(83);

// 图表相关
const statusChartRef = ref<HTMLCanvasElement>();
const progressChartRef = ref<HTMLCanvasElement>();
const statusChartPeriod = ref('30');
const progressChartPeriod = ref('8');

// 搜索参数
const searchParams = reactive<any>({
  childId: null,
  workerId: null,
  target: '',
  name: '',
  schemeStatus: '',
  schemeType: '',
  startDate: '',
  endDate: '',
  page: 1,
  pageSize: 10
});

// 分页状态
const currentPage = ref(1);
const pageSize = ref(10);

// 行选择配置
const rowSelection = {
  type: 'checkbox' as const,
  showCheckedAll: true,
  onlyCurrent: false
};

// 表格列配置
const columns = computed<TableColumnData[]>(() => [
  {
    title: '序号',
    dataIndex: 'id',
    width: 80,
    align: 'center',
    customRender: ({ index }: any) => index + 1
  },
  {
    title: '方案名称',
    dataIndex: 'target',
    width: 200,
    ellipsis: true,
    render: ({ record }: any) => {
      return h('span', {
        class: 'text-primary font-medium'
      }, record.target || '-');
    }
  },
  {
    title: '儿童',
    dataIndex: 'childInfo',
    width: 150,
    render: ({ record }: any) => {
      return h('div', {
        class: 'flex items-center space-x-3'
      }, [
        h('div', {
          class: 'w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary'
        }, [
          h('i', { class: 'fa fa-child text-xs' })
        ]),
        h('span', {
          class: 'text-neutral'
        }, `${record.childName || '-'} (${record.childAge || '-'}岁)`)
      ]);
    }
  },
  {
    title: '方案类型',
    dataIndex: 'schemeType',
    width: 120,
    align: 'center',
    render: ({ record }: any) => {
      const typeMap: Record<string, any> = {
        emotional: { text: '情感陪伴', color: 'primary' },
        educational: { text: '教育支持', color: 'success' },
        behavioral: { text: '行为引导', color: 'warning' },
        family: { text: '家庭沟通', color: 'orangered' },
        comprehensive: { text: '综合服务', color: 'purple' }
      };
      const typeInfo = typeMap[record.schemeType] || { text: record.schemeType || '-', color: 'gray' };
      return h('span', {
        class: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${typeInfo.color}/10 text-${typeInfo.color}`
      }, typeInfo.text);
    }
  },
  {
    title: '方案状态',
    dataIndex: 'schemeStatus',
    width: 100,
    align: 'center',
    render: ({ record }: any) => {
      const statusMap: Record<string, any> = {
        'IN_PROGRESS': { text: '进行中', color: 'success' },
        'COMPLETED': { text: '已完成', color: 'primary' },
        'PENDING': { text: '待审核', color: 'warning' },
        'DELAYED': { text: '已延迟', color: 'danger' },
        'PAUSED': { text: '已暂停', color: 'gray' }
      };
      const statusInfo = statusMap[record.schemeStatus] || { text: record.schemeStatus || '-', color: 'gray' };
      return h('span', {
        class: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${statusInfo.color}/10 text-${statusInfo.color}`
      }, statusInfo.text);
    }
  },
  {
    title: '完成进度',
    dataIndex: 'progress',
    width: 180,
    render: ({ record }: any) => {
      const progress = record.totalTasks > 0 ? Math.round((record.progress / record.totalTasks) * 100) : 0;
      return h('div', {
        class: 'w-full'
      }, [
        h('div', {
          class: 'w-full bg-gray-200 rounded-full h-2.5 mb-1'
        }, [
          h('div', {
            class: 'bg-success h-2.5 rounded-full progress-bar-animated',
            style: { width: `${progress}%` }
          })
        ]),
        h('div', {
          class: 'flex justify-between text-xs text-neutral'
        }, [
          h('span', `${record.progress || 0}/${record.totalTasks || 0}个任务`),
          h('span', `${progress}%`)
        ])
      ]);
    }
  },
  {
    title: '预计完成时间',
    dataIndex: 'estimatedCompletionDate',
    width: 150,
    align: 'center',
    render: ({ record }: any) => {
      return record.estimatedCompletionDate || '-';
    }
  },
  {
    title: '操作',
    dataIndex: 'operations',
    width: 120,
    fixed: 'right',
    align: 'center',
    render: ({ record }: any) => {
      return h('div', { class: 'flex justify-center space-x-2' }, [
        h('button', {
          class: 'btn btn-sm btn-outline',
          onClick: () => handleViewDetail(record.id)
        }, '查看'),
        h('button', {
          class: 'btn btn-sm btn-primary',
          onClick: () => handleEdit(record.id)
        }, '编辑')
      ]);
    }
  }
]);

// 构建查询参数
const buildQueryParams = () => {
  const params: any = {
    page: currentPage.value,
    pageSize: pageSize.value
  };
  
  // 只添加有意义的非空字段
  if (searchParams.name && searchParams.name.trim()) {
    params.name = searchParams.name.trim();
  }
  if (searchParams.schemeStatus && searchParams.schemeStatus.trim()) {
    params.schemeStatus = searchParams.schemeStatus.trim();
  }
  if (searchParams.target && searchParams.target.trim()) {
    params.target = searchParams.target.trim();
  }
  if (searchParams.startDate && searchParams.startDate.trim()) {
    params.startDate = searchParams.startDate.trim();
  }
  if (searchParams.endDate && searchParams.endDate.trim()) {
    params.endDate = searchParams.endDate.trim();
  }
  
  return params;
};

// API 请求函数
const loadTrackingData = async () => {
  try {
    isLoading.value = true;
    const queryParams = buildQueryParams();
    
    const response: any = await http.post('/api/social-worker/track/scheme/list', queryParams);
    
    if (response.code === 1) {
      trackingData.value = response.data.records || [];
      total.value = response.data.total || 0;
      
      // 更新统计数据
      updateStatistics();
    } else {
      Message.error(response.msg || '获取服务跟踪数据失败');
    }
  } catch (error) {
    console.error('获取服务跟踪数据异常:', error);
    Message.error('获取服务跟踪数据失败');
  } finally {
    isLoading.value = false;
  }
};

// 更新统计数据
const updateStatistics = () => {
  // 模拟统计数据，实际应该从后端获取
  totalSchemes.value = trackingData.value.length;
  inProgressSchemes.value = trackingData.value.filter((item: any) => item.schemeStatus === 'IN_PROGRESS').length;
  completedSchemes.value = trackingData.value.filter((item: any) => item.schemeStatus === 'COMPLETED').length;
  
  // 计算平均完成率
  const totalProgress = trackingData.value.reduce((sum: number, item: any) => {
    const progress = item.totalTasks > 0 ? (item.progress / item.totalTasks) * 100 : 0;
    return sum + progress;
  }, 0);
  averageCompletionRate.value = trackingData.value.length > 0 ? Math.round(totalProgress / trackingData.value.length) : 0;
};

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 这里应该使用Chart.js初始化图表
    // 为了演示，这里只是占位
    console.log('图表初始化');
  });
};

// 更新状态分布图表
const updateStatusChart = () => {
  console.log('更新状态分布图表，周期：', statusChartPeriod.value);
};

// 更新进度趋势图表
const updateProgressChart = () => {
  console.log('更新进度趋势图表，周期：', progressChartPeriod.value);
};

// 事件处理函数
const handleSearch = () => {
  currentPage.value = 1;
  loadTrackingData();
};

const handleReset = () => {
  Object.assign(searchParams, {
    childId: null,
    workerId: null,
    target: '',
    name: '',
    schemeStatus: '',
    schemeType: '',
    startDate: '',
    endDate: '',
    page: 1,
    pageSize: 10
  });
  currentPage.value = 1;
  pageSize.value = 10;
  loadTrackingData();
};

const handleRefresh = () => {
  loadTrackingData();
};

const handleExport = () => {
  Message.success('导出功能开发中...');
};

const handleViewDetail = (id: number) => {
  router.push(`/tracking/detail/${id}`);
};

const handleEdit = (id: number) => {
  router.push(`/tracking/edit/${id}`);
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadTrackingData();
};

const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  loadTrackingData();
};

// 组件挂载时加载数据
onMounted(() => {
  loadTrackingData();
  initCharts();
});
</script>

<style scoped>
/* 全局样式重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 容器样式 */
.tracking-list-container {
  min-height: 100vh;
  background-color: #f9fafb;
  position: relative;
}

/* 确保内容在粘性页眉下方 */
.tracking-main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 96px 24px 24px 24px;
  position: relative;
  z-index: 1;
}

/* 页面标题 */
.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Flexbox工具类 */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.sm\:flex-row {
  flex-direction: row;
}

.sm\:justify-between {
  justify-content: space-between;
}

.sm\:items-center {
  align-items: center;
}

.items-center {
  align-items: center;
}

.ml-auto {
  margin-left: auto;
}

.space-x-4 {
  gap: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.sm\:mt-0 {
  margin-top: 0;
}

.pt-4 {
  padding-top: 1rem;
}

/* 按钮基础样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  gap: 6px;
  font-family: inherit;
  background-color: transparent;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06);
}

.btn-outline {
  background-color: white;
  color: #4f46e5;
  border-color: #4f46e5;
}

.btn-outline:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
}

/* 统计卡片样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.stats-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899);
}

.stats-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(79, 70, 229, 0.15);
  border-color: rgba(79, 70, 229, 0.2);
}

.stats-card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stats-info {
  flex: 1;
}

.stats-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.stats-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1;
}

.stats-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
}

.bg-primary { background-color: #4f46e5; }
.bg-secondary { background-color: #10b981; }
.bg-success { background-color: #22c55e; }
.bg-warning { background-color: #f59e0b; }

.stats-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.text-success { color: #22c55e; }
.text-danger { color: #ef4444; }
.text-neutral { color: #6b7280; }

.stats-note {
  font-size: 12px;
  color: #6b7280;
}

/* 图表区域 */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-card:hover {
  box-shadow: 0 8px 30px rgba(79, 70, 229, 0.12);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-select {
  border: none;
  background: transparent;
  outline: none;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
}

.chart-container {
  height: 300px;
  position: relative;
}

/* 搜索筛选区 - 紫色社工端风格 */
.search-filters-card {
  background: linear-gradient(135deg, #f8f7ff 0%, #f0efff 100%);
  border: 1px solid #e5e7ff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
  backdrop-filter: blur(10px);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7ff;
}

.filters-title {
  font-size: 18px;
  font-weight: 600;
  color: #4f46e5;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.filters-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.reset-btn {
  padding: 12px 24px;
  border-color: #4f46e5;
  color: #4f46e5;
  background: transparent;
}

.reset-btn:hover {
  background: #f3f4ff;
  border-color: #4338ca;
  color: #4338ca;
}

.search-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.search-btn:hover {
  background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.filters-content {
  width: 100%;
}

.main-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  align-items: end;
  margin-bottom: 20px;
}

.date-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #4f46e5;
  margin-bottom: 4px;
}

.search-input-primary {
  width: 100%;
  padding: 0px 16px;
  border: 1px solid #d1d5ff;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(79, 70, 229, 0.1);
}

.search-input-primary:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  transform: translateY(-1px);
}

.search-input-primary:hover {
  border-color: #a5b4fc;
}

.filter-select-primary {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5ff;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(79, 70, 229, 0.1);
}

.filter-select-primary:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  transform: translateY(-1px);
}

.filter-select-primary:hover {
  border-color: #a5b4fc;
}

/* 日期筛选样式 */
.date-input {
  width: 100%;
  padding: 0px 16px;
  border: 1px solid #d1d5ff;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(79, 70, 229, 0.1);
}

.date-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  transform: translateY(-1px);
}

.date-input:hover {
  border-color: #a5b4fc;
}

.table-wrapper {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* 进度条动画 */
.progress-bar-animated {
  animation: progress 2s ease-in-out;
}

@keyframes progress {
  from { width: 0; }
  to { width: var(--progress-width); }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .tracking-main-content {
    padding: 20px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .main-filters {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .date-filters {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .filters-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filters-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .tracking-main-content {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stats-card {
    padding: 20px;
  }

  .stats-card-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .stats-icon {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }

  .stats-value {
    font-size: 28px;
  }

  .chart-card {
    padding: 16px;
  }

  .chart-container {
    height: 250px;
  }

  .search-filters-card {
    padding: 16px;
    border-radius: 10px;
  }

  .main-filters {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .filters-title {
    font-size: 16px;
  }

  .filter-label {
    font-size: 13px;
  }

  .search-input-primary,
  .filter-select-primary,
  .date-input {
    padding: 10px 14px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .tracking-main-content {
    padding: 12px;
  }

  .stats-card {
    padding: 16px;
  }

  .stats-card-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .stats-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .stats-value {
    font-size: 24px;
  }

  .stats-label {
    font-size: 13px;
  }

  .chart-card {
    padding: 12px;
  }

  .chart-container {
    height: 200px;
  }

  .search-filters-card {
    padding: 12px;
    border-radius: 8px;
  }

  .filters-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
  }

  .filters-title {
    font-size: 15px;
  }

  .main-filters {
    gap: 12px;
  }

  .filter-group {
    gap: 6px;
  }

  .search-input-primary,
  .filter-select-primary,
  .date-input {
    padding: 8px 12px;
    font-size: 12px;
  }

  .filters-actions {
    gap: 8px;
  }

  .reset-btn,
  .search-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
}

/* 平滑动画过渡 */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* 优化键盘导航体验 */
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* 状态标签样式 */
.bg-primary\/10 { background-color: rgba(79, 70, 229, 0.1); }
.text-primary { color: #4f46e5; }
.bg-success\/10 { background-color: rgba(34, 197, 94, 0.1); }
.text-success { color: #22c55e; }
.bg-warning\/10 { background-color: rgba(245, 158, 11, 0.1); }
.text-warning { color: #f59e0b; }
.bg-orange\/10 { background-color: rgba(249, 115, 22, 0.1); }
.text-orange { color: #f97316; }
.bg-purple\/10 { background-color: rgba(147, 51, 234, 0.1); }
.text-purple { color: #9333ea; }
.bg-gray\/10 { background-color: rgba(107, 114, 128, 0.1); }
.text-gray { color: #6b7280; }
</style>
