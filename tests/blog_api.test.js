const { test, after, beforeEach, before, describe } = require('node:test')
const assert = require('node:assert')
const sinon = require('sinon')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./blog_test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

let app
let api

const blogToAdd = { title: 'new', author: 'new', url: 'new' }
const userToAdd = { username: 'username', name: 'name', passwordHash: '12345' }

beforeEach(() => {
  app = require('../app')
  api = supertest(app)
})

before(() => {
  sinon.stub(middleware, 'userExtractor').callsFake( async (req,res,next) => {
    const user = await User.findOne({ 'username':'username' })
    req.user = user
    next()
  })
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const blogs = helper.initialBlogs.map(blog => new Blog(blog))
  const saveBlogsPromises = blogs.map(blog => blog.save())
  await Promise.all(saveBlogsPromises)

  const user = new User(userToAdd)
  await user.save()
})

describe('GET', () => {
  test('there are correct number of blogs when getting them all', async () => {
    const blogs = await helper.blogsInDB()

    assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })

  test('blogs unique identifier is named id', async () => {
    const blogs = await helper.blogsInDB()

    blogs.forEach(blog => assert(blog.id))
    blogs.forEach(blog => assert(!blog._id))
  })
})

describe('POST', () => {
  test('request successfully saves a blog', async () => {
    await api.post('/api/blogs').send(blogToAdd)
    const blogs = await helper.blogsInDB()

    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
    assert(blogs.map(blog => blog.title).includes('new'))
  })

  test('likes default to 0', async () => {
    await api.post('/api/blogs').send(blogToAdd)
    const blogs = await helper.blogsInDB()

    assert(blogs.map(blog => blog.likes).includes(0))
  })

  test('returns 400 for a blog without a title', async () => {
    const blogWithNoTitle = { author:'new', url:'new' }

    await api.post('/api/blogs').send(blogWithNoTitle).expect(400)
  })

  test('returns 400 for a blog without an author', async () => {
    const blogWithNoTitle = { title:'new', url:'new' }

    await api.post('/api/blogs').send(blogWithNoTitle).expect(400)
  })

  test('returns 400 for a blog without an url', async () => {
    const blogWithNoTitle = { title:'new', author:'new' }

    await api.post('/api/blogs').send(blogWithNoTitle).expect(400)
  })
})

describe('PUT', () => {
  test('updates blog', async () => {
    const added = await api.post('/api/blogs').send(blogToAdd)
    await api.put(`/api/blogs/${added.body.id}`).send({ title:'newerer' }).expect(200)

    const blogs = await helper.blogsInDB()
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
    assert(blogs.map(blog => blog.title).includes('newerer'))
  })
})

describe('DELETE', () => {
  test('removes blog from DB', async () => {
    const added = await api.post('/api/blogs').send(blogToAdd)
    await api.delete(`/api/blogs/${added.body.id}`).expect(204)

    const blogs = await helper.blogsInDB()
    assert.strictEqual(blogs.length, helper.initialBlogs.length)
    assert(blogs.map(blog => blog.title).includes('new') === false)
  })
})

after(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  await mongoose.connection.close()
})

