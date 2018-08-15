const fs = require('fs')
const path = require('path')
const helpers = require('./helpers')

baseDir = path.join(__dirname, '/../.data/')

class DAO {
  createSync () {}
  readSync () {}
  updateSync () {}
  deleteSync () {}
}

class FSDAO extends DAO {

  createSync (dir, file, data) {
    return new Promise((resolve, reject) => {
      fs.open(baseDir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
          let stringData = JSON.stringify(data)

          fs.writeFile(fileDescriptor, stringData, function (err) {
            if (!err) {
              fs.close(fileDescriptor, function (err) {
                if (!err) {
                  resolve(false)
                } else {
                  reject(new Error('Error closing new file'))
                }
              })
            } else {
              reject(new Error('Error writing to new file'))
            }
          })
        } else {
          reject(new Error('Could not create new file, it may already exist'))
        }
      })
    })
  }

  readSync (dir, file) {
    return new Promise((resolve, reject) => {
      fs.readFile(baseDir + dir + '/' + file + '.json', 'utf8', function (error, data) {
        if (!error && data) {
          resolve(helpers.parseJsonToObject(data))
        } else {
          reject(error)
        }
      })
    })
  }

  updateSync (dir, file, data) {
    return new Promise((resolve, reject) => {
      fs.open(baseDir + dir + '/' + file + '.json', 'r+', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {

          let stringData = JSON.stringify(data)

          fs.ftruncate(fileDescriptor, function (err) {
            if (!err) {
              fs.writeFile(fileDescriptor, stringData, function (err) {
                if (!err) {
                  fs.close(fileDescriptor, function (err) {
                    if (!err) {
                      resolve(false)
                    } else {
                      reject(new Error('Error closing existing file'))
                    }
                  })
                } else {
                  reject(new Error('Error writing to existing file'))
                }
              })
            } else {
              reject(new Error('Error truncating file'))
            }
          })
        } else {
          reject(new Error('Could not open file for updating, it may not exist yet'))
        }
      })
    })
  }

  deleteSync (dir, file) {
    return new Promise((resolve, reject) => {
      fs.unlink(baseDir + dir + '/' + file + '.json', function (error) {
        if (!error) {
          resolve({})
        } else {
          reject(error)
        }
      })
    })
  }
}

module.exports = {
  fs: new FSDAO()
}
