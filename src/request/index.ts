/**
 * Request 统一导出
 * 
 * 方便在其他文件中导入使用
 * 
 * @example
 * ```typescript
 * // 导入 request
 * import request from '@/request'
 * 
 * // 导入 API 函数
 * import { userLogin, getConversationList } from '@/request'
 * 
 * // 导入类型
 * import type { LoginParams, UserInfo } from '@/request'
 * ```
 */

// 导出 request 实例
export { default, service } from './http'

// 导出所有 API 函数
export * from './api'

// 导出类型
export type { RequestConfig, ResponseData } from './http'
