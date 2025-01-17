const User = require('../models/user')

const initialUsers = [
  {
    username:'Kalo',
    name: 'Yan',
    passwordHash:'1'
  },
  {
    username:'Kilc',
    name: 'X',
    passwordHash:'2'
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { initialUsers, usersInDb }