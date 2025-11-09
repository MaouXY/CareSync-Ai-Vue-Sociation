<template>
  <div class="min-h-screen">
    <!-- 导航栏 -->
    <header class="fixed top-0 left-0 right-0 bg-white backdrop-blur-md shadow-sm z-50 transition-custom" style="background-color: rgba(255, 255, 255, 0.8);">
      <div class="container px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="text-primary font-bold text-xl flex items-center">
              <i class="fa fa-heartbeat mr-2 text-primary"></i>
              <span class="text-primary">CareSync AI</span>
            </div>
          </div>
          <nav class="hidden md:flex space-x-8 mr-8">
            <a href="#features" class="text-dark hover:text-primary transition-custom" @click="scrollToSection('features')">核心功能</a>
            <a href="#advantages" class="text-dark hover:text-primary transition-custom" @click="scrollToSection('advantages')">平台优势</a>
            <a href="#login" class="text-dark hover:text-primary transition-custom" @click="scrollToSection('login')">登录入口</a>
            <a href="#about" class="text-dark hover:text-primary transition-custom" @click="scrollToSection('about')">关于我们</a>
          </nav>
          <div class="md:hidden">
            <button type="button" class="text-dark hover:text-primary focus:outline-none" @click="toggleMobileMenu">
              <i class="fa fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 英雄区域 -->
    <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-primary">
      <div class="container text-center">
        <h1 class="responsive-heading text-dark mb-6 leading-tight text-shadow">
          <span class="text-primary">AI 智能陪伴</span> + 
          <span class="text-secondary">社工精准介入</span>
        </h1>
        <p class="responsive-text text-neutral max-w-3xl mx-auto mb-10">
          为留守儿童提供有温度、可信赖的即时情感回应和安全的倾诉出口，
          依托结构化数据支撑社工开展针对性服务
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#login" class="btn btn-primary py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-custom" @click="scrollToSection('login')">
            立即开始体验
          </a>
          <a href="#features" class="btn btn-outline py-3 px-8 rounded-lg shadow hover:shadow-md transition-custom" @click="scrollToSection('features')">
            了解更多功能
          </a>
        </div>
      </div>
    </section>

    <!-- 核心功能 -->
    <section id="features" class="py-20 bg-white bg-light">
      <div class="container px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="responsive-subheading text-dark mb-4">核心功能</h2>
          <p class="text-neutral max-w-8xl">全方位满足留守儿童情感陪伴与社工服务需求</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 功能卡片1 -->
          <div class="bg-neutral rounded-xl shadow-md p-6 card-hover p-4">
            <div class="w-14 h-14 rounded-full flex items-center justify-center mb-6 mt-2 ml-4" style="background-color: rgba(79, 70, 229, 0.1);">
              <i class="fa fa-comments text-2xl text-primary"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-dark">AI 情感陪伴</h3>
            <p class="text-neutral">安全合规的 AI 交互填补日常情感空白，提供即时回应和情感支持</p>
          </div>
          
          <!-- 功能卡片2 -->
          <div class="bg-neutral rounded-xl shadow-md p-6 card-hover p-4">
            <div class="w-14 h-14 rounded-full flex items-center justify-center mb-6 mt-2 ml-4" style="background-color: rgba(16, 185, 129, 0.1);">
              <i class="fa fa-users text-2xl text-secondary"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-dark">社工精准服务</h3>
            <p class="text-neutral">基于 AI 分析的结构化数据，帮助社工快速定位需求，实现精准介入</p>
          </div>
          
          <!-- 功能卡片3 -->
          <div class="bg-neutral rounded-xl shadow-md p-6 card-hover p-4">
            <div class="w-14 h-14 rounded-full flex items-center justify-center mb-6 mt-2 ml-4" style="background-color: rgba(249, 115, 22, 0.1);">
              <i class="fa fa-bell text-2xl text-accent"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-dark">紧急呼叫</h3>
            <p class="text-neutral">提供安全快捷的紧急求助通道，确保儿童在需要时能及时获得帮助</p>
          </div>
          
          <!-- 功能卡片4 -->
          <div class="bg-neutral rounded-xl shadow-md p-6 card-hover p-4">
            <div class="w-14 h-14 rounded-full flex items-center justify-center mb-6 mt-2 ml-4" style="background-color: rgba(79, 70, 229, 0.1);">
              <i class="fa fa-file-text text-2xl text-primary"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-dark">AI 服务方案</h3>
            <p class="text-neutral">基于儿童情况智能生成个性化服务方案，为社工提供专业参考</p>
          </div>
          
          <!-- 功能卡片5 -->
          <div class="bg-neutral rounded-xl shadow-md p-6 card-hover p-4">
            <div class="w-14 h-14 rounded-full flex items-center justify-center mb-6 mt-2 ml-4" style="background-color: rgba(16, 185, 129, 0.1);">
              <i class="fa fa-calendar-check-o text-2xl text-secondary"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-dark">服务跟踪</h3>
            <p class="text-neutral">全程记录服务过程，跟踪进度和效果，确保服务计划有效实施</p>
          </div>
          
          <!-- 功能卡片6 -->
          <div class="bg-neutral rounded-xl shadow-md p-6 card-hover p-4">
            <div class="w-14 h-14 rounded-full flex items-center justify-center mb-6 mt-2 ml-4" style="background-color: rgba(249, 115, 22, 0.1);">
              <i class="fa fa-shield text-2xl text-accent"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-dark">安全保障</h3>
            <p class="text-neutral">多重安全过滤机制，确保儿童交互环境安全，保护隐私信息</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台优势 -->
    <section id="advantages" class="py-20 bg-primary"> 
      <div class="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div class="text-center mb-16">
          <h2 class="responsive-subheading text-dark mb-4">平台优势</h2>
          <p class="text-neutral max-w-8xl">为什么选择 CareSync AI</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="order-2 md:order-1">
            <div class="space-y-6">

              <div class="flex items-start">
                <div class="flex-shrink-0 w-10 h-10 rounded-full flex justify-center mr-4 mt-6" style="background-color: rgba(79, 70, 229, 0.1);">
                  <i class="fa fa-child text-primary"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-2 text-dark">儿童友好设计</h3>
                  <p class="text-neutral">界面简洁直观，操作简单易用，专为儿童用户习惯设计，提供舒适的交互体验</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-10 h-10 rounded-full flex justify-center mr-4 mt-6" style="background-color: rgba(79, 70, 229, 0.1);">
                  <i class="fa fa-rocket text-primary"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-2 text-dark">AI 智能分析</h3>
                  <p class="text-neutral">先进的 AI 模型实时分析儿童情绪和需求，为社工提供数据支持和决策参考</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-10 h-10 rounded-full flex justify-center mr-4 mt-6" style="background-color: rgba(79, 70, 229, 0.1);">
                  <i class="fa fa-lock text-primary"></i>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-2 text-dark">安全合规保障</h3>
                  <p class="text-neutral">严格遵循儿童保护相关法律法规，确保平台运营的合法性和安全性</p>
                </div>
              </div>

            </div>
          </div>
          <div class="image-container">
              <div class="image-wrapper">
                  <div class="floating-background"></div>
                  <img src="https://picsum.photos/id/1005/800/600" alt="留守儿童与社工互动">
              </div>
          </div>
          <!-- <div class="order-1 md:order-2">
            <div class="relative">
              <div class="w-20 h-20 bg-primary/20 rounded-full absolute -top-4 -left-4 rotate-3"></div>
              <div class="w-16 h-16 bg-secondary/20 rounded-full absolute -bottom-4 -right-4 -rotate-3"></div>
              <div class="bg-white rounded-xl shadow-lg p-8 relative z-10">
                <h3 class="text-2xl font-bold mb-4 text-dark">技术优势</h3>
                <p class="text-neutral mb-4">基于前沿的 AI 技术和数据分析能力，为留守儿童提供专业、可靠的情感陪伴服务</p>
                <ul class="space-y-2">
                  <li class="flex items-center">
                    <i class="fa fa-check text-primary mr-2"></i>
                    <span class="text-neutral">自然语言处理技术</span>
                  </li>
                  <li class="flex items-center">
                    <i class="fa fa-check text-primary mr-2"></i>
                    <span class="text-neutral">情感分析算法</span>
                  </li>
                  <li class="flex items-center">
                    <i class="fa fa-check text-primary mr-2"></i>
                    <span class="text-neutral">个性化推荐系统</span>
                  </li>
                </ul>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </section>

    <!-- 登录入口 -->
    <section id="login" class="py-20 bg-white text-light bg-light text-center">
      <div class="container px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="responsive-subheading text-dark mb-4">登录入口</h2>
          <p class="text-neutral max-w-8xl text-center">选择您的身份进入平台</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div class="bg-primary rounded-xl shadow-md p-8 card-hover">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style="background-color: rgba(79, 70, 229, 0.1);">
              <i class="fa fa-child text-3xl text-primary"></i>
            </div>
            <h3 class="text-2xl font-semibold mb-4 text-dark">儿童端</h3>
            <p class="text-neutral mb-6">AI 智能陪伴，情感倾诉，紧急求助</p>
            <a href="http://localhost:5174/#/login" class="btn btn-primary py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-custom">
              进入儿童端
            </a>
          </div>

          <div class="bg-secondary rounded-xl shadow-md p-8 card-hover">
            <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style="background-color: rgba(16, 185, 129, 0.1);">
              <i class="fa fa-user-md text-3xl text-secondary"></i>
            </div>
            <h3 class="text-2xl font-semibold mb-4 text-dark">社工端登录</h3>
            <p class="text-neutral mb-6">儿童管理，服务方案，跟踪评估</p>
            <router-link to="/login" class="btn btn-secondary py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-custom">
              进入社工端
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section id="about" class="py-8 bg-primary">
      <div class="container px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="responsive-subheading text-dark mb-2">关于我们</h2>
        </div>
        <div class="max-w-4xl mx-auto text-center">
          <p class="text-neutral text-lg leading-relaxed mb-8">
            CareSync AI 是一个专注于留守儿童情感陪伴与服务的项目，旨在通过技术力量，
            为留守儿童提供有温度的情感支持，同时为社工提供数据驱动的精准服务工具。
            我们希望通过 "AI 智能陪伴 + 社工精准介入" 的模式，让每一位留守儿童都能感受到关爱与陪伴。
          </p>
          <div class="flex justify-center space-x-6">
            <a href="#" class="text-neutral hover:text-primary transition-custom">
              <i class="fa fa-envelope text-2xl"></i>
            </a>
            <a href="#" class="text-neutral hover:text-primary transition-custom">
              <i class="fa fa-phone text-2xl"></i>
            </a>
            <a href="#" class="text-neutral hover:text-primary transition-custom">
              <i class="fa fa-map-marker text-2xl"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-dark text-white py-3">
      <div class="container px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-neutral">&copy; 2024 CareSync AI. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showMobileMenu = ref(false);

// 页面滚动到指定区域
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  showMobileMenu.value = false; // 关闭移动端菜单
};

// 切换移动端菜单
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

// 处理探索按钮点击
const handleExplore = () => {
  scrollToSection('features');
};

// 处理了解更多按钮点击
const handleLearnMore = () => {
  scrollToSection('advantages');
};

// 生命周期钩子
onMounted(() => {
  // 页面加载时的初始化逻辑
});

onUnmounted(() => {
  // 清理逻辑
});
</script>

<style scoped>
/* CSS 变量定义 */
#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

/* 基础样式 */
.gradient-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.gradient-indigo-blue {
  background: linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 响应式设计 */
.responsive-heading {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
}

.responsive-subheading {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
}

.responsive-text {
  font-size: clamp(1rem, 2vw, 1.25rem);
}

/* 文本颜色 */
.text-primary {
  color: var(--primary);
}

.text-secondary {
  color: #10B981;
}

.text-accent {
  color: #F97316;
}

.text-neutral {
  color: #6B7280;
}

.text-dark {
  color: #1F2937;
}

.text-light {
  color: #F3F4F6;
}

/* 背景颜色 */
.bg-primary {
  background-color: var(--primary-bg);
}

.bg-secondary {
  background-color: var(--secondary-bg);
}

.bg-accent {
  background-color: var(--accent);
}

.bg-neutral {
  background-color: var(--neutral-bg);
}

.bg-light {
  background-color: var(--light-bg);
}

.bg-dark {
  background-color: var(--dark);
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: #4338CA;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: var(--secondary);
  color: white;
}

.btn-secondary:hover {
  background-color: #0D9488;
  transform: translateY(-2px);
}

.btn-outline {
  background-color: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-outline:hover {
  background-color: var(--primary);
  color: white;
  transform: translateY(-2px);
}

/* 卡片悬停效果 */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* 过渡效果 */
.transition-custom {
  transition: all 0.3s ease;
}

/* 文本阴影 */
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 响应式间距 */
.p-2{
  padding: 0.5rem;
}

.p-4{
  padding: 1rem;
}

.p-8{
  padding: 2rem;
}
/* 水平 */
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.py-20 {
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.pt-32 {
  padding-top: 8rem;
}

.pb-20 {
  padding-bottom: 5rem;
}

/* 边距 */
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mb-10 { margin-bottom: 2.5rem; }
.mb-16 { margin-bottom: 4rem; }

.mr-2 { margin-right: 0.5rem; }
.mr-4 { margin-right: 1rem; }
.mr-6 { margin-right: 1.5rem; }
.mr-8 { margin-right: 2rem; }

.ml-2 { margin-left: 0.5rem; }
.ml-4 { margin-left: 1rem; }
.ml-6 { margin-left: 1.5rem; }
.ml-8 { margin-left: 2rem; }

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }
.mt-16 { margin-top: 4rem; }
/* 水平 */
.mx-auto {
   margin-left: auto; margin-right: auto; 
}

/* Flexbox */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.flex-shrink-0 { flex-shrink: 0; }

/* Grid */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }

/* 间距 */
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }
.gap-12 { gap: 3rem; }

.space-x-6 > * + * { margin-left: 1.5rem; }
.space-x-8 > * + * { margin-left: 2rem; }
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }

/* 宽度和高度 */
.w-10 { width: 2.5rem; }
.w-14 { width: 3.5rem; }
.w-16 { width: 4rem; }
.w-20 { width: 5rem; }
.w-25 { width: 6.25rem; }
.w-32 { width: 8rem; }
.w-40 { width: 10rem; }

.h-10 { height: 2.5rem; }
.h-14 { height: 3.5rem; }
.h-16 { height: 4rem; }
.h-20 { height: 5rem; }

.min-h-screen { min-height: 100vh; }

/* 圆角 */
.rounded { border-radius: 0.25rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-full { border-radius: 9999px; }

/* 阴影 */
.shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }

/* 定位 */
.fixed { position: fixed; }
.absolute { position: absolute; }
.relative { position: relative; }
.static { position: static; }

.top-0 { top: 0; }
.left-0 { left: 0; }
.right-0 { right: 0; }
.bottom-0 { bottom: 0; }

.-top-4 { top: -1rem; }
.-left-4 { left: -1rem; }
.-bottom-4 { bottom: -1rem; }
.-right-4 { right: -1rem; }

/* Z-index */
.z-10 { z-index: 10; }
.z-50 { z-index: 50; }

/* 旋转 */
.rotate-3 { transform: rotate(3deg); }
.-rotate-3 { transform: rotate(-3deg); }

/* 透明度 */
.bg-primary\/10 { background-color: rgba(79, 70, 229, 0.1); }
.bg-secondary\/20 { background-color: rgba(16, 185, 129, 0.2); }

/* 响应式显示 */
.hidden { display: none; }

/* 移动端响应式 */
@media (min-width: 768px) {
  .md\:flex { display: flex; }
  .md\:hidden { display: none; }
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\:px-8 { padding-left: 2rem; padding-right: 2rem; }
}

@media (min-width: 640px) {
  .sm\:flex-row { flex-direction: row; }
  .sm\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
}

/* 最大宽度 */
.max-w-2xl { max-width: 42rem; }
.max-w-3xl { max-width: 48rem; }
.max-w-4xl { max-width: 56rem; }
.max-w-8xl { max-width: 80rem; }

/* 字体大小 */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }

/* 字体粗细 */
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

/* 行高 */
.leading-tight { line-height: 1.25; }
.leading-relaxed { line-height: 1.625; }

/* 列表样式 */
.list-none { list-style-type: none; }

/* 文本对齐 */
.text-center { text-align: center; }

/* 左对齐 */
.text-left { text-align: left; }

/* 右对齐 */
.text-right { text-align: right; }

/* 溢出 */
.overflow-hidden { overflow: hidden; }

/* 光标 */
.cursor-pointer { cursor: pointer; }

/* 轮廓 */
.focus\:outline-none:focus { outline: none; }

/* 背景模糊 */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

/* 渐变背景 */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.from-primary\/5 { --tw-gradient-from: rgba(79, 70, 229, 0.05); }
.to-secondary\/5 { --tw-gradient-to: rgba(16, 185, 129, 0.05); }
.to-accent\/5 { --tw-gradient-to: rgba(249, 115, 22, 0.05); }

/* 悬停效果 */
.hover\:text-primary:hover { color: var(--primary); }
.hover\:shadow-md:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.hover\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }

/* 宽度 */
.w-full { width: 100%; }

/* 高度 */
.h-full { height: 100%; }

/* 边距自动 */
.mx-auto { margin-left: auto; margin-right: auto; }

/* 
  1. 外层容器 (.image-container)
  作用：在中等屏幕尺寸下，控制图片区域的显示顺序。
  注意：这是一个布局相关的样式，通常会放在更宏观的布局 CSS 中。
*/
/* 在小屏幕上，这个 div 会是第一个显示 */

/* 在中等屏幕及以上，这个 div 会被移动到第二个位置 */
@media (min-width: 768px) { /* 'md' 断点通常是 768px */
  /* 假设它的父容器是一个 flex 容器 */
  /* .parent-container { display: flex; flex-wrap: wrap; } */
  .image-container {
    order: 2; 
  }
}

/* 
  2. 图片包装器 (.image-wrapper)
  作用：作为绝对定位元素的参考点 (position: relative)。
*/
.image-wrapper {
  position: relative; /* 关键：让内部的绝对定位元素以它为基准 */
  /* 为了让旋转的背景不被裁剪，给它一点内边距 */
  padding: 1rem; 
}

/* 
  3. 浮动背景 (.floating-background)
  作用：创建一个在图片下方、带有旋转和透明度的背景块，营造层次感。
*/
.floating-background {
  /* 绝对定位，覆盖整个 .image-wrapper */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 或者使用 inset-0 简写 */
  /* inset: 0; */

  background-color: rgba(79, 70, 229, 0.2); /* 半透明的紫色 */
  border-radius: 1rem; /* rounded-2xl 大约是 1rem */
  
  /* 旋转效果 */
  transform: rotate(3deg);
  
  /* 过渡效果，让旋转或其他变化更平滑 */
  transition: all 0.3s ease;
}

/* 
  4. 图片本身 (img)
  作用：展示主要内容，并带有悬停效果。
*/
.image-wrapper img {
  /* 相对定位，让它在 z 轴上位于 .floating-background 之上 */
  position: relative;
  z-index: 10; /* 确保图片在背景之上 */

  width: 100%; /* 图片宽度充满父容器 */
  height: auto; /* 高度自动，保持宽高比 */
  object-fit: cover; /* 确保图片覆盖整个区域，可能会裁剪 */
  
  border-radius: 0.75rem; /* rounded-xl 大约是 0.75rem */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  
  /* 过渡效果，让悬停时的缩放更平滑 */
  transition: all 0.3s ease;
}

/* 
  5. 图片悬停效果
*/
.image-wrapper img:hover {
  transform: scale(1.05); /* hover:scale-105 */
  /* 悬停时可以增加一点阴影，增强效果 */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 
  额外：可以给 .image-wrapper 也加一个 hover 效果，让背景和图片有联动
*/
.image-wrapper:hover .floating-background {
  transform: rotate(3deg) scale(1.02);
}

</style>