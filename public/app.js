var stripe = Stripe(CONFIG.stripe.pk, CONFIG.stripe.options);

const i18n = new VueI18n({
  locale: CONFIG.language,
  messages
})


const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/:amountcurrency' },
    { path: '/:currency/:amount' },
    { path: '/:currency/:amount' }
  ]
});

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

var app = new Vue({
  el: '#app',

  i18n,

  router: router,

  /* Watch for changes in objects */

  watch: {
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

  /* Module variables */

  data: {
    elements: null,
    card: null,
    amount: '0.0',
    description: '',
    errorMessage: '',
    successMessage: '',
    email: null,
    currencies: CONFIG.stripe.currencies,
    currency: CONFIG.stripe.currencies[0],
    clientSecret: null
  },

  /* Template available Filters */

  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    }
  },

  /* Function to run just after the module is mounted */

  created: function () {
    var handlerurl = CONFIG.stripe.endpoint;

    console.info('Will attempt to retrieve paymentIntent');

    this.clientSecret = fetch(handlerurl).then(function(response) {
      return response.json();
    }).then(function(responseJson) {
      console.info('Connecting to server');
      return responseJson.client_secret;
    });
  },

  mounted: function() {
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

    this.elements = stripe.elements();
    var style = {
      base: { fontSize: '16px', color: '#32325d' }
    }
    this.card = this.elements.create('card', { style: style });
    this.card.mount('#data-card')

  },

  /* Template and module available Methods */

  methods: {
    createToken: async function(e) {

      e.preventDefault();
      if(this.description && this.email && this.amount) {

        stripe.confirmCardPayment(
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
            this.errorMessage = '';
            this.successMessage = '¡Muchas gracias, recibimos tu pago!';
            this.card.clear();
            this.amount = '0.0';
          }
        });

      } else {
        this.errorMessage = 'Por favor completa todos los campos'
      }
    },

  }
});
