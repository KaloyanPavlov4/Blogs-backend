const { userExtractor } = require('../utils/middleware')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')



blogsRouter.get('', async (request, response) => {
  response.json(await Blog.find({}).populate('user', { username: 1, name: 1 }))
})

blogsRouter.get('/:id', async (request, response) => {
  response.json(await Blog.findById(request.params.id).populate('user', { username:1, name:1 }))
})

blogsRouter.post('', userExtractor, async (request, response) => {
  const blog = new Blog(request.body)
  const user = request.user
  blog.user = user._id
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const likes = blog.likes ? blog.likes : 0
  response.status(201).json({ id:savedBlog.id, title:savedBlog.title, author:savedBlog.author, url:savedBlog.url, likes:likes, user:{ username:user.username, name:user.name } })
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const comment = request.body.comment
  const blog = await Blog.findById(request.params.id)
  blog.comments = blog.comments.concat(comment)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if(blog.user.toString() !== user._id.toString()){
    return response.status(403).json( { error:'blog\'s user doesn\'t match the provided token' })
  }

  await blog.deleteOne()
  user.blogs = user.blogs.filter(blog => blog._id !== request.params.id)
  await user.save()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  response.json(await Blog.findByIdAndUpdate(request.params.id, request.body, { runValidators: true, new: true }))
})

module.exports = blogsRouter