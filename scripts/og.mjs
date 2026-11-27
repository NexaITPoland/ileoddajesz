/** Generuje public/og.png (1200×630) – obrazek podglądu linku. Uruchom: node scripts/og.mjs */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
const font = (f) => `data:font/woff2;base64,${readFileSync(new URL(`../public/fonts/${f}`, import.meta.url)).toString('base64')}`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Sora;src:url(${font('sora-latin-wght-normal.woff2')});font-weight:100 800}
@font-face{font-family:Sora;src:url(${font('sora-latin-ext-wght-normal.woff2')});font-weight:100 800;unicode-range:U+0100-024F}
@font-face{font-family:Inter;src:url(${font('inter-latin-wght-normal.woff2')});font-weight:100 900}
@font-face{font-family:Inter;src:url(${font('inter-latin-ext-wght-normal.woff2')});font-weight:100 900;unicode-range:U+0100-024F}
body{margin:0;width:1200px;height:630px;background:#f7f4ee;font-family:Inter;color:#1c1a17;display:flex;align-items:center}
.w{padding:0 72px;width:100%}
.k{font:600 22px Inter;letter-spacing:.08em;text-transform:uppercase;color:#5d584f}
h1{font:700 76px/1.05 Sora;letter-spacing:-.02em;margin:18px 0 26px}
p{font:500 28px/1.4 Inter;color:#5d584f;margin:0 0 34px;max-width:900px}
.bar{display:flex;height:46px;border-radius:12px;overflow:hidden}
.bar i{display:block;height:100%}
.u{margin-top:26px;font:700 26px Sora;color:#2f4bdb}
</style></head><body><div class="w">
<div class="k">Kalkulator wszystkich danin · 2026</div>
<h1>Ile naprawdę oddajesz państwu?</h1>
<p>ZUS, NFZ, PIT, VAT i akcyza w cenach – policz w minutę, zobacz kiedy, gdzie i na co.</p>
<div class="bar"><i style="width:26%;background:#3d5bff"></i><i style="width:2%;background:#737a96"></i><i style="width:6%;background:#8b5cf6"></i><i style="width:6%;background:#e0662f"></i><i style="width:6%;background:#d39a00"></i><i style="width:2%;background:#c0457a"></i><i style="flex:1;background:#128a63"></i></div>
<div class="u">ileoddajesz.pl</div>
</div></body></html>`;
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html); await p.waitForTimeout(300);
await p.screenshot({ path: new URL('../public/og.png', import.meta.url).pathname });
await b.close(); console.log('og.png ok');
