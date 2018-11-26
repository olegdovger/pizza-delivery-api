const readLine = require('readline')
const util = require('util')
const debug = util.debuglog('util')
const EventClass = require('events')

const dao = require('./dao')

class Events extends EventClass {}

class CLI {
  constructor () {
    this.commands = {
      'exit': 'Kill the CLI (and the rest of the application)',
      'man': 'Show this help page',
      'help': 'Alias of the "man" command',
      'show items': 'Show all the current menu items',
      'show orders': 'Show all orders in the system',
      'show order --{id}': 'Show the details of a specific order by order ID',
      'show active users': 'Show all the users who have signed up in the last 24 hours',
      'show user --{email}': 'Show the details of a specific user by email address'
    }

    this.events = new Events()

    this.events.on('man', this.onHelp.bind(this))
    this.events.on('help', this.onHelp.bind(this))
    this.events.on('exit', this.onExit.bind(this))

    this.events.on('show items', this.onShowItems.bind(this))
    this.events.on('show orders', this.onShowOrders.bind(this))
    this.events.on('show order --{id}', this.onShowOrder.bind(this))
    this.events.on('show active users', this.onShowUsers.bind(this))
    this.events.on('show user --{email}', this.onShowUser.bind(this))
  }

  init () {
    console.log('\x1b[34m%s\x1b[0m', 'The CLI is running')

    this._interface = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    })

    this._interface.prompt()

    this._interface.on('line', str => {
      this.processInput(str)

      this._interface.prompt()
    })

    this._interface.on('close', function () {
      process.exit(0)
    })
  }

  processInput (str) {
    str = typeof (str) === 'string' && str.trim().length > 0 ? str.trim() : false

    if (str) {
      const uniqueInputs = [
        'exit',
        'man',
        'help',
        'show items',
        'show orders',
        'show order --{id}',
        'show active users',
        'show user --{email}'
      ]

      let matchFound = false
      let counter = 0

      const foundedInput = uniqueInputs.find(input => str.toLowerCase().indexOf(input) > -1)

      if (foundedInput) {
        this.events.emit(foundedInput, str)

        return true
      } else {
        console.log('Sorry, try again')
      }
    }
  }

  horizontalLine () {
    console.log('-'.repeat(process.stdout.columns))
  }

  centered (text) {
    text = typeof (text) === 'string' && text.trim().length > 0 ? text.trim() : ''

    const width = process.stdout.columns

    const leftPadding = Math.floor((width - text.length) / 2)

    console.log(' '.repeat(leftPadding), text)
  }

  verticalSpace (lines) {
    lines = typeof (lines) === 'number' && lines > 0 ? lines : 1

    console.log('\n'.repeat(lines - 1))
  }

  onHelp () {
    this.horizontalLine()
    this.centered('CLI MANUAL')
    this.horizontalLine()
    this.verticalSpace(1)

    Object.keys(this.commands).forEach(command => {
      const description = this.commands[command]
      let line = `\x1b[33m${command}\x1b[0m`

      const padding = 60 - line.length

      line += ' '.repeat(padding) + description

      console.log(line)
    })

    this.verticalSpace()
    this.horizontalLine()
  }

  onExit () {
    console.log('You asked for exit')

    process.exit()
  }

  onShowItems () {}

  onShowOrders () {}

  onShowOrder (id) {}

  async onShowUsers () {
    const { items } = await dao.fs.listSync('users').catch(e => e)

    const users = items

    if (!(users instanceof Error)) {
      this.verticalSpace()

      users.forEach(async user => {
        const {
          firstName,
          lastName,
          email
        } = user

        console.log(`${firstName} ${lastName}, ${email}`)
      })

    } else {
      console.log('\x1b[31m%s\x1b[0m', 'Create directory "users"')
    }

    this._interface.prompt()
  }

  onShowUser (email) {}
}

module.exports = new CLI()