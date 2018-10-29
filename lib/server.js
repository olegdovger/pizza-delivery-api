const url = require('url')
const http = require('http')
const path = require('path')
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

      let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router.notFound

      chosenHandler = trimmedPath.indexOf('public/') > -1 ? router.public : chosenHandler

      chosenHandler(data, function (statusCode, payload, contentType) {
        contentType = typeof(contentType) === 'string' ? contentType : 'json'
        statusCode = typeof(statusCode) === 'number' ? statusCode : 200

        let payloadString = ''

        if (contentType === 'json') {
          res.setHeader('Content-Type', 'application/json')

          payload = typeof(payload) === 'object' ? payload : {}
          payloadString = JSON.stringify(payload)
        }

        if (contentType === 'html') {
          res.setHeader('Content-Type', 'text/html')
          payloadString = typeof(payload) === 'string' ? payload : ''
        }

        if (contentType === 'favicon') {
          res.setHeader('Content-Type', 'image/x-icon')
          payloadString = typeof(payload) !== 'undefined' ? payload : ''
        }

        if (contentType === 'css') {
          res.setHeader('Content-Type', 'text/css')
          payloadString = typeof(payload) !== 'undefined' ? payload : ''
        }

        if (contentType === 'png') {
          res.setHeader('Content-Type', 'image/png')
          payloadString = typeof(payload) !== 'undefined' ? payload : ''
        }

        if (contentType === 'jpg') {
          res.setHeader('Content-Type', 'image/jpeg')
          payloadString = typeof(payload) !== 'undefined' ? payload : ''
        }

        if (contentType === 'plain') {
          res.setHeader('Content-Type', 'text/plain')
          payloadString = typeof(payload) !== 'undefined' ? payload : ''
        }

        if (contentType === 'js') {
          res.setHeader('Content-Type', 'application/javascript')
          payloadString = typeof(payload) !== 'undefined' ? payload : ''
        }

        if (contentType === 'html') {
          res.setHeader('Content-Type', 'text/html')
          payloadString = typeof(payload) !== 'undefined' ? payload : ''
        }

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
