/**
* VueI18n configuration. Config.language comes from the config file
*/
const i18n = new VueI18n({
  locale: CONFIG.language,
  messages
})

/**
* VueRoute configuration. Routes to charge on different currencies.
*/
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/:amountcurrency' },
    { path: '/:currency/:amount' }
  ]
});

/**
* Routes solving.
*/
router.beforeEach((to, from, next) => {

  if(to.path == '/'){
    next()
  } else if (to.params.amountcurrency){
    var re = /^(\d+)([A-Za-z]{3})$/;
    var amountcurrency = to.params.amountcurrency.match(re);

    if(amountcurrency && CONFIG.stripe.currencies.includes(amountcurrency[2].toLowerCase()) && !isNaN(parseFloat(amountcurrency[1]))) {
      next()
    } else {
      next({ path: '/', replace: false })
    }

  } else if(CONFIG.stripe.currencies.includes(to.params.currency.toLowerCase()) && !isNaN(parseFloat(to.params.amount))) {
    next()
  } else {
    next({ path: '/', replace: false })
  }
});

/**
* VueCurrencyFilter configuration. This filter is used to display the confirmation dialog
*/
Vue.use(VueCurrencyFilter, {
    symbol: "$",
    thousandsSeparator: ",",
    fractionCount: 0,
    fractionSeparator: ".",
    symbolPosition: "front",
    symbolSpacing: true,
    avoidEmptyDecimals: '##',
  });

/**
* Registration of confirmation dialog component.
*/
Vue.component("confirmation", {
  props: ['amount', 'client', 'email'],
  template: "#confirmation-template"
});

var app = new Vue({
  el: '#app',

  i18n,

  router: router,

/**
* Module variables.
* elements The Stripe Elements object
* card The Card object instanciated from Stripe Elements
* client Payee's name
* email Payee's email
* description Charge description
* amount Charge amount
* currencies Available currencies
* currency Charge currency
* errorMessage Error message object
* successMessage Success message object
* clientSecret Authentication token for the charge
* showConfirmation Confirmation screen render condition
*/
  data: {
    elements: null,
    card: null,

    client: '',
    email: null,
    description: '',
    amount: '0.0',

    currencies: CONFIG.stripe.currencies,
    currency: CONFIG.stripe.currencies[0],

    errorMessage: '',
    successMessage: '',

    clientSecret: null,
    showConfirmation: false,
    stripe : null
  },

  /* Watch for changes in objects */
  watch: {
  /**
  * Checks for any change to the current route.
  * It reacts to reflect the new currency or amount
  */
    $route(to, from){
      if(to.params.currency && to.params.amount) {
        this.currency = to.params.currency.toLowerCase();
        this.amount = to.params.amount;

      } else if(to.params.amountcurrency) {
        var re = /^(\d+)([A-Za-z]{3})$/;
        var amountcurrency = to.params.amountcurrency.match(re);

        this.currency = amountcurrency[2].toLowerCase();
        this.amount = amountcurrency[1];
      }
    }
  },

  /**
  * Actions to take after module is mounted
  * First it checks for the current currency and amount
  * Updates objects and UI accordingly.
  *
  * Initializes Stripe Elements and assins the instance to the Card Object
  */
  mounted: function() {
    this.stripe = Stripe(CONFIG.stripe.pk, CONFIG.stripe.options);

    if(this.$route.params.currency && this.$route.params.amount){
      this.currency = this.$route.params.currency.toLowerCase();
      this.amount = this.$route.params.amount;

    } else if(this.$route.params.amountcurrency) {
      var re = /^(\d+)([A-Za-z]{3})$/;
      var amountcurrency = this.$route.params.amountcurrency.match(re);

      this.currency = amountcurrency[2].toLowerCase();
      this.amount = amountcurrency[1];

      console.log(this.currency, amountcurrency[1], this.amount, amountcurrency[2]);

    } else {
      this.currency = this.currencies[0];
      this.amount = '0.0';
    }

    this.elements = this.stripe.elements();
    var style = {
      base: { fontSize: '16px', color: '#32325d' }
    }
    this.card = this.elements.create('card', { style: style });
    this.card.mount('#data-card')

  },

  /* Template and module available Methods */
  methods: {
    /**
    * createToken fetches the server for a paymentIntent. It sends the required
    * data to create such intent.
    * Asks Stripe Elements to confirmCardPayment. In case it confirms
    * will display sucess message
    */
    createToken: async function(e) {

      e.preventDefault();

      var handlerurl = CONFIG.stripe.endpoint;
      var data = {
        amount: this.amount,
        name: this.client,
        currency:  this.currency,
        description: this.description,
        receipt_email: this.email
      };
      var options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      console.info('Will attempt to retrieve paymentIntent');

      this.clientSecret = fetch(handlerurl, options).then(function(response) {
        return response.json();
      }).then(function(responseJson) {
        console.info('Connected to server & retrieved paymentIntent');
        return responseJson.client_secret;
      });

      if(this.description && this.email && this.amount) {

        this.stripe.confirmCardPayment(
          await this.clientSecret,
          {
            payment_method: {card: this.card}
          }
        ).then((result) => {
          if(result.error) {
            console.error('Ocurrió un error');
            this.errorMessage = result.error.message;
          } else if(result.paymentIntent && result.paymentIntent.status === 'succeeded') {
            console.info('Se ejecutó correctamente');

            this.showConfirmation = true;
            this.errorMessage = '';
            this.successMessage = '¡Muchas gracias, recibimos tu pago!';
            this.card.clear();
          }
        });

      } else {
        this.errorMessage = 'Por favor completa todos los campos'
      }
    },
  },

  /* Template available Filters */
  filters: {
    /**
    * capitalize filter.
    */
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    }
  }

});
