# CareSync AI 项目开发规范

## 项目概述

CareSync AI 是一个专注于留守儿童情感陪伴与服务的平台，采用 "AI 智能陪伴 + 社工精准介入" 的模式，为留守儿童提供有温度的情感支持，同时为社工提供数据驱动的精准服务工具。

## 技术栈规范

### 前端技术栈
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI组件库**: Arco Design Vue
- **路由管理**: Vue Router
- **HTTP客户端**: Axios

### 开发工具
- **包管理器**: npm
- **代码规范**: ESLint + Prettier
- **版本控制**: Git
- **IDE推荐**: VS Code

## UI/UX 设计规范

### 设计系统
基于prototype分析，项目采用以下设计规范：

#### 色彩系统
```javascript
// 主色调
primary: '#4F46E5',     // 紫色 - 主要品牌色
secondary: '#10B981',   // 绿色 - 成功/积极状态
accent: '#F97316',      // 橙色 - 强调/警告

// 中性色
neutral: '#6B7280',     // 中性文字
light: '#F3F4F6',       // 浅色背景
dark: '#1F2937',        // 深色文字

// 状态色
success: '#22C55E',     // 成功
warning: '#F59E0B',     // 警告
danger: '#EF4444',      // 危险/错误