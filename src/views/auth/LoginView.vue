<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- 登录卡片 -->
      <div class="login-card">
        <div class="login-header ">
          <h1 class="login-title">欢迎登录 CareSync AI</h1>
          <p class="login-subtitle">专注于留守儿童情感陪伴与服务的智能平台</p>
        </div>
        
        <!-- 登录表单 -->
        <form class="login-form" @submit.prevent="handleLogin">
          <!-- 登录类型切换 -->
          <div class="login-type-switch">
            <button
              type="button"
              :class="['switch-btn', { active: loginType === 'socialWorker' }]"
              @click="loginType = 'socialWorker'"
            >
              社工端
            </button>
            <button
              type="button"
              :class="['switch-btn', { active: loginType === 'child' }]"
              @click="loginType = 'child'"
            >
              儿童端
            </button>
          </div>
          
          <!-- 账号输入 -->
          <div class="form-group">
            <label for="username" class="form-label">账号</label>
            <div class="input-wrapper">
              <i class="icon-user"></i>
              <input
                id="username"
                v-model="form.username"
                type="text"
                class="form-input"
                :placeholder="loginType === 'socialWorker' ? '请输入工号' : '请输入学生号'"
                required
                autocomplete="username"
              />
            </div>
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
          </div>
          
          <!-- 密码输入 -->
          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="input-wrapper">
              <i class="icon-lock"></i>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请输入密码"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                class="toggle-password-btn"
                @click="showPassword = !showPassword"
                aria-label="切换密码可见性"
              >
                <i :class="showPassword ? 'icon-eye-off' : 'icon-eye'"></i>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          
          <!-- 记住我 -->
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="form.rememberMe" class="checkbox" />
              <span class="checkbox-label">记住我</span>
            </label>
            <button type="button" class="forgot-password" @click="handleForgotPassword">
              忘记密码？
            </button>
          </div>
          
          <!-- 登录按钮 -->
          <button
            type="submit"
            class="login-btn"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">登录</span>
            <span v-else class="loading-spinner">
              <i class="icon-loading"></i> 登录中...
            </span>
          </button>
          
          <!-- 模拟账号提示 -->
          <div class="demo-accounts">
            <div class="demo-title">模拟账号：</div>
            <div class="demo-item">
              <span class="demo-label">社工端：</span>
              <span class="demo-account">admin / 123456</span>
            </div>
            <div class="demo-item">
              <span class="demo-label">儿童端：</span>
              <span class="demo-account">student / 123456</span>
            </div>
          </div>
        </form>
      </div>
      
      <!-- 底部版权信息 -->
      <div class="login-footer">
        <p>&copy; 2024 CareSync AI 留守儿童情感陪伴平台. 保留所有权利.</p>
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

// 路由实例
const router = useRouter();

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
  } else if (form.password.length < 6) {
    errors.password = '密码长度至少为6位';
    isValid = false;
  }
  
  return isValid;
};

// 处理登录
const handleLogin = async () => {
  // 验证表单
  if (!validateForm()) {
    return;
  }
  
  try {
    isLoading.value = true;
    
    // 模拟登录请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 简单的模拟登录逻辑
    let isSuccess = false;
    
    if (loginType.value === 'socialWorker') {
      // 社工端登录验证
      isSuccess = form.username === 'admin' && form.password === '123456';
    } else {
      // 儿童端登录验证
      isSuccess = form.username === 'student' && form.password === '123456';
    }
    
    if (isSuccess) {
      // 保存登录信息到本地存储
      if (form.rememberMe) {
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
      errors.general = '账号或密码错误，请重试';
      // 显示错误提示（可以使用toast组件）
      alert(errors.general);
    }
  } catch (error) {
    console.error('登录失败:', error);
    errors.general = '登录失败，请稍后重试';
    alert(errors.general);
  } finally {
    isLoading.value = false;
  }
};

// 处理忘记密码
const handleForgotPassword = () => {
  // 在实际应用中，这里可以跳转到忘记密码页面或显示忘记密码的模态框
  alert('忘记密码功能暂未开放，请联系管理员重置密码。');
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

.login-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  transition: all 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #4F46E5;
  margin: 0 0 10px 0;
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