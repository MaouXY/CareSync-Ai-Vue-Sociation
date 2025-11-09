<template>
  <div class="dashboard-container">
    <div class="page-header">
      <h1>数据可视化仪表板</h1>
      <p class="description">展示儿童风险等级分布及相关统计数据</p>
    </div>
    
    <div class="charts-grid">
      <div class="chart-card">
        <EChartsDemo 
          width="100%" 
          height="400px" 
        />
      </div>
      
      <div class="chart-card">
        <EChartsDemo 
          width="100%" 
          height="400px" 
          :chartData="customData" 
        />
      </div>
    </div>
    
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-number">{{ totalChildren }}</div>
        <div class="stat-label">总儿童数</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-number">{{ highRisk }}</div>
        <div class="stat-label">高风险儿童</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-number">{{ mediumRisk }}</div>
        <div class="stat-label">中风险儿童</div>
      </div>
      <div class="stat-card success">
        <div class="stat-number">{{ lowRisk }}</div>
        <div class="stat-label">低风险儿童</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import EChartsDemo from '@/components/EChartsDemo.vue';

// 自定义图表数据
const customData = ref([
  { name: '紧急风险', value: 8, itemStyle: { color: '#EF4444' } },
  { name: '中风险', value: 15, itemStyle: { color: '#F59E0B' } },
  { name: '低风险', value: 32, itemStyle: { color: '#22C55E' } },
  { name: '无风险', value: 45, itemStyle: { color: '#4F46E5' } },
]);

// 统计数据
const highRisk = ref(8);
const mediumRisk = ref(15);
const lowRisk = ref(32);
const noRisk = ref(45);

// 计算总儿童数
const totalChildren = computed(() => {
  return highRisk.value + mediumRisk.value + lowRisk.value + noRisk.value;
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.description {
  font-size: 16px;
  color: #6B7280;
  margin: 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #4F46E5;
}

.stat-card.danger {
  border-left-color: #EF4444;
}

.stat-card.warning {
  border-left-color: #F59E0B;
}

.stat-card.success {
  border-left-color: #22C55E;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-overview {
    grid-template-columns: 1fr 1fr;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    padding: 16px;
  }
}
</style>