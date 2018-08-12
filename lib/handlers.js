
const handlers = {}

handlers.ping = function(data, callback) {
  callback(200, { 'test': 2 })
}

module.exports = handlers