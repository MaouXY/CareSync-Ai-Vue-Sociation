<template>
  <AppLayout title="CareSync AI - 留守儿童情感陪伴平台">
    <div class="home-page">
      <!-- 英雄区域 -->
      <section id="hero" class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">
              <span class="text-primary">AI 智能陪伴</span> + 
              <span class="text-secondary">社工精准介入</span>
            </h1>
            <p class="hero-description">
              为留守儿童提供有温度、可信赖的即时情感回应和安全的倾诉出口，
              依托结构化数据支撑社工开展针对性服务
            </p>
            <div class="hero-actions">
              <Button variant="primary" size="large" @click="handleExplore">立即开始体验</Button>
              <Button variant="secondary" size="large" @click="handleLearnMore">了解更多</Button>
            </div>
          </div>
        </div>
      </section>

      <!-- 核心功能 -->
      <section id="features" class="features-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">核心功能</h2>
            <p class="section-description">全方位满足留守儿童情感陪伴与社工服务需求</p>
          </div>
          <div class="features-grid">
            <Card class="feature-card">
              <div class="feature-icon feature-icon-primary">
                <i class="icon-message">💬</i>
              </div>
              <h3 class="feature-title">AI 情感陪伴</h3>
              <p class="feature-description">安全合规的 AI 交互填补日常情感空白，提供即时回应和情感支持</p>
            </Card>
            <Card class="feature-card">
              <div class="feature-icon feature-icon-secondary">
                <i class="icon-user">👩‍⚕️</i>
              </div>
              <h3 class="feature-title">社工精准服务</h3>
              <p class="feature-description">基于数据驱动的儿童需求分析，帮助社工提供精准、个性化的服务方案</p>
            </Card>
            <Card class="feature-card">
              <div class="feature-icon feature-icon-accent">
                <i class="icon-alert">🚨</i>
              </div>
              <h3 class="feature-title">紧急呼叫</h3>
              <p class="feature-description">提供一键紧急求助功能，确保儿童在遇到危险时能够及时获得帮助</p>
            </Card>
            <Card class="feature-card">
              <div class="feature-icon feature-icon-primary">
                <i class="icon-file-text">📋</i>
              </div>
              <h3 class="feature-title">AI 服务方案</h3>
              <p class="feature-description">基于儿童特点自动生成个性化服务方案，辅助社工更高效地开展工作</p>
            </Card>
            <Card class="feature-card">
              <div class="feature-icon feature-icon-secondary">
                <i class="icon-line-chart">📈</i>
              </div>
              <h3 class="feature-title">服务跟踪</h3>
              <p class="feature-description">全程记录服务过程，实时跟踪儿童状态变化，评估服务效果</p>
            </Card>
            <Card class="feature-card">
              <div class="feature-icon feature-icon-accent">
                <i class="icon-shield">🛡️</i>
              </div>
              <h3 class="feature-title">安全保障</h3>
              <p class="feature-description">多重安全机制确保儿童使用安全，保护隐私信息，过滤不良内容</p>
            </Card>
          </div>
        </div>
      </section>

      <!-- 平台优势 -->
      <section id="advantages" class="advantages-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">平台优势</h2>
          </div>
          <div class="advantages-content">
            <div class="advantage-item">
              <div class="advantage-icon">⚡</div>
              <h3 class="advantage-title">智能高效</h3>
              <p class="advantage-description">AI 技术实现 24 小时不间断服务，大幅提升服务效率和覆盖面</p>
            </div>
            <div class="advantage-item">
              <div class="advantage-icon">🎯</div>
              <h3 class="advantage-title">精准干预</h3>
              <p class="advantage-description">基于数据分析实现个性化服务，针对不同需求提供定制化解决方案</p>
            </div>
            <div class="advantage-item">
              <div class="advantage-icon">🔒</div>
              <h3 class="advantage-title">安全可靠</h3>
              <p class="advantage-description">多重安全保障机制，严格的内容审核和隐私保护措施</p>
            </div>
            <div class="advantage-item">
              <div class="advantage-icon">📊</div>
              <h3 class="advantage-title">数据驱动</h3>
              <p class="advantage-description">全流程数据采集和分析，为服务优化提供科学依据</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 登录入口 -->
      <section id="login" class="login-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">登录入口</h2>
            <p class="section-description">选择您的身份进入平台</p>
          </div>
          <div class="login-options">
            <Card class="login-card child-login">
              <h3 class="login-title">儿童端</h3>
              <p class="login-description">AI 智能陪伴，情感倾诉，紧急求助</p>
              <Button variant="primary" size="large" class="login-button">进入儿童端</Button>
            </Card>
            <Card class="login-card worker-login">
              <h3 class="login-title">社工端登录</h3>
              <p class="login-description">儿童管理，服务方案，跟踪评估</p>
              <router-link to="/login">
                <Button variant="secondary" size="large" class="login-button">进入社工端</Button>
              </router-link>
            </Card>
          </div>
        </div>
      </section>

      <!-- 关于我们 -->
      <section id="about" class="about-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">关于我们</h2>
          </div>
          <div class="about-content">
            <p class="about-text">
              CareSync AI 是一个专注于留守儿童情感陪伴与服务的项目，旨在通过技术力量，
              为留守儿童提供有温度的情感支持，同时为社工提供数据驱动的精准服务工具。
              我们希望通过 "AI 智能陪伴 + 社工精准介入" 的模式，让每一位留守儿童都能感受到关爱与陪伴。
            </p>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue';
import Card from '@/components/common/Card.vue';
import Button from '@/components/common/Button.vue';

const router = useRouter();
const showBackToTop = ref(false);

// 页面滚动到指定区域
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
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
.home-page {
  font-family: 'Inter', 'system-ui', 'sans-serif';
  line-height: 1.6;
  color: #1F2937;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 英雄区域 */
.hero-section {
  background: linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%);
  color: white;
  padding: 120px 0 80px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=');
  opacity: 0.1;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
}

.text-primary {
  color: #ffffff;
}

.text-secondary {
  color: #E0F2FE;
}

.hero-description {
  font-size: 20px;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.95;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 通用章节样式 */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 16px;
}

.section-description {
  font-size: 18px;
  color: #6B7280;
}

/* 核心功能区域 */
.features-section {
  padding: 100px 0;
  background-color: #F9FAFB;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 32px;
}

.feature-icon-primary {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4F46E5;
}

.feature-icon-secondary {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.feature-icon-accent {
  background-color: rgba(249, 115, 22, 0.1);
  color: #F97316;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 12px;
}

.feature-description {
  color: #6B7280;
  line-height: 1.6;
}

/* 平台优势区域 */
.advantages-section {
  padding: 100px 0;
  background-color: #FFFFFF;
}

.advantages-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.advantage-item {
  text-align: center;
  padding: 32px;
  background-color: #F9FAFB;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  transition: all 0.3s ease;
}

.advantage-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border-color: #4F46E5;
}

.advantage-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.advantage-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 12px;
}

.advantage-description {
  color: #6B7280;
  line-height: 1.6;
}

/* 登录入口区域 */
.login-section {
  padding: 100px 0;
  background-color: #F9FAFB;
}

.login-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  max-width: 800px;
  margin: 0 auto;
}

.login-card {
  padding: 40px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.child-login {
  background-color: #ECFDF5;
  border-color: #10B981;
}

.worker-login {
  background-color: #EFF6FF;
  border-color: #3B82F6;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 16px;
}

.login-description {
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.login-button {
  width: 100%;
}

/* 关于我们区域 */
.about-section {
  padding: 100px 0;
  background-color: #FFFFFF;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about-text {
  font-size: 18px;
  line-height: 1.8;
  color: #4B5563;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hero-title {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 80px 0 60px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .features-section,
  .advantages-section,
  .login-section,
  .about-section {
    padding: 80px 0;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .login-options {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .section-description {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 0 40px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .features-section,
  .advantages-section,
  .login-section,
  .about-section {
    padding: 60px 0;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .login-card {
    padding: 30px 20px;
  }
  
  .advantage-item {
    padding: 24px 20px;
  }
}
</style>