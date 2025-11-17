import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// 定义路由表
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'CareSync AI - 留守儿童情感陪伴平台'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: '关于我们 - CareSync AI'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      title: '数据可视化仪表板 - CareSync AI'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      title: '登录 - CareSync AI'
    }
  },
  {
    path: '/work-home',
    name: 'workHome',
    component: () => import('../views/WorkHomeView.vue'),
    meta: {
      title: '社工工作台 - CareSync AI'
    }
  },
  {
    path: '/children',
    name: 'children',
    component: () => import('../views/children/ChildrenListView.vue'),
    meta: {
      title: '儿童管理 - CareSync AI'
    }
  },
  {
    path: '/children/:id',
    name: 'childDetail',
    component: () => import('../views/children/ChildDetailView.vue'),
    meta: {
      title: '儿童详情 - CareSync AI'
    }
  },
  {
    path: '/childrentest',
    name: 'childrenTest',
    component: () => import('../views/children/ChildTestView.vue'),
    meta: {
      title: '儿童测试 - CareSync AI'
    }
  },
  {
    path: '/analysis',
    name: 'analysis',
    component: () => import('../views/analysis/AnalysisListView.vue'),
    meta: {
      title: 'AI分析 - CareSync AI'
    }
  },
  {
    path: '/analysis/:id',
    name: 'analysisDetail',
    component: () => import('../views/analysis/AnalysisDetailView.vue'),
    meta: {
      title: '分析详情 - CareSync AI'
    }
  },
  {
    path: '/schemes',
    name: 'schemes',
    component: () => import('../views/schemes/SchemesListView.vue'),
    meta: {
      title: '服务方案管理 - CareSync AI'
    }
  },
  {
    path: '/schemes/:id',
    name: 'schemeDetail',
    component: () => import('../views/schemes/SchemeDetailView.vue'),
    meta: {
      title: '方案详情 - CareSync AI'
    }
  },
  {
    path: '/schemes/create',
    name: 'createScheme',
    component: () => import('../views/schemes/SchemesListView.vue'),
    meta: {
      title: '创建服务方案 - CareSync AI'
    }
  },
  {
    path: '/schemes/edit/:id',
    name: 'editScheme',
    component: () => import('../views/schemes/SchemeDetailView.vue'),
    meta: {
      title: '编辑服务方案 - CareSync AI'
    }
  },
  {
    path: '/simulation',
    name: 'simulation',
    component: () => import('../views/simulation/SimulationTrainingView.vue'),
    meta: {
      title: 'AI模拟训练 - CareSync AI'
    }
  },
  {
    path: '/training',
    name: 'training',
    component: () => import('../views/tracking/TrackingListView.vue'),
    meta: {
      title: '服务跟踪 - CareSync AI'
    }
  },
  {
    path: '/training/:id',
    name: 'trackingDetail',
    component: () => import('../views/tracking/TrackingDetailView.vue'),
    meta: {
      title: '跟踪详情 - CareSync AI'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title as string || 'CareSync AI'
  next()
})

export default router