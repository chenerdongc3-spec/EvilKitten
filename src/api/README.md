# API 层说明

## 📁 目录结构

```
src/api/
├── services/           # API 服务层
│   └── DashScopeService.ts  # 阿里云百炼 API 服务
├── types/             # TypeScript 类型定义
│   └── http.ts        # HTTP 相关类型
├── index.ts           # 统一导出
└── README.md          # 本文件
```

## 🎯 设计理念

### 1. 简洁明了
- 只保留实际使用的代码
- 避免过度封装
- 代码易于理解和学习

### 2. 类型安全
- 使用 TypeScript 严格类型
- 完整的类型定义
- 良好的代码提示

### 3. 易于扩展
- 清晰的服务层结构
- 统一的接口设计
- 方便添加新的 AI 服务

## 📝 使用示例

### 基础用法

```typescript
import { DashScopeService } from '@/api'

// 发送流式消息
await DashScopeService.sendStreamMessage(
  messages,
  {
    onChunk: (content) => {
      // 处理每个数据块
      console.log(content)
    },
    onComplete: () => {
      // 完成回调
      console.log('完成')
    },
    onError: (error) => {
      // 错误处理
      console.error(error)
    }
  }
)
```

### 在 Store 中使用

```typescript
// src/stores/chat.ts
import { DashScopeService } from '@/api'

const sendMessage = async (content: string) => {
  await DashScopeService.sendStreamMessage(
    recentMessages,
    {
      onChunk: (chunk) => {
        // 更新消息内容
        updateMessage(conversationId, messageId, chunk)
      },
      onComplete: () => {
        // 标记完成
        isLoading.value = false
      },
      onError: (error) => {
        // 显示错误
        showError(error.message)
      }
    }
  )
}
```

## 🔌 添加新的 AI 服务

### 步骤 1: 创建服务文件

在 `services/` 目录下创建新文件，例如 `OpenAIService.ts`：

```typescript
import type { StreamCallbacks } from '../types/http'
import type { Message } from '@/types'

export class OpenAIService {
  private static baseURL = 'https://api.openai.com/v1'
  private static apiKey = import.meta.env.VITE_OPENAI_API_KEY || ''
  
  static async sendStreamMessage(
    messages: Message[],
    callbacks: StreamCallbacks
  ): Promise<void> {
    // 实现流式请求逻辑
  }
}
```

### 步骤 2: 导出服务

在 `index.ts` 中添加导出：

```typescript
export { OpenAIService } from './services/OpenAIService'
```

### 步骤 3: 在 Store 中使用

```typescript
import { OpenAIService } from '@/api'

// 使用新服务
await OpenAIService.sendStreamMessage(messages, callbacks)
```

## 💡 最佳实践

### 1. 错误处理
```typescript
try {
  await DashScopeService.sendStreamMessage(messages, {
    onChunk: (chunk) => { /* ... */ },
    onError: (error) => {
      // 显示友好的错误提示
      ElMessage.error(`请求失败: ${error.message}`)
    }
  })
} catch (error) {
  console.error('发送消息失败:', error)
}
```

### 2. 超时处理
服务内部已实现 60 秒超时，无需额外处理

### 3. 取消请求
```typescript
const abortController = new AbortController()

// 在服务中使用
fetch(url, { signal: abortController.signal })

// 取消请求
abortController.abort()
```

## 📚 相关文档

- [DashScope 配置指南](../../DASHSCOPE_SETUP.md)
- [类型定义说明](./types/http.ts)
- [服务实现示例](./services/DashScopeService.ts)

## 🎓 学习要点

### 1. 原生 Fetch API
- 项目使用原生 `fetch` 而不是 axios
- 更轻量，浏览器原生支持
- 适合学习 Web API

### 2. 流式响应 (SSE)
- Server-Sent Events 实现
- 逐字显示 AI 回复
- 提升用户体验

### 3. TypeScript 类型系统
- 接口定义
- 泛型使用
- 类型推导

### 4. 异步编程
- async/await
- Promise
- 错误处理

### 5. 类的静态方法
- 无需实例化
- 统一的服务接口
- 便于管理配置
