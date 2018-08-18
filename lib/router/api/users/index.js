const AuthHandler = require('../auth-handler')

const dao = require('../../../dao')
const helpers = require('../../../helpers')
const tokens = require('../tokens')

class UsersHandler extends AuthHandler {
  constructor () {
    super(...arguments)

    this.publicMethods = ['post']
  }
  async post (data, callback) {
    let {firstName, lastName, email, streetAddress, password} = data.payload

    firstName = typeof(firstName) === 'string' && firstName.trim().length > 0 ? firstName.trim() : false
    lastName = typeof(lastName) === 'string' && lastName.trim().length > 0 ? lastName.trim() : false
    email = typeof(email) === 'string' && email.indexOf('@') > -1 ? email.trim() : false
    streetAddress = typeof(streetAddress) === 'string' && streetAddress.trim().length > 0 ? streetAddress.trim() : false

    password = typeof(password) === 'string' && password.trim().length > 0 ? password.trim() : false

    if (firstName && lastName && email && streetAddress && password) {

      let err = await dao.fs.readSync('users', email).catch(e => e)

      if (err instanceof Error) {
        let hashedPassword = helpers.hash(password)
        const userObject = {
          firstName,
          lastName,
          email,
          streetAddress,
          hashedPassword
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
  async get (data, callback) {
    let {email} = data.queryStringObject

    email = typeof(email) === 'string' && email.indexOf('@') > -1 ? email.trim() : false

    if (email) {
      let userData = await dao.fs.readSync('users', email).catch(e => e)

      if (!(userData instanceof Error)) {
        delete userData.hashedPassword
        callback(200, userData)
      } else {
        callback(404, {'Error': 'The specified user does not exist'})
      }
    } else {
      callback(400, {'Error': 'Missing required field'})
    }
  }
  async put (data, callback) {
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
  async delete (data, callback) {
    const {email} = data.queryStringObject

    if (email) {
      let userObject = await dao.fs.readSync('users', email).catch(e => e)

      if (!(userObject instanceof Error)) {

        let err = await dao.fs.deleteSync('users', email).catch(e => e)

        if (!err) {
          callback(200)
        } else {
          callback(500, {'Error': 'Could not find the specified user'})
        }
      } else {
        callback(400, {'Error': 'The specified user does not exist'})
      }
    } else {
      callback(400, {'Error': 'Missing required fields'})
    }
  }

  async logIn() {
    //create token
    new tokens().process(...arguments).post(...arguments)
  }
  async logOut() {
    //delete token
  }
}

module.exports = function () {
  new UsersHandler().process(...arguments)
}
