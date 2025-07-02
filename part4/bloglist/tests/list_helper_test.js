const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

test('total likes of empty list is zero', () => {
  const blogs = []

  const result = listHelper.totalLikes(blogs)
  assert.strictEqual(result, 0)
})

test('total likes of a list with one blog is the likes of that blog', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      url: 'https://example.com/blog1',
      likes: 5
    }
  ]

  const result = listHelper.totalLikes(blogs)
  assert.strictEqual(result, 5)
})

test('total likes of a list with multiple blogs is the sum of their likes', () => {
  const blogs = [
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

  const result = listHelper.totalLikes(blogs)
  assert.strictEqual(result, 15)
})