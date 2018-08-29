const AuthHandler = require('./auth-handler')
const dao = require('../../dao')

const ShoppingCart = {
  ...AuthHandler,

  async post (data, callback) {
    let {items} = data.payload
    let email = data.headers.email

    let itemsToSave = []
    let pizza
    for (let i = 0; i < items.length; i += 1) {
      pizza = await dao.fs.readSync('pizzas', `${items[i].name}_${items[i].size}`).catch(e => e)

      if (!(pizza instanceof Error)) {
        itemsToSave.push(pizza)
      } else {
        itemsToSave = []
        break
      }
    }

    let shoppingCart = {}

    let saveData = async () => {
      let shoppingCart = {
        items: itemsToSave,
        totalPrice: itemsToSave.reduce((sum, item) => sum += item.price, 0)
      }

      let error = await dao.fs.updateSync('shopping-carts', email, shoppingCart).catch(e => e)

      if (!(error instanceof Error)) {
        callback(200, shoppingCart)
      } else {
        callback(400, {'Error': 'Error updating of shopping cart'})
      }
    }

    if (itemsToSave.length > 0) {

      let err = await dao.fs.readSync('shopping-carts', email).catch(e => e)

      if (!(err instanceof Error)) {
        await saveData(shoppingCart, callback)
      } else {
        //create shopping cart

        err = await dao.fs.createSync('shopping-carts', email, shoppingCart).catch(e => e)

        if (!(err instanceof Error)) {
          await saveData(shoppingCart, callback)
        } else {
          callback(400, {'Error': 'Could not create shopping-cart'})
        }
      }
    } else {
      callback(400, {'Error': 'Wrong pizza names'})
    }
  },
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
  ShoppingCart.process(...arguments)
}
