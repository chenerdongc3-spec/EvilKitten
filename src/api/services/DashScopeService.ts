/**
 * 阿里云百炼 API 服务
 * 
 * 这个服务封装了与阿里云百炼（DashScope）API 的交互逻辑
 * 支持流式响应，实现 AI 对话的实时显示效果
 * 
 * @example
 * ```typescript
 * import { DashScopeService } from '@/api'
 * 
 * await DashScopeService.sendStreamMessage(
 *   messages,
 *   {
 *     onChunk: (content) => console.log(content),
 *     onComplete: () => console.log('完成'),
 *     onError: (error) => console.error(error)
 *   }
 * )
 * ```
 */

import type { StreamCallbacks } from '../types/http'
import type { Message } from '@/types'

/**
 * 扩展的流式响应回调接口
 * 添加了思考内容的回调
 */
export interface ExtendedStreamCallbacks extends StreamCallbacks {
  onReasoningChunk?: (chunk: string) => void  // 思考内容片段回调
}

/**
 * DashScope API 消息格式
 */
export interface DashScopeMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * 阿里云百炼服务类
 */
export class DashScopeService {
  // API 基础地址（阿里云百炼兼容 OpenAI 格式）
  private static baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  
  // API Key（从环境变量读取）
  private static apiKey = import.meta.env.VITE_DASHSCOPE_API_KEY || ''
  
  // 使用的模型（默认 GLM-4.7）
  private static model = import.meta.env.VITE_MODEL || 'glm-4.7'

  /**
   * 发送流式消息到阿里云百炼
   * 
   * 这是主要的 API 调用方法，支持流式响应（SSE）
   * AI 的回复会通过 onChunk 回调逐字返回，实现打字机效果
   * 
   * @param messages - 消息历史数组
   * @param callbacks - 流式响应回调函数
   * 
   * @example
   * ```typescript
   * await DashScopeService.sendStreamMessage(
   *   [{ role: 'user', content: '你好' }],
   *   {
   *     onChunk: (content) => {
   *       // 每次收到一小段文本时调用
   *       console.log(content)
   *     },
   *     onComplete: () => {
   *       // 全部接收完成时调用
   *       console.log('完成')
   *     },
   *     onError: (error) => {
   *       // 发生错误时调用
   *       console.error(error)
   *     }
   *   }
   * )
   * ```
   */
  static async sendStreamMessage(
    messages: Message[],
    callbacks: ExtendedStreamCallbacks
  ): Promise<void> {
    // 创建 AbortController 用于取消请求
    const abortController = new AbortController()
    
    // 设置 60 秒超时
    const timeoutId = setTimeout(() => {
      abortController.abort()
      console.warn('请求超时（60秒）')
    }, 60000)

    try {
      // 1. 转换消息格式（适配 DashScope API）
      const formattedMessages: DashScopeMessage[] = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      // 2. 发送 POST 请求到 DashScope API
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,  // API Key 认证
        },
        body: JSON.stringify({
          model: this.model,                    // 使用的模型
          messages: formattedMessages,          // 消息历史
          stream: true,                         // 启用流式响应
          enable_thinking: true,                // 启用思考模式（GLM-4.7 特性）
          stream_options: {
            include_usage: true                 // 包含 token 使用统计
          }
        }),
        signal: abortController.signal,         // 用于取消请求
      })
      
      // 清除超时定时器
      clearTimeout(timeoutId)

      // 3. 检查响应状态
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      if (!response.body) {
        throw new Error('响应体为空')
      }

      // 4. 处理流式响应
      const reader = response.body.getReader()  // 获取流读取器
      const decoder = new TextDecoder()         // 文本解码器
      let buffer = ''                           // 数据缓冲区
      let isAnswering = false                   // 是否已开始回复

      // 5. 循环读取数据流
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          // 流结束，调用完成回调
          callbacks.onComplete?.()
          break
        }

        // 6. 解码数据并添加到缓冲区
        buffer += decoder.decode(value, { stream: true })
        
        // 7. 按行分割数据
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''  // 保留最后一行（可能不完整）

        // 8. 处理每一行数据
        for (const line of lines) {
          const trimmedLine = line.trim()
          
          // 跳过空行和注释
          if (!trimmedLine || trimmedLine.startsWith(':')) {
            continue
          }

          // 9. 处理 SSE 格式数据（Server-Sent Events）
          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6).trim()
            
            // 跳过结束标记
            if (data === '[DONE]') {
              continue
            }

            try {
              // 10. 解析 JSON 数据
              const parsed = JSON.parse(data)
              
              // 处理 token 使用统计
              if (parsed.usage) {
                console.log('Token 使用:', parsed.usage)
                continue
              }

              if (!parsed.choices?.length) {
                continue
              }

              const delta = parsed.choices[0].delta

              // 11. 处理思考内容（reasoning_content）
              // GLM-4.7 的思考过程，通过 onReasoningChunk 回调传递
              if (delta.reasoning_content !== undefined && delta.reasoning_content !== null) {
                if (!isAnswering) {
                  // 只在回复阶段之前收集思考内容
                  callbacks.onReasoningChunk?.(delta.reasoning_content)
                }
              }

              // 12. 处理回复内容（content）
              // 这是实际显示给用户的内容
              if (delta.content !== undefined && delta.content) {
                if (!isAnswering) {
                  console.log('思考完成，开始回复...')
                  isAnswering = true
                }
                // 调用 onChunk 回调，传递内容片段
                callbacks.onChunk?.(delta.content)
              }
            } catch (e) {
              console.error('解析 SSE 数据失败:', e, '数据:', data)
            }
          }
        }
      }
    } catch (error) {
      // 清除超时定时器
      clearTimeout(timeoutId)
      
      // 错误处理
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('请求被中止（超时或手动取消）')
          callbacks.onError?.(new Error('请求超时'))
        } else {
          console.error('DashScope API 错误:', error)
          callbacks.onError?.(error)
        }
      }
    }
  }

  /**
   * 发送普通消息（非流式）
   * 
   * 适用于不需要实时显示的场景
   * 
   * @param messages - 消息历史数组
   * @returns AI 的完整回复
   */
  static async sendMessage(messages: Message[]): Promise<string> {
    const formattedMessages: DashScopeMessage[] = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: formattedMessages,
        stream: false,              // 非流式响应
        enable_thinking: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }

  /**
   * 设置 API Key
   * 
   * @param apiKey - 阿里云百炼 API Key
   */
  static setApiKey(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * 设置使用的模型
   * 
   * @param model - 模型名称（如 'glm-4.7', 'qwen-plus'）
   */
  static setModel(model: string) {
    this.model = model
  }

  /**
   * 获取当前配置
   * 
   * @returns 当前的配置信息
   */
  static getConfig() {
    return {
      baseURL: this.baseURL,
      model: this.model,
      hasApiKey: !!this.apiKey
    }
  }
}
