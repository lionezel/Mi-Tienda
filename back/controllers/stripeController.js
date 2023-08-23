const stripe = require("stripe")

 // Create a PaymentIntent with the order amount and currency
 const paymentIntent = await stripe.paymentIntents.create({
  amount: calculateOrderAmount(items),
  currency: "usd",
  automatic_payment_methods: {
    enabled: true,
  },
});

res.send({
  clientSecret: paymentIntent.client_secret,
});

const stripe = Stripe("pk_test_51NT5sxA3IiAitvScuPk2zipHni5eokeSQDy60bORCwhXZLoofp6btxl0Df5BDMNghV6IHi8iFolaZq0dLxSsLDqn006CzRy5Rr");

// The items the customer wants to buy
const items = [{ id: "xl-tshirt" }];

let elements;

initialize();
checkStatus();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

let emailAddress = '';
// Fetches a payment intent and captures the client secret
async function initialize() {
  const response = await fetch("/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  const { clientSecret } = await response.json();

  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({ appearance, clientSecret });

  const linkAuthenticationElement = elements.create("linkAuthentication");
  linkAuthenticationElement.mount("#link-authentication-element");

  linkAuthenticationElement.on('change', (event) => {
    emailAddress = event.value.email;
  });

  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
}