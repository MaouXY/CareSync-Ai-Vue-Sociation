# 实现计划

## 1. 分析当前实现
- **SchemeDetailView.vue**：使用 `groupedInterventions` 计算属性按周分组干预措施，展示每周任务状态、内容和进度
- **TrackingDetailView.vue**：已有 `measuresSuggest` 类型定义，但展示方式需要优化

## 2. 实现步骤

### 2.1 优化 measuresSuggest 展示结构
- 将当前的简单列表展示改为按周分组的卡片式布局
- 为每周添加进度展示（已完成任务数/总任务数）
- 优化任务项的展示样式，包括状态标签、内容和元信息

### 2.2 实现周进度计算
- 添加 `getWeekCompletedCount` 函数计算每周已完成任务数
- 添加 `getWeekProgress` 函数计算每周进度百分比

### 2.3 优化任务状态展示
- 使用与 SchemeDetailView 一致的状态标签样式
- 实现状态文本和颜色的映射

### 2.4 调整页面布局和样式
- 确保与 SchemeDetailView 保持一致的视觉风格
- 优化响应式设计，适配不同屏幕尺寸

## 3. 代码修改点

### 3.1 修改 TrackingDetailView.vue 的模板部分
- 重构 `service-measures-card` 组件，实现按周分组展示
- 添加周进度条和统计信息
- 优化任务项的布局和样式

### 3.2 调整样式部分
- 添加周分组相关的 CSS 样式
- 优化任务项的样式
- 确保与 SchemeDetailView 样式一致

### 3.3 完善 TypeScript 类型定义
- 确保 `measuresSuggest` 相关类型定义准确
- 检查并更新接口响应类型

## 4. 预期效果
- 按周分组展示服务措施
- 显示每周任务进度
- 任务项包含状态标签、内容和 ID
- 视觉风格与 SchemeDetailView 保持一致
- 响应式设计适配不同屏幕尺寸