# Fix Contattaci, Demo e Google Analytics

Aggiornamento applicato senza rimuovere contenuti o logiche esistenti.

## Contattaci

Aggiunta una pagina `/contatti` dedicata alle richieste generiche/commerciali con:

- nome;
- cognome;
- email;
- azienda;
- oggetto;
- testo del messaggio;
- allegati opzionali.

Gli allegati sono opzionali e limitati a 5 file, massimo 8 MB ciascuno. Formati ammessi: PDF, Word, Excel, CSV, TXT, PNG e JPG.

Endpoint backend dedicato:

```txt
POST /api/contacts/request
Content-Type: multipart/form-data
```

Il flusso è separato da quello demo, così non altera `/api/leads/request-activation`.

## Demo

Verificato e lasciato attivo il flusso demo:

```txt
POST /api/leads/request-activation
Content-Type: application/json
```

Il backend restituisce sempre `ok: true` quando la richiesta viene ricevuta, anche se l'invio SMTP fallisce. In quel caso il frontend mostra un messaggio di attenzione utile per controllare la configurazione SMTP/log, senza perdere il lead.

## Google Analytics

Rafforzata la comunicazione GA4:

- caricamento solo dopo consenso analytics;
- invio `page_view` esplicito;
- eventi conversione per demo e contatti;
- helper console `window.tccAnalyticsTest()`;
- debug mode attivabile con query string `?analytics_debug=1` oppure con localStorage `tcc_analytics_debug=true`;
- CSP aggiornata per consentire gli endpoint GA4 reali usati da Google Analytics.

Test consigliato dopo deploy:

```js
localStorage.setItem('tcc_analytics_debug', 'true')
window.tccAnalyticsTest()
```

In DevTools > Network filtrare:

```txt
collect
```

La chiamata verso Google Analytics deve restituire normalmente status 204.
