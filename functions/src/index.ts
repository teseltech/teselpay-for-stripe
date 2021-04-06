import * as functions from 'firebase-functions'; // Required to run firebase functions
import Stripe from 'stripe'; // Stripe node.js API
import { Request, Response } from 'express'; // Express framework
import * as express from 'express';
const cors = require('cors')({origin: true}); // Library to allow express to use CORS

/**
* Stripe API initialization.
* @property {string} stripe_sk is a a Secret key obtained from the Stripe Dashboard
*/
const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2020-08-27',
});

const app = express();

const secretHandler = async (request: Request, response: Response) => {
  /**
  * paymentIntent.create will return a paymentIntent. The frontend requires the
  * client secret returned from the sucessful authentication.
  * @property {integer} amount an integer number, usually greater than or equal to 1000
  * @property {string} currency a three letter currency code, in general ISO compliant.
  * Check Stripe documentation.
  */
  const customer = await createCustomer(request.body.receipt_email, request.body.name);

  const paymentIntent: Stripe.PaymentIntent | Stripe.StripePermissionError = await stripe.paymentIntents.create({
    amount: request.body.amount * 100,
    currency: request.body.currency,
    description: request.body.description,
    receipt_email: request.body.receipt_email,
    payment_method_types: ['card'],
    customer: customer.id
  }).catch((error) => {
    console.log(error);
    return error
  });

  if (isPaymentIntent(paymentIntent)) {
    console.log("Succeeded at creating Client Secret");
    response.json({client_secret: paymentIntent.client_secret});
  } else {
    response.json({error: paymentIntent.type});
  }
}

function isPaymentIntent(result : Stripe.PaymentIntent | Stripe.StripePermissionError): result is Stripe.PaymentIntent {
  return (result as Stripe.PaymentIntent).client_secret !== undefined;
}

const createCustomer = async (email: string, name:string) => {
  return await stripe.customers.create({
    email: email,
    name: name
  });
}

/**
* Registration of routes
*/
app.use(cors);
app.post('/secret', secretHandler);

exports.app = functions.https.onRequest(app);
