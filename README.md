# 邪恶小猫 AI 对话应用 😼

一个具有双主题模式的 AI 对话网页应用，专为移动端设计，适合前端学习。

## 🎓 学习价值

这个项目非常适合前端学习，涵盖了现代 Web 开发的核心技术：

### 核心技术栈
- **Vue 3** - 最新的 Composition API 和 `<script setup>` 语法
- **TypeScript** - 完整的类型定义和类型安全
- **Pinia** - 现代化的状态管理
- **Element Plus** - 成熟的 UI 组件库
- **SCSS** - CSS 预处理器
- **Vite** - 快速的构建工具

### 学习要点
1. **Vue 3 Composition API** - 学习最新的 Vue 开发模式
2. **TypeScript 实践** - 理解类型系统在实际项目中的应用
3. **状态管理** - Pinia 的使用和最佳实践
4. **流式响应** - 实现 AI 对话的打字机效果
5. **本地存储** - localStorage 的使用
6. **组件化开发** - 组件拆分和复用
7. **主题切换** - CSS 变量实现主题系统
8. **API 集成** - 原生 Fetch API 的使用

## ✨ 特性

- 🎨 **双主题模式**：邪恶小猫（深色）/ 温柔模式（浅色）
- 💬 **智能对话**：支持流式响应和打字效果
- 📱 **移动优先**：完美适配移动端，支持触摸手势
- 💾 **本地存储**：对话历史自动保存
- 🎯 **话题推荐**：快速开始对话的预设话题
- ⌨️ **快捷键支持**：Enter 发送，Shift+Enter 换行

## 📁 项目结构

```
src/
├── api/                    # API 接口层
│   ├── services/          # API 服务（DashScopeService）
│   ├── types/             # TypeScript 类型定义
│   └── index.ts           # 统一导出
├── assets/                # 静态资源
│   └── styles/           # 全局样式、变量
├── components/           # 组件库
│   ├── common/          # 通用组件
│   ├── layout/          # 布局组件
│   └── features/        # 业务组件
├── composables/         # Vue 组合式函数
├── stores/              # Pinia 状态管理
│   ├── chat.ts         # 聊天状态（核心）
│   └── theme.ts        # 主题状态
├── utils/               # 工具函数
├── views/               # 页面组件
└── types/               # 全局类型定义
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

复制 `.env.example` 到 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的阿里云百炼 API Key：

```bash
VITE_DASHSCOPE_API_KEY=sk-your-api-key-here
VITE_MODEL=glm-4.7
```

获取 API Key：访问 [阿里云百炼平台](https://dashscope.aliyun.com/)

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 4. 构建生产版本

```bash
npm run build
```

## 📚 核心代码解析

### 1. 状态管理 (Pinia)

```typescript
// src/stores/chat.ts
export const useChatStore = defineStore('chat', () => {
  // 状态
  const conversations = ref<Conversation[]>([])
  const isLoading = ref(false)
  
  // 计算属性
  const activeConversation = computed(() => {
    return conversations.value.find(c => c.id === activeConversationId.value)
  })
  
  // 方法
  const sendMessage = async (content: string) => {
    // 发送消息逻辑
  }
  
  return { conversations, isLoading, sendMessage }
})
```

### 2. 流式响应

```typescript
// src/api/services/DashScopeService.ts
await DashScopeService.sendStreamMessage(
  messages,
  {
    onChunk: (content) => {
      // 每次收到一小段文本时调用
      updateMessage(content)
    },
    onComplete: () => {
      // 完成时调用
      isLoading.value = false
    },
    onError: (error) => {
      // 错误处理
      console.error(error)
    }
  }
)
```

### 3. 主题切换

```typescript
// src/stores/theme.ts
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'evil' ? 'gentle' : 'evil'
  document.documentElement.setAttribute('data-theme', currentTheme.value)
}
```

## 🎯 学习路径

### 初级（1-2 周）
1. 理解项目结构和文件组织
2. 学习 Vue 3 Composition API 基础
3. 了解 TypeScript 类型定义
4. 掌握组件的使用和传参

### 中级（2-3 周）
1. 深入理解 Pinia 状态管理
2. 学习流式响应的实现原理
3. 掌握 CSS 变量和主题切换
4. 理解本地存储的使用

### 高级（3-4 周）
1. 优化性能（虚拟滚动、懒加载）
2. 添加新功能（语音输入、图片上传）
3. 集成其他 AI 服务
4. 部署到生产环境

## 📖 详细文档

- [DashScope 配置指南](./DASHSCOPE_SETUP.md) - API 配置详解
- [快速开始指南](./QUICK_START.md) - 详细的安装步骤
- [API 层说明](./src/api/README.md) - API 架构和使用
- [部署指南](./DEPLOYMENT.md) - 生产环境部署

## 💡 代码规范

### 命名规范
- 组件：PascalCase（如 `ChatView.vue`）
- 文件：kebab-case（如 `chat-view.vue`）
- 变量/函数：camelCase（如 `sendMessage`）
- 常量：UPPER_CASE（如 `API_BASE_URL`）

### 注释规范
- 所有函数都有 JSDoc 注释
- 复杂逻辑有行内注释
- 类型定义有说明注释

### TypeScript 规范
- 严格模式
- 完整的类型定义
- 避免使用 `any`

## 🔧 开发技巧

### 1. 调试
```typescript
// 在浏览器控制台查看状态
const chatStore = useChatStore()
console.log(chatStore.conversations)
```

### 2. 热重载
修改代码后自动刷新，无需手动刷新浏览器

### 3. TypeScript 类型检查
```bash
npm run type-check
```

## 🐛 常见问题

### Q: API Key 在哪里配置？
A: 在 `.env.local` 文件中配置 `VITE_DASHSCOPE_API_KEY`

### Q: 如何切换模型？
A: 修改 `.env.local` 中的 `VITE_MODEL` 变量

### Q: 为什么没有回复？
A: 检查：
1. API Key 是否正确
2. 网络连接是否正常
3. 浏览器控制台是否有错误

### Q: 如何清除对话历史？
A: 在浏览器控制台执行：
```javascript
localStorage.clear()
location.reload()
```

## 🎓 推荐学习资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/zh/)
- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- [Element Plus 官方文档](https://element-plus.org/zh-CN/)
- [阿里云百炼文档](https://help.aliyun.com/zh/model-studio/)

## 📝 待实现功能

- [ ] 用户设置页面
- [ ] 关于页面
- [ ] 消息编辑和删除
- [ ] 对话导出功能
- [ ] 语音输入支持
- [ ] 图片上传支持
- [ ] 多语言支持

## 📄 许可证

MIT

## 👨‍💻 适合人群

- 前端初学者（有 HTML/CSS/JavaScript 基础）
- 想学习 Vue 3 的开发者
- 想了解 AI 应用开发的学生
- 想学习现代前端工程化的开发者

## 🎉 开始学习

1. Fork 这个项目
2. 按照快速开始指南配置环境
3. 阅读代码注释理解实现
4. 尝试修改和添加新功能
5. 遇到问题查看文档或提 Issue

祝你学习愉快！🚀
