# Contattaci e verifica flusso demo

## Cosa è stato aggiunto

È stata separata la pagina `/contatti` dal flusso demo. La pagina Contattaci ora contiene un form dedicato con:

- nome;
- cognome;
- email aziendale;
- azienda;
- oggetto;
- testo del messaggio;
- allegati opzionali.

Gli allegati sono gestiti dal backend tramite endpoint multipart dedicato.

## Endpoint nuovo

```http
POST /api/contacts/request
Content-Type: multipart/form-data
```

Campi richiesti:

```txt
firstName
lastName
email
company
subject
message
```

Campo opzionale:

```txt
documents
```

Limiti allegati:

- massimo 5 file;
- massimo 8 MB per file;
- formati ammessi: PDF, Word, Excel, CSV, TXT, PNG, JPG.

## Flusso demo verificato

Il flusso demo resta sull’endpoint esistente:

```http
POST /api/leads/request-activation
Content-Type: application/json
```

Il form demo non è stato eliminato né fuso con il form contatti. Sono stati aggiunti:

- stato loading;
- messaggi success/error più chiari;
- validazione backend più robusta su nome azienda, nome referente ed email;
- tracciamento evento analytics solo se l’utente ha accettato i cookie analytics.

## Variabili ambiente email

Per ricevere le richieste bisogna configurare SMTP e destinatari:

```env
SALES_TO_EMAIL=attivazioni@teamcontrolcenter.it
CONTACT_TO_EMAIL=contatti@teamcontrolcenter.it
MAIL_FROM="Team Control Center <noreply@teamcontrolcenter.it>"
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@teamcontrolcenter.it
SMTP_PASS=change-me
```

Se SMTP o destinatari non sono configurati, l’endpoint risponde comunque `ok: true` per non bloccare l’esperienza utente, ma restituisce `mailNotified: false` e scrive l’errore nei log della marketing API.

## Nginx

Per supportare allegati dal dominio principale è stato aggiunto in `nginx/teamcontrolcenter-site.conf`:

```nginx
client_max_body_size 50M;
```

Dopo il deploy ricordarsi di ricaricare Nginx se questa configurazione viene applicata sulla VPS.
