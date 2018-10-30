import BaseComponent from './base-component.js'

class ContainerApp extends BaseComponent {
  constructor () {
    super()

    this.render()
  }

  render () {
    const template = document.createElement('template')

    template.innerHTML = `
      <style>
        * {
          --fill-bg: darkorange;
          
          --border-radius: 20px;
          
          --font-family: Monospace;
        }
        
        :host {
          display: flex;
          
          flex-direction: column;
          
          position: relative;
        }
        
        app-router {
          height: inherit;
        }
      </style>
      <app-header></app-header>
      <app-router></app-router>`

    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  // attributeChangedCallback (attr, oldValue, newValue) {}

  // connectedCallback () {}

  // disconnectedCallback () {}
}

export default ContainerApp
