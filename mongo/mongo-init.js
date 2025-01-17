/* eslint-disable no-undef */
db = db.getSiblingDB('admin')

db.createUser({
  user: 'appUser',
  pwd: 'password',
  roles: [
    {
      role: 'dbOwner',
      db: 'blogs'
    },
    {
      role: 'dbOwner',
      db: 'testBlogs'
    },
  ],
})