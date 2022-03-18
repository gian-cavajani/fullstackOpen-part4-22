const app = require('./app')
const http = require('http')
const { PORT, MONGODB_URI } = require('./utils/config')
const { info, error } = require('./utils/logger')

const server = http.createServer(app)

server.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})
