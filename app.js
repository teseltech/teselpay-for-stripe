var stripe = Stripe('pk_test_51HA5gFJMxUSJIePPhyPDoN5vfd7Jt9wHLfgnjzRErkCbhLomqNasb7ld55GRgGGzDmgNJrbPyKUmJMqbRybxEkvl00g0htS87a')

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    elements: null,
    card: null
  },
  mounted: function() {
    this.elements = stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount('#data-card')
  }
})
