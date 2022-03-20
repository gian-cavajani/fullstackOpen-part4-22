const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.listBlogs) {
    let blogObj = new Blog(blog)
    await blogObj.save()
  }
})

test('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
  expect(response.body).toHaveLength(helper.listBlogs.length)
})

test('property id is id', async () => {
  const blogs = await api.get('/api/blogs')
  expect(blogs.body[0].id).toBeDefined()
})
