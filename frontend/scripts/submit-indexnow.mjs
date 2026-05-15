import fs from 'node:fs';
import path from 'node:path';

const baseUrl = (process.env.PUBLIC_SITE_URL || 'https://teamcontrolcenter.it').replace(/\/$/, '');
const dist = path.resolve('dist');
const payloadPath = path.join(dist, 'indexnow-urls.json');

if (!fs.existsSync(payloadPath)) {
  console.error('File dist/indexnow-urls.json non trovato. Esegui prima npm run build.');
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
const endpoint = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';

const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload)
});

if (!response.ok && response.status !== 202 && response.status !== 200) {
  const body = await response.text().catch(() => '');
  console.error(`IndexNow non accettato: ${response.status} ${response.statusText}`);
  if (body) console.error(body);
  process.exit(1);
}

console.log(`IndexNow inviato correttamente per ${payload.urlList.length} URL su ${baseUrl}.`);
