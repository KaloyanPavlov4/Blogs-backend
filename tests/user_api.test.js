const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./user_test_helper')
const User = require('../models/user')

let api

beforeEach(() => {
  const app = require('../app')
  api = supertest(app)
})

beforeEach(async () => {
  await User.deleteMany({})

  const users = helper.initialUsers.map(user => new User(user))
  const saveUserPromises = users.map(user => user.save())
  await Promise.all(saveUserPromises)
})

describe('GET', () => {
  test('there are a correct number of users when getting them all', async () => {
    const users = await helper.usersInDb()
    assert.strictEqual(users.length, helper.initialUsers.length)
  })

  test('users unique identifier is named id', async () => {
    const users = await helper.usersInDb()
    users.forEach(user => assert(user.id))
    users.forEach(user => assert(!user._id))
  })

  test('returned users don\'t have their password hashes', async() => {
    const users = await helper.usersInDb()
    users.forEach(user => assert(!user.passwordHash))
  })
})

describe('POST', async () => {
  test('user with invalid username returns 400', async () => {
    const user = { username:'h', name:'haha less than 3 characters is my username >:3', password:'whatever' }
    await api.post('/api/users').send(user).expect(400)
  })

  test('user with invalid password returns 400', async () => {
    const user = { username:'watch what I do', name:'no really watch', password:'e' }
    await api.post('/api/users').send(user).expect(400)
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})