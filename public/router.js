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
