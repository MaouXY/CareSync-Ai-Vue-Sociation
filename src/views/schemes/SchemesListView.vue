<template>
  <AppLayout title="服务方案管理 - CareSync AI">
    <div class="schemes-list-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">服务方案管理</h1>
        <div class="header-actions">
          <Button @click="handleCreateScheme" variant="primary">
            <i class="icon-plus">+</i> 新建方案
          </Button>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-cards">
        <Card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <div class="stat-value">{{ totalSchemes }}</div>
              <div class="stat-label">总方案数</div>
            </div>
          </div>
        </Card>
        <Card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">🔄</div>
            <div class="stat-info">
              <div class="stat-value">{{ activeSchemes }}</div>
              <div class="stat-label">进行中方案</div>
            </div>
          </div>
        </Card>
        <Card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <div class="stat-value">{{ completedSchemes }}</div>
              <div class="stat-label">已完成方案</div>
            <div class="stat-trend positive">↑ 12%</div>
            </div>
          </div>
        </Card>
        <Card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">👦</div>
            <div class="stat-info">
              <div class="stat-value">{{ helpedChildren }}</div>
              <div class="stat-label">受助儿童数</div>
            <div class="stat-trend positive">↑ 8%</div>
            </div>
          </div>
        </Card>
      </div>

      <!-- 搜索和筛选区域 -->
      <Card class="filter-card">
        <div class="filter-content">
          <div class="filter-row">
            <div class="filter-item">
              <label class="filter-label">儿童姓名</label>
              <Input 
                v-model="searchForm.childName" 
                placeholder="请输入儿童姓名"
                size="large"
              />
            </div>
            <div class="filter-item">
              <label class="filter-label">方案类别</label>
              <select v-model="searchForm.category" class="filter-select">
                <option value="">全部类别</option>
                <option value="emotional">情感支持</option>
                <option value="academic">学业提升</option>
                <option value="behavioral">行为引导</option>
                <option value="social">社交能力</option>
                <option value="comprehensive">综合方案</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">方案状态</label>
              <select v-model="searchForm.status" class="filter-select">
                <option value="">全部状态</option>
                <option value="draft">草稿</option>
                <option value="active">进行中</option>
                <option value="completed">已完成</option>
                <option value="paused">已暂停</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">创建日期</label>
              <div class="date-range">
                <Input 
                  v-model="searchForm.startDate" 
                  placeholder="开始日期"
                  size="large"
                />
                <span class="date-separator">至</span>
                <Input 
                  v-model="searchForm.endDate" 
                  placeholder="结束日期"
                  size="large"
                />
              </div>
            </div>
          </div>
          <div class="filter-actions">
            <Button @click="handleSearch" variant="primary">搜索</Button>
            <Button @click="handleReset" variant="secondary">重置</Button>
          </div>
        </div>
      </Card>

      <!-- 方案列表 -->
      <Card class="schemes-table-card">
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">加载中...</p>
        </div>
        <div v-else-if="serviceSchemes.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <h3 class="empty-title">暂无服务方案</h3>
          <p class="empty-description">还没有创建任何服务方案</p>
          <Button @click="handleCreateScheme" variant="primary">新建方案</Button>
        </div>
        <div v-else class="schemes-table">
          <table>
            <thead>
              <tr>
                <th class="table-checkbox">
                  <input 
                    type="checkbox" 
                    v-model="selectAll" 
                    @change="handleSelectAll"
                    class="select-all-checkbox"
                  />
                </th>
                <th>方案标题</th>
                <th>服务对象</th>
                <th>类别</th>
                <th>状态</th>
                <th>完成进度</th>
                <th>创建时间</th>
                <th>负责人</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="scheme in serviceSchemes" 
                :key="scheme.id" 
                class="table-row"
              >
                <td class="table-checkbox">
                  <input 
                    type="checkbox" 
                    v-model="selectedSchemes" 
                    :value="scheme.id" 
                    class="row-checkbox"
                  />
                </td>
                <td class="scheme-title">
                  <a href="#" @click.prevent="handleViewDetail(scheme.id)"
                    class="title-link">
                    {{ scheme.title }}
                  </a>
                </td>
                <td class="child-info">
                  <div class="child-avatar">
                    <img 
                      :src="defaultAvatar" 
                      :alt="scheme.childName"
                    />
                  </div>
                  <div class="child-details">
                      <div class="child-name">{{ scheme.childName }}</div>
                      <div class="child-meta">{{ scheme.childAge }}岁</div>
                    </div>
                </td>
                <td class="scheme-category">
                  <span :class="['category-badge', `category-${scheme.category}`]">
                    {{ getCategoryText(scheme.category) }}
                  </span>
                </td>
                <td class="scheme-status">
                  <span :class="['status-badge', `status-${scheme.status}`]">
                    {{ getStatusText(scheme.status) }}
                  </span>
                </td>
                <td class="completion-progress">
                  <div class="progress-display">
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :style="{ width: scheme.progress + '%' }"
                      ></div>
                    </div>
                    <div class="progress-text">{{ scheme.progress }}%</div>
                  </div>
                </td>
                <td class="create-time">
                  {{ formatDate(scheme.createTime) }}
                </td>
                <td class="responsible-person">
                  {{ scheme.createdBy?.name || '-' }}
                </td>
                <td class="action-buttons">
                  <Button 
                    size="small" 
                    @click="handleViewDetail(scheme.id)"
                    class="view-button"
                  >
                    查看
                  </Button>
                  <Button 
                    size="small" 
                    @click="handleEdit(scheme.id)"
                    class="edit-button"
                    v-if="scheme.status !== 'completed'"
                  >
                    编辑
                  </Button>
                  <Button 
                    size="small" 
                    variant="danger" 
                    @click="handleDelete(scheme.id)"
                    class="delete-button"
                  >
                    删除
                  </Button>
                  <Button 
                    size="small" 
                    @click="handleToggleStatus(scheme)"
                    :class="['status-button', scheme.status === 'active' ? 'pause-button' : 'resume-button']"
                    v-if="scheme.status === 'active' || scheme.status === 'paused'"
                  >
                    {{ scheme.status === 'active' ? '暂停' : '继续' }}
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页控件 -->
        <div v-if="!isLoading && serviceSchemes.length > 0" class="pagination">
          <div class="pagination-info">
            共 {{ totalCount }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
          </div>
          <div class="pagination-controls">
            <Button 
              size="small" 
              @click="handlePageChange(1)"
              :disabled="currentPage === 1"
            >
              首页
            </Button>
            <Button 
              size="small" 
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              上一页
            </Button>
            <Button 
              size="small" 
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              下一页
            </Button>
            <Button 
              size="small" 
              @click="handlePageChange(totalPages)"
              :disabled="currentPage === totalPages"
            >
              末页
            </Button>
            <div class="page-size-selector">
              <label>每页</label>
              <select v-model="pageSize" @change="handlePageSizeChange">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <label>条</label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue';
import Card from '@/components/common/Card.vue';
import Button from '@/components/common/Button.vue';
import Input from '@/components/common/Input.vue';
import { schemeService, type ServiceScheme } from '@/services/mock/schemeService';

// 路由实例
const router = useRouter();

// 加载状态
const isLoading = ref(false);

// 默认头像
const defaultAvatar = 'https://picsum.photos/40/40?random=default';

// 服务方案列表
const serviceSchemes = ref<ServiceScheme[]>([]);

// 搜索表单
const searchForm = ref({
  childName: '',
  category: '',
  status: '',
  startDate: '',
  endDate: ''
});

// 分页信息
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)));

// 选择状态
const selectedSchemes = ref<string[]>([]);
const selectAll = ref(false);

// 统计数据
const totalSchemes = ref(0);
const activeSchemes = ref(0);
const completedSchemes = ref(0);
const helpedChildren = ref(0);

// 获取服务方案列表
const fetchServiceSchemes = async () => {
  try {
    isLoading.value = true;
    const response = await schemeService.getServiceSchemes({
      ...searchForm.value,
      page: currentPage.value,
      pageSize: pageSize.value
    });
    serviceSchemes.value = response.list;
    totalCount.value = response.total;
    selectedSchemes.value = [];
    selectAll.value = false;
    updateStats();
  } catch (error) {
    console.error('获取服务方案失败:', error);
    alert('获取服务方案失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 更新统计数据
const updateStats = () => {
  totalSchemes.value = totalCount.value;
  activeSchemes.value = serviceSchemes.value.filter(scheme => scheme.status === 'active').length;
  completedSchemes.value = serviceSchemes.value.filter(scheme => scheme.status === 'completed').length;
  
  // 获取唯一的儿童ID数量
  const uniqueChildIds = new Set(serviceSchemes.value.map(scheme => scheme.childId));
  helpedChildren.value = uniqueChildIds.size;
};

// 获取方案类别文本
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

// 获取方案状态文本
const getStatusText = (status: string): string => {
  const statusMap = {
    draft: '草稿',
    active: '进行中',
    completed: '已完成',
    paused: '已暂停'
  };
  return statusMap[status as keyof typeof statusMap] || status;
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

// 查看详情
const handleViewDetail = (id: string) => {
  router.push(`/schemes/detail/${id}`);
};

// 编辑方案
const handleEdit = (id: string) => {
  router.push(`/schemes/edit/${id}`);
};

// 删除方案
const handleDelete = async (id: string) => {
  // 实际项目中需要调用确认对话框
  try {
    await schemeService.deleteServiceScheme(id);
    // 重新加载数据
    fetchServiceSchemes();
    // 显示成功提示
    console.log('删除成功');
  } catch (error) {
    console.error('删除失败', error);
  }
};

// 切换状态
const handleToggleStatus = async (scheme: ServiceScheme) => {
  try {
    const newStatus = scheme.status === 'active' ? 'paused' : 'active';
    await schemeService.updateSchemeStatus(scheme.id, newStatus);
    // 重新加载数据
    fetchServiceSchemes();
    // 显示成功提示
    console.log('状态更新成功');
  } catch (error) {
    console.error('状态更新失败', error);
  }
};

// 全选/取消全选
const handleSelectAll = () => {
  if (selectAll.value) {
    selectedSchemes.value = serviceSchemes.value.map(scheme => scheme.id);
  } else {
    selectedSchemes.value = [];
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchServiceSchemes();
};

// 重置
const handleReset = () => {
  searchForm.value = {
    childName: '',
    category: '',
    status: '',
    startDate: '',
    endDate: ''
  };
  currentPage.value = 1;
  fetchServiceSchemes();
};

// 页面变化
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchServiceSchemes();
  }
};

// 每页条数变化
const handlePageSizeChange = () => {
  currentPage.value = 1;
  fetchServiceSchemes();
};

// 新建方案
const handleCreateScheme = () => {
  router.push('/schemes/create');
};

// 组件挂载时初始化数据
onMounted(() => {
  fetchServiceSchemes();
});
</script>

<style scoped>
.schemes-list-container {
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

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 48px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #4F46E5;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #6B7280;
  margin-top: 4px;
}

.stat-trend {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
}

.stat-trend.positive {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.stat-trend.negative {
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

/* 筛选卡片 */
.filter-card {
  margin-bottom: 24px;
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  color: #1F2937;
  background-color: #FFFFFF;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:hover {
  border-color: #9CA3AF;
}

.filter-select:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-separator {
  color: #6B7280;
  font-size: 14px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* 表格卡片 */
.schemes-table-card {
  position: relative;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #6B7280;
  font-size: 14px;
  margin: 0;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 8px 0;
}

.empty-description {
  color: #6B7280;
  font-size: 14px;
  margin: 0 0 20px 0;
}

/* 表格样式 */
.schemes-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th {
  background-color: #F9FAFB;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #E5E7EB;
  white-space: nowrap;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #E5E7EB;
  vertical-align: middle;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #F9FAFB;
}

/* 表格中的特定列样式 */
.table-checkbox {
  width: 40px;
}

.select-all-checkbox,
.row-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.scheme-title .title-link {
  color: #4F46E5;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.scheme-title .title-link:hover {
  color: #4338CA;
  text-decoration: underline;
}

.child-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.child-avatar {
  width: 40px;
  height: 40px;
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
  gap: 2px;
}

.child-name {
  font-weight: 500;
  color: #1F2937;
}

.child-meta {
  font-size: 12px;
  color: #6B7280;
}

.category-badge,
.status-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
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

.progress-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
  min-width: 80px;
}

.progress-fill {
  height: 100%;
  background-color: #4F46E5;
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 600;
  color: #1F2937;
  min-width: 35px;
  text-align: right;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status-button.pause-button {
  background-color: #F59E0B;
  color: #FFFFFF;
}

.status-button.resume-button {
  background-color: #22C55E;
  color: #FFFFFF;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.pagination-info {
  color: #6B7280;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6B7280;
}

.page-size-selector select {
  padding: 4px 8px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 14px;
  background-color: #FFFFFF;
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .filter-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .schemes-list-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .filter-row {
    grid-template-columns: 1fr;
  }
  
  .filter-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  
  .pagination {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .pagination-controls {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
  
  .date-range {
    flex-direction: column;
    align-items: stretch;
  }
  
  .date-separator {
    text-align: center;
  }
  
  th,
  td {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .progress-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .progress-bar {
    min-width: auto;
    width: 100%;
  }
}
</style>