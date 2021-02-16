import * as functions from 'firebase-functions';
import Stripe from 'stripe';
const cors = require('cors')({origin: true});
const express = require('express');

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2020-08-27',
});

const app = express();

const secretHandler = async (request: any, response: any) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: request.body.amount,
    currency: request.body.currency,
  });
  response.json({client_secret: paymentIntent.client_secret});
}

app.use(cors);
app.post('/secret', secretHandler);

exports.app = functions.https.onRequest(app);
