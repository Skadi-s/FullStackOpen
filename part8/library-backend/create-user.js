const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('./models/user')

const createTestUser = async () => {
  try {
    console.log('connecting to', process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to MongoDB')

    // 删除现有用户
    await User.deleteMany({})
    console.log('cleared existing users')

    // 创建测试用户
    const saltRounds = 10
    const passwordHash = await bcrypt.hash('defaultpassword', saltRounds)
    
    const testUser = new User({
      username: 'testuser',
      favouriteGenre: 'programming',
      passwordHash
    })

    await testUser.save()
    console.log('Test user created:', testUser.username)
    console.log('Password: defaultpassword')

    mongoose.connection.close()
    console.log('User creation completed!')
  } catch (error) {
    console.error('User creation failed:', error)
    mongoose.connection.close()
  }
}

createTestUser()
