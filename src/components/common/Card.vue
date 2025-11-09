<template>
  <div 
    class="card" 
    :class="[
      `card-${variant}`,
      `card-${size}`,
      { 'card-hover': hoverable },
      { 'card-disabled': disabled }
    ]"
  >
    <!-- 卡片头部 -->
    <div v-if="$slots.header || title" class="card-header"
      :class="{ 'card-header-no-border': !border }"
    >
      <div v-if="title" class="card-title"
        :class="{ 'card-title-has-extra': $slots.extra }"
      >
        <h3 v-if="useHeading" class="card-title-heading"
          :class="`card-title-h${headingLevel}`"
        >
          {{ title }}
        </h3>
        <div v-else class="card-title-text"
          :class="{ [`text-${titleLevel}`]: titleLevel }"
        >
          {{ title }}
        </div>
      </div>
      <slot v-else name="header"></slot>
      <!-- 卡片额外内容 -->
      <div v-if="$slots.extra" class="card-extra">
        <slot name="extra"></slot>
      </div>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card-body"
      :class="{ 
        'card-body-padding-sm': size === 'small',
        'card-body-padding-lg': size === 'large'
      }"
    >
      <slot></slot>
    </div>
    
    <!-- 卡片底部 -->
    <div v-if="$slots.footer" class="card-footer"
      :class="{ 
        'card-footer-no-border': !border,
        'card-footer-center': footerAlign === 'center',
        'card-footer-right': footerAlign === 'right'
      }"
    >
      <slot name="footer"></slot>
    </div>
    
    <!-- 加载遮罩 -->
    <div v-if="loading" class="card-loading"
      :class="{ 'card-loading-transparent': loading === 'transparent' }"
    >
      <div class="card-loading-spinner">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V4M12 20V22M4 12H6M20 12H18M17.78 6.22L19.19 7.63M7.63 19.19L6.22 17.78M17.78 17.78L19.19 16.37M7.63 4.81L6.22 6.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Props定义
defineProps({
  // 卡片变体：default、primary、secondary、outline、ghost
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'primary', 'secondary', 'outline', 'ghost'].includes(value)
  },
  
  // 卡片尺寸：small、medium、large
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value)
  },
  
  // 卡片标题
  title: {
    type: String,
    default: ''
  },
  
  // 标题级别
  titleLevel: {
    type: String,
    default: 'lg',
    validator: (value: string) => ['sm', 'base', 'lg', 'xl'].includes(value)
  },
  
  // 是否使用标题标签
  useHeading: {
    type: Boolean,
    default: true
  },
  
  // 标题标签级别
  headingLevel: {
    type: Number,
    default: 3,
    validator: (value: number) => value >= 1 && value <= 6
  },
  
  // 是否显示边框
  border: {
    type: Boolean,
    default: true
  },
  
  // 是否可悬浮
  hoverable: {
    type: Boolean,
    default: false
  },
  
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  
  // 是否加载中
  loading: {
    type: [Boolean, String],
    default: false
  },
  
  // 底部对齐方式
  footerAlign: {
    type: String,
    default: 'left',
    validator: (value: string) => ['left', 'center', 'right'].includes(value)
  },
  
  // 自定义样式类
  className: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.card {
  position: relative;
  background-color: white;
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  overflow: hidden;
}

/* 变体样式 */
.card-default {
  background-color: white;
  border: 1px solid var(--light-hover);
  box-shadow: var(--shadow-sm);
}

.card-primary {
  background-color: var(--primary);
  color: white;
  border: none;
  box-shadow: var(--shadow-md);
}

.card-secondary {
  background-color: var(--secondary);
  color: white;
  border: none;
  box-shadow: var(--shadow-md);
}

.card-outline {
  background-color: transparent;
  border: 2px solid var(--light-hover);
  box-shadow: none;
}

.card-ghost {
  background-color: transparent;
  border: none;
  box-shadow: none;
}

/* 尺寸样式 */
.card-small {
  border-radius: var(--radius-md);
}

.card-large {
  border-radius: var(--radius-xl);
}

/* 悬浮效果 */
.card-hover {
  cursor: pointer;
}

.card-hover:hover:not(.card-disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* 禁用状态 */
.card-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-md);
  border-bottom: 1px solid var(--light-hover);
}

.card-header-no-border {
  border-bottom: none;
}

.card-title {
  font-weight: 600;
  color: inherit;
}

.card-title-has-extra {
  flex: 1;
  margin-right: var(--spacing-md);
}

.card-title-heading {
  margin: 0;
  line-height: 1.4;
}

.card-title-h1 {
  font-size: 2rem;
}

.card-title-h2 {
  font-size: 1.75rem;
}

.card-title-h3 {
  font-size: 1.5rem;
}

.card-title-h4 {
  font-size: 1.25rem;
}

.card-title-h5 {
  font-size: 1.125rem;
}

.card-title-h6 {
  font-size: 1rem;
}

.card-title-text {
  margin: 0;
  line-height: 1.4;
}

.text-sm {
  font-size: 0.875rem;
}

.text-base {
  font-size: 1rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-xl {
  font-size: 1.25rem;
}

/* 卡片额外内容 */
.card-extra {
  display: flex;
  align-items: center;
}

/* 卡片内容 */
.card-body {
  padding: var(--spacing-lg);
}

.card-body-padding-sm {
  padding: var(--spacing-md);
}

.card-body-padding-lg {
  padding: var(--spacing-xl);
}

/* 卡片底部 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
  border-top: 1px solid var(--light-hover);
}

.card-footer-no-border {
  border-top: none;
}

.card-footer-center {
  justify-content: center;
}

.card-footer-right {
  justify-content: flex-end;
}

/* 加载遮罩 */
.card-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(2px);
}

.card-loading-transparent {
  background-color: rgba(255, 255, 255, 0.5);
}

.card-primary .card-loading,
.card-secondary .card-loading {
  background-color: rgba(255, 255, 255, 0.3);
}

.card-primary .card-loading-spinner,
.card-secondary .card-loading-spinner {
  color: white;
}

.card-loading-spinner {
  color: var(--primary);
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

/* 响应式设计 */
@media (max-width: 640px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .card-title-has-extra {
    margin-right: 0;
    flex: none;
  }
  
  .card-extra {
    width: 100%;
    justify-content: space-between;
  }
  
  .card-footer {
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
  
  .card-title-heading {
    font-size: 1.25rem;
  }
}

/* 无头部/无底部时的内容边距调整 */
.card:not(:has(.card-header)) .card-body {
  padding-top: var(--spacing-lg);
}

.card:not(:has(.card-footer)) .card-body {
  padding-bottom: var(--spacing-lg);
}

.card:not(:has(.card-header)):not(:has(.card-footer)) .card-body {
  padding: var(--spacing-lg);
}

/* 暗色模式适配 */
.card-primary,
.card-secondary {
  color: white;
}

.card-primary .card-header,
.card-secondary .card-header,
.card-primary .card-footer,
.card-secondary .card-footer {
  border-color: rgba(255, 255, 255, 0.2);
}
</style>