const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response.status(400).json({ error: 'username and password are required' })
  } else if (username.length < 3) {
    return response.status(400).json({ error: 'username must be at least 3 characters long' })
  } else if (password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1
  })
  response.json(users)
})

usersRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  if (!id) {
    return response.status(400).json({ error: 'User ID is required' })
  }

  const user = await User.findById(id)
  if (!user) {
    return response.status(404).json({ error: 'User not found' })
  }

  await User.findByIdAndDelete(id)
  response.status(204).end()
})

module.exports = usersRouter