<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart" :style="{ width: chartWidth, height: chartHeight }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

// Props定义
const props = defineProps<{
  width?: string;
  height?: string;
  chartData?: {
    name: string;
    value: number;
    itemStyle?: { color: string };
  }[];
}>();

// 默认属性
const chartWidth = props.width || '100%';
const chartHeight = props.height || '400px';

// 图表引用
const chartRef = ref<HTMLElement>();
let chartInstance: echarts.ECharts | null = null;

// 默认图表数据
const defaultChartData = [
  { name: '紧急风险', value: 5, itemStyle: { color: '#EF4444' } },
  { name: '中风险', value: 12, itemStyle: { color: '#F59E0B' } },
  { name: '低风险', value: 28, itemStyle: { color: '#22C55E' } },
  { name: '无风险', value: 45, itemStyle: { color: '#4F46E5' } },
];

// 准备图表数据
const prepareChartData = () => {
  const data = props.chartData || defaultChartData;
  return data;
};

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;
  
  // 创建图表实例
  chartInstance = echarts.init(chartRef.value);
  
  // 配置图表选项
  const option: EChartsOption = {
    title: {
      text: '儿童风险等级分布',
      left: 'center',
      textStyle: {
        color: '#1F2937',
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
    },
    series: [
      {
        name: '风险等级',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 4, // 增加扇区间隙宽度
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: prepareChartData(),
      },
    ],
  };
  
  // 应用配置
  chartInstance.setOption(option);
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize);
};

// 处理窗口大小变化
const handleResize = () => {
  chartInstance?.resize();
};

// 监听数据变化
watch(
  () => props.chartData,
  () => {
    if (chartInstance) {
      const option: EChartsOption = {
        series: [
          {
            data: prepareChartData(),
          },
        ],
      };
      chartInstance.setOption(option);
    }
  },
  { deep: true }
);

// 生命周期钩子
onMounted(() => {
  initChart();
});

onUnmounted(() => {
  // 销毁图表实例
  chartInstance?.dispose();
  // 移除事件监听
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>