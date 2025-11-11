<template>
  <div class="analysis-list-container">
    <WorkHeader />
    <main class="analysis-main-content" style="padding-top: 80px;">
      <div class="page-header">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 class="page-title">AI分析结果</h1>
            <p class="page-subtitle">查看AI对儿童心理状态和需求的分析结果</p>
          </div>

          <div class="flex items-center ml-auto space-x-4 mt-4 sm:mt-0">
            <button 
              id="refreshBtn" 
              class="btn btn-outline"
              @click="refreshData"
              :disabled="loading"
            >
              <i class="fa fa-refresh" :class="{ 'fa-spin': loading }"></i>
              <span class="hidden sm:inline-block">刷新</span>
            </button>
            <button 
              id="regenerateAnalysisBtn" 
              class="btn btn-primary"
              @click="showGenerateModal = true"
            >
              <i class="fa fa-refresh"></i>
              <span>重新分析</span>
            </button>
          </div>

        </div>
      </div>
      
      <div class="search-filters-card">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="relative">
            <input 
              v-model="searchParams.name"
              type="text" 
              placeholder="搜索儿童姓名/潜在问题/情感趋势" 
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <i class="fa fa-search search-icon"></i>
          </div>
          <select v-model="searchParams.potentialProblems" class="filter-select">
            <option value="">所有潜在问题</option>
            <option value="confidence">社交互动自信心不足</option>
            <option value="attention">注意力分散问题</option>
            <option value="communication">沟通主动性不足</option>
            <option value="family">家庭情感支持不足</option>
          </select>
          <select v-model="searchParams.emotionTrend" class="filter-select">
            <option value="">所有情感趋势</option>
            <option value="孤独">孤独</option>
            <option value="平静">平静</option>
            <option value="开心">开心</option>
            <option value="专注">专注</option>
            <option value="急躁">急躁</option>
            <option value="封闭">封闭</option>
          </select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm text-neutral">分析日期:</label>
            <input 
              v-model="searchParams.startDate"
              type="date" 
              class="date-input"
            />
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm text-neutral">至:</label>
            <input 
              v-model="searchParams.endDate"
              type="date" 
              class="date-input"
            />
          </div>
          <div class="flex space-x-2">
            <button class="btn btn-primary flex-1" @click="handleSearch">筛选</button>
            <button class="btn btn-outline flex-1" @click="resetFilters">重置</button>
          </div>
        </div>
      </div>

      <div class="analysis-table-container">
        <div class="table-wrapper">
          <table class="data-table analysis-table">
            <thead>
              <tr>
                <th>
                  <div class="checkbox-container">
                    <input 
                      type="checkbox" 
                      id="selectAll"
                      v-model="selectAll"
                      @change="handleSelectAll"
                    />
                  </div>
                </th>
                <th>儿童信息</th>
                <th>情绪分数</th>
                <th>情感标签</th>
                <th>潜在问题</th>
                <th>关键发现</th>
                <th>分析时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" v-for="n in 5" :key="n" class="loading-row">
                <td colspan="8" class="table-loading">
                  <div class="loading-content">
                    <div class="spinner"></div>
                    <span>正在加载分析数据...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="analysisList.length === 0">
                <td colspan="8" class="table-empty">
                  <div class="empty-content">
                    <i class="data-icon">📊</i>
                    <p>暂无AI分析数据</p>
                    <button class="btn btn-primary" @click="refreshData">刷新数据</button>
                  </div>
                </td>
              </tr>
              <tr v-for="analysis in analysisList" :key="analysis.id" class="table-row">
                <td>
                  <div class="checkbox-container">
                    <input 
                      type="checkbox" 
                      :value="analysis.id"
                      v-model="selectedIds"
                    />
                  </div>
                </td>
                <td>
                  <div class="child-info-cell">
                    <div class="child-avatar">{{ analysis.childName?.charAt(0) || '?' }}</div>
                    <div class="child-details">
                      <div class="child-name">{{ analysis.childName || '未知' }}</div>
                      <div class="child-id">ID: {{ analysis.childId }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="emotion-score">
                    <div class="score-circle" :class="getEmotionScoreClass(getEmotionScore(analysis.emotionScores))">
                      {{ getEmotionScore(analysis.emotionScores) || 0 }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="emotion-tags">
                    <span 
                      v-for="tag in (analysis.emotionTrendTags || []).slice(0, 2)" 
                      :key="tag"
                      class="emotion-tag"
                    >
                      {{ tag }}
                    </span>
                    <span v-if="(analysis.emotionTrendTags || []).length > 2" class="more-tags">
                      +{{ (analysis.emotionTrendTags || []).length - 2 }}
                    </span>
                  </div>
                </td>
                <td>
                  <span class="problem-text">
                    {{ analysis.potentialProblems || '暂无' }}
                  </span>
                </td>
                <td>
                  <div class="key-findings">
                    <p class="findings-text">
                      {{ (analysis.keyFindings && analysis.keyFindings[0]) || analysis.latestAnalysis || '暂无关键发现' }}
                    </p>
                    <button 
                      class="view-more-btn" 
                      @click="viewMoreFindings(analysis)"
                    >
                      查看更多
                    </button>
                  </div>
                </td>
                <td>
                  <div class="analysis-time">
                    <div class="create-time">{{ formatDateTime(analysis.createTime) }}</div>
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <button 
                      class="btn btn-sm btn-outline"
                      @click="viewAnalysisDetail(analysis.id)"
                    >
                      查看
                    </button>
                    <button 
                      class="btn btn-sm btn-primary"
                      @click="generateAnalysis(analysis.childId)"
                    >
                      重新分析
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination-container" v-if="!loading && analysisList.length > 0">
          <div class="pagination-info">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} 到 
            {{ Math.min(currentPage * pageSize, total) }} 条，
            共 {{ total }} 条记录
          </div>
          <div class="pagination">
            <button 
              class="btn btn-sm"
              :disabled="currentPage === 1" 
              @click="handlePageChange(1)"
            >
              首页
            </button>
            <button 
              class="btn btn-sm"
              :disabled="currentPage === 1" 
              @click="handlePageChange(currentPage - 1)"
            >
              上一页
            </button>
            <span class="pagination-current">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button 
              class="btn btn-sm"
              :disabled="currentPage === totalPages" 
              @click="handlePageChange(currentPage + 1)"
            >
              下一页
            </button>
            <button 
              class="btn btn-sm"
              :disabled="currentPage === totalPages" 
              @click="handlePageChange(totalPages)"
            >
              尾页
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="showGenerateModal" class="modal-overlay" @click="showGenerateModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>重新生成AI分析</h3>
            <button class="modal-close" @click="showGenerateModal = false">×</button>
          </div>
          <div class="modal-body">
            <p>请选择要重新分析的儿童：</p>
            <div class="form-group">
              <label for="childId">儿童ID</label>
              <input 
                v-model="generateForm.childId"
                type="number" 
                id="childId"
                placeholder="请输入儿童ID"
                class="form-input"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" @click="showGenerateModal = false">取消</button>
            <button 
              class="btn btn-primary" 
              @click="confirmGenerateAnalysis"
              :disabled="!generateForm.childId || generating"
            >
              {{ generating ? '生成中...' : '确定生成' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import WorkHeader from '@/components/layout/WorkHeader.vue'
import { aiAnalysisService } from '@/services/api/aiAnalysis'
import type { AiAnalysisResultVO, PageResultAiAnalysisResultVO, AiAnalysisQueryDTO } from '@/types/api'
import { useRouter } from 'vue-router'
import { showMessage } from '@/utils/message'

const router = useRouter()

const loading = ref(false)
const analysisList = ref<AiAnalysisResultVO[]>([])
const selectedIds = ref<number[]>([])
const selectAll = ref(false)

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const showGenerateModal = ref(false)
const generating = ref(false)

const generateForm = reactive({
  childId: null as number | null
})

const searchParams = reactive<AiAnalysisQueryDTO>({
  name: '',
  potentialProblems: '',
  emotionTrend: '',
  startDate: '',
  endDate: '',
  page: 1,
  pageSize: 10
})

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const getAnalysisTypeText = (type: string) => {
  const typeMap = {
    auto: '自动分析',
    manual: '手动分析',
    scheduled: '定时分析'
  }
  return typeMap[type as keyof typeof typeMap] || '未知类型'
}

const getEmotionScore = (emotionScores: any) => {
  if (!emotionScores) return 0
  const scores = Object.values(emotionScores)
  if (scores.length === 0) return 0
  return Math.round((scores as number[]).reduce((sum, score) => sum + (score || 0), 0) / scores.length)
}

const getEmotionScoreClass = (score: number) => {
  if (score >= 80) return 'score-high'
  if (score >= 60) return 'score-medium'
  if (score >= 40) return 'score-low'
  return 'score-very-low'
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadAnalysisList = async () => {
  try {
    loading.value = true
    const params = {
      ...searchParams,
      page: currentPage.value,
      pageSize: pageSize.value
    }
    const response = await aiAnalysisService.getAnalysisList(params)
    
    // 由于HTTP响应拦截器已经处理了后端统一格式，现在response就是分页数据
    if (response) {
      analysisList.value = response.records || []
      total.value = response.total || 0
    }
  } catch (error) {
    console.error('加载分析列表失败:', error)
    showMessage('加载分析列表失败', 'error')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadAnalysisList()
}

const handleSearch = () => {
  currentPage.value = 1
  loadAnalysisList()
}

const resetFilters = () => {
  searchParams.name = ''
  searchParams.potentialProblems = ''
  searchParams.emotionTrend = ''
  searchParams.startDate = ''
  searchParams.endDate = ''
  currentPage.value = 1
  loadAnalysisList()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadAnalysisList()
}

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedIds.value = analysisList.value.map(analysis => analysis.id)
  } else {
    selectedIds.value = []
  }
}

const viewAnalysisDetail = (id: number) => {
  router.push(`/analysis/detail/${id}`)
}

const generateAnalysis = (childId: number) => {
  generateForm.childId = childId
  showGenerateModal.value = true
}

const confirmGenerateAnalysis = async () => {
  if (!generateForm.childId) return
  
  try {
    generating.value = true
    await aiAnalysisService.generateAnalysis(generateForm.childId)
    showMessage('分析生成成功', 'success')
    showGenerateModal.value = false
    generateForm.childId = null
    loadAnalysisList()
  } catch (error) {
    console.error('生成分析失败:', error)
    showMessage('生成分析失败', 'error')
  } finally {
    generating.value = false
  }
}

const viewMoreFindings = (analysis: AiAnalysisResultVO) => {
  viewAnalysisDetail(analysis.id)
}

watch(selectedIds, (newVal) => {
  selectAll.value = analysisList.value.length > 0 && newVal.length === analysisList.value.length
})

onMounted(() => {
  loadAnalysisList()
})
</script>

<style scoped>
.analysis-list-container {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 0;
  margin: 0;
}

.analysis-main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4em;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.search-filters-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.search-input {
  width: 25%;
  padding: 8px 40px 8px 12px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;
  cursor: pointer;
}

.filter-select:hover {
  border-color: #9ca3af;
  background-color: #f9fafb;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: white;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 下拉框选项悬停效果 */
.filter-select option {
  color: #374151;
  background-color: white;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.4;
}

.filter-select option:hover,
.filter-select option:focus {
  background-color: #4f46e5;
  color: white;
  font-weight: 500;
}

.filter-select option:checked {
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
}

.date-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 6px;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #4338ca;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-outline {
  background-color: transparent;
  color: #4f46e5;
  border: 1px solid #4f46e5;
}

.btn-outline:hover:not(:disabled) {
  background-color: #4f46e5;
  color: white;
}

.btn-outline:disabled {
  color: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.analysis-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table tr:hover {
  background-color: #f8fafc;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-container input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #4f46e5;
}

.child-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.child-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.child-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.child-name {
  font-weight: 600;
  color: #1a202c;
}

.child-id {
  font-size: 12px;
  color: #64748b;
}

.analysis-type-badge {
  display: inline-block;
  padding: 4px 8px;
  background-color: #dbeafe;
  color: #1d4ed8;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.emotion-score {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: white;
}

.score-high {
  background-color: #22c55e;
}

.score-medium {
  background-color: #f59e0b;
}

.score-low {
  background-color: #ef4444;
}

.score-very-low {
  background-color: #6b7280;
}

.emotion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.emotion-tag {
  display: inline-block;
  padding: 2px 6px;
  background-color: #f3f4f6;
  color: #374151;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.more-tags {
  color: #6b7280;
  font-size: 11px;
}

.problem-text {
  color: #dc2626;
  font-size: 13px;
  font-weight: 500;
}

.key-findings {
  max-width: 200px;
}

.findings-text {
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #374151;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.view-more-btn {
  background: none;
  border: none;
  color: #4f46e5;
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.analysis-time {
  font-size: 13px;
}

.create-time {
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

.pagination {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pagination-current {
  padding: 6px 12px;
  background-color: #e2e8f0;
  color: #374151;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.table-loading {
  text-align: center;
  padding: 40px 20px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.table-empty {
  text-align: center;
  padding: 40px 20px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.data-icon {
  font-size: 48px;
  opacity: 0.5;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: #f1f5f9;
  color: #374151;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

@media (max-width: 1024px) {
  .analysis-main-content {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .page-header .flex {
    flex-direction: column;
    align-items: stretch;
  }
  
  .page-header .flex > div:last-child {
    margin-top: 16px;
  }
  
  .search-filters-card .grid {
    grid-template-columns: 1fr;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 6px;
    font-size: 12px;
  }
  
  .child-info-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .analysis-main-content {
    padding: 12px;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .pagination {
    justify-content: center;
  }
}
</style>