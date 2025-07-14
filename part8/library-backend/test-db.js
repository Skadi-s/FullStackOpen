const mongoose = require('mongoose')
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')

const testDatabase = async () => {
  try {
    console.log('connecting to', process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to MongoDB')

    // 测试查询作者
    const authors = await Author.find({})
    console.log(`Found ${authors.length} authors:`)
    authors.forEach(author => {
      console.log(`- ${author.name} (born: ${author.born})`)
    })

    // 测试查询书籍
    const books = await Book.find({}).populate('author')
    console.log(`\nFound ${books.length} books:`)
    books.forEach(book => {
      console.log(`- "${book.title}" by ${book.author.name} (${book.published})`)
    })

    // 测试bookCount计算
    for (const author of authors) {
      const bookCount = await Book.countDocuments({ author: author._id })
      console.log(`${author.name} has ${bookCount} books`)
    }

    mongoose.connection.close()
    console.log('\nDatabase test completed successfully!')
  } catch (error) {
    console.error('Database test failed:', error)
    mongoose.connection.close()
  }
}

testDatabase()
