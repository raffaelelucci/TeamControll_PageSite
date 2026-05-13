# Pagamenti Stripe + attivazione azienda SaaS

Questa versione fa partire il pagamento solo dopo la compilazione dei dati azienda. I dati vengono salvati nei metadata della sessione Stripe e, quando il pagamento va a buon fine, la marketing API prova a creare l'azienda attiva nell'app SaaS.

## Flusso

1. L'utente seleziona un piano. Di default è selezionato **Team - 79€/mese**, indicato come piano più scelto.
2. L'utente compila i dati azienda.
3. La marketing API crea una sessione Stripe Checkout.
4. Stripe rimanda a `/prezzi?checkout=success&session_id=...` oppure `/prezzi?checkout=cancel&session_id=...`.
5. Il frontend mostra il banner di esito.
6. Il backend `/api/billing/checkout-result` verifica la sessione Stripe.
7. In caso di successo:
   - crea l'azienda attiva nel SaaS chiamando `/api/companies`;
   - invia la mail al cliente;
   - invia la mail interna alla tua casella configurata.
8. In caso di annullamento/fallimento:
   - invia la mail al cliente, se disponibile;
   - invia la mail interna.

## Variabili obbligatorie Stripe

```env
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_TEAM=price_xxx
STRIPE_PRICE_BUSINESS=price_xxx
```

I valori `STRIPE_PRICE_*` devono essere veri Price ID Stripe, non `29`, `79` o `149`.

## Variabili SMTP

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=la-tua-mail@example.com
SMTP_PASS=password-o-app-password
MAIL_FROM="Team Control Center <la-tua-mail@example.com>"
INTERNAL_PAYMENT_EMAIL=la-tua-mail@example.com
```

Se `INTERNAL_PAYMENT_EMAIL` è vuota, la notifica interna usa `SALES_TO_EMAIL`; se manca anche quella, usa `SMTP_USER`.

## Variabili per creare azienda nel SaaS

Il progetto SaaS allegato espone già `POST /api/companies`, ma è protetto da JWT e richiede un utente `SUPER_ADMIN`.

Configurazione consigliata:

```env
APP_API_BASE_URL=https://api.teamcontrolcenter.it
APP_COMPANY_CREATE_URL=https://api.teamcontrolcenter.it/api/companies
APP_COMPANY_CREATE_METHOD=POST
APP_AUTH_LOGIN_URL=https://api.teamcontrolcenter.it/api/auth/login
APP_ADMIN_USERNAME=utente_super_admin
APP_ADMIN_PASSWORD=password_super_admin
```

In alternativa puoi passare direttamente un token Bearer:

```env
APP_COMPANY_API_TOKEN=jwt_o_token_bearer
```

## Log aggiunti

Nei log Nest vedrai tag chiari:

```text
[CHECKOUT][START]
[CHECKOUT][OK]
[CHECKOUT_RESULT][START]
[STRIPE_WEBHOOK][EVENT]
[PAYMENT_SUCCESS][START]
[PAYMENT_SUCCESS][END]
[PROVISIONING][START]
[PROVISIONING][AUTH][LOGIN][OK]
[PROVISIONING][OK]
[PROVISIONING][KO]
[MAIL][START]
[MAIL][OK]
[MAIL][KO]
```

Così capiamo subito se fallisce Stripe, SMTP, login verso SaaS o creazione azienda.

## Nota importante

Le email e la creazione azienda non fanno più esplodere il checkout con un 500 generico: gli errori vengono loggati e restituiti nei dettagli di `/api/billing/checkout-result`, così puoi debuggare senza rompere il ritorno dal pagamento.
