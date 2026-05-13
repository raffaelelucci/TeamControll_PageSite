# Team Control Center - Sito marketing SaaS

Pacchetto completo per portare Team Control Center su un modello SaaS con sito pubblico SEO, pagamento abbonamenti, form demo e deployment Docker/Nginx.

## Struttura consigliata domini

- `teamcontrolcenter.it` e `www.teamcontrolcenter.it`: sito pubblico SEO e vendita.
- `app.teamcontrolcenter.it`: applicativo privato già esistente.
- `api.teamcontrolcenter.it`: backend applicativo già esistente.

## Tecnologie

- Frontend sito: React 18 + TypeScript + Vite + CSS custom responsive.
- Marketing API: NestJS + TypeScript + Stripe + Nodemailer.
- Deploy: Docker Compose + Nginx reverse proxy.
- SEO: pagine statiche generate post-build, sitemap.xml, robots.txt, canonical, Open Graph, Twitter Card, JSON-LD SoftwareApplication/Blog/BlogPosting/Breadcrumb/FAQ e fallback HTML per crawler.
- GDPR/Legal: pagine legali estese per Privacy, Cookie, Termini, DPA, Sicurezza, Sub-responsabili e Recesso/Rimborsi; cookie banner senza analytics attivi di default.


## SEO e contenuti

Il sito contiene una struttura marketing più completa:

- Home descrittiva con proposta di valore chiara.
- Pagina funzionalità dettagliata.
- Pagina prezzi con piani Starter, Team e Business.
- Pagine verticali per presenze, progetti, cooperative, agenzie e scuole private.
- Blog con 10 articoli SEO-friendly già indicizzati nella sitemap.
- Output statico generato in `frontend/dist` e copiato anche in `site`.
- Pagine legali corpose con fallback HTML SEO già generato: `/privacy`, `/cookie-policy`, `/termini`, `/dpa`, `/sicurezza`, `/sub-responsabili`, `/recesso-rimborsi`.

Dettaglio completo in `SEO_IMPLEMENTATO.md`.

## Avvio locale

```bash
cd frontend
npm install
npm run dev
```

In un altro terminale:

```bash
cd marketing-api
cp .env.example .env
npm install
npm run start:dev
```

## Avvio con Docker

Dalla root del pacchetto:

```bash
cp .env.example .env
nano .env
sudo docker compose up -d --build
sudo docker ps
```

Il sito sarà esposto internamente su `127.0.0.1:8088` e la marketing API su `127.0.0.1:3090`.

## Pagamenti

Il pulsante nei piani chiama:

```http
POST /api/billing/create-checkout-session
```

Il backend apre una sessione Stripe Checkout in modalità `subscription`. Prima del checkout il cliente compila i dati aziendali necessari per la futura attivazione. Devi creare su Stripe tre Price ricorrenti e inserirli in `.env`:

```env
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_TEAM=price_xxx
STRIPE_PRICE_BUSINESS=price_xxx
```

Gli URL Stripe sono impostati su `/prezzi?checkout=success&session_id={CHECKOUT_SESSION_ID}` e `/prezzi?checkout=cancel&session_id={CHECKOUT_SESSION_ID}` così il sito mostra il banner corretto dopo il ritorno da Checkout. Il webhook `/api/billing/webhook` gestisce `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_failed` e `invoice.payment_failed`.

Quando il pagamento è confermato, la marketing API:

- invia una mail di successo al cliente;
- invia una mail interna a `INTERNAL_PAYMENT_EMAIL`, oppure `SALES_TO_EMAIL`, oppure `SMTP_USER`;
- chiama l’API dell’applicativo SaaS per creare l’azienda già attiva con abbonamento collegato.

Configura l’endpoint SaaS così:

```env
APP_COMPANY_CREATE_URL=https://api.teamcontrolcenter.it/api/companies/public-provisioning
APP_COMPANY_CREATE_METHOD=POST
APP_COMPANY_API_TOKEN=eventuale-token-bearer
APP_COMPANY_API_KEY=eventuale-api-key
```

Per il primo lancio puoi lasciare Stripe non configurato: il sito userà il form demo/contatti e invierà la richiesta al team interno.

## GDPR e pagine legali

Il pacchetto contiene pagine legali estese per Privacy, Cookie, Termini di servizio, DPA, Sicurezza, Sub-responsabili e Recesso/Rimborsi. I testi sono predisposti per un SaaS B2B con aziende, utenti invitati, ruoli, pagamenti Stripe, account demo, eventuali account gratuiti riservati e responsabilità del cliente sui dati caricati.

Prima del lancio pubblico vanno validati da un consulente legale/privacy e completati, dove necessario, con ragione sociale, sede, P.IVA, PEC e dati contrattuali del soggetto fornitore. Il sito non abilita analytics o marketing cookie prima del consenso.
