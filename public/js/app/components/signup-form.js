import BaseComponent from './base-component.js'
import config from '../../config.js'

class SignupForm extends BaseComponent {
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
        }

        form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          
          
          width: 200px;
        }

        input {
          margin: 10px 0;
          
          padding: 5px 5px;
          
          font-family: var(--font-family);
          font-size: 14px;
          
          outline: 3px solid darkslategray;
          
          outline-offset: -3px;
        }
        input:focus {
          outline-offset: 2px;
          outline-color: lightcoral;
        }
        
        button {
          background: yellowgreen;
          
          outline-offset: -3px;
          outline: 3px solid darkslategray;
          
          border: 3px solid darkslategray;
          cursor: pointer;

          font-family: var(--font-family);
          font-size: 14px;

          margin-top: 10px;
          
          padding: 4px 6px;
        }
        
        a {
          color: white;
          
          font-family: var(--font-family);
          font-size: 14px;
          
          text-align: center;
          
          margin-top: 5px;
        }
        
        button:hover {
          outline: 3px solid lightcoral;
          /*border: 3px solid lightcoral;*/
        }
        
        .error-block {
          color: white;
          margin: 5px 0;
          height: 18px;
          opacity: 0;
          
          text-shadow: red 0 0 1px;
          font-family: var(--font-family);
          font-size: 14px;
        }
        .error-block__visible {
          opacity: 1;
          
          -webkit-animation: error 1s;
          animation: error 1s;

          -webkit-animation-timing-function: ease;
          animation-timing-function: ease;
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
      <form>
        <input type="text" name="email" placeholder="Email">
        <input type="password" name="password" placeholder="Password">
        <input type="text" name="first_name" placeholder="First name">
        <input type="text" name="last_name" placeholder="Last name">
        <input type="text" name="user_address" placeholder="User address">
        
        <button type="submit">Sign up</button>
        
        <div class="error-block"></div>
      </form>
    `

    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    let form = this.$('form')

    this.__submitHandler = this.__submit.bind(this)
    this.$('form').addEventListener('submit', this.__submitHandler)
  }

  async __submit(e) {
    e.preventDefault()

    const email = this.$('input[name=email]').value;
    const password = this.$('input[name=password]').value;
    const firstName = this.$('input[name=first_name]').value;
    const lastName = this.$('input[name=last_name]').value;
    const streetAddress = this.$('input[name=user_address]').value;

    let $error = this.$('.error-block')
    $error.classList.remove('error-block__visible');
    this.$('[type="submit"]').disabled = true;

    const rawResponse = await fetch(`${config.base_url}/api/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        streetAddress,
        password
      })
    });
    const content = await rawResponse.json();

    if (content.Error) {
      this.error = content.Error;

      $error.innerText = this.error;
      $error.classList.add('error-block__visible');
    } else {
      window.location.hash = '#/signup-successful';
    }

    this.$('[type="submit"]').disabled = false;
  }
}

export default SignupForm
