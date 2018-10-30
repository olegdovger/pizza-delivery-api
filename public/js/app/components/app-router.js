import config from '../../config.js'

const pagesShorthands = {
  '/' : '/index'
}
const routes = {
  '/signup-successful': {
    auth: true
  }
}

const pagesStorage = {}

class AppRouter extends HTMLElement {
  connectedCallback () {
    this.pagesStorage = pagesStorage

    window.onhashchange = this.render.bind(this)
    this.render()
  }

  cache (func) {
    return async (page, options) => {
      return new Promise(async resolve => {
        this.pagesStorage[page] = this.pagesStorage[page] || await func(page, options)
        resolve(this.pagesStorage[page])
      })
    }
  }

  hasSession() {
    return !!window.localStorage.getItem('auth-data')
  }

  async fetchPage (page = '/index', opts = {}) {
    if (!this.hasSession()) {
      if (!['/login', '/signup', '/index'].includes(page)) {
        page = '/login'
      }
    } else {
      if (['/login', '/signup'].includes(page)) {
        // page = '/index'
      }
    }

    let rawResponse = await fetch(`${config.base_url}/public/js/app/pages${page}.html`)

    if (rawResponse.status === 404) {
      rawResponse = await fetch(`${config.base_url}/public/js/app/pages/not-found.html`)
    }

    window.location.hash = `#${page}`

    return await rawResponse.text()
  }

  async render () {
    let hash = document.location.hash

    const pageString = hash && hash.split('#')[1] || '/index'

    // const cacheFetchPage = this.cache(this.fetchPage.bind(this))
    const cacheFetchPage = this.fetchPage.bind(this)

    let page = pagesShorthands[pageString] ? pagesShorthands[pageString] : pageString

    this.innerHTML = await cacheFetchPage(page, routes[page])
  }
}

export default AppRouter
