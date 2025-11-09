<template>
  <div class="login-container">
    <!-- 登录卡片 -->
    <div class="login-wrapper shadow-lg card-hover rounded-xl">
      <!-- 紫色气泡卡片 -->
      <div class="bg-primary-6 p-6 rounded-t-xl ">
        <div class="text-center py-6 mb-2">
          <div class="h-6"></div>
          <div class="w-16 h-16 rounded-full flex items-center justify-center ml-6" style="background-color: #726BEA;">
            <i class="fa fa-file-text text-2xl text-primary"></i>
          </div>
          <h2 class="mt-2">社工登录</h2>
          <p class="pb-4">欢迎回到 CareSync AI</p>
        </div>
      </div>

      <!-- 登录表单 -->
      <div class="p-8">
        <a-form id="loginForm" :model="form" @submit="handleLogin" layout="vertical">
          <!-- 社工账号输入 -->
          <a-form-item 
            field="username" 
            :validate-status="errors.username ? 'error' : ''"
            :feedback="errors.username"
            label="账号"
            class="mb-6"
          >
            <a-input 
                v-model="form.username" 
                placeholder="请输入您的账号" 
                size="large"
                allow-clear
                :style="{ borderRadius: '10px', 'border-color': '#EEF5FF' }" 
              >
              <template #prefix>
                <icon-user />
              </template>
            </a-input>
          </a-form-item>
          
          <!-- 密码输入 -->
          <a-form-item 
            field="password" 
            :validate-status="errors.password ? 'error' : ''"
            :feedback="errors.password"
            class="mb-6"
          >
            <template #label>
                  <div class="flex justify-between items-center w-full">
                    <span>密码</span>
                  </div>
                </template>
            <a-input-password 
                v-model="form.password" 
                placeholder="请输入您的密码" 
                size="large"
                :visibility="showPassword"
                @visibility-change="showPassword = $event"
                :style="{ borderRadius: '10px', 'border-color': '#EEF5FF' }"
              >
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
          </a-form-item>
          
          <!-- 记住账号 -->
          <a-form-item class="mb-8">
            <a-checkbox v-model="form.rememberMe">
              记住账号
            </a-checkbox>
          </a-form-item>
          
          <!-- 登录按钮 -->
          <a-form-item>
            <a-button 
                type="primary" 
                html-type="submit" 
                :loading="isLoading" 
                size="large"
                long
                :style="{ backgroundColor: '#4F46E5', borderRadius: '10px' }"
                class="w-full h-12 text-base font-medium"
              >
              <template #icon>
                <icon-login />
              </template>
              {{ isLoading ? '登录中...' : '登录' }}
            </a-button>
          </a-form-item>
          
          <!-- 错误消息 -->
          <a-alert 
            v-if="errors.general" 
            type="error" 
            :title="errors.general"
            class="mt-4"
            closable
          />
        </a-form>
      </div>
    </div>
    
    <!-- 背景装饰 -->
    <div class="bg-decorations">
      <div class="decor-circle decor-circle-1"></div>
      <div class="decor-circle decor-circle-2"></div>
      <div class="decor-circle decor-circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';

// 路由实例
const router = useRouter();

// 认证store
const authStore = useAuthStore();

// 登录类型
const loginType = ref<'socialWorker' | 'child'>('socialWorker');

// 密码可见性
const showPassword = ref(false);

// 加载状态
const isLoading = ref(false);

// 表单数据
const form = reactive({
  username: '',
  password: '',
  rememberMe: false
});

// 表单错误
const errors = reactive({
  username: '',
  password: '',
  general: ''
});

// 表单验证
const validateForm = (): boolean => {
  let isValid = true;
  
  // 重置错误
  errors.username = '';
  errors.password = '';
  errors.general = '';
  
  // 验证账号
  if (!form.username.trim()) {
    errors.username = loginType.value === 'socialWorker' ? '请输入工号' : '请输入学生号';
    isValid = false;
  }
  
  // 验证密码
  if (!form.password) {
    errors.password = '请输入密码';
    isValid = false;
  } else if (form.password.length < 4) {
    errors.password = '密码长度至少为6位';
    isValid = false;
  }
  
  return isValid;
};

// 处理登录
const handleLogin = async (e?: Event) => {
  // 如果传递了Event对象，阻止默认行为
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  
  // 验证表单
  if (!validateForm()) {
    return;
  }
  
  try {
    isLoading.value = true;
    
    // 调用认证store进行登录
    const loginData = {
      workerNo: form.username,
      password: form.password
    };
    
    const result = await authStore.login(loginData);
    
    if (result.code === 1) {
      // 登录成功
      if (form.rememberMe) {
        // 保存记住账号信息（不包含敏感信息）
        localStorage.setItem('careSyncUser', JSON.stringify({
          username: form.username,
          type: loginType.value
        }));
      }
      
      // 根据登录类型跳转到不同页面
      if (loginType.value === 'socialWorker') {
        router.push('/children');
      } else {
        router.push('/child/dashboard');
      }
    } else {
      errors.general = result.msg || '登录失败，请重试';
    }
  } catch (error: any) {
    console.error('登录失败，完整错误信息:', error);
    errors.general = error.message || '登录失败，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

// 尝试从本地存储恢复登录信息
const recoverLoginInfo = () => {
  const savedUser = localStorage.getItem('careSyncUser');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      form.username = user.username || '';
      form.rememberMe = true;
      if (user.type) {
        loginType.value = user.type;
      }
    } catch (error) {
      console.error('恢复登录信息失败:', error);
    }
  }
};

// 初始化时恢复登录信息
recoverLoginInfo();

// 组件挂载时初始化认证store
onMounted(() => {
  authStore.initialize();
});
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.login-wrapper {
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
}

.login-subtitle {
  font-size: 16px;
  color: #6B7280;
  margin: 0;
}

.login-type-switch {
  display: flex;
  background-color: #F3F4F6;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 24px;
}

.switch-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.switch-btn.active {
  background-color: #ffffff;
  color: #4F46E5;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
}

.switch-btn:hover:not(.active) {
  color: #4F46E5;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 6px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  font-size: 16px;
  color: #1F2937;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input::placeholder {
  color: #9CA3AF;
}

.input-wrapper i {
  position: absolute;
  left: 16px;
  color: #9CA3AF;
  font-size: 18px;
}

/* 图标样式（这里使用简单的方块模拟图标，实际项目中应使用图标库） */
.icon-user::before {
  content: "👤";
}

.icon-lock::before {
  content: "🔒";
}

.icon-eye::before {
  content: "👁️";
}

.icon-eye-off::before {
  content: "👁️‍🗨️";
}

.icon-loading::before {
  content: "⏳";
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.toggle-password-btn {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.toggle-password-btn:hover {
  background-color: #F3F4F6;
  color: #4F46E5;
}

.error-message {
  display: block;
  font-size: 13px;
  color: #EF4444;
  margin-top: 4px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  accent-color: #4F46E5;
}

.checkbox-label {
  font-size: 14px;
  color: #6B7280;
}

.forgot-password {
  background: transparent;
  border: none;
  font-size: 14px;
  color: #4F46E5;
  cursor: pointer;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #4338CA;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 14px 24px;
  background-color: #4F46E5;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover:not(:disabled) {
  background-color: #4338CA;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.login-btn:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 6px;
}

.demo-accounts {
  margin-top: 24px;
  padding: 16px;
  background-color: #F9FAFB;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
}

.demo-title {
  font-size: 14px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 8px;
}

.demo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 4px;
}

.demo-item:last-child {
  margin-bottom: 0;
}

.demo-label {
  font-weight: 500;
}

.demo-account {
  background-color: #E5E7EB;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding: 16px;
}

.login-footer p {
  font-size: 13px;
  color: #9CA3AF;
  margin: 0;
}

/* 背景装饰 */
.bg-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.decor-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.decor-circle-1 {
  width: 400px;
  height: 400px;
  background-color: rgba(79, 70, 229, 0.3);
  top: -100px;
  left: -100px;
  animation: float 8s ease-in-out infinite;
}

.decor-circle-2 {
  width: 300px;
  height: 300px;
  background-color: rgba(16, 185, 129, 0.3);
  bottom: -100px;
  right: -100px;
  animation: float 10s ease-in-out infinite reverse;
}

.decor-circle-3 {
  width: 200px;
  height: 200px;
  background-color: rgba(249, 115, 22, 0.3);
  top: 50%;
  right: 10%;
  animation: float 12s ease-in-out infinite;
}

/* 背景色 */
.bg-f9fafb { background-color: #f9fafb; }

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(20px, 20px) rotate(5deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    padding: 16px;
  }
  
  .login-card {
    padding: 32px 24px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .login-subtitle {
    font-size: 14px;
  }
  
  .decor-circle-1 {
    width: 300px;
    height: 300px;
  }
  
  .decor-circle-2 {
    width: 250px;
    height: 250px;
  }
  
  .decor-circle-3 {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px 20px;
  }
  
  .login-type-switch {
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }
  
  .switch-btn {
    padding: 10px 16px;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .demo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>