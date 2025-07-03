const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const setupDatabase = require('./setup')

const api = supertest(app)

describe('Blog API Tests', () => {
    beforeEach(async () => {
        await setupDatabase.setupDatabase()
    })

    describe('GET /api/blogs', () => {
        test('returns blogs as JSON', async () => {
            const user = await User.findOne({ username: 'testuser1' })
            const token = jwt.sign({ id: user._id }, process.env.SECRET)
            await api.get('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('GET blogs id exists', async () => {
            const blogs = await Blog.find({})
            const blogToView = blogs[0]
            const user = await User.findOne({ username: 'testuser1' })
            const token = jwt.sign({ id: user._id }, process.env.SECRET)

            const response = await api.get(`/api/blogs/${blogToView.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.title, blogToView.title)
        })

        test('GET /api/blogs returns the correct number of blogs', async () => {
            const user = await User.findOne({ username: 'testuser1' })
            const token = jwt.sign({ id: user._id }, process.env.SECRET)
            const response = await api.get('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.length, 2)
        })

        test('GET /api/blogs/:id returns a specific blog', async () => {
            const user = await User.findOne({ username: 'testuser1' })
            const token = jwt.sign({ id: user._id }, process.env.SECRET)

            const blogs = await Blog.find({})
            const blogToView = blogs[0]

            const response = await api.get(`/api/blogs/${blogToView.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
            .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.title, blogToView.title)
            })

        test('GET /api/blogs related to a specific user', async () => {
            const user = await User.findOne({ username: 'testuser1' })
            const token = jwt.sign({ id: user._id }, process.env.SECRET)

            const blogs = await Blog.find({})
            const userId = blogs[0].user

            const response = await api.get(`/api/blogs?user=${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.length, 2)
            assert.strictEqual(response.body[0].user, userId)
        })
    })

    describe('POST /api/blogs', () => {
        test('POST with authentication creates a new blog', async () => {
            const user = await User.findOne({ username: 'testuser1' })
            const token = jwt.sign({ id: user._id }, process.env.SECRET)

            const newBlog = {
                title: 'New Blog',
                author: 'John Doe',
                url: 'https://example.com/new-blog',
                likes: 5
            }

            const response = await api.post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)

            assert.strictEqual(response.status, 201)
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
            const user = await User.findOne({ username: 'testuser1' })
            const token = jwt.sign({ id: user._id }, process.env.SECRET)
            
            const blogs = await Blog.find({})
            const blogToUpdate = blogs[0]

            const updatedBlog = {
                title: 'Updated Blog',
                author: 'Updated Author',
                url: 'https://example.com/updated-blog',
                likes: 1
            }

            const response = await api.put(`/api/blogs/${blogToUpdate.id}`)
                .set('Authorization', `Bearer ${token}`)
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
            const user = await User.findOne({ username: 'testuser1' })
            const token = jwt.sign({ id: user._id }, process.env.SECRET)

            const blogs = await Blog.find({})
            const blogToDelete = blogs[0]

            await api.delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const blogsAtEnd = await Blog.find({})
            assert.strictEqual(blogsAtEnd.length, 1)
            assert.strictEqual(blogsAtEnd[0].title, 'Blog 2')
        })
    })
})

