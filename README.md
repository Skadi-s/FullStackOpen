# Full Stack Open

This repository contains my solutions for the Full Stack Open course offered by the University of Helsinki.

[Full Stack Open](https://fullstackopen.com/)

## 课程进度

| Part   | 主题                                | 完成状态 | 描述 |
| ------ | ----------------------------------- | -------- | ---- |
| Part 0 | Fundamentals of Web Apps           | ✅       | Web 应用程序基础 |
| Part 1 | Introduction to React              | ✅       | React 基础、组件、事件处理 |
| Part 2 | Communicating with server          | ✅       | 表单、服务器通信、CSS |
| Part 3 | Programming a server with NodeJS   | ✅       | Node.js、Express、MongoDB |
| Part 4 | Testing Express servers            | ✅       | 后端测试、用户管理、Token 认证 |
| Part 5 | Testing React apps                 | ✅       | React 测试、登录功能、Cypress E2E |
| Part 6 | State management with Redux        | 🔄       | Redux、状态管理 |
| Part 7 | React router, custom hooks, styling| ⏳       | 路由、自定义钩子、样式库 |
| Part 8 | GraphQL                            | ⏳       | GraphQL、Apollo |
| Part 9 | TypeScript                         | ⏳       | TypeScript 基础 |

## 项目结构

```
├── part0/                    # Web 应用基础
│   ├── Exercise0.4.md       # 新便签图表
│   ├── Exercise0.5.md       # SPA 图表
│   └── Exercise0.6.md       # 新便签 SPA 图表
├── part1/                    # React 基础
│   ├── courseinfo/          # 课程信息
│   ├── unicafe/             # 独角兽咖啡厅反馈
│   ├── anecdotes/           # 轶事投票
│   └── counter/             # 计数器示例
├── part2/                    # 服务器通信
│   ├── courseinfo/          # 扩展课程信息
│   ├── phonebook/           # 电话簿应用
│   └── countries/           # 国家信息查询
├── part3/                    # Node.js 后端
│   └── PhonebookBackend/    # 电话簿后端 API
├── part4/                    # 后端测试
│   └── bloglist/            # 博客列表后端
├── part5/                    # React 测试
│   └── bloglist-frontend/   # 博客列表前端
├── part6/                    # Redux 状态管理
│   └── unicafe-redux/       # Redux 版独角兽咖啡厅
└── README.md
```

## 技术栈

### 前端
- **React** - 用户界面库
- **Vite** - 构建工具
- **Redux** - 状态管理
- **Axios** - HTTP 客户端
- **React Testing Library** - 单元测试
- **Cypress** - E2E 测试

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 框架
- **MongoDB** - 数据库
- **Mongoose** - MongoDB ODM
- **JWT** - 身份验证
- **Jest** - 测试框架
- **Supertest** - API 测试

## 主要项目介绍

### Part 2-3: 电话簿应用
完整的全栈应用，包含 CRUD 操作、数据验证和错误处理。
- 前端：React + Axios
- 后端：Express + MongoDB
- 功能：添加、删除、搜索联系人

### Part 4-5: 博客列表应用
包含用户认证的博客管理系统。
- 前端：React + JWT 认证
- 后端：Express + MongoDB + JWT
- 测试：Jest + React Testing Library + Cypress
- 功能：用户注册/登录、创建/删除博客、点赞

### Part 6: Redux 状态管理
使用 Redux 重构应用状态管理。
- Redux store 设计
- Action creators 和 reducers
- 状态管理最佳实践

## 运行项目

### 前端项目
```bash
cd part*/project-name
npm install
npm run dev
```

### 后端项目
```bash
cd part*/project-name
npm install
npm start
```

### 运行测试
```bash
# 单元测试
npm test

# E2E 测试 (Cypress)
npm run cypress:open
```

## 学习收获

- ✅ React 组件开发和状态管理
- ✅ Node.js/Express 后端开发
- ✅ MongoDB 数据库操作
- ✅ RESTful API 设计
- ✅ 用户认证和授权 (JWT)
- ✅ 前后端测试策略
- 🔄 Redux 状态管理模式
- ⏳ GraphQL 和 TypeScript

## 环境要求

- Node.js (>= 16.x)
- npm (>= 8.x)
- MongoDB (>= 5.x)

## 证书

完成课程后将获得赫尔辛基大学颁发的证书。
