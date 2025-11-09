<template>
  <AppLayout title="儿童管理 - CareSync AI">
    <div class="children-list-container">
      <!-- 页面标题和操作栏 -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">儿童管理</h1>
          <p class="page-description">管理和关注留守儿童的基本信息与状态</p>
        </div>
        <div class="header-right">
          <Button type="primary" @click="handleAddChild">
            <i class="icon-add">+</i> 添加儿童
          </Button>
        </div>
      </div>
      
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <Card variant="primary" class="stat-card">
          <div class="stat-icon stat-icon-total">👥</div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.total }}</div>
            <div class="stat-label">总儿童数</div>
          </div>
        </Card>
        <Card variant="success" class="stat-card">
          <div class="stat-icon stat-icon-normal">😊</div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.normal }}</div>
            <div class="stat-label">状态正常</div>
          </div>
        </Card>
        <Card variant="warning" class="stat-card">
          <div class="stat-icon stat-icon-attention">⚠️</div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.attention }}</div>
            <div class="stat-label">需要关注</div>
          </div>
        </Card>
        <Card variant="danger" class="stat-card">
          <div class="stat-icon stat-icon-urgent">🚨</div>
          <div class="stat-content">
            <div class="stat-value">{{ statistics.urgent }}</div>
            <div class="stat-label">紧急情况</div>
          </div>
        </Card>
      </div>
      
      <!-- 搜索和筛选区域 --<Card class="search-filter-card">
        <div class="search-filter-content">
          <div class="search-group">
            <Input
              v-model="searchParams.keyword"
              placeholder="搜索儿童姓名、学校或监护人"
              prefix-icon="🔍"
              class="search-input"
              @keyup.enter="handleSearch"
            />
          </div>
          <div class="filter-group">
            <select
              v-model="searchParams.status"
              class="filter-select"
              @change="handleSearch"
            >
              <option value="all">全部状态</option>
              <option value="normal">状态正常</option>
              <option value="attention">需要关注</option>
              <option value="urgent">紧急情况</option>
            </select>
            <Button @click="handleSearch">搜索</Button>
            <Button @click="resetFilters">重置</Button>
          </div>
        </div>
      </Card>
      
      <!-- 儿童列表 --<Card class="children-list-card">
        <div class="card-header">
          <h3 class="card-title">儿童列表</h3>
          <div class="list-info">
            共 {{ pagination.total }} 名儿童
          </div>
        </div>
        
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">加载中...</p>
        </div>
        <div v-else-if="children.length === 0" class="empty-container">
          <div class="empty-icon">👧</div>
          <h3 class="empty-title">暂无数据</h3>
          <p class="empty-description">
            {{ searchParams.keyword || searchParams.status !== 'all' ? '没有找到符合条件的儿童' : '还没有添加任何儿童信息' }}
          </p>
          <Button v-if="!searchParams.keyword && searchParams.status === 'all'" @click="handleAddChild">
            添加第一个儿童
          </Button>
        </div>
        <div v-else class="children-list">
          <table class="children-table">
            <thead>
              <tr>
                <th class="col-avatar">头像</th>
                <th class="col-name">姓名</th>
                <th class="col-info">基本信息</th>
                <th class="col-guardian">监护人信息</th>
                <th class="col-emotion">情绪状态</th>
                <th class="col-status">状态</th>
                <th class="col-tags">标签</th>
                <th class="col-actions">操作<th>
              <tr>
            <thead>
            <tbody>
              <tr v-for="child in children" :key="child.id" class="child-row">
                <td class="col-avatar">
                  <div class="child-avatar">
                    <img :src="child.avatar || defaultAvatar" :alt="child.name" />
                  </div>
                <td class="col-name">
                  <div class="child-name">{{ child.name }}</div>
                  <div class="child-basic-info">
                    {{ child.age }}岁 · {{ child.gender === 'male' ? '男' : '女' }}
                  </div>
                <td class="col-info">
                  <div class="school-info">
                    <i class="icon-school">🏫</i> {{ child.school }}
                  </div>
                  <div class="grade-info">
                    <i class="icon-grade">📚</i> {{ child.grade }}
                  </div>
                <td class="col-guardian">
                  <div class="guardian-name">{{ child.guardian.name }}</div>
                  <div class="guardian-relationship">{{ child.guardian.relationship }}</div>
                  <div class="guardian-phone">{{ child.guardian.phone }}</div>
                <td class="col-emotion">
                  <div class="emotion-score">
                    <div class="score-value">{{ child.emotionScore }}</div>
                    <div class="score-label">情绪分数</div>
                  </div>
                  <div class="emotion-bar">
                    <div 
                      class="emotion-bar-fill"
                      :style="{ width: child.emotionScore + '%', backgroundColor: getEmotionColor(child.emotionScore) }"
                    ></div>
                  </div>
                <td class="col-status">
                  <span :class="['status-badge', 'status-' + child.status]">
                    {{ getStatusText(child.status) }}
                  </span>
                <td class="col-tags">
                  <div class="tags-container">
                    <span v-for="(tag, index) in child.tags" :key="index" class="tag">
                      {{ tag }}</span>
                  </div>
                <td class="col-actions">
                  <div class="action-buttons">
                    <Button size="small" @click="handleViewChild(child.id)">
                      查看
                    </Button>
                    <Button size="small" variant="primary" @click="handleEditChild(child.id)">
                      编辑
                    </Button>
                    <Button size="small" variant="danger" @click="handleDeleteChild(child.id, child.name)">
                      删除
                    </Button>
                  </div>
                <td>
              <tr>
            <tbody>
          <table>
        </div>
        
        <!-- 分页 --<div v-if="children.length > 0" class="pagination-container">
          <div class="pagination-info">
            显示第 {{ (pagination.page - 1) * pagination.pageSize + 1 }} 到 
            {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} 条，共 {{ pagination.total }} 条
          </div>
          <div class="pagination-controls">
            <Button 
              size="small" 
              :disabled="pagination.page === 1"
              @click="changePage(pagination.page - 1)"
            >
              上一页
            </Button>
            <span class="page-info">
              {{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.pageSize) }}
            </span>
            <Button 
              size="small" 
              :disabled="pagination.page >= Math.ceil(pagination.total / pagination.pageSize)"
              @click="changePage(pagination.page + 1)"
            >
              下一页
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue';
import Card from '@/components/common/Card.vue';
import Button from '@/components/common/Button.vue';
import Input from '@/components/common/Input.vue';
import { childService, type Child } from '@/services/mock/childService';

// 路由实例
const router = useRouter();

// 加载状态
const isLoading = ref(false);

// 默认头像
const defaultAvatar = 'https://picsum.photos/200/200?random=default';

// 儿童列表数据
const children = ref<Child[]>([]);

// 搜索参数
const searchParams = reactive({
  keyword: '',
  status: 'all',
  page: 1,
  pageSize: 10
});

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

// 统计数据
const statistics = reactive({
  total: 0,
  normal: 0,
  attention: 0,
  urgent: 0
});

// 获取儿童列表
const fetchChildren = async () => {
  try {
    isLoading.value = true;
    
    const params = {
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      keyword: searchParams.keyword,
      status: searchParams.status !== 'all' ? searchParams.status : undefined
    };
    
    const response = await childService.getChildren(params);
    children.value = response.list;
    pagination.total = response.total;
    pagination.page = response.page;
    pagination.pageSize = response.pageSize;
  } catch (error) {
    console.error('获取儿童列表失败:', error);
    alert('获取儿童列表失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const stats = await childService.getStatistics();
    statistics.total = stats.total;
    statistics.normal = stats.normal;
    statistics.attention = stats.attention;
    statistics.urgent = stats.urgent;
  } catch (error) {
    console.error('获取统计数据失败:', error);
  }
};

// 获取情绪颜色
const getEmotionColor = (score: number): string => {
  if (score >= 80) return '#22C55E'; // 绿色
  if (score >= 60) return '#F59E0B'; // 黄色
  return '#EF4444'; // 红色
};

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusMap = {
    normal: '正常',
    attention: '需关注',
    urgent: '紧急'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

// 处理搜索
const handleSearch = () => {
  searchParams.page = 1;
  fetchChildren();
};

// 重置筛选
const resetFilters = () => {
  searchParams.keyword = '';
  searchParams.status = 'all';
  searchParams.page = 1;
  fetchChildren();
};

// 切换页码
const changePage = (page: number) => {
  if (page < 1) return;
  searchParams.page = page;
  fetchChildren();
};

// 添加儿童
const handleAddChild = () => {
  router.push('/children/add');
};

// 查看儿童详情
const handleViewChild = (id: string) => {
  router.push(`/children/${id}`);
};

// 编辑儿童
const handleEditChild = (id: string) => {
  router.push(`/children/edit/${id}`);
};

// 删除儿童
const handleDeleteChild = (id: string, name: string) => {
  if (confirm(`确定要删除儿童「${name}」的信息吗？此操作不可撤销。`)) {
    deleteChild(id);
  }
};

// 删除儿童实现
const deleteChild = async (id: string) => {
  try {
    const success = await childService.deleteChild(id);
    if (success) {
      alert('删除成功');
      // 重新加载数据
      fetchChildren();
      fetchStatistics();
    } else {
      alert('删除失败，儿童不存在');
    }
  } catch (error) {
    console.error('删除儿童失败:', error);
    alert('删除失败，请稍后重试');
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  fetchChildren();
  fetchStatistics();
});
</script>

<style scoped>
.children-list-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left .page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 8px 0;
}

.header-left .page-description {
  font-size: 16px;
  color: #6B7280;
  margin: 0;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-icon-total {
  background-color: rgba(79, 70, 229, 0.1);
}

.stat-icon-normal {
  background-color: rgba(34, 197, 94, 0.1);
}

.stat-icon-attention {
  background-color: rgba(245, 158, 11, 0.1);
}

.stat-icon-urgent {
  background-color: rgba(239, 68, 68, 0.1);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #6B7280;
  margin-top: 4px;
}

/* 搜索筛选区域 */
.search-filter-card {
  margin-bottom: 24px;
}

.search-filter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.search-group {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
}

.filter-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  color: #1F2937;
  background-color: #FFFFFF;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #4F46E5;
}

/* 儿童列表卡片 */
.children-list-card {
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.list-info {
  font-size: 14px;
  color: #6B7280;
}

/* 加载和空状态 */
.loading-container,
.empty-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #E5E7EB;
  border-top: 3px solid #4F46E5;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text,
.empty-description {
  color: #6B7280;
  font-size: 16px;
  margin: 0;
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

.empty-container Button {
  margin-top: 20px;
}

/* 儿童列表表格 */
.children-list {
  overflow-x: auto;
}

.children-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.children-table th,
.children-table td {
  padding: 16px 24px;
  text-align: left;
  border-bottom: 1px solid #E5E7EB;
}

.children-table th {
  background-color: #F9FAFB;
  font-weight: 600;
  color: #1F2937;
  white-space: nowrap;
}

.child-row:hover {
  background-color: #F9FAFB;
}

/* 表格列样式 */
.col-avatar {
  width: 80px;
}

.child-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.child-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.col-name {
  width: 120px;
}

.child-name {
  font-weight: 600;
  color: #1F2937;
  font-size: 16px;
  margin-bottom: 4px;
}

.child-basic-info {
  color: #6B7280;
  font-size: 13px;
}

.col-info {
  width: 180px;
}

.school-info,
.grade-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  color: #6B7280;
}

.col-guardian {
  width: 160px;
}

.guardian-name {
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 2px;
}

.guardian-relationship,
.guardian-phone {
  color: #6B7280;
  font-size: 13px;
  margin-bottom: 2px;
}

.col-emotion {
  width: 150px;
}

.emotion-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.score-value {
  font-weight: 700;
  font-size: 16px;
  color: #1F2937;
}

.score-label {
  font-size: 12px;
  color: #6B7280;
}

.emotion-bar {
  width: 100%;
  height: 6px;
  background-color: #E5E7EB;
  border-radius: 3px;
  overflow: hidden;
}

.emotion-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.col-status {
  width: 100px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.status-normal {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.status-attention {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.status-urgent {
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.col-tags {
  width: 180px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 2px 8px;
  background-color: #E5E7EB;
  color: #6B7280;
  border-radius: 12px;
  font-size: 12px;
}

.col-actions {
  width: 180px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #E5E7EB;
}

.pagination-info {
  font-size: 14px;
  color: #6B7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-info {
  font-size: 14px;
  color: #1F2937;
  min-width: 80px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .search-filter-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-group {
    max-width: none;
  }
  
  .filter-group {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .children-list-container {
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
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 16px;
  }
  
  .children-table th,
  .children-table td {
    padding: 12px 16px;
    font-size: 13px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .pagination-container {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px;
  }
  
  /* 在移动端隐藏部分列，确保表格可滚动 */
  .col-guardian,
  .col-tags {
    display: none;
  }
}

@media (max-width: 480px) {
  .header-left .page-title {
    font-size: 24px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .filter-group {
    flex-wrap: wrap;
  }
}
</style>