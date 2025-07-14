# 前端登录功能测试指南

## 测试步骤

### 1. 访问前端应用
访问: http://localhost:5174

### 2. 测试未登录状态
- 应该看到：authors, books, login 按钮
- 不应该看到：add book 按钮
- 点击 authors 和 books 应该正常显示数据

### 3. 测试登录功能
- 点击 "login" 按钮
- 输入用户名：`testuser`
- 输入密码：`defaultpassword`
- 点击 "login"

### 4. 测试登录后状态
- 应该看到：authors, books, add book, logout 按钮
- 不应该看到：login 按钮

### 5. 测试添加书籍功能（需要登录）
- 点击 "add book"
- 填写表单：
  - title: "Test Book Title"
  - author: "Test Author Name"
  - published: 2024
  - genres: 添加一些类型如 "test", "programming"
- 点击 "create book"
- 应该成功添加书籍

### 6. 测试编辑作者功能（需要登录）
- 点击 "authors"
- 在 "Set birthyear" 部分：
  - 选择一个作者（如 "Sandi Metz"）
  - 输入出生年份（如 1968）
  - 点击 "update author"
- 应该成功更新作者信息

### 7. 测试登出功能
- 点击 "logout"
- 应该回到未登录状态
- 不应该再看到 "add book" 按钮

## 默认测试账户
- 用户名：testuser
- 密码：defaultpassword

## 后端服务器
- GraphQL 端点：http://localhost:4567
- Apollo Studio：http://localhost:4567

## 错误处理
- 如果未登录尝试添加书籍或编辑作者，应该显示错误消息
- 登录失败应该显示适当的错误消息
- 网络错误应该有友好的错误提示
