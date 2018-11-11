import BaseComponent from './base-component.js'
import config from '../../config.js'

class ShoppingCart extends BaseComponent {
  connectedCallback () {
    this.render()
  }

  render () {
    let items = JSON.parse(window.localStorage.getItem('selected-items')).items

    let uniqueItems = {}

    items.forEach(item => {
      let key = `${item.name}${item.size}`;
      let uniqueItem = uniqueItems[key] || {
        count: 0,
        price: 0,
        itemPrice: item.price,
        name: `${item.name} (${item.size})`
      };
      uniqueItem.count += 1
      uniqueItem.price += item.price

      uniqueItems[key] = uniqueItem
    })

    const itemsString = Object.keys(uniqueItems).reduce((result, key) => {
      const item = uniqueItems[key];
      result +=`
        <div class="item">
          <div class="item_name">${item.name}</div>
          <div class="item_price">${item.count} x ${this.price(item.itemPrice)} = ${this.price(item.price)}</div>
        </div>
      `

      return result
    }, '')

    const totalPrice = items.reduce((result, item) => {
      result += item.price

      return result
    }, 0)

    const template = document.createElement('template')

    template.innerHTML = `
      <style>
        :host {
          font-family: var(--font-family);

          display: flex;
          justify-content: center;
          
          align-content: center;
          
          height: inherit;
        }
        
        .items {
          display: flex;
          flex-direction: column;
          justify-content: center;
          
          color: white;
          width: 350px;
        }
        .item {
          display: flex;
          
          justify-content: space-between;
          
          border-bottom: 1px dashed white;
          
          font-family: var(--font-family);

          padding: 10px 0;
        }
        
        .item__total {
          justify-content: flex-end;
          
          font-family: var(--font-family);
        }

        button {
          width: 100px;
          font-family: var(--font-family);
          
          background: none;
          
          color: white;
          
          border: 1px solid white;
          
          border-radius: 2px;
          
          outline: none;
          
          height: 25px;
        }

        button:hover {
          cursor: pointer;
        }
        
        .button__clear {
          border: none;
        }
        
        .buttons {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          
          margin-top: 15px;

          color: white;
          width: 350px;
        }
        .button {
          justify-content: flex-start;
        }
        .button__end {
          justify-content: flex-end;
        }
        .go-back {
          align-content: center;
          width: 100%;

          border: none;
        }
        .go-back:hover {
          text-decoration: underline;
        }
      </style>
      <div class="items">
        <button class="go-back">Go back to shop</button>
        ${itemsString}
        <div class="item">
          <div class="item_name">Total</div>
          <div class="item_price">${this.price(totalPrice)}</div>
        </div>
        <div class="buttons">
          <button class="button button__clear">Clear</button>
          <button class="button button__buy">Buy</button>
        </div>
      </div>`

    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.shadowRoot.querySelector('.button__clear').addEventListener('click', _ => {
      this.deleteCart();
    })
    this.shadowRoot.querySelector('.go-back').addEventListener('click', _ => {
      this.back();
    })
    this.shadowRoot.querySelector('.button__buy').addEventListener('click', _ => {
      this.buy();
    })
  }

  price(number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)
  }

  async deleteCart() {
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

    localStorage.removeItem('selected-items')

    window.location.hash = '#/main'
  }

  async buy() {
    const { email, tokenId } = JSON.parse(localStorage.getItem('auth-data'))

    const rawResponse = await fetch(`${config.base_url}/api/order`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        email,
        token: tokenId
      }
    })

    const content = await rawResponse.json();

    if (content.Error) {
      //
    } else {
      window.location.hash = '#/receipt-was-sent';
    }
  }

  back() {
    window.location.hash = '#/main'
  }
}

export default ShoppingCart
