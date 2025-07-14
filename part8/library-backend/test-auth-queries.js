// GraphQL 测试查询 - 包含用户管理和错误处理
// 在 Apollo Server Studio (http://localhost:4567) 中使用这些查询

// 1. 创建新用户
const createUserMutation = `
  mutation {
    createUser(
      username: "newuser"
      favouriteGenre: "sci-fi"
    ) {
      username
      favouriteGenre
      id
    }
  }
`

// 2. 用户登录
const loginMutation = `
  mutation {
    login(
      username: "testuser"
      password: "defaultpassword"
    ) {
      value
    }
  }
`

// 3. 获取当前用户信息 (需要在 Headers 中添加 Authorization: Bearer <token>)
const meQuery = `
  query {
    me {
      username
      favouriteGenre
      id
    }
  }
`

// Headers 格式 (在 Apollo Studio 中添加):
// {
//   "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
// }

// 4. 添加书籍 (需要认证)
const addBookMutationAuth = `
  mutation {
    addBook(
      title: "Test Book"
      author: "Test Author"
      published: 2024
      genres: ["test", "programming"]
    ) {
      title
      published
      author {
        name
      }
      genres
      id
    }
  }
`

// 5. 编辑作者 (需要认证)
const editAuthorMutationAuth = `
  mutation {
    editAuthor(name: "Test Author", setBornTo: 1980) {
      name
      born
      bookCount
    }
  }
`

// 6. 测试验证错误 - 书名太短
const addBookValidationError = `
  mutation {
    addBook(
      title: "Bad"
      author: "Some Author"
      published: 2024
      genres: ["test"]
    ) {
      title
    }
  }
`

// 7. 测试验证错误 - 作者名太短
const addBookAuthorValidationError = `
  mutation {
    addBook(
      title: "Valid Book Title"
      author: "AB"
      published: 2024
      genres: ["test"]
    ) {
      title
    }
  }
`

// 8. 测试用户名太短的验证错误
const createUserValidationError = `
  mutation {
    createUser(
      username: "ab"
      favouriteGenre: "test"
    ) {
      username
    }
  }
`

// 9. 测试重复用户名错误
const createDuplicateUser = `
  mutation {
    createUser(
      username: "testuser"
      favouriteGenre: "test"
    ) {
      username
    }
  }
`

// 10. 测试无效登录
const invalidLogin = `
  mutation {
    login(
      username: "wronguser"
      password: "wrongpassword"
    ) {
      value
    }
  }
`

console.log('使用步骤:')
console.log('1. 首先运行 login mutation 获取 token')
console.log('2. 在 Apollo Studio 的 Headers 中添加: {"Authorization": "Bearer <your-token>"}')
console.log('3. 然后可以运行需要认证的 mutations (addBook, editAuthor)')
console.log('4. 测试各种验证错误场景')

// 预期的错误响应格式:
// {
//   "errors": [
//     {
//       "message": "Validation failed",
//       "extensions": {
//         "code": "BAD_USER_INPUT",
//         "invalidArgs": {...},
//         "error": "..."
//       }
//     }
//   ]
// }
