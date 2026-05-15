import fs from 'node:fs';
import path from 'node:path';
import { routes, blogPosts } from './seo-data.mjs';
import { legalPages } from './legal-data.mjs';

const dist = path.resolve('dist');
const indexPath = path.join(dist, 'index.html');
const index = fs.readFileSync(indexPath, 'utf8');
const baseUrl = (process.env.PUBLIC_SITE_URL || 'https://teamcontrolcenter.it').replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

const strategicTopics = [
  'software gestione team aziendale',
  'gestionale presenze e progetti',
  'software SaaS per PMI',
  'gestionale aziendale per cooperative',
  'software per gestione team e documenti',
  'alternativa semplice a Excel per presenze e attività',
  'gestione presenze dipendenti online',
  'software gestione progetti team',
  'chat aziendale interna',
  'report aziendali operativi',
  'ruoli e permessi SaaS'
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
      'Gestione presenze dipendenti online',
      'Gestione progetti e attività',
      'Chat aziendale interna',
      'Gestione documenti aziendali',
      'Report operativi',
      'Ruoli e permessi',
      'Dashboard aziendale',
      'SaaS responsive da browser'
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
    return `<main class="static-seo"><section><h1>${esc(route.title.replace(' | Piani SaaS per aziende e team', ''))}</h1><p>${esc(route.description)}</p><h2>Piani disponibili</h2><ul><li>Starter 29€ al mese fino a 5 utenti</li><li>Team 79€ al mese fino a 20 utenti</li><li>Business 149€ al mese fino a 50 utenti</li></ul><p><a href="/demo">Richiedi demo</a></p></section></main>`;
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
    .replace('</head>', `${canonicalTag}\n${preload}\n${scripts}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${staticContent(route, post)}</div>`);
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
    'Problemi risolti: riduzione di Excel per presenze e attività, meno messaggi sparsi, documenti più ordinati, progetti più leggibili, ruoli chiari, report consultabili.',
    '',
    'Funzionalità: presenze, ferie, permessi, malattie, straordinari, progetti, attività, documenti, chat aziendale, dashboard, report, ruoli e permessi.',
    '',
    'Keyword strategiche: ' + strategicTopics.join(', '),
    '',
    'URL principali:',
    `- Home: ${baseUrl}/`,
    `- Funzionalità: ${baseUrl}/funzionalita`,
    `- Prezzi: ${baseUrl}/prezzi`,
    `- Demo: ${baseUrl}/demo`,
    `- Blog: ${baseUrl}/blog`,
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

fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nAllow: /llms.txt\nSitemap: ${baseUrl}/sitemap.xml\n`);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(dist, 'llms.txt'), llmsText());
fs.writeFileSync(path.join(dist, 'security.txt'), 'Contact: mailto:security@teamcontrolcenter.it\nPreferred-Languages: it,en\n');
console.log('SEO pages generated:', urls.length);
