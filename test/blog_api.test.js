const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Blog = require('../models/blog')
const { initialNotes } = require('../../part4/tests/test_helper')

describe('tests', () => {
  

  
  beforeEach(async () => {
    await Blog.deleteMany({})
    const user = {
      username: 'testing',
      name: 'testing',
      password: 'testing'
    }
    
    await api.post('/api/users').send(user)
    
    const loginIn = await api.post('/api/login').send(user)
    
    headers = {'Authorization': `bearer ${loginIn.body.token}`}
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
  
  await api.post('/api/blogs').send(newBlog).expect(201).set(headers)
  const blogs = await helper.getBlogsDb()
  expect(blogs).toHaveLength(helper.listBlogs.length + 1)
})

test('default likes', async () => {
  const newBlog = {
    title: 'Test',
    author: 'Me',
    url: 'none',
  }
  
  await api.post('/api/blogs').send(newBlog).expect(201).set(headers)
  const blogs = await helper.getBlogsDb()
  expect(blogs[blogs.length - 1].likes).toBe(0)
})

test('no title, no url', async () => {
  const newBlog = {
    author: 'Me',
  }

  await api.post('/api/blogs').send(newBlog).expect(400).set(headers)
})

test('deleting a resource', async () => {
  const newBlog = {
    title: 'Test',
    author: 'Me',
    url: 'none',
  }
  
  await api.post('/api/blogs').send(newBlog).expect(201).set(headers)


  const blogs = await helper.getBlogsDb()
  const blogToDelete = blogs.find(blog => blog.title === newBlog.title)

  await api.delete(`/api/blogs/${blogToDelete.id}`).set(headers).expect(204)

  const blogsAfter = await helper.getBlogsDb()
  
  expect(blogsAfter).toHaveLength(helper.listBlogs.length)

})

test('updating a resource', async () => {
  const blogs = await helper.getBlogsDb()
  const blogId = blogs[0]
  const newBlog = {
    likes: 90,
  }
  await api.put(`/api/blogs/${blogId.id}`).send(newBlog).expect(200).set(headers)
  const endBlogs = await helper.getBlogsDb()
  
  expect(endBlogs[0].likes).toBe(90)
})
});

afterAll(() => {
  mongoose.connection.close()
})
