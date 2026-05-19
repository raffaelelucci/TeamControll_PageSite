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
  landingDetails,
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
  ['/demo', 'Demo'],
  ['/contatti', 'Contatti']
];

const solutionNav = [
  ['/software-gestione-team-aziendale', 'Gestione team aziendale'],
  ['/centro-amministrativo-aziendale', 'Centro amministrativo'],
  ['/gestione-utenti-aziendali', 'Gestione utenti'],
  ['/audit-sicurezza-aziendale', 'Audit e sicurezza'],
  ['/kanban-board-aziendale', 'Kanban Board aziendale'],
  ['/software-per-pmi', 'PMI'],
  ['/alternativa-excel-whatsapp', 'Alternativa Excel e WhatsApp'],
  ['/demo-aziendale-3-giorni', 'Demo 3 giorni'],
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
let analyticsConfigured = false;

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
  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });

  if (!analyticsConfigured) {
    window.gtag?.('config', GOOGLE_ANALYTICS_ID, {
      anonymize_ip: true,
      send_page_view: false
    });
    analyticsConfigured = true;
  }

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
  const consent = readCookieConsent();
  if (!consent?.analytics) return;
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
    window.gtag?.('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    analyticsConfigured = false;
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

async function postFormData(url: string, payload: FormData) {
  const res = await fetch(url, {
    method: 'POST',
    body: payload
  });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};
  if (!res.ok) throw new Error(data.message || 'Invio non riuscito. Controlla i dati e riprova.');
  return data;
}

type FormNotice = { type: 'success' | 'error'; text: string } | null;

const CONTACT_MAX_FILES = 5;
const CONTACT_MAX_FILE_SIZE = 8 * 1024 * 1024;
const CONTACT_ALLOWED_FILE_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
  'image/png',
  'image/jpeg',
  'application/octet-stream'
]);
const CONTACT_ALLOWED_FILE_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'png', 'jpg', 'jpeg']);

function isAllowedContactFile(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return CONTACT_ALLOWED_FILE_TYPES.has(file.type) && CONTACT_ALLOWED_FILE_EXTENSIONS.has(extension);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}


type MarketingLanguage = 'it' | 'en';

type EnglishBlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  h1: string;
  intro: string;
  sections: { title: string; text: string }[];
  takeaway: string;
  keywords: string[];
};

const englishNav = [
  ['/en', 'Home'],
  ['/en/features', 'Features'],
  ['/en/pricing', 'Pricing'],
  ['/en/blog', 'Blog'],
  ['/en/demo', 'Demo'],
  ['/en/contact', 'Contact']
];

const englishSolutionNav = [
  ['/en/administration-center', 'Administration center'],
  ['/en/team-management-software', 'Team management software'],
  ['/en/kanban-board', 'Kanban Board'],
  ['/en/software-for-smes', 'Software for SMEs'],
  ['/en/alternative-to-excel-whatsapp', 'Alternative to Excel and WhatsApp'],
  ['/en/project-management-software-smes', 'Project management for SMEs'],
  ['/en/business-demo-3-days', '3-day business demo']
];

const englishPages = {
  '/en': {
    title: 'Team Control Center | Team management software for SMEs, projects, documents and Kanban',
    description: 'Team Control Center is a SaaS platform for SMEs that need to manage teams, projects, documents, attendance, roles, audit, administration and Kanban Boards in one secure workspace.',
    kicker: 'SaaS platform for growing SMEs',
    h1: 'Run teams, projects, documents and operations from one modern control center'
  },
  '/en/features': {
    title: 'Features | Team Control Center for administration, projects, Kanban and team operations',
    description: 'Explore Team Control Center features: administration center, advanced user management, PM role, Kanban Board, documents, audit, security, reminders, reports and first-login tutorial.',
    kicker: 'Product features',
    h1: 'Everything your company needs to organize daily work with clarity and control'
  },
  '/en/pricing': {
    title: 'Pricing | Team Control Center SaaS plans for SMEs',
    description: 'Starter, Team and Business plans for SMEs that need team management, projects, Kanban Board, administration, audit, documents and operational control.',
    kicker: 'Pricing and SaaS plans',
    h1: 'Simple plans designed to grow with your company'
  },
  '/en/demo': {
    title: 'Request a demo | Team Control Center',
    description: 'Request a guided demo or a 3-day isolated company demo with example accounts and sample data.',
    kicker: 'Guided demo',
    h1: 'See how Team Control Center can organize your company operations'
  },
  '/en/contact': {
    title: 'Contact Team Control Center | Sales, product information and documents',
    description: 'Contact Team Control Center for SaaS plans, product questions, demos, attachments and business activation requests.',
    kicker: 'Contact',
    h1: 'Talk to us about team management, projects, documents and operational control'
  },
  '/en/blog': {
    title: 'Blog | Team management, Kanban, SaaS for SMEs and operational control',
    description: 'Guides about team management software, project management for SMEs, Kanban Boards, administration center, audit, documents, roles and alternatives to Excel and WhatsApp.',
    kicker: 'Blog and resources',
    h1: 'Practical guides for SMEs that want to work better'
  },
  '/en/administration-center': {
    title: 'Company administration center | Users, roles, security, audit and usage',
    description: 'A company administration center for Company Admins who need to control users, roles, plan usage, security, deadlines, audit events, templates and operational risks.',
    kicker: 'Company administration',
    h1: 'A company administration center for real operational control'
  },
  '/en/team-management-software': {
    title: 'Team management software for SMEs | Projects, documents, attendance and Kanban',
    description: 'Team management software for SMEs that want to centralize projects, activities, attendance, documents, roles, notifications and Kanban Boards.',
    kicker: 'Team management software',
    h1: 'Team management software for companies that want less chaos and more control'
  },
  '/en/kanban-board': {
    title: 'Company Kanban Board | Visual task management inside business projects',
    description: 'A company Kanban Board integrated into projects with Backlog, To do, In progress, In review, Blocked and Done columns. PMs manage tasks; Lead and Viewer roles can read project status.',
    kicker: 'Visual task management',
    h1: 'A company Kanban Board integrated into projects, roles and documents'
  },
  '/en/software-for-smes': {
    title: 'Business management software for SMEs | Users, projects, documents, audit and security',
    description: 'A SaaS management platform for SMEs with users, projects, documents, Kanban, administration, deadlines, audit, security and operational reports.',
    kicker: 'Software for SMEs',
    h1: 'Business management software for SMEs that need simplicity and control'
  },
  '/en/alternative-to-excel-whatsapp': {
    title: 'Alternative to Excel and WhatsApp for team operations | Team Control Center',
    description: 'Replace scattered spreadsheets, chats and folders with a structured SaaS platform for team activities, attendance, projects, documents and deadlines.',
    kicker: 'From scattered tools to one platform',
    h1: 'An alternative to Excel and WhatsApp for team operations, documents and projects'
  },
  '/en/project-management-software-smes': {
    title: 'Project management software for SMEs | PM, Kanban, documents and reports',
    description: 'Project management software for SMEs with PM role, Kanban Board, Lead and Viewer visibility, documents, deadlines, workload, activity feed and operational reports.',
    kicker: 'Project management for SMEs',
    h1: 'Project management software for SMEs connected to real daily work'
  },
  '/en/business-demo-3-days': {
    title: '3-day business demo | Isolated SaaS demo company with sample data',
    description: 'Try Team Control Center with an isolated demo company, sample accounts and example data for 3 days. The demo environment is fully deleted at the end.',
    kicker: '3-day business demo',
    h1: 'Try a real isolated demo company for 3 days'
  }
};

const englishBenefits = [
  { title: 'One workspace for daily operations', text: 'Projects, activities, attendance, documents, deadlines and communications stay in the same operating environment instead of being split between spreadsheets, chats and folders.' },
  { title: 'Clear roles and company data boundaries', text: 'Company Admin, PM, Lead and Viewer roles work inside controlled permissions. Each company keeps its own data perimeter and each user sees only what they are allowed to see.' },
  { title: 'Modern control without enterprise complexity', text: 'Team Control Center gives SMEs a professional structure without forcing teams into complex enterprise platforms that are hard to adopt.' },
  { title: 'Project work becomes visual and traceable', text: 'The integrated Kanban Board makes tasks, priorities, deadlines and blockers easier to read while keeping project documents and responsibilities connected.' }
];

const englishFeatures = [
  { title: 'Company administration center', text: 'A dedicated area where the Company Admin can control users, roles, plan usage, enabled features, security, deadlines, audit events, project templates and company risks.' },
  { title: 'Advanced user management', text: 'Filter users by role and status, suspend or reactivate accounts, reset temporary passwords, change allowed roles and transfer assignments from one person to another.' },
  { title: 'PM / Project Manager role', text: 'The PM works inside the company perimeter, manages projects, sees company Lead and Viewer users, and associates them with projects and activities.' },
  { title: 'Project Kanban Board', text: 'Each project includes a Kanban Board with Backlog, To do, In progress, In review, Blocked and Done. PMs create, edit, assign and move cards; Lead and Viewer roles read the board.' },
  { title: 'Security and audit', text: 'Sensitive events such as role changes, password resets, account suspensions and assignment transfers can be tracked through company audit features.' },
  { title: 'Project templates', text: 'Reusable project templates help start recurring work, customer onboarding, internal procedures and repeated operational workflows faster.' },
  { title: 'Deadlines and critical issues', text: 'A single view helps monitor expiring documents, late Kanban tasks and pending absence requests before they become operational problems.' },
  { title: '3-day isolated demo company', text: 'The demo creates an isolated company with sample users and data. It lasts 3 days and is then deleted with all associated demo data.' }
];

const englishPlans = [
  { key: 'starter', name: 'Starter', price: '29€', note: 'per month, up to 5 users', bestFor: 'Small teams that need dashboard, profile, basic projects and essential company administration.', bullets: ['Dashboard', 'Profile', 'Basic projects', 'Limited search', 'Basic notifications', 'Basic deadlines', 'Basic export', 'First-login tutorial', 'Basic company administration', 'Kanban, operational PM, complete audit, templates and advanced security are not included'], cta: 'Choose Starter' },
  { key: 'team', name: 'Team', price: '79€', note: 'per month, up to 20 users', bestFor: 'Recommended for SMEs and structured teams that need PM, Kanban Board, advanced user management and operational administration.', bullets: ['Everything in Starter', 'PM / Project Manager', 'Project Kanban Board', 'Lead and Viewer assignment', 'Complete operational administration center', 'Advanced user management', 'Assignment transfer', 'Project templates', 'Activity feed', 'Workload', 'Basic reports', 'Basic security'], cta: 'Choose Team', highlighted: true },
  { key: 'business', name: 'Business', price: '149€', note: 'per month, up to 50 users', bestFor: 'Structured organizations that need complete audit, advanced security, advanced reports, history and stronger management control.', bullets: ['Everything in Team', 'Complete audit', 'Advanced security', 'Advanced reports', 'Advanced Kanban', 'Change history', 'Advanced automations', 'Administrative rules', 'Historical export', 'Higher management control', 'Priority support'], cta: 'Choose Business' }
];

const englishBlogPosts: EnglishBlogPost[] = [
  {
    slug: 'company-administration-center-operational-control',
    title: 'Company administration center: why SMEs need operational control',
    description: 'How a company administration center helps SMEs manage users, roles, security, plan usage, deadlines, audit events and project templates in one place.',
    date: '2026-05-19', readTime: '8 min', category: 'Administration',
    h1: 'Company administration center for SMEs: users, roles, security and audit in one place',
    intro: 'Growing companies need more than a dashboard: they need an administration center where operational control, security and accountability are easy to manage.',
    sections: [
      { title: 'Why administration matters', text: 'When a company grows, user accounts, roles, assignments, deadlines and documents become harder to control. A dedicated administration center helps the Company Admin understand what is active, what is critical and what requires attention.' },
      { title: 'What the Company Admin can control', text: 'Team Control Center gives the Company Admin a view over users, roles, plan usage, enabled features, security alerts, audit events, project templates and operational deadlines, always inside the company data perimeter.' },
      { title: 'Why this is useful for SMEs', text: 'SMEs often need structure but cannot afford complex enterprise tools. A clear administration center gives practical control without making the team slower.' }
    ],
    takeaway: 'A company administration center turns operational management into a controlled, traceable and scalable process for SMEs.',
    keywords: ['company administration center', 'team management software', 'software for SMEs', 'company audit software']
  },
  {
    slug: 'kanban-board-for-smes-project-management',
    title: 'Company Kanban Board: simple visual project management for SMEs',
    description: 'A practical guide to using a company Kanban Board inside projects, with PM control and read-only visibility for Lead and Viewer roles.',
    date: '2026-05-19', readTime: '7 min', category: 'Project management',
    h1: 'Company Kanban Board for SMEs: visual task management inside projects',
    intro: 'A Kanban Board helps teams understand what is pending, what is active, what is blocked and what has been completed without losing the business context of the project.',
    sections: [
      { title: 'More than a visual board', text: 'Inside Team Control Center, the Kanban Board is connected to projects, roles, priorities, deadlines, assignees and documents. This makes it useful for operational teams that need traceability.' },
      { title: 'PM, Lead and Viewer responsibilities', text: 'The PM can create, edit, assign and move cards. Lead and Viewer roles can consult the board in read-only mode, so project status is transparent without uncontrolled changes.' },
      { title: 'Why SMEs benefit from it', text: 'SMEs can reduce scattered task lists and chat messages by using a simple visual workflow that remains connected to company permissions and project information.' }
    ],
    takeaway: 'A company Kanban Board brings visual project management into a secure business platform instead of leaving tasks in separate tools.',
    keywords: ['company Kanban Board', 'Kanban Board for SMEs', 'project management software SMEs', 'alternative to Trello for SMEs']
  },
  {
    slug: 'alternative-to-excel-whatsapp-team-operations',
    title: 'Alternative to Excel and WhatsApp for team operations',
    description: 'Why SMEs should replace scattered spreadsheets, chats and folders with one SaaS platform for activities, attendance, documents and projects.',
    date: '2026-05-19', readTime: '7 min', category: 'Operations',
    h1: 'An alternative to Excel and WhatsApp for managing teams, documents and activities',
    intro: 'Excel and WhatsApp are useful, but they are not designed to manage roles, deadlines, audit, documents and structured company workflows over time.',
    sections: [
      { title: 'The problem with scattered tools', text: 'Information gets lost when activities are split between spreadsheets, personal chats, emails and folders. This creates manual work, unclear ownership and weak traceability.' },
      { title: 'What a structured platform changes', text: 'Team Control Center centralizes team operations, project activities, documents, attendance, notifications and reports, making daily work easier to monitor and reconstruct.' },
      { title: 'A practical path for SMEs', text: 'The goal is not to add complexity but to give teams one simple operating environment with clear roles, data boundaries and progressive adoption.' }
    ],
    takeaway: 'Replacing scattered tools with one structured workspace helps SMEs work with more clarity, control and continuity.',
    keywords: ['alternative to Excel and WhatsApp', 'team management software', 'business activity management', 'SaaS platform for SMEs']
  }
];

const englishLandingDetails: Record<string, { problem: string; solution: string; bullets: string[]; sections: { title: string; text: string }[]; cta: string }> = {
  '/en/administration-center': {
    problem: 'Company Admins need a clear place to control users, roles, plan usage, security, deadlines and operational risks.',
    solution: 'Team Control Center brings administration, security and company usage into a structured center designed for SMEs.',
    bullets: ['User and role control', 'Plan and usage overview', 'Security center', 'Audit of sensitive events', 'Project templates and critical deadlines'],
    sections: [
      { title: 'Designed for Company Admins', text: 'The administration center helps Company Admins make operational decisions without searching across disconnected tools.' },
      { title: 'Control without losing simplicity', text: 'The interface is designed to remain understandable for SMEs while supporting more advanced management needs as the company grows.' }
    ],
    cta: 'Request a demo to see how the administration center can support your organization.'
  },
  '/en/team-management-software': {
    problem: 'Teams often work across spreadsheets, chat messages, folders and manual reminders.',
    solution: 'Team Control Center centralizes team management, projects, documents, roles, attendance and Kanban Boards in one SaaS platform.',
    bullets: ['Team management software', 'Projects and activities', 'Documents and deadlines', 'Company roles', 'Operational reports'],
    sections: [
      { title: 'A single workspace', text: 'The platform reduces fragmentation and makes it easier to understand who is doing what, what is late and what requires attention.' },
      { title: 'Built for SMEs', text: 'The product is positioned for companies that need control but want a simple, accessible and professional tool.' }
    ],
    cta: 'Move from scattered work to one operational control center.'
  },
  '/en/kanban-board': {
    problem: 'Project activities become hard to follow when they are hidden in chats, notes or spreadsheets.',
    solution: 'The integrated Kanban Board gives each project a visual workflow connected to PM control, roles, priorities, deadlines and documents.',
    bullets: ['Backlog', 'To do', 'In progress', 'In review', 'Blocked', 'Done'],
    sections: [
      { title: 'Visual but controlled', text: 'The PM can manage cards, while Lead and Viewer roles can consult project progress in read-only mode.' },
      { title: 'Connected to business context', text: 'The board is not isolated from the company: it stays inside project, user, role and plan boundaries.' }
    ],
    cta: 'Use visual task management without losing business control.'
  },
  '/en/software-for-smes': {
    problem: 'SMEs need professional organization but often cannot adopt heavy enterprise systems.',
    solution: 'Team Control Center provides a practical SaaS platform for users, projects, documents, Kanban, audit, security and reports.',
    bullets: ['Software for SMEs', 'Company administration', 'Projects and Kanban', 'Documents and security', 'Reports and audit'],
    sections: [
      { title: 'A practical management layer', text: 'The product helps SMEs structure operations progressively while keeping the interface clear for real users.' },
      { title: 'Security and data perimeter', text: 'Every feature is designed around company boundaries, roles, users and active plan permissions.' }
    ],
    cta: 'Start with a guided demo and evaluate the right plan for your company.'
  },
  '/en/alternative-to-excel-whatsapp': {
    problem: 'Excel, WhatsApp and folders are not enough when activities, documents and responsibilities must be tracked over time.',
    solution: 'Team Control Center gives teams a structured platform for tasks, attendance, documents, deadlines, roles and project visibility.',
    bullets: ['Less manual work', 'More traceability', 'Documents connected to projects', 'Roles and permissions', 'Operational dashboards'],
    sections: [
      { title: 'From messages to workflows', text: 'Chats are useful for quick communication, but companies need workflows that remain searchable, controlled and reconstructable.' },
      { title: 'From files to accountability', text: 'A shared platform makes responsibilities, deadlines and project status more visible.' }
    ],
    cta: 'Reduce scattered tools and start managing work from one place.'
  },
  '/en/project-management-software-smes': {
    problem: 'SME project management needs to connect people, tasks, documents, roles and deadlines without excessive complexity.',
    solution: 'Team Control Center combines PM role, Kanban Board, Lead/Viewer visibility, documents, workload and reports in one platform.',
    bullets: ['PM role', 'Project Kanban Board', 'Lead and Viewer visibility', 'Documents and deadlines', 'Workload and activity feed'],
    sections: [
      { title: 'Project management connected to operations', text: 'The platform keeps project status close to documents, responsibilities and company users.' },
      { title: 'Simple for teams, useful for management', text: 'Operational teams get clarity while the company gains visibility and control.' }
    ],
    cta: 'See how simple project management can become part of your daily operations.'
  },
  '/en/business-demo-3-days': {
    problem: 'Companies need to evaluate a SaaS product safely before committing to a plan.',
    solution: 'The 3-day demo creates an isolated company with sample accounts and data, then deletes the environment at the end.',
    bullets: ['Isolated demo company', 'Sample users and data', '3-day duration', 'Complete deletion at the end', 'Safe product evaluation'],
    sections: [
      { title: 'A realistic evaluation', text: 'The demo lets companies test the platform with realistic data instead of reading only a presentation.' },
      { title: 'Temporary and isolated', text: 'The demo environment is separated from other companies and is removed with its associated data after the demo period.' }
    ],
    cta: 'Request the 3-day demo and evaluate Team Control Center with a real operating environment.'
  }
};

function isEnglishPath(pathname: string) {
  return pathname === '/en' || pathname.startsWith('/en/');
}

function stripEnglishPrefix(pathname: string) {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3) || '/';
  return pathname;
}

function toEnglishPath(pathname: string) {
  const clean = stripEnglishPrefix(pathname);
  const mapped: Record<string, string> = {
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
  if (clean.startsWith('/blog/')) return '/en/blog';
  return mapped[clean] || `/en${clean}`;
}

function toItalianPath(pathname: string) {
  const clean = stripEnglishPrefix(pathname);
  const mapped: Record<string, string> = {
    '/': '/',
    '/features': '/funzionalita',
    '/pricing': '/prezzi',
    '/demo': '/demo',
    '/contact': '/contatti',
    '/blog': '/blog',
    '/administration-center': '/centro-amministrativo-aziendale',
    '/team-management-software': '/software-gestione-team-aziendale',
    '/kanban-board': '/kanban-board-aziendale',
    '/software-for-smes': '/software-per-pmi',
    '/alternative-to-excel-whatsapp': '/alternativa-excel-whatsapp',
    '/project-management-software-smes': '/software-project-management-pmi',
    '/business-demo-3-days': '/demo-aziendale-3-giorni'
  };
  if (clean.startsWith('/blog/')) return '/blog';
  return mapped[clean] || clean || '/';
}

function setEnglishMeta(pathname: string) {
  const clean = stripEnglishPrefix(pathname);
  const normalized = clean === '/' ? '/en' : `/en${clean}`;
  const postSlug = clean.startsWith('/blog/') ? clean.replace('/blog/', '') : '';
  const post = englishBlogPosts.find((item) => item.slug === postSlug);
  const route = post ? englishPages['/en/blog'] : englishPages[normalized as keyof typeof englishPages] || englishPages['/en'];
  const title = post ? `${post.title} | Team Control Center` : route.title;
  const description = post ? post.description : route.description;
  document.documentElement.lang = 'en';
  document.title = title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', description);
}

function localHref(href: string, language: MarketingLanguage) {
  if (href.startsWith('http')) return href;
  return language === 'en' ? href : toItalianPath(href);
}

function Header({ language = 'it' }: { language?: MarketingLanguage }) {
  const [open, setOpen] = useState(false);
  const isEn = language === 'en';
  const mainNav = isEn ? englishNav : nav;
  const solNav = isEn ? englishSolutionNav : solutionNav;
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const switchHref = isEn ? toItalianPath(currentPath) : toEnglishPath(currentPath);
  return (
    <header className="site-header">
      <a className="brand" href={isEn ? '/en' : '/'} aria-label="Team Control Center home">
        <img src="/logo.svg" alt="Team Control Center" />
      </a>
      <nav className="desktop-nav" aria-label="Navigazione principale">
        {mainNav.map(([href, label]) => (
          <a href={href} key={href}>{label}</a>
        ))}
        <div className="nav-dropdown">
          <button type="button">{isEn ? 'Solutions' : 'Soluzioni'}</button>
          <div className="dropdown-menu">
            {solNav.map(([href, label]) => (
              <a href={href} key={href}>{label}</a>
            ))}
          </div>
        </div>
      </nav>
      <div className="header-actions">
        <a className="language-pill" href={switchHref}>{isEn ? 'IT' : 'EN'}</a>
        <a className="ghost" href="https://app.teamcontrolcenter.it">{isEn ? 'Login' : 'Accedi'}</a>
        <a className="primary small" href={isEn ? '/en/pricing' : '/prezzi'}>{isEn ? 'View pricing' : 'Vedi i prezzi'}</a>
      </div>
      <button className="mobile-toggle" onClick={() => setOpen(true)} aria-label={isEn ? 'Open menu' : 'Apri menu'}>
        <Menu />
      </button>
      {open && (
        <div className="mobile-panel" role="dialog" aria-modal="true">
          <div className="mobile-card">
            <button className="mobile-close" onClick={() => setOpen(false)} aria-label={isEn ? 'Close menu' : 'Chiudi menu'}>
              <X />
            </button>
            {[...mainNav, ...solNav, [switchHref, isEn ? 'Italiano' : 'English'], ['https://app.teamcontrolcenter.it', isEn ? 'Login app' : 'Accedi app']].map(([href, label]) => (
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


function ModernProductVisual({ language = 'it' }: { language?: MarketingLanguage }) {
  const isEn = language === 'en';
  const cards = isEn
    ? [
      ['Admin center', 'Users, roles, plan usage and security in one place'],
      ['Kanban workflow', 'Backlog, To do, In progress, Review, Blocked and Done'],
      ['Company data perimeter', 'Every view is filtered by company, role, user and plan']
    ]
    : [
      ['Centro amministrativo', 'Utenti, ruoli, piano, utilizzo e sicurezza in un solo punto'],
      ['Workflow Kanban', 'Backlog, Da fare, In corso, Revisione, Bloccato e Fatto'],
      ['Perimetro dati aziendale', 'Ogni vista è filtrata per azienda, ruolo, utente e piano']
    ];
  return (
    <section className="section innovation-section">
      <div className="innovation-wrap">
        <div className="innovation-copy">
          <div className="eyebrow"><Sparkles size={16} /> {isEn ? 'Modern SaaS experience' : 'Esperienza SaaS moderna'}</div>
          <h2>{isEn ? 'A more visual, elegant and operational way to understand company work' : 'Un modo più visuale, elegante e operativo per leggere il lavoro aziendale'}</h2>
          <p>{isEn ? 'Team Control Center combines administration, project management, documents and Kanban workflows in a clean interface designed for SMEs that want control without complexity.' : 'Team Control Center unisce amministrazione, project management, documenti e workflow Kanban in un’interfaccia pulita, pensata per PMI che vogliono controllo senza complessità.'}</p>
          <div className="innovation-tags">
            <span>{isEn ? 'PM role' : 'Ruolo PM'}</span>
            <span>{isEn ? 'Audit' : 'Audit'}</span>
            <span>{isEn ? 'Templates' : 'Template'}</span>
            <span>{isEn ? '3-day demo' : 'Demo 3 giorni'}</span>
          </div>
        </div>
        <div className="product-graphic" aria-label={isEn ? 'Team Control Center visual dashboard' : 'Grafica dashboard Team Control Center'}>
          <div className="graphic-orb orb-one"></div>
          <div className="graphic-orb orb-two"></div>
          <div className="graphic-panel main-panel">
            <div className="panel-top"><span></span><span></span><span></span></div>
            <div className="kanban-graphic">
              {['Backlog', isEn ? 'To do' : 'Da fare', isEn ? 'In progress' : 'In corso', isEn ? 'Done' : 'Fatto'].map((column, index) => (
                <div className="kanban-column" key={column}>
                  <strong>{column}</strong>
                  <span style={{ width: `${72 + index * 6}%` }}></span>
                  <span style={{ width: `${54 + index * 8}%` }}></span>
                </div>
              ))}
            </div>
          </div>
          <div className="floating-metric metric-one"><b>98%</b><span>{isEn ? 'tracked tasks' : 'attività tracciate'}</span></div>
          <div className="floating-metric metric-two"><b>24</b><span>{isEn ? 'active projects' : 'progetti attivi'}</span></div>
        </div>
      </div>
      <div className="innovation-cards">
        {cards.map(([title, text]) => <article key={title}><CheckCircle2 /><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
  );
}

function GlobalReadySection({ language = 'it' }: { language?: MarketingLanguage }) {
  const isEn = language === 'en';
  return (
    <section className="section global-section">
      <div className="global-card">
        <div className="global-glow"></div>
        <div>
          <p className="eyebrow mini">{isEn ? 'International ready' : 'Pronto per crescere fuori dall’Italia'}</p>
          <h2>{isEn ? 'Multilingual by design, clear for search engines and AI assistants' : 'Multilingua, leggibile dai motori di ricerca e comprensibile dagli assistenti AI'}</h2>
          <p>{isEn ? 'The public website now has English routes, localized SEO content, language switch, hreflang-ready structure and AI-friendly summaries. The architecture is ready to add more languages without touching the existing Italian experience.' : 'Il sito pubblico ora supporta percorsi in inglese, contenuti SEO localizzati, switch lingua, struttura pronta per hreflang e sintesi AI-friendly. L’architettura è pronta per aggiungere altre lingue senza toccare l’esperienza italiana esistente.'}</p>
        </div>
        <div className="global-map" aria-hidden="true">
          <span>IT</span><span>EN</span><span>EU</span><span>PMI</span><span>SaaS</span>
        </div>
      </div>
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
      <ModernProductVisual />
      <GlobalReadySection />
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
      <ModernProductVisual />
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

type DemoForm = {
  company: string;
  name: string;
  email: string;
  phone: string;
  employees: string;
  message: string;
};

type ContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

const emptyDemoForm: DemoForm = { company: '', name: '', email: '', phone: '', employees: '', message: '' };
const emptyContactForm: ContactForm = { firstName: '', lastName: '', email: '', company: '', subject: '', message: '' };

function DemoPage() {
  const route = routes.demo;
  const [form, setForm] = useState<DemoForm>(emptyDemoForm);
  const [notice, setNotice] = useState<FormNotice>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    setLoading(true);
    try {
      const data = await postJson('/api/leads/request-activation', { ...form, source: 'demo' });
      sendGoogleAnalyticsEvent('request_demo_submitted', { event_category: 'lead', page_path: window.location.pathname });
      setNotice({
        type: data.mailNotified === false ? 'success' : 'success',
        text: data.mailNotified === false
          ? 'Richiesta ricevuta dal server, ma la notifica email non è stata confermata. Verifica configurazione SMTP e log della marketing API.'
          : 'Richiesta demo inviata. Ti contatteremo a breve.'
      });
      setForm(emptyDemoForm);
    } catch (error: any) {
      setNotice({ type: 'error', text: error.message || 'Non siamo riusciti a inviare la richiesta demo. Riprova tra poco.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Hero page="demo" />
      <section className="section form-section">
        <form className="lead-form" onSubmit={submit}>
          <h2>{route.h1}</h2>
          <p>Compila il form e raccontaci cosa vuoi migliorare: presenze, progetti, documenti, comunicazioni, report, Kanban Board, ruolo PM o gestione ruoli. Ti risponderemo con una proposta concreta.</p>
          <input required placeholder="Nome azienda" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <input required placeholder="Nome e cognome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email aziendale" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div className="form-row">
            <input placeholder="Telefono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="Numero dipendenti" value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} />
          </div>
          <textarea placeholder="Raccontaci cosa vuoi vedere nella demo" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <label className="privacy-check"><input required type="checkbox" /> Ho letto la Privacy Policy e autorizzo il contatto commerciale.</label>
          <button className="primary full" disabled={loading}>{loading ? 'Invio richiesta demo...' : 'Invia richiesta demo'}</button>
          {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}
        </form>
      </section>
    </>
  );
}

function ContactPage() {
  const route = routes.contacts;
  const [form, setForm] = useState<ContactForm>(emptyContactForm);
  const [files, setFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [notice, setNotice] = useState<FormNotice>(null);
  const [loading, setLoading] = useState(false);

  function updateFiles(list: FileList | null) {
    const selected = Array.from(list || []);
    if (!selected.length) {
      setFiles([]);
      return;
    }

    if (selected.length > CONTACT_MAX_FILES) {
      setNotice({ type: 'error', text: `Puoi allegare al massimo ${CONTACT_MAX_FILES} documenti.` });
      setFiles([]);
      setFileInputKey((value) => value + 1);
      return;
    }

    const invalid = selected.find((file) => !isAllowedContactFile(file) || file.size > CONTACT_MAX_FILE_SIZE);
    if (invalid) {
      setNotice({
        type: 'error',
        text: `Il file “${invalid.name}” non è valido. Usa PDF, Word, Excel, CSV, TXT, PNG o JPG fino a 8 MB per file.`
      });
      setFiles([]);
      setFileInputKey((value) => value + 1);
      return;
    }

    setNotice(null);
    setFiles(selected);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      payload.append('source', 'contatti');
      files.forEach((file) => payload.append('documents', file));

      const data = await postFormData('/api/contacts/request', payload);
      sendGoogleAnalyticsEvent('contact_form_submitted', { event_category: 'lead', page_path: window.location.pathname, attachments: files.length });
      setNotice({
        type: 'success',
        text: data.mailNotified === false
          ? 'Messaggio ricevuto dal server, ma la notifica email non è stata confermata. Verifica configurazione SMTP e log della marketing API.'
          : 'Messaggio inviato correttamente. Ti risponderemo appena possibile.'
      });
      setForm(emptyContactForm);
      setFiles([]);
      setFileInputKey((value) => value + 1);
    } catch (error: any) {
      setNotice({ type: 'error', text: error.message || 'Non siamo riusciti a inviare il messaggio. Riprova tra poco.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Hero page="contacts" />
      <section className="section contact-section">
        <div className="contact-layout">
          <form className="lead-form contact-form" onSubmit={submit} encType="multipart/form-data">
            <h2>{route.h1}</h2>
            <p>Scrivici per informazioni su demo, piani SaaS, gestione team aziendale, presenze, progetti, documenti, Kanban Board, ruolo PM o attivazione della tua azienda.</p>
            <div className="form-row">
              <input required placeholder="Nome" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              <input required placeholder="Cognome" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <input required type="email" placeholder="Email aziendale" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input required placeholder="Azienda" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <input required placeholder="Oggetto" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <textarea required placeholder="Testo del messaggio" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <label className="file-upload">
              <span><FileText size={18} /> Allegati opzionali</span>
              <small>Puoi caricare fino a 5 documenti: PDF, Word, Excel, CSV, TXT, PNG o JPG. Massimo 8 MB per file.</small>
              <input key={fileInputKey} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg" onChange={(e) => updateFiles(e.target.files)} />
            </label>
            {files.length > 0 && (
              <div className="file-list" aria-label="Documenti allegati selezionati">
                {files.map((file) => (
                  <span key={`${file.name}-${file.size}`}>{file.name} · {formatFileSize(file.size)}</span>
                ))}
              </div>
            )}
            <label className="privacy-check"><input required type="checkbox" /> Ho letto la Privacy Policy e autorizzo il trattamento dei dati per ricevere risposta alla richiesta.</label>
            <button className="primary full" disabled={loading}>{loading ? 'Invio messaggio...' : 'Invia messaggio'}</button>
            {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}
          </form>
          <aside className="contact-card" aria-label="Informazioni di contatto">
            <div className="icon"><MessageSquareText /></div>
            <h2>Quando usare Contattaci</h2>
            <p>Usa questa sezione per richieste commerciali, chiarimenti sui piani, domande su PMI, cooperative, gestione presenze e progetti, oppure per inviare documenti utili alla valutazione.</p>
            <ul>
              <li><CheckCircle2 /> Richieste generiche e commerciali</li>
              <li><CheckCircle2 /> Domande su piani Starter, Team e Business</li>
              <li><CheckCircle2 /> Documenti opzionali a supporto della richiesta</li>
              <li><CheckCircle2 /> Risposta via email al referente indicato</li>
            </ul>
            <a className="secondary full" href="/demo">Preferisci una demo guidata?</a>
          </aside>
        </div>
      </section>
    </>
  );
}


function SeoLanding({ page }: { page: keyof typeof landingDetails }) {
  const details = landingDetails[page];
  const route = routes[page];
  return (
    <>
      <Hero page={page} />
      <section className="section intro-section">
        <div className="section-head">
          <p>{route.kicker}</p>
          <h2>{details.problem}</h2>
        </div>
        <div className="rich-copy">
          <p>{details.solution}</p>
          <p>{details.cta}</p>
        </div>
      </section>
      <section className="section soft-section">
        <div className="section-head">
          <p>Cosa rende utile questa soluzione</p>
          <h2>Funzioni e concetti chiave collegati alla ricerca</h2>
        </div>
        <div className="cards small-cards">
          {details.bullets.map((bullet) => (
            <article className="card" key={bullet}><CheckCircle2 /><h3>{bullet}</h3><p>Elemento utile per migliorare gestione operativa, controllo aziendale e semplicità di adozione.</p></article>
          ))}
        </div>
      </section>
      <section className="article-content landing-article">
        {details.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </section>
      {page === 'faq' && <FaqSection />}
      <BlogPreview />
      <CTA />
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


function EnglishHero({ meta, blog }: { meta: typeof englishPages['/en']; blog?: EnglishBlogPost }) {
  return (
    <section className={`hero ${blog ? 'hero-article' : ''}`}>
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={16} /> {blog?.category || meta.kicker}</div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>{blog?.h1 || meta.h1}</motion.h1>
        <p className="hero-subtitle">{blog?.intro || meta.description}</p>
        {blog ? (
          <div className="article-meta"><span>{blog.date}</span><span>{blog.readTime}</span><span>Team Control Center</span></div>
        ) : (
          <div className="hero-actions"><a className="primary" href="/en/pricing">Choose a plan <ArrowRight size={18} /></a><a className="secondary" href="/en/demo">Request demo</a></div>
        )}
        {!blog && <div className="trust-row"><span><BadgeCheck /> Guided activation</span><span><ShieldCheck /> Company data perimeter</span><span><Clock3 /> Browser-based SaaS</span></div>}
      </div>
      {!blog && (
        <motion.div className="hero-dashboard" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <div className="dash-top"><span></span><span></span><span></span></div>
          <div className="dash-grid"><div><b>97%</b><small>Tracked operations</small></div><div><b>24</b><small>Active projects</small></div><div><b>18</b><small>Teams coordinated</small></div></div>
          <div className="timeline"><span></span><span></span><span></span><span></span></div>
          <div className="message-preview"><MessageSquareText /><p>Project update shared with the team.</p></div>
          <div className="permission-preview"><LockKeyhole size={18} /><span>Profiled access: company, PM, Lead, Viewer</span></div>
        </motion.div>
      )}
    </section>
  );
}

function EnglishHome() {
  return (
    <>
      <EnglishHero meta={englishPages['/en']} />
      <section className="logo-strip" aria-label="Managed product areas"><span>Attendance</span><span>Projects</span><span>Kanban</span><span>Documents</span><span>Audit</span><span>Roles</span><span>Reports</span></section>
      <section className="section intro-section"><div className="section-head"><p>Why Team Control Center</p><h2>Replace scattered spreadsheets, chats and folders with one company operating flow</h2></div><div className="rich-copy"><p>Team Control Center is designed for SMEs that want a more organized way to manage people, projects, documents, deadlines, communications and reports.</p><p>The platform separates data by company, organizes access by role and helps Company Admins, PMs, Leads and Viewers work in the same controlled environment.</p></div></section>
      <ModernProductVisual language="en" />
      <GlobalReadySection language="en" />
      <section className="section"><div className="section-head"><p>Business benefits</p><h2>One modern workspace to stop chasing information</h2></div><div className="cards">{englishBenefits.map((benefit) => <article className="card" key={benefit.title}><CheckCircle2 /><h3>{benefit.title}</h3><p>{benefit.text}</p></article>)}</div></section>
      <EnglishFeaturePreview />
      <EnglishBlogPreview />
      <EnglishCTA />
    </>
  );
}

function EnglishFeaturePreview() {
  return <section className="section"><div className="section-head"><p>Main features</p><h2>From company administration to project Kanban</h2></div><div className="feature-grid compact">{englishFeatures.slice(0, 6).map((feature, index) => <article className="feature-card" key={feature.title}><div className="icon">{[<Building2 />, <UsersRound />, <ShieldCheck />, <Layers3 />, <FileText />, <Rocket />][index]}</div><h2>{feature.title}</h2><p>{feature.text}</p></article>)}</div><div className="center-action"><a className="secondary" href="/en/features">View all features</a></div></section>;
}

function EnglishFeatures() {
  const icons = [<Building2 />, <UsersRound />, <BriefcaseBusiness />, <Layers3 />, <ShieldCheck />, <FileText />, <Clock3 />, <Rocket />];
  return <><EnglishHero meta={englishPages['/en/features']} /><section className="section intro-section"><div className="section-head"><p>Control and collaboration</p><h2>Every module solves a real operational problem</h2></div><div className="rich-copy"><p>Team Control Center connects administration, users, roles, projects, documents, deadlines, Kanban Boards, audit events and reports.</p><p>This reduces the need for separate tools and keeps company operations easier to understand as teams grow.</p></div></section><ModernProductVisual language="en" /><section className="section"><div className="feature-grid">{englishFeatures.map((feature, index) => <article className="feature-card" key={feature.title}><div className="icon">{icons[index % icons.length]}</div><h2>{feature.title}</h2><p>{feature.text}</p></article>)}</div></section><EnglishFaq /><EnglishCTA /></>;
}

function EnglishPricing() {
  return <><EnglishHero meta={englishPages['/en/pricing']} /><section className="section pricing-section"><div className="section-head"><p>Available plans</p><h2>Choose the plan that matches your organization</h2></div><div className="pricing-grid">{englishPlans.map((plan) => <article className={`price-card ${plan.highlighted ? 'highlighted' : ''}`} key={plan.key}>{plan.highlighted && <div className="popular-badge">Recommended</div>}<h2>{plan.name}</h2><div className="price"><b>{plan.price}</b><span>/month</span></div><p className="plan-note">{plan.note}</p><p>{plan.bestFor}</p><ul>{plan.bullets.map((bullet) => <li key={bullet}><CheckCircle2 />{bullet}</li>)}</ul><a className="primary full" href="/en/demo">{plan.cta}</a></article>)}</div></section><section className="section muted-section"><div className="split muted-split"><div><h2>Secure payment and guided activation</h2><p>The SaaS flow is designed to activate companies in a controlled way and connect subscription, plan and enabled features.</p></div><div><h2>Start simple, grow with control</h2><p>Starter covers essential needs, Team is recommended for structured SMEs, and Business adds advanced security, audit and management control.</p></div></div></section><EnglishFaq /></>;
}

function EnglishDemo() {
  return <><EnglishHero meta={englishPages['/en/demo']} /><section className="section form-section"><form className="lead-form" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const data = new FormData(form); postJson('/api/leads/request-activation', Object.fromEntries(data.entries())).then(() => alert('Demo request sent. We will contact you soon.')).catch((error) => alert(error.message || 'Request failed. Please try again.')); }}><h2>Request a guided demo</h2><p>Tell us what you want to evaluate: administration center, PM role, Kanban Board, documents, audit, attendance or the 3-day isolated demo company.</p><input name="company" required placeholder="Company name" /><input name="name" required placeholder="Full name" /><input name="email" required type="email" placeholder="Business email" /><div className="form-row"><input name="phone" placeholder="Phone" /><input name="employees" placeholder="Number of employees" /></div><textarea name="message" placeholder="What would you like to see in the demo?" /><input type="hidden" name="source" value="english-demo" /><label className="privacy-check"><input required type="checkbox" /> I have read the Privacy Policy and authorize commercial contact.</label><button className="primary full">Send demo request</button></form></section></>;
}

function EnglishContact() {
  return <><EnglishHero meta={englishPages['/en/contact']} /><section className="section contact-section"><div className="contact-layout"><form className="lead-form contact-form" onSubmit={(event) => { event.preventDefault(); const payload = new FormData(event.currentTarget as HTMLFormElement); payload.append('source', 'english-contact'); postFormData('/api/contacts/request', payload).then(() => alert('Message sent. We will reply as soon as possible.')).catch((error) => alert(error.message || 'Message failed. Please try again.')); }} encType="multipart/form-data"><h2>Contact us</h2><p>Send us a message about plans, product information, demos, implementation or documents to review.</p><div className="form-row"><input name="firstName" required placeholder="First name" /><input name="lastName" required placeholder="Last name" /></div><input name="email" required type="email" placeholder="Business email" /><input name="company" required placeholder="Company" /><input name="subject" required placeholder="Subject" /><textarea name="message" required placeholder="Message" /><label className="file-upload"><span><FileText size={18} /> Optional attachments</span><small>PDF, Word, Excel, CSV, TXT, PNG or JPG. Up to 5 files, 8 MB each.</small><input type="file" name="documents" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg" /></label><label className="privacy-check"><input required type="checkbox" /> I have read the Privacy Policy and authorize data processing to receive a reply.</label><button className="primary full">Send message</button></form><aside className="contact-card"><div className="icon"><MessageSquareText /></div><h2>When to contact us</h2><p>Use this page for sales questions, plan details, implementation requests or documents useful to evaluate your company workflow.</p><ul><li><CheckCircle2 /> Product and pricing questions</li><li><CheckCircle2 /> Demo and activation requests</li><li><CheckCircle2 /> Optional supporting documents</li><li><CheckCircle2 /> Reply by email</li></ul><a className="secondary full" href="/en/demo">Prefer a guided demo?</a></aside></div></section></>;
}

function EnglishLanding({ path }: { path: string }) {
  const meta = englishPages[path as keyof typeof englishPages] || englishPages['/en'];
  const details = englishLandingDetails[path] || englishLandingDetails['/en/software-for-smes'];
  return <><EnglishHero meta={meta} /><section className="section intro-section"><div className="section-head"><p>{meta.kicker}</p><h2>{details.problem}</h2></div><div className="rich-copy"><p>{details.solution}</p><p>{details.cta}</p></div></section><section className="section soft-section"><div className="section-head"><p>Core capabilities</p><h2>Useful features connected to this need</h2></div><div className="cards small-cards">{details.bullets.map((bullet) => <article className="card" key={bullet}><CheckCircle2 /><h3>{bullet}</h3><p>Designed to improve operational control, simplicity and adoption for SMEs.</p></article>)}</div></section><section className="article-content landing-article">{details.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}</section><EnglishBlogPreview /><EnglishCTA /></>;
}

function EnglishBlogList() {
  return <><EnglishHero meta={englishPages['/en/blog']} /><section className="section intro-section"><div className="section-head"><p>SEO resources and practical guides</p><h2>Articles for companies evaluating operational SaaS software</h2></div><div className="rich-copy"><p>The blog explains team management, company administration, Kanban, audit, documents, roles and operational control in a practical way.</p></div></section><section className="section"><div className="blog-grid">{englishBlogPosts.map((post) => <EnglishBlogCard post={post} key={post.slug} />)}</div></section><EnglishCTA /></>;
}

function EnglishBlogCard({ post }: { post: EnglishBlogPost }) {
  return <article className="blog-card"><div className="article-meta"><span>{post.category}</span><span>{post.readTime}</span></div><h2><a href={`/en/blog/${post.slug}`}>{post.title}</a></h2><p>{post.description}</p><a className="read-more" href={`/en/blog/${post.slug}`}>Read article <ArrowRight size={16} /></a></article>;
}

function EnglishBlogPreview() {
  return <section className="section blog-preview"><div className="section-head"><p>From the blog</p><h2>Useful guides for choosing better business software</h2></div><div className="blog-grid preview">{englishBlogPosts.map((post) => <EnglishBlogCard post={post} key={post.slug} />)}</div><div className="center-action"><a className="secondary" href="/en/blog">Go to blog</a></div></section>;
}

function EnglishBlogArticle({ post }: { post: EnglishBlogPost }) {
  return <><EnglishHero meta={englishPages['/en/blog']} blog={post} /><article className="article-content">{post.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}<div className="takeaway"><h2>In summary</h2><p>{post.takeaway}</p></div></article><EnglishCTA /></>;
}

function EnglishFaq() {
  const faqs = [
    ['What is Team Control Center?', 'Team Control Center is a SaaS platform for SMEs that need to manage teams, projects, documents, attendance, Kanban Boards, roles, audit and operational control.'],
    ['Is it suitable for SMEs?', 'Yes. It is designed for SMEs and operational teams that need more structure than spreadsheets and chats, without adopting overly complex enterprise platforms.'],
    ['Does it include a Kanban Board?', 'Yes. The Team plan includes a project Kanban Board. PMs can manage cards while Lead and Viewer roles can consult the board in read-only mode.'],
    ['How does the 3-day demo work?', 'The demo creates an isolated company with sample accounts and data. It lasts 3 days and is then deleted with all associated data.']
  ];
  return <section className="section faq-section"><div className="section-head"><p>FAQ</p><h2>Quick answers before requesting a demo</h2></div><div className="faq-list">{faqs.map(([q, a]) => <details key={q}><summary><HelpCircle size={18} /> {q}</summary><p>{a}</p></details>)}</div></section>;
}

function EnglishCTA() {
  return <section className="cta"><div className="cta-icon"><Network /></div><h2>Ready to upgrade how your team works?</h2><p>Start with a demo or choose a plan. Activation is guided and designed to avoid interrupting your existing operations.</p><div className="hero-actions center"><a className="primary" href="/en/demo">Request demo <ArrowRight size={18} /></a><a className="secondary light" href="/en/pricing">View pricing</a></div></section>;
}

function EnglishContent({ path }: { path: string }) {
  const clean = stripEnglishPrefix(path);
  if (clean.startsWith('/blog/')) {
    const slug = clean.replace('/blog/', '');
    const post = englishBlogPosts.find((item) => item.slug === slug);
    return post ? <EnglishBlogArticle post={post} /> : <EnglishBlogList />;
  }
  if (clean === '/' || path === '/en') return <EnglishHome />;
  if (clean === '/features') return <EnglishFeatures />;
  if (clean === '/pricing') return <EnglishPricing />;
  if (clean === '/demo') return <EnglishDemo />;
  if (clean === '/contact') return <EnglishContact />;
  if (clean === '/blog') return <EnglishBlogList />;
  return <EnglishLanding path={path} />;
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

function Footer({ language = 'it' }: { language?: MarketingLanguage }) {
  const isEn = language === 'en';
  const solNav = isEn ? englishSolutionNav : solutionNav;
  return (
    <footer className="footer">
      <div>
        <img src="/logo.svg" alt="Team Control Center" />
        <p>{isEn ? 'The platform to manage teams, projects, documents, attendance, Kanban and business operations in one place.' : 'La piattaforma per gestire team, presenze, progetti, chat, documenti e attività aziendali in un unico posto.'}</p>
      </div>
      <div className="footer-columns">
        <div>
          <h3>{isEn ? 'Product' : 'Prodotto'}</h3>
          {isEn ? <><a href="/en/features">Features</a><a href="/en/pricing">Pricing</a><a href="/en/demo">Demo</a><a href="/en/contact">Contact</a><a href="/en/blog">Blog</a></> : <><a href="/funzionalita">Funzionalità</a><a href="/prezzi">Prezzi</a><a href="/demo">Demo</a><a href="/contatti">Contatti</a><a href="/blog">Blog</a></>}
        </div>
        <div>
          <h3>{isEn ? 'Solutions' : 'Soluzioni'}</h3>
          {solNav.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
        </div>
        <div>
          <h3>{isEn ? 'Legal' : 'Legale'}</h3>
          {legalNav.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
          <button className="footer-cookie-button" type="button" onClick={() => window.dispatchEvent(new Event('tcc:open-cookie-preferences'))}>{isEn ? 'Manage cookie preferences' : 'Gestisci preferenze cookie'}</button>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [path, setPath] = useState(normalizedPath());
  const isEn = isEnglishPath(path);
  const { page, post } = useMemo(() => resolveRoute(isEn ? stripEnglishPrefix(path) : path), [path, isEn]);

  useEffect(() => {
    window.tccAnalyticsTest = runAnalyticsRealtimeTest;
    return () => {
      window.tccAnalyticsTest = undefined;
    };
  }, []);

  useEffect(() => {
    if (isEn) setEnglishMeta(path);
    else { document.documentElement.lang = 'it'; setMeta(page, post); }
  }, [page, post, path, isEn]);
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
    if (isEn) return <EnglishContent path={path} />;
    if (post) return <BlogArticle post={post} />;
    if (page === 'home') return <Home />;
    if (page === 'features') return <Features />;
    if (page === 'pricing') return <Pricing />;
    if (page === 'demo') return <DemoPage />;
    if (page === 'contacts') return <ContactPage />;
    if (page in landingDetails) return <SeoLanding page={page as keyof typeof landingDetails} />;
    if (page === 'presence' || page === 'projects' || page === 'cooperatives' || page === 'agencies' || page === 'schools') return <Vertical page={page} />;
    if (page === 'blog') return <BlogList />;
    return <Legal page={page as LegalPageKey} />;
  }, [page, post, path, isEn]);

  return (
    <>
      <Header language={isEn ? 'en' : 'it'} />
      <main>{content}</main>
      <Footer language={isEn ? 'en' : 'it'} />
      <CookieBanner />
    </>
  );
}
