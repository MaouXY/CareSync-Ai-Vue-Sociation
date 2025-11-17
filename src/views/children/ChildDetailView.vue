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
                <a-button class="btn btn-primary" @click="$router.push('/children')">
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
                  <!-- <div class="flex justify-center space-x-2 mt-3">
                    <a-tag :color="childDetail.hasNewChat ? 'processing' : 'default'">
                      {{ childDetail.hasNewChat ? '有新对话' : '无新对话' }}
                    </a-tag>
                    <a-tag :color="getRiskLevelColor(childDetail.riskLevel)">
                      {{ childDetail.riskLevel }}
                    </a-tag>
                    <a-tag :color="getServiceStatusColor(childDetail.serviceStatus)">
                      {{ childDetail.serviceStatus }}
                    </a-tag>
                  </div> -->
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
                          placeholder="请选择性别"
                        >
                          <a-select-option value="male">男</a-select-option>
                          <a-select-option value="female">女</a-select-option>
                        </a-select>
                      </div>
                      <div v-else class="text-dark py-2">{{ 
                        childDetail.gender === 'male' || childDetail.gender === '男' ? '男' : 
                        childDetail.gender === 'female' || childDetail.gender === '女' ? '女' : 
                        childDetail.gender || '-' 
                      }}</div>
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
              </div>
              <div class="chart-container bg-white rounded-xl shadow-sm p-4">
                <div class="h-96">
                  <div ref="emotionChartRef" style="width: 100%; height: 250%;"></div>
                </div>
              </div>
            </div>
            
            <!-- 情感指标评分雷达图 -->
            <div v-if="childDetail.aiStructInfo.emotionScores" class="mb-6">
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-lg font-medium text-dark">情感指标评分</h4>
              </div>
              <div class="chart-container bg-white rounded-xl shadow-sm p-4">
                <div class="h-96">
                  <div ref="emotionRadarChartRef" style="width: 100%; height: 150%;"></div>
                </div>
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
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'
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
import * as echarts from 'echarts'

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
const emotionRadarChartRef = ref<HTMLCanvasElement>()

// 图表实例
let emotionChart: echarts.ECharts | null = null
let emotionRadarChart: echarts.ECharts | null = null

// 编辑表单数据
const editForm = ref({
  serviceStatus: '',
  riskLevel: '',
  name: '',
  age: 0,
  gender: '',
  birthDate: null as any,
  idCard: '',
  address: '',
  notes: '',
  phone: '',
  guardianName: '',
  guardianPhone: '',
})

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
    // 处理性别字段，确保兼容中英文
    let genderValue = childDetail.value.gender || '';
    if (genderValue === '男' || genderValue === 'male') {
      genderValue = 'male';
    } else if (genderValue === '女' || genderValue === 'female') {
      genderValue = 'female';
    }
    
    editForm.value = {
      serviceStatus: childDetail.value.serviceStatus || '',
      riskLevel: childDetail.value.riskLevel || '',
      name: childDetail.value.name || '',
      age: childDetail.value.age || 0,
      gender: genderValue,
      birthDate: childDetail.value.birthDate ? new Date(childDetail.value.birthDate) : null,
      idCard: childDetail.value.idCard || '',
      address: childDetail.value.address || '',
      notes: childDetail.value.notes || '',
      phone: childDetail.value.phone || '',
      guardianName: childDetail.value.guardianName || '',
      guardianPhone: childDetail.value.guardianPhone || '',
    }
  }
}

// 解析AI分析数据（保留兼容性）
const parseAiAnalysisData = () => {
  if (childDetail.value?.aiStructInfo) {
    aiAnalysisData.value = childDetail.value.aiStructInfo
    // 确保DOM已渲染且图表容器存在
    nextTick(() => {
      // 添加延迟确保图表容器完全渲染
      setTimeout(() => {
        if (emotionChartRef.value && childDetail.value?.aiStructInfo?.emotionHistory) {
          initEmotionChart()
        }
        if (emotionRadarChartRef.value && childDetail.value?.aiStructInfo?.emotionScores) {
          initEmotionRadarChart()
        }
      }, 100)
    })
  }
}

// 初始化情感图表
const initEmotionChart = () => {
  if (!emotionChartRef.value || !childDetail.value?.aiStructInfo?.emotionHistory) return
  
  // 销毁现有图表
  if (emotionChart) {
    emotionChart.dispose()
  }
  
  // 初始化ECharts实例
  emotionChart = echarts.init(emotionChartRef.value)
  
  // 获取情感历史数据
  const emotionHistory = childDetail.value.aiStructInfo.emotionHistory
  
  // 根据选择的周期过滤数据
  const periodDays = parseInt(chartPeriod.value)
  const now = new Date()
  const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000)
  
  // 创建过滤后的数据，并为每个数据项添加日期
  const filteredData = emotionHistory.filter((item, index) => {
    // 为没有日期的数据项生成日期
    if (!item.date) {
      // 从今天开始往前推算日期
      const date = new Date(now.getTime() - (emotionHistory.length - 1 - index) * 24 * 60 * 60 * 1000)
      item.date = date.toISOString().split('T')[0]
    }
    
    const itemDate = new Date(item.date)
    return itemDate >= startDate && itemDate <= now
  })
  
  // 如果没有数据，显示空状态
  if (filteredData.length === 0) {
    emotionChart.setOption({
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'middle',
        textStyle: {
          color: '#999',
          fontSize: 16
        }
      },
      backgroundColor: '#fafafa',
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '5%',
        containLabel: true
      }
    })
    return
  }
  
  // 准备图表数据
  const dates = filteredData.map(item => item.date)
  
  // 适配实际数据结构
  const emotionTypes = ['stability', 'anxiety', 'happiness', 'socialConfidence']
  const emotionNames = {
    'stability': '情绪稳定性',
    'anxiety': '焦虑水平',
    'happiness': '快乐指数',
    'socialConfidence': '社交自信'
  }
  
  // 统一的主题颜色，与项目设计规范匹配
  const themeColors = ['#4F46E5', '#10B981', '#F97316', '#EF4444']
  
  // 创建系列数据
  const series = emotionTypes.map((emotionType, index) => {
    const data = filteredData.map(item => {
      // 直接从数据项中获取值
      return item[emotionType] || 0
    })
    
    return {
      name: emotionNames[emotionType],
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      symbolOffset: [0, 0],
      lineStyle: {
        width: 3,
        color: themeColors[index],
        shadowColor: themeColors[index],
        shadowBlur: 8,
        shadowOffsetX: 0,
        shadowOffsetY: 3
      },
      emphasis: {
        focus: 'series',
        symbolSize: 10,
        itemStyle: {
          borderWidth: 3,
          borderColor: '#fff'
        }
      },
      areaStyle: {
        opacity: 0.2,
        color: {
          type: 'linear',
          x: 0, y: 0,
          x2: 0, y2: 1,
          colorStops: [
            {offset: 0, color: themeColors[index] + 'AA'},
            {offset: 1, color: themeColors[index] + '11'}
          ]
        }
      },
      data: data,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    }
  })
  
  // 图表配置项
  const option = {
    backgroundColor: '#ffffff',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      borderWidth: 0,
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      padding: [12, 16],
      borderRadius: 8,
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#4F46E5',
          color: '#fff',
          borderRadius: 4,
          padding: [4, 8]
        },
        lineStyle: {
          color: '#e0e0e0',
          type: 'dashed'
        }
      },
      formatter: function(params: any) {
        const date = new Date(params[0].axisValue)
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`
        let result = `<div style="margin-bottom: 8px; font-weight: 500;">${formattedDate}</div>`
        params.forEach((param: any) => {
          result += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${param.color}; margin-right: 8px;"></span>
            <span style="flex: 1;">${param.seriesName}</span>
            <span style="font-weight: 600;">${param.value}分</span>
          </div>`
        })
        return result
      }
    },
    legend: {
      data: emotionTypes.map(type => emotionNames[type]),
      top: 0,
      left: 'center',
      textStyle: {
        color: '#6B7280',
        fontSize: 14
      },
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 24,
      formatter: function(name: string) {
        return name
      }
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#6B7280',
        fontSize: 12,
        formatter: function(value: string) {
          const date = new Date(value)
          return `${date.getMonth() + 1}/${date.getDate()}`
        }
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitNumber: 5,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#6B7280',
        fontSize: 12,
        formatter: '{value}分'
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
          type: 'solid'
        }
      }
    },
    series: series,
    color: themeColors,
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        moveOnMouseWheel: true
      },
      {
        type: 'slider',
        start: 0,
        end: 100,
        height: 30,
        bottom: 0,
        backgroundColor: '#f9fafb',
        fillerColor: 'rgba(79, 70, 229, 0.1)',
        borderColor: '#e5e7eb',
        handleStyle: {
          color: '#4F46E5',
          shadowBlur: 4,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowOffsetX: 0,
          shadowOffsetY: 2,
          borderColor: '#ffffff'
        },
        textStyle: {
          color: '#6B7280',
          fontSize: 12
        }
      }
    ],
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut'
  }
  
  // 应用配置项
  emotionChart.setOption(option)
  
  // 响应式调整
  const handleResize = () => {
    emotionChart?.resize()
  }
  window.addEventListener('resize', handleResize)
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}

// 初始化情感雷达图
const initEmotionRadarChart = () => {
  if (!emotionRadarChartRef.value || !childDetail.value?.aiStructInfo?.emotionScores) return
  
  // 销毁现有图表
  if (emotionRadarChart) {
    emotionRadarChart.dispose()
  }
  
  // 初始化ECharts实例
  emotionRadarChart = echarts.init(emotionRadarChartRef.value)
  
  // 获取情感评分数据
  const emotionScores = childDetail.value.aiStructInfo.emotionScores
  
  // 情感指标中文映射
  const emotionNamesMap: Record<string, string> = {
    'stability': '情绪稳定性',
    'anxiety': '焦虑水平',
    'happiness': '快乐指数',
    'socialConfidence': '社交自信'
  }
  
  // 准备雷达图数据
  const indicators = []
  const data = []
  
  // 遍历情感评分数据
  for (const [emotion, score] of Object.entries(emotionScores)) {
    indicators.push({
      name: emotionNamesMap[emotion] || emotion,
      max: 100
    })
    data.push(score)
  }
  
  // 统一的主题颜色，与趋势图保持一致
  const primaryColor = '#4F46E5'
  
  // 图表配置项
  const option = {
    backgroundColor: '#ffffff',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      borderWidth: 0,
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      padding: [10, 14],
      borderRadius: 8,
      formatter: function(params: any) {
        const score = params.value
        let level = ''
        let color = ''
        
        if (score >= 80) {
          level = '优秀'
          color = '#10B981'
        } else if (score >= 60) {
          level = '良好'
          color = '#4F46E5'
        } else if (score >= 40) {
          level = '一般'
          color = '#F97316'
        } else {
          level = '需关注'
          color = '#EF4444'
        }
        
        return `<div style="text-align: center;">
          <div style="margin-bottom: 6px; font-weight: 500;">${params.name}</div>
          <div style="display: flex; align-items: center; justify-content: center;">
            <span style="margin-right: 8px;">评分:</span>
            <span style="font-weight: 600; font-size: 16px; color: ${color};">${score}</span>
          </div>
          <div style="margin-top: 4px; font-size: 12px; opacity: 0.9;">评级: ${level}</div>
        </div>`
      }
    },
    radar: {
      indicator: indicators,
      shape: 'circle', // 使用圆形雷达图更现代
      radius: '60%',
      splitNumber: 5,
      center: ['50%', '52%'],
      axisName: {
        color: '#6B7280',
        fontSize: 12,
        padding: [0, 5],
        rich: {
          a: {
            fontSize: 11,
            lineHeight: 14,
            width: 60,
            overflow: 'break',
            align: 'center'
          }
        },
        formatter: function(value: string) {
          // 根据文字长度调整显示
          if (value.length > 4) {
            return `{a|${value}}`
          } else {
            return value
          }
        }
      },
      splitLine: {
        lineStyle: {
          color: '#e5e7eb',
          type: 'solid'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db'],
          opacity: 0.8
        }
      },
      axisLine: {
        lineStyle: {
          color: '#d1d5db'
        }
      }
    },
    series: [{
      name: '情感指标',
      type: 'radar',
      data: [{
        value: data,
        name: '当前评分',
        areaStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              {offset: 0, color: primaryColor + '40'},
              {offset: 1, color: primaryColor + '10'}
            ]
          }
        },
        lineStyle: {
          color: primaryColor,
          width: 3,
          shadowColor: primaryColor,
          shadowBlur: 8,
          shadowOffsetX: 0,
          shadowOffsetY: 2
        },
        itemStyle: {
          color: primaryColor,
          borderColor: '#fff',
          borderWidth: 3,
          shadowColor: primaryColor,
          shadowBlur: 5,
          shadowOffsetX: 0,
          shadowOffsetY: 0
        },
        emphasis: {
          itemStyle: {
            borderWidth: 4,
            shadowBlur: 10,
            shadowColor: primaryColor
          },
          areaStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {offset: 0, color: primaryColor + '60'},
                {offset: 1, color: primaryColor + '20'}
              ]
            }
          }
        }
      }],
      animationDuration: 1500,
      animationEasing: 'cubicOut'
    }],
    animation: true,
    animationDuration: 2000,
    animationEasing: 'cubicOut'
  }
  
  // 应用配置项
  emotionRadarChart.setOption(option)
  
  // 响应式调整
  const handleResize = () => {
    emotionRadarChart?.resize()
  }
  window.addEventListener('resize', handleResize)
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize)
  }
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

// 组件销毁时清理资源
onUnmounted(() => {
  if (emotionChart) {
    emotionChart.dispose()
    emotionChart = null
  }
  if (emotionRadarChart) {
    emotionRadarChart.dispose()
    emotionRadarChart = null
  }
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

.chart-container {
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.chart-container:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.05);
  border-color: #4F46E5;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 2px;
  }
}
</style>