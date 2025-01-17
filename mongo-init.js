/* eslint-disable no-undef */

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