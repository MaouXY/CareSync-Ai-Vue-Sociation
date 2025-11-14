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
            <a-button 
              id="refreshBtn" 
              type="default" 
              :loading="isLoading"
              @click="handleRefresh"
              :disabled="isLoading"
            >
              <template #icon>
                <icon-refresh />
              </template>
              <span class="hidden sm:inline-block">刷新</span>
            </a-button>
            <a-button 
              id="addChildBtn" 
              type="primary"
              @click="handleAddChild"
            >
              <template #icon>
                <icon-plus />
              </template>
              <span>添加儿童</span>
            </a-button>
          </div>
        </div>
      </div>
      
      <!-- 搜索和筛选 -->
      <div class="search-filters-card">
        <div class="responsive-filters-container">
          <!-- 第一行：搜索框和下拉菜单 -->
          <div class="filter-row">
            <div class="filter-item search-container">
              <a-input 
                v-model="searchParams.name"
                placeholder="搜索儿童姓名/编号" 
                class="search-input"
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <icon-search />
                </template>
              </a-input>
            </div>
            <a-select
              v-model="searchParams.gender"
              placeholder="所有性别"
              allow-clear
              class="filter-select"
              @change="handleSearch"
            >
              <a-option value="">所有性别</a-option>
              <a-option value="male">男</a-option>
              <a-option value="female">女</a-option>
            </a-select>
            <a-select
              v-model="searchParams.riskLevel"
              placeholder="所有风险等级"
              allow-clear
              class="filter-select"
              @change="handleSearch"
            >
              <a-option value="">所有风险等级</a-option>
              <a-option value="low">低风险</a-option>
              <a-option value="medium">中风险</a-option>
              <a-option value="high">高风险</a-option>
              <a-option value="urgent">紧急</a-option>
            </a-select>
          </div>
          
          <!-- 第二行：按钮 -->
          <div class="filter-row">
            <div class="action-buttons">
              <a-button type="primary" class="filter-btn" @click="handleSearch">筛选</a-button>
              <a-button type="default" class="filter-btn" @click="resetFilters">重置</a-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 儿童列表 -->
      <div class="table-wrapper">
        <a-space direction="vertical" size="large" fill>
          <!-- <div>
            <span>OnlyCurrent: </span>
            <a-switch v-model="rowSelection.onlyCurrent" />
          </div> -->
          <a-table
            row-key="id"
            :columns="columns"
            :data="children"
            :loading="isLoading"
            :pagination="false"
            :row-selection="rowSelection"
            v-model:selectedKeys="selectedIds"
          />
        </a-space>
        
        <!-- 增强版分页组件 -->
        <div v-if="!isLoading && children.length > 0">
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
import { ref, onMounted, reactive, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { showMessage } from '@/utils/message'
import WorkHeader from '@/components/layout/WorkHeader.vue'
import { childApi } from '@/services/api/child'
import type { ChildQueueVO, ChildQueryDTO } from '@/types/api'
import EnhancedPagination from '@/components/common/EnhancedPagination.vue'
// Arco Design 组件
import { 
  TableColumn as ATableColumn,
  Button as AButton,
  Input as AInput,
  Select as ASelect,
  Option as AOption,
  Table as ATable,
  Tag as ATag,
  Space as ASpace,
  Switch as ASwitch
} from '@arco-design/web-vue'
import { 
  IconRefresh,
  IconPlus,
  IconSearch,
  IconEye,
  IconDelete
} from '@arco-design/web-vue/es/icon'

const router = useRouter()

// 状态管理
const isLoading = ref(false)
const children = ref<ChildQueueVO[]>([])
const selectedIds = ref<number[]>([])
const selectAll = ref(false)

// 分页信息 - 与EnhancedPagination组件API保持一致
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value)
})

// 搜索参数
const searchParams = reactive<ChildQueryDTO>({
  name: '',
  gender: '',
  riskLevel: ''
})

// 行选择器配置
const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

// 表格列定义 - 简化版本
const columns: ATableColumn<ChildQueueVO>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 80
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    render: ({ record }: { record: ChildQueueVO }) => {
      return record.gender === "男"? record.gender :  record.gender === "女"? record.gender : '-';
    }
  },
  {
    title: '风险等级',
    dataIndex: 'riskLevel',
    key: 'riskLevel',
    width: 100,
    render: ({ record }: any) => {
      const colorMap: Record<string, string> = {
        低风险: 'arcoblue',
        中风险: 'orangered',
        高风险: 'red', 
        紧急: 'red'
      }
      const text = record.riskLevel || '未知'
      const color = colorMap[record.riskLevel] || 'gray'
      
      return h(ATag, {
        color: color,
        size: 'small',
        bordered: true
      }, () => text)
    }
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime', 
    key: 'createTime',
    width: 180,
    customRender: ({ record }: any) => {
      if (!record.createTime) return '-'
      const date = new Date(record.createTime)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
    customRender: ({ record }: any) => {
      return h('div', { class: 'action-buttons' }, [
        h('button', {
          class: 'btn btn-sm btn-outline',
          onClick: () => handleViewChild(record.id)
        }, '查看'),
        h('button', {
          class: 'btn btn-sm btn-primary',
          onClick: () => handleEditChild(record.id)  
        }, '编辑')
      ])
    }
  }
]

// 加载儿童列表
const loadChildrenList = async () => {
  try {
    isLoading.value = true
    const response = await childApi.getChildrenList({
      ...searchParams,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    
    if (response.code === 1 && response.data) {
      children.value = response.data.records || []
      total.value = response.data.total || 0
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
  currentPage.value = 1
  loadChildrenList()
}

// 重置筛选
const resetFilters = () => {
  Object.assign(searchParams, {
    name: '',
    gender: '',
    riskLevel: ''
  })
  currentPage.value = 1
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

// 换页
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadChildrenList()
}

// 每页条数变更
const handlePageSizeChange = (pageSizeValue: number) => {
  pageSize.value = pageSizeValue
  currentPage.value = 1
  loadChildrenList()
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
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }

  /* 响应式设计 */
  @media (max-width: 1024px) {
    .children-main-content {
      padding: 20px;
    }

    .search-filters-card {
      padding: 20px;
    }
  }

  @media (max-width: 768px) {
    .children-main-content {
      padding: 16px;
    }

    .search-filters-card {
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
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 24px;
    }

    .btn {
      padding: 8px 12px;
      font-size: 13px;
    }

    .search-filters-card {
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

  /* 风险等级标签胶囊样式 */
  :deep(.risk-tag) {
    border-radius: 12px !important;
    padding: 2px 8px !important;
    font-size: 12px !important;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 确保ATag组件使用正确的胶囊样式 */
  :deep(.arco-tag) {
    border-radius: 12px !important;
  }
</style>