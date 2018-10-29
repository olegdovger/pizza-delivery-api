import BaseComponent from './base-component.js'

class Confirmation extends BaseComponent {
  constructor () {
    super()

    this.render()
  }
  render() {
    const template = document.createElement('template')

    template.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-content: center;
          height: inherit;
          
          opacity: 1;
          
          -webkit-animation: error 1s;
          animation: error 1s;

          -webkit-animation-timing-function: ease;
          animation-timing-function: ease;
        }

        .block {
          display: flex;
          justify-content: center;
          
          flex-direction: column;
          
          width: 600px;
        }
        
        .title {
            color: white;

            font-family: var(---font-family);
            font-size: 1.5em;
            
            text-align: center;
        }
        .content {
            color: white;

            font-family: var(---font-family);
            font-size: 1.2em;
            
            text-align: center;
        }
        
        .content {
            font-family: var(---font-family);
            font-size: 1em;
        }
        
        @-webkit-keyframes error {
            from {opacity: 0;}
            to {opacity: 1;}
        }
        
        @keyframes error {
            from {opacity: 0;}
            to {opacity: 1;}
        }
      </style>
      <div class="block">
        <p class="title">
          <slot name="title">Confirmation</slot>
        </p>
        <p class="content">
          <slot name="text">Text here</slot>
        </p>
      </div>
    `

    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

export default Confirmation
