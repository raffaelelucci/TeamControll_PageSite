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
  const icons = [<Building2 />, <UsersRound />, <ShieldCheck />, <Clock3 />, <FileText />, <MessageSquareText />, <BarChart3 />, <Rocket />, <LockKeyhole />];
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

function Pricing() {
  const [loading, setLoading] = useState('');
  const [msg, setMsg] = useState('');

  async function checkout(plan: string) {
    setLoading(plan);
    setMsg('');
    try {
      const data = await postJson('/api/billing/create-checkout-session', { plan });
      if (data.url) window.location.href = data.url;
      else setMsg('Richiesta ricevuta. Ti contatteremo per l’attivazione.');
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading('');
    }
  }

  return (
    <>
      <Hero page="pricing" />
      <section className="section pricing-section">
        <div className="section-head">
          <p>Piani disponibili</p>
          <h2>Scegli il piano più adatto alla dimensione della tua organizzazione</h2>
        </div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={`price-card ${plan.highlighted ? 'highlighted' : ''}`} key={plan.key}>
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
              <button className="primary full" onClick={() => checkout(plan.key)} disabled={!!loading}>
                {loading === plan.key ? 'Apertura pagamento...' : plan.cta}
              </button>
            </article>
          ))}
        </div>
        {msg && <div className="notice">{msg}</div>}
      </section>
      <section className="section muted-section">
        <div className="split muted-split">
          <div>
            <h2>Pagamento sicuro con Stripe</h2>
            <p>Il pulsante del piano apre una sessione Stripe Checkout per abbonamento ricorrente. Dopo il pagamento, l’azienda viene indirizzata verso l’attivazione guidata.</p>
          </div>
          <div>
            <h2>Attivazione controllata</h2>
            <p>L’accesso all’applicativo è legato allo stato dell’abbonamento aziendale. In questo modo il sito pubblico resta semplice, mentre l’area privata applica le regole operative.</p>
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
  const [ok, setOk] = useState(localStorage.getItem('tcc_cookie_choice') || '');
  if (ok) return null;
  return (
    <div className="cookie">
      <p>Usiamo cookie tecnici necessari. Eventuali analytics verranno attivati solo dopo consenso.</p>
      <div>
        <button onClick={() => { localStorage.setItem('tcc_cookie_choice', 'necessary'); setOk('necessary'); }}>Solo necessari</button>
        <button className="primary small" onClick={() => { localStorage.setItem('tcc_cookie_choice', 'all'); setOk('all'); }}>Accetta</button>
      </div>
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
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [path, setPath] = useState(normalizedPath());
  const { page, post } = useMemo(() => resolveRoute(path), [path]);

  useEffect(() => { setMeta(page, post); }, [page, post]);
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
