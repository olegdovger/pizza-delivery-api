const crypto = require('crypto')
const config = require('./config')

const helpers = {
  parseJsonToObject (str) {
    try {
      return JSON.parse(str)
    } catch (e) {
      return {}
    }
  }
}

module.exports = helpers