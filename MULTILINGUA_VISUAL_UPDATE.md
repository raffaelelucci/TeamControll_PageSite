# Team Control Center - aggiornamento multilingua e visual marketing

## Obiettivo
Aggiornamento del sito marketing senza eliminare contenuti esistenti e senza modificare il senso delle pagine già presenti.

## Cosa è stato aggiunto

### Multilingua IT/EN
- Lingua italiana mantenuta come esperienza principale.
- Nuove rotte inglesi indicizzabili:
  - `/en`
  - `/en/features`
  - `/en/pricing`
  - `/en/demo`
  - `/en/contact`
  - `/en/blog`
  - `/en/administration-center`
  - `/en/team-management-software`
  - `/en/kanban-board`
  - `/en/software-for-smes`
  - `/en/alternative-to-excel-whatsapp`
  - `/en/project-management-software-smes`
  - `/en/business-demo-3-days`
- Blog inglese iniziale con articoli SEO orientati a SME, Kanban, administration center e alternative a Excel/WhatsApp.
- Switch lingua IT/EN in header desktop e mobile.
- Meta tag dinamici in inglese lato React.
- Pagine statiche SEO inglesi generate nel post-build.
- `hreflang` IT/EN sulle pagine principali.
- Sitemap aggiornata con URL italiani e inglesi.

### Visual upgrade
- Nuova sezione visuale moderna con mockup Kanban/operational dashboard.
- Nuova sezione internazionale/AI-friendly per comunicare crescita fuori dall'Italia.
- Grafica glassmorphism, gradienti, orb visuali, metriche flottanti e card moderne.
- Mobile responsive mantenuto.
- Nessuna funzionalità esistente rimossa.

### SEO e AI discoverability
- Contenuti statici inglesi prerenderizzati per crawler.
- JSON-LD in inglese per le nuove pagine.
- Hreflang per ridurre ambiguità tra pagine IT/EN.
- `llms.txt` aggiornato con URL internazionali.
- Sitemap generata con 96 URL.

## Build verificata
Comando eseguito:

```bash
cd frontend
npm run build
```

Esito:

```txt
SEO pages generated: 96
```

Warning non bloccante:
- Vite segnala un chunk JS superiore a 500 kB. La build è completata correttamente. In futuro si può valutare code splitting per alleggerire il bundle.
