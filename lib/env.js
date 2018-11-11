const fs = require('fs')

class Env {
  constructor () {
    this.variables = []

    this._setup()
  }

  _setup () {
    try {
      const data = fs.readFileSync(`${__dirname}/../.env`, {encoding: 'utf-8'})
      const stringArray = data.split('\n')

      this.variables = stringArray.map(string => {
        const arr = string.split('=')
        return {
          name: arr[0],
          value: arr[1]
        }
      })
    } catch (e) {
      //
      console.log(e)
    }
  }

  load () {
    this.variables.forEach(variable => {
      process.env[variable.name] = variable.value
    })
  }
}

module.exports = new Env()
