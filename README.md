# pizza-delivery-api

The Assignment (Scenario):

Here's the spec:

- [x] New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.
- [x] Users can log in and log out by creating or destroying a token.
- [x] When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system).
- [x] logged-in user should be able to fill a shopping cart with menu items

- [ ] A logged-in user should be able to create an order. You should integrate with the Sandbox of Stripe.com to accept their payment.

      Note: Use the stripe sandbox for your testing.
            Follow this link and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working: https://stripe.com/docs/testing#cards

- [ ] When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this. Note: Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account
