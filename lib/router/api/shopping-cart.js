const AuthHandler = require('./auth-handler')
const dao = require('../../dao')

class ShoppingCart extends AuthHandler {
  async post (data, callback) {
    let {items} = data.payload

    let error
    for (let i = 0; i < items.length; i += 1) {
      error = await dao.fs.readSync('pizzas', items[i].name).catch(e => e)

      if (error instanceof Error) {
        break
      }
    }

    let shoppingCart = {}

    if (!(error instanceof Error)) {
      let email = data.headers.email

      shoppingCart = await dao.fs.readSync('shopping-carts', email).catch(e => e)

      if (shoppingCart instanceof Error) {
        //create shopping cart

        shoppingCart = await dao.fs.createSync('shopping-carts', email, {}).catch(e => e)
      }

      shoppingCart.items = items
      shoppingCart.totalPrice = items.reduce((sum, item) => sum += item.price, 0)

      let error = await dao.fs.updateSync('shopping-carts', email, shoppingCart).catch(e => e)

      if (!(error instanceof Error)) {
        callback(200, shoppingCart)
      } else {
        callback(400, {'Error': 'Error updating of shopping cart'})
      }

    } else {
      callback(400, {'Error': 'Wrong pizza names'})
    }
  }
  async delete (data, callback) {

    const {email} = data.headers

    let cart = await dao.fs.readSync('shopping-carts', email).catch(e => e)

    if (!(cart instanceof Error)) {

      let err = await dao.fs.deleteSync('shopping-carts', email).catch(e => e)

      if (!err) {
        callback(200)
      } else {
        callback(500, {'Error': 'Could not find the specified shopping cart'})
      }
    } else {
      callback(400, {'Error': 'The shopping cart does not exist'})
    }
  }
}

module.exports = function () {
  new ShoppingCart().process(...arguments)
}
