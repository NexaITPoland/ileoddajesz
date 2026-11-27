/**
 * Podatki ukryte w cenach: VAT, akcyza i opłaty celowe. Dwa poziomy dokładności:
 * 1) domyślnie koszyk średni z badania GUS „Budżety gospodarstw domowych” dla kwintyla dochodu,
 * 2) jeśli użytkownik poda własne zużycie (paliwo, papierosy, alkohol, prąd), te pozycje liczymy dokładnie
 *    ze stawek ustawowych, a resztę koszyka proporcjonalnie zmniejszamy, żeby suma wydatków się zgadzała.
 */
import type { Rates } from './types';
import { r2 } from './labor';

export interface BasketInput {
  /** Wydatki rocznie (zł). Gdy brak, liczone z dochodu netto i stopy oszczędzania GUS. */
  spendingAnnual?: number;
  /** Część dochodu netto odkładana (0–0,9). Gdy brak, średnia GUS dla kwintyla. */
  savingsRate?: number;
  fuelLitersMonthly?: number; fuelType?: 'petrol' | 'diesel';
  packsWeekly?: number;
  beersWeekly?: number; vodkaMonthly?: number; wineMonthly?: number;
  kwhMonthly?: number;
  persons: number;
}

export interface ConsumptionLine { id: string; label: string; spend: number; vat: number; excise: number }
export interface ConsumptionResult {
  quintile: number; spending: number; savings: number; savingsRate: number;
  lines: ConsumptionLine[]; vat: number; excise: number;
}

/** Podatki w jednostce produktu: VAT jako część ceny brutto, akcyza i opłaty kwotowe. */
export function fuelUnit(R: Rates, type: 'petrol' | 'diesel', regime: 'current' | 'standard' = 'current') {
  const f = R.fuel;
  const cur = type === 'petrol' ? f.petrolPrice : f.dieselPrice;
  const exCur = (type === 'petrol' ? f.petrolExcise : f.dieselExcise) / 1000;
  const fee = (type === 'petrol' ? f.petrolFuelFee : f.dieselFuelFee) / 1000 + f.emissionFee / 1000;
  if (regime === 'current') {
    const vat = cur * f.vatRate / (1 + f.vatRate);
    return { price: cur, vat: r2(vat), excise: r2(exCur), fees: r2(fee), total: r2(vat + exCur + fee) };
  }
  // Te same ceny „przed podatkami”, ale ze standardową akcyzą i VAT 23% – jak bez czasowej obniżki.
  const pre = cur / (1 + f.vatRate) - exCur - fee;
  const ex = (type === 'petrol' ? f.petrolExciseStandard : f.dieselExciseStandard) / 1000;
  const price = (pre + ex + fee) * (1 + f.standardVatRate);
  const vat = price * f.standardVatRate / (1 + f.standardVatRate);
  return { price: r2(price), vat: r2(vat), excise: r2(ex), fees: r2(fee), total: r2(vat + ex + fee) };
}

export function packUnit(R: Rates) {
  const t = R.tobacco; const price = t.packPrice;
  const perPack = Math.max(t.perThousand / 50 + price * t.adValorem, t.minimumPerThousand / 50);
  const vat = price * 23 / 123;
  return { price, vat: r2(vat), excise: r2(perPack), total: r2(vat + perPack) };
}

/** Akcyza na alkohol: spirytus wg hl 100% alkoholu, piwo wg hl i stopnia Plato, wino wg hl. */
export function alcoholUnit(R: Rates, kind: 'vodka' | 'beer' | 'wine', priceOverride?: number) {
  const a = R.alcohol;
  if (kind === 'vodka') {
    const price = priceOverride ?? a.vodkaPrice; const excise = a.spiritsPerHl * 0.005 * 0.4; // 0,5 l, 40%
    return { price, vat: r2(price * 23 / 123), excise: r2(excise), total: r2(price * 23 / 123 + excise) };
  }
  if (kind === 'beer') {
    const price = priceOverride ?? a.beerPrice; const excise = a.beerPerHlPlato * 0.005 * 12; // 0,5 l, 12° Plato
    return { price, vat: r2(price * 23 / 123), excise: r2(excise), total: r2(price * 23 / 123 + excise) };
  }
  const price = priceOverride ?? a.winePrice; const excise = a.winePerHl * 0.0075; // 0,75 l
  return { price, vat: r2(price * 23 / 123), excise: r2(excise), total: r2(price * 23 / 123 + excise) };
}

/** Rachunek za prąd: akcyza 5 zł/MWh, VAT 23%, opłata mocowa (ryczałt), OZE i kogeneracyjna (za kWh). */
export function electricityMonthly(R: Rates, kwh: number, pricePerKwh?: number) {
  const e = R.electricity;
  // Opłata mocowa: ryczałt miesięczny zależny od rocznego zużycia (progi URE).
  const yearly = kwh * 12;
  // Progi URE 58/2025: poniżej 500 kWh; od 500 do 1200 kWh włącznie; powyżej 1200 do 2800 kWh; powyżej 2800 kWh.
  const [b1, b2, b3] = e.capacityBandsKwhYear;
  const band = yearly < b1 ? 0 : yearly <= b2 ? 1 : yearly <= b3 ? 2 : 3;
  const capacity = e.capacityFees[band];
  const bill = kwh * (pricePerKwh ?? e.pricePerKwh) + capacity * 1.23;
  const vat = bill * 23 / 123;
  const excise = kwh * e.exciseMwh / 1000;
  const levies = capacity + kwh * (e.ozePerKwh + e.cogenPerKwh);
  return { bill: r2(bill), vat: r2(vat), excise: r2(excise), levies: r2(levies), capacity };
}

export function quintileFor(perCapitaMonthlyNet: number, R: Rates): number {
  const q = R.basket.quintileIncome; // średni dochód rozporządzalny na osobę w kwintylach 1..5
  for (let i = 0; i < q.length - 1; i++) if (perCapitaMonthlyNet < (q[i] + q[i + 1]) / 2) return i + 1;
  return q.length;
}

export function computeConsumption(netAnnual: number, input: BasketInput, R: Rates): ConsumptionResult {
  const persons = Math.max(1, input.persons);
  const quintile = quintileFor(netAnnual / 12 / persons, R);
  const savingsRate = input.savingsRate ?? R.basket.savingsRate[quintile - 1];
  const spending = r2(input.spendingAnnual ?? Math.max(0, netAnnual * (1 - savingsRate)));
  const cats = R.basket.categories;

  // Pozycje podane przez użytkownika: liczymy dokładnie i odejmujemy ich średnią z koszyka.
  const exact: { catId: string; line: ConsumptionLine }[] = [];
  if (input.fuelLitersMonthly != null) {
    const u = fuelUnit(R, input.fuelType ?? 'petrol'); const n = input.fuelLitersMonthly * 12;
    exact.push({ catId: 'fuel', line: { id: 'fuel', label: 'Paliwo', spend: r2(n * u.price), vat: r2(n * u.vat), excise: r2(n * (u.excise + u.fees)) } });
  }
  if (input.packsWeekly != null) {
    const u = packUnit(R); const n = input.packsWeekly * 52;
    exact.push({ catId: 'tobacco', line: { id: 'tobacco', label: 'Papierosy', spend: r2(n * u.price), vat: r2(n * u.vat), excise: r2(n * u.excise) } });
  }
  if (input.beersWeekly != null || input.vodkaMonthly != null || input.wineMonthly != null) {
    const b = alcoholUnit(R, 'beer'), v = alcoholUnit(R, 'vodka'), w = alcoholUnit(R, 'wine');
    const nb = (input.beersWeekly ?? 0) * 52, nv = (input.vodkaMonthly ?? 0) * 12, nw = (input.wineMonthly ?? 0) * 12;
    exact.push({ catId: 'alcohol', line: { id: 'alcohol', label: 'Alkohol', spend: r2(nb * b.price + nv * v.price + nw * w.price), vat: r2(nb * b.vat + nv * v.vat + nw * w.vat), excise: r2(nb * b.excise + nv * v.excise + nw * w.excise) } });
  }
  if (input.kwhMonthly != null) {
    const e = electricityMonthly(R, input.kwhMonthly);
    exact.push({ catId: 'electricity', line: { id: 'electricity', label: 'Prąd', spend: r2(e.bill * 12), vat: r2(e.vat * 12), excise: r2((e.excise + e.levies) * 12) } });
  }

  const overridden = new Set(exact.map((e) => e.catId));
  const exactSpend = exact.reduce((s, e) => s + e.line.spend, 0);
  const restShare = cats.filter((c) => !overridden.has(c.id)).reduce((s, c) => s + c.shares[quintile - 1], 0);
  const rest = Math.max(0, spending - exactSpend);

  const lines: ConsumptionLine[] = cats.map((c) => {
    const e = exact.find((x) => x.catId === c.id);
    if (e) return { ...e.line, label: c.label };
    const spend = restShare > 0 ? rest * c.shares[quintile - 1] / restShare : 0;
    return { id: c.id, label: c.label, spend: r2(spend), vat: r2(spend * c.vatShare), excise: r2(spend * c.exciseShare) };
  });
  const vat = r2(lines.reduce((s, l) => s + l.vat, 0));
  const excise = r2(lines.reduce((s, l) => s + l.excise, 0));
  const totalSpend = r2(lines.reduce((s, l) => s + l.spend, 0));
  return { quintile, spending: totalSpend, savings: r2(Math.max(0, netAnnual - totalSpend)), savingsRate, lines, vat, excise };
}
