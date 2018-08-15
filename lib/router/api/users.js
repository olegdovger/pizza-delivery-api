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

      let err = await dao.fs.readSync('users', email).catch(e => e)

      if (err instanceof Error) {
        const userObject = {
          firstName,
          lastName,
          email,
          streetAddress
        }

        let err = await dao.fs.createSync('users', email, userObject).catch(e => e)

        if (err instanceof Error) {
          callback(500, {'Error': 'Could not create the new user'})
        } else {
          callback(200, userObject)
        }
      } else {
        callback(400, {'Error': 'A user with that email already exists'})
      }
    } else {
      callback(400, {'Error': 'Missing required fields'})
    }
  }
  static async put (data, callback) {
    let {firstName, lastName, email, streetAddress} = data.payload

    let userObject = await dao.fs.readSync('users', email).catch(e => e)

    firstName = typeof(firstName) === 'string' && firstName.trim().length > 0 ? firstName.trim() : userObject.firstName
    lastName = typeof(lastName) === 'string' && lastName.trim().length > 0 ? lastName.trim() : userObject.lastName
    streetAddress = typeof(streetAddress) === 'string' && streetAddress.trim().length > 0 ? streetAddress.trim() : userObject.streetAddress

    if (!(userObject instanceof Error)) {
      Object.assign(userObject, {
        firstName,
        lastName,
        streetAddress
      })

      let data = dao.fs.updateSync('users', email, userObject).catch(e => e)

      if (data instanceof Error) {
        callback(500, {'Error': 'Could not update the user'})
      } else {
        callback(200, userObject)
      }
    } else {
      callback(400, {'Error': 'The specified user does not exist'})
    }
  }
}

module.exports = function () {
  UsersHandler.process(...arguments)
}
