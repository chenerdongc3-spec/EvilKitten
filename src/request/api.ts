/**
 * API 接口管理
 * 
 * 统一管理所有 API 接口，便于维护和复用
 * 
 * 命名规范：
 * - 模块名 + API 功能
 * - 使用小驼峰命名法
 * 
 * @example
 * ```typescript
 * import { userLogin, getUserInfo } from '@/request/api'
 * 
 * // 登录
 * const token = await userLogin({ username, password })
 * 
 * // 获取用户信息
 * const userInfo = await getUserInfo()
 * ```
 */

import request from './http'

// ==================== 类型定义 ====================

/**
 * 用户登录参数
 */
export interface LoginParams {
  username: string
  password: string
}

/**
 * 用户登录响应
 */
export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar?: string
  email?: string
}

/**
 * 对话列表项
 */
export interface ConversationItem {
  id: string
  title: string
  lastMessage: string
  updatedAt: number
}

/**
 * 消息项
 */
export interface MessageItem {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// ==================== 用户相关 API ====================

/**
 * 用户登录
 * 
 * @param data - 登录参数
 * @returns 登录响应（包含 token 和用户信息）
 * 
 * @example
 * ```typescript
 * const { token, userInfo } = await userLogin({
 *   username: 'admin',
 *   password: '123456'
 * })
 * localStorage.setItem('token', token)
 * ```
 */
export const userLogin = (data: LoginParams) => {
  return request.post<LoginResponse>('/user/login', data, {
    showLoading: true,
    showError: true
  })
}

/**
 * 用户注册
 * 
 * @param data - 注册参数
 */
export const userRegister = (data: LoginParams) => {
  return request.post('/user/register', data, {
    showLoading: true,
    showError: true,
    showSuccess: true,
    successMsg: '注册成功'
  })
}

/**
 * 获取用户信息
 * 
 * @returns 用户信息
 */
export const getUserInfo = () => {
  return request.get<UserInfo>('/user/info')
}

/**
 * 退出登录
 */
export const userLogout = () => {
  return request.post('/user/logout', {}, {
    showSuccess: true,
    successMsg: '退出成功'
  })
}

// ==================== 对话相关 API ====================

/**
 * 获取对话列表
 * 
 * @returns 对话列表
 * 
 * @example
 * ```typescript
 * const conversations = await getConversationList()
 * console.log(conversations)
 * ```
 */
export const getConversationList = () => {
  return request.get<ConversationItem[]>('/conversation/list')
}

/**
 * 获取对话详情
 * 
 * @param id - 对话 ID
 * @returns 对话详情（包含消息列表）
 */
export const getConversationDetail = (id: string) => {
  return request.get<MessageItem[]>(`/conversation/${id}`)
}

/**
 * 创建新对话
 * 
 * @param title - 对话标题
 * @returns 新创建的对话 ID
 */
export const createConversation = (title?: string) => {
  return request.post<{ id: string }>('/conversation/create', { title }, {
    showSuccess: true,
    successMsg: '创建成功'
  })
}

/**
 * 删除对话
 * 
 * @param id - 对话 ID
 */
export const deleteConversation = (id: string) => {
  return request.delete(`/conversation/${id}`, {
    showSuccess: true,
    successMsg: '删除成功'
  })
}

/**
 * 更新对话标题
 * 
 * @param id - 对话 ID
 * @param title - 新标题
 */
export const updateConversationTitle = (id: string, title: string) => {
  return request.put(`/conversation/${id}`, { title }, {
    showSuccess: true,
    successMsg: '更新成功'
  })
}

// ==================== 消息相关 API ====================

/**
 * 发送消息
 * 
 * @param conversationId - 对话 ID
 * @param content - 消息内容
 * @returns AI 回复
 * 
 * @example
 * ```typescript
 * const reply = await sendMessage('conv-123', '你好')
 * console.log(reply)
 * ```
 */
export const sendMessage = (conversationId: string, content: string) => {
  return request.post<{ content: string }>('/message/send', {
    conversationId,
    content
  }, {
    showLoading: true,
    showError: true
  })
}

/**
 * 删除消息
 * 
 * @param messageId - 消息 ID
 */
export const deleteMessage = (messageId: string) => {
  return request.delete(`/message/${messageId}`, {
    showSuccess: true,
    successMsg: '删除成功'
  })
}

// ==================== 文件上传 API ====================

/**
 * 上传文件
 * 
 * @param file - 文件对象
 * @returns 文件 URL
 * 
 * @example
 * ```typescript
 * const fileUrl = await uploadFile(file)
 * console.log('文件地址:', fileUrl)
 * ```
 */
export const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return request.post<{ url: string }>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    showLoading: true,
    showError: true
  })
}

// ==================== 其他 API ====================

/**
 * 获取系统配置
 */
export const getSystemConfig = () => {
  return request.get('/system/config')
}

/**
 * 健康检查
 */
export const healthCheck = () => {
  return request.get('/health')
}

// ==================== 导出所有 API ====================

export default {
  // 用户相关
  userLogin,
  userRegister,
  getUserInfo,
  userLogout,
  
  // 对话相关
  getConversationList,
  getConversationDetail,
  createConversation,
  deleteConversation,
  updateConversationTitle,
  
  // 消息相关
  sendMessage,
  deleteMessage,
  
  // 文件上传
  uploadFile,
  
  // 其他
  getSystemConfig,
  healthCheck
}
