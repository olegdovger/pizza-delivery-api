class BaseComponent extends HTMLElement {
  constructor () {
    super()

    this.__toggleAttrsCache = {}
  }

  // render () {}

  // attributeChangedCallback (attr, oldValue, newValue) {}

  // connectedCallback () {}

  // disconnectedCallback () {}
  attr (attr, value) {
    if (value) {
      this.setAttribute(attr, value)
    } else {
      return this.getAttribute(attr)
    }
  }

  rmAttr(attr) {
    this.removeAttribute(attr)
  }

  toggleAttr (attr) {
    const value = this.attr(attr)

    if (value) {
      this.__toggleAttrsCache[attr] = value

      this.rmAttr(attr)
    } else {
      this.attr(attr, this.__toggleAttrsCache[attr])
    }

  }

  triggerEvent(name, props = {}) {
    window.dispatchEvent(new CustomEvent(name, {
      detail: Object.assign({
        bubbles: true
      }, props)
    }))
  }

  addEvent(name, func) {
    window.addEventListener(name, func)
  }
  removeEvent(name, func) {
    window.removeEventListener(name, func)
  }

  $(string) {
    return this.shadowRoot.querySelector(string)
  }
  $$(string) {
    return this.shadowRoot.querySelectorAll(string)
  }
}

export default BaseComponent
