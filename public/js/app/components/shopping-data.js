import BaseComponent from './base-component.js'
import config from '../../config.js'

class ShoppingData extends BaseComponent {
  connectedCallback () {
    this.data = { items: [] }
    this.selectedItems = { items: [] }
    this.render()
  }

  async render() {
    const template = document.createElement('template')

    await this.loadData()

    const str = this.data.items.reduce((rslt , item) => {
      rslt += `
        <div class="item">
          <div class="item_name">${item.attributes.type}</div>
          <img src="${item.image}"/>
          <footer>
            <button data-item-id="${item.id}">Add</button>
            <div class="price">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price/100)}</div>
          </footer>
        </div>
      `
      return rslt
    },'')

    template.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          
          align-content: center;
          
          height: inherit;
        }
        .cards {
          display: flex;
          flex-direction: column;
          justify-content: center;
          
          
          width: 200px;
        }
        .item {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          
          width: 200px;
          min-height: 200px;

          padding: 5px 15px;
          margin: 5px;
          
          border: 1px solid white;
          border-radius: 2px;
          
          color: white;
          
          font-family: var(--font-family);
        }
        
        img {
          width: 100%;
          
          height: 150px;
          
          border-radius: 2px;
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
          cursor: pointer
        }
        
        footer {
          display: flex;

          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          
          width: 100%;
        }
      </style>
      <div class="cards">${str}</div>`

    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.shadowRoot.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', ({target}) => {
        this.addItem(target)
      })
    })
  }

  async loadData() {
    const { email, tokenId } = JSON.parse(localStorage.getItem('auth-data'))

    const rawResponse = await fetch(`${config.base_url}/api/pizzas`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        email,
        token: tokenId
      }
    });

    this.data = await rawResponse.json()
  }

  addItem({ dataset: { itemId }}) {
    console.log(itemId, this.data.items.find(({id}) => id === itemId));

    const item = this.data.items.find(({id}) => id === itemId)

    this.selectedItems.items.push({
      name: item.attributes.type,
      size: item.attributes.size,
      price: item.price / 100
    })

    window.localStorage.setItem('selected-items', JSON.stringify(this.selectedItems))

    this.triggerEvent('shopping-cart')
  }
}

export default ShoppingData
