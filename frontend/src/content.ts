export type PageKey =
  | 'home'
  | 'features'
  | 'pricing'
  | 'demo'
  | 'contacts'
  | 'presence'
  | 'projects'
  | 'cooperatives'
  | 'agencies'
  | 'schools'
  | 'blog'
  | 'privacy'
  | 'cookies'
  | 'terms'
  | 'dpa'
  | 'security'
  | 'subprocessors'
  | 'refunds';

export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  h1: string;
  kicker: string;
  keywords?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  h1: string;
  intro: string;
  sections: { title: string; text: string }[];
  takeaway: string;
  keywords: string[];
};

export const baseUrl = 'https://teamcontrolcenter.it';

export const routes: Record<PageKey, RouteMeta> = {
  home: {
    path: '/',
    title: 'Team Control Center | Software gestione team, presenze, progetti e aziende',
    description:
      'Team Control Center è la piattaforma SaaS per gestire team, presenze, progetti, chat, documenti, report e attività aziendali in un unico ambiente sicuro.',
    h1: 'Gestisci team, presenze, progetti e documenti aziendali da un unico centro di controllo',
    kicker: 'Piattaforma SaaS per PMI, agenzie, cooperative e scuole private',
    keywords: ['software gestione team', 'gestione presenze dipendenti', 'gestione progetti aziendali', 'chat aziendale', 'report aziendali']
  },
  features: {
    path: '/funzionalita',
    title: 'Funzionalità Team Control Center | Presenze, progetti, chat, documenti e report',
    description:
      'Scopri le funzionalità di Team Control Center: anagrafiche aziendali, team, ruoli, timbrature, assenze, straordinari, progetti, documenti, chat e report.',
    h1: 'Tutte le funzionalità per organizzare davvero il lavoro quotidiano',
    kicker: 'Funzionalità operative',
    keywords: ['funzionalità software aziendale', 'timbrature online', 'assenze dipendenti', 'documenti progetto', 'dashboard aziendale']
  },
  pricing: {
    path: '/prezzi',
    title: 'Prezzi Team Control Center | Piani SaaS per aziende e team',
    description:
      'Prezzi Team Control Center per aziende, micro team e organizzazioni strutturate. Piani Starter, Team e Business con attivazione guidata e pagamento sicuro.',
    h1: 'Piani semplici, chiari e pronti per crescere con la tua azienda',
    kicker: 'Prezzi e abbonamenti',
    keywords: ['prezzi software gestione team', 'abbonamento SaaS aziendale', 'software presenze prezzo']
  },
  demo: {
    path: '/demo',
    title: 'Richiedi demo Team Control Center | Consulenza guidata per la tua azienda',
    description:
      'Richiedi una demo di Team Control Center e scopri come digitalizzare presenze, progetti, chat, documenti, report e processi aziendali.',
    h1: 'Guarda come può lavorare una squadra davvero organizzata',
    kicker: 'Demo guidata',
    keywords: ['demo software aziendale', 'demo gestione presenze', 'demo gestione team']
  },
  contacts: {
    path: '/contatti',
    title: 'Contatti Team Control Center | Informazioni, demo e attivazione',
    description:
      'Contatta Team Control Center per informazioni commerciali, demo, attivazione aziendale, piani SaaS, gestione team, presenze e progetti.',
    h1: 'Parliamo della tua organizzazione e del modo migliore per gestirla',
    kicker: 'Contatti',
    keywords: ['contatti Team Control Center', 'richiesta informazioni software aziendale']
  },
  presence: {
    path: '/software-gestione-presenze-dipendenti',
    title: 'Software gestione presenze dipendenti online | Timbrature, assenze e straordinari',
    description:
      'Software per gestione presenze dipendenti online: timbrature, pause, sede o smart working, ferie, permessi, malattie, straordinari e report aziendali.',
    h1: 'Software gestione presenze dipendenti senza fogli Excel e controlli manuali',
    kicker: 'Soluzione per presenze e timbrature',
    keywords: ['software gestione presenze dipendenti', 'timbrature online', 'assenze dipendenti', 'straordinari dipendenti']
  },
  projects: {
    path: '/software-gestione-progetti-team',
    title: 'Software gestione progetti e team | Attività, documenti e comunicazioni',
    description:
      'Gestisci progetti, team, attività, note, allegati, documenti e comunicazioni operative con una piattaforma unica per aziende organizzate.',
    h1: 'Software gestione progetti e team per tenere insieme attività, documenti e comunicazioni',
    kicker: 'Soluzione per progetti aziendali',
    keywords: ['software gestione progetti team', 'gestione attività aziendali', 'documenti progetto', 'chat progetto']
  },
  cooperatives: {
    path: '/software-per-cooperative',
    title: 'Software per cooperative | Gestione personale, presenze, progetti e report',
    description:
      'Team Control Center aiuta cooperative e imprese operative a coordinare personale, turni, presenze, documenti, attività, progetti e report.',
    h1: 'Software per cooperative che devono coordinare persone, sedi, attività e documenti',
    kicker: 'Per cooperative e squadre operative',
    keywords: ['software per cooperative', 'gestione personale cooperative', 'presenze cooperative']
  },
  agencies: {
    path: '/software-per-agenzie',
    title: 'Software per agenzie | Progetti clienti, team, ore e documenti',
    description:
      'Software per agenzie digitali, creative e consulenziali: progetti clienti, assegnazioni, chat, documenti, ore lavorate, report e collaborazione team.',
    h1: 'Software per agenzie che vogliono controllare progetti, ore, persone e documenti',
    kicker: 'Per agenzie e studi professionali',
    keywords: ['software per agenzie', 'gestione progetti agenzia', 'ore team agenzia']
  },
  schools: {
    path: '/software-per-scuole-private',
    title: 'Software per scuole private | Team, presenze, documenti e comunicazioni interne',
    description:
      'Team Control Center supporta scuole private e realtà formative nella gestione di personale, ruoli, presenze, documenti, attività interne e comunicazioni.',
    h1: 'Software per scuole private che vogliono organizzare personale, comunicazioni e documenti',
    kicker: 'Per scuole private e realtà formative',
    keywords: ['software per scuole private', 'gestione personale scuola privata', 'documenti scuola privata']
  },
  blog: {
    path: '/blog',
    title: 'Blog Team Control Center | Confronti gestionali, SEO e guide per PMI',
    description:
      'Guide pratiche e confronti SEO per aziende, agenzie, cooperative e scuole private: Team Control Center vs CRM, project management, Excel, Trello, Asana, monday.com, Notion e altri gestionali.',
    h1: 'Guide pratiche per aziende che vogliono lavorare meglio',
    kicker: 'Blog e risorse',
    keywords: ['blog gestione aziendale', 'confronti software gestionali', 'alternative Trello Asana monday', 'gestione presenze progetti', 'organizzazione aziendale']
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy Policy estesa | Team Control Center',
    description:
      'Informativa privacy estesa di Team Control Center per sito, demo, abbonamenti SaaS, area applicativa, ruoli privacy, basi giuridiche, conservazione, diritti GDPR e sicurezza.',
    h1: 'Privacy Policy estesa',
    kicker: 'Conformità GDPR e trasparenza dati',
    keywords: ['privacy Team Control Center', 'informativa GDPR SaaS', 'privacy software gestione team']
  },
  cookies: {
    path: '/cookie-policy',
    title: 'Cookie Policy estesa | Team Control Center',
    description:
      'Cookie Policy estesa di Team Control Center: cookie tecnici, local storage, analytics, marketing, consenso preventivo, rifiuto, preferenze e terze parti.',
    h1: 'Cookie Policy estesa',
    kicker: 'Cookie, consenso e strumenti di tracciamento',
    keywords: ['cookie policy Team Control Center', 'cookie SaaS', 'consenso cookie analytics']
  },
  terms: {
    path: '/termini',
    title: 'Termini di servizio estesi | Team Control Center',
    description:
      'Termini di servizio estesi Team Control Center: uso B2B, account aziendali, ruoli, abbonamenti, pagamenti, limitazioni di responsabilità, sospensione, recesso e dati del cliente.',
    h1: 'Termini di servizio estesi',
    kicker: 'Condizioni contrattuali SaaS',
    keywords: ['termini servizio SaaS', 'condizioni software gestione team', 'abbonamento Team Control Center']
  },
  dpa: {
    path: '/dpa',
    title: 'Data Processing Agreement esteso | Team Control Center',
    description:
      'DPA esteso per clienti aziendali Team Control Center: ruoli privacy, istruzioni, misure tecniche e organizzative, sub-responsabili, data breach, cancellazione e audit.',
    h1: 'Data Processing Agreement esteso',
    kicker: 'Responsabile del trattamento e protezione dati aziendali',
    keywords: ['DPA SaaS', 'responsabile trattamento software', 'GDPR Team Control Center']
  },
  security: {
    path: '/sicurezza',
    title: 'Sicurezza del servizio | Team Control Center',
    description:
      'Politica di sicurezza Team Control Center: separazione dati aziendali, ruoli, accessi, backup, log, incident response, vulnerabilità e responsabilità condivisa.',
    h1: 'Sicurezza del servizio',
    kicker: 'Misure tecniche e responsabilità condivisa',
    keywords: ['sicurezza SaaS', 'sicurezza software aziendale', 'ruoli e permessi']
  },
  subprocessors: {
    path: '/sub-responsabili',
    title: 'Sub-responsabili e fornitori | Team Control Center',
    description:
      'Elenco informativo delle categorie di sub-responsabili e fornitori Team Control Center: hosting, pagamenti, email, DNS, sicurezza, analytics e supporto.',
    h1: 'Sub-responsabili e fornitori',
    kicker: 'Catena tecnica del servizio SaaS',
    keywords: ['sub-responsabili SaaS', 'fornitori Team Control Center', 'subprocessor GDPR']
  },
  refunds: {
    path: '/recesso-rimborsi',
    title: 'Recesso, cancellazione e rimborsi | Team Control Center',
    description:
      'Regole su cancellazione abbonamento, rinnovi, mancato pagamento, recesso, rimborsi, esportazione dati e cessazione del servizio Team Control Center.',
    h1: 'Recesso, cancellazione e rimborsi',
    kicker: 'Gestione abbonamenti e cessazione',
    keywords: ['recesso SaaS', 'cancellazione abbonamento software', 'rimborsi Team Control Center']
  }
};

export const benefits = [
  {
    title: 'Un solo posto per tutto il lavoro operativo',
    text: 'Presenze, assenze, progetti, documenti, chat e report convivono nella stessa piattaforma: meno passaggi manuali, meno file sparsi, meno informazioni perse.'
  },
  {
    title: 'Ruoli chiari e dati sempre nel perimetro corretto',
    text: 'Super Admin, amministratore aziendale, lead e collaboratori lavorano con permessi separati. Ogni profilo vede solo ciò che deve vedere.'
  },
  {
    title: 'Controllo reale su presenze e attività',
    text: 'Timbrature, pause, sede, smart working, ferie, permessi, malattie e straordinari vengono gestiti in modo strutturato e consultabile.'
  },
  {
    title: 'Progetti più leggibili per responsabili e team',
    text: 'Ogni progetto può raccogliere persone coinvolte, comunicazioni, note, file e informazioni operative, così il lavoro resta tracciato.'
  },
  {
    title: 'Report pronti per direzione e amministrazione',
    text: 'Le informazioni operative diventano report esportabili e utili per controllo interno, amministrazione, consulenti e decisioni aziendali.'
  },
  {
    title: 'Pensato per aziende che crescono',
    text: 'Il modello SaaS consente di partire rapidamente e aumentare utenti, funzionalità e controllo man mano che l’organizzazione si struttura.'
  }
];

export const features = [
  {
    title: 'Dashboard aziendale',
    text: 'Una vista direzionale su aziende, utenti, team, progetti, presenze, richieste e attività. La dashboard aiuta a capire subito cosa sta succedendo senza aprire mille strumenti.'
  },
  {
    title: 'Gestione aziende e team',
    text: 'Anagrafiche aziendali, profili, persone, gruppi di lavoro e assegnazioni: ogni azienda mantiene il proprio perimetro dati, con organizzazione chiara e scalabile.'
  },
  {
    title: 'Ruoli e permessi profilati',
    text: 'Super Admin, Company Admin, Lead e Viewer/Team Member hanno viste differenti. I collaboratori accedono solo ai propri dati, mentre i lead seguono il loro gruppo operativo.'
  },
  {
    title: 'Presenze, assenze e straordinari',
    text: 'Timbrature giornaliere, pause, ore lavorate, sede o smart working, richieste ferie, permessi, malattie e straordinari vengono raccolti in un flusso semplice e verificabile.'
  },
  {
    title: 'Progetti, attività e documenti',
    text: 'Progetti aziendali con team coinvolti, note, documenti, allegati e informazioni operative. Il contesto del lavoro resta leggibile anche dopo settimane o mesi.'
  },
  {
    title: 'Chat aziendale e comunicazioni',
    text: 'Chat di team e conversazioni singole aiutano a ridurre dispersione tra email, gruppi esterni e messaggi non tracciati, mantenendo le comunicazioni vicine al lavoro.'
  },
  {
    title: 'Report PDF ed esportazioni',
    text: 'Report configurabili e consultazioni storiche permettono di ricostruire attività, presenze e andamento dei progetti in modo più veloce e ordinato.'
  },
  {
    title: 'Mobile responsive',
    text: 'Interfaccia utilizzabile da desktop, tablet e smartphone, utile per team distribuiti, personale fuori sede, responsabili in movimento e realtà operative.'
  },
  {
    title: 'Sicurezza e separazione dati',
    text: 'L’architettura è pensata per separare i dati tra aziende, proteggere gli accessi e mantenere il controllo centralizzato sull’attivazione degli account.'
  }
];

export const plans = [
  {
    key: 'starter',
    name: 'Starter',
    price: '29€',
    note: 'al mese, fino a 5 utenti',
    bestFor: 'Micro team e piccole realtà che vogliono iniziare a digitalizzare il lavoro operativo.',
    bullets: ['Presenze base', 'Progetti base', 'Chat team', 'Dashboard essenziale', 'Report essenziali', 'Supporto via email'],
    cta: 'Attiva Starter'
  },
  {
    key: 'team',
    name: 'Team',
    price: '79€',
    note: 'al mese, fino a 20 utenti',
    bestFor: 'Aziende, agenzie e team in crescita con più persone, progetti e necessità di collaborazione.',
    bullets: ['Tutto Starter', 'Chat singole', 'Documenti progetto', 'Notifiche push', 'Gestione assenze evoluta', 'Report avanzati'],
    cta: 'Attiva Team',
    highlighted: true
  },
  {
    key: 'business',
    name: 'Business',
    price: '149€',
    note: 'al mese, fino a 50 utenti',
    bestFor: 'Organizzazioni strutturate che vogliono controllo, storico, export e supporto di attivazione.',
    bullets: ['Tutto Team', 'Export completi', 'Storico esteso', 'Setup assistito', 'Priorità supporto', 'Governance ruoli avanzata'],
    cta: 'Attiva Business'
  }
];

export const audiences = [
  {
    title: 'PMI e aziende operative',
    path: '/funzionalita',
    text: 'Per chi deve coordinare persone, attività, presenze e documenti senza perdere tempo tra Excel, chat e file locali.'
  },
  {
    title: 'Agenzie e studi professionali',
    path: '/software-per-agenzie',
    text: 'Per seguire progetti clienti, assegnazioni, ore, documenti e comunicazioni interne con un unico quadro operativo.'
  },
  {
    title: 'Cooperative e squadre distribuite',
    path: '/software-per-cooperative',
    text: 'Per gestire operatori, sedi, richieste, presenze e report in realtà dove il lavoro è spesso distribuito sul territorio.'
  },
  {
    title: 'Scuole private e realtà formative',
    path: '/software-per-scuole-private',
    text: 'Per organizzare personale, attività interne, documenti, comunicazioni e controllo operativo in contesti educativi privati.'
  }
];

export const seoFaqs = [
  {
    q: 'Team Control Center sostituisce Excel per presenze e progetti?',
    a: 'Sì. La piattaforma serve proprio a ridurre fogli Excel, chat sparse e documenti non tracciati, portando presenze, progetti, comunicazioni e report dentro un flusso unico.'
  },
  {
    q: 'Ogni azienda vede solo i propri dati?',
    a: 'Sì. Il prodotto è pensato come SaaS multi-azienda con separazione dei dati e ruoli profilati. Ogni azienda lavora nel proprio perimetro.'
  },
  {
    q: 'Un collaboratore può vedere ferie o documenti degli altri?',
    a: 'No. I profili operativi vedono solo le informazioni abilitate per il proprio ruolo e per il proprio perimetro aziendale o progettuale.'
  },
  {
    q: 'Serve installare qualcosa?',
    a: 'No. Team Control Center è una piattaforma web: l’azienda accede dal browser e può lavorare da desktop, tablet e smartphone.'
  }
];

export const verticalDetails: Record<'presence' | 'projects' | 'cooperatives' | 'agencies' | 'schools', { problem: string; solution: string; bullets: string[] }> = {
  presence: {
    problem:
      'Quando le presenze vengono gestite con fogli Excel o messaggi manuali, diventa difficile capire chi ha lavorato, dove, per quante ore e con quali richieste aperte.',
    solution:
      'Team Control Center organizza timbrature, pause, ore lavorate, sede, smart working, ferie, permessi, malattie e straordinari in una vista semplice da consultare.',
    bullets: ['Timbrature e pause', 'Ore lavorate e straordinari', 'Ferie, permessi e malattie', 'Storico consultabile', 'Report per amministrazione']
  },
  projects: {
    problem:
      'Molti progetti falliscono nella gestione quotidiana non per mancanza di competenze, ma perché informazioni, file e comunicazioni restano distribuiti in troppi strumenti.',
    solution:
      'Con Team Control Center ogni progetto raccoglie persone coinvolte, documenti, note, aggiornamenti e comunicazioni operative, rendendo il lavoro più leggibile.',
    bullets: ['Progetti con team assegnati', 'Note e documenti collegati', 'Comunicazioni operative', 'Storico progetto', 'Report e controllo avanzamento']
  },
  cooperatives: {
    problem:
      'Le cooperative spesso coordinano personale distribuito, attività ricorrenti, sedi diverse e documenti amministrativi che devono essere sempre recuperabili.',
    solution:
      'La piattaforma consente di gestire persone, presenze, attività, documenti e report con ruoli chiari e accessi separati per responsabilità.',
    bullets: ['Operatori e gruppi di lavoro', 'Presenze e richieste', 'Documenti centralizzati', 'Responsabili e lead', 'Report per controllo interno']
  },
  agencies: {
    problem:
      'In agenzia il lavoro corre tra clienti, revisioni, task, file e messaggi: senza un sistema unico è facile perdere contesto e ore operative.',
    solution:
      'Team Control Center aiuta a collegare progetti clienti, persone, documenti, ore e comunicazioni, così account, PM e team tecnico lavorano con più chiarezza.',
    bullets: ['Progetti clienti', 'Team e assegnazioni', 'Ore e presenze', 'Documenti e allegati', 'Chat e aggiornamenti']
  },
  schools: {
    problem:
      'Le scuole private hanno bisogno di organizzare personale, comunicazioni, documenti interni e attività quotidiane senza disperdere informazioni tra canali diversi.',
    solution:
      'Team Control Center offre un ambiente riservato per gestire ruoli, personale, presenze, documenti e comunicazioni operative in modo ordinato.',
    bullets: ['Personale e ruoli', 'Presenze e richieste', 'Documenti interni', 'Comunicazioni organizzate', 'Dashboard direzionale']
  }
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'software-gestione-team-aziendale-perche-centralizzare-processi',
    title: 'Perché centralizzare la gestione del team in un unico software aziendale',
    description:
      'Scopri perché un software unico per team, presenze, progetti e documenti riduce errori, dispersione e tempi morti nelle aziende operative.',
    date: '2026-05-13',
    readTime: '6 min',
    category: 'Gestione aziendale',
    author: 'Team Control Center',
    h1: 'Perché centralizzare la gestione del team in un unico software aziendale',
    intro:
      'Ogni azienda cresce portandosi dietro strumenti diversi: un file per le presenze, una chat per gli aggiornamenti, una cartella per i documenti, un foglio per i progetti. All’inizio funziona, poi diventa fragile.',
    sections: [
      { title: 'Il problema non è lo strumento singolo, ma la frammentazione', text: 'Excel, email e chat possono essere utili, ma quando diventano il sistema principale di gestione generano duplicazioni, dati non aggiornati e responsabilità poco chiare.' },
      { title: 'Centralizzare significa dare un contesto a ogni informazione', text: 'Presenze, documenti, progetti e comunicazioni devono essere collegati. In questo modo il responsabile capisce cosa è successo, chi è coinvolto e quali dati sono già disponibili.' },
      { title: 'La crescita richiede ruoli e perimetri', text: 'Quando il team aumenta, non tutti devono vedere tutto. Servono permessi chiari, viste diverse e separazione dei dati per evitare errori e confusione.' }
    ],
    takeaway: 'Un software come Team Control Center aiuta l’azienda a trasformare attività sparse in processi leggibili, controllabili e scalabili.',
    keywords: ['software gestione team aziendale', 'centralizzare processi aziendali', 'gestione team online']
  },
  {
    slug: 'gestione-presenze-dipendenti-online-errori-excel',
    title: 'Gestione presenze dipendenti online: perché superare Excel',
    description:
      'La gestione presenze con Excel sembra semplice, ma può creare errori, versioni duplicate e ritardi. Ecco quando passare a un software online.',
    date: '2026-05-13',
    readTime: '5 min',
    category: 'Presenze',
    author: 'Team Control Center',
    h1: 'Gestione presenze dipendenti online: perché superare Excel',
    intro:
      'Excel è spesso il primo strumento usato per segnare presenze, ferie e permessi. Il problema nasce quando il file diventa la base di un processo aziendale continuo.',
    sections: [
      { title: 'I file manuali non raccontano tutta la storia', text: 'Una cella può contenere un numero di ore, ma difficilmente conserva richiesta, approvazione, motivazione, storico e collegamento con il collaboratore.' },
      { title: 'Le versioni multiple creano incertezza', text: 'Quando lo stesso file passa tra responsabili, amministrazione e consulenti, capire quale versione sia corretta diventa un lavoro nel lavoro.' },
      { title: 'Il software online rende il dato consultabile', text: 'Con una piattaforma web, presenze, assenze e straordinari possono essere gestiti nel tempo, filtrati, controllati e trasformati in report.' }
    ],
    takeaway: 'La gestione presenze online riduce attività manuali e rende più semplice controllare ore, richieste e storico operativo.',
    keywords: ['gestione presenze dipendenti online', 'software timbrature', 'presenze senza Excel']
  },
  {
    slug: 'gestione-progetti-team-pmi-attivita-documenti-comunicazioni',
    title: 'Gestione progetti e team per PMI: attività, documenti e comunicazioni insieme',
    description:
      'Una guida per PMI che vogliono gestire progetti, persone, documenti e comunicazioni senza disperdere informazioni operative.',
    date: '2026-05-13',
    readTime: '7 min',
    category: 'Progetti',
    author: 'Team Control Center',
    h1: 'Gestione progetti e team per PMI: attività, documenti e comunicazioni insieme',
    intro:
      'Nelle PMI i progetti sono spesso seguiti da poche persone che fanno molte cose. Per questo il contesto deve essere immediato, non nascosto in strumenti diversi.',
    sections: [
      { title: 'Il progetto non è solo una lista di attività', text: 'Un progetto contiene decisioni, file, persone, comunicazioni, scadenze e responsabilità. Se questi elementi sono separati, il controllo diminuisce.' },
      { title: 'Il team deve sapere dove guardare', text: 'Un ambiente unico riduce domande ripetute, passaggi informali e perdita di informazioni tra chat, email e cartelle.' },
      { title: 'Il responsabile ha bisogno di sintesi', text: 'Dashboard e report servono a capire andamento, carichi e criticità senza ricostruire manualmente tutto a fine mese.' }
    ],
    takeaway: 'Per una PMI, un software di gestione progetti funziona quando collega attività, persone, documenti e comunicazioni in modo naturale.',
    keywords: ['gestione progetti PMI', 'software gestione progetti team', 'documenti progetto']
  },
  {
    slug: 'chat-aziendale-interna-per-ridurre-email-e-messaggi-sparsi',
    title: 'Chat aziendale interna: come ridurre email e messaggi sparsi',
    description:
      'La chat aziendale è utile se resta collegata al lavoro. Ecco come usarla per ridurre dispersione e migliorare la collaborazione.',
    date: '2026-05-13',
    readTime: '5 min',
    category: 'Comunicazione',
    author: 'Team Control Center',
    h1: 'Chat aziendale interna: come ridurre email e messaggi sparsi',
    intro:
      'Le comunicazioni interne sono spesso il punto più fragile dell’organizzazione: messaggi vocali, gruppi esterni, email e file inviati più volte rendono difficile ricostruire le decisioni.',
    sections: [
      { title: 'La chat deve stare vicino al lavoro', text: 'Una comunicazione è più utile quando è collegata a un team, a un progetto o a una relazione operativa precisa.' },
      { title: 'Meno canali significa meno perdita di contesto', text: 'Ridurre strumenti paralleli aiuta il team a sapere dove scrivere, dove cercare e dove recuperare lo storico.' },
      { title: 'La tracciabilità aiuta anche i nuovi ingressi', text: 'Quando una persona entra in un progetto, può recuperare informazioni senza chiedere tutto da capo al responsabile.' }
    ],
    takeaway: 'Una chat aziendale integrata non è solo messaggistica: è memoria operativa collegata al lavoro quotidiano.',
    keywords: ['chat aziendale interna', 'comunicazione team', 'messaggi aziendali']
  },
  {
    slug: 'software-per-cooperative-personale-presenze-documenti-report',
    title: 'Software per cooperative: personale, presenze, documenti e report in ordine',
    description:
      'Le cooperative hanno esigenze operative specifiche: persone distribuite, documenti, presenze e report. Ecco come organizzarle meglio.',
    date: '2026-05-13',
    readTime: '6 min',
    category: 'Cooperative',
    author: 'Team Control Center',
    h1: 'Software per cooperative: personale, presenze, documenti e report in ordine',
    intro:
      'Le cooperative coordinano spesso personale su sedi, servizi o attività diverse. Questo rende fondamentale avere informazioni chiare e accessibili.',
    sections: [
      { title: 'Coordinare persone distribuite richiede visibilità', text: 'Responsabili e amministrazione devono sapere chi lavora, dove opera, quali richieste sono aperte e quali documenti sono disponibili.' },
      { title: 'I ruoli aiutano a mantenere ordine', text: 'Lead e amministratori possono avere viste diverse, mentre i collaboratori accedono solo alle proprie informazioni operative.' },
      { title: 'I report evitano ricostruzioni manuali', text: 'Avere dati raccolti in modo strutturato semplifica controlli, analisi interne e comunicazioni amministrative.' }
    ],
    takeaway: 'Per una cooperativa, digitalizzare presenze, documenti e report significa ridurre attriti e aumentare controllo operativo.',
    keywords: ['software per cooperative', 'gestione personale cooperative', 'report cooperative']
  },
  {
    slug: 'software-per-agenzie-progetti-clienti-ore-team',
    title: 'Software per agenzie: come gestire progetti clienti, ore e team',
    description:
      'Agenzie digitali, creative e consulenziali hanno bisogno di collegare clienti, team, ore, documenti e comunicazioni. Ecco come farlo.',
    date: '2026-05-13',
    readTime: '6 min',
    category: 'Agenzie',
    author: 'Team Control Center',
    h1: 'Software per agenzie: come gestire progetti clienti, ore e team',
    intro:
      'In agenzia ogni progetto porta con sé richieste, file, revisioni, scadenze e persone coinvolte. Senza un sistema comune, il controllo diventa faticoso.',
    sections: [
      { title: 'Il progetto cliente deve avere una casa', text: 'Documenti, note e aggiornamenti devono essere recuperabili velocemente, senza dipendere dalla memoria del singolo account o project manager.' },
      { title: 'Ore e presenze aiutano a capire il carico', text: 'Sapere come il team lavora e quanto tempo viene assorbito dai progetti aiuta a prendere decisioni più consapevoli.' },
      { title: 'Comunicazioni interne più ordinate', text: 'Chat e aggiornamenti collegati al flusso operativo riducono messaggi dispersi e informazioni perse.' }
    ],
    takeaway: 'Un software per agenzie deve rendere leggibili progetti, persone, ore e documenti senza appesantire il lavoro creativo o tecnico.',
    keywords: ['software per agenzie', 'gestione progetti clienti', 'ore team agenzia']
  },
  {
    slug: 'software-per-scuole-private-organizzazione-personale-documenti',
    title: 'Software per scuole private: organizzare personale, documenti e comunicazioni',
    description:
      'Le scuole private possono migliorare organizzazione interna, presenze, documenti e comunicazioni usando una piattaforma gestionale semplice.',
    date: '2026-05-13',
    readTime: '5 min',
    category: 'Scuole private',
    author: 'Team Control Center',
    h1: 'Software per scuole private: organizzare personale, documenti e comunicazioni',
    intro:
      'Una scuola privata non gestisce solo didattica: ci sono persone, documenti, comunicazioni interne, responsabilità e attività organizzative da coordinare.',
    sections: [
      { title: 'Il personale ha bisogno di processi chiari', text: 'Ruoli, presenze e richieste devono essere gestiti con regole comprensibili e facilmente consultabili.' },
      { title: 'I documenti devono essere recuperabili', text: 'Centralizzare documenti interni e materiali operativi aiuta segreteria, direzione e team a lavorare con meno dispersione.' },
      { title: 'La comunicazione interna va ordinata', text: 'Canali chiari e tracciabili aiutano a evitare messaggi duplicati, incomprensioni e informazioni perse.' }
    ],
    takeaway: 'Per una scuola privata, una piattaforma organizzativa può semplificare la gestione del personale e migliorare la chiarezza interna.',
    keywords: ['software per scuole private', 'gestione personale scuola', 'documenti scuola privata']
  },
  {
    slug: 'report-aziendali-presenze-progetti-decisioni-operative',
    title: 'Report aziendali: trasformare presenze e progetti in decisioni operative',
    description:
      'I report aziendali aiutano direzione e responsabili a leggere presenze, attività, progetti e carichi di lavoro senza ricostruzioni manuali.',
    date: '2026-05-13',
    readTime: '6 min',
    category: 'Report',
    author: 'Team Control Center',
    h1: 'Report aziendali: trasformare presenze e progetti in decisioni operative',
    intro:
      'Un report non serve solo a stampare dati: serve a capire cosa è successo, dove intervenire e quali scelte prendere.',
    sections: [
      { title: 'Il report nasce dalla qualità del dato', text: 'Se presenze, richieste e attività sono inserite in modo strutturato, il report diventa uno strumento affidabile e non una ricostruzione manuale.' },
      { title: 'Direzione e responsabili leggono viste diverse', text: 'Un amministratore può aver bisogno di dati aggregati, mentre un lead deve leggere il proprio perimetro operativo.' },
      { title: 'Lo storico aiuta a migliorare i processi', text: 'Guardare indietro permette di individuare colli di bottiglia, carichi ricorrenti e aree in cui il team perde tempo.' }
    ],
    takeaway: 'I report aziendali sono utili quando nascono da dati operativi ordinati e aggiornati nel tempo.',
    keywords: ['report aziendali', 'report presenze', 'report progetti']
  },
  {
    slug: 'sicurezza-ruoli-permessi-software-aziendale-saas',
    title: 'Sicurezza, ruoli e permessi in un software aziendale SaaS',
    description:
      'In un software aziendale SaaS non basta avere funzioni: servono ruoli, permessi, separazione dati e accessi coerenti.',
    date: '2026-05-13',
    readTime: '7 min',
    category: 'Sicurezza',
    author: 'Team Control Center',
    h1: 'Sicurezza, ruoli e permessi in un software aziendale SaaS',
    intro:
      'Quando un software gestisce dati aziendali, presenze, documenti e comunicazioni, la sicurezza non può essere un dettaglio secondario.',
    sections: [
      { title: 'Ogni ruolo deve avere un perimetro', text: 'Super Admin, Company Admin, Lead e collaboratori devono avere permessi diversi e coerenti con responsabilità reali.' },
      { title: 'La separazione tra aziende è fondamentale', text: 'In un SaaS multi-azienda, ogni organizzazione deve lavorare solo sui propri dati. Questo principio deve essere applicato lato applicativo e lato backend.' },
      { title: 'La sicurezza è anche chiarezza operativa', text: 'Meno accessi impropri, meno viste confuse e meno dati fuori contesto rendono il lavoro più sicuro e più semplice.' }
    ],
    takeaway: 'Ruoli e permessi non sono solo una funzione tecnica: sono la base per un software aziendale affidabile.',
    keywords: ['ruoli software aziendale', 'permessi SaaS', 'sicurezza dati aziendali']
  },
  {
    slug: 'scegliere-software-saas-gestione-team-azienda',
    title: 'Come scegliere un software SaaS per la gestione del team aziendale',
    description:
      'Criteri pratici per scegliere un software SaaS di gestione team: funzioni, ruoli, sicurezza, report, scalabilità e semplicità di utilizzo.',
    date: '2026-05-13',
    readTime: '8 min',
    category: 'Acquisto software',
    author: 'Team Control Center',
    h1: 'Come scegliere un software SaaS per la gestione del team aziendale',
    intro:
      'Scegliere un software aziendale non significa cercare la lista più lunga di funzioni, ma capire quale soluzione migliora davvero il lavoro quotidiano.',
    sections: [
      { title: 'Parti dai problemi reali', text: 'Prima di scegliere, valuta dove oggi perdi tempo: presenze, documenti, comunicazioni, report, assegnazioni o controllo dei progetti.' },
      { title: 'Controlla ruoli e sicurezza', text: 'Un buon SaaS deve permettere viste diverse per amministratori, responsabili e collaboratori, mantenendo i dati nel perimetro corretto.' },
      { title: 'Valuta semplicità e scalabilità', text: 'Il software deve essere abbastanza semplice da usare subito e abbastanza solido da accompagnare la crescita aziendale.' }
    ],
    takeaway: 'Il software giusto è quello che rende il lavoro più chiaro, riduce strumenti sparsi e permette all’azienda di crescere con più controllo.',
    keywords: ['scegliere software SaaS', 'software gestione team', 'software aziendale online']
  },
  {
    slug: 'team-control-center-vs-trello-board-kanban-non-basta',
    title: 'Team Control Center vs Trello: quando una board Kanban non basta più',
    description:
      'Confronto SEO tra Team Control Center e Trello: quando una board è utile e quando servono presenze, ruoli, aziende, documenti e report in un unico gestionale.',
    date: '2026-05-14',
    readTime: '8 min',
    category: 'Confronti gestionali',
    author: 'Team Control Center',
    h1: 'Team Control Center vs Trello: quando una board Kanban non basta più',
    intro:
      'Trello è uno strumento semplice e conosciuto per organizzare attività con board, liste e card. Per molte aziende, però, il problema non è solo spostare task da fare a completato: è collegare persone, presenze, documenti, ruoli, report e responsabilità operative.',
    sections: [
      { title: 'Trello è forte sulla visualizzazione semplice del lavoro', text: 'Una board Kanban è immediata: il team vede le attività, le priorità e lo stato di avanzamento. Questo approccio funziona bene per task leggeri, checklist e piccoli flussi collaborativi.' },
      { title: 'Il limite emerge quando serve gestione aziendale vera', text: 'Quando l’azienda deve gestire anche presenze, assenze, permessi, ruoli, documenti, team, report e accessi separati, una board rischia di diventare solo un contenitore visivo. Le informazioni operative restano distribuite o devono essere ricostruite manualmente.' },
      { title: 'Perché Team Control Center è più adatto a un contesto operativo', text: 'Team Control Center nasce come gestionale aziendale: non solo task, ma anche aziende, utenti, ruoli, presenze, progetti, chat, documenti e report. La differenza è nel perimetro: non organizza soltanto le attività, ma centralizza il lavoro quotidiano con logiche di controllo e responsabilità.' },
      { title: 'Quando scegliere Team Control Center', text: 'Se cerchi un sistema leggero per una lista di task, una board può bastare. Se invece vuoi un centro unico per gestire team, presenze, documenti e controllo operativo, Team Control Center è una scelta più verticale e concreta per PMI, agenzie, cooperative e scuole private.' }
    ],
    takeaway: 'Trello può essere ottimo per visualizzare attività; Team Control Center è più indicato quando l’azienda ha bisogno di un gestionale operativo completo, con presenze, ruoli, documenti e report.',
    keywords: ['Team Control Center vs Trello', 'alternativa a Trello per aziende', 'software gestione team con presenze', 'gestionale operativo aziendale']
  },
  {
    slug: 'team-control-center-vs-asana-project-management-o-gestionale-operativo',
    title: 'Team Control Center vs Asana: project management o gestionale operativo aziendale?',
    description:
      'Differenze tra Team Control Center e Asana: project management, task, workflow, presenze, ruoli, documenti e gestione operativa per aziende italiane.',
    date: '2026-05-14',
    readTime: '8 min',
    category: 'Confronti gestionali',
    author: 'Team Control Center',
    h1: 'Team Control Center vs Asana: project management o gestionale operativo aziendale?',
    intro:
      'Asana è una piattaforma molto forte per tracciare lavoro, progetti e workflow. Team Control Center parte da un’esigenza diversa: aiutare un’azienda a controllare lavoro operativo, presenze, ruoli, documenti, comunicazioni e report nello stesso ambiente.',
    sections: [
      { title: 'Asana è orientato al project management', text: 'Asana aiuta i team a organizzare progetti, attività, workflow e visibilità sul lavoro. È una soluzione potente quando il bisogno principale è coordinare task e avanzamenti tra reparti.' },
      { title: 'Molte PMI non hanno solo un problema di task', text: 'Nelle aziende operative il problema spesso è più ampio: capire chi lavora, chi è assente, quali documenti sono collegati a un progetto, cosa vede ogni ruolo e quali informazioni servono all’amministrazione.' },
      { title: 'Team Control Center unisce progetto e gestione interna', text: 'La differenza è che Team Control Center non guarda solo al progetto: collega presenze, team, ruoli, chat, documenti e report. Questo lo rende più vicino a un gestionale aziendale quotidiano che a un semplice strumento di task management.' },
      { title: 'Il vantaggio competitivo', text: 'Per una PMI che vuole ridurre Excel, messaggi sparsi e controlli manuali, Team Control Center può essere più immediato perché concentra funzioni operative già pensate per il controllo interno.' }
    ],
    takeaway: 'Asana è forte per task e workflow; Team Control Center è più focalizzato sulla gestione operativa completa di persone, presenze, documenti e progetti.',
    keywords: ['Team Control Center vs Asana', 'alternativa ad Asana per PMI', 'software gestione team aziendale', 'gestionale presenze e progetti']
  },
  {
    slug: 'team-control-center-vs-monday-gestionale-pmi-piu-lineare',
    title: 'Team Control Center vs monday.com: quando serve un gestionale PMI più lineare',
    description:
      'Confronto tra Team Control Center e monday.com: work management, CRM, automazioni e gestione operativa semplice per PMI, agenzie e cooperative.',
    date: '2026-05-14',
    readTime: '9 min',
    category: 'Confronti gestionali',
    author: 'Team Control Center',
    h1: 'Team Control Center vs monday.com: quando serve un gestionale PMI più lineare',
    intro:
      'monday.com è una piattaforma ampia, personalizzabile e orientata al work management. Team Control Center sceglie una strada più verticale: meno dispersione configurativa e più focus su presenze, progetti, ruoli, documenti e gestione aziendale quotidiana.',
    sections: [
      { title: 'monday.com punta sulla flessibilità', text: 'Una piattaforma molto configurabile può adattarsi a molti reparti, processi e casi d’uso. Questa flessibilità è un valore, ma richiede anche progettazione, configurazione e governance.' },
      { title: 'Il rischio per le PMI è partire troppo larghi', text: 'Una piccola o media azienda spesso non ha bisogno di costruire da zero un sistema complesso: ha bisogno di partire subito con processi chiari per team, presenze, documenti, ruoli e report.' },
      { title: 'Team Control Center riduce la distanza tra acquisto e utilizzo', text: 'Il vantaggio di Team Control Center è l’approccio guidato: il prodotto è già orientato alla gestione operativa interna, quindi l’azienda non deve trasformare una piattaforma generica in un gestionale.' },
      { title: 'Quando siamo più forti', text: 'Team Control Center è più competitivo quando l’obiettivo non è creare qualunque workflow possibile, ma controllare meglio persone, presenze, progetti, documenti e comunicazioni in modo semplice e coerente.' }
    ],
    takeaway: 'monday.com è molto flessibile; Team Control Center è più verticale per aziende che vogliono un gestionale operativo rapido, chiaro e meno dispersivo.',
    keywords: ['Team Control Center vs monday.com', 'alternativa a monday.com Italia', 'gestionale PMI', 'software presenze progetti documenti']
  },
  {
    slug: 'team-control-center-vs-hubspot-zoho-pipedrive-crm-o-gestionale-operativo',
    title: 'Team Control Center vs HubSpot, Zoho e Pipedrive: CRM o gestionale operativo?',
    description:
      'CRM e gestionale operativo non sono la stessa cosa. Ecco quando scegliere Team Control Center rispetto a HubSpot, Zoho CRM o Pipedrive.',
    date: '2026-05-14',
    readTime: '9 min',
    category: 'Confronti CRM',
    author: 'Team Control Center',
    h1: 'Team Control Center vs HubSpot, Zoho e Pipedrive: CRM o gestionale operativo?',
    intro:
      'HubSpot, Zoho CRM e Pipedrive sono strumenti pensati principalmente per vendite, pipeline, contatti, deal e relazione commerciale. Team Control Center risponde a un’altra domanda: come organizzo persone, presenze, progetti, documenti, chat e report dopo che l’azienda deve lavorare davvero?',
    sections: [
      { title: 'Il CRM governa la relazione commerciale', text: 'Un CRM è ideale per tracciare lead, opportunità, pipeline, attività commerciali e relazione con clienti o prospect. È uno strumento fondamentale per vendite e marketing.' },
      { title: 'Il gestionale operativo governa il lavoro interno', text: 'Dopo la vendita o durante l’erogazione del servizio, servono presenze, team, ruoli, documenti, progetti, comunicazioni interne e report. Questi aspetti spesso non sono il cuore di un CRM.' },
      { title: 'Team Control Center completa ciò che il CRM non copre', text: 'Team Control Center non vuole essere un CRM puro: vuole essere il centro operativo dell’azienda. Qui stanno persone, permessi, presenze, attività, documenti e informazioni utili alla gestione quotidiana.' },
      { title: 'Perché siamo più adatti in alcuni casi', text: 'Se il problema principale è vendere e gestire pipeline, un CRM è corretto. Se il problema è coordinare il lavoro interno, controllare presenze e dare ai responsabili strumenti operativi, Team Control Center è più pertinente.' }
    ],
    takeaway: 'CRM e gestionale operativo risolvono problemi diversi: Team Control Center è più forte quando l’azienda deve organizzare persone, attività, presenze e documenti, non solo lead e trattative.',
    keywords: ['CRM o gestionale operativo', 'Team Control Center vs HubSpot', 'Team Control Center vs Zoho', 'Team Control Center vs Pipedrive', 'gestione operativa aziendale']
  },
  {
    slug: 'team-control-center-vs-notion-workspace-flessibile-o-processi-guidati',
    title: 'Team Control Center vs Notion: workspace flessibile o processi aziendali guidati?',
    description:
      'Notion è ottimo per wiki, documenti e workspace flessibili. Team Control Center è pensato per processi operativi più guidati: presenze, ruoli, progetti e report.',
    date: '2026-05-14',
    readTime: '8 min',
    category: 'Confronti gestionali',
    author: 'Team Control Center',
    h1: 'Team Control Center vs Notion: workspace flessibile o processi aziendali guidati?',
    intro:
      'Notion è un workspace estremamente flessibile per documenti, wiki, database e progetti. La flessibilità è il suo punto forte, ma alcune aziende non vogliono progettare il proprio gestionale: vogliono usarne uno già strutturato.',
    sections: [
      { title: 'Notion è potente quando devi costruire conoscenza', text: 'Wiki, documenti, pagine e database permettono di modellare moltissimi processi. È utile per documentazione, knowledge base e organizzazione informativa.' },
      { title: 'Il limite è la necessità di progettare il sistema', text: 'Per gestire presenze, ruoli, permessi, documenti operativi e report aziendali servono regole, flussi e responsabilità. Se tutto è troppo libero, l’azienda deve definire e mantenere la struttura da sola.' },
      { title: 'Team Control Center offre processi già orientati all’operatività', text: 'Il valore è avere un gestionale con moduli già pensati per aziende: utenti, ruoli, presenze, progetti, chat, documenti e report. Meno costruzione manuale, più utilizzo concreto.' },
      { title: 'Quando preferire Team Control Center', text: 'Se vuoi una knowledge base personalizzata, Notion è una scelta forte. Se vuoi gestire lavoro aziendale quotidiano con processi più controllati, Team Control Center è più adatto.' }
    ],
    takeaway: 'Notion è flessibile per documentazione e workspace; Team Control Center è più indicato quando servono processi operativi già pronti e controllabili.',
    keywords: ['Team Control Center vs Notion', 'alternativa a Notion per aziende', 'gestionale operativo', 'software gestione presenze progetti']
  },
  {
    slug: 'team-control-center-vs-clickup-produttivita-o-controllo-operativo',
    title: 'Team Control Center vs ClickUp: produttività all-in-one o controllo operativo?',
    description:
      'Confronto tra Team Control Center e ClickUp: task, documenti, obiettivi, presenze, ruoli e controllo operativo per aziende che vogliono meno dispersione.',
    date: '2026-05-14',
    readTime: '8 min',
    category: 'Confronti gestionali',
    author: 'Team Control Center',
    h1: 'Team Control Center vs ClickUp: produttività all-in-one o controllo operativo?',
    intro:
      'ClickUp è una piattaforma all-in-one per produttività, task, documenti e obiettivi. Team Control Center ha un posizionamento più gestionale: aiutare aziende e responsabili a controllare lavoro operativo, persone e informazioni interne.',
    sections: [
      { title: 'ClickUp aggrega molti strumenti di produttività', text: 'Task, documenti, obiettivi e viste diverse permettono a team strutturati di personalizzare il modo in cui lavorano. È una logica ampia e flessibile.' },
      { title: 'La produttività non coincide sempre con la gestione aziendale', text: 'Un’azienda può essere piena di task e comunque non avere controllo su presenze, permessi, ruoli, documenti e report. Il problema non è solo fare di più, ma sapere cosa sta succedendo.' },
      { title: 'Team Control Center punta al controllo quotidiano', text: 'La piattaforma collega gestione team, presenze, progetti, chat, documenti e report. Questo approccio aiuta i responsabili a leggere il lavoro in modo operativo, non solo come lista di attività.' },
      { title: 'Perché può essere la scelta migliore per PMI operative', text: 'Quando l’obiettivo è semplificare, ridurre strumenti separati e avere un gestionale più aderente a presenze e responsabilità, Team Control Center può risultare più lineare.' }
    ],
    takeaway: 'ClickUp è forte sulla produttività ampia; Team Control Center è più focalizzato sul controllo operativo aziendale con presenze, ruoli, documenti e report.',
    keywords: ['Team Control Center vs ClickUp', 'alternativa a ClickUp per PMI', 'gestionale operativo aziendale', 'software controllo team']
  },
  {
    slug: 'perche-team-control-center-e-diverso-dai-gestionali-generici',
    title: 'Perché Team Control Center è diverso dai gestionali generici per aziende',
    description:
      'Team Control Center si distingue dai gestionali generici perché unisce presenze, progetti, ruoli, chat, documenti e report in un flusso operativo unico.',
    date: '2026-05-14',
    readTime: '7 min',
    category: 'Differenziazione',
    author: 'Team Control Center',
    h1: 'Perché Team Control Center è diverso dai gestionali generici per aziende',
    intro:
      'Molti software aziendali promettono di gestire tutto, ma spesso costringono l’azienda ad adattarsi a logiche troppo rigide o troppo generiche. Team Control Center nasce con un obiettivo preciso: rendere leggibile il lavoro operativo quotidiano.',
    sections: [
      { title: 'Non è solo un elenco di funzioni', text: 'La differenza non è dire “abbiamo presenze, progetti e documenti”. La differenza è collegare questi elementi dentro una stessa logica di ruoli, responsabilità e report.' },
      { title: 'È pensato per chi deve controllare senza complicare', text: 'PMI, agenzie, cooperative e scuole private hanno bisogno di strumenti concreti. Non sempre serve un ERP complesso: spesso serve un centro operativo chiaro e utilizzabile subito.' },
      { title: 'Il focus è sul lavoro reale', text: 'Presenze, richieste, attività, comunicazioni, allegati e report sono informazioni che ogni giorno determinano il funzionamento dell’azienda. Team Control Center le porta in un unico ambiente.' },
      { title: 'La nostra promessa competitiva', text: 'Non essere il software più generico sul mercato, ma il gestionale più utile per aziende che vogliono ridurre caos operativo, Excel, chat sparse e controllo manuale.' }
    ],
    takeaway: 'Team Control Center si distingue perché mette insieme funzioni operative che spesso sono disperse tra strumenti diversi, con un approccio semplice e orientato alle aziende reali.',
    keywords: ['gestionali generici per aziende', 'perché scegliere Team Control Center', 'software aziendale migliore per PMI', 'gestionale operativo']
  },
  {
    slug: 'miglior-gestionale-pmi-italiane-presenze-progetti-ruoli',
    title: 'Miglior gestionale per PMI italiane: presenze, progetti, ruoli e report in un solo posto',
    description:
      'Come scegliere il miglior gestionale per PMI italiane: perché Team Control Center può essere più adatto quando servono presenze, progetti, ruoli e documenti.',
    date: '2026-05-14',
    readTime: '8 min',
    category: 'Scelta software',
    author: 'Team Control Center',
    h1: 'Miglior gestionale per PMI italiane: presenze, progetti, ruoli e report in un solo posto',
    intro:
      'Il miglior gestionale non è quello con più funzioni in assoluto, ma quello che risolve meglio i problemi specifici dell’azienda. Per molte PMI italiane il nodo è sempre lo stesso: persone, presenze, progetti, documenti e comunicazioni sono troppo separati.',
    sections: [
      { title: 'Partire dai problemi quotidiani', text: 'Prima di scegliere un gestionale bisogna guardare dove si perde tempo: approvazioni manuali, file Excel, messaggi sparsi, documenti non recuperabili, report ricostruiti a fine mese.' },
      { title: 'Il gestionale deve essere usato da tutti', text: 'Un software troppo complesso resta nelle mani di pochi. Un buon gestionale deve essere chiaro per amministratori, responsabili e collaboratori, con ruoli diversi e viste semplici.' },
      { title: 'Perché Team Control Center è una scelta forte', text: 'Team Control Center unisce moduli che spesso vengono acquistati separatamente: presenze, progetti, chat, documenti, report e ruoli. Questo riduce passaggi manuali e aiuta la direzione a leggere il lavoro.' },
      { title: 'Una scelta migliore quando vuoi controllo operativo', text: 'Se la priorità è vendere, serve un CRM. Se la priorità è pianificare task complessi, può servire un project tool avanzato. Se la priorità è controllare meglio il lavoro interno, Team Control Center è più centrato.' }
    ],
    takeaway: 'Per molte PMI, Team Control Center può essere il miglior gestionale quando l’obiettivo è centralizzare lavoro operativo, presenze, documenti, ruoli e report senza introdurre troppa complessità.',
    keywords: ['miglior gestionale PMI', 'software gestionale PMI Italia', 'gestionale presenze progetti ruoli', 'Team Control Center']
  },
  {
    slug: 'costi-nascosti-excel-whatsapp-email-gestione-team',
    title: 'I costi nascosti di Excel, WhatsApp ed email nella gestione del team',
    description:
      'Excel, WhatsApp ed email sembrano gratuiti, ma nella gestione aziendale creano costi nascosti: errori, tempo perso, duplicazioni e mancanza di controllo.',
    date: '2026-05-14',
    readTime: '7 min',
    category: 'Organizzazione aziendale',
    author: 'Team Control Center',
    h1: 'I costi nascosti di Excel, WhatsApp ed email nella gestione del team',
    intro:
      'Molte aziende rinviano l’adozione di un gestionale perché pensano che strumenti già disponibili siano sufficienti. In realtà, Excel, chat ed email possono generare costi invisibili ogni giorno.',
    sections: [
      { title: 'Il costo del tempo perso', text: 'Ogni volta che un responsabile deve cercare un file, chiedere conferma in chat o ricostruire una presenza, l’azienda sta pagando tempo non produttivo.' },
      { title: 'Il costo degli errori', text: 'Versioni diverse dello stesso file, messaggi letti da alcuni e non da altri, documenti inviati più volte e dati copiati manualmente aumentano il rischio di errore.' },
      { title: 'Il costo della mancanza di storico', text: 'Quando le informazioni non sono centralizzate, diventa difficile capire cosa è successo mesi prima, chi ha approvato una richiesta o dove si trova un documento.' },
      { title: 'Come Team Control Center riduce questi costi', text: 'Centralizzando presenze, progetti, comunicazioni, documenti e report, il gestionale riduce ricostruzioni manuali e rende più leggibile il lavoro di ogni giorno.' }
    ],
    takeaway: 'Gli strumenti gratuiti non sono sempre economici: se generano caos operativo, un gestionale come Team Control Center può ridurre costi nascosti e aumentare controllo.',
    keywords: ['costi nascosti Excel azienda', 'gestione team WhatsApp email', 'software gestione team senza Excel', 'gestionale operativo PMI']
  },
  {
    slug: 'software-gestione-team-con-presenze-progetti-chat-documenti',
    title: 'Software gestione team con presenze, progetti, chat e documenti: perché unificare tutto',
    description:
      'Un software di gestione team moderno deve unire presenze, progetti, chat e documenti. Ecco perché Team Control Center si distingue dai tool separati.',
    date: '2026-05-14',
    readTime: '7 min',
    category: 'Gestione team',
    author: 'Team Control Center',
    h1: 'Software gestione team con presenze, progetti, chat e documenti: perché unificare tutto',
    intro:
      'Molti strumenti gestiscono una sola parte del lavoro: task, chat, file o presenze. Il problema è che l’azienda lavora in modo integrato, non a compartimenti stagni.',
    sections: [
      { title: 'Le informazioni aziendali sono collegate', text: 'Una presenza può incidere su un progetto, una comunicazione può riguardare un documento, un responsabile può aver bisogno di un report sul proprio team. Separare tutto rende il controllo più difficile.' },
      { title: 'Unificare riduce attrito operativo', text: 'Meno strumenti significa meno accessi, meno copie, meno domande e meno passaggi manuali. Il team sa dove guardare e i responsabili hanno un quadro più chiaro.' },
      { title: 'Perché Team Control Center si distingue', text: 'La piattaforma mette insieme funzioni che spesso vengono gestite con software separati: presenze, progetti, chat, documenti, ruoli e report. Questo approccio crea continuità tra persone e attività.' },
      { title: 'Il valore per la direzione', text: 'La direzione non deve ricostruire il lavoro da dieci fonti diverse: può leggere informazioni operative già organizzate per azienda, ruolo e processo.' }
    ],
    takeaway: 'Un software di gestione team è davvero utile quando unisce le informazioni operative: Team Control Center nasce proprio per ridurre la distanza tra persone, progetti, presenze e documenti.',
    keywords: ['software gestione team presenze progetti chat documenti', 'gestione team aziendale', 'software aziendale integrato', 'Team Control Center']
  }
];

export const allPublicRoutes = [
  ...Object.values(routes),
  ...blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    title: `${post.title} | Team Control Center`,
    description: post.description,
    h1: post.h1,
    kicker: post.category,
    keywords: post.keywords
  }))
];
