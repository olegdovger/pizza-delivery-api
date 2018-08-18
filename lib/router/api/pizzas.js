const AuthHandler = require('./auth-handler')

const dao = require('../../dao')

class Pizzas extends AuthHandler {
  async get (data, callback) {
    const pizzas = await dao.fs.listSync('pizzas').catch(e => e)

    if (!(pizzas instanceof Error)) {
      callback(200, pizzas)
    } else {
      callback(404, {'Error': 'Data is not found'})
    }
  }
}

module.exports = module.exports = function () {
  new Pizzas().process(...arguments)
}
