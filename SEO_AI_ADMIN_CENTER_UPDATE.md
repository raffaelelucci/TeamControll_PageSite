# Aggiornamento SEO / AI / Marketing - Centro amministrativo, PM, Kanban e demo 3 giorni

## Obiettivo
Aggiornare sito marketing e blog di Team Control Center valorizzando le nuove funzionalità senza eliminare contenuti esistenti e senza modificare il senso delle pagine già presenti.

## Contenuti aggiunti o potenziati
- Centro amministrativo aziendale per Company Admin.
- Gestione utenti avanzata: filtri, sospensione, riattivazione, reset password temporanee, cambio ruoli e trasferimento assegnazioni.
- Piano e utilizzo: piano attivo, funzionalità abilitate, utenti, progetti, documenti, storage e suggerimenti upgrade.
- Centro sicurezza: utenti sospesi, utenti inattivi, password da cambiare e audit eventi sensibili.
- Audit aziendale: storico operazioni amministrative importanti.
- Template progetto per commesse, pratiche, onboarding clienti e lavori ripetitivi.
- Scadenze e criticità: documenti in scadenza, attività Kanban in ritardo, richieste assenza pendenti.
- Reparti e organizzazione come base per futura vista organigramma.
- Ruolo PM / Project Manager e Kanban Board stile Trello integrata nei progetti.
- Demo aziendale 3 giorni con azienda demo isolata e cancellazione completa dei dati.

## Nuove pagine SEO pillar/use case
- /software-gestione-team-aziendale
- /kanban-board-aziendale
- /software-presenze-progetti-documenti
- /software-per-pmi
- /alternativa-trello-pmi
- /alternativa-excel-whatsapp
- /faq
- /centro-amministrativo-aziendale
- /gestione-utenti-aziendali
- /audit-sicurezza-aziendale
- /demo-aziendale-3-giorni
- /software-project-management-pmi
- /gestionale-ruoli-aziendali
- /template-progetto-aziendale

## Blog aggiunti
- Centro amministrativo aziendale: perché il Company Admin ha bisogno di controllo operativo.
- Software gestionale per PMI: utenti, progetti, documenti, Kanban e audit in un’unica piattaforma.
- Come gestire ruoli aziendali, PM, Lead e Viewer senza confusione.
- Kanban Board aziendale: alternativa semplice e integrata agli strumenti separati.
- Perché una PMI dovrebbe usare un gestionale con audit, scadenze e controllo utenti.
- Software per cooperative e aziende: gestione documenti, progetti, presenze e sicurezza.
- Come eliminare Excel, WhatsApp e cartelle sparse nella gestione del team.
- Demo SaaS aziendale: come provare Team Control Center per 3 giorni.

## SEO tecnico / AI discovery
- Sitemap aggiornata automaticamente: 80 URL generate.
- Robots.txt potenziato con regole per crawler generali, OAI-SearchBot, GPTBot e Bingbot, bloccando aree private/API.
- llms.txt aggiornato con nuove funzionalità, piani e URL strategiche.
- Pagine statiche generate anche per le nuove landing SEO, con contenuti testuali reali e non solo metadata.
- Dati strutturati già presenti nel postbuild SEO: Organization, WebSite, SoftwareApplication, Blog, BlogPosting, FAQPage, BreadcrumbList.
- Aggiunto supporto IndexNow: file indexnow-key.txt, payload indexnow-urls.json e script `npm run submit:indexnow` dopo deploy.

## Piani aggiornati
### Starter
Dashboard, Profilo, Progetti base, ricerca limitata, notifiche base, scadenziario base, export base, tutorial primo accesso, amministrazione aziendale base. Non include Kanban, PM operativo, audit completo, template, sicurezza avanzata o trasferimento assegnazioni.

### Team
Tutto Starter, PM / Project Manager, Kanban Board progetto, assegnazione Lead/Viewer, centro amministrativo completo operativo, gestione utenti avanzata, trasferimento assegnazioni, template progetto, activity feed, workload, report base, sicurezza base. Piano consigliato.

### Business
Tutto Team, audit completo, sicurezza avanzata, report avanzati, Kanban avanzata, storico modifiche, automazioni avanzate, regole amministrative, export storico e maggiore controllo direzionale.

## Verifiche effettuate
- `cd frontend && npm run build` completato correttamente.
- `cd marketing-api && npm run build` completato correttamente prima della pulizia node_modules.
- Build frontend completata con warning Vite standard sul chunk JS > 500 KB, non bloccante.

## Dopo il deploy
1. Aprire https://teamcontrolcenter.it/sitemap.xml e verificare le nuove URL.
2. Aprire https://teamcontrolcenter.it/llms.txt.
3. Aprire https://teamcontrolcenter.it/indexnow-key.txt.
4. Inviare la sitemap in Google Search Console e Bing Webmaster Tools.
5. Dopo il deploy eseguire, se desiderato: `cd frontend && npm run submit:indexnow`.
