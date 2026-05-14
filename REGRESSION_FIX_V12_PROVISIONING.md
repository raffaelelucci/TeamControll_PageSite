# Fix regressione V12 - Checkout con dati azienda e provisioning

Questa patch corregge la regressione introdotta nella sezione prezzi: il click su un piano non invia più solo `{ plan }`, ma ripristina il flusso completo già previsto dal backend.

## Flusso ripristinato

1. L'utente sceglie un piano nella pagina `/prezzi`.
2. Il piano Team da 79€ resta selezionato di default perché è quello più scelto.
3. L'utente compila il form aziendale con:
   - ragione sociale / nome azienda;
   - partita IVA o codice fiscale aziendale;
   - referente;
   - email aziendale;
   - telefono;
   - numero dipendenti;
   - indirizzo e città opzionali.
4. Il frontend chiama `POST /api/billing/create-checkout-session` passando piano + dati azienda.
5. La marketing API salva i dati nei metadata Stripe.
6. Dopo pagamento confermato, il webhook Stripe crea l'azienda attiva nel SaaS e invia le notifiche email.

## File modificato

- `frontend/src/App.tsx`

## Verifiche

- `frontend npm run build`: OK
- `marketing-api npm run build`: OK
- SEO pages generated: 38

Non sono stati modificati blog, sitemap, cookie banner, Analytics, backend billing/provisioning o pipeline.
