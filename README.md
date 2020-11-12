Pagos con stripe
================

Este repositorio es un ejemplo de pagos _eventuales_ usando [Stripe](https://stripe.com/). Esto significa que lo puedes ocupar para tomar un pago via Stripe sin necesidad de tener un producto registrado en la plataforma.

Mediante `vue-router` soporta tres diferentes URL paths, para `MXN` y `USD` por ejemplo:

- http://localhost:5000/mxn/1000 abre el formulario de pago con `MXN` como moneda y el monto en $1,000
- http://localhost:5000/usd/1000 abre el formulario de pago con `USD` como moneda y el monto en $1,000
- http://localhost:5000 abre el formulario en blanco

El proyecto utiliza Stripe Elements, Vue y Firebase Cloud Functions.


El proyecto esta diseñado para tener requerimientos mínimos. Utiliza Firebase Cloud Functions como backend, lo cual requiere de un entorno de Node. Mientras que todas las dependencias de la interfaz web se adquieren via CDN.

## Interfaz Web

Todas las dependencias se adquieren vía CDN:

- [Bootstrap](https://getbootstrap.com/)
- [Google Fonts](https://fonts.google.com/)
- [Stripe Javscript SDK](https://github.com/stripe/stripe-js)
- [Vue](https://vuejs.org/) and [Vue router](https://router.vuejs.org/)
- [Vue Currency Input](https://github.com/dm4t2/vue-currency-input)
- [axios](https://github.com/axios/axios)

### Estructura

La interfaz comprende los siguientes archivos:

- `public/app.js`
- `public/index.html`
- `public/style.css`
- `public/images/`

Una vez que cuentes con tu Publishable key solo es necesario que la coloques en la primera linea de `public/app.js` y que modifiques la dirección de tu endpoint en la variable `handlerurl`

Los estilos se definen principalmente en `public/style.css` pero se usa el sistema de grid de Bootstrap.

Toda la lógica del frontend se encuentra en `public/app.js` y esta escrita utilizando Vue.js exclusivamente.

## Firebase Cloud Functions+

_Para poder utilizar Firebase Functions es necesario instalar Firebase cli. Puedes encontrar más información sobre cómo instalarlo [aquí](https://firebase.google.com/docs/cli)_

Una vez que se instala Firbase CLI puedes instalar el resto de las dependencias con

```
npm install
cd functions
npm install
```

Las única Cloud Function necesaria se encuentra en `functions/src/index.ts` utiliza Express para registrar la función y poder utilizar CORS pero el código realmente es la función `handler`
