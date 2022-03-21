const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/api/blogs/:id', async (req, res) => {
  await Blog.findOneAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/api/blogs/:id', async (req, res) => {
  const blog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
  }

  const updBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  })

  res.json(updBlog)
})

module.exports = blogsRouter
