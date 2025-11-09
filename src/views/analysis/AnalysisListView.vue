<template>
  <AppLayout title="AI分析管理 - CareSync AI">
    <div class="analysis-list-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">AI分析管理</h1>
        <div class="header-actions">
          <Button @click="handleCreateAnalysis" variant="primary">
            <i class="icon-plus">+</i> 新建分析
          </Button>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-cards">
        <Card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <div class="stat-value">{{ totalAnalysis }}</div>
              <div class="stat-label">总分析次数</div>
            </div>
          </div>
        </Card>
        <Card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">⚠️</div>
            <div class="stat-info">
              <div class="stat-value">{{ highRiskCount }}</div>
              <div class="stat-label">高风险预警</div>
            </div>
          </div>
        </Card>
        <Card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">📈</div>
            <div class="stat-info">
              <div class="stat-value">{{ emotionImprovedCount }}</div>
              <div class="stat-label">情绪改善</div>
            </div>
          </div>
        </Card>
        <Card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">👦</div>
            <div class="stat-info">
              <div class="stat-value">{{ analyzedChildrenCount }}</div>
              <div class="stat-label">已分析儿童</div>
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
              <label class="filter-label">分析类型</label>
              <select v-model="searchForm.analysisType" class="filter-select">
                <option value="">全部类型</option>
                <option value="emotion">情绪分析</option>
                <option value="behavior">行为分析</option>
                <option value="academic">学业分析</option>
                <option value="comprehensive">综合分析</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">风险等级</label>
              <select v-model="searchForm.riskLevel" class="filter-select">
                <option value="">全部等级</option>
                <option value="low">低风险</option>
                <option value="medium">中风险</option>
                <option value="high">高风险</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">分析日期</label>
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

      <!-- 分析列表 -->
      <Card class="analysis-table-card">
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">加载中...</p>
        </div>
        <div v-else-if="analysisRecords.length === 0" class="empty-state">
          <div class="empty-icon">📊</div>
          <h3 class="empty-title">暂无分析记录</h3>
          <p class="empty-description">还没有创建任何AI分析记录</p>
          <Button @click="handleCreateAnalysis" variant="primary">新建分析</Button>
        </div>
        <div v-else class="analysis-table">
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
                <th>儿童信息</th>
                <th>分析类型</th>
                <th>情绪分数</th>
                <th>风险等级</th>
                <th>关键发现</th>
                <th>分析时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="record in analysisRecords" 
                :key="record.id" 
                class="table-row"
              >
                <td class="table-checkbox">
                  <input 
                    type="checkbox" 
                    v-model="selectedRecords" 
                    :value="record.id" 
                    class="row-checkbox"
                  />
                </td>
                <td class="child-info">
                  <div class="child-avatar">
                    <img 
                      :src="record.childAvatar || defaultAvatar" 
                      :alt="record.childName"
                    />
                  </div>
                  <div class="child-details">
                    <div class="child-name">{{ record.childName }}</div>
                    <div class="child-meta">{{ record.childAge }}岁 | {{ record.childGender === 'male' ? '男' : '女' }}</div>
                  </div>
                </td>
                <td class="analysis-type">
                  <span :class="['type-badge', `type-${record.analysisType}`]">
                    {{ getAnalysisTypeText(record.analysisType) }}
                  </span>
                </td>
                <td class="emotion-score">
                  <div class="score-display">
                    <div class="score-number">{{ record.emotionScore }}</div>
                    <div class="score-bar">
                      <div 
                        class="score-bar-fill" 
                        :style="{ 
                          width: record.emotionScore + '%',
                          backgroundColor: getEmotionColor(record.emotionScore)
                        }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="risk-level">
                  <span :class="['risk-badge', `risk-${record.riskLevel}`]">
                    {{ getRiskLevelText(record.riskLevel) }}
                  </span>
                </td>
                <td class="key-findings">
                  <div class="findings-list">
                    <span 
                      v-for="(finding, index) in record.keyFindings.slice(0, 2)" 
                      :key="index" 
                      class="finding-tag"
                    >
                      {{ finding }}
                    </span>
                    <span v-if="record.keyFindings.length > 2" class="more-findings">
                      +{{ record.keyFindings.length - 2 }}
                    </span>
                  </div>
                </td>
                <td class="analysis-date">
                  {{ formatDate(record.analysisDate) }}
                </td>
                <td class="action-buttons">
                  <Button 
                    size="small" 
                    @click="handleViewDetail(record.id)"
                    class="view-button"
                  >
                    查看
                  </Button>
                  <Button 
                    size="small" 
                    variant="danger" 
                    @click="handleDelete(record.id)"
                    class="delete-button"
                  >
                    删除
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页控件 -->
        <div v-if="!isLoading && analysisRecords.length > 0" class="pagination">
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
import { analysisService, type AnalysisRecord } from '@/services/mock/analysisService';

// 路由实例
const router = useRouter();

// 加载状态
const isLoading = ref(false);

// 默认头像
const defaultAvatar = 'https://picsum.photos/40/40?random=default';

// 分析记录列表
const analysisRecords = ref<AnalysisRecord[]>([]);

// 搜索表单
const searchForm = ref({
  childName: '',
  analysisType: '',
  riskLevel: '',
  startDate: '',
  endDate: ''
});

// 分页信息
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)));

// 选择状态
const selectedRecords = ref<string[]>([]);
const selectAll = ref(false);

// 统计数据
const totalAnalysis = ref(0);
const highRiskCount = ref(0);
const emotionImprovedCount = ref(0);
const analyzedChildrenCount = ref(0);

// 获取分析记录列表
const fetchAnalysisRecords = async () => {
  try {
    isLoading.value = true;
    const response = await analysisService.getAnalysisRecords({
      ...searchForm.value,
      page: currentPage.value,
      pageSize: pageSize.value
    });
    analysisRecords.value = response.list;
    totalCount.value = response.total;
    selectedRecords.value = [];
    selectAll.value = false;
    updateStats();
  } catch (error) {
    console.error('获取分析记录失败:', error);
    alert('获取分析记录失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 更新统计数据
const updateStats = () => {
  totalAnalysis.value = totalCount.value;
  highRiskCount.value = analysisRecords.value.filter(record => record.riskLevel === 'high').length;
  emotionImprovedCount.value = analysisRecords.value.filter(record => record.emotionScore > 70).length;
  
  // 获取唯一的儿童ID数量
  const uniqueChildIds = new Set(analysisRecords.value.map(record => record.childId));
  analyzedChildrenCount.value = uniqueChildIds.size;
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

// 获取情绪颜色
const getEmotionColor = (score: number): string => {
  if (score >= 80) return '#22C55E';
  if (score >= 60) return '#F59E0B';
  return '#EF4444';
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

// 全选/取消全选
const handleSelectAll = () => {
  if (selectAll.value) {
    selectedRecords.value = analysisRecords.value.map(record => record.id);
  } else {
    selectedRecords.value = [];
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchAnalysisRecords();
};

// 重置
const handleReset = () => {
  searchForm.value = {
    childName: '',
    analysisType: '',
    riskLevel: '',
    startDate: '',
    endDate: ''
  };
  currentPage.value = 1;
  fetchAnalysisRecords();
};

// 页面变化
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchAnalysisRecords();
  }
};

// 每页条数变化
const handlePageSizeChange = () => {
  currentPage.value = 1;
  fetchAnalysisRecords();
};

// 新建分析
const handleCreateAnalysis = () => {
  router.push('/analysis/create');
};

// 查看详情
const handleViewDetail = (id: string) => {
  router.push(`/analysis/${id}`);
};

// 删除分析记录
const handleDelete = async (id: string) => {
  if (confirm('确定要删除这条分析记录吗？删除后不可恢复。')) {
    try {
      await analysisService.deleteAnalysisRecord(id);
      alert('删除成功');
      fetchAnalysisRecords();
    } catch (error) {
      console.error('删除分析记录失败:', error);
      alert('删除失败，请稍后重试');
    }
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  fetchAnalysisRecords();
});
</script>

<style scoped>
.analysis-list-container {
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
.analysis-table-card {
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
.analysis-table {
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

.type-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
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

.score-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.score-number {
  font-size: 18px;
  font-weight: 700;
  color: #4F46E5;
}

.score-bar {
  width: 80px;
  height: 6px;
  background-color: #E5E7EB;
  border-radius: 3px;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.risk-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
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

.findings-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 200px;
}

.finding-tag {
  padding: 2px 8px;
  background-color: #E5E7EB;
  color: #6B7280;
  border-radius: 12px;
  font-size: 12px;
  word-break: break-word;
}

.more-findings {
  padding: 2px 8px;
  background-color: #F3F4F6;
  color: #6B7280;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
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
  .analysis-list-container {
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
}
</style>