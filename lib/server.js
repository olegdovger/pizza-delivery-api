const url = require('url')
const http = require('http')
const config = require('./config')
const { StringDecoder } = require('string_decoder')
const util = require('util')
const debug = util.debuglog('server')

const helpers = require('./helpers')
const router = require('./router')

class Server {
  constructor () {
    this.httpServer = http.createServer((req, res) => {
      this.unifiedServer(req, res)
    })
  }

  unifiedServer (req, res) {
    const parsedUrl = url.parse(req.url, true)

    const {pathname} = parsedUrl
    const queryStringObject = parsedUrl.query

    const trimmedPath = pathname.replace(/^\/+|\/+$/g, '')

    const method = req.method.toLowerCase()
    const {headers} = req

    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers
    }

    this._requestEvents(req, res, data, trimmedPath, method)
  }

  _requestEvents (req, res, data, trimmedPath, method) {
    let buffer = ''
    const decoder = new StringDecoder('utf-8')

    req.on('data', data => {
      buffer += decoder.write(data)
    })
    req.on('end', _ => {
      buffer += decoder.end()

      data.payload = helpers.parseJsonToObject(buffer)

      const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router.notFound

      chosenHandler(data, function (statusCode, payload) {
        statusCode = typeof(statusCode) === 'number' ? statusCode : 200
        payload = typeof(payload) === 'object' ? payload : {}

        const payloadString = JSON.stringify(payload)

        res.setHeader('Content-Type', 'application/json')
        res.writeHead(statusCode)
        res.end(payloadString)

        if (statusCode === 200) {
          debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode)
        } else {
          debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode)
        }
      })
    })
  }

  init () {
    this.httpServer.listen(config.httpPort, _ => {
      console.log('\x1b[35m%s\x1b[0m', 'The HTTPS server is running on port ' + config.httpPort)
    })
  }
}

module.exports = new Server()