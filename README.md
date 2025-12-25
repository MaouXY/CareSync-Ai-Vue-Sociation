# CareSync AI

CareSync AI 是一个专注于留守儿童情感陪伴与服务的平台，采用 "AI 智能陪伴 + 社工精准介入" 的模式，为留守儿童提供有温度的情感支持，同时为社工提供数据驱动的精准服务工具。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI组件库**: Arco Design Vue
- **路由管理**: Vue Router
- **HTTP客户端**: Axios

## 功能特性

### AI 对话模块
- 多模态大模型支持
- 智能情感陪伴对话
- 历史聊天记录管理
- 实时对话交互

### 开发目标
1. CSS 规范化，便于项目引入
2. 完善历史聊天功能
3. 多模态大模型支持

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 项目结构

```
CareSync-Ai-Vue-Sociation/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── views/           # 页面视图
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia 状态管理
│   ├── api/             # API 接口
│   └── utils/           # 工具函数
├── public/              # 公共资源
└── package.json         # 项目配置
```

## 开发规范

项目使用 Vue 3 `<script setup>` SFCs，详见 [script setup 文档](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup)。

了解更多关于推荐的 Project Setup 和 IDE Support，请查看 [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup)。
