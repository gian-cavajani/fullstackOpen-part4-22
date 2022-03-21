const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')
const { initialNotes } = require('../../part4/tests/test_helper')

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

test('POST is working', async () => {
  const newBlog = {
    title: 'Test',
    author: 'Me',
    url: 'none',
    likes: 0,
  }

  await api.post('/api/blogs').send(newBlog).expect(201)
  const blogs = await helper.getBlogsDb()
  expect(blogs).toHaveLength(helper.listBlogs.length + 1)
})

test('default likes', async () => {
  const newBlog = {
    title: 'Test',
    author: 'Me',
    url: 'none',
  }

  await api.post('/api/blogs').send(newBlog).expect(201)
  const blogs = await helper.getBlogsDb()
  console.log(blogs[blogs.length - 1])
  expect(blogs[blogs.length - 1].likes).toBe(0)
})

test('no title, no url', async () => {
  const newBlog = {
    author: 'Me',
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('deleting a resource', async () => {
  const blogs = await helper.getBlogsDb()
  const deleteBlog = blogs[0]

  await api.delete(`/api/blogs/${deleteBlog.id}`).expect(204)
  const blogsAfter = await helper.getBlogsDb()

  expect(blogsAfter).toHaveLength(helper.listBlogs.length - 1)
})

test('updating a resource', async () => {
  const blogs = await helper.getBlogsDb()
  const blogId = blogs[0]
  const newBlog = {
    likes: 90,
  }
  await api.put(`/api/blogs/${blogId.id}`).send(newBlog).expect(200)
  const endBlogs = await helper.getBlogsDb()

  expect(endBlogs[0].likes).toBe(90)
})

afterAll(() => {
  mongoose.connection.close()
})
