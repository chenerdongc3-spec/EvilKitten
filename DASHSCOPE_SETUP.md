# 阿里云百炼 API 配置指南

## 📋 概述

本项目已集成阿里云百炼（DashScope）API，支持 GLM-4.7 等多个模型。

## 🔑 获取 API Key

### 步骤 1: 注册阿里云账号
访问 [阿里云百炼平台](https://dashscope.aliyun.com/)

### 步骤 2: 开通服务
1. 登录后进入控制台
2. 开通"百炼大模型服务"
3. 选择你需要的模型（如 GLM-4.7）

### 步骤 3: 获取 API Key
1. 进入 API Key 管理页面
2. 创建新的 API Key
3. 复制 API Key（格式：`sk-xxx`）

## ⚙️ 配置项目

### 1. 配置环境变量

编辑 `.env.local` 文件：

```bash
# 阿里云百炼 API 配置
VITE_DASHSCOPE_API_KEY=sk-your-api-key-here
VITE_MODEL=glm-4.7
```

**重要**: 
- 将 `sk-your-api-key-here` 替换为你的真实 API Key
- 不要将 `.env.local` 提交到 Git

### 2. 可用模型

阿里云百炼支持多个模型：

```bash
# GLM-4.7 (智谱 AI)
VITE_MODEL=glm-4.7

# 通义千问系列
VITE_MODEL=qwen-plus
VITE_MODEL=qwen-turbo
VITE_MODEL=qwen-max
VITE_MODEL=qwen-long

# 其他模型
VITE_MODEL=llama3-70b-instruct
VITE_MODEL=moonshot-v1-8k
```

## 🚀 启动项目

```bash
# 1. 确保已安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问
# http://localhost:5173
```

## ✨ 特性

### 1. 流式响应
- 实时逐字显示 AI 回复
- 流畅的打字效果

### 2. 思考模式
- GLM-4.7 支持思考模式（`enable_thinking: true`）
- 思考过程在控制台输出，不显示给用户
- 只显示最终回复内容

### 3. Token 统计
- 自动统计 token 使用量
- 在控制台查看详细信息

## 🔍 测试 API

### 方法 1: 使用应用测试
1. 启动开发服务器
2. 在聊天界面发送消息
3. 查看 AI 回复

### 方法 2: 使用 curl 测试
```bash
curl -X POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "glm-4.7",
    "messages": [{"role": "user", "content": "你好"}],
    "stream": true,
    "enable_thinking": true
  }'
```

### 方法 3: 使用 Node.js 测试
创建 `test-api.js`：

```javascript
import fetch from 'node-fetch'

const apiKey = 'sk-your-api-key-here'
const baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'

async function test() {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'glm-4.7',
      messages: [{ role: 'user', content: '你好' }],
      stream: false,
    }),
  })

  const data = await response.json()
  console.log(data)
}

test()
```

## 🐛 常见问题

### 1. API Key 无效
**错误**: `401 Unauthorized`

**解决方案**:
- 检查 API Key 是否正确
- 确保 API Key 已激活
- 检查是否有足够的额度

### 2. 模型不可用
**错误**: `400 Bad Request - model not found`

**解决方案**:
- 检查模型名称是否正确
- 确认已开通该模型的使用权限
- 查看[模型列表](https://help.aliyun.com/zh/model-studio/getting-started/models)

### 3. 请求超时
**错误**: `请求超时`

**解决方案**:
- 检查网络连接
- 增加超时时间（在 `DashScopeService.ts` 中修改）
- 减少消息历史长度

### 4. CORS 错误
**错误**: `CORS policy blocked`

**解决方案**:
阿里云百炼 API 支持跨域，如果遇到 CORS 问题：
1. 检查 API Key 是否正确
2. 确保使用 HTTPS
3. 查看浏览器控制台的详细错误

### 5. 流式响应不工作
**症状**: 消息一次性显示，没有打字效果

**解决方案**:
- 检查 `stream: true` 是否设置
- 查看控制台是否有错误
- 确认网络支持 SSE (Server-Sent Events)

## 💰 费用说明

### 计费方式
- 按 token 使用量计费
- 不同模型价格不同
- 查看[价格详情](https://help.aliyun.com/zh/model-studio/developer-reference/billing-instructions)

### 节省费用技巧
1. **限制消息历史**: 只发送最近 10 条消息
2. **选择合适的模型**: 
   - `qwen-turbo` - 便宜快速
   - `qwen-plus` - 平衡性价比
   - `glm-4.7` - 高质量但较贵
3. **优化提示词**: 简洁明确的提示词可以减少 token 消耗

## 🔧 高级配置

### 1. 自定义超时时间

编辑 `src/api/services/DashScopeService.ts`：

```typescript
const timeoutId = setTimeout(() => {
  abortController.abort()
}, 60000) // 改为你需要的时间（毫秒）
```

### 2. 调整消息历史长度

编辑 `src/stores/chat.ts`：

```typescript
// 获取对话历史（最近 10 条消息）
const recentMessages = conversation.messages.slice(-10) // 改为你需要的数量
```

### 3. 禁用思考模式

编辑 `src/api/services/DashScopeService.ts`：

```typescript
body: JSON.stringify({
  model: this.model,
  messages: formattedMessages,
  stream: true,
  enable_thinking: false, // 改为 false
  // ...
})
```

### 4. 添加系统提示词

编辑 `src/stores/chat.ts`，在发送消息前添加系统消息：

```typescript
const recentMessages = [
  { role: 'system', content: '你是一个友好的 AI 助手' },
  ...conversation.messages.slice(-10)
]
```

## 📊 监控和调试

### 查看 API 调用日志
打开浏览器开发者工具（F12）→ Console 标签

你会看到：
- `AI 思考:` - 思考过程（仅 GLM-4.7）
- `开始回复...` - 开始生成回复
- `Token 使用:` - Token 统计信息

### 查看网络请求
开发者工具 → Network 标签 → 筛选 `chat/completions`

检查：
- 请求 URL
- 请求头（Authorization）
- 请求体（messages）
- 响应状态码
- 响应内容

## 🎯 最佳实践

1. **保护 API Key**
   - 不要在代码中硬编码
   - 不要提交到 Git
   - 使用环境变量

2. **错误处理**
   - 显示友好的错误提示
   - 记录详细的错误日志
   - 提供重试机制

3. **性能优化**
   - 限制消息历史长度
   - 使用流式响应
   - 合理设置超时时间

4. **用户体验**
   - 显示加载状态
   - 实时显示回复
   - 提供清晰的错误提示

## 📚 相关资源

- [阿里云百炼官网](https://dashscope.aliyun.com/)
- [API 文档](https://help.aliyun.com/zh/model-studio/developer-reference/api-details)
- [模型列表](https://help.aliyun.com/zh/model-studio/getting-started/models)
- [价格说明](https://help.aliyun.com/zh/model-studio/developer-reference/billing-instructions)

## 🎉 开始使用

1. ✅ 获取 API Key
2. ✅ 配置 `.env.local`
3. ✅ 启动开发服务器
4. ✅ 发送第一条消息

现在你可以开始与 AI 对话了！🚀
