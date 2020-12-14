const CONFIG = {
  stripe: {
    pk: "",
    endpoint: "",
    currencies: [
      "usd",
      "mxn"
    ],
    options: {
      locale: 'es-419'
    }
  },
  language: 'es'
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
  },

  en: {
    message: {
      title: "Tesel — Payments",
      header: "Payment System",
      info: "Information",
      client: "Client",
      name: "Name or Company",
      emailaddress: "Email",
      email: "email@example.com",
      conceptdescription: "Description",
      concept: "What are you paying for?",
      cardinfo: "Credit card",
      amount: "Amount",
      pay: "Pay",
      errorcopy: "An unexpected error has occurred. Please contact us.",
      successcopy: "Thank you, we have received your payment!",
    }
  },

  eo: {
    message: {
       title: "Tesel — Pagsistemo",
      header: "Pagsistemo",
      info: "Informoj",
      client: "Kliento",
      name: "Nomo aŭ kompanio",
      emailaddress: "Retpoŝto",
      email: "retposto@ekzemplo.com",
      conceptdescription: "Priskribo",
      concept: "Kion vi pagas?",
      cardinfo: "Kreditcardo",
      amount: "Kvanto",
      pay: "Pagi",
      errorcopy: "Neatendita eraro okazis. Bonvolu kontakti nin.",
      successcopy: "Dankon, ni ricevis vian pagon!",
    }
  }
}
