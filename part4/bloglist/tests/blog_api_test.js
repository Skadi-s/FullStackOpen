const { test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Author 1',
    url: 'https://example.com/blog1',
    likes: 5
  },
  {
    title: 'Blog 2',
    author: 'Author 2',
    url: 'https://example.com/blog2',
    likes: 10
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('specific blog is returned', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body.find(b => b.title === 'Blog 1')
  assert.ok(blog)
  assert.strictEqual(blog.title, 'Blog 1')
  assert.strictEqual(blog.author, 'Author 1')
  assert.strictEqual(blog.url, 'https://example.com/blog1')
  assert.strictEqual(blog.likes, 5)
})

after(async () => {
  await mongoose.connection.close()
})