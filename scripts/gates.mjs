/**
 * Bramki jakości na zbudowanym HTML. Każdy błąd zatrzymuje build.
 * - prywatność: zero zasobów z obcych domen (skrypty, style, obrazy, czcionki),
 * - neutralność: zakaz nazw partii i nazwisk polityków w treści,
 * - meta: tytuł, opis, canonical, jeden H1, lang,
 * - linki wewnętrzne prowadzą do istniejących stron,
 * - treść: brak placeholderów.
 */
import { readFile, glob } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
const DIST = new URL('../dist/', import.meta.url).pathname;
const FORBIDDEN = [
  /\b(PiS|PO|KO|PSL|Lewic\w+|Konfederac\w+|Polska 2050|Partia Razem|Trzecia Droga|Koalicj\w+ Obywatelsk\w+|Prawo i Sprawiedliwo\w+|Platform\w+ Obywatelsk\w+)\b/,
  /\b(Tusk\w*|Kaczy[nń]sk\w*|Morawieck\w*|Domańsk\w*|Nawrock\w*|Hołowni\w*|Mentzen\w*|Bosak\w*|Trzaskowsk\w*|Duda\b|Dud\w+ Andrzej)\b/,
  /\b(złodziej\w*|grabież\w*|haracz\w*|rozbój|łupi\w*)\b/i,
  /lorem ipsum|\bTODO\b|\bFIXME\b|\bTBD\b|undefined|NaN/,
];
const errors = [];
const pages = [];
for await (const f of glob('**/*.html', { cwd: DIST })) pages.push(f);
const routes = new Set(pages.map((f) => '/' + f.replace(/index\.html$/, '').replace(/\.html$/, '/')));
for (const f of pages) {
  const html = await readFile(join(DIST, f), 'utf8');
  const doc = parse(html);
  const where = `/${f}`;
  for (const el of doc.querySelectorAll('script[src], link[href], img[src], source[src], iframe')) {
    const u = el.getAttribute('src') ?? el.getAttribute('href') ?? '';
    const rel = el.getAttribute('rel') ?? '';
    if (el.tagName === 'LINK' && /canonical|alternate/.test(rel)) continue;
    if (/^(https?:)?\/\//.test(u)) errors.push(`${where}: zasób z zewnętrznej domeny: ${u}`);
  }
  if (!doc.querySelector('html')?.getAttribute('lang')) errors.push(`${where}: brak lang`);
  if (!doc.querySelector('title')?.text.trim()) errors.push(`${where}: brak <title>`);
  const d = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  if (d.length < 50 || d.length > 300) errors.push(`${where}: opis meta ma ${d.length} znaków`);
  if (!f.startsWith('404') && !doc.querySelector('link[rel="canonical"]')) errors.push(`${where}: brak canonical`);
  const h1 = doc.querySelectorAll('h1').length; if (h1 !== 1) errors.push(`${where}: ${h1} nagłówków H1`);
  const ids = new Map(); for (const el of doc.querySelectorAll('[id]')) { const id = el.getAttribute('id'); ids.set(id, (ids.get(id) ?? 0) + 1); }
  for (const [id, n] of ids) if (n > 1) errors.push(`${where}: identyfikator #${id} występuje ${n} razy`);
  const text = doc.querySelector('body')?.structuredText ?? '';
  for (const re of FORBIDDEN) { const m = text.match(re); if (m) errors.push(`${where}: zakazane słowo „${m[0]}”`); }
  for (const a of doc.querySelectorAll('a[href]')) {
    const h = a.getAttribute('href');
    if (!h.startsWith('/') || h.startsWith('//')) continue;
    const path = h.split('#')[0];
    if (!path) continue;
    if (!routes.has(path) && !existsSync(join(DIST, path))) errors.push(`${where}: martwy link ${h}`);
  }
}
if (errors.length) { console.error(`gates: ${errors.length} błąd(ów)\n` + errors.map((e) => ' - ' + e).join('\n')); process.exit(1); }
console.log(`gates: OK (${pages.length} stron)`);
