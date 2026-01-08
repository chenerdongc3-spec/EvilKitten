// HTTP 请求相关类型定义

import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// 请求配置扩展
export interface RequestConfig extends AxiosRequestConfig {
  // 是否显示加载提示
  showLoading?: boolean
  // 加载提示文本
  loadingText?: string
  // 是否显示错误提示
  showError?: boolean
  // 是否显示成功提示
  showSuccess?: boolean
  // 成功提示文本
  successText?: string
  // 是否启用重试
  retry?: boolean
  // 重试次数
  retryCount?: number
  // 重试延迟（毫秒）
  retryDelay?: number
  // 是否为流式请求
  isStream?: boolean
}

// 响应数据结构
export interface ResponseData<T = any> {
  code: number
  data: T
  message: string
  success: boolean
}

// 流式响应回调
export interface StreamCallbacks {
  // 接收到数据块
  onChunk?: (chunk: string) => void
  // 流式响应完成
  onComplete?: () => void
  // 流式响应错误
  onError?: (error: Error) => void
  // 流式响应进度
  onProgress?: (loaded: number, total: number) => void
}

// 请求重试配置
export interface RetryConfig {
  // 当前重试次数
  count: number
  // 最大重试次数
  maxCount: number
  // 重试延迟
  delay: number
  // 上次请求时间
  lastRequestTime: number
}

// API 错误类型
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  CANCEL_ERROR = 'CANCEL_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// API 错误
export class ApiError extends Error {
  type: ApiErrorType
  code?: number
  response?: AxiosResponse
  
  constructor(
    message: string,
    type: ApiErrorType = ApiErrorType.UNKNOWN_ERROR,
    code?: number,
    response?: AxiosResponse
  ) {
    super(message)
    this.name = 'ApiError'
    this.type = type
    this.code = code
    this.response = response
  }
}
