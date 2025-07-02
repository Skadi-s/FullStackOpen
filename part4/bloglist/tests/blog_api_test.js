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

test('a blog can be added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'https://example.com/new-blog',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  const addedBlog = response.body.find(b => b.title === 'New Blog')
  assert.ok(addedBlog)
})

test('a blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Author without likes',
    url: 'https://example.com/blog-without-likes'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const addedBlog = response.body.find(b => b.title === 'Blog without likes')
    assert.ok(addedBlog)
    assert.strictEqual(addedBlog.likes, 0)
    assert.strictEqual(addedBlog.author, 'Author without likes')
    assert.strictEqual(addedBlog.url, 'https://example.com/blog-without-likes')
})

test('a blog without title or url returns 400', async () => {
  const newBlog = {
    author: 'Author without title',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})