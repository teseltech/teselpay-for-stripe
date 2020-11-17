const config = {
  stripe: {
    pk: "",
    endpoint: "",
    currencies: [
      "usd",
      "mxn"
    ]
  },
  style: {
    primarycolor: "",
    secondarycolor: ""
  }
}


var stripe = Stripe(config.stripe.pk,  { locale: 'es-419'});

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/:currency/:amount' },
    { path: '/:currency/:amount' }
  ]
});

router.beforeResolve((to, from, next) => {

  if(to.path == '/'){
    next()
  } else if(this.currencies.includes(to.params.currency) && !isNaN(parseFloat(to.params.amount))) {
    next()
  } else {
    next({ path: '/', replace: false })
  }
});

var app = new Vue({
  el: '#app',
  router: router,
  watch: {
    $route(to, from){
      this.currency = to.params.currency;
      this.amount = to.params.amount;
    }
  },
  data: {
    elements: null,
    card: null,
    amount: '0.0',
    description: '',
    errorMessage: '',
    successMessage: '',
    email: null,
    currencies: config.stripe.currencies,
    currency: config.stripe.currencies[0]
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    }
  },
  mounted: function() {

    this.currency = this.$route.params.currency || this.currencies[0]
    this.amount = this.$route.params.amount || '0.0';

    this.elements = stripe.elements();
    var style = {
      base: { fontSize: '16px', color: '#32325d' }
    }
    this.card = this.elements.create('card', { style: style });
    this.card.mount('#data-card')

  },
  methods: {
    createToken: function(e) {
      e.preventDefault();
      if(this.description && this.email && this.amount) {
        stripe.createToken(this.card)
        .then((result) => {
          if(result.error) {
            console.error(result.error);
            this.errorMessage = result.error.message;
          } else {
            this.errorMessage = '';
            this.successMessage = '';
            this.stripeTokenHandler(result.token, this.amount, this.currency, this.description, this.email);
          }
        });
      } else {
        this.errorMessage = 'Por favor completa todos los campos'
      }
    },

    stripeTokenHandler: function(token, amount, currency, description, email) {

      var handlerurl = config.stripe.endpoint;
      var paymentinfo = {
        token: token,
        amount: amount * 100,
        currency: currency,
        description: description,
        email: email
      };

      console.info('Will attempt to authorize the payment', paymentinfo);

      axios.post(handlerurl, paymentinfo).then(response => {
        var data = response.data;
        console.info(data);
        switch(data.code) {
          case 'card_declined':
          this.errorMessage = data.raw.message;
          break;

          case 'expired_card':
          this.errorMessage = data.raw.message;
          break;

          case 'incorrect_cvc':
          this.errorMessage = data.raw.message;
          break;

          case 'processing_error':
          this.errorMessage = data.raw.message;
          break;

          case 'incorrect_number':
          this.errorMessage = data.raw.message;
          break;

          default:
          if(data.outcome.type == 'authorized') {
            this.successMessage = '¡Muchas gracias, recibimos tu pago!'
            this.card.clear();
            this.amount = '0.0';
          } else {
            this.errorMessage = 'Ocurrió un error desconocido. Por favor contáctanos.'
          }
        }
      });
    }
  }
});
