<template>
  <div class="schemes-list-container">
    <WorkHeader />
    <main class="schemes-main-content" style="padding-top: 80px;">
      <!-- 页面标题和操作栏 -->
      <div class="page-header pt-4">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 class="page-title">服务方案管理</h1>
            <p class="page-subtitle">管理您负责的所有服务方案信息</p>
          </div>
          <div class="flex items-center ml-auto space-x-4 mt-4 sm:mt-0">
            <a-button 
              id="addSchemeBtn" 
              type="primary"
              class="btn btn-primary"
              style="padding-left: 0.4rem; padding-right: 0.8rem;"
              @click="handleCreateScheme"
            >
              <template #icon>
                <icon-plus />
              </template>
              <span>新建方案</span>
            </a-button>
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
              <label class="filter-label">儿童姓名</label>
              <a-input 
                v-model="searchParams.childName"
                placeholder="请输入儿童姓名" 
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
                <a-option value="">所有状态</a-option>
                <a-option value="draft">草稿</a-option>
                <a-option value="active">进行中</a-option>
                <a-option value="completed">已完成</a-option>
                <a-option value="paused">已暂停</a-option>
              </a-select>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">创建日期</label>
              <div class="date-filters">
                <a-input 
                  v-model="searchParams.startDate"
                  placeholder="开始日期"
                  class="date-input"
                  @keyup.enter="handleSearch"
                  allow-clear
                />
                <span class="date-separator">至</span>
                <a-input 
                  v-model="searchParams.endDate"
                  placeholder="结束日期"
                  class="date-input"
                  @keyup.enter="handleSearch"
                  allow-clear
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 方案列表 -->
      <div class="table-wrapper">
        <a-space direction="vertical" size="large" fill>
          <a-table
            row-key="id"
            :columns="columns"
            :data="schemes"
            :loading="isLoading"
            :pagination="false"
            :row-selection="rowSelection"
            v-model:selectedKeys="selectedIds"
          />
        </a-space>
        
        <!-- 增强版分页组件 -->
        <div v-if="!isLoading && schemes.length > 0">
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
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import type { TableColumnData } from '@arco-design/web-vue';
import { http } from '@/services/api';

// 表格列配置
const columns = computed<TableColumnData[]>(() => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    align: 'center'
  },
  {
    title: '服务目标',
    dataIndex: 'target',
    width: 200,
    ellipsis: true
  },
  {
    title: '儿童姓名',
    dataIndex: 'childName',
    width: 120,
    align: 'center'
  },
  {
    title: '儿童年龄',
    dataIndex: 'childAge',
    width: 100,
    align: 'center'
  },
  {
    title: '服务措施',
    dataIndex: 'measures',
    width: 200,
    ellipsis: true,
    render: ({ record }) => {
      if (Array.isArray(record.measures)) {
        return record.measures.join(', ');
      }
      return record.measures || '-';
    }
  },
  {
    title: '方案状态',
    dataIndex: 'schemeStatus',
    width: 100,
    align: 'center',
    render: ({ record }) => {
      const statusText = getStatusText(record.schemeStatus);
      const statusColor = getStatusColor(record.schemeStatus);
      return h('span', {
        style: {
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: statusColor.bg,
          color: statusColor.color
        }
      }, statusText);
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    align: 'center',
    render: ({ record }) => {
      return formatDate(record.createTime);
    }
  },
  {
    title: '周期(天)',
    dataIndex: 'cycle',
    width: 100,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operations',
    width: 150,
    align: 'center',
    render: ({ record }) => {
      return h('div', { class: 'table-actions' }, [
        h('a', {
          href: 'javascript:;',
          onClick: () => handleViewDetail(record.id),
          class: 'action-link view-link'
        }, '查看'),
        h('a', {
          href: 'javascript:;',
          onClick: () => handleEdit(record.id),
          class: 'action-link edit-link'
        }, '编辑'),
        h('a', {
          href: 'javascript:;',
          onClick: () => handleDelete(record.id),
          class: 'action-link delete-link'
        }, '删除')
      ]);
    }
  }
]);

// 路由实例
const router = useRouter();

// 加载状态
const isLoading = ref(false);

// 方案数据
const schemes = ref([]);
const total = ref(0);

// 搜索参数
const searchParams = ref({
  childName: '',
  schemeStatus: '',
  startDate: '',
  endDate: ''
});

// 分页状态
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));

// 选中的行
const selectedIds = ref<string[]>([]);

// 行选择配置
const rowSelection = {
  type: 'checkbox' as const,
  showCheckedAll: true,
  onlyCurrent: false
};

// API 请求函数
const loadSchemes = async (params: any = {}) => {
  try {
    isLoading.value = true;
    const response = await http.post('/api/social-worker/scheme/list', {
      ...params,
      page: currentPage.value - 1, // API 可能从 0 开始
      pageSize: pageSize.value
    });
    
    if (response.data.code === 0) {
      schemes.value = response.data.data.records || [];
      total.value = response.data.data.total || 0;
    } else {
      Message.error(response.data.msg || '获取方案列表失败');
    }
  } catch (error: any) {
    console.error('获取方案列表失败:', error);
    Message.error('获取方案列表失败');
  } finally {
    isLoading.value = false;
  }
};

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusMap = {
    draft: '草稿',
    active: '进行中',
    completed: '已完成',
    paused: '已暂停'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colorMap = {
    draft: { bg: 'rgba(107, 114, 128, 0.1)', color: '#6B7280' },
    active: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' },
    completed: { bg: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' },
    paused: { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }
  };
  return colorMap[status as keyof typeof colorMap] || colorMap.draft;
};

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 事件处理函数
const handleSearch = () => {
  currentPage.value = 1;
  loadSchemes(searchParams.value);
};

const handleReset = () => {
  searchParams.value = {
    childName: '',
    schemeStatus: '',
    startDate: '',
    endDate: ''
  };
  currentPage.value = 1;
  loadSchemes(searchParams.value);
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadSchemes(searchParams.value);
};

const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  loadSchemes(searchParams.value);
};

const handleViewDetail = (id: number) => {
  router.push(`/schemes/detail/${id}`);
};

const handleEdit = (id: number) => {
  router.push(`/schemes/edit/${id}`);
};

const handleDelete = async (id: number) => {
  if (confirm('确定要删除这个方案吗？')) {
    try {
      // 这里应该调用删除API
      message.success('删除成功');
      loadSchemes(searchParams.value);
    } catch (error) {
      message.error('删除失败');
    }
  }
};

const handleCreateScheme = () => {
  router.push('/schemes/create');
};

// 组件挂载时加载数据
onMounted(() => {
  loadSchemes(searchParams.value);
});
</script>

<style scoped>
/* 页面容器 */
.schemes-main-content {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 20px 0;
}

.schemes-list-container {
  min-height: 100vh;
  background-color: #f9fafb;
  position: relative;
}

/* 页面标题 */
.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  padding-left: 20px;
  padding-right: 20px;
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

/* 统计卡片样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
  padding: 0 20px;
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
  gap: 20px;
}

.stats-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  color: white;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
}

.stats-info {
  flex: 1;
}

.stats-value {
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.1;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
}

/* 搜索筛选区域样式 */
.search-filters-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  margin: 0 20px 24px;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.08);
  overflow: hidden;
}

.filters-header {
  padding: 20px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters-content {
  padding: 20px 24px 24px;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: end;
}

.filter-item {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.filter-item :deep(.ant-input),
.filter-item :deep(.ant-select-selector) {
  border-radius: 8px;
  border: 2px solid #E5E7EB;
  transition: all 0.3s ease;
  font-size: 14px;
}

.filter-item :deep(.ant-input:hover),
.filter-item :deep(.ant-select:hover .ant-select-selector) {
  border-color: #9CA3AF;
}

.filter-item :deep(.ant-input:focus),
.filter-item :deep(.ant-select-focused .ant-select-selector) {
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.filter-item :deep(.ant-input-prefix) {
  color: #6B7280;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

/* 按钮样式 */
.action-button {
  border-radius: 8px;
  font-weight: 600;
  padding: 10px 20px;
  height: auto;
  transition: all 0.3s ease;
}

.search-button {
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  border: none;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
}

.search-button:hover {
  background: linear-gradient(135deg, #4338CA, #6D28D9);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
  transform: translateY(-1px);
}

.reset-button {
  border: 2px solid #E5E7EB;
  color: #6B7280;
  background: white;
}

.reset-button:hover {
  border-color: #4F46E5;
  color: #4F46E5;
  background: rgba(79, 70, 229, 0.05);
}

.primary-button {
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  border: none;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
  color: white;
}

.primary-button:hover {
  background: linear-gradient(135deg, #4338CA, #6D28D9);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
  transform: translateY(-1px);
  color: white;
}

/* 表格容器样式 */
.table-wrapper {
  margin: 0 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.08);
  overflow: hidden;
}

/* 表格样式 */
.table-wrapper :deep(.ant-table) {
  background: transparent;
}

.table-wrapper :deep(.ant-table-thead > tr > th) {
  background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
  border-bottom: 2px solid #E2E8F0;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
  padding: 16px;
}

.table-wrapper :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #F1F5F9;
  padding: 16px;
  font-size: 14px;
}

.table-wrapper :deep(.ant-table-tbody > tr:hover > td) {
  background: rgba(79, 70, 229, 0.02);
}

.table-wrapper :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: none;
}

/* 状态标签样式 */
.status-tag {
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border: none;
}

.status-active {
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.status-draft {
  background: linear-gradient(135deg, #6B7280, #4B5563);
  color: white;
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.3);
}

.status-completed {
  background: linear-gradient(135deg, #4F46E5, #4338CA);
  color: white;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.status-paused {
  background: linear-gradient(135deg, #F59E0B, #D97706);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

/* 操作按钮组 */
.action-button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-button-group .ant-btn {
  border-radius: 6px;
  font-size: 12px;
  padding: 4px 8px;
  height: auto;
  font-weight: 500;
}

/* 表格行选择样式 */
.table-wrapper :deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  border-color: #4F46E5;
}

/* 分页样式 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0 0 16px 16px;
  margin: 0 20px;
}

.pagination-wrapper :deep(.ant-pagination) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-wrapper :deep(.ant-pagination-item) {
  border-radius: 8px;
  border: 2px solid #E5E7EB;
  transition: all 0.3s ease;
}

.pagination-wrapper :deep(.ant-pagination-item:hover) {
  border-color: #4F46E5;
}

.pagination-wrapper :deep(.ant-pagination-item:hover a) {
  color: #4F46E5;
}

.pagination-wrapper :deep(.ant-pagination-item-active) {
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  border-color: #4F46E5;
}

.pagination-wrapper :deep(.ant-pagination-item-active a) {
  color: white;
}

.pagination-wrapper :deep(.ant-pagination-next):hover .ant-pagination-item-link,
.pagination-wrapper :deep(.ant-pagination-prev):hover .ant-pagination-item-link {
  border-color: #4F46E5;
  color: #4F46E5;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item {
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .schemes-main-content {
    padding: 16px 0;
  }
  
  .schemes-list-container,
  .stats-grid,
  .search-filters-card,
  .table-wrapper,
  .pagination-wrapper {
    margin-left: 12px;
    margin-right: 12px;
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stats-card {
    padding: 20px;
  }
  
  .stats-card-content {
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
  
  .filters-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 16px 20px 0;
  }
  
  .filters-content {
    padding: 16px 20px 20px;
  }
  
  .filter-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
  
  .table-wrapper :deep(.ant-table-thead > tr > th),
  .table-wrapper :deep(.ant-table-tbody > tr > td) {
    padding: 12px 8px;
    font-size: 13px;
  }
  
  .action-button-group {
    flex-direction: column;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .schemes-list-container,
  .stats-grid,
  .search-filters-card,
  .table-wrapper,
  .pagination-wrapper {
    margin-left: 8px;
    margin-right: 8px;
    padding-left: 12px;
    padding-right: 12px;
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
  
  .filters-content {
    padding: 12px 16px 16px;
  }
  
  .table-wrapper :deep(.ant-table-thead > tr > th),
  .table-wrapper :deep(.ant-table-tbody > tr > td) {
    padding: 8px 4px;
    font-size: 12px;
  }
  
  .action-button-group .ant-btn {
    padding: 2px 6px;
    font-size: 11px;
  }
  
  .pagination-wrapper {
    padding: 16px 12px;
  }
  
  .pagination-wrapper :deep(.ant-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* 加载动画优化 */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(79, 70, 229, 0.08);
  }
  50% {
    box-shadow: 0 4px 20px rgba(79, 70, 229, 0.15);
  }
}

.stats-card.loading {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* 焦点状态优化 */
.action-button:focus,
.filter-item :deep(.ant-input):focus,
.filter-item :deep(.ant-select-focused .ant-select-selector) {
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* 悬停效果增强 */
.stats-card,
.search-filters-card,
.table-wrapper {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.stats-card:hover,
.search-filters-card:hover,
.table-wrapper:hover {
  transform: translateY(-2px);
}
</style>