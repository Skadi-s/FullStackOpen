// filepath: d:\Course\FullStackOpen\part4\bloglist\tests\setup.js
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

// 设置测试环境
process.env.NODE_ENV = 'test'

const initialBlogs = [
    { title: 'Blog 1', author: 'Author 1', url: 'https://example.com/blog1', likes: 5 },
    { title: 'Blog 2', author: 'Author 2', url: 'https://example.com/blog2', likes: 10 }
]   

const setupDatabase = async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})    
    
    // 创建初始用户
    const initialUsers = [
        { username: 'testuser1', name: 'Test User 1', passwordHash: await bcrypt.hash('password1', 10) },
        { username: 'testuser2', name: 'Test User 2', passwordHash: await bcrypt.hash('password2', 10) }
    ]

    // 创建用户并获取他们的 ID
    const user1 = await User.create(initialUsers[0])
    const user2 = await User.create(initialUsers[1])
    
    // 将用户 ID 关联到博客
    initialBlogs[0].user = user1._id
    initialBlogs[1].user = user1._id
    
    // 只插入博客（用户已经创建了）
    await Blog.insertMany(initialBlogs)
}

module.exports = {
    setupDatabase
}