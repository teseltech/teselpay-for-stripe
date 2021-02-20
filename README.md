Tesel Payments using Stripe
===========================

This repository is an example of variable payments using [Stripe](https://stripe.com/). You can now accept payments through Stripe without registering inventory in the platform.

![Payments system screenshot](screenshot.png)

Throug `vue-router` it supports four different URL paths. Using `MXN` and `USD` as an example:

- http://localhost:5000/mxn/1000 opens the payments screen with `MXN` as the currency and $1,000 as the amount
- http://localhost:5000/usd/1000 opens the payments screen with `USD` as the currency and $1,000 as the amount
- http://localhost:500/1000mxn opens the payments screen with `MXN` as the currency and $1,000 as the amount
- http://localhost:5000 opens the payments screen with all fields empty

These URL paths are not case-sensitive.

The project uses Stripe Elements, Vue and Firebase Cloud Functions.


The project is designed to have minimum requirements, both of maintenance and infrastructure. It uses Firebase Cloud Functions as the backend, which requires a Node environment. All of the web interface dependencies are obtained through CDN.

## Web Interface

All dependencies are obtained through CDN.

- [Google Fonts](https://fonts.google.com/)
- [Stripe Javscript SDK](https://github.com/stripe/stripe-js)
- [Vue](https://vuejs.org/) and [Vue router](https://router.vuejs.org/)
- [Vue Currency Input](https://github.com/dm4t2/vue-currency-input)

### Structure

The interface is composed by the following files:

- `public/index.html`
- `public/style.css`
- `public/app.js`
- `public/images/`

In `public/index.html`

The styles are defined in `public/style.css`.

The frontend logic can be found in `public/app.js` which is written exclusively in Vue.js.

### Firebase Config

After cloning the project you will need a new Firebase project. The easiest way is to use https://console.firebase.google.com

Create a new project, select the organization and make sure to enable billing for it. The flexible costs plan (ongoing) is enough and should not generate additional costs if used in moderation or for testing. Be mindful and estimate your usage.

_In order to use Firebase Functions it is necessary to install Firebase CLI. You can find more information on how to install it [here](https://firebase.google.com/docs/cli)_

After installing Firebase CLI install the remaining dependencies using the following commands:

```bash
npm install
cd functions
npm install
```

---

After creating the project and installing the dependencies return to the project's directory and run the following commands:

```bash
firebase login         # Opens a login screen in your browser. Complete the process
firebase use --add
```

You will see your Firebase projects, choose the one you just created. Choose an alias for the project, we recommend naming it `default`. You can choose whichever name you want, but this will save you some time later on.


#### Configure the Firebase functions


The only Cloud Function needed can be found in `functions/src/index.ts`. Use Express to register the function and use CORS, though the code is really the function `handler`

Define an environment variable with your **Stripe Secret Key** using the commands:

```bash
firebase functions:config:set stripe.secret="THE API KEY"
```

You can obtain your key in your Stripe account's [dashboard](https://dashboard.stripe.com/apikeys)


If everything was done correctly you can now input the commands:

```bash
firebase deploy --only functions
```

Once deployed return to the Firebase console and open the Functions section. Copy the function's URL and proceed to the Settings section. This URL is the `endpoint` you'll use in the following section.


### Settings

The project's settings can be set in `public/config.js`. This file is not included in the project but you can make a copy of `public/config.template.js`.

```javascript
const CONFIG = {
  stripe: {
    pk: "",
    endpoint: "",
    currencies: [
      "usd",
      "mxn"
    ],
    options: {
      locale:
      'es-419'
    }
  }
}
```

- `pk`: Stripe's **Publishable Key**. You can obtain your key in your Stripe account's [dashboard](https://dashboard.stripe.com/apikeys)
- `endpoint`: The Firebase Cloud Function URL. It can be found in the Firebase [console](https://console.firebase.google.com/)
- `currencies`: Currency array in ISO format, which is supported by the system
- `options`: Stripe Elements options

At this time there are no  _safeguards_ for the currencies, make sure the currencies in the `currencies` array are [supported by Stripe](https://stripe.com/docs/currencies).

Currently supported flag icons for matching currencies:

```
currencies: [
        "usd",
        "ars",
        "aud",
        "bob",
        "brl",
        "cad",
        "chf",
        "clp",
        "cny",
        "cop",
        "eur",
        "gbp",
        "hkd",
        "hnl",
        "jpy",
        "mxn",
        "nio",
        "uyu"
      ]
```

### Deploy

To see the web page in a remote server input the command:

```bash
firebase deploy
```

This command publishes the Cloud Functions and the hosting website. Once published you can visit the URL generated in the _Hosting_ section of the Firebase dashboard.

## Local Test

To test the functions locally use a test endpoint. You can find it at the beginning of your Firebase emulator log.

Execute `firebase emulators:start` to get a log similar to the following example:

```
✔  functions[app]: http function initialized (http://localhost:5001/<endpoint>/us-central1/app).
```

This is the endpoint. Note that it is running in `localhost:5001`

During production you can find the endpoint's URL in the Firebase console. In the console go to the  _Functions_ menu and copy the URL of the function you're working on.

Since we are using Typescript remember to execute `npm run build` before executing the emulators next time in order to cross compile the code.

---

The colors and logos, including the favicon, can be changed manually in either `public/style.css` or `public/index.html`.

# Contributions

The project is released under MIT license. If you want to make a pull request you can do so, as well as raise _Issues_ in Github's _Issue tracker._ Stricter contribution guidelines might be implemented as the project grows.

## Supporting the project

If you'd like to support the project you can also donate to us at https://pay.tesel.tech where you can also see the project implemented.
