<template>
  <header 
    class="navbar" 
    :class="{ 'navbar-scrolled': isScrolled }"
  >
    <div class="container">
      <div class="navbar-content">
        <!-- 品牌标识 -->
        <div class="navbar-brand">
          <router-link to="/" class="brand-link">
            <div class="brand-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3.33334C8.84 3.33334 3.33333 8.84 3.33333 16C3.33333 23.16 8.84 28.6667 16 28.6667C23.16 28.6667 28.6667 23.16 28.6667 16C28.6667 8.84 23.16 3.33334 16 3.33334ZM16 26C9.93333 26 5.33333 21.4 5.33333 15.3333C5.33333 9.26667 9.93333 4.66667 16 4.66667C22.0667 4.66667 26.6667 9.26667 26.6667 15.3333C26.6667 21.4 22.0667 26 16 26Z" fill="#4F46E5"/>
                <path d="M10.6667 13.3333H12.6667V20.6667H10.6667V13.3333ZM17.3333 13.3333H19.3333V20.6667H17.3333V13.3333Z" fill="white"/>
              </svg>
            </div>
            <span class="brand-name">CareSync AI</span>
          </router-link>
        </div>

        <!-- 桌面导航菜单 -->
        <nav class="navbar-nav hidden-sm">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link 
                to="/" 
                class="nav-link" 
                exact
                :class="{ 'nav-link-active': $route.path === '/' }"
              >
                首页
              </router-link>
            </li>
            <li class="nav-item">
              <router-link 
                to="/children" 
                class="nav-link"
                :class="{ 'nav-link-active': $route.path.includes('/children') }"
              >
                儿童管理
              </router-link>
            </li>
            <li class="nav-item">
              <router-link 
                to="/analysis" 
                class="nav-link"
                :class="{ 'nav-link-active': $route.path.includes('/analysis') }"
              >
                AI分析
              </router-link>
            </li>
            <li class="nav-item">
              <router-link 
                to="/schemes" 
                class="nav-link"
                :class="{ 'nav-link-active': $route.path.includes('/schemes') }"
              >
                服务方案
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- 操作按钮区域 -->
        <div class="navbar-actions">
          <router-link to="/login" class="btn btn-outline btn-sm mr-2">登录</router-link>
          <router-link to="/login" class="btn btn-primary btn-sm">注册</router-link>
          
          <!-- 移动端菜单按钮 -->
          <button 
            class="menu-toggle hidden-md" 
            @click="toggleMenu"
            aria-label="菜单"
          >
            <svg 
              v-if="!mobileMenuOpen" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg 
              v-else 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端导航菜单 -->
    <div 
      class="mobile-menu" 
      :class="{ 'mobile-menu-open': mobileMenuOpen }"
    >
      <nav class="mobile-nav">
        <ul class="mobile-nav-list">
          <li class="mobile-nav-item">
            <router-link 
              to="/" 
              class="mobile-nav-link" 
              exact
              :class="{ 'mobile-nav-link-active': $route.path === '/' }"
              @click="closeMenu"
            >
              首页
            </router-link>
          </li>
          <li class="mobile-nav-item">
            <router-link 
              to="/children" 
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': $route.path.includes('/children') }"
              @click="closeMenu"
            >
              儿童管理
            </router-link>
          </li>
          <li class="mobile-nav-item">
            <router-link 
              to="/analysis" 
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': $route.path.includes('/analysis') }"
              @click="closeMenu"
            >
              AI分析
            </router-link>
          </li>
          <li class="mobile-nav-item">
            <router-link 
              to="/schemes" 
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': $route.path.includes('/schemes') }"
              @click="closeMenu"
            >
              服务方案
            </router-link>
          </li>
        </ul>
        <div class="mobile-nav-actions">
          <router-link to="/login" class="btn btn-outline btn-block mb-2" @click="closeMenu">登录</router-link>
          <router-link to="/login" class="btn btn-primary btn-block" @click="closeMenu">注册</router-link>
        </div>
      </nav>
    </div>

    <!-- 背景遮罩 -->
    <div 
      v-if="mobileMenuOpen" 
      class="menu-backdrop" 
      @click="closeMenu"
    ></div>
  </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

// 响应式数据
const isScrolled = ref(false);
const mobileMenuOpen = ref(false);
const route = useRoute();

// 监听滚动事件，改变导航栏样式
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

// 切换移动端菜单
const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// 关闭移动端菜单
const closeMenu = () => {
  mobileMenuOpen.value = false;
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
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: white;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.navbar-scrolled {
  background-color: white;
  box-shadow: var(--shadow-md);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

/* 品牌标识 */
.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--dark);
  transition: color var(--transition-fast);
}

.brand-link:hover {
  color: var(--primary);
  text-decoration: none;
}

.brand-icon {
  margin-right: 0.75rem;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark);
}

/* 桌面导航菜单 */
.navbar-nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: var(--spacing-xl);
}

.nav-item {
  position: relative;
}

.nav-link {
  display: block;
  padding: 0.5rem 0;
  font-weight: 500;
  color: var(--dark);
  text-decoration: none;
  transition: color var(--transition-fast);
  position: relative;
}

.nav-link:hover {
  color: var(--primary);
  text-decoration: none;
}

.nav-link-active {
  color: var(--primary);
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary);
  border-radius: 1px;
}

/* 操作按钮区域 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* 移动端菜单按钮 */
.menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background-color: transparent;
  color: var(--dark);
  transition: all var(--transition-fast);
}

.menu-toggle:hover {
  background-color: var(--light);
  color: var(--primary);
}

/* 移动端导航菜单 */
.mobile-menu {
  position: fixed;
  top: 72px;
  right: -100%;
  width: 80%;
  max-width: 320px;
  height: calc(100vh - 72px);
  background-color: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right var(--transition-normal);
  z-index: 999;
  overflow-y: auto;
}

.mobile-menu-open {
  right: 0;
}

.mobile-nav {
  padding: var(--spacing-xl);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-nav-list {
  list-style: none;
  margin-bottom: auto;
}

.mobile-nav-item {
  margin-bottom: var(--spacing-sm);
}

.mobile-nav-link {
  display: block;
  padding: 1rem;
  font-weight: 500;
  color: var(--dark);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.mobile-nav-link:hover {
  background-color: var(--light);
  color: var(--primary);
  text-decoration: none;
}

.mobile-nav-link-active {
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary);
}

.mobile-nav-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xl);
}

/* 背景遮罩 */
.menu-backdrop {
  position: fixed;
  top: 72px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  transition: opacity var(--transition-normal);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .navbar-nav {
    display: none;
  }
}

@media (max-width: 640px) {
  .navbar-content {
    height: 64px;
  }
  
  .brand-name {
    font-size: 1.25rem;
  }
  
  .mobile-menu {
    top: 64px;
    height: calc(100vh - 64px);
    width: 100%;
  }
  
  .menu-backdrop {
    top: 64px;
  }
}
</style>