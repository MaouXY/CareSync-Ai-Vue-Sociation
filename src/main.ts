import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import './styles/main.css'
import App from './App.vue'

// 引入 Arco Design Vue
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'

// 引入认证store
import { useAuthStore } from './stores'

// 创建Vue应用实例
const app = createApp(App)

// 使用Pinia状态管理
app.use(createPinia())

// 使用Vue Router
app.use(router)

// 使用 Arco Design Vue
app.use(ArcoVue)

// 挂载应用
app.mount('#app')

// 初始化认证状态，从本地存储恢复用户信息
const authStore = useAuthStore()
authStore.initialize()
