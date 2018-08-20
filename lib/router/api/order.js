const AuthHandler = require('./auth-handler')
const dao = require('../../dao')
const helpers = require('../../helpers')

class Order extends AuthHandler {
  async post (data, callback) {
    let email = data.headers.email
    let cart = await dao.fs.readSync('shopping-carts', email).catch(e => e)
    let userData = await dao.fs.readSync('users', email).catch(e => e)


    let itemsToOrder = []

    if (!(cart instanceof Error)) {
      itemsToOrder = cart.items.map(item => {
        return {
          type: 'sku',
          parent: item.id
        }
      })

      let cartData = {
        items: itemsToOrder,
        email
      }

      let order = await helpers.createStripeOrder(cartData, userData).catch(e => e)

      if (!(order instanceof Error)) {
        console.log('delete')
        let cart = await dao.fs.deleteSync('shopping-carts', email).catch(e => e)

        if (!(cart instanceof Error)) {
          console.log('deleted')
          callback(200, order)
        } else {
          callback(400, {'Error': 'Could not delete shopping cart'})
        }

        callback(200, order)
      } else {
        callback(400, {'Error': 'Could not create an order'})
      }
    } else {
      callback(400, {'Error': 'Shopping cart is empty'})
    }
  }
}

module.exports = function () {
  new Order().process(...arguments)
}
