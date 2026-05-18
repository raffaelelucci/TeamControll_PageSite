# Fix Google Analytics static tag

## Cosa è stato corretto

Il tag Google Analytics non era presente nel sorgente HTML nella forma classica visibile in `index.html`, perché veniva caricato dinamicamente dopo il consenso cookie.

Ora il tag è stato inserito staticamente in:

- `frontend/index.html`
- `frontend/dist/index.html` dopo la build
- tutte le pagine statiche SEO generate dal post-build
- cartella `site/`

Measurement ID:

```txt
G-FZPVP3ECSZ
```

## Nota GDPR / cookie

Il tag è presente nel codice HTML, ma usa Consent Mode con `analytics_storage: 'denied'` di default.

Questo significa che:

- Google Tag viene caricato;
- Analytics non viene abilitato realmente finché l’utente non accetta i cookie analytics;
- quando l’utente accetta, React aggiorna il consenso a `granted` e invia gli eventi/page_view.

## File modificati

- `frontend/index.html`
- `frontend/src/App.tsx`
- `frontend/dist/**`
- `site/**`

## Comando build verificato

```bash
cd frontend
npm run build
```

Risultato:

```txt
SEO pages generated: 80
```

## Test da fare dopo deploy

Aprire il sito e controllare in console:

```js
document.querySelector('script[data-tcc-analytics]')
typeof window.gtag
localStorage.getItem('tcc_cookie_consent_v1')
```

Dopo aver accettato Analytics, eseguire:

```js
window.tccAnalyticsTest()
```

Poi controllare DevTools > Network filtrando:

```txt
collect
```

Una chiamata verso Google Analytics con status 204 indica che l’evento è stato inviato.
