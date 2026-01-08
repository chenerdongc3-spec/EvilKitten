/**
 * Axios 二次封装
 * 
 * 统一管理 HTTP 请求，包括：
 * - 请求/响应拦截器
 * - 错误处理
 * - Loading 状态
 * - Token 管理
 * 
 * @example
 * ```typescript
 * import request from '@/request/http'
 * 
 * // GET 请求
 * const data = await request.get('/api/users')
 * 
 * // POST 请求
 * const result = await request.post('/api/login', { username, password })
 * ```
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'

/**
 * 自定义请求配置
 * 扩展 axios 的配置选项
 */
export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean      // 是否显示 loading
  showError?: boolean        // 是否显示错误提示
  showSuccess?: boolean      // 是否显示成功提示
  successMsg?: string        // 成功提示文案
}

/**
 * 统一响应数据格式
 * 根据你的后端 API 格式调整
 */
export interface ResponseData<T = any> {
  code: number          // 状态码
  data: T              // 响应数据
  message: string      // 提示信息
}

// Loading 实例
let loadingInstance: LoadingInstance | null = null
let loadingCount = 0  // 记录同时发起的请求数量

/**
 * 显示 Loading
 */
const showLoading = () => {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
  loadingCount++
}

/**
 * 隐藏 Loading
 */
const hideLoading = () => {
  loadingCount--
  if (loadingCount === 0 && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',  // API 基础路径
  timeout: 30000,                                         // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

/**
 * 请求拦截器
 * 
 * 在请求发送前执行：
 * 1. 添加 Token
 * 2. 显示 Loading
 * 3. 处理请求参数
 */
service.interceptors.request.use(
  (config: any) => {
    // 1. 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 2. 显示 Loading（如果配置了 showLoading）
    if (config.showLoading !== false) {
      showLoading()
    }

    // 3. 打印请求信息（开发环境）
    if (import.meta.env.DEV) {
      console.log('📤 请求:', config.method?.toUpperCase(), config.url, config.data || config.params)
    }

    return config
  },
  (error) => {
    // 请求错误处理
    console.error('❌ 请求错误:', error)
    hideLoading()
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 
 * 在收到响应后执行：
 * 1. 隐藏 Loading
 * 2. 统一处理响应数据
 * 3. 错误处理
 */
service.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    // 1. 隐藏 Loading
    hideLoading()

    // 2. 打印响应信息（开发环境）
    if (import.meta.env.DEV) {
      console.log('📥 响应:', response.config.url, response.data)
    }

    const { code, data, message } = response.data

    // 3. 根据业务状态码处理
    if (code === 200 || code === 0) {
      // 成功：显示成功提示（如果配置了）
      const config = response.config as RequestConfig
      if (config.showSuccess) {
        ElMessage.success(config.successMsg || message || '操作成功')
      }
      return data
    } else if (code === 401) {
      // 未授权：清除 token，跳转登录页
      ElMessage.error('登录已过期，请重新登录')
      localStorage.removeItem('token')
      // 这里可以跳转到登录页
      // router.push('/login')
      return Promise.reject(new Error(message || '未授权'))
    } else {
      // 其他错误：显示错误提示
      const config = response.config as RequestConfig
      if (config.showError !== false) {
        ElMessage.error(message || '请求失败')
      }
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  (error) => {
    // 4. HTTP 错误处理
    hideLoading()

    let errorMessage = '网络错误'

    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          errorMessage = data?.message || '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请登录'
          localStorage.removeItem('token')
          // router.push('/login')
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器错误'
          break
        case 502:
          errorMessage = '网关错误'
          break
        case 503:
          errorMessage = '服务不可用'
          break
        case 504:
          errorMessage = '网关超时'
          break
        default:
          errorMessage = data?.message || `请求失败 (${status})`
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      errorMessage = '网络连接失败，请检查网络'
    } else {
      // 请求配置出错
      errorMessage = error.message || '请求配置错误'
    }

    // 显示错误提示
    const config = error.config as RequestConfig
    if (config?.showError !== false) {
      ElMessage.error(errorMessage)
    }

    console.error('❌ 响应错误:', errorMessage, error)
    return Promise.reject(error)
  }
)

/**
 * 封装的请求方法
 */
const request = {
  /**
   * GET 请求
   * 
   * @param url - 请求地址
   * @param params - 请求参数
   * @param config - 请求配置
   * 
   * @example
   * ```typescript
   * // 基础用法
   * const users = await request.get('/users')
   * 
   * // 带参数
   * const user = await request.get('/users/1', { id: 1 })
   * 
   * // 自定义配置
   * const data = await request.get('/users', {}, {
   *   showLoading: true,
   *   showError: true
   * })
   * ```
   */
  get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<T> {
    return service.get(url, { params, ...config })
  },

  /**
   * POST 请求
   * 
   * @param url - 请求地址
   * @param data - 请求数据
   * @param config - 请求配置
   * 
   * @example
   * ```typescript
   * // 基础用法
   * const result = await request.post('/login', {
   *   username: 'admin',
   *   password: '123456'
   * })
   * 
   * // 显示成功提示
   * await request.post('/users', userData, {
   *   showSuccess: true,
   *   successMsg: '创建成功'
   * })
   * ```
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  /**
   * PUT 请求
   * 
   * @param url - 请求地址
   * @param data - 请求数据
   * @param config - 请求配置
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  /**
   * DELETE 请求
   * 
   * @param url - 请求地址
   * @param config - 请求配置
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return service.delete(url, config)
  },

  /**
   * PATCH 请求
   * 
   * @param url - 请求地址
   * @param data - 请求数据
   * @param config - 请求配置
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return service.patch(url, data, config)
  }
}

// 导出 axios 实例（用于特殊场景）
export { service }

// 默认导出封装的请求方法
export default request
