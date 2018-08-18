const BaseHandler = require('./base-handler')

const dao = require('../../dao')

class AuthHandler extends BaseHandler {
  constructor () {
    super(...arguments)

    this.publicMethods = []
  }
  async process (data, callback) {
    if (!this.publicMethods.includes(data.method)) {
      const token = typeof(data.headers.token) === 'string' ? data.headers.token : false

      let email = data.headers.email

      email = typeof(email) === 'string' && email.indexOf('@') > -1 ? email.trim() : false

      if (email) {
        let rslt = await this.verifyToken(token, email)

        if (rslt) {
          super.process(...arguments)
        } else {
          callback(403, {'Error': 'Token is invalid'})
        }
      } else {
        callback(403, {'Error': 'Email is required'})
      }
    } else {
      super.process(...arguments)
    }
  }
  verifyToken (token, email) {
    return new Promise((resolve) => {
      dao.fs.readSync('tokens', token).then(tokenData => {
        if (tokenData.email === email && new Date(tokenData.expires) > Date.now()) {
          resolve(true)
        } else {
          resolve(false)
        }
      }).catch(e => resolve(false))
    })
  }
}

module.exports = AuthHandler
