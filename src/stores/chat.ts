/**
 * 聊天状态管理 Store
 * 
 * 使用 Pinia 管理聊天应用的全局状态
 * 包括对话列表、消息管理、AI 交互等核心功能
 * 
 * @example
 * ```typescript
 * import { useChatStore } from '@/stores/chat'
 * 
 * const chatStore = useChatStore()
 * chatStore.sendMessage('你好')
 * ```
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Conversation, Message } from '@/types'

export const useChatStore = defineStore('chat', () => {
  // ==================== 状态定义 ====================
  
  /**
   * 对话列表
   * 存储所有的对话记录
   */
  const conversations = ref<Conversation[]>([])
  
  /**
   * 当前活跃的对话 ID
   * 用于标识用户正在查看的对话
   */
  const activeConversationId = ref<string | null>(null)
  
  /**
   * 加载状态
   * 表示是否正在等待 AI 响应
   */
  const isLoading = ref(false)
  
  /**
   * 流式接收状态
   * 表示是否正在接收 AI 的流式响应
   */
  const isStreaming = ref(false)

  // ==================== 计算属性 ====================
  
  /**
   * 当前活跃的对话对象
   * 根据 activeConversationId 查找对应的对话
   */
  const activeConversation = computed(() => {
    return conversations.value.find(c => c.id === activeConversationId.value) || null
  })

  // ==================== 工具函数 ====================
  
  /**
   * 生成唯一 ID
   * 使用时间戳 + 随机字符串确保唯一性
   * 
   * @returns 唯一的 ID 字符串
   */
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  // ==================== 对话管理 ====================
  
  /**
   * 创建新对话
   * 
   * 创建一个空的对话，并设置为当前活跃对话
   * 
   * @returns 新创建的对话对象
   */
  const createConversation = () => {
    const newConversation: Conversation = {
      id: generateId(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    // 添加到列表开头（最新的在前面）
    conversations.value.unshift(newConversation)
    
    // 设置为活跃对话
    activeConversationId.value = newConversation.id
    
    // 保存到本地存储
    saveConversations()
    
    return newConversation
  }

  /**
   * 删除对话
   * 
   * @param id - 要删除的对话 ID
   */
  const deleteConversation = (id: string) => {
    const index = conversations.value.findIndex(c => c.id === id)
    if (index !== -1) {
      conversations.value.splice(index, 1)
      
      // 如果删除的是当前对话，需要切换到其他对话
      if (activeConversationId.value === id) {
        if (conversations.value.length > 0) {
          // 切换到第一个对话
          activeConversationId.value = conversations.value[0]?.id || null
        } else {
          // 没有对话了，创建新对话
          createConversation()
        }
      }
      
      saveConversations()
    }
  }

  /**
   * 切换对话
   * 
   * @param id - 要切换到的对话 ID
   */
  const switchConversation = (id: string) => {
    activeConversationId.value = id
  }

  // ==================== 消息管理 ====================
  
  /**
   * 添加消息到对话
   * 
   * @param conversationId - 对话 ID
   * @param message - 消息内容（不包含 id 和 timestamp）
   * @returns 新创建的消息对象
   */
  const addMessage = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (!conversation) return

    // 创建完整的消息对象
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now()
    }

    // 添加到消息列表
    conversation.messages.push(newMessage)
    conversation.updatedAt = Date.now()

    // 自动更新对话标题（使用第一条用户消息的前 20 个字符）
    if (conversation.messages.length === 1 && message.role === 'user') {
      conversation.title = message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '')
    }

    saveConversations()
    return newMessage
  }

  /**
   * 更新消息内容
   * 
   * 主要用于流式响应，逐步更新 AI 的回复内容
   * 
   * @param conversationId - 对话 ID
   * @param messageId - 消息 ID
   * @param content - 新的消息内容
   */
  const updateMessage = (conversationId: string, messageId: string, content: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (!conversation) return

    const message = conversation.messages.find(m => m.id === messageId)
    if (message) {
      message.content = content
      conversation.updatedAt = Date.now()
      saveConversations()
    }
  }

  /**
   * 更新消息的思考内容
   * 
   * 用于流式接收 AI 的思考过程
   * 
   * @param conversationId - 对话 ID
   * @param messageId - 消息 ID
   * @param reasoningContent - 思考内容
   */
  const updateReasoningContent = (conversationId: string, messageId: string, reasoningContent: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (!conversation) return

    const message = conversation.messages.find(m => m.id === messageId)
    if (message) {
      message.reasoningContent = reasoningContent
      conversation.updatedAt = Date.now()
      saveConversations()
    }
  }

  // ==================== AI 交互 ====================
  
  /**
   * 发送消息到 AI
   * 
   * 这是核心功能，处理用户消息并获取 AI 响应
   * 使用流式响应实现打字机效果
   * 
   * @param content - 用户输入的消息内容
   * 
   * @example
   * ```typescript
   * await chatStore.sendMessage('你好，请介绍一下自己')
   * ```
   */
  const sendMessage = async (content: string) => {
    // 1. 验证输入
    if (!content.trim()) return

    // 2. 确保有活跃对话
    let conversation = activeConversation.value
    if (!conversation) {
      conversation = createConversation()
    }

    // 3. 添加用户消息
    addMessage(conversation.id, {
      role: 'user',
      content: content.trim()
    })

    // 4. 设置加载状态
    isLoading.value = true
    isStreaming.value = true

    try {
      // 5. 创建 AI 消息（初始为空）
      const aiMessage = addMessage(conversation.id, {
        role: 'assistant',
        content: '',
        isStreaming: true  // 标记为流式接收中
      })

      if (!aiMessage) return

      // 6. 动态导入 DashScope 服务
      const { DashScopeService } = await import('@/api/services/DashScopeService')
      
      // 7. 获取对话历史（最近 10 条消息）
      // 限制消息数量可以节省 token 和提高响应速度
      const recentMessages = conversation.messages.slice(-10)
      
      // 8. 发送流式请求
      await DashScopeService.sendStreamMessage(
        recentMessages,
        {
          /**
           * onReasoningChunk: 每次收到思考内容片段时调用
           * 用于实时显示 AI 的思考过程
           */
          onReasoningChunk: (chunk: string) => {
            const currentMessage = conversation.messages.find(m => m.id === aiMessage.id)
            if (currentMessage) {
              // 累加思考内容
              const newReasoningContent = (currentMessage.reasoningContent || '') + chunk
              updateReasoningContent(conversation.id, aiMessage.id, newReasoningContent)
            }
          },
          
          /**
           * onChunk: 每次收到回复内容片段时调用
           * 实现打字机效果的关键
           */
          onChunk: (chunk: string) => {
            // 找到当前的 AI 消息
            const currentMessage = conversation.messages.find(m => m.id === aiMessage.id)
            if (currentMessage) {
              // 累加新内容
              const newContent = (currentMessage.content || '') + chunk
              updateMessage(conversation.id, aiMessage.id, newContent)
            }
          },
          
          /**
           * onComplete: 流式响应完成时调用
           */
          onComplete: () => {
            // 标记消息为完成状态
            const message = conversation.messages.find(m => m.id === aiMessage.id)
            if (message) {
              message.isStreaming = false
            }
            
            // 重置加载状态
            isLoading.value = false
            isStreaming.value = false
          },
          
          /**
           * onError: 发生错误时调用
           */
          onError: (error: Error) => {
            console.error('API 响应错误:', error)
            
            // 重置加载状态
            isLoading.value = false
            isStreaming.value = false
            
            // 更新消息为错误提示
            const message = conversation.messages.find(m => m.id === aiMessage.id)
            if (message) {
              message.content = `抱歉，出现了错误：${error.message}\n\n请检查：\n1. API Key 是否正确配置\n2. 网络连接是否正常\n3. 查看控制台了解详细错误信息`
              message.isStreaming = false
            }
          }
        }
      )
    } catch (error) {
      console.error('发送消息失败:', error)
      isLoading.value = false
      isStreaming.value = false
    }
  }

  // ==================== 本地存储 ====================
  
  /**
   * 保存对话到本地存储
   * 
   * 使用 localStorage 持久化数据
   * 刷新页面后数据不会丢失
   */
  const saveConversations = () => {
    localStorage.setItem('conversations', JSON.stringify(conversations.value))
    localStorage.setItem('activeConversationId', activeConversationId.value || '')
  }

  /**
   * 从本地存储加载对话
   * 
   * 应用启动时调用，恢复之前的对话记录
   */
  const loadConversations = () => {
    // 1. 加载对话列表
    const saved = localStorage.getItem('conversations')
    if (saved) {
      try {
        conversations.value = JSON.parse(saved)
      } catch (e) {
        console.error('加载对话失败:', e)
      }
    }

    // 2. 恢复活跃对话
    const savedActiveId = localStorage.getItem('activeConversationId')
    if (savedActiveId && conversations.value.find(c => c.id === savedActiveId)) {
      activeConversationId.value = savedActiveId
    } else if (conversations.value.length > 0) {
      // 如果没有保存的活跃对话，使用第一个
      activeConversationId.value = conversations.value[0]?.id || null
    } else {
      // 如果没有任何对话，创建新对话
      createConversation()
    }
  }

  // ==================== 导出 ====================
  
  return {
    // 状态
    conversations,
    activeConversationId,
    activeConversation,
    isLoading,
    isStreaming,
    
    // 方法
    createConversation,
    deleteConversation,
    switchConversation,
    addMessage,
    updateMessage,
    updateReasoningContent,
    sendMessage,
    loadConversations
  }
})
