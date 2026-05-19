import fs from 'node:fs';
import path from 'node:path';
import { routes, blogPosts, seoLandingPages } from './seo-data.mjs';
import { englishRoutes, englishLandingPages, englishBlogPosts } from './seo-en-data.mjs';
import { legalPages } from './legal-data.mjs';

const dist = path.resolve('dist');
const indexPath = path.join(dist, 'index.html');
const index = fs.readFileSync(indexPath, 'utf8');
const baseUrl = (process.env.PUBLIC_SITE_URL || 'https://teamcontrolcenter.it').replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

const strategicTopics = [
  "software gestione team aziendale",
  "gestionale progetti",
  "Kanban Board aziendale",
  "alternativa a Trello per PMI",
  "software presenze e progetti",
  "gestionale documenti e attività",
  "software per cooperative",
  "gestione attività aziendali",
  "project management per PMI",
  "ruolo PM Project Manager",
  "lavagna Kanban integrata nei progetti",
  "tutorial primo accesso software aziendale",
  "gestionale presenze e progetti",
  "software SaaS per PMI",
  "sicurezza ruoli e permessi SaaS"
];

const targetAudiences = ['PMI italiane', 'agenzie', 'cooperative', 'scuole private', 'studi professionali', 'team operativi distribuiti'];

function keywordThings(values) {
  return values.map((name) => ({ '@type': 'Thing', name }));
}

function wordCount(post) {
  const text = [post.title, post.description, post.intro, post.takeaway, ...(post.sections || []).flatMap((section) => [section.title, section.text])].join(' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Team Control Center',
  url: baseUrl,
  logo: `${baseUrl}/logo.svg`,
  description: 'Team Control Center sviluppa una piattaforma SaaS per gestione team aziendale, presenze, progetti, documenti, chat, ruoli e report operativi.',
  areaServed: { '@type': 'Country', name: 'Italia' },
  knowsAbout: keywordThings(strategicTopics),
  audience: targetAudiences.map((name) => ({ '@type': 'Audience', audienceType: name })),
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: 'info@teamcontrolcenter.it', availableLanguage: ['it', 'en'] }]
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Team Control Center',
  url: baseUrl,
  inLanguage: 'it-IT',
  description: routes.home.description,
  publisher: { '@type': 'Organization', name: 'Team Control Center', url: baseUrl },
  about: keywordThings(strategicTopics),
  keywords: strategicTopics.join(', '),
  potentialAction: {
    '@type': 'SearchAction',
    target: `${baseUrl}/blog?search={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
};

function esc(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function json(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function canonical(pathname) {
  return `${baseUrl}${pathname === '/' ? '/' : pathname}`;
}
function englishEquivalent(pathname) {
  const mapped = {
    '/': '/en',
    '/funzionalita': '/en/features',
    '/prezzi': '/en/pricing',
    '/demo': '/en/demo',
    '/contatti': '/en/contact',
    '/blog': '/en/blog',
    '/centro-amministrativo-aziendale': '/en/administration-center',
    '/software-gestione-team-aziendale': '/en/team-management-software',
    '/kanban-board-aziendale': '/en/kanban-board',
    '/software-per-pmi': '/en/software-for-smes',
    '/alternativa-excel-whatsapp': '/en/alternative-to-excel-whatsapp',
    '/software-project-management-pmi': '/en/project-management-software-smes',
    '/demo-aziendale-3-giorni': '/en/business-demo-3-days'
  };
  if (pathname.startsWith('/blog/')) return '/en/blog';
  return mapped[pathname] || null;
}

function italianEquivalent(pathname) {
  const mapped = {
    '/en': '/',
    '/en/features': '/funzionalita',
    '/en/pricing': '/prezzi',
    '/en/demo': '/demo',
    '/en/contact': '/contatti',
    '/en/blog': '/blog',
    '/en/administration-center': '/centro-amministrativo-aziendale',
    '/en/team-management-software': '/software-gestione-team-aziendale',
    '/en/kanban-board': '/kanban-board-aziendale',
    '/en/software-for-smes': '/software-per-pmi',
    '/en/alternative-to-excel-whatsapp': '/alternativa-excel-whatsapp',
    '/en/project-management-software-smes': '/software-project-management-pmi',
    '/en/business-demo-3-days': '/demo-aziendale-3-giorni'
  };
  if (pathname.startsWith('/en/blog/')) return '/blog';
  return mapped[pathname] || '/';
}

function hreflangTags(pathname, lang = 'it') {
  const itPath = lang === 'it' ? pathname : italianEquivalent(pathname);
  const enPath = lang === 'en' ? pathname : englishEquivalent(pathname);
  if (!enPath) return '';
  return `\n<link rel="alternate" hreflang="it-IT" href="${canonical(itPath)}" />\n<link rel="alternate" hreflang="en" href="${canonical(enPath)}" />\n<link rel="alternate" hreflang="x-default" href="${canonical(itPath)}" />`;
}


function breadcrumbs(pathname, title) {
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` }];
  if (pathname !== '/') items.push({ '@type': 'ListItem', position: 2, name: title.replace(' | Team Control Center', ''), item: canonical(pathname) });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
}

function softwareSchema(route) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Team Control Center',
    alternateName: ['TCC', 'TeamControlCenter'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Software gestione team aziendale',
    operatingSystem: 'Web',
    url: baseUrl,
    description: routes.home.description,
    image: `${baseUrl}/og-cover.png`,
    inLanguage: 'it-IT',
    isAccessibleForFree: false,
    keywords: strategicTopics.join(', '),
    about: keywordThings(strategicTopics),
    audience: targetAudiences.map((name) => ({ '@type': 'BusinessAudience', audienceType: name })),
    offers: [
      { '@type': 'Offer', name: 'Starter', price: '29.00', priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: `${baseUrl}/prezzi` },
      { '@type': 'Offer', name: 'Team', price: '79.00', priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: `${baseUrl}/prezzi` },
      { '@type': 'Offer', name: 'Business', price: '149.00', priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: `${baseUrl}/prezzi` }
    ],
    featureList: [
      "Gestione presenze dipendenti online",
      "Gestione progetti e attività",
      "Kanban Board aziendale con colonne Backlog, Da fare, In corso, In revisione, Bloccato e Fatto",
      "Ruolo PM / Project Manager",
      "Assegnazione Lead e Viewer ai progetti",
      "Lead e Viewer in sola lettura sulla board",
      "Gestione documenti aziendali",
      "Chat aziendale interna",
      "Dashboard aziendale",
      "Notifiche e activity feed",
      "Workload operativo",
      "Report operativi e avanzati",
      "Audit log e storico nel piano Business",
      "Tutorial primo accesso per ruolo",
      "SaaS responsive da browser"
]
  };
}

function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Che cos’è Team Control Center?', acceptedAnswer: { '@type': 'Answer', text: 'Team Control Center è un software SaaS per gestione team aziendale, presenze, progetti, documenti, chat, ruoli e report operativi.' } },
      { '@type': 'Question', name: 'Team Control Center è adatto alle PMI?', acceptedAnswer: { '@type': 'Answer', text: 'Sì. È pensato per PMI, agenzie, cooperative, scuole private e team operativi che vogliono ridurre Excel, chat sparse e strumenti separati.' } },
      { '@type': 'Question', name: 'Team Control Center può sostituire Excel per presenze e attività?', acceptedAnswer: { '@type': 'Answer', text: 'Può ridurre l’uso di Excel per presenze, attività, documenti e report, portando le informazioni in un ambiente più strutturato e tracciabile.' } },
      { '@type': 'Question', name: 'Serve installare qualcosa?', acceptedAnswer: { '@type': 'Answer', text: 'No. Team Control Center è una piattaforma web accessibile da browser su desktop, tablet e smartphone.' } }
    ]
  };
}

function articleFaqSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `Che cos’è ${post.title.replace(/\?.*$/, '')}?`, acceptedAnswer: { '@type': 'Answer', text: post.description } },
      { '@type': 'Question', name: 'Per chi è utile Team Control Center?', acceptedAnswer: { '@type': 'Answer', text: 'È utile per PMI, agenzie, cooperative, scuole private, studi professionali e team operativi che vogliono gestire presenze, progetti, documenti e report in modo più ordinato.' } },
      { '@type': 'Question', name: 'Quali strumenti può ridurre?', acceptedAnswer: { '@type': 'Answer', text: 'Può ridurre fogli Excel, chat personali, email operative, cartelle documentali disordinate e report manuali.' } },
      { '@type': 'Question', name: 'Quali sono le keyword principali?', acceptedAnswer: { '@type': 'Answer', text: post.keywords.join(', ') } }
    ]
  };
}

function articleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: today,
    author: { '@type': 'Organization', name: 'Team Control Center', url: baseUrl },
    publisher: { '@type': 'Organization', name: 'Team Control Center', logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.svg` } },
    image: `${baseUrl}/og-cover.png`,
    mainEntityOfPage: canonical(`/blog/${post.slug}`),
    isPartOf: { '@type': 'Blog', name: 'Blog Team Control Center', url: `${baseUrl}/blog` },
    inLanguage: 'it-IT',
    articleSection: post.category,
    wordCount: wordCount(post),
    isAccessibleForFree: true,
    keywords: post.keywords.join(', '),
    about: keywordThings(post.keywords),
    mentions: keywordThings(['Team Control Center', ...strategicTopics].slice(0, 12))
  };
}

function blogSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Team Control Center',
    url: `${baseUrl}/blog`,
    description: routes.blog.description,
    inLanguage: 'it-IT',
    publisher: { '@type': 'Organization', name: 'Team Control Center', url: baseUrl },
    about: keywordThings(strategicTopics),
    blogPost: blogPosts.map((post) => ({ '@type': 'BlogPosting', headline: post.title, url: `${baseUrl}/blog/${post.slug}`, datePublished: post.date, keywords: post.keywords.join(', ') }))
  };
}

function legalDocByPath(pathname) {
  return Object.entries(routes).find(([, route]) => route.path === pathname)?.[0];
}

function legalSchema(route) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: route.title,
    description: route.description,
    url: canonical(route.path),
    inLanguage: 'it-IT',
    about: ['SaaS', 'privacy', 'sicurezza', 'condizioni di servizio', 'protezione dati'],
    dateModified: today
  };
}

function legalStatic(route) {
  const key = legalDocByPath(route.path);
  const doc = key ? legalPages[key] : null;
  if (!doc) return '';
  const sections = doc.sections.map((section) => `
    <section>
      <h2>${esc(section.title)}</h2>
      ${section.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
    </section>`).join('');
  return `<main class="static-seo legal-static"><article><p>${esc(route.title)}</p><h1>${esc(route.title.split('|')[0].trim())}</h1><p>${esc(doc.intro)}</p><p><strong>Ultimo aggiornamento:</strong> ${esc(doc.updated)}</p><section><h2>${esc(doc.noticeTitle)}</h2><p>${esc(doc.notice)}</p></section>${sections}</article></main>`;
}

function staticContent(route, post) {
  if (post) {
    const sections = Array.isArray(post.sections) ? post.sections : [];
    const body = sections
      .map((section) => `<section><h2>${esc(section.title)}</h2><p>${esc(section.text)}</p></section>`)
      .join('');
    const takeaway = post.takeaway ? `<section><h2>In sintesi</h2><p>${esc(post.takeaway)}</p></section>` : '';
    return `<main class="static-seo"><article><p>${esc(post.category)}</p><h1>${esc(post.title)}</h1><p>${esc(post.intro || post.description)}</p><p>Articolo del ${esc(post.date)} dedicato a ${esc(post.keywords.join(', '))}.</p>${body}${takeaway}<p><a href="/demo">Richiedi una demo</a> oppure <a href="/prezzi">consulta i prezzi</a>.</p></article></main>`;
  }
  if (route.path === '/blog') {
    return `<main class="static-seo"><section><h1>${esc(route.title.replace(' | Team Control Center', ''))}</h1><p>${esc(route.description)}</p>${blogPosts.map((item) => `<article><h2><a href="/blog/${item.slug}">${esc(item.title)}</a></h2><p>${esc(item.description)}</p></article>`).join('')}</section></main>`;
  }
  if (route.path === '/prezzi') {
    return `<main class="static-seo"><section><h1>${esc(route.title.replace(' | Piani SaaS per aziende e team', ''))}</h1><p>${esc(route.description)}</p><h2>Piani disponibili</h2><ul><li>Starter 29€ al mese fino a 5 utenti: Dashboard, Profilo, Progetti base, ricerca limitata, notifiche base, scadenziario base, export base e tutorial primo accesso. Non include Kanban Board.</li><li>Team 79€ al mese fino a 20 utenti: include Kanban Board progetto, ruolo PM, assegnazione Lead/Viewer, activity feed, workload, export operativo e automazioni base. È il piano consigliato.</li><li>Business 149€ al mese fino a 50 utenti: include tutto il Team più audit log, report avanzati, Kanban avanzata, storico, automazioni avanzate, export storico e funzioni di controllo.</li></ul><p><a href="/demo">Richiedi demo</a></p></section></main>`;
  }
  const landing = seoLandingPages?.[route.path];
  if (landing) {
    const bullets = Array.isArray(landing.bullets) ? landing.bullets : [];
    const sections = Array.isArray(landing.sections) ? landing.sections : [];
    return `<main class="static-seo"><article><p>${esc(route.title.split('|')[0].trim())}</p><h1>${esc(route.h1 || route.title.split('|')[0].trim())}</h1><p>${esc(route.description)}</p><section><h2>Problema che risolve</h2><p>${esc(landing.problem)}</p></section><section><h2>Come lo risolve Team Control Center</h2><p>${esc(landing.solution)}</p></section><section><h2>Funzioni principali</h2><ul>${bullets.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>${sections.map((section) => `<section><h2>${esc(section.title)}</h2><p>${esc(section.text)}</p></section>`).join('')}<section><h2>In sintesi</h2><p>${esc(landing.cta)}</p></section><p><a href="/demo">Richiedi una demo</a> oppure <a href="/prezzi">consulta i prezzi</a>.</p></article></main>`;
  }
  if (route.type === 'legal') {
    return legalStatic(route);
  }
  return `<main class="static-seo"><section><h1>${esc(route.title.split('|')[0].trim())}</h1><p>${esc(route.description)}</p><h2>Gestione team, presenze, progetti, chat, documenti e report</h2><p>Team Control Center aiuta PMI, agenzie, cooperative e scuole private a centralizzare il lavoro operativo in un unico ambiente SaaS con ruoli profilati e dati separati per azienda.</p><p><a href="/funzionalita">Scopri le funzionalità</a> · <a href="/prezzi">Vedi i prezzi</a> · <a href="/blog">Leggi il blog</a></p></section></main>`;
}

function schemaBundle(route, post) {
  const common = [organization, website, breadcrumbs(post ? `/blog/${post.slug}` : route.path, post ? post.title : route.title)];
  if (post) return [...common, articleSchema(post), articleFaqSchema(post)];
  if (route.path === '/blog') return [...common, blogSchema()];
  if (route.type === 'software' || route.path === '/prezzi') return [...common, softwareSchema(route), faqSchema()];
  if (route.type === 'legal') return [...common, legalSchema(route)];
  return [...common, { '@context': 'https://schema.org', '@type': 'WebPage', name: route.title, description: route.description, url: canonical(route.path), inLanguage: 'it-IT' }];
}

function inject(html, route, post = null) {
  const pagePath = post ? `/blog/${post.slug}` : route.path;
  const title = post ? `${post.title} | Team Control Center` : route.title;
  const description = post ? post.description : route.description;
  const keywords = (post ? post.keywords : route.keywords || []).join(', ');
  const type = post ? 'article' : 'website';
  const scripts = schemaBundle(route, post).map((item) => `<script type="application/ld+json">${json(item)}</script>`).join('\n');
  const canonicalTag = `<link rel="canonical" href="${canonical(pagePath)}" />`;
  const preload = `<link rel="preload" as="image" href="/og-cover.png" />`;
  return html
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${esc(keywords)}" />`)
    .replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical(pagePath)}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${esc(title)}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${esc(description)}" />`)
    .replace('</head>', `${canonicalTag}${hreflangTags(pagePath, 'it')}\n${preload}\n${scripts}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${staticContent(route, post)}</div>`);
}


function englishStaticContent(route, post) {
  if (post) {
    const body = post.sections.map((section) => `<section><h2>${esc(section.title)}</h2><p>${esc(section.text)}</p></section>`).join('');
    return `<main class="static-seo"><article><p>${esc(post.category)}</p><h1>${esc(post.title)}</h1><p>${esc(post.intro || post.description)}</p>${body}<section><h2>In summary</h2><p>${esc(post.takeaway)}</p></section><p><a href="/en/demo">Request a demo</a> or <a href="/en/pricing">view pricing</a>.</p></article></main>`;
  }
  if (route.path === '/en/blog') {
    return `<main class="static-seo"><section><h1>${esc(route.h1)}</h1><p>${esc(route.description)}</p>${englishBlogPosts.map((item) => `<article><h2><a href="/en/blog/${item.slug}">${esc(item.title)}</a></h2><p>${esc(item.description)}</p></article>`).join('')}</section></main>`;
  }
  const landing = englishLandingPages[route.path];
  if (landing) {
    return `<main class="static-seo"><article><p>${esc(route.kicker)}</p><h1>${esc(route.h1)}</h1><p>${esc(route.description)}</p><section><h2>Problem solved</h2><p>${esc(landing.problem)}</p></section><section><h2>How Team Control Center helps</h2><p>${esc(landing.solution)}</p></section><section><h2>Main capabilities</h2><ul>${landing.bullets.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>${landing.sections.map((section) => `<section><h2>${esc(section.title)}</h2><p>${esc(section.text)}</p></section>`).join('')}<section><h2>In summary</h2><p>${esc(landing.cta)}</p></section><p><a href="/en/demo">Request a demo</a> or <a href="/en/pricing">view pricing</a>.</p></article></main>`;
  }
  if (route.path === '/en/pricing') {
    return `<main class="static-seo"><section><h1>${esc(route.h1)}</h1><p>${esc(route.description)}</p><h2>Available plans</h2><ul><li>Starter 29€ per month: dashboard, profile, basic projects, first-login tutorial and basic company administration.</li><li>Team 79€ per month: PM role, project Kanban Board, Lead/Viewer assignment, advanced user management and project templates.</li><li>Business 149€ per month: complete audit, advanced security, advanced reports, change history and stronger management control.</li></ul><p><a href="/en/demo">Request a demo</a></p></section></main>`;
  }
  return `<main class="static-seo"><section><h1>${esc(route.h1)}</h1><p>${esc(route.description)}</p><h2>Team management, projects, documents and Kanban for SMEs</h2><p>Team Control Center helps SMEs centralize company operations in one SaaS platform with profiled roles, secure data boundaries and modern visual workflows.</p><p><a href="/en/features">Explore features</a> · <a href="/en/pricing">View pricing</a> · <a href="/en/blog">Read the blog</a></p></section></main>`;
}

function englishSchemaBundle(route, post) {
  const pagePath = post ? `/en/blog/${post.slug}` : route.path;
  const pageTitle = post ? post.title : route.title;
  const common = [
    { ...organization, description: 'Team Control Center develops a SaaS platform for team management, projects, documents, attendance, roles, audit and operational control for SMEs.', areaServed: { '@type': 'Place', name: 'Europe' } },
    { ...website, url: baseUrl, inLanguage: 'en', description: englishRoutes.home.description },
    breadcrumbs(pagePath, pageTitle)
  ];
  if (post) return [...common, { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.description, datePublished: post.date, dateModified: today, author: { '@type': 'Organization', name: 'Team Control Center', url: baseUrl }, publisher: { '@type': 'Organization', name: 'Team Control Center', logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.svg` } }, image: `${baseUrl}/og-cover.png`, mainEntityOfPage: canonical(pagePath), inLanguage: 'en', articleSection: post.category, keywords: post.keywords.join(', ') }];
  return [...common, { '@context': 'https://schema.org', '@type': 'WebPage', name: route.title, description: route.description, url: canonical(route.path), inLanguage: 'en' }, softwareSchema(route), faqSchema()];
}

function injectEnglish(html, route, post = null) {
  const pagePath = post ? `/en/blog/${post.slug}` : route.path;
  const title = post ? `${post.title} | Team Control Center` : route.title;
  const description = post ? post.description : route.description;
  const keywords = (post ? post.keywords : route.keywords || []).join(', ');
  const type = post ? 'article' : 'website';
  const scripts = englishSchemaBundle(route, post).map((item) => `<script type="application/ld+json">${json(item)}</script>`).join('\n');
  const canonicalTag = `<link rel="canonical" href="${canonical(pagePath)}" />`;
  const preload = `<link rel="preload" as="image" href="/og-cover.png" />`;
  return html
    .replace(/<html lang=".*?">/, '<html lang="en">')
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${esc(keywords)}" />`)
    .replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical(pagePath)}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${esc(title)}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${esc(description)}" />`)
    .replace('</head>', `${canonicalTag}${hreflangTags(pagePath, 'en')}\n${preload}\n${scripts}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${englishStaticContent(route, post)}</div>`);
}

function llmsText() {
  const lines = [
    '# Team Control Center',
    '',
    'Team Control Center è una piattaforma SaaS italiana per gestione team aziendale, presenze, progetti, documenti, chat, ruoli, permessi e report operativi.',
    '',
    'Categoria: software gestione team aziendale; gestionale presenze e progetti; software SaaS per PMI; gestionale operativo per cooperative, agenzie e scuole private.',
    '',
    'Pubblico principale: PMI italiane, agenzie, cooperative, scuole private, studi professionali e team operativi distribuiti.',
    '',
    'Problemi risolti: riduzione di Excel e WhatsApp per presenze e attività, gestione visuale dei progetti con Kanban Board, documenti più ordinati, ruoli PM/Lead/Viewer chiari, dati separati per azienda, report consultabili.',
    '',
    'Funzionalità: presenze, ferie, permessi, malattie, straordinari, progetti, Kanban Board aziendale, ruolo PM / Project Manager, assegnazione Lead/Viewer, attività, documenti, chat aziendale, dashboard, notifiche, report, tutorial primo accesso, ruoli e permessi, modulo Contattaci con allegati opzionali.',
    '',
    'Keyword strategiche: ' + strategicTopics.join(', '),
    '',
    'URL principali:',
    `- Home: ${baseUrl}/`,
    `- Funzionalità: ${baseUrl}/funzionalita`,
    `- Prezzi: ${baseUrl}/prezzi`,
    `- Demo: ${baseUrl}/demo`,
    `- Contatti: ${baseUrl}/contatti — modulo Contattaci con nome, cognome, email, azienda, oggetto, messaggio e allegati opzionali per richieste commerciali o documentali.`,
    `- Blog: ${baseUrl}/blog`,
    '',
    'English / international URLs:',
    `- English home: ${baseUrl}/en`,
    `- Features: ${baseUrl}/en/features`,
    `- Pricing: ${baseUrl}/en/pricing`,
    `- Contact: ${baseUrl}/en/contact`,
    `- Blog: ${baseUrl}/en/blog`,
    '',
    'Articoli utili per comprendere il prodotto:'
  ];
  blogPosts.forEach((post) => lines.push(`- ${post.title}: ${baseUrl}/blog/${post.slug} — ${post.description}`));
  return `${lines.join('\n')}\n`;
}

const pages = Object.values(routes).map((route) => ({ route })).concat(blogPosts.map((post) => ({ route: routes.blog, post })));

const urls = [];

for (const page of pages) {
  const pathname = page.post ? `/blog/${page.post.slug}` : page.route.path;
  const outDir = pathname === '/' ? dist : path.join(dist, pathname.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), inject(index, page.route, page.post));
  urls.push({ loc: canonical(pathname), priority: pathname === '/' ? '1.0' : pathname === '/blog' ? '0.9' : '0.8', changefreq: pathname.startsWith('/blog/') ? 'monthly' : 'weekly' });
}

const englishPages = Object.values(englishRoutes).map((route) => ({ route })).concat(englishBlogPosts.map((post) => ({ route: englishRoutes.blog, post })));

for (const page of englishPages) {
  const pathname = page.post ? `/en/blog/${page.post.slug}` : page.route.path;
  const outDir = path.join(dist, pathname.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), injectEnglish(index, page.route, page.post));
  urls.push({ loc: canonical(pathname), priority: pathname === '/en' ? '0.9' : pathname === '/en/blog' ? '0.8' : '0.7', changefreq: pathname.startsWith('/en/blog/') ? 'monthly' : 'weekly' });
}

fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *
Allow: /
Allow: /llms.txt
Disallow: /api/
Disallow: /admin/
Disallow: /private/

User-agent: OAI-SearchBot
Allow: /
Allow: /llms.txt
Disallow: /api/
Disallow: /admin/
Disallow: /private/

User-agent: GPTBot
Allow: /
Allow: /llms.txt
Disallow: /api/
Disallow: /admin/
Disallow: /private/

User-agent: Bingbot
Allow: /
Allow: /llms.txt
Disallow: /api/
Disallow: /admin/
Disallow: /private/

Sitemap: ${baseUrl}/sitemap.xml
`);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>\n`);
const indexNowKey = process.env.INDEXNOW_KEY || '7f4a7f3d2b9948c99af334e83b3c11d5';
fs.writeFileSync(path.join(dist, 'indexnow-key.txt'), indexNowKey + '\n');
fs.writeFileSync(path.join(dist, 'indexnow-urls.json'), JSON.stringify({ host: new URL(baseUrl).host, key: indexNowKey, keyLocation: `${baseUrl}/indexnow-key.txt`, urlList: urls.map((u) => u.loc) }, null, 2));
fs.writeFileSync(path.join(dist, 'llms.txt'), llmsText());
fs.writeFileSync(path.join(dist, 'security.txt'), 'Contact: mailto:security@teamcontrolcenter.it\nPreferred-Languages: it,en\n');
console.log('SEO pages generated:', urls.length);
