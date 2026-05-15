# Pagamenti Stripe + attivazione azienda SaaS

Questa versione fa partire il pagamento solo dopo la compilazione dei dati azienda. I dati vengono salvati nei metadata della sessione Stripe e, quando Stripe conferma il pagamento tramite webhook, la marketing API prova a creare l'azienda attiva nell'app SaaS.

## Flusso corretto

1. L'utente seleziona un piano. Di default è selezionato **Team - 79€/mese**, indicato come piano più scelto.
2. L'utente compila i dati azienda.
3. La marketing API crea una sessione Stripe Checkout.
4. Stripe rimanda a `/prezzi?checkout=success&session_id=...` oppure `/prezzi?checkout=cancel&session_id=...`.
5. Il frontend mostra subito il banner di esito.
6. Il backend `/api/billing/checkout-result` verifica solo lo stato della sessione Stripe e risponde velocemente: non crea aziende e non invia mail.
7. Il webhook Stripe `/api/billing/webhook` riceve `checkout.session.completed` e avvia in asincrono:
   - creazione azienda attiva nel SaaS chiamando `/api/companies`;
   - mail di successo al cliente;
   - mail interna alla tua casella configurata.
8. In caso di annullamento/fallimento gestito da webhook:
   - invia la mail al cliente, se disponibile;
   - invia la mail interna.

Questa separazione evita il `504 Gateway Time-out` su `/checkout-result`: il ritorno del browser non aspetta più né l'altro progetto né SMTP.

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
SMTP_CONNECTION_TIMEOUT_MS=10000
SMTP_GREETING_TIMEOUT_MS=10000
SMTP_SOCKET_TIMEOUT_MS=15000
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
APP_PROVISIONING_TIMEOUT_MS=10000
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
[CHECKOUT_RESULT][FAST_OK]
[STRIPE_WEBHOOK][RECEIVED]
[STRIPE_WEBHOOK][EVENT]
[STRIPE_WEBHOOK][ASYNC_KO]
[PAYMENT_SUCCESS][START]
[PAYMENT_SUCCESS][END]
[PROVISIONING][START]
[PROVISIONING][AUTH][LOGIN][HTTP][START]
[PROVISIONING][AUTH][LOGIN][HTTP][END]
[PROVISIONING][AUTH][LOGIN][OK]
[PROVISIONING][CREATE][HTTP][START]
[PROVISIONING][CREATE][HTTP][END]
[PROVISIONING][OK]
[PROVISIONING][KO]
[MAIL][START]
[MAIL][OK]
[MAIL][KO]
```

Così capiamo subito se fallisce Stripe, SMTP, login verso SaaS o creazione azienda.

## Nota importante

Il webhook risponde subito a Stripe e continua il lavoro in asincrono. Se l'altro progetto o SMTP sono lenti, non bloccano più nginx e non causano più il 504 sul browser.
