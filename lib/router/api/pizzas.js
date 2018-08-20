const AuthHandler = require('./auth-handler')

const dao = require('../../dao')
const helpers = require('../../helpers')

class Pizzas extends AuthHandler {
  async get (data, callback) {
    const pizzas = await dao.fs.listSync('pizzas').catch(e => e)

    if (pizzas.length > 0) {
      callback(200, pizzas)
    } else {
      let skus = await helpers.getStripeSKUs().catch(e => e)

      if (!(skus instanceof Error)) {

        let items = skus.data

        for (let i = 0; i < items.length; i += 1) {
          let item = items[i]
          let pizza = await dao.fs.createSync('pizzas', `${item.attributes.type}_${item.attributes.size}`, item).catch(e => e)

          if (pizza instanceof Error) {
            break
          }
        }

        callback(200, await dao.fs.listSync('pizzas'))
      } else {
        callback(404, {'Error': 'Data is not found'})
      }
    }
  }
}

module.exports = module.exports = function () {
  new Pizzas().process(...arguments)
}
