/** Serves dist/ with Cloudflare-like clean URLs and the 404 page, for local preview and e2e tests. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
const DIST = new URL('../dist/', import.meta.url).pathname; const port = +(process.argv[2] ?? 4400);
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = join(DIST, p);
    if (existsSync(f) && (await stat(f)).isDirectory()) f = join(f, 'index.html');
    if (!existsSync(f)) { res.writeHead(404, { 'content-type': T['.html'] }); return res.end(await readFile(join(DIST, '404.html'))); }
    res.writeHead(200, { 'content-type': T[extname(f)] ?? 'application/octet-stream' }); res.end(await readFile(f));
  } catch (e) { res.writeHead(503); res.end(String(e)); }
}).listen(port, () => console.log(`dist on ${port}`));
