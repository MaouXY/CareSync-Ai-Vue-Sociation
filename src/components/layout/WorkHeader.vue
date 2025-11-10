<template>
  <header class="work-header">
    <div class="work-header-content">
      <!-- 品牌标识 -->
      <div class="work-brand">
        <router-link to="/work-home" class="work-brand-link">
          <div class="work-brand-icon">
            <i class="fa fa-heartbeat"></i>
          </div>
          <span class="work-brand-name">CareSync AI</span>
        </router-link>
        <span class="work-badge">社工端</span>
      </div>

      <!-- 右侧操作区域 -->
      <div class="work-actions">
        <!-- 通知按钮 -->
        <button class="work-notification-btn" @click="toggleNotifications" aria-label="通知">
          <i class="fa fa-bell text-xl"></i>
          <span v-if="notificationCount > 0" class="work-notification-badge">{{ notificationCount }}</span>
        </button>

        <!-- 用户信息 -->
        <div class="work-user-menu">
          <button class="work-user-btn" @click="toggleUserMenu">
            <div class="work-avatar">
              <i class="fa fa-user"></i>
            </div>
            <span class="work-username hidden-sm">{{ userName }}</span>
          </button>
          
          <!-- 用户下拉菜单 -->
          <div v-if="showUserMenu" class="work-user-dropdown">
            <div class="work-dropdown-content">
              <a href="#" class="work-dropdown-item" @click="navigateToProfile">
                <i class="fa fa-user mr-2"></i>
                个人中心
              </a>
              <a href="#" class="work-dropdown-item" @click="navigateToSettings">
                <i class="fa fa-cog mr-2"></i>
                设置
              </a>
              <div class="work-dropdown-divider"></div>
              <a href="#" class="work-dropdown-item work-dropdown-item-danger" @click="handleLogout">
                <i class="fa fa-sign-out mr-2"></i>
                退出登录
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知下拉菜单 -->
    <div v-if="showNotifications" class="work-notification-dropdown">
      <div class="work-notification-header">
        <h3>最新通知</h3>
        <a href="#" @click="markAllAsRead">全部标记为已读</a>
      </div>
      <div class="work-notification-list">
        <div v-for="notification in notifications" :key="notification.id" class="work-notification-item">
          <div class="work-notification-content">
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.content }}</p>
            <span class="work-notification-time">{{ formatNotificationTime(notification.time) }}</span>
          </div>
        </div>
        <div v-if="notifications.length === 0" class="work-empty-notifications">
          <i class="fa fa-bell-slash"></i>
          <p>暂无新通知</p>
        </div>
      </div>
      <div class="work-notification-footer">
        <a href="#" @click="viewAllNotifications">查看全部通知</a>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';
//import { message } from '@arco-design/web-vue/es/message';

// 响应式数据
const showUserMenu = ref(false);
const showNotifications = ref(false);
const notificationCount = ref(5);

// 路由和状态管理
const router = useRouter();
const authStore = useAuthStore();

// 模拟通知数据
const notifications = ref([
  {
    id: 1,
    title: '紧急呼叫处理',
    content: '小明报告身体不适，需要尽快联系确认情况。',
    time: new Date(Date.now() - 30 * 60 * 1000) // 30分钟前
  },
  {
    id: 2,
    title: '方案审核提醒',
    content: '小红的服务方案已生成，等待您的审核确认。',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2小时前
  }
]);

// 计算属性
const userName = computed(() => {
  return authStore.userName || '李社工';
});

// 方法
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  if (showUserMenu.value) {
    showNotifications.value = false;
  }
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    showUserMenu.value = false;
  }
};

const navigateToProfile = () => {
  router.push('/profile');
  showUserMenu.value = false;
};

const navigateToSettings = () => {
  router.push('/settings');
  showUserMenu.value = false;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    message.success('退出成功');
    router.push('/login');
  } catch (error) {
    message.error('退出失败');
  }
  showUserMenu.value = false;
};

const markAllAsRead = () => {
  notificationCount.value = 0;
  message.success('所有通知已标记为已读');
};

const viewAllNotifications = () => {
  router.push('/notifications');
  showNotifications.value = false;
};

const formatNotificationTime = (time: Date) => {
  const now = new Date();
  const diff = now.getTime() - time.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else {
    return `${days}天前`;
  }
};

// 点击外部关闭菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.work-user-menu') && !target.closest('.work-notification-btn')) {
    showUserMenu.value = false;
    showNotifications.value = false;
  }
};

// 生命周期钩子
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.work-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 0 1rem;
  height: 72px;
}

.work-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 品牌标识 */
.work-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.work-brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--primary);
  font-weight: bold;
  font-size: 1.25rem;
}

.work-brand-icon {
  color: var(--accent);
  font-size: 1.5rem;
}

.work-badge {
  background: rgba(79, 70, 229, 0.1);
  color: var(--primary);
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* 右侧操作区域 */
.work-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 通知按钮 */
.work-notification-btn {
  position: relative;
  background: none;
  border: none;
  color: var(--neutral);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.work-notification-btn:hover {
  color: var(--primary);
  background: rgba(79, 70, 229, 0.1);
}

.work-notification-btn:focus {
  outline: none;
  box-shadow: none;
}

.work-notification-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: var(--danger);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* 用户菜单 */
.work-user-menu {
  position: relative;
}

.work-user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.work-user-btn:hover {
  background: rgba(79, 70, 229, 0.1);
}

.work-user-btn:focus {
  outline: none;
  box-shadow: none;
}

.work-avatar {
  width: 2.25rem;
  height: 2.25rem;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 1rem;
}

.work-username {
  font-weight: 500;
  color: var(--dark);
}

/* 下拉菜单 */
.work-user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  min-width: 12rem;
  z-index: 1001;
  animation: dropdownFadeIn 0.2s ease;
}

.work-dropdown-content {
  padding: 0.5rem 0;
}

.work-dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: var(--neutral);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.work-dropdown-item:hover {
  background: var(--light);
  color: var(--primary);
}

.work-dropdown-item:focus {
  outline: none;
  box-shadow: none;
}

.work-dropdown-item-danger {
  color: var(--danger);
}

.work-dropdown-item-danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.work-dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 0.25rem 0;
}

/* 通知下拉菜单 */
.work-notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  width: 20rem;
  max-height: 24rem;
  z-index: 1001;
  animation: dropdownFadeIn 0.2s ease;
}

.work-notification-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.work-notification-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark);
}

.work-notification-header a {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.75rem;
}

.work-notification-list {
  max-height: 16rem;
  overflow-y: auto;
}

.work-notification-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background 0.2s ease;
}

.work-notification-item:hover {
  background: var(--light);
}

.work-notification-item:last-child {
  border-bottom: none;
}

.work-notification-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark);
}

.work-notification-content p {
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  color: var(--neutral);
  line-height: 1.4;
}

.work-notification-time {
  font-size: 0.625rem;
  color: var(--neutral);
}

.work-empty-notifications {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--neutral);
}

.work-empty-notifications i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--neutral);
}

.work-notification-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
}

.work-notification-footer a {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 500;
}

.work-notification-footer a:hover {
  text-decoration: underline;
}

/* 动画 */
@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .work-header {
    padding: 0 0.75rem;
    height: 64px;
  }

  .work-username {
    display: none;
  }

  .work-notification-dropdown {
    width: 18rem;
  }

  .work-user-dropdown {
    min-width: 10rem;
  }
}

@media (max-width: 480px) {
  .work-header-content {
    gap: 0.5rem;
  }

  .work-brand-name {
    display: none;
  }

  .work-notification-dropdown {
    width: calc(100vw - 2rem);
    right: -0.5rem;
  }
}
</style>