const errorHandler = (error, req, response, next) => {
  console.log({error})
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error._message })
  } else if(error.name === 'jsonWebTokenError') {
    return response.status(401).json({error: 'invalid token'})
  } else if(error.name === 'TokenExpiredError') {
    return response.status(401).json({error: 'token expired'})
  }
  next(error)
}

module.exports = { errorHandler }
