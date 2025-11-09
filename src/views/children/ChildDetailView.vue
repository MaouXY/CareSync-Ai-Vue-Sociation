\u003ctemplate\u003e
  \u003cAppLayout title="儿童详情 - CareSync AI"\u003e
    \u003cdiv class="child-detail-container"\u003e
      \u003c!-- 页面头部和操作栏 --\u003cdiv class="page-header"\u003e
        \u003cdiv class="header-left"\u003e
          \u003cButton @click="handleGoBack" variant="text" class="back-button"\u003e
            \u003ci class="icon-back"\u003e←\u003c/i\u003e 返回列表
          \u003c/Button\u003e
        \u003c/div\u003e
        \u003cdiv class="header-right"\u003e
          \u003cButton @click="handleCreateAnalysis"\u003e
            \u003ci class="icon-analysis"\u003e📊\u003c/i\u003e AI分析
          \u003c/Button\u003e
          \u003cButton @click="handleCreateScheme"\u003e
            \u003ci class="icon-scheme"\u003e📋\u003c/i\u003e 服务方案
          \u003c/Button\u003e
          \u003cButton variant="primary" @click="handleEdit"\u003e
            \u003ci class="icon-edit"\u003e✏️\u003c/i\u003e 编辑
          \u003c/Button\u003e
        \u003c/div\u003e
      \u003c/div\u003e
      
      \u003cdiv v-if="isLoading" class="loading-container"\u003e
        \u003cdiv class="loading-spinner"\u003e\u003c/div\u003e
        \u003cp class="loading-text"\u003e加载中...\u003c/p\u003e
      \u003c/div\u003e
      \u003cdiv v-else-if="!child" class="error-container"\u003e
        \u003cdiv class="error-icon"\u003e❌\u003c/div\u003e
        \u003ch3 class="error-title"\u003e儿童信息不存在\u003c/h3\u003e
        \u003cp class="error-description"\u003e找不到指定的儿童信息，请检查是否输入了正确的ID。\u003c/p\u003e
        \u003cButton @click="handleGoBack"\u003e返回儿童列表\u003c/Button\u003e
      \u003c/div\u003e
      \u003cdiv v-else class="child-detail-content"\u003e
        \u003c!-- 基本信息卡片 --\u003cCard class="child-basic-info-card"\u003e
          \u003cdiv class="child-profile-header"\u003e
            \u003cdiv class="child-avatar-large"\u003e
              \u003cimg :src="child.avatar || defaultAvatar" :alt="child.name" /\u003e
            \u003c/div\u003e
            \u003cdiv class="child-profile-info"\u003e
              \u003cdiv class="child-name-title"\u003e
                \u003h1 class="child-name"\u003e{{ child.name }}\u003c/h1\u003e
                \u003cspan :class="['status-badge', 'status-' + child.status]"\u003e
                  {{ getStatusText(child.status) }}\u003c/span\u003e
              \u003c/div\u003e
              \u003cdiv class="child-basic-details"\u003e
                \u003cspan class="detail-item"\u003e
                  \u003ci class="icon-age"\u003e🎂\u003c/i\u003e {{ child.age }}岁
                \u003c/span\u003e
                \u003cspan class="detail-item"\u003e
                  \u003ci class="icon-gender"\u003e{{ child.gender === 'male' ? '👦' : '👧' }}\u003c/i\u003e {{ child.gender === 'male' ? '男' : '女' }}
                \u003c/span\u003e
                \u003cspan class="detail-item"\u003e
                  \u003ci class="icon-school"\u003e🏫\u003c/i\u003e {{ child.school }}
                \u003c/span\u003e
                \u003cspan class="detail-item"\u003e
                  \u003ci class="icon-grade"\u003e📚\u003c/i\u003e {{ child.grade }}
                \u003c/span\u003e
              \u003c/div\u003e
              \u003cdiv class="child-tags"\u003e
                \u003cspan v-for="(tag, index) in child.tags" :key="index" class="tag"\u003e
                  {{ tag }}\u003c/span\u003e
              \u003c/div\u003e
            \u003c/div\u003e
            \u003cdiv class="child-emotion-card"\u003e
              \u003cdiv class="emotion-header"\u003e
                \u003ch3 class="emotion-title"\u003e情绪状态\u003c/h3\u003e
                \u003cspan class="emotion-score"\u003e{{ child.emotionScore }}\u003c/span\u003e
              \u003c/div\u003e
              \u003cdiv class="emotion-bar"\u003e
                \u003cdiv 
                  class="emotion-bar-fill"
                  :style="{ width: child.emotionScore + '%', backgroundColor: getEmotionColor(child.emotionScore) }"
                \u003e\u003c/div\u003e
              \u003c/div\u003e
              \u003cdiv class="emotion-level"\u003e{{ getEmotionLevel(child.emotionScore) }}\u003c/div\u003e
              \u003cdiv class="last-interaction"\u003e
                最后互动: {{ formatDate(child.lastInteractionTime) }}
              \u003c/div\u003e
            \u003c/div\u003e
          \u003c/div\u003e
        \u003c/Card\u003e
        \u003e
        \u003c!-- 详细信息网格 --\u003cdiv class="info-grid"\u003e
          \u003c!-- 联系信息 --\u003cCard class="info-card"\u003e
            \u003cdiv class="card-header-title"\u003e
              \u003ci class="icon-contact"\u003e📞\u003c/i\u003e 联系信息
            \u003c/div\u003e
            \u003cdiv class="info-content"\u003e
              \u003cdiv class="info-item"\u003e
                \u003cspan class="info-label"\u003e联系电话：\u003c/span\u003e
                \u003cspan class="info-value"\u003e{{ child.contactPhone }}\u003c/span\u003e
              \u003c/div\u003e
              \u003cdiv class="info-item"\u003e
                \u003cspan class="info-label"\u003e家庭地址：\u003c/span\u003e
                \u003cspan class="info-value"\u003e{{ child.address }}\u003c/span\u003e
              \u003c/div\u003e
            \u003c/div\u003e
          \u003c/Card\u003e
          
          \u003c!-- 监护人信息 --\u003cCard class="info-card"\u003e
            \u003cdiv class="card-header-title"\u003e
              \u003ci class="icon-guardian"\u003e👪\u003c/i\u003e 监护人信息
            \u003c/div\u003e
            \u003cdiv class="info-content"\u003e
              \u003cdiv class="info-item"\u003e
                \u003cspan class="info-label"\u003e姓名：\u003c/span\u003e
                \u003cspan class="info-value"\u003e{{ child.guardian.name }}\u003c/span\u003e
              \u003c/div\u003e
              \u003cdiv class="info-item"\u003e
                \u003cspan class="info-label"\u003e关系：\u003c/span\u003e
                \u003cspan class="info-value"\u003e{{ child.guardian.relationship }}\u003c/span\u003e
              \u003c/div\u003e
              \u003cdiv class="info-item"\u003e
                \u003cspan class="info-label"\u003e联系电话：\u003c/span\u003e
                \u003cspan class="info-value"\u003e{{ child.guardian.phone }}\u003c/span\u003e
              \u003c/div\u003e
            \u003c/div\u003e
          \u003c/Card\u003e
        \u003c/div\u003e
        \u003e
        \u003c!-- 相关信息区域 --\u003cdiv class="related-info-section"\u003e
          \u003cdiv class="section-tabs"\u003e
            \u003cbutton 
              :class="['section-tab', { active: activeTab === 'analysis' }]"
              @click="activeTab = 'analysis'"
            \u003e
              AI分析记录
            \u003c/button\u003e
            \u003cbutton 
              :class="['section-tab', { active: activeTab === 'schemes' }]"
              @click="activeTab = 'schemes'"
            \u003e
              服务方案
            \u003c/button\u003e
          \u003c/div\u003e
          
          \u003c!-- AI分析记录 --\u003cdiv v-if="activeTab === 'analysis'" class="tab-content"\u003e
            \u003cCard class="analysis-list-card"\u003e
              \u003cdiv v-if="analysisRecords.length === 0" class="empty-section"\u003e
                \u003cdiv class="empty-icon"\u003e📊\u003c/div\u003e
                \u003ch4 class="empty-title"\u003e暂无分析记录\u003c/h4\u003e
                \u003cp class="empty-description"\u003e还没有为该儿童创建AI分析记录。\u003c/p\u003e
                \u003cButton @click="handleCreateAnalysis"\u003e创建AI分析\u003c/Button\u003e
              \u003c/div\u003e
              \u003cdiv v-else class="analysis-list"\u003e
                \u003cdiv 
                  v-for="record in analysisRecords" 
                  :key="record.id" 
                  class="analysis-item"
                  @click="handleViewAnalysis(record.id)"
                \u003e
                  \u003cdiv class="analysis-header"\u003e
                    \u003cdiv class="analysis-type"\u003e{{ getAnalysisTypeText(record.analysisType) }}\u003c/div\u003e
                    \u003cdiv class="analysis-date"\u003e{{ formatDate(record.analysisDate) }}\u003c/div\u003e
                  \u003c/div\u003e
                  \u003cdiv class="analysis-content"\u003e
                    \u003cdiv class="analysis-score"\u003e
                      \u003cspan class="score-label"\u003e情绪分数：\u003c/span\u003e
                      \u003cspan class="score-value"\u003e{{ record.emotionScore }}\u003c/span\u003e
                    \u003c/div\u003e
                    \u003cdiv class="analysis-risk"\u003e
                      \u003cspan class="risk-label"\u003e风险等级：\u003c/span\u003e
                      \u003cspan :class="['risk-badge', 'risk-' + record.riskLevel]"\u003e
                        {{ getRiskLevelText(record.riskLevel) }}\u003c/span\u003e
                    \u003c/div\u003e
                    \u003cdiv class="analysis-findings"\u003e
                      \u003cspan class="findings-label"\u003e关键发现：\u003c/span\u003e
                      \u003cspan class="findings-preview"\u003e{{ record.keyFindings[0] }}\u003c/span\u003e
                      \u003cspan v-if="record.keyFindings.length \u003e 1" class="more-findings"\u003e
                        等{{ record.keyFindings.length }}项
                      \u003c/span\u003e
                    \u003c/div\u003e
                  \u003c/div\u003e
                  \u003cdiv class="analysis-footer"\u003e
                    \u003cButton size="small" variant="text"\u003e查看详情 \u003ci class="icon-arrow"\u003e→\u003c/i\u003e\u003c/Button\u003e
                  \u003c/div\u003e
                \u003c/div\u003e
              \u003c/div\u003e
            \u003c/Card\u003e
          \u003c/div\u003e
          
          \u003c!-- 服务方案 --\u003cdiv v-if="activeTab === 'schemes'" class="tab-content"\u003e
            \u003cCard class="schemes-list-card"\u003e
              \u003cdiv v-if="serviceSchemes.length === 0" class="empty-section"\u003e
                \u003cdiv class="empty-icon"\u003e📋\u003c/div\u003e
                \u003ch4 class="empty-title"\u003e暂无服务方案\u003c/h4\u003e
                \u003cp class="empty-description"\u003e还没有为该儿童创建服务方案。\u003c/p\u003e
                \u003cButton @click="handleCreateScheme"\u003e创建服务方案\u003c/Button\u003e
              \u003c/div\u003e
              \u003cdiv v-else class="schemes-list"\u003e
                \u003cdiv 
                  v-for="scheme in serviceSchemes" 
                  :key="scheme.id" 
                  class="scheme-item"
                  @click="handleViewScheme(scheme.id)"
                \u003e
                  \u003cdiv class="scheme-header"\u003e
                    \u003cdiv class="scheme-title"\u003e{{ scheme.title }}\u003c/div\u003e
                    \u003cspan :class="['scheme-status', 'status-' + scheme.status]"\u003e
                      {{ getSchemeStatusText(scheme.status) }}\u003c/span\u003e
                  \u003c/div\u003e
                  \u003cdiv class="scheme-content"\u003e
                    \u003cdiv class="scheme-progress"\u003e
                      \u003cspan class="progress-label"\u003e完成进度：\u003c/span\u003e
                      \u003cdiv class="progress-bar"\u003e
                        \u003cdiv 
                          class="progress-fill"
                          :style="{ width: scheme.progress + '%' }"
                        \u003e\u003c/div\u003e
                      \u003c/div\u003e
                      \u003cspan class="progress-value"\u003e{{ scheme.progress }}%\u003c/span\u003e
                    \u003c/div\u003e
                    \u003cdiv class="scheme-info"\u003e
                      \u003cspan class="info-text"\u003e
                        \u003ci class="icon-category"\u003e📂\u003c/i\u003e {{ getCategoryText(scheme.category) }}
                      \u003c/span\u003e
                      \u003cspan class="info-text"\u003e
                        \u003ci class="icon-interventions"\u003e⚙️\u003c/i\u003e {{ scheme.interventions.length }}项干预措施
                      \u003c/span\u003e
                      \u003cspan v-if="scheme.startTime" class="info-text"\u003e
                        \u003ci class="icon-date"\u003e📅\u003c/i\u003e {{ formatDate(scheme.startTime) }}\u003c/span\u003e
                    \u003c/div\u003e
                  \u003c/div\u003e
                  \u003cdiv class="scheme-footer"\u003e
                    \u003cButton size="small" variant="text"\u003e查看详情 \u003ci class="icon-arrow"\u003e→\u003c/i\u003e\u003c/Button\u003e
                  \u003c/div\u003e
                \u003c/div\u003e
              \u003c/div\u003e
            \u003c/Card\u003e
          \u003c/div\u003e
        \u003c/div\u003e
      \u003c/div\u003e
    \u003c/div\u003e
  \u003c/AppLayout\u003e
\u003c/template\u003e

\u003cscript setup lang="ts"\u003e
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue';
import Card from '@/components/common/Card.vue';
import Button from '@/components/common/Button.vue';
import { childService, type Child } from '@/services/mock/childService';
import { analysisService, type AnalysisRecord } from '@/services/mock/analysisService';
import { schemeService, type ServiceScheme } from '@/services/mock/schemeService';

// 路由实例
const route = useRoute();
const router = useRouter();

// 加载状态
const isLoading = ref(true);

// 默认头像
const defaultAvatar = 'https://picsum.photos/200/200?random=default';

// 儿童信息
const child = ref\u003cChild | null\u003e(null);

// 分析记录
const analysisRecords = ref\u003cAnalysisRecord[]\u003e([]);

// 服务方案
const serviceSchemes = ref\u003cServiceScheme[]\u003e([]);

// 当前激活的标签页
const activeTab = ref('analysis');

// 获取儿童详情
const fetchChildDetail = async () =\u003e {
  try {
    isLoading.value = true;
    const id = route.params.id as string;
    const data = await childService.getChildById(id);
    child.value = data;
  } catch (error) {
    console.error('获取儿童详情失败:', error);
    alert('获取儿童详情失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 获取相关的分析记录
const fetchAnalysisRecords = async () =\u003e {
  try {
    const id = route.params.id as string;
    const response = await analysisService.getAnalysisRecords({
      childId: id,
      pageSize: 5
    });
    analysisRecords.value = response.list;
  } catch (error) {
    console.error('获取分析记录失败:', error);
  }
};

// 获取相关的服务方案
const fetchServiceSchemes = async () =\u003e {
  try {
    const id = route.params.id as string;
    const response = await schemeService.getServiceSchemes({
      childId: id,
      pageSize: 5
    });
    serviceSchemes.value = response.list;
  } catch (error) {
    console.error('获取服务方案失败:', error);
  }
};

// 获取情绪颜色
const getEmotionColor = (score: number): string =\u003e {
  if (score \u003e= 80) return '#22C55E';
  if (score \u003e= 60) return '#F59E0B';
  return '#EF4444';
};

// 获取情绪等级
const getEmotionLevel = (score: number): string =\u003e {
  if (score \u003e= 80) return '优秀';
  if (score \u003e= 60) return '良好';
  if (score \u003e= 40) return '一般';
  return '需要关注';
};

// 获取状态文本
const getStatusText = (status: string): string =\u003e {
  const statusMap = {
    normal: '正常',
    attention: '需关注',
    urgent: '紧急'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

// 获取分析类型文本
const getAnalysisTypeText = (type: string): string =\u003e {
  const typeMap = {
    emotion: '情绪分析',
    behavior: '行为分析',
    academic: '学业分析',
    comprehensive: '综合分析'
  };
  return typeMap[type as keyof typeof typeMap] || type;
};

// 获取风险等级文本
const getRiskLevelText = (level: string): string =\u003e {
  const levelMap = {
    low: '低风险',
    medium: '中风险',
    high: '高风险'
  };
  return levelMap[level as keyof typeof levelMap] || level;
};

// 获取方案状态文本
const getSchemeStatusText = (status: string): string =\u003e {
  const statusMap = {
    draft: '草稿',
    active: '进行中',
    completed: '已完成',
    paused: '已暂停'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

// 获取方案类别文本
const getCategoryText = (category: string): string =\u003e {
  const categoryMap = {
    emotional: '情感支持',
    academic: '学业提升',
    behavioral: '行为引导',
    social: '社交能力',
    comprehensive: '综合方案'
  };
  return categoryMap[category as keyof typeof categoryMap] || category;
};

// 格式化日期
const formatDate = (dateString: string): string =\u003e {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 返回上一页
const handleGoBack = () =\u003e {
  router.push('/children');
};

// 编辑儿童信息
const handleEdit = () =\u003e {
  router.push(`/children/edit/${route.params.id}`);
};

// 创建AI分析
const handleCreateAnalysis = () =\u003e {
  router.push(`/analysis/create?childId=${route.params.id}`);
};

// 查看AI分析详情
const handleViewAnalysis = (analysisId: string) =\u003e {
  router.push(`/analysis/${analysisId}`);
};

// 创建服务方案
const handleCreateScheme = () =\u003e {
  router.push(`/schemes/create?childId=${route.params.id}`);
};

// 查看服务方案详情
const handleViewScheme = (schemeId: string) =\u003e {
  router.push(`/schemes/${schemeId}`);
};

// 组件挂载时初始化数据
onMounted(() =\u003e {
  fetchChildDetail();
  fetchAnalysisRecords();
  fetchServiceSchemes();
});
\u003c/script\u003e

\u003cstyle scoped\u003e
.child-detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-right {
  display: flex;
  gap: 12px;
}

/* 加载和错误状态 */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #E5E7EB;
  border-top: 3px solid #4F46E5;
  border-radius: 50%;
  margin-bottom: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text,
.error-description {
  color: #6B7280;
  font-size: 16px;
  margin-bottom: 20px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 12px 0;
}

/* 基本信息卡片 */
.child-basic-info-card {
  margin-bottom: 24px;
}

.child-profile-header {
  display: flex;
  align-items: flex-start;
  gap: 32px;
}

.child-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #FFFFFF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.child-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.child-profile-info {
  flex: 1;
}

.child-name-title {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.child-name {
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-normal {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.status-attention {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.status-urgent {
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.child-basic-details {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6B7280;
  font-size: 16px;
}

.child-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background-color: #E5E7EB;
  color: #6B7280;
  border-radius: 16px;
  font-size: 13px;
}

.child-emotion-card {
  background-color: #F9FAFB;
  padding: 20px;
  border-radius: 12px;
  min-width: 280px;
}

.emotion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.emotion-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.emotion-score {
  font-size: 28px;
  font-weight: 700;
  color: #4F46E5;
}

.emotion-bar {
  width: 100%;
  height: 8px;
  background-color: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.emotion-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.emotion-level {
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.last-interaction {
  font-size: 12px;
  color: #6B7280;
}

/* 详细信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.info-card {
  height: 100%;
}

.card-header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-label {
  font-weight: 500;
  color: #6B7280;
  min-width: 80px;
}

.info-value {
  color: #1F2937;
  flex: 1;
}

/* 相关信息区域 */
.related-info-section {
  margin-top: 32px;
}

.section-tabs {
  display: flex;
  gap: 2px;
  background-color: #F3F4F6;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
}

.section-tab {
  flex: 1;
  padding: 12px 24px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-tab.active {
  background-color: #FFFFFF;
  color: #4F46E5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-tab:hover:not(.active) {
  color: #4F46E5;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 空状态 */
.empty-section {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 8px 0;
}

.empty-description {
  color: #6B7280;
  font-size: 16px;
  margin: 0 0 20px 0;
}

/* 分析记录列表 */
.analysis-list,
.schemes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.analysis-item,
.scheme-item {
  padding: 20px;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.analysis-item:hover,
.scheme-item:hover {
  border-color: #4F46E5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
  transform: translateY(-1px);
}

.analysis-header,
.scheme-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.analysis-type,
.scheme-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.analysis-date {
  font-size: 14px;
  color: #6B7280;
}

.analysis-content,
.scheme-content {
  margin-bottom: 16px;
}

.analysis-score,
.analysis-risk,
.analysis-findings {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.score-label,
.risk-label,
.findings-label {
  font-weight: 500;
  color: #6B7280;
  min-width: 80px;
}

.score-value {
  font-weight: 600;
  color: #4F46E5;
}

.risk-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.risk-low {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.risk-medium {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.risk-high {
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.findings-preview {
  color: #1F2937;
  flex: 1;
}

.more-findings {
  color: #6B7280;
}

.scheme-status {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.status-draft {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6B7280;
}

.status-active {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4F46E5;
}

.status-completed {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.status-paused {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.scheme-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.progress-label {
  font-weight: 500;
  color: #6B7280;
  min-width: 80px;
  font-size: 14px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4F46E5;
  transition: width 0.3s ease;
}

.progress-value {
  font-weight: 600;
  color: #1F2937;
  min-width: 40px;
  text-align: right;
  font-size: 14px;
}

.scheme-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.info-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6B7280;
  font-size: 13px;
}

.analysis-footer,
.scheme-footer {
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .child-profile-header {
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }
  
  .child-emotion-card {
    min-width: auto;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .child-detail-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .child-name-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .child-basic-details {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .section-tabs {
    flex-direction: column;
  }
  
  .scheme-info {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .child-name {
    font-size: 24px;
  }
  
  .header-right {
    flex-wrap: wrap;
  }
  
  .analysis-header,
  .scheme-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .analysis-score,
  .analysis-risk,
  .analysis-findings,
  .scheme-progress {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
\u003c/style\u003e