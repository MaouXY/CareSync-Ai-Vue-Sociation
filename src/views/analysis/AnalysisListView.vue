<template>
  <div class="analysis-list-container">
    <WorkHeader />
    <main class="analysis-main-content" style="padding-top: 80px;">
      <div class="page-header pt-4">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 class="page-title">AI分析结果</h1>
            <p class="page-subtitle">查看AI对儿童心理状态和需求的分析结果</p>
          </div>

          <div class="flex items-center ml-auto space-x-4 mt-4 sm:mt-0">
            <button 
              id="refreshBtn" 
              class="btn btn-outline  mr-4"
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
        <div class="responsive-filters-container">
          <!-- 第一行：搜索框和下拉菜单 -->
          <div class="filter-row">
            <div class="filter-item search-container">
              <input 
                v-model="searchParams.name"
                type="text" 
                placeholder="搜索儿童姓名/潜在问题/情感趋势" 
                class="search-input"
                @keyup.enter="handleSearch"
              />
            </div>
            <a-select
              v-model="searchParams.potentialProblems"
              placeholder="所有潜在问题"
              allow-clear
              size="large"
              class="filter-select"
            >
              <a-option value="">所有潜在问题</a-option>
              <a-option value="confidence">社交互动信心不足</a-option>
              <a-option value="attention">注意力分散问题</a-option>
              <a-option value="communication">沟通主动性不足</a-option>
              <a-option value="family">家庭情感支持不足</a-option>
            </a-select>
            <a-select
              v-model="searchParams.emotionTrend"
              placeholder="所有情感趋势"
              allow-clear
              size="large"
              class="filter-select"
            >
              <a-option value="">所有情感趋势</a-option>
              <a-option value="孤独">孤独</a-option>
              <a-option value="平静">平静</a-option>
              <a-option value="开心">开心</a-option>
              <a-option value="专注">专注</a-option>
              <a-option value="急躁">急躁</a-option>
              <a-option value="封闭">封闭</a-option>
            </a-select>
          </div>
          
          <!-- 第二行：日期选择和操作按钮 -->
          <div class="filter-row">
            <div class="date-range-container">
              <span class="date-label">分析日期：</span>
              <a-date-picker
                v-model="searchParams.startDate"
                placeholder="开始日期"
                size="large"
                class="date-picker"
              />
              <span class="date-separator">至</span>
              <a-date-picker
                v-model="searchParams.endDate"
                placeholder="结束日期"
                size="large"
                class="date-picker"
              />
            </div>
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
                      class="bg-light"
                      v-model="selectAll"
                      @change="handleSelectAll"
                    />
                  </div>
                </th>
                <th>儿童信息</th>
                <th>情绪分数</th>
                <th>情感标签</th>
                <th>潜在问题</th>
                <th>分析时间</th>
                <th>操作</th>
              </tr>
            </thead>
            
            <tbody>
              <tr v-if="loading" v-for="n in 5" :key="n" class="loading-row">
                <td colspan="7" class="table-loading">
                  <div class="loading-content">
                    <div class="spinner"></div>
                    <span>正在加载分析数据...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="analysisList.length === 0">
                <td colspan="7" class="table-empty">
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
                    <div class="child-avatar bg-primary-light">{{ analysis.childName?.charAt(0) || '?' }}</div>
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
                      v-for="tag in (analysis.emotionTrendTags || [])" 
                      :key="tag"
                      class="emotion-tag"
                      :class="tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td>
                  <span 
                    class="problem-tag"
                    :class="analysis.potentialProblems"
                  >
                    {{ analysis.potentialProblems || '暂无' }}
                  </span>
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
        
        <!-- 增强版分页组件 -->
        <div v-if="!loading && analysisList.length > 0">
          <EnhancedPagination
            v-model:currentPage="currentPage"
            v-model:pageSize="pageSize"
            :total="total"
            :pageSizeOptions="[5,10, 20, 30, 50]"
            showTotal
            showJumper
            showSizeChanger
            @change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          />
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
import EnhancedPagination from '@/components/common/EnhancedPagination.vue'

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

const handlePageSizeChange = (pageSizeValue: number) => {
  pageSize.value = pageSizeValue
  currentPage.value = 1
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

/* 响应式筛选布局 */
.responsive-filters-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  box-sizing: border-box; /* 关键：让width包含padding和border */
}

.search-input:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
  appearance: none;
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234F46E5' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") no-repeat right 12px center;
  background-size: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 40px 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 200px;
  flex: 1;
}

/* 第二行布局样式 */
.date-filters {
  display: flex;
  gap: 16px;
  flex: 1;
  align-items: center;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.date-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
}

.date-separator {
  font-size: 14px;
  color: #6b7280;
  padding: 0 4px;
}

.date-input {
  flex: 1;
  min-width: 150px;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
  background-color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.date-input:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.filter-btn {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 12px;
  min-width: 80px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.filter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 移动端响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-container {
    max-width: none;
  }
  
  .filter-select {
    min-width: auto;
  }
  
  .date-filters {
    flex-direction: column;
    gap: 12px;
  }
  
  .date-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .date-label {
    font-size: 13px;
  }
  
  .date-input {
    min-width: auto;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .responsive-filters-container {
    gap: 12px;
  }
  
  .filter-row {
    gap: 12px;
  }
  
  .filter-select,
  .search-input,
  .date-input,
  .filter-btn {
    font-size: 13px;
    padding: 10px 12px;
  }
}

.filter-select:hover {
  border-color: #4F46E5;
  background-color: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.filter-select:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background-color: white;
  transform: translateY(-1px);
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

/* 已移除所有旧的Arco Design分页组件样式 */

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
  appearance: none;
  background-color: white;
  border: 2px solid #d1d5db;
  border-radius: 3px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 勾选框选中状态 */
.checkbox-container input[type="checkbox"]:checked {
  background-color: white;
  border-color: #4f46e5;
}

/* 勾选框选中后的勾选标记 */
.checkbox-container input[type="checkbox"]:checked::after {
  content: "✓";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #4f46e5;
  font-size: 12px;
  font-weight: bold;
}

/* 悬停效果 */
.checkbox-container input[type="checkbox"]:hover {
  border-color: #4f46e5;
}

/* 聚焦效果 */
.checkbox-container input[type="checkbox"]:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
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
  gap: 6px;
  align-items: center;
}

/* 情感标签胶囊样式 */
.emotion-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

/* 情感标签颜色主题 */
.emotion-tag.积极情绪 {
  background-color: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}

.emotion-tag.消极情绪 {
  background-color: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.emotion-tag.焦虑 {
  background-color: #fef3c7;
  color: #d97706;
  border-color: #fed7aa;
}

.emotion-tag.愤怒 {
  background-color: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

.emotion-tag.悲伤 {
  background-color: #ddd6fe;
  color: #7c3aed;
  border-color: #c4b5fd;
}

.emotion-tag.快乐 {
  background-color: #dcfce7;
  color: #15803d;
  border-color: #bbf7d0;
}

.emotion-tag.兴奋 {
  background-color: #fef3c7;
  color: #d97706;
  border-color: #fed7aa;
}

.emotion-tag.平静 {
  background-color: #e0f2fe;
  color: #0369a1;
  border-color: #bae6fd;
}

.emotion-tag.孤独 {
  background-color: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.emotion-tag.害怕 {
  background-color: #f3e8ff;
  color: #7c2d12;
  border-color: #e9d5ff;
}

.emotion-tag.困惑 {
  background-color: #f3f4f6;
  color: #4b5563;
  border-color: #d1d5db;
}

/* 默认样式 - 当没有匹配到具体类型时使用 */
.emotion-tag:not([class*="积极情绪"]):not([class*="消极情绪"]):not([class*="焦虑"]):not([class*="愤怒"]):not([class*="悲伤"]):not([class*="快乐"]):not([class*="兴奋"]):not([class*="平静"]):not([class*="孤独"]):not([class*="害怕"]):not([class*="困惑"]) {
  background-color: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.more-tags {
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
}

/* 潜在问题胶囊样式 */
.problem-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

/* 潜在问题颜色主题 */
.problem-tag.社交互动信心不足 {
  background-color: #fef3c7;
  color: #d97706;
  border-color: #fed7aa;
}

.problem-tag.注意力分散问题 {
  background-color: #e0e7ff;
  color: #4f46e5;
  border-color: #c7d2fe;
}

.problem-tag.沟通主动性不足 {
  background-color: #fce7f3;
  color: #be185d;
  border-color: #fbcfe8;
}

.problem-tag.家庭情感支持不足 {
  background-color: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.problem-tag.学习动机不足 {
  background-color: #fef3c7;
  color: #d97706;
  border-color: #fed7aa;
}

.problem-tag.情绪调节困难 {
  background-color: #f3e8ff;
  color: #7c2d12;
  border-color: #e9d5ff;
}

.problem-tag.人际冲突 {
  background-color: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

.problem-tag.适应问题 {
  background-color: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.problem-tag.无明显问题 {
  background-color: #dcfce7;
  color: #166534;
  border-color: #bbf7d0;
}

/* 默认样式 - 当没有匹配到具体类型时使用 */
.problem-tag:not([class*="社交互动"]):not([class*="注意力"]):not([class*="沟通"]):not([class*="家庭"]):not([class*="学习"]):not([class*="情绪调节"]):not([class*="人际冲突"]):not([class*="适应"]):not([class*="无明显"]) {
  background-color: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.problem-text {
  font-size: 13px;
  font-weight: 500;
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

/* 已清理所有旧的分页相关样式 */

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
}
</style>