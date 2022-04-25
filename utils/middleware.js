const errorHandler = (error, req, response, next) => {
  console.log({error})
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error._message })
  } 
  next(error)
}

module.exports = { errorHandler }
