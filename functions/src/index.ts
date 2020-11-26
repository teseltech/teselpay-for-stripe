import * as functions from 'firebase-functions';
import Stripe from 'stripe';

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2020-08-27',
});


import * as cors from 'cors';
const corsHandler = cors({origin: true});

export const exampleFunction= functions.https.onRequest(async (request: any, response: any) => {
         await corsHandler(request, response, async () => {

           const tok: string = request.body.token.id;
           const charge = await stripe.charges.create({
             amount: request.body.amount,
             currency: request.body.currency,
             description: request.body.email + ': ' + request.body.description,
             receipt_email: request.body.email,
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

         });

});
