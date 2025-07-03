const { after } = require('node:test')
const mongoose = require('mongoose')

// 导入所有测试文件
require('./blog_api_test')
require('./user_api_test')

// 在所有测试完成后关闭连接
after(async () => {
    console.log('Closing database connection...')
    await mongoose.connection.close()
})