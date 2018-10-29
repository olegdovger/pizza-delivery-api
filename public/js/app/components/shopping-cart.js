import BaseComponent from './base-component.js'

class ShoppingCart extends BaseComponent {
  connectedCallback () {
    this.render()
  }

  render() {
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
      </style>
      <div class="items">
        <div class="item">
          1
        </div>
        <div class="item">
          1
        </div>
        <div class="item">
          1
        </div>
        <div class="item">
          1
        </div>
        <div class="item">
          1
        </div>
      </div>`

    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

export default ShoppingCart
