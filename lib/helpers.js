const https = require('https')
const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const {StringDecoder} = require('string_decoder')
const {Buffer} = require('buffer')
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
  async createStripeOrder (cartData, userData) {
    const decoder = new StringDecoder('utf-8')

    let {email, items} = cartData

    return new Promise((resolve, reject) => {

      let buffer = ''
      let stripeItems = []

      if (email && items) {

        const quantity = items.reduce((data, item) => {
          data[item.parent] = {...data[item.parent], ...item}
          data[item.parent] = { quantity: 0, ...data[item.parent] }

          data[item.parent].quantity += 1

          return data
        }, {})

        Object.keys(quantity).forEach(parent => {
          stripeItems.push(quantity[parent])
        })

        let payload = {
          currency: 'usd',
          items: stripeItems,
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

        req.write(stringPayload)

        req.end()
      } else {
        reject(new Error('Given parameters were missing or invalid'))
      }
    })
  },
  async sendEmail (order) {
    const decoder = new StringDecoder('utf-8')

    return new Promise((resolve, reject) => {
      let buffer = ''
      const payload = {
        from: config.mail_from,
        to: order.email,
        subject: 'Successful purchase!',
        text: `
          Dear, ${order.shipping.name}
          You ordered pizza!
          Order number is ${order.id}
        `
      }

      let stringPayload = this.stringify(payload)

      const requestDetails = {
        protocol: 'https:',
        hostname: 'api.mailgun.net',
        method: 'POST',
        path: '/v3/sandboxadab2aefb462424f9cfee0d37e1eabd5.mailgun.org/messages',
        headers: {
          'Authorization': `Basic ${config.mail_auth}`,
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

      req.write(stringPayload)

      req.end()
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
          resolve(helpers.parseJsonToObject(buffer))
        })
        res.on('error', function (err) {
          reject(err)
        })
      })

      req.end()
    })
  },
  async getStaticAsset (fileName) {
    return new Promise((resolve, reject) => {
      fileName = typeof(fileName) === 'string' && fileName.length > 0 ? fileName : false

      if (fileName) {
        let publicDir = path.join(__dirname, '/../public/')

        fs.readFile(`${publicDir}${fileName}`, function (err, data) {
          if (!err && data) {
            resolve(data)
          } else {
            reject(new Error('No file could be found'))
          }
        })
      } else {
        reject(new Error('A valid file name was not specified'))
      }
    })
  },
  async getTemplate (templateName) {
    return new Promise((resolve, reject) => {
      templateName = typeof(templateName) === 'string' && templateName.length > 0 ? templateName : false

      if (templateName) {
        let templatesDir = path.join(__dirname, '/../templates/')

        fs.readFile(`${templatesDir}${templateName}.html`, 'utf8', (err, str) => {
          if (!err && str && str.length > 0) {
            resolve(str)
          } else {
            reject(new Error('No template could be found'))
          }
        })
      } else {
        reject(new Error('A valid template name was not specified'))
      }
    })
  }
}

module.exports = helpers
