var stripe = Stripe('pk_test_51HA5gFJMxUSJIePPhyPDoN5vfd7Jt9wHLfgnjzRErkCbhLomqNasb7ld55GRgGGzDmgNJrbPyKUmJMqbRybxEkvl00g0htS87a',  { locale: 'es-419'});

const router = new VueRouter({
 mode: 'history',
  routes: [
    { path: '/:currency/:amount' },
    { path: '/:currency/:amount' }
  ]
});

router.beforeResolve((to, from, next) => {

  if(to.params.currency == 'mxn' || to.params.currency == 'usd') {
    if(!isNaN(parseFloat(to.params.amount))){
      next()
    }
  } else {
    next({ path: '/usd/100', replace: false })
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
    message: 'Hello Vue!',
    elements: null,
    card: null,
    amount: null,
    description: '',
    errorMessage: '',
    successMessage: '',
    email: null,
    currency: 'usd'
  },
  mounted: function() {

    this.currency = this.$route.params.currency;
    this.amount = this.$route.params.amount;

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
      console.info('Will attempt to authorize the payment')
      // var handlerurl = 'https://us-central1-stripepayments-6c5b8.cloudfunctions.net/app';
      var handlerurl = 'http://localhost:5001/stripepayments-6c5b8/us-central1/app/';
      axios.post(handlerurl, {
        token: token,
        amount: amount * 100,
        currency: currency,
        description: description,
        email: email
      }).then(response => {
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
            this.amount = 0.0;
          } else {
            this.errorMessage = 'Ocurrió un error desconocido. Por favor contáctanos.'
          }
        }
      }
    });
  },
  isNumber: function(e) {
    e = (e) ? e : window.event;
    var charCode = (e.which) ? e.which : e.keyCode;
    if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
      e.preventDefault();;
    } else {
      return true;
    }
  },
}
});
