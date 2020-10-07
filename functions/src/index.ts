import * as functions from 'firebase-functions';
import Stripe from 'stripe';

const stripe = new Stripe('pk_test_51HA5gFJMxUSJIePPhyPDoN5vfd7Jt9wHLfgnjzRErkCbhLomqNasb7ld55GRgGGzDmgNJrbPyKUmJMqbRybxEkvl00g0htS87a', {
  apiVersion: '2020-08-27',
});

export const helloWorld = functions.https.onRequest(async (request, response) => {

  const token: string = request.body.stripeToken;

  const charge = await stripe.charges.create({
    amount: 999,
    currency: 'usd',
    description: 'Example charge',
    source: token,
  });

  response.send(charge);
});
