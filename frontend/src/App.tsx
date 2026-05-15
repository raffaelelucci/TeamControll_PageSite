import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cookie,
  FileText,
  GraduationCap,
  HelpCircle,
  Layers3,
  LockKeyhole,
  Menu,
  MessageSquareText,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  UsersRound,
  X
} from 'lucide-react';
import {
  audiences,
  benefits,
  blogPosts,
  features,
  plans,
  routes,
  seoFaqs,
  verticalDetails,
  PageKey,
  BlogPost
} from './content';
import { legalPages, type LegalPageKey } from './legal';
import './styles.css';

const nav = [
  ['/', 'Home'],
  ['/funzionalita', 'Funzionalità'],
  ['/prezzi', 'Prezzi'],
  ['/blog', 'Blog'],
  ['/demo', 'Demo']
];

const solutionNav = [
  ['/software-gestione-presenze-dipendenti', 'Presenze dipendenti'],
  ['/software-gestione-progetti-team', 'Progetti e team'],
  ['/software-per-cooperative', 'Cooperative'],
  ['/software-per-agenzie', 'Agenzie'],
  ['/software-per-scuole-private', 'Scuole private']
];

const legalNav = [
  ['/privacy', 'Privacy'],
  ['/cookie-policy', 'Cookie'],
  ['/termini', 'Termini'],
  ['/dpa', 'DPA'],
  ['/sicurezza', 'Sicurezza'],
  ['/sub-responsabili', 'Sub-responsabili'],
  ['/recesso-rimborsi', 'Recesso e rimborsi']
];

const GOOGLE_ANALYTICS_ID = 'G-FZPVP3ECSZ';
const COOKIE_CONSENT_KEY = 'tcc_cookie_consent_v1';
const COOKIE_LEGACY_KEY = 'tcc_cookie_choice';
const ANALYTICS_DEBUG_KEY = 'tcc_analytics_debug';

const cookieCategories = [
  {
    key: 'necessary',
    title: 'Cookie tecnici necessari',
    description: 'Servono per far funzionare il sito, ricordare la scelta cookie e proteggere navigazione e moduli. Non possono essere disattivati dal banner.',
    required: true
  },
  {
    key: 'analytics',
    title: 'Cookie analytics',
    description: 'Consentono Google Analytics 4 per misurare visite, pagine viste, sorgenti di traffico e contenuti più utili. Si attivano solo dopo consenso.',
    required: false
  },
  {
    key: 'marketing',
    title: 'Cookie marketing e profilazione',
    description: 'Oggi non sono usati. La preferenza resta disponibile per future campagne, pixel o remarketing, che non verranno caricati senza consenso.',
    required: false
  }
] as const;

type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
  version: 1;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    tccOpenCookiePreferences?: () => void;
    tccAnalyticsTest?: () => { measurementId: string; consent: CookieConsent | null; scriptLoaded: boolean; gtagType: string; debugMode: boolean };
  }
}

function defaultConsent(): CookieConsent {
  return { necessary: true, analytics: false, marketing: false, savedAt: new Date().toISOString(), version: 1 };
}

function readCookieConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CookieConsent>;
      return {
        necessary: true,
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
        savedAt: parsed.savedAt || new Date().toISOString(),
        version: 1
      };
    }

    const legacy = localStorage.getItem(COOKIE_LEGACY_KEY);
    if (legacy) {
      return {
        necessary: true,
        analytics: legacy === 'all',
        marketing: false,
        savedAt: new Date().toISOString(),
        version: 1
      };
    }
  } catch {
    return null;
  }
  return null;
}

function saveCookieConsent(consent: CookieConsent) {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ ...consent, savedAt: new Date().toISOString(), version: 1 }));
  localStorage.removeItem(COOKIE_LEGACY_KEY);
}

function deleteCookieAcrossDomains(name: string) {
  const hostParts = window.location.hostname.split('.');
  const domains = new Set<string>(['', window.location.hostname]);
  if (hostParts.length >= 2) domains.add(`.${hostParts.slice(-2).join('.')}`);
  if (hostParts.length >= 3) domains.add(`.${hostParts.slice(-3).join('.')}`);

  domains.forEach((domain) => {
    const domainPart = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=; Max-Age=0; path=/${domainPart}; SameSite=Lax`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}; SameSite=Lax`;
  });
}

function clearAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map((item) => item.trim().split('=')[0])
    .filter(Boolean)
    .filter((name) => name === '_ga' || name === '_gid' || name === '_gat' || name.startsWith('_ga_') || name.startsWith('_gac_'));

  ['_ga', '_gid', '_gat', `_ga_${GOOGLE_ANALYTICS_ID.replace('G-', '')}`, ...names].forEach(deleteCookieAcrossDomains);
}

function isAnalyticsDebugEnabled() {
  const params = new URLSearchParams(window.location.search);
  return localStorage.getItem(ANALYTICS_DEBUG_KEY) === 'true' || params.get('analytics_debug') === '1';
}

function ensureGtagBase() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]){ window.dataLayer?.push(args); };
}

function analyticsEventParams(params: Record<string, string | number | boolean> = {}) {
  return {
    send_to: GOOGLE_ANALYTICS_ID,
    engagement_time_msec: 100,
    ...params,
    ...(isAnalyticsDebugEnabled() ? { debug_mode: true } : {})
  };
}

function loadGoogleAnalytics() {
  if (!GOOGLE_ANALYTICS_ID) return;

  ensureGtagBase();
  window.gtag?.('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });
  window.gtag?.('js', new Date());
  window.gtag?.('config', GOOGLE_ANALYTICS_ID, {
    anonymize_ip: true,
    send_page_view: false
  });

  if (document.querySelector(`script[data-tcc-analytics="${GOOGLE_ANALYTICS_ID}"]`)) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
  script.dataset.tccAnalytics = GOOGLE_ANALYTICS_ID;
  script.onload = () => {
    window.gtag?.('event', 'tcc_analytics_loaded', analyticsEventParams({ event_category: 'analytics_debug' }));
    if (isAnalyticsDebugEnabled()) {
      console.info('[TCC Analytics] Google Analytics caricato correttamente:', GOOGLE_ANALYTICS_ID);
    }
  };
  script.onerror = () => {
    console.warn('[TCC Analytics] Google Analytics non è stato caricato. Possibile blocco da browser, adblock, rete o CSP.');
  };
  document.head.appendChild(script);
}

function sendGoogleAnalyticsEvent(eventName: string, params: Record<string, string | number | boolean> = {}) {
  loadGoogleAnalytics();
  window.gtag?.('event', eventName, analyticsEventParams(params));
}

function runAnalyticsRealtimeTest() {
  localStorage.setItem(ANALYTICS_DEBUG_KEY, 'true');
  const consent = readCookieConsent();
  if (!consent?.analytics) {
    console.warn('[TCC Analytics] Consenso analytics non attivo. Clicca “Accetta analytics” o abilitalo dalle preferenze cookie.');
  } else {
    sendGoogleAnalyticsEvent('tcc_realtime_test', {
      event_category: 'analytics_debug',
      page_title: document.title,
      page_path: window.location.pathname,
      page_location: window.location.href
    });
    console.info('[TCC Analytics] Evento test inviato. Controlla GA4 > Realtime e GA4 > DebugView.', GOOGLE_ANALYTICS_ID);
  }

  return {
    measurementId: GOOGLE_ANALYTICS_ID,
    consent,
    scriptLoaded: Boolean(document.querySelector(`script[data-tcc-analytics="${GOOGLE_ANALYTICS_ID}"]`)),
    gtagType: typeof window.gtag,
    debugMode: isAnalyticsDebugEnabled()
  };
}

function applyCookieConsent(consent: CookieConsent, pathname = window.location.pathname) {
  if (consent.analytics) {
    sendGoogleAnalyticsEvent('page_view', {
      page_title: document.title,
      page_path: pathname,
      page_location: window.location.href
    });
  } else {
    ensureGtagBase();
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    clearAnalyticsCookies();
  }
}


function normalizedPath() {
  return window.location.pathname.replace(/\/$/, '') || '/';
}

function resolveRoute(path: string): { page: PageKey; post?: BlogPost } {
  const post = blogPosts.find((item) => `/blog/${item.slug}` === path);
  if (post) return { page: 'blog', post };
  const match = Object.entries(routes).find(([, r]) => (r.path.replace(/\/$/, '') || '/') === path);
  return { page: (match?.[0] as PageKey) || 'home' };
}

function setMeta(page: PageKey, post?: BlogPost) {
  const route = routes[page];
  const title = post ? `${post.title} | Team Control Center` : route.title;
  const description = post?.description || route.description;
  document.title = title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', description);
}

async function postJson(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Richiesta non riuscita');
  return data;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Team Control Center home">
        <img src="/logo.svg" alt="Team Control Center" />
      </a>
      <nav className="desktop-nav" aria-label="Navigazione principale">
        {nav.map(([href, label]) => (
          <a href={href} key={href}>{label}</a>
        ))}
        <div className="nav-dropdown">
          <button type="button">Soluzioni</button>
          <div className="dropdown-menu">
            {solutionNav.map(([href, label]) => (
              <a href={href} key={href}>{label}</a>
            ))}
          </div>
        </div>
      </nav>
      <div className="header-actions">
        <a className="ghost" href="https://app.teamcontrolcenter.it">Accedi</a>
        <a className="primary small" href="/prezzi">Vedi i prezzi</a>
      </div>
      <button className="mobile-toggle" onClick={() => setOpen(true)} aria-label="Apri menu">
        <Menu />
      </button>
      {open && (
        <div className="mobile-panel" role="dialog" aria-modal="true">
          <div className="mobile-card">
            <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Chiudi menu">
              <X />
            </button>
            {[...nav, ...solutionNav, ['https://app.teamcontrolcenter.it', 'Accedi app']].map(([href, label]) => (
              <a href={href} key={href}>{label}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ page, post }: { page: PageKey; post?: BlogPost }) {
  const route = routes[page];
  const h1 = post?.h1 || route.h1;
  const description = post?.intro || route.description;
  const kicker = post?.category || route.kicker;
  const home = page === 'home' && !post;

  return (
    <section className={`hero ${post ? 'hero-article' : ''}`}>
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={16} /> {kicker}</div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {h1}
        </motion.h1>
        <p className="hero-subtitle">{description}</p>
        {post ? (
          <div className="article-meta"><span>{post.date}</span><span>{post.readTime}</span><span>{post.author}</span></div>
        ) : (
          <div className="hero-actions">
            <a className="primary" href="/prezzi">Scegli il piano <ArrowRight size={18} /></a>
            <a className="secondary" href="/demo">Richiedi demo</a>
          </div>
        )}
        {home && (
          <div className="trust-row">
            <span><BadgeCheck /> Attivazione guidata</span>
            <span><ShieldCheck /> Dati separati per azienda</span>
            <span><Clock3 /> Operativo da browser</span>
          </div>
        )}
      </div>
      {!post && (
        <motion.div className="hero-dashboard" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <div className="dash-top"><span></span><span></span><span></span></div>
          <div className="dash-grid">
            <div><b>97%</b><small>Presenze tracciate</small></div>
            <div><b>24</b><small>Progetti attivi</small></div>
            <div><b>18</b><small>Team coordinati</small></div>
          </div>
          <div className="timeline"><span></span><span></span><span></span><span></span></div>
          <div className="message-preview"><MessageSquareText /><p>Nuovo aggiornamento progetto condiviso con il team.</p></div>
          <div className="permission-preview">
            <LockKeyhole size={18} />
            <span>Accessi profilati: azienda, lead, collaboratore</span>
          </div>
        </motion.div>
      )}
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero page="home" />
      <section className="logo-strip" aria-label="Aree gestite dalla piattaforma">
        <span>Presenze</span><span>Assenze</span><span>Progetti</span><span>Chat</span><span>Documenti</span><span>Report</span><span>Ruoli</span>
      </section>
      <section className="section intro-section">
        <div className="section-head">
          <p>Perché nasce Team Control Center</p>
          <h2>Per sostituire fogli Excel, chat sparse e documenti dispersi con un flusso aziendale unico</h2>
        </div>
        <div className="rich-copy">
          <p>
            Team Control Center è pensato per aziende che vogliono una gestione più ordinata del lavoro quotidiano: chi entra, chi esce, quali persone sono assegnate ai progetti, quali documenti sono collegati alle attività, quali comunicazioni devono restare tracciate e quali report servono alla direzione.
          </p>
          <p>
            La piattaforma separa i dati per azienda, organizza gli accessi per ruolo e aiuta amministratori, lead e collaboratori a lavorare nello stesso ambiente senza confondere responsabilità e informazioni.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <p>Vantaggi concreti</p>
          <h2>Un unico ambiente per smettere di rincorrere informazioni</h2>
        </div>
        <div className="cards">
          {benefits.map((benefit) => (
            <article className="card" key={benefit.title}>
              <CheckCircle2 />
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>
      <AudienceSection />
      <FeaturePreview />
      <FaqSection />
      <BlogPreview />
      <CTA />
    </>
  );
}

function AudienceSection() {
  return (
    <section className="section soft-section">
      <div className="section-head">
        <p>Per chi è utile</p>
        <h2>Una piattaforma adatta a organizzazioni che devono coordinare persone, dati e responsabilità</h2>
      </div>
      <div className="audience-grid">
        {audiences.map((item) => (
          <a className="audience-card" href={item.path} key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <span>Approfondisci <ChevronRight size={16} /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function FeaturePreview() {
  const preview = features.slice(0, 6);
  return (
    <section className="section">
      <div className="section-head">
        <p>Funzionalità principali</p>
        <h2>Dalla presenza giornaliera al report direzionale</h2>
      </div>
      <div className="feature-grid compact">
        {preview.map((feature, index) => (
          <article className="feature-card" key={feature.title}>
            <div className="icon">{[<Building2 />, <UsersRound />, <ShieldCheck />, <Clock3 />, <FileText />, <MessageSquareText />][index]}</div>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
      <div className="center-action"><a className="secondary" href="/funzionalita">Vedi tutte le funzionalità</a></div>
    </section>
  );
}

function Features() {
  const icons = [<Building2 />, <UsersRound />, <ShieldCheck />, <Clock3 />, <FileText />, <Layers3 />, <BookOpenText />, <MessageSquareText />, <BarChart3 />, <Rocket />, <LockKeyhole />];
  return (
    <>
      <Hero page="features" />
      <section className="section intro-section">
        <div className="section-head">
          <p>Dal controllo alla collaborazione</p>
          <h2>Ogni modulo è pensato per risolvere un problema operativo reale</h2>
        </div>
        <div className="rich-copy">
          <p>
            Team Control Center non è una semplice pagina di timbrature e non è solo una chat. È un ambiente operativo che collega aziende, ruoli, persone, progetti, documenti, comunicazioni, richieste e report.
          </p>
          <p>
            Questo approccio riduce la necessità di usare strumenti separati e rende più semplice mantenere ordine anche quando aumentano utenti, progetti e responsabilità.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <div className="icon">{icons[index]}</div>
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
      <FaqSection />
      <CTA />
    </>
  );
}

type CheckoutForm = {
  companyName: string;
  vatNumber: string;
  contactName: string;
  email: string;
  phone: string;
  employees: string;
  address: string;
  city: string;
};

function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('team');
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState('');
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; title: string; text: string } | null>(null);
  const [form, setForm] = useState<CheckoutForm>({
    companyName: '',
    vatNumber: '',
    contactName: '',
    email: '',
    phone: '',
    employees: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get('checkout');
    const sessionId = params.get('session_id');

    if (checkout === 'success') {
      setBanner({
        type: 'success',
        title: 'Pagamento completato correttamente',
        text: 'Abbiamo ricevuto il pagamento. L’azienda viene registrata come attiva e riceverai una mail di conferma.'
      });
      if (sessionId) postJson('/api/billing/checkout-result', { sessionId, result: 'success' }).catch(() => undefined);
    }

    if (checkout === 'cancel') {
      setBanner({
        type: 'error',
        title: 'Pagamento non completato',
        text: 'Il pagamento non è andato a buon fine o è stato annullato. L’azienda non viene attivata finché il pagamento non viene completato.'
      });
      if (sessionId) postJson('/api/billing/checkout-result', { sessionId, result: 'cancel' }).catch(() => undefined);
    }
  }, []);

  function selectPlan(plan: string) {
    setSelectedPlan(plan);
    setMsg('');
    document.getElementById('checkout-company-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(selectedPlan);
    setMsg('');
    try {
      const data = await postJson('/api/billing/create-checkout-session', { plan: selectedPlan, ...form });
      if (data.url) window.location.href = data.url;
      else setMsg('Richiesta ricevuta. Ti contatteremo per l’attivazione.');
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading('');
    }
  }

  const chosenPlan = plans.find((plan) => plan.key === selectedPlan) || plans[0];

  return (
    <>
      <Hero page="pricing" />
      {banner && (
        <section className="section payment-banner-section">
          <div className={`payment-banner ${banner.type}`} role="status">
            <div className="payment-banner-icon">{banner.type === 'success' ? <CheckCircle2 /> : <X />}</div>
            <div>
              <h2>{banner.title}</h2>
              <p>{banner.text}</p>
            </div>
          </div>
        </section>
      )}
      <section className="section pricing-section">
        <div className="section-head">
          <p>Piani disponibili</p>
          <h2>Scegli il piano più adatto alla dimensione della tua organizzazione</h2>
        </div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={`price-card ${plan.highlighted ? 'highlighted' : ''} ${selectedPlan === plan.key ? 'selected' : ''}`} key={plan.key}>
              {plan.highlighted && <div className="popular-badge">Più scelto</div>}
              <h2>{plan.name}</h2>
              <div className="price"><b>{plan.price}</b><span>/mese</span></div>
              <p className="plan-note">{plan.note}</p>
              <p>{plan.bestFor}</p>
              <ul>
                {plan.bullets.map((bullet) => (
                  <li key={bullet}><CheckCircle2 />{bullet}</li>
                ))}
              </ul>
              <button className="primary full" onClick={() => selectPlan(plan.key)} type="button">
                {selectedPlan === plan.key ? 'Piano selezionato' : plan.cta}
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="section form-section checkout-form-section" id="checkout-company-form">
        <form className="lead-form checkout-form" onSubmit={checkout}>
          <div className="checkout-plan-summary">
            <span>Piano selezionato</span>
            <strong>{chosenPlan?.name} - {chosenPlan?.price}/mese</strong>
          </div>
          <h2>Dati azienda per attivazione abbonamento</h2>
          <p>
            Prima del pagamento inserisci i dati necessari per creare l’azienda nel sistema. Dopo il pagamento confermato, la marketing API invia questi dati all’API SaaS e l’azienda viene creata come attiva con abbonamento collegato.
          </p>
          <input required placeholder="Ragione sociale / Nome azienda" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          <input required placeholder="Partita IVA o Codice Fiscale aziendale" value={form.vatNumber} onChange={(e) => setForm({ ...form, vatNumber: e.target.value })} />
          <input required placeholder="Nome e cognome referente" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
          <input required type="email" placeholder="Email aziendale per conferma pagamento" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div className="form-row">
            <input required placeholder="Telefono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="Numero dipendenti" value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} />
          </div>
          <div className="form-row">
            <input placeholder="Indirizzo sede" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <input placeholder="Città" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <label className="privacy-check"><input required type="checkbox" /> Confermo di poter richiedere l’attivazione per questa azienda e accetto Termini, Privacy Policy e gestione dell’abbonamento.</label>
          <button className="primary full" disabled={!!loading}>
            {loading ? 'Apertura pagamento sicuro...' : 'Vai al pagamento sicuro con Stripe'}
          </button>
          {msg && <div className="notice error">{msg}</div>}
        </form>
      </section>
      <section className="section muted-section">
        <div className="split muted-split">
          <div>
            <h2>Pagamento sicuro con Stripe</h2>
            <p>Il form crea una sessione Stripe Checkout per abbonamento ricorrente. I dati aziendali vengono salvati nei metadata della sessione e usati solo dopo esito positivo.</p>
          </div>
          <div>
            <h2>Attivazione controllata</h2>
            <p>Quando Stripe conferma il pagamento, il backend invia la mail al cliente, invia la notifica interna alla tua mail SMTP e chiama l’API SaaS per creare l’azienda attiva.</p>
          </div>
        </div>
      </section>
      <FaqSection />
    </>
  );
}

function DemoOrContacts({ page }: { page: 'demo' | 'contacts' }) {
  const route = routes[page];
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', employees: '', message: '' });
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    try {
      await postJson('/api/leads/request-activation', { ...form, source: page });
      setMsg('Richiesta inviata. Ti contatteremo a breve.');
      setForm({ company: '', name: '', email: '', phone: '', employees: '', message: '' });
    } catch (error: any) {
      setMsg(error.message);
    }
  }

  return (
    <>
      <Hero page={page} />
      <section className="section form-section">
        <form className="lead-form" onSubmit={submit}>
          <h2>{route.h1}</h2>
          <p>Compila il form e raccontaci cosa vuoi migliorare: presenze, progetti, documenti, comunicazioni, report o gestione ruoli. Ti risponderemo con una proposta concreta.</p>
          <input required placeholder="Nome azienda" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <input required placeholder="Nome e cognome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email aziendale" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Telefono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Numero dipendenti" value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} />
          <textarea placeholder="Raccontaci cosa vuoi gestire meglio" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <label className="privacy-check"><input required type="checkbox" /> Ho letto la Privacy Policy e autorizzo il contatto commerciale.</label>
          <button className="primary full">Invia richiesta</button>
          {msg && <div className="notice">{msg}</div>}
        </form>
      </section>
    </>
  );
}

function Vertical({ page }: { page: 'presence' | 'projects' | 'cooperatives' | 'agencies' | 'schools' }) {
  const details = verticalDetails[page];
  return (
    <>
      <Hero page={page} />
      <section className="section">
        <div className="split">
          <div>
            <h2>Problema che risolviamo</h2>
            <p>{details.problem}</p>
          </div>
          <div>
            <h2>Come lo risolve Team Control Center</h2>
            <p>{details.solution}</p>
          </div>
        </div>
      </section>
      <section className="section soft-section">
        <div className="section-head">
          <p>Cosa puoi gestire</p>
          <h2>Funzioni utili per rendere il processo più chiaro</h2>
        </div>
        <div className="cards small-cards">
          {details.bullets.map((bullet) => (
            <article className="card" key={bullet}><CheckCircle2 /><h3>{bullet}</h3><p>Gestione centralizzata, consultabile e coerente con i ruoli aziendali.</p></article>
          ))}
        </div>
      </section>
      <BlogPreview />
      <CTA />
    </>
  );
}

function BlogList() {
  return (
    <>
      <Hero page="blog" />
      <section className="section intro-section">
        <div className="section-head">
          <p>Approfondimenti SEO e contenuti utili</p>
          <h2>Articoli pensati per aziende che stanno valutando un gestionale operativo</h2>
        </div>
        <div className="rich-copy">
          <p>
            Il blog aiuta clienti e motori di ricerca a capire meglio cosa fa Team Control Center: gestione team, presenze online, progetti, documenti, report, ruoli, sicurezza e organizzazione aziendale.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="blog-grid">
          {blogPosts.map((post) => <BlogCard post={post} key={post.slug} />)}
        </div>
      </section>
      <CTA />
    </>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="blog-card">
      <div className="article-meta"><span>{post.category}</span><span>{post.readTime}</span></div>
      <h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
      <p>{post.description}</p>
      <a className="read-more" href={`/blog/${post.slug}`}>Leggi articolo <ArrowRight size={16} /></a>
    </article>
  );
}

function BlogPreview() {
  return (
    <section className="section blog-preview">
      <div className="section-head">
        <p>Dal blog</p>
        <h2>Guide utili per scegliere e usare meglio un software aziendale</h2>
      </div>
      <div className="blog-grid preview">
        {blogPosts.slice(0, 3).map((post) => <BlogCard post={post} key={post.slug} />)}
      </div>
      <div className="center-action"><a className="secondary" href="/blog">Vai al blog</a></div>
    </section>
  );
}

function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <>
      <Hero page="blog" post={post} />
      <article className="article-content">
        {post.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
        <div className="takeaway">
          <h2>In sintesi</h2>
          <p>{post.takeaway}</p>
        </div>
      </article>
      <section className="section related-section">
        <div className="section-head"><p>Continua a leggere</p><h2>Altri articoli utili</h2></div>
        <div className="blog-grid preview">
          {blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3).map((item) => <BlogCard post={item} key={item.slug} />)}
        </div>
      </section>
      <CTA />
    </>
  );
}

function FaqSection() {
  return (
    <section className="section faq-section">
      <div className="section-head">
        <p>Domande frequenti</p>
        <h2>Risposte rapide prima di richiedere una demo</h2>
      </div>
      <div className="faq-list">
        {seoFaqs.map((faq) => (
          <details key={faq.q}>
            <summary><HelpCircle size={18} /> {faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Legal({ page }: { page: LegalPageKey }) {
  const r = routes[page];
  const doc = legalPages[page];
  return (
    <>
      <section className="legal-hero">
        <div className="eyebrow"><ShieldCheck size={16} /> {r.kicker}</div>
        <h1>{r.h1}</h1>
        <p>{doc.intro}</p>
        <div className="legal-meta"><span>Ultimo aggiornamento: {doc.updated}</span><span>Versione sito pubblico</span></div>
      </section>
      <section className="legal-layout">
        <aside className="legal-toc" aria-label="Indice documento">
          <strong>Indice</strong>
          {doc.sections.map((section) => (
            <a key={section.title} href={`#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{section.title}</a>
          ))}
          <div className="legal-contact">
            <b>Contatti</b>
            <span>privacy@teamcontrolcenter.it</span>
            <span>security@teamcontrolcenter.it</span>
          </div>
        </aside>
        <article className="legal-content">
          <div className="legal-warning">
            <h2>{doc.noticeTitle}</h2>
            <p>{doc.notice}</p>
          </div>
          {doc.sections.map((section) => (
            <section key={section.title} id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="legal-clause">
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </article>
      </section>
    </>
  );
}

function CTA() {
  return (
    <section className="cta">
      <div className="cta-icon"><Network /></div>
      <h2>Pronto a trasformare il modo in cui gestisci il team?</h2>
      <p>Parti da una demo o scegli un piano. L’attivazione aziendale è guidata e pensata per non interrompere il lavoro già in corso.</p>
      <div className="hero-actions center"><a className="primary" href="/demo">Richiedi demo <ArrowRight size={18} /></a><a className="secondary light" href="/prezzi">Vedi prezzi</a></div>
    </section>
  );
}

function CookieBanner() {
  const [consent, setConsent] = useState<CookieConsent | null>(() => readCookieConsent());
  const [visible, setVisible] = useState(() => !readCookieConsent());
  const [panel, setPanel] = useState<'banner' | 'preferences'>('banner');
  const [analytics, setAnalytics] = useState(() => readCookieConsent()?.analytics || false);
  const [marketing, setMarketing] = useState(() => readCookieConsent()?.marketing || false);

  useEffect(() => {
    if (consent) applyCookieConsent(consent);
  }, [consent]);

  useEffect(() => {
    const openPreferences = () => {
      const current = readCookieConsent();
      setAnalytics(current?.analytics || false);
      setMarketing(current?.marketing || false);
      setPanel('preferences');
      setVisible(true);
    };
    window.tccOpenCookiePreferences = openPreferences;
    window.addEventListener('tcc:open-cookie-preferences', openPreferences);
    return () => {
      window.removeEventListener('tcc:open-cookie-preferences', openPreferences);
      delete window.tccOpenCookiePreferences;
    };
  }, []);

  const persist = (next: CookieConsent) => {
    saveCookieConsent(next);
    setConsent(next);
    setVisible(false);
  };

  const rejectAll = () => persist(defaultConsent());
  const acceptAll = () => persist({ necessary: true, analytics: true, marketing: false, savedAt: new Date().toISOString(), version: 1 });
  const savePreferences = () => persist({ necessary: true, analytics, marketing, savedAt: new Date().toISOString(), version: 1 });

  if (!visible) return null;

  return (
    <div className="cookie-overlay" role="presentation">
      <section className="cookie" role="dialog" aria-modal="true" aria-labelledby="cookie-title" aria-describedby="cookie-desc">
        <div className="cookie-icon"><Cookie size={24} /></div>
        <div className="cookie-main">
          <div className="cookie-heading">
            <p className="eyebrow mini">Privacy e cookie</p>
            <h2 id="cookie-title">Gestisci il consenso ai cookie</h2>
          </div>
          <p id="cookie-desc">
            Usiamo cookie tecnici necessari per il sito. Google Analytics viene caricato solo se accetti i cookie analytics. Puoi rifiutare, accettare o personalizzare le preferenze in qualsiasi momento.
          </p>
          {panel === 'preferences' && (
            <div className="cookie-preferences" aria-label="Categorie cookie">
              {cookieCategories.map((category) => {
                const checked = category.key === 'necessary' ? true : category.key === 'analytics' ? analytics : marketing;
                const onChange = category.key === 'analytics' ? setAnalytics : setMarketing;
                return (
                  <label className="cookie-option" key={category.key}>
                    <span>
                      <strong>{category.title}</strong>
                      <small>{category.description}</small>
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={category.required}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.checked)}
                    />
                  </label>
                );
              })}
            </div>
          )}
          <div className="cookie-links">
            <a href="/cookie-policy">Cookie Policy</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
        <div className="cookie-actions">
          {panel === 'banner' ? (
            <>
              <button type="button" onClick={rejectAll}>Rifiuta non necessari</button>
              <button type="button" onClick={() => setPanel('preferences')}><SlidersHorizontal size={16} /> Personalizza</button>
              <button type="button" className="primary small" onClick={acceptAll}>Accetta analytics</button>
            </>
          ) : (
            <>
              <button type="button" onClick={rejectAll}>Rifiuta tutto</button>
              <button type="button" onClick={() => setPanel('banner')}>Indietro</button>
              <button type="button" className="primary small" onClick={savePreferences}>Salva preferenze</button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <img src="/logo.svg" alt="Team Control Center" />
        <p>La piattaforma per gestire team, presenze, progetti, chat, documenti e attività aziendali in un unico posto.</p>
      </div>
      <div className="footer-columns">
        <div>
          <h3>Prodotto</h3>
          <a href="/funzionalita">Funzionalità</a><a href="/prezzi">Prezzi</a><a href="/demo">Demo</a><a href="/blog">Blog</a>
        </div>
        <div>
          <h3>Soluzioni</h3>
          {solutionNav.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
        </div>
        <div>
          <h3>Legale</h3>
          {legalNav.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
          <button className="footer-cookie-button" type="button" onClick={() => window.dispatchEvent(new Event('tcc:open-cookie-preferences'))}>Gestisci preferenze cookie</button>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [path, setPath] = useState(normalizedPath());
  const { page, post } = useMemo(() => resolveRoute(path), [path]);

  useEffect(() => {
    window.tccAnalyticsTest = runAnalyticsRealtimeTest;
    return () => {
      window.tccAnalyticsTest = undefined;
    };
  }, []);

  useEffect(() => { setMeta(page, post); }, [page, post]);
  useEffect(() => {
    const current = readCookieConsent();
    if (current) applyCookieConsent(current, path);
  }, [path]);
  useEffect(() => {
    const onPop = () => setPath(normalizedPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const content = useMemo(() => {
    if (post) return <BlogArticle post={post} />;
    if (page === 'home') return <Home />;
    if (page === 'features') return <Features />;
    if (page === 'pricing') return <Pricing />;
    if (page === 'demo' || page === 'contacts') return <DemoOrContacts page={page} />;
    if (page === 'presence' || page === 'projects' || page === 'cooperatives' || page === 'agencies' || page === 'schools') return <Vertical page={page} />;
    if (page === 'blog') return <BlogList />;
    return <Legal page={page as LegalPageKey} />;
  }, [page, post]);

  return (
    <>
      <Header />
      <main>{content}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
