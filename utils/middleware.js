const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error, req, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error._message })
  } else if(error.name === 'jsonWebTokenError') {
    return response.status(401).json({error: 'invalid token'})
  } else if(error.name === 'TokenExpiredError') {
    return response.status(401).json({error: 'token expired'})
  }
  next(error)
}


const tokenExtractor = (request,response,next) => {
  const auth = request.get('authorization')
   if(auth && auth.toLowerCase().startsWith('bearer ')){
    request.token = auth.substring(7)
  }
  next()
}

const userExtractor = async(request,response,next) => {
  const token = request.token
  const decodedtoken = jwt.verify(token, process.env.SECRET)
  if(!decodedtoken){
    return res.status(401).json({error: 'missing token'})
  }
  request.user = await User.findById(decodedtoken.id)
  next()
}

module.exports = { errorHandler, tokenExtractor, userExtractor }
