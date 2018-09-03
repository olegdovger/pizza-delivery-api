const BaseHandler = require('../base-handler')
const helpers = require('../../helpers')

const IndexHandler = {
  ...BaseHandler,
  async get (data, callback) {
    data = await helpers.getTemplate('index')

    if (!(data instanceof Error)) {
      callback(200, data, 'html');
    } else {
      callback(404, data);
    }
  }
}

module.exports = function () {
  IndexHandler.process(...arguments)
}
