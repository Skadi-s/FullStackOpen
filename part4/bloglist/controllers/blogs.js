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

blogRouter.delete('/:id', async (request, response) => {
  const token = request.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  if (decodedToken.id !== request.params.id) {
    return response.status(403).json({ error: 'forbidden' });
  }
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const token = request.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  if (decodedToken.id !== request.params.id) {
    return response.status(403).json({ error: 'forbidden' });
  } 
  if (!body.title || !body.author || !body.url) {
    return response.status(400).json({ error: 'title, author, and url are required' });
  }

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