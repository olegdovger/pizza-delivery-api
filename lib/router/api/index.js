const index = {
  'users': require('./users'),
  'users/login': require('./users/login'),
  'users/logout': require('./users/logout'),

  'pizzas': require('./pizzas'),
  'shopping-cart': require('./shopping-cart'),
  'order': require('./order')
}

module.exports = index
