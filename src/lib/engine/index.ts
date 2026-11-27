/**
 * Składa wszystko w jeden wynik: praca + zakupy + opłaty lokalne, z przełącznikiem
 * „czy liczyć składki emerytalno-rentowe jako podatek”.
 */
import type { Rates } from './types';
import { computeLabor, grossFromNet, r2, type LaborInput, type LaborResult, type ItemId } from './labor';
import { computeConsumption, type BasketInput, type ConsumptionResult } from './consumption';

export * from './labor';
export * from './consumption';
export type { Rates } from './types';

export type Group = 'zus' | 'nfz' | 'pit' | 'vat' | 'akcyza' | 'lokalne' | 'fp';

export interface PersonInput extends Omit<LaborInput, 'monthly'> { amount: number; amountIs: 'gross' | 'net' }

export interface Input {
  people: PersonInput[];
  basket: BasketInput;
  /** Właściciel mieszkania/domu: podatek od nieruchomości od tej powierzchni (m²). */
  ownM2?: number;
  paysRtv?: boolean;
  /** Roczne odsetki/zyski kapitałowe (podatek Belki 19%). */
  capitalGains?: number;
  zusAsTax: boolean;
}

export interface Slice { id: string; group: Group; label: string; plain: string; amount: number; payer: 'employer' | 'you' | 'prices' | 'local'; pension?: boolean }

export interface Result {
  labor: LaborResult[];
  consumption: ConsumptionResult;
  /** Pełny koszt pracy wszystkich osób (brutto-brutto) = punkt wyjścia. */
  laborCost: number; gross: number; net: number;
  slices: Slice[];
  /** Suma danin przy bieżącym ustawieniu przełącznika ZUS. */
  taxes: number;
  /** Składki emerytalno-rentowe (część „odkładana” na przyszłą emeryturę). */
  pensionContrib: number;
  /** Ile realnie zostaje do Twojej dyspozycji (koszt pracy minus daniny). */
  kept: number;
  share: number;
  /** Mianownik udziału: koszt pracy + ewentualne zyski kapitałowe. */
  base: number;
}

export const LABELS: Record<ItemId, { label: string; plain: string; group: Group; pension?: boolean }> = {
  zus_emer_er: { label: 'Składka emerytalna (pracodawca)', plain: 'Na Twoją przyszłą emeryturę', group: 'zus', pension: true },
  zus_rent_er: { label: 'Składka rentowa (pracodawca)', plain: 'Na rentę, gdybyś nie mógł pracować', group: 'zus', pension: true },
  zus_wyp: { label: 'Składka wypadkowa', plain: 'Na wypadki przy pracy', group: 'zus' },
  fp: { label: 'Fundusz Pracy i Solidarnościowy', plain: 'Na zasiłki dla bezrobotnych i wsparcie osób z niepełnosprawnościami', group: 'fp' },
  fgsp: { label: 'Fundusz na pensje przy upadłości firmy', plain: 'Wypłaca pensje, gdy pracodawca zbankrutuje (FGŚP)', group: 'fp' },
  zus_emer_emp: { label: 'Składka emerytalna (Ty)', plain: 'Na Twoją przyszłą emeryturę', group: 'zus', pension: true },
  zus_rent_emp: { label: 'Składka rentowa (Ty)', plain: 'Na rentę, gdybyś nie mógł pracować', group: 'zus', pension: true },
  zus_chor: { label: 'Składka chorobowa', plain: 'Na L4 i zasiłek macierzyński', group: 'zus' },
  health: { label: 'Składka zdrowotna (NFZ)', plain: 'Na leczenie w publicznej służbie zdrowia', group: 'nfz' },
  pit: { label: 'Podatek dochodowy (PIT)', plain: 'Podatek od pensji: do budżetu państwa i samorządu', group: 'pit' },
  b2b_emer: { label: 'Składka emerytalna', plain: 'Na Twoją przyszłą emeryturę', group: 'zus', pension: true },
  b2b_rent: { label: 'Składka rentowa', plain: 'Na rentę, gdybyś nie mógł pracować', group: 'zus', pension: true },
  b2b_chor: { label: 'Składka chorobowa', plain: 'Na L4 (dobrowolna)', group: 'zus' },
  b2b_wyp: { label: 'Składka wypadkowa', plain: 'Na wypadki przy pracy', group: 'zus' },
  b2b_fp: { label: 'Fundusz Pracy i Solidarnościowy', plain: 'Na zasiłki dla bezrobotnych i wsparcie osób z niepełnosprawnościami', group: 'fp' },
};

function laborFor(p: PersonInput, R: Rates): LaborResult {
  const { amount, amountIs, ...rest } = p;
  const monthly = amountIs === 'gross' ? amount : grossFromNet(amount, rest, R);
  return computeLabor({ ...rest, monthly }, R);
}

export function compute(input: Input, R: Rates): Result {
  let labor = input.people.map((p) => laborFor(p, R));
  // Ulga na jedno dziecko: limit dochodu liczony łącznie dla małżonków (druga osoba w gospodarstwie traktowana jako małżonek).
  if (labor.length > 1 && (input.people[0].children ?? 0) === 1) {
    const joint = labor.reduce((s, l) => s + l.pitIncome, 0);
    labor = [laborFor({ ...input.people[0], jointIncome: joint }, R), ...labor.slice(1)];
  }
  const laborCost = r2(labor.reduce((s, l) => s + l.laborCost, 0));
  const gross = r2(labor.reduce((s, l) => s + l.gross, 0));
  const net = r2(labor.reduce((s, l) => s + l.net, 0));

  const slices: Slice[] = [];
  const add = (s: Slice) => { const x = slices.find((y) => y.id === s.id); if (x) x.amount = r2(x.amount + s.amount); else slices.push({ ...s }); };
  for (const l of labor) {
    for (const it of l.employer) if (it.amount) add({ id: it.id, ...LABELS[it.id], amount: it.amount, payer: 'employer' });
    for (const it of l.employee) if (it.amount) add({ id: it.id, ...LABELS[it.id], amount: it.amount, payer: 'you' });
  }
  // Zwrot ulgi prorodzinnej ponad podatek pomniejsza PIT (może dać wartość ujemną = państwo dopłaca).
  const refund = labor.reduce((s, l) => s + l.childRefund, 0);
  if (refund) { const p = slices.find((s) => s.id === 'pit'); if (p) p.amount = r2(p.amount - refund); else add({ id: 'pit', ...LABELS.pit, amount: -r2(refund), payer: 'you' }); }

  const capital = Math.max(0, input.capitalGains ?? 0);
  const belka = r2(capital * R.local.belka);
  const disposable = net + capital - belka;

  const local: Slice[] = [];
  if (input.ownM2) local.push({ id: 'property', group: 'lokalne', label: 'Podatek od nieruchomości', plain: 'Do gminy, za mieszkanie lub dom', amount: r2(input.ownM2 * R.local.propertyPerM2), payer: 'local' });
  local.push({ id: 'waste', group: 'lokalne', label: 'Opłata śmieciowa', plain: 'Do gminy, za odbiór odpadów', amount: r2(R.local.wastePerPerson * 12 * Math.max(1, input.basket.persons)), payer: 'local' });
  if (input.paysRtv) local.push({ id: 'rtv', group: 'lokalne', label: 'Abonament RTV', plain: 'Na media publiczne', amount: r2(R.local.rtvMonthly * 12), payer: 'local' });
  if (belka) local.push({ id: 'belka', group: 'pit', label: 'Podatek od odsetek („Belka”)', plain: '19% zysku z lokat i inwestycji', amount: belka, payer: 'local' });
  const localSpend = local.filter((s) => s.id !== 'belka').reduce((s, x) => s + x.amount, 0);

  const consumption = computeConsumption(Math.max(0, disposable - localSpend), input.basket, R);
  if (consumption.vat) slices.push({ id: 'vat', group: 'vat', label: 'VAT w cenach', plain: 'Ukryty w cenie prawie wszystkiego, co kupujesz', amount: consumption.vat, payer: 'prices' });
  if (consumption.excise) slices.push({ id: 'excise', group: 'akcyza', label: 'Akcyza w cenach', plain: 'Dodatkowy podatek na paliwo, prąd, alkohol, papierosy i słodkie napoje', amount: consumption.excise, payer: 'prices' });
  slices.push(...local);

  const pensionContrib = r2(slices.filter((s) => s.pension).reduce((s, x) => s + x.amount, 0));
  const counted = slices.filter((s) => input.zusAsTax || !s.pension);
  const taxes = r2(counted.reduce((s, x) => s + x.amount, 0));
  const base = r2(laborCost + capital);
  const kept = r2(base - taxes - (input.zusAsTax ? 0 : pensionContrib));
  return { labor, consumption, laborCost, gross, net, slices: input.zusAsTax ? slices : slices.filter((s) => !s.pension), taxes, pensionContrib, kept, share: base > 0 ? taxes / base : 0, base };
}

/** Osobisty „dzień wolności podatkowej”: dzień roku, do którego (statystycznie) pracujesz na daniny. */
export function freedomDay(share: number, year: number): Date {
  const days = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
  const d = new Date(Date.UTC(year, 0, 1));
  d.setUTCDate(d.getUTCDate() + Math.round(share * days));
  return d;
}

/** Godzina w 8-godzinnym dniu pracy (od 8:00), do której pracujesz na daniny. */
export function workClock(share: number): { h: number; m: number; minutes: number } {
  const minutes = Math.round(share * 480);
  return { h: 8 + Math.floor(minutes / 60), m: minutes % 60, minutes };
}

/** Rozkład kwoty na funkcje państwa wg struktury wydatków sektora finansów publicznych (COFOG). */
export function whereItGoes(amount: number, R: Rates) {
  return R.cofog.functions.map((f) => ({ ...f, amount: r2(amount * f.share) }));
}
