const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const { PORT, MONGODB_URI } = require('./utils/config')
const { info, error } = require('./utils/logger')

const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')

const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose
  .connect(MONGODB_URI)
  .then(() => info('connected to mongo'))
  .catch((err) => error('error', err.message))

app.use(cors())
app.use(express.json())

app.use('/', blogsRouter)

app.use(middleware.errorHandler)

module.exports = app
