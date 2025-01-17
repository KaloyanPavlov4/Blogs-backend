const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'First author',
    url: 'First url',
    likes: 1
  },
  {
    title: 'Second blog',
    author: 'Second author',
    url: 'Second url',
    likes: 2
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title:'will delete soon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, nonExistingId, blogsInDB }