# Library GraphQL Backend

这是一个使用 Apollo Server 和 MongoDB 的图书馆 GraphQL 后端应用。

## 功能特性

- **Books (书籍)**:
  - 查询所有书籍
  - 按作者筛选书籍
  - 按类型筛选书籍
  - 查找特定书籍
  - 添加新书籍

- **Authors (作者)**:
  - 查询所有作者
  - 查找特定作者
  - 编辑作者信息（出生年份）
  - 自动计算作者的书籍数量

## 数据模型

### Book Schema
```
type Book {
  title: String!
  published: Int!
  author: Author!  # 现在是完整的作者对象，不只是名字
  genres: [String!]!
  id: ID!
}
```

### Author Schema
```
type Author {
  name: String!
  id: ID!
  born: Int
  bookCount: Int!  # 自动计算
}
```

## 设置和运行

1. 安装依赖:
```bash
npm install
```

2. 启动 MongoDB:
```bash
mongod --dbpath ~/data/db
```

3. 初始化数据库数据:
```bash
npm run seed
```

4. 启动开发服务器:
```bash
npm run dev
```

5. 访问 GraphQL Playground: http://localhost:4567

## GraphQL 查询示例

### 查询所有书籍
```graphql
query {
  allBooks {
    title
    published
    author {
      name
      born
    }
    genres
  }
}
```

### 按作者筛选书籍
```graphql
query {
  allBooks(author: "Robert Martin") {
    title
    published
    genres
  }
}
```

### 按类型筛选书籍
```graphql
query {
  allBooks(genre: "refactoring") {
    title
    author {
      name
    }
  }
}
```

### 查询所有作者
```graphql
query {
  allAuthors {
    name
    born
    bookCount
  }
}
```

### 添加新书籍
```graphql
mutation {
  addBook(
    title: "New Book Title"
    author: "Author Name"
    published: 2024
    genres: ["genre1", "genre2"]
  ) {
    title
    author {
      name
    }
    id
  }
}
```

### 编辑作者信息
```graphql
mutation {
  editAuthor(name: "Author Name", setBornTo: 1980) {
    name
    born
    bookCount
  }
}
```

## 技术栈

- Apollo Server
- GraphQL
- MongoDB
- Mongoose
- Node.js

## 注意事项

- 书籍的 author 字段现在返回完整的 Author 对象，而不是简单的字符串
- 添加书籍时，如果作者不存在会自动创建新作者
- bookCount 字段会自动计算每个作者的书籍数量
- 所有数据都存储在 MongoDB 数据库中
