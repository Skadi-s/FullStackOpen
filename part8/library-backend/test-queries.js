// GraphQL 查询测试
// 你可以在 Apollo Server Studio (http://localhost:4567) 中使用这些查询

// 1. 获取所有书籍
const allBooksQuery = `
  query {
    allBooks {
      title
      published
      author {
        name
        born
      }
      genres
      id
    }
  }
`

// 2. 获取所有作者
const allAuthorsQuery = `
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

// 3. 按作者筛选书籍
const booksByAuthorQuery = `
  query {
    allBooks(author: "Robert Martin") {
      title
      published
      author {
        name
      }
      genres
    }
  }
`

// 4. 按类型筛选书籍
const booksByGenreQuery = `
  query {
    allBooks(genre: "refactoring") {
      title
      author {
        name
      }
      genres
    }
  }
`

// 5. 获取书籍和作者数量
const countsQuery = `
  query {
    booksCount
    authorsCount
  }
`

// 6. 查找特定作者
const findAuthorQuery = `
  query {
    findAuthor(name: "Robert Martin") {
      name
      born
      bookCount
    }
  }
`

// 7. 查找特定书籍
const findBookQuery = `
  query {
    findBook(title: "Clean Code") {
      title
      published
      author {
        name
        born
      }
      genres
    }
  }
`

// 8. 添加新书籍 (变更)
const addBookMutation = `
  mutation {
    addBook(
      title: "The Clean Coder"
      author: "Robert Martin"
      published: 2011
      genres: ["professional", "career"]
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

// 9. 添加新作者的书籍 (变更)
const addBookWithNewAuthorMutation = `
  mutation {
    addBook(
      title: "JavaScript: The Good Parts"
      author: "Douglas Crockford"
      published: 2008
      genres: ["javascript", "programming"]
    ) {
      title
      published
      author {
        name
        born
      }
      genres
      id
    }
  }
`

// 10. 编辑作者信息 (变更)
const editAuthorMutation = `
  mutation {
    editAuthor(name: "Joshua Kerievsky", setBornTo: 1966) {
      name
      born
      bookCount
    }
  }
`

console.log('GraphQL 测试查询和变更已准备好')
console.log('访问 http://localhost:4567 来测试这些查询')
