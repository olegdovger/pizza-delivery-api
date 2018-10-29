const BaseHandler = require('../auth-handler')

const dao = require('../../../dao')

const LogoutHandler = {
  ...BaseHandler,

  async post (data, callback) {
    let {token} = data.headers

    token = typeof(token) === 'string' && token.trim().length > 0 ? token.trim() : false

    if (token) {
      let data = await dao.fs.readSync('tokens', token).catch(e => e)
      if (!(data instanceof Error)) {
        let err = await dao.fs.deleteSync('tokens', token).catch(e => e)
        if (!err) {
          callback(200)
        } else {
          callback(500, {'Error': 'Could not delete user session'})
        }
      } else {
        callback(400, {'Error': 'Could not delete user session'})
      }
    } else {
      callback(400, {'Error': 'Missing required field'})
    }
  }
}

module.exports = function () {
  LogoutHandler.process(...arguments)
}
