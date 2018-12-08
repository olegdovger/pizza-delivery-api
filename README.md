# pizza-delivery-api

To run example:

`nvm use`

`MAIL_API_KEY= STRIPE_API_KEY= node index.js`

or

create .env file and type params there

## 1 ) The Assignment for building API (Scenario):

Here's the spec:

- [x] New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.
- [x] Users can log in and log out by creating or destroying a token.
- [x] When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system).
- [x] logged-in user should be able to fill a shopping cart with menu items

- [x] A logged-in user should be able to create an order. You should integrate with the Sandbox of Stripe.com to accept their payment.

      Note: Use the stripe sandbox for your testing.
            Follow this link and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working: https://stripe.com/docs/testing#cards

- [x] When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this. Note: Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account

REST API:

`/api/users`

- `GET`
- `POST`
- `PUT`
- `DELETE` - delete token and shopping cart also

`/api/users/login`

- `POST` - create token

`/api/users/logout`

- `POST` - delete token

`/api/pizzas`

- `GET` - show all items. Retrieve sku data from Stripe account and write it into files

Example of pizza object with `attributes` param:

```
{
  "id": "sku_DRhEr9C8z2I3HO",
  "object": "sku",
  "active": true,
  "attributes": {
    "size": "big",
    "type": "margarita"
  },
  "created": 1534673300,
  "currency": "usd",
  "image": "http://like-pizza.by/wp-content/uploads/2015/12/Pepperoni-Pizza-PNG-Image.png",
  "inventory": {
    "quantity": null,
    "type": "bucket",
    "value": "in_stock"
  },
  "livemode": false,
  "metadata": {},
  "package_dimensions": null,
  "price": 1800,
  "product": "prod_DRh99atitAZFEw",
  "updated": 1534799228
}
```

`/api/shopping-cart`

- `POST` - create a shopping cart with sku params from Stripe

`/api/order`

- `POST` - create an order and send email to user about his/her purchase nad delete shopping cart

## 2) The Assignment for building Web App (Scenario):

Please create a web app that allows customers to:

- [x] Signup on the site
- [x] View all the items available to order
- [x] Fill up a shopping cart
- [x] Place an order (with fake credit card credentials), and receive an email receipt

## 3) The Assignment for building CLI (Scenario):

- [x] View all the current menu items
- [x] View all the recent orders in the system (orders placed in the last 24 hours)
- [x] Lookup the details of a specific order by order ID
- [x] View all the users who have signed up in the last 24 hours
- [x] Lookup the details of a specific user by email address
