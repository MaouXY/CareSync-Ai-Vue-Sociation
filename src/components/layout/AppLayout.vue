<template>
  <div class="app-layout">
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 主内容区域 -->
    <main class="main-content" :class="{ 'no-padding': $slots.header || $slots.footer }">
      <!-- 页面头部插槽 -->
      <div v-if="$slots.header" class="page-header">
        <slot name="header"></slot>
      </div>
      
      <!-- 主要内容插槽 -->
      <div class="content-container">
        <slot></slot>
      </div>
      
      <!-- 页面底部插槽 -->
      <div v-if="$slots.footer" class="page-footer">
        <slot name="footer"></slot>
      </div>
    </main>
    
    <!-- 页脚 -->
    <Footer />
    
    <!-- 返回顶部按钮 -->
    <button
      v-if="showBackToTop"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="返回顶部"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 14L12 9L17 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

// 响应式数据
const showBackToTop = ref(false);

// 监听滚动事件
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding-top: 72px; /* 导航栏高度 */
}

.main-content.no-padding {
  padding-top: 72px;
}

/* 内容容器 */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
}

/* 页面头部 */
.page-header {
  background-color: var(--light);
  padding: var(--spacing-xl) var(--spacing-md);
}

/* 页面底部 */
.page-footer {
  padding: var(--spacing-xl) var(--spacing-md);
  background-color: var(--light);
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  z-index: 999;
  border: none;
  outline: none;
}

.back-to-top:hover {
  background-color: var(--primary-hover);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), 0 10px 25px -5px rgba(79, 70, 229, 0.5);
}

.back-to-top:active {
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    padding-top: 72px;
  }
  
  .content-container {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  .back-to-top {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding-top: 64px;
  }
  
  .content-container {
    padding: var(--spacing-md) var(--spacing-sm);
  }
  
  .page-header,
  .page-footer {
    padding: var(--spacing-lg) var(--spacing-sm);
  }
  
  .back-to-top {
    bottom: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
  }
}

/* 动画效果 */
.back-to-top {
  animation: fadeIn var(--transition-normal);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载状态 */
.app-layout.loading .content-container {
  position: relative;
  min-height: 300px;
}

.app-layout.loading .content-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 3px solid var(--light-hover);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>