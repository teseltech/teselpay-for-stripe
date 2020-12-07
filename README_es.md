Pagos Tesel utilizando la plataforma Stripe
===========================================

Este repositorio es un ejemplo de pagos _eventuales_ usando [Stripe](https://stripe.com/). Esto significa que lo puedes ocupar para tomar un pago via Stripe sin necesidad de tener un producto registrado en la plataforma.

![Screenshot del sistema de pagos](screenshot.png)

Mediante `vue-router` soporta cuatro diferentes URL paths, para `MXN` y `USD` por ejemplo:

- http://localhost:5000/mxn/1000 abre el formulario de pago con `MXN` como moneda y el monto en $1,000
- http://localhost:5000/usd/1000 abre el formulario de pago con `USD` como moneda y el monto en $1,000
- http://localhost:500/1000mxn abre el formulario de pago con `MXN` como moneda y el monto en $1,000
- http://localhost:5000 abre el formulario en blanco

Todos estos URL paths funcionan sin importar las mayúsculas o minúsculas.

El proyecto utiliza Stripe Elements, Vue y Firebase Cloud Functions.


El proyecto esta diseñado para tener requerimientos mínimos. Utiliza Firebase Cloud Functions como backend, lo cual requiere de un entorno de Node. Mientras que todas las dependencias de la interfaz web se adquieren via CDN.

## Interfaz Web

Todas las dependencias se adquieren vía CDN:

- [Google Fonts](https://fonts.google.com/)
- [Stripe Javscript SDK](https://github.com/stripe/stripe-js)
- [Vue](https://vuejs.org/) and [Vue router](https://router.vuejs.org/)
- [Vue Currency Input](https://github.com/dm4t2/vue-currency-input)
- [axios](https://github.com/axios/axios)

### Estructura

La interfaz comprende los siguientes archivos:

- `public/index.html`
- `public/style.css`
- `public/app.js`
- `public/images/`

En `public/index.html`

Los estilos se definen en `public/style.css`.

Toda la lógica del frontend se encuentra en `public/app.js` y esta escrita utilizando Vue.js exclusivamente.

### Configurando Firebase

Una vez que hayas clonado el proyecto necesitarás crear un nuevo proyecto de firebase. Esto es más fácil de realizar desde https://console.firebase.google.com

Crea un nuevo proyecto, selecciona la organización correspondiente y asegúrate de habilitar el billing del mismo. El plan de costos flexibles (on going) es suficiente y no tendría por qué generar ningún costo con uso moderado o pruebas.

_Para poder utilizar Firebase Functions es necesario instalar Firebase cli. Puedes encontrar más información sobre cómo instalarlo [aquí](https://firebase.google.com/docs/cli)_

Cuando hayas instalado Firbase CLI será necesario que instales el resto de las dependencias de las funciones con el siguiente comando

```bash
npm install
cd functions
npm install
```

---

Después de haber creado el proyecto e instalado las dependencias regresa al directorio del proyecto que clonaste y corre el siguiente comando

```bash
firebase login         # Esto abrirá una pantalla de login en tu browser. Completa el proceso
firebase use --add
```

Verás una selección de los proyectos de Firebase que tienes disponibles, escoge el que acabas de crear. Posteriormente te pedirá un alias para el proyecto, escribe `default`. Puedes elegir cualquier nombre, pero esto te ahorrara varios pasos más tarde.


#### Configurando las firebase functions


Las única Cloud Function necesaria se encuentra en `functions/src/index.ts` utiliza Express para registrar la función y poder utilizar CORS pero el código realmente es la función `handler`

Necesitarás definir una variable de entorno con tu **Stripe Secret Key** con el comando

```bash
firebase functions:config:set stripe.secret="THE API KEY"
```

Esta llave la puedes obtener en el [dashboard](https://dashboard.stripe.com/apikeys) de Stripe


Si todo salió bien ahora puedes correr el comando

```bash
firebase deploy --only functions
```

Una vez que terminé de hacer deploy regresa a la consola de firebase. Y ve a la sección Functions. Copia la URL de la función y pasa a la sección de configuración; esta URL es el `endpoint` que vas a usar a continuación.


### Configuración

La configuración del proyecto se puede realizar en `public/config.js`. Este archivo no se incluye en el proyecto pero se puede realizar una copia de `public/config.template.js`.

```javascript
const CONFIG = {
  stripe: {
    pk: "",
    endpoint: "",
    currencies: [
      "usd",
      "mxn"
    ],
    options: {
      locale:
      'es-419'
    }
  }
}
```

- `pk`: La **Publishable Key** de Stripe. Puedes conseguirla en el [dashboard](https://dashboard.stripe.com/apikeys) de Stripe.
- `endpoint`: La URL de la Firebase Cloud Function. Que puedes encontrar en la [consola](https://console.firebase.google.com/) de Firebase
- `currencies`: Este es un arreglo de currencies en formato ISO que el sistema soporta.
- `options`: son las opciones de Stripe Elements.

En este momento no hay _safeguards_ para las monedas, de modo que debes asegurarte de que las monedas del arreglo `currencies` son soportada por Stripe.

Los íconos de banderas y currencies que soportamos son exclusivamente las banderas de México y Estados Unidos, pero en siguientes versiones agregaremos más.


### Deploy completo

Para poder ver la página en el servidor remoto solo es necesario que hagas

```bash
firebase deploy
```

Este comando publica tanto las Cloud Functions como la página de hosting. Una vez que este publicado puedes visitar la página en la URL proporcionada en el dashboard de Firebase, en la sección hosting.

## Probar localmente

Si deseas probar las funciones localmente, vas a tener que usar un endpoint de pruebas. Este lo puedes encontrar al principio del log de tus emuladores de firebase.

Una vez que ejecutes `firebase emulators:start` deberías tener un log parecido a este:

```
✔  functions[app]: http function initialized (http://localhost:5001/<endpoint>/us-central1/app).
```

Ese es el endpoint. Nota que esta corriendo en `localhost:5001`

Durante producción puedes encontrar la URL del endpoint en la consola de firebase. Una vez que estes en la consola ve al menu _Functions_ y copia la URL de la función correspondiente.

---

Los colores y logotipos, incluido el favicon, deberás cambiarlos manualmente ya sea en `public/style.css` o `public/index.html`.

# Contribuyendo

El proyecto esta liberado bajo la licencia MIT. Si quieres hacer un pull request puedes hacerlo así como levantar Issues en el issue tracker de GitHub. Si el proyecto llegara a crecer, es posible que se implementen guidelines más estrictos de contribución.
