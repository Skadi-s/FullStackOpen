const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


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

blogRouter.post('/', async (request, response) => {
    const body = request.body;

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: body.userId // Assuming userId is passed in the request body
    })

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  })

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const blog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
})

module.exports = blogRouter;