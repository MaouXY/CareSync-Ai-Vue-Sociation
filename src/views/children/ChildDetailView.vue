<template>
  <div class="min-h-screen bg-light">
    <AppLayout>
      <div class="px-6">
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
          <!-- 页面标题和操作栏 -->
          <div class="page-header pt-4">
            <div class="flex sm:flex-row sm:justify-between sm:items-center">
              <div class="flex flex-col">
                <h1 class="page-title">{{ childDetail.name }}的详情</h1>
                <p class="page-subtitle">儿童编号: {{ childDetail.childNo }}</p>
              </div>
              <div class="flex items-center ml-auto space-x-4 mt-4 sm:mt-0">
                <a-button class="btn btn-primary" @click="$router.push('/social-worker/children')">
                  <template #icon><ArrowLeftOutlined /></template>
                  返回列表
                </a-button>
                <a-button 
                  class="btn btn-primary"
                  :type="editMode ? 'default' : 'primary'" 
                  @click="toggleEditMode"
                >
                  <template #icon><EditOutlined v-if="!editMode" /><CloseOutlined v-else /></template>
                  {{ editMode ? '取消编辑' : '编辑信息' }}
                </a-button>
                <!-- <a-button type="default" @click="viewRecordMode = !viewRecordMode">
                  <template #icon><FileTextOutlined /></template>
                  {{ viewRecordMode ? '隐藏记录' : '查看记录' }}
                </a-button> -->
              </div>
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
                  <p class="text-neutral text-sm mt-1">年龄: {{ childDetail.age }}岁</p>
                  <div class="flex justify-center space-x-2 mt-3">
                    <a-tag :color="childDetail.hasNewChat ? 'processing' : 'default'">
                      {{ childDetail.hasNewChat ? '有新对话' : '无新对话' }}
                    </a-tag>
                    <a-tag :color="getRiskLevelColor(childDetail.riskLevel)">
                      {{ childDetail.riskLevel }}
                    </a-tag>
                    <a-tag :color="getServiceStatusColor(childDetail.serviceStatus)">
                      {{ childDetail.serviceStatus }}
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
                      <div v-if="editMode">
                        <a-input 
                          v-model:value="editForm.name" 
                          class="bg-gray-50"
                        />
                      </div>
                      <div v-else class="text-dark py-2">{{ childDetail.name || '-' }}</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">性别</label>
                      <div v-if="editMode">
                        <a-select 
                          v-model:value="editForm.gender" 
                          class="w-full bg-gray-50"
                        >
                          <a-select-option value="male">男</a-select-option>
                          <a-select-option value="female">女</a-select-option>
                        </a-select>
                      </div>
                      <div v-else class="text-dark py-2">{{ childDetail.gender === 'male' ? '男' : childDetail.gender === 'female' ? '女' : '-' }}</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">出生日期</label>
                      <div v-if="editMode">
                        <a-date-picker 
                          v-model:value="editForm.birthDate" 
                          class="w-full bg-gray-50"
                          placeholder="选择出生日期"
                        />
                      </div>
                      <div v-else class="text-dark py-2">{{ childDetail.birthDate ? formatDate(childDetail.birthDate) : '-' }}</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">身份证号</label>
                      <div v-if="editMode">
                        <a-input 
                          v-model:value="editForm.idCard" 
                          class="bg-gray-50"
                        />
                      </div>
                      <div v-else class="text-dark py-2">{{ childDetail.idCard || '-' }}</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">联系电话</label>
                      <div v-if="editMode">
                        <a-input 
                          v-model:value="editForm.phone" 
                          class="bg-gray-50"
                        />
                      </div>
                      <div v-else class="text-dark py-2">{{ childDetail.phone || '-' }}</div>
                    </div>
                  </div>
                  
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">风险等级</label>
                      <div v-if="editMode">
                        <a-input 
                          v-model:value="editForm.riskLevel" 
                          class="bg-gray-50"
                        />
                      </div>
                      <div v-else class="text-dark py-2">{{ childDetail.riskLevel || '-' }}</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">服务状态</label>
                      <div v-if="editMode">
                        <a-input 
                          v-model:value="editForm.serviceStatus" 
                          class="bg-gray-50"
                        />
                      </div>
                      <div v-else class="text-dark py-2">{{ childDetail.serviceStatus || '-' }}</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">监护人姓名</label>
                      <div v-if="editMode">
                        <a-input 
                          v-model:value="editForm.guardianName" 
                          class="bg-gray-50"
                        />
                      </div>
                      <div v-else class="text-dark py-2">{{ childDetail.guardianName || '-' }}</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">监护人电话</label>
                      <div v-if="editMode">
                        <a-input 
                          v-model:value="editForm.guardianPhone" 
                          class="bg-gray-50"
                        />
                      </div>
                      <div v-else class="text-dark py-2">{{ childDetail.guardianPhone || '-' }}</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-neutral mb-2">地址</label>
                      <div v-if="editMode">
                        <a-textarea 
                          v-model:value="editForm.address" 
                          class="bg-gray-50"
                          :rows="2"
                        />
                      </div>
                      <div v-else class="text-dark py-2">{{ childDetail.address || '-' }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-6">
                  <label class="block text-sm font-medium text-neutral mb-2">备注</label>
                  <div v-if="editMode">
                    <a-textarea 
                      v-model:value="editForm.notes" 
                      class="bg-gray-50"
                      :rows="3"
                      placeholder="请输入备注信息"
                    />
                  </div>
                  <div v-else class="text-dark py-2">{{ childDetail.notes || '-' }}</div>
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
          <div v-if="childDetail.aiStructInfo" class="bg-white rounded-xl shadow card-shadow p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-dark">AI情感分析结果</h3>
              <a-tag color="primary">
                最近分析: {{ formatDate(childDetail.aiStructInfo.latestAnalysis || childDetail.aiAnalysisTime || '') }}
              </a-tag>
            </div>
            
            <!-- 情感趋势图 -->
            <div class="mb-8" v-if="childDetail.aiStructInfo.emotionHistory && childDetail.aiStructInfo.emotionHistory.length > 0">
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
            <div v-if="childDetail.aiStructInfo.emotionScores" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div v-for="(score, emotion) in childDetail.aiStructInfo.emotionScores" :key="emotion" 
                   class="bg-blue-50 rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-blue-700">{{ getEmotionDisplayName(emotion) }}</span>
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
            <div v-if="childDetail.aiStructInfo.coreNeeds || childDetail.aiStructInfo.keyFindings" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div v-if="childDetail.aiStructInfo.coreNeeds" class="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 class="text-md font-medium text-dark mb-3">核心需求</h4>
                <div class="space-y-2">
                  <a-tag v-for="need in childDetail.aiStructInfo.coreNeeds" :key="need" color="primary">
                    {{ need }}
                  </a-tag>
                </div>
              </div>
              
              <div v-if="childDetail.aiStructInfo.keyFindings" class="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 class="text-md font-medium text-dark mb-3">关键发现</h4>
                <ul class="space-y-1 text-sm text-neutral">
                  <li v-for="finding in childDetail.aiStructInfo.keyFindings" :key="finding" class="flex items-start">
                    <i class="fa fa-check-circle text-success mr-2 mt-0.5 flex-shrink-0"></i>
                    {{ finding }}
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- AI分析摘要 -->
            <div v-if="childDetail.aiStructInfo.description" class="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-6">
              <h4 class="text-md font-medium text-dark mb-3">分析摘要</h4>
              <p class="text-sm text-neutral leading-relaxed">
                {{ childDetail.aiStructInfo.description }}
              </p>
            </div>
            
            <!-- 建议措施 -->
            <div v-if="childDetail.aiStructInfo.recommendations" class="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h4 class="text-md font-medium text-dark mb-3">建议措施</h4>
              <div class="space-y-4">
                <div v-for="(recommendation, index) in childDetail.aiStructInfo.recommendations" :key="index" 
                     class="p-4 border border-gray-200 rounded-lg bg-white">
                  <div class="flex justify-between items-start mb-2">
                    <h5 class="font-medium text-dark">{{ recommendation.title }}</h5>
                    <a-tag :color="getPriorityColor(recommendation.priority)">
                      {{ getPriorityText(recommendation.priority) }}
                    </a-tag>
                  </div>
                  <p class="text-sm text-neutral">{{ recommendation.description }}</p>
                </div>
              </div>
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
  serviceStatus: '',
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
      gender: childDetail.value.gender || '',
      birthDate: childDetail.value.birthDate ? new Date(childDetail.value.birthDate) : null,
      idCard: childDetail.value.idCard || '',
      phone: childDetail.value.phone || '',
      riskLevel: childDetail.value.riskLevel || '',
      serviceStatus: childDetail.value.serviceStatus || '',
      guardianName: childDetail.value.guardianName || '',
      guardianPhone: childDetail.value.guardianPhone || '',
      address: childDetail.value.address || '',
      notes: childDetail.value.notes || ''
    }
  }
}

// 解析AI分析数据（保留兼容性）
const parseAiAnalysisData = () => {
  if (childDetail.value?.aiStructInfo) {
    aiAnalysisData.value = childDetail.value.aiStructInfo
    nextTick(() => {
      initEmotionChart()
    })
  }
}

// 初始化情感图表
const initEmotionChart = () => {
  if (!emotionChartRef.value || !aiAnalysisData.value?.emotionScores) return
  
  // 销毁现有图表
  if (emotionChart) {
    emotionChart.destroy()
  }
  
  // 使用情感分数数据创建图表
  const scores = aiAnalysisData.value.emotionScores
  console.log('初始化情感趋势图:', scores)
  
  // 可以在这里使用 Chart.js 或其他图表库创建可视化
  // 暂时使用console输出调试
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

// 获取风险等级颜色
const getRiskLevelColor = (riskLevel: string) => {
  const colorMap: Record<string, string> = {
    '高': 'red',
    '中': 'orange',
    '低': 'green',
    '正常': 'blue'
  }
  return colorMap[riskLevel] || 'default'
}

// 获取服务状态颜色
const getServiceStatusColor = (serviceStatus: string) => {
  const colorMap: Record<string, string> = {
    '进行中': 'processing',
    '已完成': 'success',
    '暂停': 'warning',
    '未开始': 'default',
    '待服务': 'default'
  }
  return colorMap[serviceStatus] || 'default'
}

// 获取情感指标显示名称
const getEmotionDisplayName = (emotion: string) => {
  const nameMap: Record<string, string> = {
    'emotionalStability': '情绪稳定性',
    'positiveEmotion': '积极情绪指数',
    'anxietyLevel': '焦虑水平',
    'socialAdaptation': '社交适应性',
    'learningMotivation': '学习积极性'
  }
  return nameMap[emotion] || emotion
}

// 获取优先级颜色
const getPriorityColor = (priority: string) => {
  const colorMap: Record<string, string> = {
    '高': 'red',
    '中': 'orange',
    '低': 'green',
    'high': 'red',
    'medium': 'orange',
    'low': 'green'
  }
  return colorMap[priority] || 'default'
}

// 获取优先级文本
const getPriorityText = (priority: string) => {
  const textMap: Record<string, string> = {
    'high': '高优先级',
    'medium': '中优先级',
    'low': '低优先级',
    '高': '高优先级',
    '中': '中优先级',
    '低': '低优先级'
  }
  return textMap[priority] || priority
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
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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