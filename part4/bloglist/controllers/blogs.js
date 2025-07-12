const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware');


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user',{ username: 1, name: 1 });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body;
    const token = request.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: decodedToken.id
    })

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  })

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(204).end()
  }

  if (user.id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: 'user not authorized' })
  }

  user.blogs = user.blogs.filter(b => b.id.toString() !== blog.id.toString())

  await blog.deleteOne()
  response.status(204).end()
})

blogRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()

  response.json(updatedBlog)
})

module.exports = blogRouter;