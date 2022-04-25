const bcrypt = require('bcrypt')

const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/api/users', async (req,res)=>{
    const {password, name, username} = req.body
    
    const existingUser = await User.findOne({username})
    if(existingUser){
        return res.status(400).json({error: 'username must be unique'})
    }
    if(password.length <= 3){
        return res.status(400).json({error: 'password must be longer than 3 characters'})
    }

    const passwordHash = await bcrypt.hash(password,10)
    const user = new User({
        name,username,passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

usersRouter.get('/api/users',async (req,res)=>{
    const users = await User.find({}).populate('blogs',{title:1, url:1,author:1})
    res.json(users)
})

module.exports = usersRouter