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
                  reject('Error closing new file')
                }
              })
            } else {
              reject('Error writing to new file')
            }
          })
          //resolve({err, fileDescriptor})
        } else {
          reject('Could not create new file, it may already exist')
        }
      })
    })
  }

  readSync (dir, file) {
    return new Promise((resolve, reject) => {
      fs.readFile(baseDir + dir + '/' + file + '.json', 'utf8', function (err, data) {
        if (!err && data) {
          resolve(helpers.parseJsonToObject(data))
        } else {
          reject({err, data})
        }
      })
    })
  }

  updateSync(dir, file, data) {
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
                      reject('Error closing existing file')
                    }
                  })
                } else {
                  reject('Error writing to existing file')
                }
              })
            } else {
              reject('Error truncating file')
            }
          })
        } else {
          reject('Could not open file for updating, it may not exist yet')
        }
      })
    })
  }

  deleteSync(dir, file) {
    return new Promise((resolve, reject) => {
      fs.unlink(baseDir + dir + '/' + file + '.json', function (err) {
        if(!err) {
          resolve(err)
        } else {
          reject(err)
        }
      })
    })
  }
}

module.exports = {
  fs: new FSDAO()
}