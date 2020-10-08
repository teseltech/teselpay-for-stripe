import * as functions from 'firebase-functions';
import Stripe from 'stripe';
const cors = require('cors')({origin: true});
const express = require('express');

const stripe = new Stripe('', {
  apiVersion: '2020-08-27',
});

const app = express();

const handler = async (request: any, response: any) => {
  const tok: string = request.body.token.id;
  const charge = await stripe.charges.create({
    amount: request.body.amount,
    currency: 'usd',
    description: 'Example charge',
    source: tok,
  });

  response.send(charge);
}

app.use(cors);
app.use(handler);
app.post('/', (req: any, res: any) => {
  res.send('hello')
})

exports.app = functions.https.onRequest(app);