# Gestione Cookie GDPR - Team Control Center

Implementazione aggiornata per il sito SEO Team Control Center.

## Cosa è stato implementato

- Banner cookie professionale con tre azioni principali: rifiuta non necessari, personalizza, accetta analytics.
- Pannello preferenze con categorie: tecnici necessari, analytics, marketing/profilazione.
- Cookie tecnici sempre attivi e non disattivabili dal banner.
- Google Analytics 4 `G-FZPVP3ECSZ` caricato solo dopo consenso analytics.
- Nessun tag Google Analytics inserito direttamente in `index.html` prima del consenso.
- Revoca/modifica consenso tramite link nel footer: “Gestisci preferenze cookie”.
- Pulizia dei cookie analytics noti (`_ga`, `_ga_*`, `_gid`, `_gat`, `_gac_*`) quando l’utente rifiuta o revoca il consenso.
- Cookie Policy aggiornata con descrizione delle categorie, strumenti e durata indicativa.
- CSP Nginx aggiornata per consentire Google Tag Manager/Analytics solo quando lo script viene caricato lato client dopo consenso.

## Chiave di consenso usata

La preferenza viene salvata nel browser con:

```text
tcc_cookie_consent_v1
```

La vecchia chiave `tcc_cookie_choice` viene migrata automaticamente.

## Test rapido dopo deploy

1. Apri il sito in finestra anonima.
2. Prima del consenso verifica da DevTools → Network che non partano chiamate verso:
   - `googletagmanager.com`
   - `google-analytics.com`
3. Clicca “Accetta analytics”.
4. Verifica che venga caricato:
   - `https://www.googletagmanager.com/gtag/js?id=G-FZPVP3ECSZ`
5. Dal footer clicca “Gestisci preferenze cookie”.
6. Disattiva analytics e salva.
7. Verifica che i cookie `_ga` vengano rimossi dove tecnicamente possibile.

## File principali modificati

```text
frontend/src/App.tsx
frontend/src/styles.css
frontend/src/legal.ts
frontend/scripts/legal-data.mjs
frontend/nginx.conf
```
