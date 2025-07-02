const { test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

describe('Blog API Tests', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        const initialBlogs = [
        { title: 'Blog 1', author: 'Author 1', url: 'https://example.com/blog1', likes: 5 },
        { title: 'Blog 2', author: 'Author 2', url: 'https://example.com/blog2', likes: 10 }
        ]
        await Blog.insertMany(initialBlogs)
    })

    test('GET /api/blogs returns all blogs', async () => {
        const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, 2)
        assert.strictEqual(response.body[0].title, 'Blog 1')
        assert.strictEqual(response.body[1].title, 'Blog 2')
    })

    test('GET /api/blogs/:id returns a specific blog', async () => {
        const blogs = await Blog.find({})
        const blogToView = blogs[0]

        const response = await api.get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.title, blogToView.title)
    })

    test('POST /api/blogs creates a new blog', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'New Author',
            url: 'https://example.com/new-blog',
            likes: 0
        }

        const response = await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.title, newBlog.title)
        assert.strictEqual(response.body.author, newBlog.author)
        assert.strictEqual(response.body.url, newBlog.url)
        assert.strictEqual(response.body.likes, newBlog.likes)

        const blogsAtEnd = await Blog.find({})
        assert.strictEqual(blogsAtEnd.length, 3)
        assert.strictEqual(blogsAtEnd[2].title, newBlog.title)
    })
})

after(async () => {
    await mongoose.connection.close()
})
