
/**
 * Create the server and getting it running
 *
 */

const { server, importData } = require('./provider.js')
importData()

server.listen(8081, () => {
  console.log('Service listening on http://localhost:8081')
})
