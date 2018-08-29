const BaseHandler = require('../base-handler')
const helpers = require('../../helpers')

const FaviconHandler = {
  ...BaseHandler,

  async get (_, callback) {
    let data = await helpers.getStaticAsset('favicon.ico').catch(e => e)

    if (!(data instanceof Error)) {
      callback(200, data, 'favicon')
    } else {
      callback(500)
    }
  }
}

module.exports = function () {
  FaviconHandler.process(...arguments)
}
