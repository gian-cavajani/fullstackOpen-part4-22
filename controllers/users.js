const bcrypt = require('bcrypt')

const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/api/users', async (req,res)=>{
    const {password, name, username} = req.body
    
    const passwordHash = await bcrypt.hash(password,10)
    const user = new User({
        name,username,passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

usersRouter.get('/api/users',async (req,res)=>{
    const users = await User.find({})
    res.json(users)
})

module.exports = usersRouter