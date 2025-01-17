const SECRET = 'SECRET'
const PORT = 3003
const MONGODB_URI = process.env.NODE_ENV === 'test' ? 'mongodb://appUser:password@localhost:27017/testBlogs?authSource=admin'  : 'mongodb://appUser:password@localhost:27017/blogs?authSource=admin'

module.exports = {
  SECRET,
  MONGODB_URI,
  PORT
}