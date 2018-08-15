class Handler {
  static process (data, callback) {
    const method = this[data.method]

    if (method) {
      method(data, callback)
    } else {
      callback(405)
    }
  }

  static async post (data, callback) {
    callback(405)
  }
  static async get (data, callback) {
    callback(405)
  }
  static async put (data, callback) {
    callback(405)
  }
  static async delete (data, callback) {
    callback(405)
  }
}

module.exports = Handler