# Integrazione pagamento Stripe e creazione azienda SaaS

## Cosa è stato implementato

- Menu mobile più visibile con overlay ad alto `z-index`, pannello leggibile e icona di chiusura.
- Prima del pagamento il cliente compila i dati aziendali necessari: ragione sociale, P.IVA/C.F., referente, email, telefono, dipendenti, indirizzo e città.
- La sessione Stripe Checkout riceve questi dati nei `metadata`.
- Dopo il pagamento riuscito viene mostrato un banner di successo su `/prezzi`.
- Se il pagamento viene annullato/non completato viene mostrato un banner di errore su `/prezzi`.
- La mail di pagamento riuscito/non riuscito viene inviata al cliente.
- La mail interna viene inviata a `INTERNAL_PAYMENT_EMAIL`, oppure `SALES_TO_EMAIL`, oppure `SMTP_USER`.
- A pagamento confermato viene chiamata l’API dell’applicativo SaaS per creare l’azienda come attiva con abbonamento collegato.
- Blog ampliato da 10 a 18 articoli SEO con pagine statiche, sitemap e JSON-LD aggiornati.

## Variabili ambiente necessarie

```env
PUBLIC_SITE_URL=https://teamcontrolcenter.it

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_TEAM=price_xxx
STRIPE_PRICE_BUSINESS=price_xxx

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tua-mail@example.com
SMTP_PASS=password
MAIL_FROM="Team Control Center <tua-mail@example.com>"

# opzionale: se vuota viene usata SMTP_USER
INTERNAL_PAYMENT_EMAIL=tua-mail@example.com

# API applicativo SaaS da chiamare dopo pagamento riuscito
APP_COMPANY_CREATE_URL=https://api.teamcontrolcenter.it/api/companies/public-provisioning
APP_COMPANY_CREATE_METHOD=POST
APP_COMPANY_API_TOKEN=eventuale-token-bearer
APP_COMPANY_API_KEY=eventuale-api-key
```

## Payload inviato all’API SaaS

La marketing API invia una POST JSON con campi compatibili e ridondanti per facilitare il mapping lato applicativo:

```json
{
  "name": "Ragione sociale",
  "businessName": "Ragione sociale",
  "companyName": "Ragione sociale",
  "vatNumber": "PIVA/CF",
  "taxCode": "PIVA/CF",
  "fiscalCode": "PIVA/CF",
  "email": "cliente@example.com",
  "phone": "...",
  "employees": "...",
  "address": "...",
  "city": "...",
  "status": "ACTIVE",
  "active": true,
  "subscriptionStatus": "ACTIVE",
  "subscriptionPlan": "starter|team|business",
  "plan": "starter|team|business",
  "stripeCustomerId": "cus_xxx",
  "stripeSubscriptionId": "sub_xxx",
  "stripeCheckoutSessionId": "cs_xxx",
  "source": "marketing-site-stripe-checkout"
}
```

## Webhook Stripe da configurare

Endpoint:

```text
https://teamcontrolcenter.it/api/billing/webhook
```

Eventi consigliati:

```text
checkout.session.completed
checkout.session.expired
checkout.session.async_payment_failed
invoice.payment_failed
```

## Verifiche build

Sono state eseguite con successo:

```bash
cd marketing-api && npm run build
cd frontend && npm run build
```
