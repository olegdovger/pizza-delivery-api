class Handler {
  process (data, callback) {
    const method = this[data.method]

    if (method) {
      method(data, callback)
    } else {
      callback(405)
    }
  }

  async post (data, callback) {
    callback(405)
  }
  async get (data, callback) {
    callback(405)
  }
  async put (data, callback) {
    callback(405)
  }
  async delete (data, callback) {
    callback(405)
  }
}

module.exports = Handler
