import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['/', '/jak-dziala-system/', '/metodologia/', '/o-projekcie/', '/prywatnosc/'];

for (const path of PAGES) {
  test(`${path}: brak błędów, brak poziomego przewijania na telefonie, dostępność`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('kalkulator: pełna ścieżka z zgadywaniem, wynik i wszystkie sekcje', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await page.fill('#amount', '8000');
  await page.click('button[type=submit]');
  await expect(page.locator('#zgadnij')).toBeVisible();
  await page.click('#guess-go');
  await expect(page.locator('#results')).toBeVisible();
  await expect(page.locator('#big-result')).toContainText('zł');
  await expect(page.locator('#coins .coin')).toHaveCount(100);
  await expect(page.locator('#receipt')).toContainText('RAZEM DANINY');
  await expect(page.locator('#cal-days, #cal .cal-days i')).toHaveCount(365);
  await expect(page.locator('#where li')).toHaveCount(12);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
  await page.screenshot({ path: 'reports/mobile-result.png', fullPage: true });
});

test('link z ustawieniami odtwarza wynik; przełącznik ZUS zmienia udział', async ({ page }) => {
  await page.goto('/#amount=8000&amountIs=gross&contract=uop&zusAsTax=1');
  await expect(page.locator('#results')).toBeVisible();
  const a = await page.locator('#st-pct').textContent();
  await page.locator('#zusAsTax').uncheck();
  const b = await page.locator('#st-pct').textContent();
  expect(parseInt(a!)).toBeGreaterThan(parseInt(b!));
  await expect(page.locator('#receipt')).toContainText('ODŁOŻONE NA TWOJĄ EMERYTURĘ');
});

test('B2B ryczałt i zlecenie studenta liczą się bez błędów', async ({ page }) => {
  await page.goto('/#amount=15000&contract=b2b&b2bTax=ryczalt&ryczaltRate=0.12&b2bZus=duzy&zusAsTax=1');
  await expect(page.locator('#receipt')).toContainText('PŁACISZ SAM');
  await page.goto('/#amount=3000&amountIs=gross&contract=zlecenie&under26=1&student=1&zusAsTax=1');
  await page.reload();
  await expect(page.locator('#receipt')).toContainText('W CENACH ZAKUPÓW');
  await expect(page.locator('#receipt')).not.toContainText('Składka emerytalna');
});

test('ciemny i jasny motyw: wynik czytelny (axe kontrast)', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/#amount=8000&amountIs=gross&contract=uop&zusAsTax=1');
  await expect(page.locator('#results')).toBeVisible();
  const axe = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`)).toEqual([]);
  await page.screenshot({ path: 'reports/light-result.png', fullPage: false });
});
