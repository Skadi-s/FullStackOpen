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
        { title: 'Blog 1', author: 'Author 1', url: 'https://example.com/blog1', likes: 5, user: '6865d77136e1a922c66e86bd' },
        { title: 'Blog 2', author: 'Author 2', url: 'https://example.com/blog2', likes: 10, user: '6865d77136e1a922c66e86bd' }
        ]
        await Blog.insertMany(initialBlogs)
    })

    describe('GET /api/blogs', () => {
        test('returns blogs as JSON', async () => {
            await api.get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('GET blogs id exists', async () => {
            const blogs = await Blog.find({})
            const blogToView = blogs[0]

            const response = await api.get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.title, blogToView.title)
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

        test('GET /api/blogs related to a specific user', async () => {
            const blogs = await Blog.find({})
            const userId = blogs[0].user

            const response = await api.get(`/api/blogs?user=${userId}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.length, 2)
            assert.strictEqual(response.body[0].user, userId)
        })
    })

    describe('POST /api/blogs', () => {
        test('POST /api/blogs creates a new blog', async () => {
            const newBlog = {
                title: "New Blog 123",
                author: "John Doe",
                url: "https://example.com/new-blog",
                likes: 5
            }

            const response = await api.post('/api/blogs')
                .send(newBlog)

            if (response.status !== 201) {
                console.error('POST failed with status:', response.status)
                console.error('Error response:', response.body)
            }

            assert.strictEqual(response.status, 201)
            assert.strictEqual(response.body.title, newBlog.title)
            assert.strictEqual(response.body.author, newBlog.author)
            assert.strictEqual(response.body.url, newBlog.url)
            assert.strictEqual(response.body.likes, newBlog.likes)

            const blogsAtEnd = await Blog.find({})
            assert.strictEqual(blogsAtEnd.length, 3)
            assert.strictEqual(blogsAtEnd[2].title, newBlog.title)
        })

        test('POST /api/blogs without likes defaults to 0', async () => {
            const newBlog = {
                title: "New Blog without Likes",
                author: "John Doe",
                url: "https://example.com/new-blog"
            }

            const response = await api.post('/api/blogs')
                .send(newBlog)

            assert.strictEqual(response.status, 201)
            assert.strictEqual(response.body.title, newBlog.title)
            assert.strictEqual(response.body.author, newBlog.author)
            assert.strictEqual(response.body.url, newBlog.url)
            assert.strictEqual(response.body.likes, 0)

            const blogsAtEnd = await Blog.find({})
            assert.strictEqual(blogsAtEnd.length, 3)
            assert.strictEqual(blogsAtEnd[2].title, newBlog.title)
        })

        test('POST /api/blogs without title or url returns 400', async () => {
            const newBlog = {
                author: "John Doe",
                likes: 5
            }

            const response = await api.post('/api/blogs')
                .send(newBlog)

            assert.strictEqual(response.status, 400)

            const blogsAtEnd = await Blog.find({
                title: { $exists: true },
                url: { $exists: true }  
            })
            assert.strictEqual(blogsAtEnd.length, 2)
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
