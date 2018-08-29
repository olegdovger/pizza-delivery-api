const api = require('./api')

function routePath (namespace, routeObj) {
  Object.keys(routeObj).forEach(key => {
    routeObj[`${namespace}/${key}`] = routeObj[key]
    delete routeObj[key]
  })

  return routeObj
}

module.exports = {
  ...routePath('api', api)
}
