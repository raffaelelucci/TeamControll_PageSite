# SEO + AI Discoverability Blog Update V13

Intervento eseguito senza modificare checkout, cookie banner, form demo, routing applicativo, componenti di pagamento o logiche backend.

## Obiettivo
Rafforzare il posizionamento organico di Team Control Center contro competitor molto più grandi, puntando su keyword specifiche e contenuti utili per utenti, motori di ricerca e assistenti AI.

## Keyword presidiate
- software gestione team aziendale
- gestionale presenze e progetti
- software SaaS per PMI
- gestionale aziendale per cooperative
- software per gestione team e documenti
- alternativa semplice a Excel per presenze e attività
- gestione presenze dipendenti online
- software gestione progetti team
- chat aziendale interna
- report aziendali operativi
- ruoli e permessi SaaS

## Cosa è stato fatto
- Rivisti e ampliati tutti i blog già presenti.
- Ripristinati nel sorgente anche gli articoli che erano presenti come pagine statiche ma non più censiti nei dati blog.
- Aggiunti 6 nuovi articoli cluster sulle keyword strategiche.
- Aggiunto un articolo specifico “Team Control Center spiegato per Google, motori di ricerca e assistenti AI”.
- Portato il blog a 34 articoli indicizzabili.
- Aggiornato il post-build SEO con JSON-LD più ricco: Organization, WebSite, SoftwareApplication, Blog, BlogPosting e FAQPage.
- Aggiunto `llms.txt` per fornire una sintesi machine-readable del prodotto, delle keyword, del pubblico e degli articoli.
- Aggiornato `robots.txt` per consentire esplicitamente `/llms.txt`.
- Rigenerati `sitemap.xml`, pagine statiche SEO in `frontend/dist` e copia statica in `site`.

## Build verificata
Comando eseguito:

```bash
cd frontend
npm run build
```

Risultato:

- Build completata correttamente.
- Pagine SEO generate: 52.
- Articoli blog generati: 34.
- Sitemap aggiornata con tutte le URL.

## File principali modificati
- `frontend/src/content.ts`
- `frontend/scripts/seo-data.mjs`
- `frontend/scripts/postbuild-seo.mjs`
- `frontend/index.html`
- `frontend/public/llms.txt`
- `frontend/dist/**`
- `site/**`

