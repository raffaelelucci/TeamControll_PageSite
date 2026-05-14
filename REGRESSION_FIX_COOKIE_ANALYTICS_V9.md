# Patch v9 - Ripristino cookie banner e Analytics GDPR

Questa patch corregge la regressione introdotta sul banner cookie, senza rimuovere le migliorie SEO/blog e senza toccare la marketing API.

## Ripristinato

- Gestione GDPR completa del banner cookie con categorie:
  - necessari;
  - analytics;
  - marketing/profilazione.
- Caricamento condizionato di Google Analytics `G-FZPVP3ECSZ` solo dopo consenso analytics.
- Revoca consenso dal footer con pulsante `Gestisci preferenze cookie`.
- Pulizia cookie analytics quando l'utente rifiuta o revoca.
- CSP Nginx compatibile con Google Analytics/Tag Manager.
- Stile cookie banner riportato alla versione precedente stabile, non alla versione bottom-sheet/glass della v6.

## Verifiche eseguite

- `frontend npm run build`: OK
- `marketing-api npm run build`: OK
- SEO pages generate: 38 URL

## Nota

Il codice Analytics non è statico in `index.html`: viene caricato dinamicamente da `App.tsx` solo dopo consenso.
