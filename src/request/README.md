# Request 目录说明

这个目录包含项目的 HTTP 请求相关代码，用于前后端交互。

## 📁 文件说明

### 1. `http.ts` - Axios 二次封装

对 axios 进行二次封装，提供统一的请求处理。

#### 核心功能

1. **请求拦截器**
   - 自动添加 Token
   - 显示 Loading
   - 打印请求日志

2. **响应拦截器**
   - 统一处理响应数据
   - 错误处理和提示
   - Token 过期处理

3. **Loading 管理**
   - 自动显示/隐藏 Loading
   - 支持多个请求同时进行

4. **错误处理**
   - HTTP 状态码处理
   - 业务错误码处理
   - 友好的错误提示

#### 使用示例

```typescript
import request from '@/request/http'

// GET 请求
const users = await request.get('/users')

// POST 请求
const result = await request.post('/login', {
  username: 'admin',
  password: '123456'
})

// 自定义配置
const data = await request.get('/users', {}, {
  showLoading: true,    // 显示 loading
  showError: true,      // 显示错误提示
  showSuccess: true,    // 显示成功提示
  successMsg: '操作成功'
})
```

### 2. `api.ts` - API 接口管理

统一管理所有 API 接口，便于维护和复用。

#### 接口分类

1. **用户相关**
   - `userLogin` - 用户登录
   - `userRegister` - 用户注册
   - `getUserInfo` - 获取用户信息
   - `userLogout` - 退出登录

2. **对话相关**
   - `getConversationList` - 获取对话列表
   - `getConversationDetail` - 获取对话详情
   - `createConversation` - 创建新对话
   - `deleteConversation` - 删除对话
   - `updateConversationTitle` - 更新对话标题

3. **消息相关**
   - `sendMessage` - 发送消息
   - `deleteMessage` - 删除消息

4. **文件上传**
   - `uploadFile` - 上传文件

#### 使用示例

```typescript
import { userLogin, getConversationList } from '@/request/api'

// 登录
const { token, userInfo } = await userLogin({
  username: 'admin',
  password: '123456'
})

// 获取对话列表
const conversations = await getConversationList()
```

## 🎯 设计理念

### 1. 统一管理
- 所有 API 接口集中在 `api.ts` 中
- 便于查找和维护
- 避免重复代码

### 2. 类型安全
- 完整的 TypeScript 类型定义
- 请求参数类型检查
- 响应数据类型推导

### 3. 易于使用
- 简洁的 API 调用方式
- 自动处理 Loading 和错误
- 支持自定义配置

### 4. 可扩展性
- 易于添加新的 API
- 支持自定义拦截器
- 灵活的配置选项

## 📚 完整使用流程

### 步骤 1: 定义接口类型

在 `api.ts` 中定义请求和响应的类型：

```typescript
// 定义请求参数类型
export interface LoginParams {
  username: string
  password: string
}

// 定义响应数据类型
export interface LoginResponse {
  token: string
  userInfo: UserInfo
}
```

### 步骤 2: 创建 API 函数

```typescript
export const userLogin = (data: LoginParams) => {
  return request.post<LoginResponse>('/user/login', data, {
    showLoading: true,
    showError: true
  })
}
```

### 步骤 3: 在组件中使用

```typescript
import { userLogin } from '@/request/api'

const handleLogin = async () => {
  try {
    const { token, userInfo } = await userLogin({
      username: username.value,
      password: password.value
    })
    
    // 保存 token
    localStorage.setItem('token', token)
    
    // 跳转到首页
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
  }
}
```

## 🔧 配置说明

### 环境变量配置

在 `.env.local` 中配置 API 基础地址：

```bash
# API 基础地址
VITE_API_BASE_URL=http://localhost:3000/api
```

### 请求配置选项

```typescript
interface RequestConfig {
  showLoading?: boolean      // 是否显示 loading（默认 true）
  showError?: boolean        // 是否显示错误提示（默认 true）
  showSuccess?: boolean      // 是否显示成功提示（默认 false）
  successMsg?: string        // 成功提示文案
}
```

### 响应数据格式

后端 API 应返回统一的数据格式：

```typescript
{
  code: 200,           // 状态码（200 表示成功）
  data: {},           // 响应数据
  message: '操作成功'  // 提示信息
}
```

## 🎓 学习要点

### 1. Axios 拦截器

**请求拦截器**：在请求发送前执行
```typescript
service.interceptors.request.use(
  (config) => {
    // 添加 token
    config.headers.Authorization = `Bearer ${token}`
    return config
  }
)
```

**响应拦截器**：在收到响应后执行
```typescript
service.interceptors.response.use(
  (response) => {
    // 处理响应数据
    return response.data
  },
  (error) => {
    // 处理错误
    return Promise.reject(error)
  }
)
```

### 2. TypeScript 泛型

使用泛型指定响应数据类型：

```typescript
// 定义泛型函数
get<T = any>(url: string): Promise<T>

// 使用时指定类型
const users = await request.get<User[]>('/users')
// users 的类型是 User[]
```

### 3. Promise 和 async/await

```typescript
// Promise 方式
request.get('/users')
  .then(data => console.log(data))
  .catch(error => console.error(error))

// async/await 方式（推荐）
try {
  const data = await request.get('/users')
  console.log(data)
} catch (error) {
  console.error(error)
}
```

### 4. 错误处理

```typescript
try {
  const data = await request.get('/users')
} catch (error) {
  if (error.response) {
    // 服务器返回了错误状态码
    console.log(error.response.status)
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    console.log('网络错误')
  } else {
    // 请求配置出错
    console.log(error.message)
  }
}
```

## 💡 最佳实践

### 1. API 命名规范

```typescript
// ✅ 好的命名
getUserInfo()        // 获取用户信息
createConversation() // 创建对话
deleteMessage()      // 删除消息

// ❌ 不好的命名
getInfo()           // 不明确
create()            // 不明确
del()               // 缩写不清晰
```

### 2. 类型定义

```typescript
// ✅ 定义清晰的类型
interface LoginParams {
  username: string
  password: string
}

// ❌ 使用 any
const login = (data: any) => { }
```

### 3. 错误处理

```typescript
// ✅ 在组件中处理错误
try {
  await userLogin(data)
} catch (error) {
  // 处理错误
}

// ❌ 不处理错误
await userLogin(data)  // 可能导致未捕获的错误
```

### 4. Loading 状态

```typescript
// ✅ 自动 loading
await request.get('/users', {}, {
  showLoading: true
})

// ✅ 手动 loading（复杂场景）
const loading = ref(false)
loading.value = true
try {
  await request.get('/users', {}, {
    showLoading: false
  })
} finally {
  loading.value = false
}
```

## 🔍 调试技巧

### 1. 查看请求日志

在开发环境下，所有请求都会在控制台打印：

```
📤 请求: GET /users { id: 1 }
📥 响应: /users { code: 200, data: [...] }
```

### 2. 使用浏览器开发者工具

1. 打开 Network 标签
2. 查看请求详情
3. 检查请求头、响应数据

### 3. 模拟 API 响应

在开发时可以使用 Mock 数据：

```typescript
// 开发环境使用 mock
if (import.meta.env.DEV) {
  return Promise.resolve(mockData)
}

// 生产环境调用真实 API
return request.get('/users')
```

## 📖 相关文档

- [Axios 官方文档](https://axios-http.com/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Element Plus 官方文档](https://element-plus.org/)

## 🎯 注意事项

### 当前项目状态

⚠️ **重要提示**：当前项目使用的是阿里云百炼 API（DashScope），不是传统的 RESTful API。

- `src/api/services/DashScopeService.ts` - 使用原生 `fetch` 调用 AI API
- `src/request/` - 为未来的后端 API 预留（用户系统、对话管理等）

### 何时使用

- **使用 `request`**：调用自己的后端 API（用户登录、数据管理等）
- **使用 `DashScopeService`**：调用 AI 对话 API

### 未来扩展

当你需要添加后端功能时（如用户系统），可以：

1. 在 `api.ts` 中定义接口
2. 使用 `request` 调用后端 API
3. 在组件中使用定义好的 API 函数

## 🎉 总结

这个 request 目录提供了：

- ✅ 完整的 Axios 二次封装
- ✅ 统一的 API 管理
- ✅ 类型安全的接口定义
- ✅ 友好的错误处理
- ✅ 详细的使用文档

非常适合学习前后端交互！🚀
