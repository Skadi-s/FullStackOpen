const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

// 初始作者数据
const authorsData = [
  {
    name: 'Robert C. Martin',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    born: 1821
  },
  {
    name: 'Joshua Kerievsky',
    born: 1971
  },
  {
    name: 'Sandi Metz',
    born: 1956
  },
  {
    name: 'Kent Beck',
    born: 1961
  },
  {
    name: 'Eric Evans',
    born: 1962
  },
  {
    name: 'Gang of Four',
    born: null
  }
]

// 初始书籍数据（使用作者名称，稍后会替换为 ObjectId）
const booksData = [
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    published: 2008,
    author: 'Robert C. Martin',
    genres: ['refactoring', 'programming', 'clean code']
  },
  {
    title: 'Agile Software Development: Principles, Patterns, and Practices',
    published: 2002,
    author: 'Robert C. Martin',
    genres: ['agile', 'patterns', 'design', 'programming']
  },
  {
    title: 'Refactoring: Improving the Design of Existing Code',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring', 'programming', 'design']
  },
  {
    title: 'Refactoring to Patterns',
    published: 2004,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns', 'design']
  },
  {
    title: 'Practical Object-Oriented Design: An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design', 'ruby', 'oop']
  },
  {
    title: 'Crime and Punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime', 'literature']
  },
  {
    title: 'The Brothers Karamazov',
    published: 1880,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'philosophy', 'literature']
  },
  {
    title: 'Test Driven Development: By Example',
    published: 2002,
    author: 'Kent Beck',
    genres: ['testing', 'tdd', 'programming', 'agile']
  },
  {
    title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
    published: 2003,
    author: 'Eric Evans',
    genres: ['ddd', 'design', 'architecture', 'programming']
  },
  {
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    published: 1994,
    author: 'Gang of Four',
    genres: ['patterns', 'design', 'oop', 'programming']
  }
]

// 初始用户数据
const usersData = [
  {
    username: 'admin',
    favouriteGenre: 'programming',
    password: 'admin123'
  },
  {
    username: 'testuser',
    favouriteGenre: 'classic',
    password: 'test123'
  },
  {
    username: 'developer',
    favouriteGenre: 'refactoring',
    password: 'dev123'
  }
]

const initializeDatabase = async () => {
  try {
    console.log('连接到 MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('连接成功！')

    // 清空现有数据
    console.log('清空现有数据...')
    await Author.deleteMany({})
    await Book.deleteMany({})
    await User.deleteMany({})
    console.log('数据清空完成')

    // 插入作者数据
    console.log('插入作者数据...')
    const authors = await Author.insertMany(authorsData)
    console.log(`插入了 ${authors.length} 个作者`)

    // 创建作者名称到 ObjectId 的映射
    const authorMap = {}
    authors.forEach(author => {
      authorMap[author.name] = author._id
    })

    // 插入书籍数据（替换作者名称为 ObjectId）
    console.log('插入书籍数据...')
    const booksWithAuthorIds = booksData.map(book => ({
      ...book,
      author: authorMap[book.author]
    }))
    
    const books = await Book.insertMany(booksWithAuthorIds)
    console.log(`插入了 ${books.length} 本书籍`)

    // 插入用户数据（加密密码）
    console.log('插入用户数据...')
    const saltRounds = 10
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (user) => ({
        username: user.username,
        favouriteGenre: user.favouriteGenre,
        passwordHash: await bcrypt.hash(user.password, saltRounds)
      }))
    )
    
    const users = await User.insertMany(usersWithHashedPasswords)
    console.log(`插入了 ${users.length} 个用户`)

    console.log('\\n数据库初始化完成！')
    console.log('\\n可用的用户账户:')
    usersData.forEach(user => {
      console.log(`- 用户名: ${user.username}, 密码: ${user.password}, 喜欢的类型: ${user.favouriteGenre}`)
    })

    console.log('\\n插入的作者:')
    authors.forEach(author => {
      console.log(`- ${author.name} (${author.born || '未知'})`)
    })

    console.log('\\n插入的书籍:')
    books.forEach(book => {
      const authorName = authorsData.find(a => authorMap[a.name].toString() === book.author.toString())?.name
      console.log(`- ${book.title} by ${authorName} (${book.published})`)
    })

  } catch (error) {
    console.error('初始化数据库时出错:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\\n数据库连接已关闭')
  }
}

// 运行初始化脚本
initializeDatabase()
