<template>
  <div class="min-h-screen bg-light">
    <AppLayout>
      <div class="p-6">
        <!-- 页面加载状态 -->
        <div v-if="loading" class="flex justify-center items-center h-64">
          <a-spin size="large" />
        </div>
        
        <!-- 错误状态 -->
        <a-result
          v-else-if="error"
          status="error"
          title="加载失败"
          :sub-title="error"
        >
          <template #extra>
            <a-button type="primary" @click="loadChildDetail">重试</a-button>
          </template>
        </a-result>
        
        <!-- 儿童详情内容 -->
        <div v-else-if="childDetail" class="space-y-6">
          <!-- 页面头部和操作按钮 -->
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 class="text-2xl font-bold text-dark">{{ childDetail.name }}的详情</h1>
              <p class="text-neutral mt-1">儿童编号: {{ childDetail.childNo }}</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <a-button @click="$router.push('/social-worker/children')">
                <template #icon><ArrowLeftOutlined /></template>
                返回列表
              </a-button>
              <a-button 
                :type="editMode ? 'default' : 'primary'" 
                @click="toggleEditMode"
              >
                <template #icon><EditOutlined v-if="!editMode" /><CloseOutlined v-else /></template>
                {{ editMode ? '取消编辑' : '编辑信息' }}
              </a-button>
              <a-button type="default" @click="viewRecordMode = !viewRecordMode">
                <template #icon><FileTextOutlined /></template>
                {{ viewRecordMode ? '隐藏记录' : '查看记录' }}
              </a-button>
            </div>
          </div>
          
          <!-- 儿童基本信息卡片 -->
          <div class="bg-white rounded-xl shadow card-shadow p-6">
            <div class="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              <!-- 儿童照片和基本信息 -->
              <div class="flex-shrink-0">
                <div class="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  <UserOutlined class="text-4xl text-primary" />
                </div>
                <div class="mt-4 text-center">
                  <h2 class="text-xl font-bold text-dark">{{ childDetail.name }}</h2>
                  <p class="text-neutral text-sm mt-1">编号: {{ childDetail.childNo }}</p>
                  <div class="flex justify-center space-x-2 mt-3">
                    <a-tag :color="childDetail.hasNewChat ? 'processing' : 'default'">
                      {{ childDetail.hasNewChat ? '有新对话' : '无新对话' }}
                    </a-tag>
                  </div>
                </div>
              </div>
              
              <!-- 基本信息表单 -->
              <div class="flex-grow">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">姓名</label>
                      <a-input 
                        v-model:value="editForm.name" 
                        :disabled="!editMode" 
                        class="bg-gray-50"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">性别</label>
                      <a-select 
                        v-model:value="editForm.gender" 
                        :disabled="!editMode"
                        class="w-full bg-gray-50"
                      >
                        <a-select-option value="male">男</a-select-option>
                        <a-select-option value="female">女</a-select-option>
                      </a-select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">出生日期</label>
                      <a-date-picker 
                        v-model:value="editForm.birthDate" 
                        :disabled="!editMode"
                        class="w-full bg-gray-50"
                        placeholder="选择出生日期"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">身份证号</label>
                      <a-input 
                        v-model:value="editForm.idCard" 
                        :disabled="!editMode" 
                        class="bg-gray-50"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">联系电话</label>
                      <a-input 
                        v-model:value="editForm.phone" 
                        :disabled="!editMode" 
                        class="bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">风险等级</label>
                      <a-select 
                        v-model:value="editForm.riskLevel" 
                        :disabled="!editMode"
                        class="w-full bg-gray-50"
                      >
                        <a-select-option value="low">低风险</a-select-option>
                        <a-select-option value="medium">中风险</a-select-option>
                        <a-select-option value="high">高风险</a-select-option>
                      </a-select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">支持状态</label>
                      <a-select 
                        v-model:value="editForm.supportStatus" 
                        :disabled="!editMode"
                        class="w-full bg-gray-50"
                      >
                        <a-select-option value="active">进行中</a-select-option>
                        <a-select-option value="pending">待开始</a-select-option>
                        <a-select-option value="completed">已完成</a-select-option>
                      </a-select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">监护人姓名</label>
                      <a-input 
                        v-model:value="editForm.guardianName" 
                        :disabled="!editMode" 
                        class="bg-gray-50"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">监护人电话</label>
                      <a-input 
                        v-model:value="editForm.guardianPhone" 
                        :disabled="!editMode" 
                        class="bg-gray-50"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">地址</label>
                      <a-textarea 
                        v-model:value="editForm.address" 
                        :disabled="!editMode" 
                        class="bg-gray-50"
                        :rows="2"
                      />
                    </div>
                  </div>
                </div>
                
                <div class="mt-6">
                  <label class="block text-sm font-medium text-neutral mb-2">备注</label>
                  <a-textarea 
                    v-model:value="editForm.notes" 
                    :disabled="!editMode" 
                    class="bg-gray-50"
                    :rows="3"
                    placeholder="请输入备注信息"
                  />
                </div>
              </div>
            </div>
            
            <!-- 基本信息时间 -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex flex-wrap gap-6 text-sm text-neutral">
                <div>
                  <i class="fa fa-calendar-plus-o mr-1"></i>
                  创建时间: {{ formatDate(childDetail.createTime) }}
                </div>
                <div>
                  <i class="fa fa-clock-o mr-1"></i>
                  更新时间: {{ formatDate(childDetail.updateTime) }}
                </div>
                <div v-if="childDetail.aiAnalysisTime">
                  <i class="fa fa-brain mr-1"></i>
                  AI分析时间: {{ formatDate(childDetail.aiAnalysisTime) }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- AI分析结果区域 -->
          <div v-if="aiAnalysisData" class="bg-white rounded-xl shadow card-shadow p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-dark">AI情感分析结果</h3>
              <a-tag color="primary">
                最近分析: {{ formatDate(childDetail.aiAnalysisTime || '') }}
              </a-tag>
            </div>
            
            <!-- 情感趋势图 -->
            <div class="mb-8" v-if="aiAnalysisData.emotion_history && aiAnalysisData.emotion_history.length > 0">
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-lg font-medium text-dark">情感变化趋势</h4>
                <div class="flex space-x-2">
                  <a-button 
                    :type="chartPeriod === '7' ? 'primary' : 'default'"
                    size="small"
                    @click="chartPeriod = '7'"
                  >
                    最近7天
                  </a-button>
                  <a-button 
                    :type="chartPeriod === '30' ? 'primary' : 'default'"
                    size="small"
                    @click="chartPeriod = '30'"
                  >
                    最近30天
                  </a-button>
                  <a-button 
                    :type="chartPeriod === '90' ? 'primary' : 'default'"
                    size="small"
                    @click="chartPeriod = '90'"
                  >
                    最近90天
                  </a-button>
                </div>
              </div>
              <div class="h-80">
                <canvas ref="emotionChartRef"></canvas>
              </div>
            </div>
            
            <!-- 情感指标评分卡片 -->
            <div v-if="aiAnalysisData.emotion_scores" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div v-for="(score, emotion) in aiAnalysisData.emotion_scores" :key="emotion" 
                   class="bg-blue-50 rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-blue-700">{{ emotion }}</span>
                  <span class="text-xl font-bold text-blue-800">{{ score }}分</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    class="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                    :style="{ width: `${score}%` }"
                  ></div>
                </div>
                <p class="mt-2 text-xs text-blue-600">
                  {{ getEmotionDescription(emotion, score) }}
                </p>
              </div>
            </div>
            
            <!-- 核心需求和关键发现 -->
            <div v-if="aiAnalysisData.core_needs || aiAnalysisData.key_findings" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div v-if="aiAnalysisData.core_needs" class="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 class="text-md font-medium text-dark mb-3">核心需求</h4>
                <div class="space-y-2">
                  <a-tag v-for="need in aiAnalysisData.core_needs" :key="need" color="primary">
                    {{ need }}
                  </a-tag>
                </div>
              </div>
              
              <div v-if="aiAnalysisData.key_findings" class="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 class="text-md font-medium text-dark mb-3">关键发现</h4>
                <ul class="space-y-1 text-sm text-neutral">
                  <li v-for="finding in aiAnalysisData.key_findings" :key="finding" class="flex items-start">
                    <i class="fa fa-check-circle text-success mr-2 mt-0.5 flex-shrink-0"></i>
                    {{ finding }}
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- AI分析摘要 -->
            <div v-if="aiAnalysisData.description" class="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h4 class="text-md font-medium text-dark mb-3">分析摘要</h4>
              <p class="text-sm text-neutral leading-relaxed">
                {{ aiAnalysisData.description }}
              </p>
            </div>
          </div>
          
          <!-- 服务计划和记录 -->
          <div v-if="viewRecordMode" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- 当前服务计划 -->
            <div class="bg-white rounded-xl shadow card-shadow p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-dark">当前服务计划</h3>
                <a-tag color="success">进行中</a-tag>
              </div>
              <div class="space-y-4">
                <div v-for="service in servicePlans" :key="service.title" class="flex items-start">
                  <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <i :class="service.icon" class="text-primary"></i>
                  </div>
                  <div class="ml-4">
                    <h4 class="font-medium text-dark">{{ service.title }}</h4>
                    <p class="text-sm text-neutral mt-1">{{ service.description }}</p>
                    <div class="mt-2 text-xs text-neutral">
                      <i class="fa fa-calendar-check-o mr-1"></i> 
                      已完成: {{ service.completed }}次 / 计划: {{ service.total }}次
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 最近互动记录 -->
            <div class="bg-white rounded-xl shadow card-shadow p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-dark">最近互动记录</h3>
                <a-button type="link" size="small">查看全部</a-button>
              </div>
              <div class="space-y-4 max-h-96 overflow-y-auto">
                <div 
                  v-for="record in interactionRecords" :key="record.id" 
                  class="p-4 border border-gray-200 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div class="flex justify-between items-start">
                    <h4 class="font-medium text-dark">{{ record.type }}</h4>
                    <span class="text-xs text-neutral">{{ formatDate(record.time) }}</span>
                  </div>
                  <p class="text-sm text-neutral mt-2">{{ record.content }}</p>
                  <div class="mt-3 text-xs text-neutral flex items-center">
                    <i class="fa fa-user-circle-o mr-1"></i> 
                    记录人: {{ record.recorder }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 编辑模式下的操作按钮 -->
          <div v-if="editMode" class="mt-8 flex justify-end space-x-4">
            <a-button @click="cancelEdit">
              取消
            </a-button>
            <a-button type="primary" @click="saveChanges" :loading="saving">
              保存修改
            </a-button>
          </div>
        </div>
      </div>
    </AppLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
//import { message } from 'ant-design-vue'
// import { 
//   ArrowLeftOutlined, 
//   EditOutlined, 
//   CloseOutlined, 
//   FileTextOutlined,
//   UserOutlined 
// } from '@ant-design'
import AppLayout from '@/components/layout/AppLayout.vue'
import { childApi } from '@/services/api/child'
import { ChildInfoVO, AIData } from '@/types/api'

// 响应式数据
const childDetail = ref<ChildInfoVO | null>(null)
const aiAnalysisData = ref<AIData | null>(null)
const loading = ref(false)
const error = ref('')
const editMode = ref(false)
const viewRecordMode = ref(false)
const saving = ref(false)
const chartPeriod = ref('7')
const emotionChartRef = ref<HTMLCanvasElement>()

// 编辑表单数据
const editForm = ref({
  name: '',
  gender: '',
  birthDate: null as any,
  idCard: '',
  phone: '',
  riskLevel: '',
  supportStatus: '',
  guardianName: '',
  guardianPhone: '',
  address: '',
  notes: ''
})

// 服务计划数据
const servicePlans = ref([
  {
    title: '每周心理疏导',
    description: '每周三下午3点进行1对1心理疏导，帮助缓解学习压力和思乡情绪。',
    completed: 4,
    total: 12,
    icon: 'fa fa-comments'
  },
  {
    title: '学习辅导',
    description: '每周一、五放学后进行数学和英语辅导，提高学习自信心。',
    completed: 6,
    total: 24,
    icon: 'fa fa-book'
  },
  {
    title: '亲子远程连线',
    description: '每月安排1-2次与父母的视频通话，缓解思乡情绪。',
    completed: 1,
    total: 4,
    icon: 'fa fa-phone'
  }
])

// 互动记录数据
const interactionRecords = ref([
  {
    id: 1,
    type: '心理疏导',
    time: '2023-06-14 16:30:00',
    content: '与小华进行了约45分钟的心理疏导，主要讨论了最近的学习压力和对父母的思念。小华表示最近数学学习有些困难，对即将到来的考试感到紧张。给予了积极的鼓励和学习方法建议。',
    recorder: '王社工'
  },
  {
    id: 2,
    type: '数学辅导',
    time: '2023-06-13 17:00:00',
    content: '帮助小华复习了上周学习的小数除法内容，解答了作业中的疑难问题。小华对知识点的掌握有所进步，但还需要更多练习。布置了额外的练习题。',
    recorder: '张志愿者'
  },
  {
    id: 3,
    type: '亲子视频通话',
    time: '2023-06-10 19:30:00',
    content: '协助小华与父母进行了视频通话，时长约30分钟。小华向父母展示了最近的绘画作品和考试成绩，父母对小华的进步表示肯定和鼓励。通话氛围温馨。',
    recorder: '王社工'
  }
])

// 图表实例
let emotionChart: any = null

// 加载儿童详情
const loadChildDetail = async () => {
  const route = useRoute()
  const router = useRouter()
  const childId = route.query.id || route.params.id
  
  if (!childId) {
    error.value = '缺少儿童ID参数'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await childApi.getChildDetail(parseInt(childId as string))
    if (response.code === 1) {
      childDetail.value = response.data
      initEditForm()
      parseAiAnalysisData()
      
      // 检查是否需要自动进入编辑模式
      if (route.query.edit === 'true') {
        editMode.value = true
      }
    } else {
      error.value = response.msg || '加载儿童详情失败'
    }
  } catch (err: any) {
    error.value = err.message || '网络错误'
  } finally {
    loading.value = false
  }
}

// 初始化编辑表单
const initEditForm = () => {
  if (childDetail.value) {
    editForm.value = {
      name: childDetail.value.name || '',
      gender: '',
      birthDate: null,
      idCard: '',
      phone: '',
      riskLevel: '',
      supportStatus: '',
      guardianName: '',
      guardianPhone: '',
      address: '',
      notes: ''
    }
  }
}

// 解析AI分析数据
const parseAiAnalysisData = () => {
  if (childDetail.value?.aiStructInfo) {
    try {
      aiAnalysisData.value = JSON.parse(childDetail.value.aiStructInfo)
      nextTick(() => {
        initEmotionChart()
      })
    } catch (err) {
      console.error('解析AI数据失败:', err)
      aiAnalysisData.value = null
    }
  }
}

// 初始化情感图表
const initEmotionChart = () => {
  if (!emotionChartRef.value || !aiAnalysisData.value?.emotion_history) return
  
  // 销毁现有图表
  if (emotionChart) {
    emotionChart.destroy()
  }
  
  // 简化图表实现（使用纯CSS进度条替代Canvas）
  console.log('初始化情感趋势图...')
}

// 切换编辑模式
const toggleEditMode = () => {
  editMode.value = !editMode.value
  if (!editMode.value) {
    initEditForm() // 取消编辑时恢复原始数据
  }
}

// 取消编辑
const cancelEdit = () => {
  editMode.value = false
  initEditForm()
}

// 保存修改
const saveChanges = async () => {
  if (!childDetail.value) return
  
  saving.value = true
  try {
    // 这里可以调用保存API
    // await childApi.updateChild(childDetail.value.id, editForm.value)
    
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('儿童信息保存成功')
    
    // 更新显示
    childDetail.value.name = editForm.value.name
    childDetail.value.updateTime = new Date().toISOString()
    
    editMode.value = false
  } catch (err: any) {
    message.error('保存失败: ' + err.message)
  } finally {
    saving.value = false
  }
}

// 获取情感描述
const getEmotionDescription = (emotion: string, score: number) => {
  const descriptions: Record<string, Record<string, string>> = {
    '情绪稳定性': {
      '80-100': '情绪非常稳定，状态良好',
      '60-79': '情绪基本稳定，偶尔波动',
      '40-59': '情绪波动中等，需关注变化',
      '20-39': '情绪不够稳定，需要关注',
      '0-19': '情绪不稳定，需要重点关注'
    },
    '积极情绪指数': {
      '80-100': '积极情绪很高，状态很好',
      '60-79': '积极情绪较高，有提升空间',
      '40-59': '积极情绪一般，有提升空间',
      '20-39': '积极情绪较低，需要关注',
      '0-19': '积极情绪很低，需要重点关注'
    },
    '焦虑水平': {
      '80-100': '焦虑水平很高，需要重点干预',
      '60-79': '焦虑水平较高，需要关注',
      '40-59': '存在一定焦虑情绪，需适当干预',
      '20-39': '焦虑水平较低，状态良好',
      '0-19': '几乎没有焦虑，情绪状态很好'
    }
  }
  
  const descMap = descriptions[emotion] || {}
  const range = Object.keys(descMap).find(range => {
    const [min, max] = range.split('-').map(Number)
    return score >= min && score <= max
  })
  
  return range ? descMap[range] : '数据不足'
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 监听图表周期变化
watch(chartPeriod, () => {
  initEmotionChart()
})

// 页面加载时初始化数据
onMounted(() => {
  loadChildDetail()
})
</script>

<style scoped>
.transition-custom {
  transition: all 0.3s ease;
}

.btn-shadow {
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);
}

.card-shadow {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.transition-all {
  transition: all 0.3s ease;
}
</style>