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

    describe('GET /api/blogs', () => {
        test('returns blogs as JSON', async () => {
            await api.get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('blogs are returned as an array', async () => {
            const response = await api.get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(Array.isArray(response.body), true)
        })

        test('GET /api/blogs returns the correct number of blogs', async () => {
            const response = await api.get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.length, 2)
        })
        test('GET /api/blogs/:id returns a specific blog', async () => {
            const blogs = await Blog.find({})
            const blogToView = blogs[0]

            const response = await api.get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.title, blogToView.title)
            })
    })

    describe('POST /api/blogs/:id', () => {
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

   describe('PUT /api/blogs/:id', () => {
        test('PUT /api/blogs/:id updates a blog', async () => {
            const blogs = await Blog.find({})
            const blogToUpdate = blogs[0]

            const updatedBlog = {
                title: 'Updated Blog',
                author: 'Updated Author',
                url: 'https://example.com/updated-blog',
                likes: 1
            }

            const response = await api.put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.title, updatedBlog.title)
            assert.strictEqual(response.body.author, updatedBlog.author)
            assert.strictEqual(response.body.url, updatedBlog.url)
            assert.strictEqual(response.body.likes, updatedBlog.likes)
            const blogsAtEnd = await Blog.find({})
            assert.strictEqual(blogsAtEnd.length, 2)
        })
    })

    describe('DELETE /api/blogs/:id', () => {
        test('DELETE /api/blogs/:id deletes a blog', async () => {
            const blogs = await Blog.find({})
            const blogToDelete = blogs[0]

            await api.delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await Blog.find({})
            assert.strictEqual(blogsAtEnd.length, 1)
            assert.strictEqual(blogsAtEnd[0].title, 'Blog 2')
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})
