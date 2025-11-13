<template>
  <div class="pagination-container">
    <!-- 分页信息 -->
    <div class="pagination-info" v-if="showTotal">
      {{ paginationInfoText }}
    </div>
    
    <!-- 分页控制 -->
    <div class="pagination">
      <!-- 首页按钮 -->
      <button 
        class="pagination-btn pagination-first"
        @click="goToFirstPage"
        :disabled="currentPage === 1"
        :title="'首页'"
      >
        <span class="pagination-icon">≪</span>
      </button>
      
      <!-- 上一页按钮 -->
      <button 
        class="pagination-btn pagination-prev"
        @click="goToPrevPage"
        :disabled="currentPage === 1"
        :title="'上一页'"
      >
        <span class="pagination-icon">‹</span>
      </button>
      
      <!-- 页码列表 -->
      <template v-for="(page, index) in visiblePages" :key="page === '...' ? `ellipsis-${index}` : page">
        <!-- 省略号 -->
        <span v-if="page === '...'" class="pagination-ellipsis">...</span>
        
        <!-- 页码按钮 -->
        <button
          v-else
          class="pagination-item"
          :class="{
            'pagination-item-active': page === currentPage,
            'pagination-item-hover': hoveredPage === page
          }"
          @click="goToPage(page)"
          @mouseenter="hoveredPage = page"
          @mouseleave="hoveredPage = null"
        >
          {{ page }}
        </button>
      </template>
      
      <!-- 下一页按钮 -->
      <button 
        class="pagination-btn pagination-next"
        @click="goToNextPage"
        :disabled="currentPage === totalPages"
        :title="'下一页'"
      >
        <span class="pagination-icon">›</span>
      </button>
      
      <!-- 末页按钮 -->
      <button 
        class="pagination-btn pagination-last"
        @click="goToLastPage"
        :disabled="currentPage === totalPages"
        :title="'末页'"
      >
        <span class="pagination-icon">≫</span>
      </button>
    </div>
    
    <!-- 页码跳转 -->
    <div class="pagination-jumper" v-if="showJumper">
      <span>前往</span>
      <input 
        type="number" 
        class="pagination-jumper-input"
        v-model.number="jumpToPage"
        @keyup.enter="handleJump"
        @blur="handleJump"
        :min="1"
        :max="totalPages"
        :placeholder="currentPage"
      >
      <span>页</span>
    </div>
    
    <!-- 每页条数选择 -->
    <div class="pagination-size-changer" v-if="showSizeChanger">
      <span>每页</span>
      <select 
        class="pagination-size-select"
        v-model.number="pageSize"
        @change="handlePageSizeChange"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
      <span>条</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props定义
const props = defineProps<{
  total: number
  currentPage?: number
  pageSize?: number
  pageSizeOptions?: number[]
  showTotal?: boolean
  showJumper?: boolean
  showSizeChanger?: boolean
  siblingCount?: number
  boundaryCount?: number
}>()

// Emits定义
const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [pageSize: number]
  'change': [page: number]
  'page-size-change': [pageSize: number]
}>()

// 响应式数据
const currentPage = ref(props.currentPage || 1)
const pageSize = ref(props.pageSize || 10)
const jumpToPage = ref<number>(currentPage.value)
const hoveredPage = ref<number | null>(null)

// 计算属性
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.total / pageSize.value))
})

const paginationInfoText = computed(() => {
  const start = props.total > 0 ? (currentPage.value - 1) * pageSize.value + 1 : 0
  const end = Math.min(currentPage.value * pageSize.value, props.total)
  return `显示第 ${start} 到 ${end} 条，共 ${props.total} 条记录`
})

// 生成可见页码列表（包含省略号逻辑）
  const visiblePages = computed(() => {
    const { siblingCount = 1, boundaryCount = 1 } = props
    const total = totalPages.value
    const current = currentPage.value
    const pages: (number | string)[] = []
    
    // 生成所有页码
    const range = (start: number, end: number) => {
      const result = []
      for (let i = start; i <= end; i++) {
        result.push(i)
      }
      return result
    }
    
    // 添加起始页码
    const startPages = range(1, Math.min(boundaryCount, total))
    const endPages = range(Math.max(total - boundaryCount + 1, boundaryCount + 1), total)
    
    // 计算中间部分
    const siblingsStart = Math.max(
      Math.min(
        current - siblingCount,
        total - boundaryCount - siblingCount * 2 - 1
      ),
      boundaryCount + 1
    )
    
    const siblingsEnd = Math.min(
      Math.max(
        current + siblingCount,
        boundaryCount + siblingCount * 2 + 1
      ),
      endPages.length > 0 ? endPages[0] - 1 : total
    )
    
    // 构建页码数组
    // 添加起始页码
    pages.push(...startPages)
    
    // 添加前省略号或单个页码
    if (siblingsStart > boundaryCount + 1) {
      pages.push('...')
    } else if (boundaryCount < total && siblingsStart > boundaryCount) {
      // 只添加页码，如果它不在起始页码中
      const pageToAdd = boundaryCount + 1
      if (!startPages.includes(pageToAdd)) {
        pages.push(pageToAdd)
      }
    }
    
    // 添加中间页码，确保不重复
    const middleRange = range(siblingsStart, siblingsEnd)
    for (const page of middleRange) {
      if (!pages.includes(page)) {
        pages.push(page)
      }
    }
    
    // 添加后省略号或单个页码
    if (siblingsEnd < total - boundaryCount) {
      pages.push('...')
    } else if (total - boundaryCount > 1 && siblingsEnd < total - boundaryCount) {
      const pageToAdd = total - boundaryCount
      if (!pages.includes(pageToAdd)) {
        pages.push(pageToAdd)
      }
    }
    
    // 添加结束页码，确保不重复
    for (const page of endPages) {
      if (!pages.includes(page)) {
        pages.push(page)
      }
    }
    
    return pages
  })

// 监听器
watch(currentPage, (newPage) => {
  emit('update:currentPage', newPage)
  emit('change', newPage)
  jumpToPage.value = newPage
})

watch(() => props.currentPage, (newPage) => {
  if (newPage && newPage !== currentPage.value) {
    currentPage.value = newPage
  }
})

// 页面导航方法
const goToPage = (page: number) => {
  if (page !== currentPage.value && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const goToFirstPage = () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
}

const goToLastPage = () => {
  if (currentPage.value !== totalPages.value) {
    currentPage.value = totalPages.value
  }
}

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 页码跳转处理
const handleJump = () => {
  let page = jumpToPage.value
  
  // 验证页码范围
  if (isNaN(page) || page < 1) {
    page = 1
  } else if (page > totalPages.value) {
    page = totalPages.value
  }
  
  jumpToPage.value = page
  if (page !== currentPage.value) {
    currentPage.value = page
  }
}

// 每页条数变化处理
const handlePageSizeChange = () => {
  // 当每页条数变化时，重置到第一页
  currentPage.value = 1
  emit('update:pageSize', pageSize.value)
  emit('page-size-change', pageSize.value)
}
</script>

<style scoped>
/* 分页容器基础样式 */
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

/* 分页信息样式 */
.pagination-info {
  color: #6B7280;
  font-size: 14px;
  font-weight: 500;
  min-width: 200px;
}

/* 分页控制区域 */
.pagination {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}

/* 分页按钮基础样式 */
.pagination-btn {
  min-width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.pagination-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.05), transparent);
  transition: left 0.5s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #4F46E5;
  color: #4F46E5;
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.pagination-btn:hover:not(:disabled)::before {
  left: 100%;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  background: #f9fafb;
}

/* 页码项样式 */
.pagination-item {
  min-width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  position: relative;
  overflow: hidden;
}

.pagination-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.1), transparent);
  transition: left 0.5s;
}

.pagination-item:hover,
.pagination-item-hover {
  border-color: #4F46E5;
  color: #4F46E5;
  background: #f8fafc;
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.pagination-item:hover::before {
  left: 100%;
}

.pagination-item-active {
  background: #4F46E5;
  border-color: #4F46E5;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  transform: translateY(-1px);
}

.pagination-item-active:hover {
  background: #4338ca;
  border-color: #4338ca;
  color: #ffffff;
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.5);
}

/* 省略号样式 */
.pagination-ellipsis {
  padding: 0 8px;
  color: #9CA3AF;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
}

/* 页码跳转样式 */
.pagination-jumper {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.pagination-jumper:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.pagination-jumper-input {
  width: 60px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  background: #ffffff;
  color: #374151;
}

.pagination-jumper-input:focus {
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  transform: translateY(-1px);
}

.pagination-jumper-input:hover:not(:focus) {
  border-color: #cbd5e1;
  background: #f8fafc;
}

/* 每页条数选择器样式 */
.pagination-size-changer {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.pagination-size-changer:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.pagination-size-select {
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  color: #374151;
  position: relative;
  overflow: hidden;
}

.pagination-size-select:focus {
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  transform: translateY(-1px);
}

.pagination-size-select:hover:not(:focus) {
  border-color: #cbd5e1;
  background: #f8fafc;
}

/* 美化select下拉箭头 */
.pagination-size-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

/* 响应式设计 */
/* 平板和小型桌面 */
@media (max-width: 992px) {
  .pagination-container {
    gap: 12px;
    padding: 16px;
  }
  
  .pagination-info {
    font-size: 13px;
    min-width: 180px;
  }
}

/* 平板和手机 */
@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
  
  .pagination-info {
    min-width: auto;
    text-align: center;
    font-size: 13px;
  }
  
  .pagination {
    gap: 2px;
    justify-content: center;
  }
  
  .pagination-btn,
  .pagination-item {
    min-width: 32px;
    height: 32px;
    font-size: 13px;
    padding: 0 6px;
    border-radius: 6px;
  }
  
  .pagination-jumper,
  .pagination-size-changer {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .pagination-jumper-input {
    width: 50px;
    height: 32px;
    font-size: 13px;
    border-radius: 6px;
  }
  
  .pagination-size-select {
    height: 32px;
    font-size: 13px;
    border-radius: 6px;
    padding-right: 20px;
  }
  
  /* 优化移动端显示 */
  .pagination-jumper-input::placeholder,
  .pagination-size-select::placeholder {
    font-size: 12px;
  }
}

/* 大屏手机 */
@media (max-width: 576px) {
  .pagination-container {
    padding: 14px;
    gap: 10px;
  }
  
  .pagination-btn,
  .pagination-item {
    min-width: 30px;
    height: 30px;
    font-size: 12px;
  }
  
  .pagination-info {
    font-size: 12px;
  }
  
  .pagination-jumper,
  .pagination-size-changer {
    font-size: 12px;
    gap: 6px;
    padding: 5px 8px;
  }
  
  .pagination-jumper-input {
    width: 45px;
    height: 30px;
    font-size: 12px;
  }
  
  .pagination-size-select {
    height: 30px;
    font-size: 12px;
    padding-right: 18px;
  }
}

/* 小屏手机 */
@media (max-width: 480px) {
  .pagination-container {
    padding: 12px;
    gap: 8px;
    border-radius: 8px;
  }
  
  .pagination-btn,
  .pagination-item {
    min-width: 28px;
    height: 28px;
    font-size: 12px;
    border-radius: 5px;
  }
  
  /* 在极小屏幕上，优先显示必要的导航按钮，减少显示的页码数量 */
  .pagination-ellipsis + .pagination-item,
  .pagination-item + .pagination-ellipsis {
    display: none;
  }
  
  .pagination-jumper,
  .pagination-size-changer {
    font-size: 11px;
    padding: 4px 6px;
    gap: 4px;
  }
  
  .pagination-jumper-input {
    width: 40px;
    height: 28px;
    font-size: 11px;
    border-radius: 5px;
  }
  
  .pagination-size-select {
    height: 28px;
    font-size: 11px;
    border-radius: 5px;
    padding-right: 16px;
  }
  
  /* 在极小屏幕上简化显示 */
  .pagination-info {
    display: none;
  }
}

/* 极小屏幕适配 */
@media (max-width: 360px) {
  .pagination-container {
    padding: 8px;
  }
  
  .pagination-btn,
  .pagination-item {
    min-width: 26px;
    height: 26px;
    font-size: 11px;
  }
  
  /* 只显示必要的导航控件 */
  .pagination-jumper,
  .pagination-size-changer {
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
}
</style>