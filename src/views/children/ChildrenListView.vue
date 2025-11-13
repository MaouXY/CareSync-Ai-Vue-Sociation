<template>
  <div class="children-list-container">
    <WorkHeader />
    <main class="children-main-content" style="padding-top: 80px;">
      <!-- 页面标题和操作栏 -->
      <div class="page-header pt-4">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 class="page-title">儿童管理</h1>
            <p class="page-subtitle">管理您负责服务的所有儿童信息和状态</p>
          </div>
          <div class="flex items-center ml-auto space-x-4 mt-4 sm:mt-0">
            <button 
              id="refreshBtn" 
              class="btn btn-outline  mr-4"
              @click="handleRefresh"
              :disabled="isLoading"
            >
              <i class="fa fa-refresh" :class="{ 'fa-spin': isLoading }"></i>
              <span class="hidden sm:inline-block">刷新</span>
            </button>
            <button 
              id="addChildBtn" 
              class="btn btn-primary"
              @click="handleAddChild"
            >
              <i class="fa fa-plus"></i>
              <span>添加儿童</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 搜索和筛选 -->
      <div class="search-filters-card">
        <div class="responsive-filters-container">
          <!-- 第一行：搜索框和下拉菜单 -->
          <div class="filter-row">
            <div class="filter-item search-container">
              <input 
                v-model="searchParams.name"
                type="text" 
                placeholder="搜索儿童姓名/编号" 
                class="search-input"
                @keyup.enter="handleSearch"
              />
            </div>
            <select v-model="searchParams.gender" class="filter-select" @change="handleSearch">
              <option value="">所有性别</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
            <select v-model="searchParams.riskLevel" class="filter-select" @change="handleSearch">
              <option value="">所有风险等级</option>
              <option value="low">低风险</option>
              <option value="medium">中风险</option>
              <option value="high">高风险</option>
              <option value="urgent">紧急</option>
            </select>
          </div>
          
          <!-- 第二行：按钮 -->
          <div class="filter-row">
            <div class="action-buttons">
              <button class="btn btn-primary filter-btn" @click="handleSearch">筛选</button>
              <button class="btn btn-outline filter-btn" @click="resetFilters">重置</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 儿童列表 -->
        <div class="table-wrapper">
          <table class="data-table children-table">
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
                <th>ID</th>
                <th>姓名</th>
                <th>年龄</th>
                <th>性别</th>
                <th>风险等级</th>
                <th>地址</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            
            <tbody>
              <template v-if="isLoading">
                <tr v-for="n in 5" :key="'loading-' + n" class="loading-row">
                  <td colspan="9" class="table-loading">
                    <div class="loading-content">
                      <div class="spinner"></div>
                      <span>正在加载儿童数据...</span>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-else-if="children.length === 0">
                <td colspan="9" class="table-empty">
                  <div class="empty-content">
                    <i class="data-icon">👧</i>
                    <p>暂无儿童数据</p>
                    <button class="btn btn-primary" @click="handleAddChild">添加儿童</button>
                  </div>
                </td>
              </tr>
              <tr v-for="child in children" :key="child.id" class="table-row">
                <td>
                  <div class="checkbox-container">
                    <input 
                      type="checkbox" 
                      :value="child.id"
                      v-model="selectedIds"
                    />
                  </div>
                </td>
                <td>{{ child.id }}</td>
                <td>
                  <div class="child-info-cell">
                    <div class="child-avatar bg-primary-light">{{ child.name?.charAt(0) || '?' }}</div>
                    <div class="child-details">
                      <div class="child-name">{{ child.name || '未知' }}</div>
                      <div class="child-id">编号: {{ child.childNo || '-' }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ child.age || '-' }}</td>
                <td>{{ child.gender}}</td>
                <td>
                  <span 
                    class="risk-level-tag"
                    :class="getRiskLevelClass(child.riskLevel)"
                  >
                    {{ getRiskLevelText(child.riskLevel) }}
                  </span>
                </td>
                <td>{{ child.address || '-' }}</td>
                <td>{{ formatDate(child.createTime) }}</td>
                <td>
                  <div class="action-buttons">
                    <button 
                      class="btn btn-sm btn-outline"
                      @click="handleViewChild(child.id)"
                    >
                      <i class="fa fa-eye"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline text-danger"
                      @click="handleDeleteChild(child.id, child.name)"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <!-- 分页信息行 - 放在表格最后一行 -->
              <tr v-if="!isLoading && children.length > 0" class="pagination-row">
                <td colspan="9" class="pagination-cell">
                  <div class="pagination-container table-internal">
                    <div class="pagination-info table-internal">
                      显示第 {{ (pagination.page - 1) * pagination.pageSize + 1 }} 到 
                      {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} 条，
                      共 {{ pagination.total }} 条记录
                    </div>
                    <div class="pagination table-internal">
                      <button 
                        class="btn btn-sm"
                        :disabled="pagination.page === 1" 
                        @click="handlePageChange(1)"
                      >
                        首页
                      </button>
                      <button 
                        class="btn btn-sm"
                        :disabled="pagination.page === 1" 
                        @click="handlePageChange(pagination.page - 1)"
                      >
                        上一页
                      </button>
                      <span class="pagination-current table-internal">
                        {{ pagination.page }} / {{ totalPages }}
                      </span>
                      <button 
                        class="btn btn-sm"
                        :disabled="pagination.page === totalPages" 
                        @click="handlePageChange(pagination.page + 1)"
                      >
                        下一页
                      </button>
                      <button 
                        class="btn btn-sm"
                        :disabled="pagination.page === totalPages" 
                        @click="handlePageChange(totalPages)"
                      >
                        尾页
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showMessage } from '@/utils/message'
import WorkHeader from '@/components/layout/WorkHeader.vue'
import { childApi } from '@/services/api/child'
import type { ChildQueueVO, ChildQueryDTO } from '@/types/api'

const router = useRouter()

// 状态管理
const isLoading = ref(false)
const children = ref<ChildQueueVO[]>([])
const selectedIds = ref<number[]>([])
const selectAll = ref(false)

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(pagination.total / pagination.pageSize)
})

// 搜索参数
const searchParams = reactive<ChildQueryDTO>({
  name: '',
  gender: undefined,
  riskLevel: undefined
})

// 获取风险等级样式类
const getRiskLevelClass = (riskLevel: string) => {
  const classMap: Record<string, string> = {
    low: 'risk-low',
    medium: 'risk-medium',
    high: 'risk-high',
    urgent: 'risk-urgent'
  }
  return classMap[riskLevel] || 'risk-default'
}

// 获取风险等级文本
const getRiskLevelText = (riskLevel: string) => {
  const textMap: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险',
    urgent: '紧急'
  }
  return textMap[riskLevel] || '未知'
}

// 加载儿童列表
const loadChildrenList = async () => {
  try {
    isLoading.value = true
    const response = await childApi.getChildrenList({
      ...searchParams,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    
    if (response.code === 1 && response.data) {
      children.value = response.data.records || []
      pagination.total = response.data.total || 0
      // 重置选择状态
      selectedIds.value = []
      selectAll.value = false
    } else {
      const errorMsg = response.msg || '未知错误'
      showMessage.error(`获取儿童列表失败: ${errorMsg}`)
    }
  } catch (error) {
    console.error('获取儿童列表异常:', error)
    showMessage.error('获取儿童列表失败')
  } finally {
    isLoading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadChildrenList()
}

// 重置筛选
const resetFilters = () => {
  Object.assign(searchParams, {
    name: '',
    minAge: undefined,
    maxAge: undefined,
    hasNewChat: undefined,
    gender: undefined,
    riskLevel: undefined
  })
  pagination.page = 1
  loadChildrenList()
}

// 刷新
const handleRefresh = () => {
  loadChildrenList()
}

// 添加儿童
const handleAddChild = () => {
  router.push('/children/add')
}

// 查看儿童详情
const handleViewChild = (id: number) => {
  router.push(`/children/detail/${id}`)
}

// 编辑儿童
const handleEditChild = (id: number) => {
  router.push(`/children/edit/${id}`)
}

// 删除儿童
const handleDeleteChild = (id: number, name: string) => {
  showMessage.warning('删除功能待实现')
}

// 批量选择
const handleSelectionChange = (rowKeys: (string | number)[]) => {
  selectedIds.value = rowKeys as number[]
  selectAll.value = selectedIds.value.length === children.value.length && children.value.length > 0
}

// 全选/取消全选
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedIds.value = children.value.map(child => child.id)
  } else {
    selectedIds.value = []
  }
}

// 批量删除
const batchDelete = () => {
  showMessage.warning('批量删除功能待实现')
}

// 生成AI分析
const generateAnalysis = (id: number) => {
  showMessage.warning('AI分析功能待实现')
}

// 换页
const handlePageChange = (page: number) => {
  pagination.page = page
  loadChildrenList()
}

// 获取状态颜色
const getStatusColor = (riskLevel: string) => {
  const colorMap: Record<string, string> = {
    low: 'green',
    medium: 'orange',
    high: 'red',
    urgent: 'red'
  }
  return colorMap[riskLevel] || 'gray'
}

// 获取状态文本
const getStatusText = (riskLevel: string) => {
  const textMap: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险',
    urgent: '紧急'
  }
  return textMap[riskLevel] || '未知'
}

// 格式化时间
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化
onMounted(() => {
  loadChildrenList()
})
</script>

<style scoped>
  /* 全局样式重置 */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* 容器样式 */
  .children-list-container {
    min-height: 100vh;
    background-color: #f9fafb;
    position: relative;
  }

  /* 确保内容在粘性页眉下方 */
  .children-main-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
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

  .mr-4 {
    margin-right: 1rem;
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

  .text-danger {
    color: #ef4444 !important;
    border-color: #ef4444 !important;
  }

  .text-danger:hover:not(:disabled) {
    background-color: #fef2f2;
  }

  .hidden {
    display: none;
  }

  .sm\:inline-block {
    display: inline-block;
  }

  /* 搜索筛选区 */
  .search-filters-card {
    background-color: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }

  .responsive-filters-container {
    width: 100%;
  }

  .filter-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    align-items: center;
    flex-wrap: wrap;
  }

  .filter-row:last-child {
    margin-bottom: 0;
  }

  .filter-item {
    flex: 1;
    min-width: 200px;
  }

  .search-container {
    flex: 2;
    min-width: 280px;
  }

  .search-input {
    width: 100%;
    padding: 10px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    background-color: #ffffff;
    transition: border-color 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  .filter-select {
    flex: 1;
    min-width: 160px;
    padding: 10px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    background-color: white;
    color: #374151;
    transition: border-color 0.2s ease;
  }

  .filter-select:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  .filter-select option {
    color: #374151;
    background-color: white;
    padding: 8px 12px;
  }

  .filter-select option:checked {
    background-color: #4f46e5;
    color: white;
  }

  .filter-select option:hover {
    background-color: #f3f4f6;
  }

  .action-buttons {
    display: flex;
    gap: 12px;
  }

  .filter-btn {
    min-width: 80px;
  }

  .table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }

  /* 表格基础样式 */
  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .data-table thead {
    background-color: #f9fafb;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .data-table th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap;
  }

  .data-table td {
    padding: 12px 16px;
    font-size: 14px;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: middle;
  }

  .table-row:hover {
    background-color: #f9fafb;
  }

  .table-row:last-child td {
    border-bottom: none;
  }

  /* 复选框样式 - 强制白色背景 */
  .checkbox-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 强制白色背景的最强选择器 */
  .data-table thead input[type="checkbox"],
  .data-table tbody input[type="checkbox"],
  input[type="checkbox"] {
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    background: #ffffff !important;
    border: 2px solid #d1d5db !important;
    width: 16px !important;
    height: 16px !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    position: relative !important;
    margin: 0 !important;
    padding: 0 !important;
    display: inline-block !important;
  }

  .data-table thead input[type="checkbox"]:checked,
  .data-table tbody input[type="checkbox"]:checked,
  input[type="checkbox"]:checked {
    background: #4f46e5 !important;
    border-color: #4f46e5 !important;
  }

  .data-table thead input[type="checkbox"]:checked::after,
  .data-table tbody input[type="checkbox"]:checked::after,
  input[type="checkbox"]:checked::after {
    content: "" !important;
    position: absolute !important;
    left: 2px !important;
    top: 2px !important;
    width: 8px !important;
    height: 8px !important;
    background: white !important;
    border-radius: 1px !important;
  }

  .data-table thead input[type="checkbox"]:hover,
  .data-table tbody input[type="checkbox"]:hover,
  input[type="checkbox"]:hover {
    border-color: #9ca3af !important;
    background: #ffffff !important;
  }

  .data-table thead input[type="checkbox"]:checked:hover,
  .data-table tbody input[type="checkbox"]:checked:hover,
  input[type="checkbox"]:checked:hover {
    background: #4338ca !important;
    border-color: #4338ca !important;
  }

  .data-table thead input[type="checkbox"]:focus,
  .data-table tbody input[type="checkbox"]:focus,
  input[type="checkbox"]:focus {
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
    border-color: #4f46e5 !important;
  }

  /* 最高优先级覆盖所有可能的全局样式 */
  [data-v-1adc4e54] input[type="checkbox"] {
    background-color: #ffffff !important;
  }

  /* 儿童信息单元格 */
  .child-info-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .child-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #4f46e5;
    background-color: #e0e7ff;
    font-size: 14px;
  }

  .bg-primary-light {
    background-color: #e0e7ff;
  }

  .child-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .child-name {
    font-weight: 600;
    color: #111827;
  }

  .child-id {
    font-size: 12px;
    color: #6b7280;
  }

  /* 风险等级标签 */
  .risk-level-tag {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
  }

  .risk-low {
    background-color: #dcfce7;
    color: #166534;
  }

  .risk-medium {
    background-color: #fef3c7;
    color: #92400e;
  }

  .risk-high {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .risk-urgent {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #ef4444;
  }

  .risk-default {
    background-color: #f3f4f6;
    color: #6b7280;
  }

  /* 加载状态 */
  .table-loading {
    text-align: center;
    padding: 40px;
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #f3f4f6;
    border-top: 3px solid #4f46e5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* 空数据状态 */
  .table-empty {
    text-align: center;
    padding: 60px 20px;
  }

  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .data-icon {
    font-size: 48px;
  }

  /* 分页 */
  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }

  .pagination-info {
    font-size: 14px;
    color: #6b7280;
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pagination-current {
    font-size: 14px;
    font-weight: 500;
    color: #4f46e5;
    padding: 0 12px;
  }

  /* 表格分页行样式 - 表格最后一行 */
  .pagination-row {
    background-color: #f9fafb;
  }

  .pagination-cell {
    padding: 12px 16px;
    border: none;
    background-color: #f9fafb;
  }

  .pagination-container.table-internal {
    margin: 0;
    padding: 0;
    border-top: none;
    background-color: transparent;
  }

  .pagination-info.table-internal {
    font-size: 13px;
    color: #6b7280;
  }

  .pagination.table-internal {
    gap: 6px;
  }

  .pagination.table-internal .btn {
    padding: 6px 10px;
    font-size: 12px;
    min-width: auto;
  }

  .pagination-current.table-internal {
    font-size: 13px;
    padding: 0 8px;
  }

  /* Font Awesome 动画 */
  .fa-spin {
    animation: fa-spin 1s linear infinite;
  }

  @keyframes fa-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* 响应式设计 */
  @media (max-width: 1024px) {
    .children-main-content {
      padding: 20px;
    }

    .search-filters-card,
    .children-table-container {
      padding: 20px;
    }
  }

  @media (max-width: 768px) {
    .children-main-content {
      padding: 16px;
    }

    .search-filters-card,
    .children-table-container {
      padding: 16px;
    }

    .filter-row {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .filter-item,
    .search-container,
    .filter-select {
      width: 100%;
      min-width: auto;
    }

    .action-buttons {
      justify-content: flex-end;
    }

    .pagination-container {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .pagination {
      justify-content: center;
      flex-wrap: wrap;
    }

    /* 确保表格在小屏幕上可以水平滚动 */
    .table-wrapper {
      -webkit-overflow-scrolling: touch;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 24px;
    }

    .btn {
      padding: 8px 12px;
      font-size: 13px;
    }

    .search-filters-card,
    .children-table-container {
      padding: 12px;
      border-radius: 8px;
    }

    .data-table th,
    .data-table td {
      padding: 8px 12px;
      font-size: 13px;
    }

    .child-avatar {
      width: 32px;
      height: 32px;
      font-size: 13px;
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
</style>