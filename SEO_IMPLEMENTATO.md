# SEO e contenuti implementati - Team Control Center

Questo pacchetto rende il sito marketing più descrittivo, più verticale e più indicizzabile.

## Cosa è stato aggiunto

- Home molto più descrittiva sul valore del prodotto: gestione team, presenze, progetti, chat, documenti, report e ruoli.
- Pagina funzionalità ampliata con moduli operativi e spiegazioni reali.
- Pagina prezzi mantenuta con i piani Starter, Team e Business.
- Pagine verticali SEO:
  - `/software-gestione-presenze-dipendenti`
  - `/software-gestione-progetti-team`
  - `/software-per-cooperative`
  - `/software-per-agenzie`
  - `/software-per-scuole-private`
- Sezione blog completa:
  - `/blog`
  - 10 articoli SEO-friendly già pubblicabili.
- Footer ampliato con link a prodotto, soluzioni e pagine legali estese.
- FAQ SEO in home/funzionalità/prezzi.


## Pagine legali rafforzate

Sono state rese corpose e pubblicabili le seguenti pagine:

- `/privacy`: informativa privacy estesa con ruoli titolare/responsabile, dati trattati, finalità, basi giuridiche, conservazione, destinatari, trasferimenti, sicurezza, diritti e minori.
- `/cookie-policy`: cookie tecnici, local storage, analytics, marketing, banner, consenso, rifiuto e terze parti.
- `/termini`: termini SaaS B2B con account, ruoli, piani, pagamenti, Stripe, account gratuiti/promozionali, sospensione, limitazione responsabilità, proprietà intellettuale, legge applicabile e foro.
- `/dpa`: Data Processing Agreement con istruzioni, categorie dati, misure tecniche, sub-responsabili, data breach, cancellazione, audit e trasferimenti.
- `/sicurezza`: policy di sicurezza, accessi, log, backup, vulnerability disclosure e responsabilità condivisa.
- `/sub-responsabili`: categorie di fornitori e sub-responsabili per hosting, pagamento, email, DNS/CDN, sicurezza, analytics e supporto.
- `/recesso-rimborsi`: cancellazione, mancato pagamento, rinnovi, rimborsi, recesso consumer se applicabile ed esportazione dati.

Nota: i testi non possono garantire protezione legale assoluta. Sono stati impostati in modo prudenziale e vanno validati con consulente legale/privacy prima del go-live, soprattutto per dati societari, P.IVA, PEC, foro e condizioni commerciali effettive.

## SEO tecnico già configurato

- Title univoco per ogni pagina.
- Meta description univoca per ogni pagina.
- Meta keywords coerenti con il contenuto.
- Canonical URL per ogni pagina.
- Open Graph per condivisione social.
- Twitter Card.
- `robots.txt`.
- `sitemap.xml` con 28 URL.
- JSON-LD:
  - Organization
  - WebSite
  - SoftwareApplication
  - Blog
  - BlogPosting
  - BreadcrumbList
  - FAQPage
- Fallback HTML dentro `#root` per rendere ogni URL leggibile anche prima del rendering React.
- Manifest web app.
- `security.txt`.
- Nginx frontend con cache asset, gzip e header di sicurezza.

## Build verificata

Comando eseguito con successo:

```bash
cd frontend
npm install
npm run build
```

Risultato:

- Build React/Vite completata.
- 28 pagine statiche generate in `frontend/dist`.
- Cartella `site` aggiornata con lo stesso output statico.

## Nota importante

Nel sito pubblico non è stato inserito nessun riferimento a piani gratuiti riservati o attivazioni gratuite manuali. La pagina prezzi mantiene solo i piani commerciali pubblici.
