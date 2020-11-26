const test = require('firebase-functions-test')({
  projectId: 'stripepayments-6c5b8',
}, '../servicekey.json');

const functions = require('firebase-functions');
//const key = functions.config().stripe.key;

test.mockConfig({ stripe: { key: 'sk_test_51HA5gFJMxUSJIePPkMXjoEeBHylmC3Z67qh8CQPiEcOjTiGArlboU5gCR0ZLV8926hZhSPVerxr5KipO7W77ZHrC00G3rd2heH' }});

import handler from '../src/index.ts';

const wrapped = test.wrap(handler);

wrapped(data);

test.cleanup();
