/**
 * Zapisuje dist/_headers dla Cloudflare Workers Static Assets: ścisła CSP (skrypty tylko z własnej domeny
 * albo inline przez hash), brak zasobów zewnętrznych, brak ramek.
 */
import { readFile, writeFile, glob } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const DIST = new URL('../dist/', import.meta.url).pathname;
const INLINE = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;
const hashes = new Set();
for await (const file of glob('**/*.html', { cwd: DIST })) {
  const html = await readFile(join(DIST, file), 'utf8');
  for (const [, body] of html.matchAll(INLINE)) if (body.trim()) hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
}
const csp = [
  "default-src 'self'", `script-src 'self' ${[...hashes].join(' ')}`.trim(), "script-src-attr 'none'", "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:", "font-src 'self'", "connect-src 'self'", "frame-src 'none'", "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", 'upgrade-insecure-requests',
].join('; ');
const noindex = process.env.PUBLIC_INDEXABLE === 'true' ? '' : '  X-Robots-Tag: noindex, nofollow\n';
await writeFile(join(DIST, '_headers'), `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=31536000
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin
${noindex}
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
`);
console.log(`headers: ${hashes.size} inline script hash(es), ${noindex ? 'noindex' : 'indexable'}`);
