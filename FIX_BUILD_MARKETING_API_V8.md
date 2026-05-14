# Fix build Marketing API v8

Questa patch corregge l'errore TypeScript:

```text
Argument of type 'LeadDto' is not assignable to parameter of type 'Record<string, unknown>'.
```

La causa era una regressione nei sorgenti `marketing-api`: il metodo `sendInternalLead` richiedeva `Record<string, unknown>`, mentre il controller passava direttamente una classe DTO.

La patch ripristina anche le correzioni già introdotte per:

- import corretto di `nodemailer`;
- gestione sicura degli errori email nella richiesta demo;
- `SMTP_PORT=465` con `secure=true` automatico;
- webhook Stripe asincrono;
- `checkout-result` veloce senza provisioning/mail;
- provisioning azienda via API SaaS;
- log `LEAD`, `MAIL`, `PROVISIONING`, `STRIPE_WEBHOOK`.

Build verificata localmente con:

```bash
cd marketing-api
./node_modules/.bin/nest build
```
