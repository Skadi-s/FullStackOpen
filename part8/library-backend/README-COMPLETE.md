# Library GraphQL Backend - 完整版本

这是一个完整的图书馆 GraphQL 后端应用，包含用户认证、错误处理和数据验证。

## 🚀 新增功能

### 用户管理
- 用户注册 (`createUser`)
- 用户登录 (`login`)
- JWT 认证
- 当前用户查询 (`me`)

### 安全性
- 只有认证用户才能添加书籍和编辑作者
- JWT token 验证
- 密码加密存储

### 错误处理
- 数据验证错误处理
- 友好的错误消息
- GraphQL 错误规范

## 📋 数据模型

### User Schema
```graphql
type User {
  username: String!
  favouriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}
```

### 验证规则
- **书籍标题**: 最少5个字符
- **作者姓名**: 最少4个字符
- **用户名**: 最少3个字符，必须唯一
- **喜欢的类型**: 最少3个字符

## 🔧 设置和运行

1. 安装依赖:
```bash
npm install
```

2. 启动 MongoDB:
```bash
mongod --dbpath ~/data/db
```

3. 初始化数据:
```bash
npm run seed
npm run create-user
```

4. 启动服务器:
```bash
npm run dev
```

5. 访问 GraphQL Playground: http://localhost:4567

## 🔐 认证流程

### 1. 创建用户
```graphql
mutation {
  createUser(
    username: "myuser"
    favouriteGenre: "programming"
  ) {
    username
    favouriteGenre
    id
  }
}
```

### 2. 登录获取 Token
```graphql
mutation {
  login(
    username: "testuser"
    password: "defaultpassword"
  ) {
    value
  }
}
```

### 3. 在 Headers 中添加认证
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

### 4. 使用认证查询
```graphql
query {
  me {
    username
    favouriteGenre
  }
}
```

## 🔒 受保护的操作

以下操作需要有效的 JWT token：

- `addBook` - 添加新书籍
- `editAuthor` - 编辑作者信息

## ❌ 错误处理示例

### 验证错误
```graphql
# 书名太短 (少于5个字符)
mutation {
  addBook(
    title: "Bad"
    author: "Author Name"
    published: 2024
    genres: ["test"]
  ) {
    title
  }
}
```

**错误响应:**
```json
{
  "errors": [
    {
      "message": "Validation failed",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "invalidArgs": {...},
        "error": "Book validation failed: title: Path `title` (`Bad`) is shorter than the minimum allowed length (5)."
      }
    }
  ]
}
```

### 认证错误
```graphql
# 未认证时尝试添加书籍
mutation {
  addBook(
    title: "Some Book"
    author: "Some Author"
    published: 2024
    genres: ["test"]
  ) {
    title
  }
}
```

**错误响应:**
```json
{
  "errors": [
    {
      "message": "not authenticated",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

## 🧪 测试

### 运行数据库测试
```bash
npm run test-db
```

### 默认测试用户
- **用户名**: `testuser`
- **密码**: `defaultpassword`
- **喜欢的类型**: `programming`

## 📚 查询示例

### 所有查询 (无需认证)
- `allBooks` - 获取所有书籍
- `allAuthors` - 获取所有作者
- `booksCount` / `authorsCount` - 统计
- `findAuthor` / `findBook` - 查找特定项目

### 用户相关查询
- `me` - 获取当前用户 (需要认证)

### 变更操作
- `createUser` - 创建用户 (无需认证)
- `login` - 登录 (无需认证)
- `addBook` - 添加书籍 (需要认证)
- `editAuthor` - 编辑作者 (需要认证)

## 🛠️ 技术栈

- Apollo Server 4
- GraphQL
- MongoDB + Mongoose
- JWT 认证
- bcryptjs 密码加密
- Node.js

## 🔍 错误代码说明

- `UNAUTHENTICATED` - 未认证
- `BAD_USER_INPUT` - 输入验证错误
- `INTERNAL_ERROR` - 服务器内部错误
