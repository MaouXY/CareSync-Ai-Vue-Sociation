<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-block': block },
      { 'btn-disabled': disabled || loading },
      { 'btn-loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
    :type="type"
  >
    <!-- 加载状态图标 -->
    <div v-if="loading" class="btn-loading-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4V6M12 18V20M4 12H6M20 12H18M17.78 6.22L19.19 7.63M7.63 19.19L6.22 17.78M17.78 17.78L19.19 16.37M7.63 4.81L6.22 6.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    
    <!-- 图标 -->
    <span v-if="icon && !loading" class="btn-icon">
      <component :is="icon" :size="iconSize" />
    </span>
    
    <!-- 文本内容 -->
    <span v-if="$slots.default" class="btn-text">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

// Props定义
const props = defineProps({
  // 按钮类型：primary、secondary、accent、outline、ghost
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'accent', 'outline', 'ghost', 'success'].includes(value)
  },
  
  // 按钮尺寸：small、medium、large
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value)
  },
  
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  
  // 是否加载中
  loading: {
    type: Boolean,
    default: false
  },
  
  // 是否块级按钮
  block: {
    type: Boolean,
    default: false
  },
  
  // 按钮类型：button、submit、reset
  type: {
    type: String,
    default: 'button',
    validator: (value: string) => ['button', 'submit', 'reset'].includes(value)
  },
  
  // 图标组件
  icon: {
    type: [Object, Function, String],
    default: null
  },
  
  // 图标尺寸
  iconSize: {
    type: [String, Number],
    default: 16
  }
});

// Emits定义
const emit = defineEmits(['click']);

// 计算属性
const computedIconSize = computed(() => {
  // 根据按钮尺寸自动调整图标大小
  switch (props.size) {
    case 'small':
      return props.iconSize || 14;
    case 'large':
      return props.iconSize || 20;
    default:
      return props.iconSize || 16;
  }
});

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  outline: none;
  font-family: inherit;
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  white-space: nowrap;
}

/* 变体样式 */
.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: var(--secondary);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--secondary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-accent {
  background-color: var(--accent);
  color: white;
}

.btn-accent:hover:not(:disabled) {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-success {
  background-color: var(--success);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: var(--success-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background-color: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

.btn-outline:hover:not(:disabled) {
  background-color: var(--primary);
  color: white;
}

.btn-ghost {
  background-color: transparent;
  color: var(--dark);
}

.btn-ghost:hover:not(:disabled) {
  background-color: var(--light);
}

/* 尺寸样式 */
.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 32px;
}

.btn-medium {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  min-height: 40px;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  min-height: 48px;
}

/* 块级按钮 */
.btn-block {
  width: 100%;
}

/* 禁用状态 */
.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

/* 加载状态 */
.btn-loading {
  opacity: 0.8;
  cursor: not-allowed;
}

.btn-loading-icon {
  display: inline-flex;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 图标样式 */
.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 文本样式 */
.btn-text {
  display: inline-block;
}

/* 无文本只有图标的情况 */
.btn:has(.btn-icon):not(:has(.btn-text)) {
  gap: 0;
  padding: var(--spacing-sm);
}

.btn-small:has(.btn-icon):not(:has(.btn-text)) {
  padding: 0.5rem;
}

.btn-medium:has(.btn-icon):not(:has(.btn-text)) {
  padding: 0.75rem;
}

.btn-large:has(.btn-icon):not(:has(.btn-text)) {
  padding: 1rem;
}

/* 焦点状态 */
.btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* 活动状态 */
.btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .btn {
    font-size: 0.875rem;
  }
  
  .btn-medium {
    padding: 0.625rem 1.25rem;
  }
  
  .btn-large {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

/* 特殊情况处理 */
.btn-outline.btn-disabled {
  border-color: var(--light-hover);
  color: var(--neutral);
  background-color: transparent;
}

.btn-ghost.btn-disabled {
  color: var(--neutral);
  background-color: transparent;
}

/* success变体的特殊处理 */
.btn-success:has(.btn-icon):not(:has(.btn-text)) {
  background-color: var(--success);
  color: white;
}
</style>