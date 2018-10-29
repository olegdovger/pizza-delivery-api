module.exports = {
  '':  require('./routes'),

  'api/users': require('./api/users'),
  'api/users/login': require('./api/users/login'),
  'api/users/logout': require('./api/users/logout'),

  'api/pizzas': require('./api/pizzas'),

  'api/shopping-cart': require('./api/shopping-cart'),

  'api/order': require('./api/order'),

  'public': require('./public'),

  notFound (data, callback) {
    callback(404)
  },
  ping (data, callback) {
    callback(200)
  }
}
