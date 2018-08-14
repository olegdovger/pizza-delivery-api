const index = {
  users: require('./users')
}

index.notFound = function(data, callback) {
  callback(404)
}

index.ping = function (data, callback) {
  callback(200)
}

module.exports = index