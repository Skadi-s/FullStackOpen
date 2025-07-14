const mongoose = require('mongoose')
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')

const authors = [
  {
    name: 'Robert Martin',
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
    name: 'Joshua Kerievsky', // birthyear not known
  },
  { 
    name: 'Sandi Metz', // birthyear not known
  },
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution']
  },
]

const seedDatabase = async () => {
  try {
    console.log('connecting to', process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to MongoDB')

    // 清空现有数据
    await Author.deleteMany({})
    await Book.deleteMany({})
    console.log('cleared existing data')

    // 插入作者
    const authorObjects = authors.map(author => new Author(author))
    const savedAuthors = await Author.insertMany(authorObjects)
    console.log('authors saved')

    // 创建作者名称到ID的映射
    const authorMap = {}
    savedAuthors.forEach(author => {
      authorMap[author.name] = author._id
    })

    // 插入书籍
    const bookObjects = books.map(book => new Book({
      ...book,
      author: authorMap[book.author]
    }))
    await Book.insertMany(bookObjects)
    console.log('books saved')

    console.log('Database seeded successfully')
    mongoose.connection.close()
  } catch (error) {
    console.error('Error seeding database:', error)
    mongoose.connection.close()
  }
}

seedDatabase()
