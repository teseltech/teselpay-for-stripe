import * as functions from 'firebase-functions';
import Stripe from 'stripe';
const cors = require('cors')({origin: true});
const express = require('express');

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2020-08-27',
});

const app = express();

const handler = async (request: any, response: any) => {
  const tok: string = request.body.token.id;
  const charge = await stripe.charges.create({
    amount: request.body.amount,
    currency: 'usd',
    description: request.body.description,
    source: tok,
  })
  .catch(result => {
    return result;
  })
  .then(result => {
    return result;
  });
  console.info(charge)
  response.send(charge);
}

app.use(cors);
app.use(handler);
app.post('/', (req: any, res: any) => {
  res.send('hello')
})

exports.app = functions.https.onRequest(app);
