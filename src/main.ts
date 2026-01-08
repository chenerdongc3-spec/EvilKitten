import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Element Plus 样式
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 全局样式（包含 Element Plus 主题定制）
import '@/assets/styles/global.scss'

// 创建 Vue 应用实例
const app = createApp(App)

// 创建 Pinia 实例并立即注册
// 注意：必须在 mount 之前调用 use(pinia)，这样组件才能正确访问 store
const pinia = createPinia()
app.use(pinia)

// 挂载应用到 DOM
app.mount('#app')
