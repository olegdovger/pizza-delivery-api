const index = {
  'users': require('./users'),
  'users/login': require('./users/login'),
  'users/logout': require('./users/logout'),

  'tokens': require('./tokens'),
  'pizzas': require('./pizzas'),
  'shopping-cart': require('./shopping-cart'),
  'order': require('./order')
}

index.notFound = function(data, callback) {
  callback(404)
}

index.ping = function (data, callback) {
  callback(200)
}

module.exports = index
