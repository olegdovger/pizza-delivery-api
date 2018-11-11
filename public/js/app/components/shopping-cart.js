import BaseComponent from './base-component.js'

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
          <div class="item_price">${item.count} x ${item.itemPrice} = ${item.price}</div>
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
          width: 250px;
        }
        .item {
          display: flex;
          
          justify-content: space-between;
          
          border-bottom: 1px dashed white;
          
          font-family: var(--font-family);
        }
        
        .item__total {
          justify-content: flex-end;
          
          font-family: var(--font-family);
        }
      </style>
      <div class="items">
        ${itemsString}
        <div class="item item__total">${totalPrice}</div>
      </div>`

    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

export default ShoppingCart
