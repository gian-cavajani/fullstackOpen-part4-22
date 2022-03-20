const errorHandler = (error, req, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'no title or url' })
  }
  next(error)
}

module.exports = { errorHandler }
