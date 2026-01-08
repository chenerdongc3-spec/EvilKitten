/**
 * Request 使用示例
 * 
 * 这个文件展示了如何使用 request 和 api
 * 仅供学习参考，不会在项目中实际使用
 */

import request from './http'
import { userLogin, getConversationList, sendMessage } from './api'

// ==================== 示例 1: 直接使用 request ====================

/**
 * 示例：直接使用 request 发送请求
 */
export async function example1() {
  try {
    // GET 请求
    const users = await request.get('/users')
    console.log('用户列表:', users)

    // POST 请求
    const result = await request.post('/users', {
      name: '张三',
      age: 25
    })
    console.log('创建结果:', result)

    // 带配置的请求
    const data = await request.get('/users', {}, {
      showLoading: true,    // 显示 loading
      showError: true,      // 显示错误提示
      showSuccess: true,    // 显示成功提示
      successMsg: '获取成功'
    })
    console.log('数据:', data)
  } catch (error) {
    console.error('请求失败:', error)
  }
}

// ==================== 示例 2: 使用 API 函数 ====================

/**
 * 示例：使用封装好的 API 函数
 */
export async function example2() {
  try {
    // 用户登录
    const { token, userInfo } = await userLogin({
      username: 'admin',
      password: '123456'
    })
    
    // 保存 token
    localStorage.setItem('token', token)
    console.log('登录成功:', userInfo)

    // 获取对话列表
    const conversations = await getConversationList()
    console.log('对话列表:', conversations)

    // 发送消息
    const reply = await sendMessage('conv-123', '你好')
    console.log('AI 回复:', reply)
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// ==================== 示例 3: 在 Vue 组件中使用 ====================

/**
 * 示例：在 Vue 组件中使用
 */
export const componentExample = `
<script setup lang="ts">
import { ref } from 'vue'
import { userLogin } from '@/request/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)

// 登录处理
const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  try {
    loading.value = true
    
    // 调用登录 API
    const { token, userInfo } = await userLogin({
      username: username.value,
      password: password.value
    })
    
    // 保存 token
    localStorage.setItem('token', token)
    
    // 保存用户信息
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
    // 跳转到首页
    router.push('/')
    
    ElMessage.success('登录成功')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-form">
    <el-input v-model="username" placeholder="用户名" />
    <el-input v-model="password" type="password" placeholder="密码" />
    <el-button 
      type="primary" 
      :loading="loading"
      @click="handleLogin"
    >
      登录
    </el-button>
  </div>
</template>
`

// ==================== 示例 4: 在 Pinia Store 中使用 ====================

/**
 * 示例：在 Pinia Store 中使用
 */
export const storeExample = `
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, getConversationList } from '@/request/api'
import type { UserInfo, ConversationItem } from '@/request/api'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null)
  const conversations = ref<ConversationItem[]>([])
  const loading = ref(false)

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      loading.value = true
      userInfo.value = await getUserInfo()
    } catch (error) {
      console.error('获取用户信息失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取对话列表
  const fetchConversations = async () => {
    try {
      conversations.value = await getConversationList()
    } catch (error) {
      console.error('获取对话列表失败:', error)
    }
  }

  return {
    userInfo,
    conversations,
    loading,
    fetchUserInfo,
    fetchConversations
  }
})
`

// ==================== 示例 5: 错误处理 ====================

/**
 * 示例：完整的错误处理
 */
export async function example5() {
  try {
    const data = await request.get('/users')
    console.log('成功:', data)
  } catch (error: any) {
    // 详细的错误处理
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('状态码:', error.response.status)
      console.error('错误信息:', error.response.data)
      
      if (error.response.status === 401) {
        // 未授权，跳转登录
        console.log('请重新登录')
      } else if (error.response.status === 404) {
        // 资源不存在
        console.log('资源不存在')
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，请检查网络连接')
    } else {
      // 请求配置出错
      console.error('请求错误:', error.message)
    }
  }
}

// ==================== 示例 6: 文件上传 ====================

/**
 * 示例：文件上传
 */
export async function example6(file: File) {
  try {
    // 创建 FormData
    const formData = new FormData()
    formData.append('file', file)
    
    // 上传文件
    const result = await request.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      showLoading: true,
      showSuccess: true,
      successMsg: '上传成功'
    })
    
    console.log('文件地址:', result.url)
    return result.url
  } catch (error) {
    console.error('上传失败:', error)
    throw error
  }
}

// ==================== 示例 7: 并发请求 ====================

/**
 * 示例：同时发送多个请求
 */
export async function example7() {
  try {
    // 使用 Promise.all 并发请求
    const [users, conversations, config] = await Promise.all([
      request.get('/users'),
      getConversationList(),
      request.get('/system/config')
    ])
    
    console.log('用户列表:', users)
    console.log('对话列表:', conversations)
    console.log('系统配置:', config)
  } catch (error) {
    console.error('请求失败:', error)
  }
}

// ==================== 示例 8: 取消请求 ====================

/**
 * 示例：取消请求
 */
export function example8() {
  // 创建取消令牌
  const controller = new AbortController()
  
  // 发送请求
  request.get('/users', {}, {
    signal: controller.signal
  }).then(data => {
    console.log('数据:', data)
  }).catch(error => {
    if (error.name === 'CanceledError') {
      console.log('请求已取消')
    }
  })
  
  // 3 秒后取消请求
  setTimeout(() => {
    controller.abort()
  }, 3000)
}

// ==================== 示例 9: 自定义拦截器 ====================

/**
 * 示例：添加自定义拦截器
 */
export function example9() {
  // 导入 axios 实例
  import('./http').then(({ service }) => {
    // 添加请求拦截器
    service.interceptors.request.use(
      (config) => {
        // 自定义处理
        console.log('自定义请求拦截器')
        return config
      }
    )
    
    // 添加响应拦截器
    service.interceptors.response.use(
      (response) => {
        // 自定义处理
        console.log('自定义响应拦截器')
        return response
      }
    )
  })
}

// ==================== 示例 10: Mock 数据 ====================

/**
 * 示例：在开发环境使用 Mock 数据
 */
export async function example10() {
  // 开发环境使用 mock 数据
  if (import.meta.env.DEV) {
    return Promise.resolve({
      id: '1',
      name: '张三',
      age: 25
    })
  }
  
  // 生产环境调用真实 API
  return request.get('/users/1')
}

// ==================== 导出所有示例 ====================

export default {
  example1,
  example2,
  example5,
  example6,
  example7,
  example8,
  example9,
  example10
}
