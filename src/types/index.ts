// 全局类型定义

// 主题类型
export type ThemeMode = 'evil' | 'gentle'

// 消息角色
export type MessageRole = 'user' | 'assistant'

// 消息接口
export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  isStreaming?: boolean
  reasoningContent?: string  // AI 思考过程（仅 assistant 消息）
}

// 对话接口
export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

// 主题配置接口
export interface ThemeConfig {
  mode: ThemeMode
  colors: {
    primary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
  }
}

// 用户设置接口
export interface UserSettings {
  theme: ThemeMode
  fontSize: number
  enableSound: boolean
}

// 话题推荐接口
export interface TopicSuggestion {
  id: string
  text: string
  category?: string
}
