# Library Application - 前端登录功能

## 🚀 已实现的功能

### 认证系统
- ✅ 用户登录界面
- ✅ JWT token 管理
- ✅ 本地存储 token
- ✅ 自动认证状态检查
- ✅ 登出功能

### 状态管理
- ✅ 未登录状态：显示 authors, books, login 按钮
- ✅ 已登录状态：显示 authors, books, add book, logout 按钮
- ✅ 根据登录状态动态显示UI

### 受保护的功能
- ✅ 添加书籍（需要登录）
- ✅ 编辑作者信息（需要登录）
- ✅ 自动处理认证错误

### Apollo Client 配置
- ✅ 自动在请求中添加 Authorization header
- ✅ 从 localStorage 读取 token
- ✅ 连接到正确的后端端点 (localhost:4567)

## 🔧 技术实现

### 1. Apollo Client 认证配置 (main.jsx)
```javascript
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})
```

### 2. 登录组件 (LoginForm.jsx)
- 处理用户凭据
- 发送登录 mutation
- 保存 JWT token 到 localStorage
- 错误处理

### 3. 状态管理 (App.jsx)
- 管理登录状态
- 动态导航菜单
- 持久化登录状态

### 4. 错误处理
- 网络错误友好提示
- 认证失败处理
- 表单验证

## 🔐 认证流程

1. **初始状态检查**：应用启动时从 localStorage 检查是否有保存的 token
2. **登录过程**：用户输入凭据 → 发送登录请求 → 保存返回的 token
3. **自动认证**：所有 GraphQL 请求自动包含 Authorization header
4. **登出过程**：清除 localStorage 和内存中的 token

## 🎮 使用指南

### 启动应用
```bash
# 启动后端
cd library-backend
PORT=4567 npm run dev

# 启动前端
cd library-frontend
npm run dev
```

### 访问地址
- 前端：http://localhost:5174
- 后端：http://localhost:4567

### 测试账户
- 用户名：`testuser`
- 密码：`defaultpassword`

### 测试步骤
1. 访问前端应用
2. 点击 "login" 按钮
3. 输入测试账户信息
4. 登录后可以使用 "add book" 和编辑作者功能
5. 点击 "logout" 退出

## 📱 UI 界面

### 未登录状态
```
[authors] [books] [login]
```

### 已登录状态
```
[authors] [books] [add book] [logout]
```

## 🛠️ 技术栈

- **前端**：React + Vite + Apollo Client
- **后端**：Apollo Server + GraphQL + MongoDB
- **认证**：JWT tokens
- **状态管理**：React useState + localStorage

## ✨ 核心特性

- 🔒 安全的 JWT 认证
- 🔄 自动 token 管理
- 📱 响应式 UI 状态
- ⚡ 实时错误处理
- 💾 持久化登录状态
- 🎯 基于角色的功能访问

所有功能都已完整实现并经过测试！
