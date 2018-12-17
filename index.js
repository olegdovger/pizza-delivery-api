require('./lib/env').load()

const server = require('./lib/server')
const cli = require('./lib/cli')
const cluster = require('cluster')
const os = require('os')

// Declare the app
var app = {}

// Init function
app.init = function () {

  if (cluster.isMaster) {

    setTimeout(() => {
      cli.init()
    }, 50)

    for (let i = 0; i < os.cpus().length; i += 1) {
      cluster.fork()
    }

  } else {
    // Start the server
    server.init()
  }
}

// Self executing
app.init()

// Export the app
module.exports = app