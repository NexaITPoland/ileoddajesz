/**
 * Zrzuty ekranu do README (docs/screenshots). Wymaga działającego podglądu: npm run preview.
 * Uruchom: node scripts/screenshots.mjs
 */
import { chromium } from '@playwright/test';
const OUT = new URL('../docs/screenshots/', import.meta.url).pathname;
const URL_RES = 'http://localhost:4400/#amount=9317&amountIs=gross&contract=uop&zusAsTax=1&period=m';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const desk = await b.newPage({ viewport: { width: 1280, height: 860 }, colorScheme: 'light', deviceScaleFactor: 1 });
await desk.goto('http://localhost:4400/'); await desk.evaluate(() => document.fonts.ready);
await desk.screenshot({ path: OUT + 'start.png' });
await desk.goto(URL_RES); await desk.reload(); await desk.waitForSelector('#results:not([hidden])'); await desk.evaluate(() => document.fonts.ready); await desk.waitForTimeout(2200);
await desk.addStyleTag({ content: 'html{scroll-behavior:auto!important}.sticky{position:static!important}' });
for (const [id, name] of [['#wynik', 'wynik'], ['#droga', 'droga'], ['#paragon', 'paragon'], ['#kiedy', 'kiedy'], ['#kalendarz', 'kalendarz'], ['#na-co', 'na-co'], ['#produkty', 'produkty']]) {
  await desk.locator(id).screenshot({ path: OUT + name + '.png' });
}
await desk.goto('http://localhost:4400/jak-dziala-system/'); await desk.evaluate(() => document.fonts.ready);
await desk.locator('.map').screenshot({ path: OUT + 'schemat.png' });
const mob = await b.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'dark', deviceScaleFactor: 2 });
await mob.goto(URL_RES); await mob.waitForSelector('#results:not([hidden])'); await mob.waitForTimeout(2200);
await mob.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, document.querySelector('#wynik').getBoundingClientRect().top + scrollY - 120); });
await mob.waitForTimeout(300); await mob.screenshot({ path: OUT + 'mobile.png' });
await b.close(); console.log('screenshots ok');
