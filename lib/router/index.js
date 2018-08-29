const api = require('./api')
const _public = require('./public')

function routePath (namespace, routeObj) {
  Object.keys(routeObj).forEach(key => {
    routeObj[`${namespace}/${key}`] = routeObj[key]
    delete routeObj[key]
  })

  return routeObj
}

module.exports = {
  ...routePath('api', api),
  ...routePath('public', _public),

  notFound (data, callback) {
    callback(404)
  },
  ping (data, callback) {
    callback(200)
  }
}
