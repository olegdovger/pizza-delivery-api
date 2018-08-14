const dao = require('../../dao')
const BaseHandler = require('./base')

class UsersHandler extends BaseHandler {
  static async post (data, callback) {
    let {firstName, lastName, email, streetAddress} = data.payload

    firstName = typeof(firstName) === 'string' && firstName.trim().length > 0 ? firstName.trim() : false
    lastName = typeof(lastName) === 'string' && lastName.trim().length > 0 ? lastName.trim() : false
    email = typeof(email) === 'string' && email.indexOf('@') > -1 ? email.trim() : false
    streetAddress = typeof(streetAddress) === 'string' && streetAddress.trim().length > 0 ? streetAddress.trim() : false

    if (firstName && lastName && email && streetAddress) {
      let err;

      await dao.fs.readSync('users', email).catch(e => err = e)

      if (err) {
        const userObject = {
          firstName,
          lastName,
          email,
          streetAddress
        }

        let {err} = await dao.fs.createSync('users', email, userObject)

        if (!err) {
          callback(200, userObject)
        } else {
          callback(500, {'Error': 'Could not create the new user'})
        }
      } else {
        callback(400, {'Error': 'A user with that email already exists'})
      }
    } else {
      callback(400, {'Error': 'Missing required fields'})
    }
  }
}

module.exports = function() {
  UsersHandler.process(...arguments)
}