import BaseComponent from './base-component.js'

class ShoppingCartMini extends BaseComponent {
  connectedCallback () {
    this.render()
  }

  render() {
    let itemsData = window.localStorage.getItem('selected-items') || '{"items":[]}'
    let items = JSON.parse(itemsData).items
    let price = items.reduce((sum, item) => sum += item.price, 0)

    const template = document.createElement('template')

    template.innerHTML = `
      <style>
        :host {
          font-family: var(--font-family);
          
          position: absolute;
          
          bottom: 10px;
          left: 10px;         
        }
        
        .cart {
          display: flex;
          
          flex-direction: column;
          justify-content: center;
          
          align-content: center;
          align-items: flex-end;
          
          padding: 10px;
          
          border-radius: 2px;
          border: 1px solid white;
          
          color: white;
        }
        
        .count, .price {
          margin-bottom: 5px;
          
          font-size: 1.25em;
        }
        
        button {
          width: 150px;
          font-family: var(--font-family);
          
          background: none;
          
          color: white;
          
          border: 1px solid white;
          
          border-radius: 2px;
          
          outline: none;
          
          height: 25px;
        }
        
        button:hover {
          cursor: pointer
        }
      </style>
      <div class="cart">
        <div class="count">${items.length} pizzas</div>
        <div class="price">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}</div>
        <button>Go to cart</button>
      </div>`

    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.shadowRoot.querySelector('button').addEventListener('click', () => {
      window.location.hash = '#/cart'
    })

    this.addEvent('shopping-cart', _ => {
      let items = JSON.parse(window.localStorage.getItem('selected-items')).items

      let totalPrice = items.reduce((sum, i) => sum + i.price, 0)

      let totalPriceString = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPrice)

      console.log('items price', totalPriceString)

      this.shadowRoot.querySelector('.price').innerText = totalPriceString
      this.shadowRoot.querySelector('.count').innerText = `${items.length} pizzas`
    })
  }
}

export default ShoppingCartMini
