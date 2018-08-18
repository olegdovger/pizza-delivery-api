const crypto = require('crypto')
const config = require('./config')

const helpers = {
  parseJsonToObject (str) {
    try {
      return JSON.parse(str)
    } catch (e) {
      return {}
    }
  },
  hash (str) {
    if (typeof(str) === 'string' && str.length > 0) {
      return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
    } else {
      return false
    }
  },
  createRandomString () {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'

    let str = ''
    for (let i = 1; i <= 20; i++) {
      str += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
    }

    return str
  }
}

module.exports = helpers
