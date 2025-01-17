const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

usersRouter.get('', async (request, response) => {
  response.json(await User.find({}).populate('blogs', { title:1, author:1, url:1, likes:1 }))
})

usersRouter.get('/:id', async (request, response) => {
  response.json(await User.findById(request.params.id).populate('blogs'))
})

usersRouter.post('', async (request, response) => {
  const { username, name, password } = request.body
  if(password === undefined || password.length < 3) throw { name: 'ValidationError', message: 'password is required and should be at least 3 characters long!' }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter