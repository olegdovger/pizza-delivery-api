const https = require('https')
const crypto = require('crypto')
const querystring = require('querystring')
const {StringDecoder} = require('string_decoder')

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
  },
  stringify (obj, str = '', namespace) {
    for (const property in obj) {
      if (obj.hasOwnProperty(property)) {

        if (Array.isArray(obj[property])) {

          obj[property].forEach(item => {
            str = this.stringify(item, str, `${property}[]`)
          })

        } else if (typeof obj[property] === 'object') {

          if (namespace) {
            return this.stringify(obj[property], str, `${namespace}[${property}]`)
          } else {
            return this.stringify(obj[property], str, property)
          }

        } else {

          if (namespace) {
            str += `&${namespace}[${property}]=${obj[property]}`//?
          } else {
            if (!str) {
              str += `${property}=${obj[property]}`//?
            } else {
              str += `&${property}=${obj[property]}`//?
            }
          }
        }
      }
    }

    return str
  },
  async createStripeOrder (cartData, userData, callback) {
    const decoder = new StringDecoder('utf-8')

    let {email, items} = cartData

    return new Promise((resolve, reject) => {

      let buffer = ''
      let stripeItems = []

      if (email && items) {
        let payload = {
          currency: 'usd',
          items,
          email,
          shipping: {
            name: `${userData.firstName} ${userData.lastName}`,
            address: {
              line1: userData.streetAddress
            }
          }
        }

        let stringPayload = this.stringify(payload)

        let requestDetails = {
          protocol: 'https:',
          hostname: 'api.stripe.com',
          method: 'POST',
          path: `/v1/orders`,
          headers: {
            'Authorization': `Bearer ${config.stripe_api_key}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }

        const req = https.request(requestDetails, (res) => {
          res.on('data', (data) => {
            buffer += decoder.write(data)
          })
          res.on('end', (data) => {
            buffer += decoder.end()
            let rslt = this.parseJsonToObject(buffer)

            if (!rslt.error) {
              resolve(rslt)
            } else {
              reject(new Error(rslt.error.message))
            }
          })
          res.on('error', function (err) {
            reject(err)
          })
        })

        console.log('stringPayload', stringPayload)
        req.write(stringPayload)

        req.end()
      } else {
        callback('Given parameters were missing or invalid')
      }
    })
  },
  async getStripeSKUs () {
    const decoder = new StringDecoder('utf-8')

    return new Promise((resolve, reject) => {

      let buffer = ''

      let requestDetails = {
        protocol: 'https:',
        hostname: 'api.stripe.com',
        method: 'GET',
        path: `/v1/skus`,
        headers: {
          'Authorization': `Bearer ${config.stripe_api_key}`,
          'Content-Type': 'application/json'
        }
      }

      const req = https.request(requestDetails, (res) => {

        res.on('data', (data) => {
          buffer += decoder.write(data)
        })
        res.on('end', (data) => {
          buffer += decoder.end()
          console.log('buffer', buffer)
          resolve(helpers.parseJsonToObject(buffer))
        })
        res.on('error', function (err) {
          reject(err)
        })
      })

      req.end()
    })
  }
}

module.exports = helpers
