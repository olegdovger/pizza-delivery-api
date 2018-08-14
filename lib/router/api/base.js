class Handler {
  static process (data, callback) {
    const method = this[data.method]

    if (method) {
      method(data, callback)
    } else {
      callback(405)
    }
  }

  static post (data, callback) {
    callback(405)
  }
  static get (data, callback) {
    callback(405)
  }
  static put (data, callback) {
    callback(405)
  }
  static delete (data, callback) {
    callback(405)
  }
}

module.exports = Handler