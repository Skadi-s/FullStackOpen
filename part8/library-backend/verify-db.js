const mongoose = require('mongoose')
require('dotenv').config()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const verifyData = async () => {
  try {
    console.log('连接到 MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('连接成功！')

    // 查询统计信息
    const authorCount = await Author.countDocuments()
    const bookCount = await Book.countDocuments()
    const userCount = await User.countDocuments()

    console.log(`\\n📊 数据库统计:`)
    console.log(`👨‍💼 作者数量: ${authorCount}`)
    console.log(`📚 书籍数量: ${bookCount}`)
    console.log(`👤 用户数量: ${userCount}`)

    // 查询一些书籍并填充作者信息
    console.log(`\\n📖 前5本书籍详情:`)
    const books = await Book.find().limit(5).populate('author')
    books.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title}`)
      console.log(`   作者: ${book.author.name}`)
      console.log(`   出版年份: ${book.published}`)
      console.log(`   类型: ${book.genres.join(', ')}`)
      console.log('')
    })

    // 查询所有作者
    console.log(`👨‍💼 所有作者:`)
    const authors = await Author.find()
    authors.forEach((author, index) => {
      console.log(`${index + 1}. ${author.name} (${author.born || '未知'})`)
    })

    console.log(`\\n👤 用户信息:`)
    const users = await User.find()
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} - 喜欢: ${user.favouriteGenre}`)
    })

  } catch (error) {
    console.error('验证数据时出错:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\\n数据库连接已关闭')
  }
}

verifyData()
