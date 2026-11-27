/**
 * Test „od deski do deski”: każda kontrolka na stronie musi coś zmienić.
 * Uruchamiany na telefonie i na desktopie. Zbiera błędy konsoli i sprawdza zdublowane identyfikatory po wyrenderowaniu.
 */
import { test, expect, type Page } from '@playwright/test';

const VIEWPORTS = [{ name: 'telefon', width: 390, height: 844 }, { name: 'desktop', width: 1280, height: 900 }];

async function noDuplicateIds(page: Page) {
  const dups = await page.evaluate(() => {
    const m = new Map<string, number>();
    document.querySelectorAll('[id]').forEach((el) => m.set(el.id, (m.get(el.id) ?? 0) + 1));
    return [...m].filter(([, n]) => n > 1).map(([id, n]) => `${id}×${n}`);
  });
  expect(dups, 'zdublowane identyfikatory').toEqual([]);
}
const txt = (page: Page, sel: string) => page.locator(sel).innerText();

for (const vp of VIEWPORTS) {
  test(`kalkulator – każda kontrolka działa (${vp.name})`, async ({ page, context }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');

    // Formularz: domyślnie „na rękę”, wpisanie kwoty, wszystkie formy pracy i opcje.
    await expect(page.locator('input[name=amountIs][value=net]')).toBeChecked();
    await page.fill('#amount', '6000');
    await page.click('label:has(input[value=b2b]) span');
    await expect(page.locator('#b2bTax')).toBeVisible();
    await page.selectOption('#b2bTax', 'ryczalt');
    await expect(page.locator('#ryczaltRate')).toBeVisible();
    await page.selectOption('#ryczaltRate', '0.085');
    await page.selectOption('#b2bZus', 'preferencyjny');
    await page.fill('#b2bCosts', '500');
    await page.click('label:has(input[value=zlecenie]) span');
    await expect(page.locator('#student')).toBeVisible();
    await page.check('#student');
    await page.check('#under26');
    await page.uncheck('#under26');
    await page.uncheck('#student');
    await page.click('label:has(input[value=uop]) span');
    await page.click('label:has(input[name=amountIs][value=gross]) span');
    await page.click('label:has(input[name=amountIs][value=net]) span');

    // Zgadywanie: suwak + Sprawdź.
    await page.click('button[type=submit]');
    await expect(page.locator('#zgadnij')).toBeVisible();
    await page.locator('#guess').fill('30');
    await expect(page.locator('#guess-out')).toHaveText('30 zł');
    await page.click('#guess-go');
    await expect(page.locator('#zgadnij')).toBeHidden();
    await expect(page.locator('#guess-cmp')).toContainText('Strzelałeś 30 zł');
    await expect(page.locator('#three')).toContainText('6000');
    await noDuplicateIds(page);

    // Okres miesiąc/rok (pasek na desktopie, przy paragonie zawsze).
    const before = await txt(page, '#st-amount');
    await page.locator('.period-inline [data-period=y]').click();
    await expect(page.locator('#st-amount')).not.toHaveText(before);
    await expect(page.locator('#receipt')).toContainText(`okres: rok`);
    await page.locator('.period-inline [data-period=m]').click();
    await expect(page.locator('#st-amount')).toHaveText(before);
    if (vp.width > 700) { await page.locator('.sticky [data-period=y]').click(); await expect(page.locator('#st-amount')).not.toHaveText(before); await page.locator('.sticky [data-period=m]').click(); }

    // Przełącznik składek emerytalnych.
    const pct1 = await txt(page, '#st-pct');
    await page.locator('#zusAsTax').click({ force: true });
    await expect(page.locator('#st-pct')).not.toHaveText(pct1);
    await expect(page.locator('#receipt')).toContainText('ODŁOŻONE NA TWOJĄ EMERYTURĘ');
    await expect(page.locator('#guess-cmp')).toContainText('bez składek emerytalnych i rentowych');
    await page.locator('#zusAsTax').click({ force: true });
    await expect(page.locator('#st-pct')).toHaveText(pct1);

    // Rozwijane wyjaśnienia.
    for (const d of await page.locator('#results details.why:visible').all()) { await d.locator('summary').click(); await expect(d).toHaveAttribute('open', ''); }

    // Produkty: przycisk na dole listy odsłania wszystkie karty.
    await expect(page.locator('#prod-more')).toHaveCount(1);
    const hiddenCount = await page.locator('#prod-list .prod-i[data-more]').count();
    expect(hiddenCount).toBeGreaterThan(0);
    await expect(page.locator('#prod-list .prod-i[data-more]').first()).toBeHidden();
    await page.locator('#prod-more').click();
    for (const c of await page.locator('#prod-list .prod-i').all()) await expect(c).toBeVisible();
    await expect(page.locator('#prod-more')).toBeHidden();

    // „Pokaż więcej” odsłania dalsze sekcje.
    await expect(page.locator('#kiedy')).toBeHidden();
    await page.click('#more-btn');
    for (const id of ['#kiedy', '#kalendarz', '#na-co', '#w-zamian', '#dopasuj']) await expect(page.locator(id)).toBeVisible();
    await expect(page.locator('#where li')).toHaveCount(12);
    for (const d of await page.locator('.tl-more').all()) { await d.locator('summary').click(); await expect(d).toHaveAttribute('open', ''); }

    // Dopasuj: każde pole zmienia wynik.
    const fields: [string, string][] = [['#persons', '3'], ['#children', '2'], ['#partner', '4000'], ['#fuel', '80'], ['#packs', '5'], ['#kwh', '250'], ['#beers', '6'], ['#vodka', '2'], ['#wine', '2'], ['#m2', '60'], ['#savings', '20'], ['#capital', '2000']];
    for (const [sel, val] of fields) {
      const t0 = await txt(page, '#st-amount') + await txt(page, '#fit-note') + await txt(page, '#receipt');
      await page.fill(sel, val);
      await expect.poll(async () => await txt(page, '#st-amount') + await txt(page, '#fit-note') + await txt(page, '#receipt'), { message: `pole ${sel} nie zmienia wyniku` }).not.toBe(t0);
    }
    const tf = await txt(page, '#receipt');
    await page.selectOption('#fuelType', 'diesel');
    await expect.poll(() => txt(page, '#receipt')).not.toBe(tf);
    await page.check('#rtv');
    await expect(page.locator('#receipt')).toContainText('Abonament RTV');

    // Udostępnianie: obrazek i link.
    const dl = page.waitForEvent('download');
    await page.click('#share-img');
    expect((await dl).suggestedFilename()).toBe('ile-oddaje.png');
    await page.click('#share-link');
    await expect(page.locator('#share-msg')).toContainText(/skopiowany|Skopiuj/);

    // Link z ustawieniami odtwarza ten sam wynik w nowej karcie.
    const url = page.url(); const total = await txt(page, '#st-amount');
    const p2 = await context.newPage(); await p2.setViewportSize({ width: vp.width, height: vp.height });
    await p2.goto(url); await expect(p2.locator('#st-amount')).toHaveText(total);
    await p2.close();

    // „Dopasuj” na pasku (desktop) przewija do formularza.
    if (vp.width > 700) { await page.evaluate(() => scrollTo(0, 0)); await page.click('.sticky a[href="#dopasuj"]'); await expect(page.locator('#dopasuj')).toBeInViewport(); }

    await noDuplicateIds(page);
    expect(errors).toEqual([]);
  });
}

test('strona „Jak działa system”: quiz, rozwijane, linki', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/jak-dziala-system/');
  const qs = await page.locator('.qz').all();
  for (const q of qs) { await q.locator('.qz-b').first().click(); await expect(q.locator('.qz-why')).toBeVisible(); }
  await expect(page.locator('#qz-score')).toContainText(`z ${qs.length}`);
  await noDuplicateIds(page);
  expect(errors).toEqual([]);
});

test('wszystkie linki wewnętrzne działają', async ({ page, request }) => {
  for (const path of ['/', '/jak-dziala-system/', '/metodologia/', '/o-projekcie/', '/prywatnosc/']) {
    await page.goto(path);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!.split('#')[0]))]);
    for (const h of hrefs) if (h) expect((await request.get(h)).status(), `${path} → ${h}`).toBe(200);
  }
});
