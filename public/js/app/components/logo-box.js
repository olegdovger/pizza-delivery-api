class LogoBox extends HTMLElement {
  constructor() {
    super()

    this.render()
  }

  render() {
    const template = document.createElement('template')

    const size = parseFloat(this.getAttribute('size') || '1');

    template.innerHTML = `
      <style>
        :host {
          display: flex;
          
          flex-direction: row;
          align-items: center;
          justify-content: center;
          
          position: relative;
          
          height: inherit;
          
          font-family: var(--font-family);
          font-size: ${size * 4}em;
          text-transform: uppercase;
        }
        
        app-router {
          height: inherit;
        }
        
        .wrapper {
          display: inline-flex;
          
          border: white ${size * 5}px solid;
        }
        .logo {
          padding: ${size * 5}px ${size * 10}px;
        }
        
        .hot {
          background: #b10000;
          color: white;
        }
        .pizza {
          background: #fff;
          color: black;
        }
        .delivery {
          background: #69cf6e;
          color: white;
        }
      </style>
      <div class="wrapper">
        <div class="logo hot">Hot</div>
        <div class="logo pizza">Pizza</div>
        <div class="logo delivery">Delivery</div>
      </div>
`

    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

export default LogoBox
