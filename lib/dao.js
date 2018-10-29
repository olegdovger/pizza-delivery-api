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
          let stringData = JSON.stringify(data, null, 2)

          fs.writeFile(fileDescriptor, stringData, function (err) {
            if (!err) {
              fs.close(fileDescriptor, function (err) {
                if (!err) {
                  resolve(data)
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

          let stringData = JSON.stringify(data, null, 2)

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
          resolve(false)
        } else {
          reject(error)
        }
      })
    })
  }

  listSync (dir) {
    const readSync = this.readSync
    return new Promise((resolve, reject) => {
      fs.readdir(`${baseDir}${dir}/`, async function (err, data) {
        if (!err) {
          let items = []

          for (let index = 0; index < data.length; index += 1) {
            let fileName = data[index]

            let name = fileName.replace('.json', '')
            let item = await readSync(dir, name)

            items.push(item)
          }

          resolve({items})
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
