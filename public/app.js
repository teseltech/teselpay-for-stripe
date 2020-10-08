var stripe = Stripe('pk_test_51HA5gFJMxUSJIePPhyPDoN5vfd7Jt9wHLfgnjzRErkCbhLomqNasb7ld55GRgGGzDmgNJrbPyKUmJMqbRybxEkvl00g0htS87a');

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    elements: null,
    card: null,
    amount: 0.0,
    description: ''
  },
  mounted: function() {
    this.elements = stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount('#data-card')

  },
  methods: {
    createToken: function() {
      stripe.createToken(this.card)
      .then((result) => {
        if(result.error) {
          console.log('error')
        } else {
          this.stripeTokenHandler(result.token, this.amount, this.description)
        }
      })
    },
    stripeTokenHandler: function(token, amount, description) {
      console.log('hacer cositas y llamar al servidor después de que tenemos el token')
      console.log(token, amount * 100)
      var handlerurl = 'https://us-central1-stripepayments-6c5b8.cloudfunctions.net/app';
      // var handlerurl = 'http://localhost:5001/stripepayments-6c5b8/us-central1/app/';
      axios.post(handlerurl,
        {
          token: token,
          amount: amount * 100,
          description: description
        })
        .then(response => {
          console.log(response);
        });
      }
    }
  })
