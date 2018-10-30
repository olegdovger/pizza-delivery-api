const BaseHandler = require('../base-handler')
const helpers = require('../../helpers')

const PublicHandler = {
  ...BaseHandler,

  async get (data, callback) {

    let trimmedAssetName = data.trimmedPath.replace('public/', '').trim()

    if (trimmedAssetName.length > 0) {
      let data = await helpers.getStaticAsset(trimmedAssetName).catch(e => e)

      if (!(data instanceof Error)) {
        let contentType = 'plain'

        if (trimmedAssetName.indexOf('.css') > -1) {
          contentType = 'css'
        }
        if (trimmedAssetName.indexOf('.png') > -1) {
          contentType = 'png'
        }
        if (trimmedAssetName.indexOf('.jpg') > -1) {
          contentType = 'jpg'
        }
        if (trimmedAssetName.indexOf('.ico') > -1) {
          contentType = 'favicon'
        }

        if (trimmedAssetName.indexOf('.js') > -1) {
          contentType = 'js'
        }

        if (trimmedAssetName.indexOf('.html') > -1) {
          contentType = 'html'
        }

        callback(200, data, contentType)
      } else {
        callback(404)
      }
    }
  }
}

module.exports = function () {
  PublicHandler.process(...arguments)
}

