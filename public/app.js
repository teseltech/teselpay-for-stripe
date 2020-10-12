var stripe = Stripe('pk_test_51HA5gFJMxUSJIePPhyPDoN5vfd7Jt9wHLfgnjzRErkCbhLomqNasb7ld55GRgGGzDmgNJrbPyKUmJMqbRybxEkvl00g0htS87a',  { locale: 'es-419'});

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    elements: null,
    card: null,
    amount: null,
    description: '',
    errorMessage: '',
    successMessage: ''
  },
  mounted: function() {
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
      stripe.createToken(this.card)
      .then((result) => {
        if(result.error) {
          console.error(result.error);
          this.errorMessage = result.error.message;
        } else {
          this.errorMessage = '';
          this.successMessage = '';
          this.stripeTokenHandler(result.token, this.amount, this.description);
        }
      })
    },
    stripeTokenHandler: function(token, amount, description) {
      console.info('Will attempt to authorize the payment')
      // var handlerurl = 'https://us-central1-stripepayments-6c5b8.cloudfunctions.net/app';
      var handlerurl = 'http://localhost:5001/stripepayments-6c5b8/us-central1/app/';
      axios.post(handlerurl,
        {
          token: token,
          amount: amount * 100,
          description: description
        })
        .then(response => {
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
                this.successMessage = '¡Muchas gracias por tu pago!'
                this.card.clear();
                this.amount = 0.0;
              } else {
                this.errorMessage = 'Ocurrió un error desconocido. Contactanos.'
              }
          }
        });
      }
    }
  })
