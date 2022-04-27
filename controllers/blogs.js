const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const {userExtractor} = require('../utils/middleware')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{name:1,username:1})
  response.json(blogs)
})

blogsRouter.post('/api/blogs', userExtractor, async (request, response) => {
  
  const user = request.user
  const blog = new Blog({
    ...request.body,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/api/blogs/:id', userExtractor, async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)
  if(blog.user.toString() === user.id.toString()){
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } else {
    return res.status(401).json({error: "you can't delete a blog that isn't yours"})
  }

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
