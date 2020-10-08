var stripe = Stripe('');

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    elements: null,
    card: null,
    amount: 0.0,
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
          this.stripeTokenHandler(result.token, this.amount)
        }
      })
    },
    stripeTokenHandler: function(token, amount) {
      console.log('hacer cositas y llamar al servidor después de que tenemos el token')
      console.log(token, amount * 100)
      var handlerurl = 'http://localhost:5001/stripepayments-6c5b8/us-central1/app/';
      axios.post(handlerurl,
        {
          token: token,
          amount: amount * 100
        })
        .then(response => {
          console.log(response);
        });
      }
    }
  })
