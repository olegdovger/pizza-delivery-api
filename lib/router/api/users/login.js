const BaseHandler = require('../base-handler')

const dao = require('../../../dao')
const helpers = require('../../../helpers')
const tokens = require('../tokens')

class LoginHandler extends BaseHandler {
  async post (data, callback) {
    let {
      email,
      password
    } = data.payload

    email = typeof(email) === 'string' && email.indexOf('@') > -1 ? email.trim() : false
    password = typeof(password) === 'string' && password.trim().length > 0 ? password.trim() : false

    if (email && password) {

      let userData = await dao.fs.readSync('users', email)

      if (!(userData instanceof Error)) {
        let hashedPassword = helpers.hash(password)

        if (hashedPassword === userData.hashedPassword) {
          let tokenId = helpers.createRandomString()
          let expires = new Date(Date.now() + 1000 * 60 * 60).toString()
          let tokenObject = {
            email,
            tokenId,
            expires
          }

          let err = await dao.fs.createSync('tokens', tokenId, tokenObject).catch(e => e)

          if (!err) {
            callback(200, tokenObject)
          } else {
            callback(500, {'Error': 'Could not create the new token'})
          }

        } else {
          callback(400, {'Error': 'Password did not match the specified user`s stored password'})
        }
      } else {
        callback(400, {'Error': 'Could not find the specified user'})
      }

    } else {
      callback(400, {'Error': 'Missing required field(s)'})
    }
  }
}

module.exports = function () {
  new LoginHandler().process(...arguments)
}
