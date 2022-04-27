const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{name:1,username:1})
  response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response) => {
  
  const decodedtoken = jwt.verify(request.token,process.env.SECRET)
  if(!decodedtoken){
    return res.status(401).json({error: 'missing token'})
  }

  const user = await User.findById(decodedtoken.id)
  const blog = new Blog({
    ...request.body,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

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
