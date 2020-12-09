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

const messages =  {
  es: {
    message: {
      title: "Tesel — Sistema de Pagos",
      header: "Sistema de pagos",
      info: "Información",
      client: "Cliente",
      name: "Nombre o empresa",
      emailaddress: "Email",
      email: "micorreo@ejemplo.com",
      conceptdescription: "Concepto",
      concept: "¿De qué es este pago?",
      cardinfo: "Pago con tarjeta",
      amount: "Monto",
      pay: "Pagar",
      errorcopy: "Ocurrió un error desconocido. Por favor contáctanos.",
      successcopy: "¡Muchas gracias, recibimos tu pago!",
    }
  }
}
