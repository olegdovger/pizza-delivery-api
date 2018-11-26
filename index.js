require('./lib/env').load();

var server = require('./lib/server')
var cli = require('./lib/cli')

// Declare the app
var app = {}

// Init function
app.init = function () {
  // Start the server
  server.init()

  setTimeout(() => {
    cli.init();
  }, 50);
}

// Self executing
app.init()

// Export the app
module.exports = app