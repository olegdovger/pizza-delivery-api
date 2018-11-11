import BaseComponent from './base-component.js'
import config from '../../config.js'

class ContainerAppHeader extends BaseComponent {
  constructor () {
    super()

    this.render()

    window.addEventListener('hashchange', this.defineLogoState.bind(this));

    this.defineLogoState()
  }
  hasSession() {
    return !!window.localStorage.getItem('auth-data')
  }
  defineLogoState () {
    this.showLogo = window.location.hash.length >= 0;

    if (this.showLogo) {
      this.$('logo-box').removeAttribute('style')
    } else {
      this.$('logo-box').setAttribute('style', 'visibility: hidden;')
    }

    this.$$('[data-type-auth]').forEach(el => {
      el.removeAttribute('style')
    })

    if (this.hasSession()) {
      this.$$('[data-type-auth="false"]').forEach(el => {
        el.setAttribute('style', 'display: none;')
      })
    } else {
      this.$$('[data-type-auth="true"]').forEach(el => {
        el.setAttribute('style', 'display: none;')
      })
    }
  }
  render () {
    const template = document.createElement('template')

    this.showLogo = window.location.hash.length >= 0 && window.location.hash !== '#/';

    template.innerHTML = `
      <style>
        :host {
          position: absolute;
          z-index: 1;
          
          width: 100%;
          
          color: white;
          
          font-family: var(--font-family, Tahoma),serif;
          font-size: 16px;
        }
        .header {
          display: flex;
          
          flex-direction: row;
          justify-content: space-between;
          
          margin: 30px 25px;
        }
        .logo {
          white-space: nowrap;
          
          font-size: 20px;
          
          border: white 2px solid;
        }
        .hot-logo {
          background: #b10000;
          padding: 5px;
        }
        .pizza-logo {
          color: black;
          background: #fff;
          padding: 5px;
        }
        .delivery-logo {
          background: #69cf6e;
          padding: 5px;
        }
        .menu {
          display: flex;
          
          align-items: stretch;
          justify-content: space-around;
          
          flex-direction: row;
          
          /*width: 200px;*/
        }
        
        .menu-item {
          color: white;
          margin: 0 20px;
        }
      </style>
      <div class="header">
        <logo-box size="0.25"></logo-box>
        <div class="menu">
          <a href="/#/signup" data-type-auth="false" class="menu-item">Sign up</a>
          <a href="/#/index" data-type-auth="true" class="menu-item" id="logout">Logout</a>
          <a href="/#/login" data-type-auth="false" class="menu-item">Login</a>
        </div>
      </div>
    `

    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    let logoutSelector = this.$('[data-type-auth="true"]')

    if (logoutSelector) {
      logoutSelector.addEventListener('click', async _ => {
        const { email, tokenId } = JSON.parse(window.localStorage.getItem('auth-data'))

        await this.clearShoppingCart()

        const rawResponse = await fetch(`${config.base_url}/api/users/logout`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            email,
            token: tokenId
          }
        });

        const content = await rawResponse.json();

        if (content.Error) {
          console.log(content.Error);

          if (rawResponse.status === 403) {
            window.localStorage.removeItem('auth-data')

            window.location.hash = '#/login'
          }
        } else {
          window.localStorage.removeItem('auth-data')

          this.defineLogoState()
        }
      })
    }
  }

  async clearShoppingCart() {
    const { email, tokenId } = JSON.parse(localStorage.getItem('auth-data'))

    await fetch(`${config.base_url}/api/shopping-cart`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        email,
        token: tokenId
      }
    })

    window.localStorage.removeItem('selected-items')
  }
}

export default ContainerAppHeader
