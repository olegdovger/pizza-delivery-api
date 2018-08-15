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

      let err = await dao.fs.readSync('users', email).catch(e => e.err)

      if (err) {
        const userObject = {
          firstName,
          lastName,
          email,
          streetAddress
        }

        let err = await dao.fs.createSync('users', email, userObject).catch(e => e.error)

        if (err) {
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
    email = typeof(email) === 'string' && email.indexOf('@') > -1 ? email.trim() : userObject.email
    streetAddress = typeof(streetAddress) === 'string' && streetAddress.trim().length > 0 ? streetAddress.trim() : userObject.streetAddress


    if(!userObject.err) {
      Object.assign(userObject, {
        firstName,
        lastName,
        email,
        streetAddress
      })

      let data = dao.fs.updateSync('users', email, userObject)

      
    }
  }
}

module.exports = function () {
  UsersHandler.process(...arguments)
}