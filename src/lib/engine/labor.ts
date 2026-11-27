/**
 * Podatki i składki od pracy, w skali roku. Wzory wynikają wprost z ustaw:
 * PIT (ustawa z 26.07.1991 o podatku dochodowym od osób fizycznych),
 * składki społeczne (ustawa z 13.10.1998 o systemie ubezpieczeń społecznych),
 * zdrowotna (ustawa z 27.08.2004 o świadczeniach opieki zdrowotnej…),
 * FP i FGŚP (ustawy o rynku pracy i o ochronie roszczeń pracowniczych).
 * Wszystkie kwoty: złote, rok kalendarzowy. Uproszczenia są opisane na stronie „Metodologia”.
 */
import type { Rates } from './types';

export const r2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;
export const r0 = (x: number) => Math.round(x);

export type Contract = 'uop' | 'zlecenie' | 'b2b';
export type B2BTax = 'liniowy' | 'skala' | 'ryczalt';
export type B2BZus = 'duzy' | 'preferencyjny' | 'ulga';

export interface LaborInput {
  contract: Contract;
  /** Miesięczne wynagrodzenie brutto (UoP, zlecenie) albo miesięczny przychód z faktur netto (B2B). */
  monthly: number;
  under26: boolean;
  /** Umowa zlecenie: student do 26 lat (bez ZUS i PIT). */
  student?: boolean;
  /** UoP: podwyższone koszty uzyskania przychodu (dojazd z innej miejscowości). */
  kupElevated?: boolean;
  /** Zlecenie: dobrowolne chorobowe. */
  sickness?: boolean;
  b2bTax?: B2BTax; b2bZus?: B2BZus; ryczaltRate?: number; b2bCostsMonthly?: number; b2bSickness?: boolean;
  /** Liczba dzieci, na które przysługuje ulga prorodzinna. */
  children?: number;
  /** Łączny dochód małżonków (do limitu ulgi na jedno dziecko). Gdy brak – dochód tej osoby (samotny rodzic). */
  jointIncome?: number;
}

/** Jedna pozycja „paragonu”: kto płaci, komu, kiedy. */
export interface Item {
  id: ItemId; amount: number;
}
export type ItemId =
  | 'zus_emer_er' | 'zus_rent_er' | 'zus_wyp' | 'fp' | 'fgsp'
  | 'zus_emer_emp' | 'zus_rent_emp' | 'zus_chor' | 'health' | 'pit'
  | 'b2b_emer' | 'b2b_rent' | 'b2b_chor' | 'b2b_wyp' | 'b2b_fp';

export interface LaborResult {
  input: LaborInput;
  /** Pełny koszt pracy (brutto-brutto). Dla B2B: przychód minus koszty firmowe. */
  laborCost: number;
  gross: number;
  /** Na rękę w roku, po wszystkich podatkach i składkach. */
  net: number;
  employer: Item[];
  employee: Item[];
  pitBase: number;
  /** Dochód do celów PIT (przychód minus koszty i składki społeczne). */
  pitIncome: number;
  childReliefUsed: number;
  /** Część ulgi prorodzinnej zwracana ponad podatek (do wysokości składek). */
  childRefund: number;
}

const sum = (items: Item[]) => r2(items.reduce((s, i) => s + i.amount, 0));
export const total = sum;

/** PIT według skali dla rocznej podstawy (już zaokrąglonej do pełnych złotych). */
export function scaleTax(base: number, R: Rates): number {
  const p = R.pit;
  if (base <= 0) return 0;
  const t = base <= p.threshold
    ? base * p.rate1 - p.reducingAnnual
    : p.threshold * p.rate1 - p.reducingAnnual + (base - p.threshold) * p.rate2;
  return Math.max(0, r0(t));
}

function solidarity(income: number, R: Rates) {
  return income > R.pit.solidarityThreshold ? r0((income - R.pit.solidarityThreshold) * R.pit.solidarityRate) : 0;
}

/**
 * Ulga prorodzinna (art. 27f): kwoty na kolejne dzieci. Przy jednym dziecku limit 112 000 zł dotyczy łącznego dochodu
 * małżonków albo samotnego rodzica (56 000 zł dla osoby niebędącej w małżeństwie ani samotnym rodzicem – tego przypadku nie modelujemy).
 */
export function childRelief(children: number, income: number, R: Rates): number {
  if (!children) return 0;
  if (children === 1 && income > R.pit.childReliefOneChildIncomeLimit) return 0;
  let s = 0;
  for (let i = 0; i < children; i++) s += R.pit.childRelief[Math.min(i, R.pit.childRelief.length - 1)];
  return r2(s);
}

/** Podstawa składek emerytalnej i rentowej z uwzględnieniem rocznego limitu (30-krotność). */
function cappedBase(annualGross: number, R: Rates) { return Math.min(annualGross, R.zus.annualCap); }

export function computeLabor(input: LaborInput, R: Rates): LaborResult {
  if (input.contract === 'b2b') return computeB2B(input, R);
  const G = r2(Math.max(0, input.monthly) * 12);
  const z = R.zus, p = R.pit;
  const isZlecenie = input.contract === 'zlecenie';
  const studentFree = isZlecenie && input.student && input.under26;

  if (studentFree) {
    return { input, laborCost: G, gross: G, net: G, employer: [], employee: [], pitBase: 0, pitIncome: 0, childReliefUsed: 0, childRefund: 0 };
  }

  const capped = cappedBase(G, R);
  const employee: Item[] = [
    { id: 'zus_emer_emp', amount: r2(capped * z.emerEmp) },
    { id: 'zus_rent_emp', amount: r2(capped * z.rentEmp) },
    { id: 'zus_chor', amount: !isZlecenie || input.sickness ? r2(G * z.chor) : 0 },
  ];
  const social = sum(employee);
  const health = r2((G - social) * R.health.rate);

  // Pracodawca. FP i FS płaci się, gdy podstawa w miesiącu jest co najmniej równa płacy minimalnej
  // (ustawa o rynku pracy i służbach zatrudnienia, art. 259–260). Podstawą FP, FS i FGŚP jest podstawa składek
  // emerytalno-rentowych, więc również ona podlega rocznemu limitowi (ustawa budżetowa na 2026 r., art. 25–27).
  const fpDue = input.monthly >= R.wages.minimum;
  const employer: Item[] = [
    { id: 'zus_emer_er', amount: r2(capped * z.emerEr) },
    { id: 'zus_rent_er', amount: r2(capped * z.rentEr) },
    { id: 'zus_wyp', amount: r2(G * z.wyp) },
    { id: 'fp', amount: fpDue ? r2(capped * z.fp) : 0 },
    { id: 'fgsp', amount: r2(capped * z.fgsp) },
  ];

  // PIT roczny (zeznanie PIT-37). Ulga dla młodych zwalnia przychód do limitu; składki od zwolnionej części nie są odliczane.
  const exempt = input.under26 ? Math.min(G, p.youngLimit) : 0;
  const taxable = G - exempt;
  const share = G > 0 ? taxable / G : 0;
  const socialDed = social * share;
  const kup = isZlecenie
    ? (taxable - socialDed) * p.kupZlecenie
    : Math.min(taxable, input.kupElevated ? p.kupAnnualElevated : p.kupAnnual);
  const income = Math.max(0, taxable - socialDed - kup);
  const base = r0(income);
  let pit = scaleTax(base, R) + solidarity(income, R);
  const relief = childRelief(input.children ?? 0, input.jointIncome ?? income, R);
  const used = Math.min(relief, pit);
  pit = r0(pit - used);
  // Nadwyżkę ulgi urząd zwraca do wysokości zapłaconych składek społecznych i zdrowotnej (art. 27f ust. 8–9).
  const refund = r2(Math.min(relief - used, social + health));

  employee.push({ id: 'health', amount: health }, { id: 'pit', amount: pit });
  const gross = G;
  const net = r2(G - sum(employee) + refund);
  return { input, laborCost: r2(G + sum(employer)), gross, net, employer, employee, pitBase: base, pitIncome: r2(income), childReliefUsed: used, childRefund: refund };
}

function computeB2B(input: LaborInput, R: Rates): LaborResult {
  const revenue = r2(Math.max(0, input.monthly) * 12);
  const costs = r2(Math.max(0, input.b2bCostsMonthly ?? 0) * 12);
  const zus = input.b2bZus ?? 'duzy';
  const tax = input.b2bTax ?? 'liniowy';
  const base = zus === 'duzy' ? R.b2b.duzyBase : zus === 'preferencyjny' ? R.b2b.prefBase : 0;
  const z = R.zus;
  const sick = input.b2bSickness ?? true;
  // Przedsiębiorca płaci obie części składki emerytalnej i rentowej sam (19,52% i 8%).
  const m = (rate: number) => r2(base * rate) * 12;
  const employee: Item[] = [
    { id: 'b2b_emer', amount: r2(m(z.emerEmp + z.emerEr)) },
    { id: 'b2b_rent', amount: r2(m(z.rentEmp + z.rentEr)) },
    { id: 'b2b_chor', amount: sick ? r2(m(z.chor)) : 0 },
    { id: 'b2b_wyp', amount: r2(m(z.wyp)) },
    // FP nie jest należny przy podstawie niższej niż płaca minimalna (preferencyjny ZUS).
    { id: 'b2b_fp', amount: zus === 'duzy' ? r2(m(z.fp)) : 0 },
  ];
  const social = r2(employee.slice(0, 4).reduce((s, i) => s + i.amount, 0));
  const fp = employee[4].amount;
  const h = R.health;
  const income = Math.max(0, revenue - costs - fp - social);
  // Minimalna składka zdrowotna: styczeń 2026 jeszcze wg zasad roku składkowego 2025, od lutego nowa kwota.
  const minAnnual = r2(h.minMonthlyJanuary + 11 * h.minMonthly);
  let health = 0, pit = 0, used = 0, refund = 0;
  if (tax === 'skala') {
    health = Math.max(r2(income * h.rate), minAnnual);
    pit = scaleTax(r0(income), R) + solidarity(income, R);
    // Ulga prorodzinna przysługuje także przy działalności na skali, ze zwrotem nadwyżki do wysokości składek (art. 27f ust. 8–9).
    const relief = childRelief(input.children ?? 0, input.jointIncome ?? income, R);
    used = Math.min(relief, pit); pit = r0(pit - used);
    refund = r2(Math.min(relief - used, social + health));
  } else if (tax === 'liniowy') {
    health = Math.max(r2(income * h.linearRate), minAnnual);
    const ded = Math.min(health, h.linearDeductLimit);
    const b = r0(Math.max(0, income - ded));
    // Podstawa daniny solidarnościowej jest pomniejszona o odliczoną składkę zdrowotną (art. 30h ust. 2).
    pit = r0(b * R.pit.linearRate) + solidarity(income - ded, R);
  } else {
    // Ryczałt: składka zdrowotna zależy od rocznego przychodu (styczeń wg kwot roku składkowego 2025), połowa zapłaconej składki obniża przychód.
    const band = revenue <= h.ryczaltBands[0] ? 0 : revenue <= h.ryczaltBands[1] ? 1 : 2;
    health = r2(h.ryczaltMonthlyJanuary[band] + 11 * h.ryczaltMonthly[band]);
    const rate = input.ryczaltRate ?? 0.12;
    const b = r0(Math.max(0, revenue - social - health * 0.5));
    pit = r0(b * rate);
  }
  employee.push({ id: 'health', amount: health }, { id: 'pit', amount: pit });
  const laborCost = r2(revenue - costs);
  const net = r2(laborCost - sum(employee) + refund);
  return { input, laborCost, gross: laborCost, net, employer: [], employee, pitBase: r0(income), pitIncome: r2(income), childReliefUsed: used, childRefund: refund };
}

/** Odwrotność: jaka pensja brutto (lub przychód B2B) daje zadane średnie miesięczne „na rękę”. */
export function grossFromNet(netMonthly: number, base: Omit<LaborInput, 'monthly'>, R: Rates): number {
  let lo = 0, hi = Math.max(1000, netMonthly * 3);
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const n = computeLabor({ ...base, monthly: mid }, R).net / 12;
    if (n < netMonthly) lo = mid; else hi = mid;
  }
  return r2(hi);
}

/**
 * Pierwsza wypłata w roku (styczeń) na umowie o pracę, liczona jak na pasku płacowym:
 * zaliczka PIT zaokrąglona do pełnych złotych, z kwotą zmniejszającą 300 zł (PIT-2).
 * Służy do porównania z popularnymi kalkulatorami wynagrodzeń.
 */
export function januaryPayslip(monthly: number, R: Rates, opts: { under26?: boolean; kupElevated?: boolean } = {}) {
  const z = R.zus;
  const emer = r2(monthly * z.emerEmp), rent = r2(monthly * z.rentEmp), chor = r2(monthly * z.chor);
  const social = r2(emer + rent + chor);
  const health = r2((monthly - social) * R.health.rate);
  const kup = opts.kupElevated ? R.pit.kupMonthlyElevated : R.pit.kupMonthly;
  // W styczniu przychód narastająco nie przekracza limitu ulgi dla młodych, o ile pensja miesięczna jest od niego niższa.
  const base = opts.under26 && monthly <= R.pit.youngLimit ? 0 : Math.max(0, r0(monthly - social - kup));
  const advance = base ? Math.max(0, r0(base * R.pit.rate1 - R.pit.reducingMonthly)) : 0;
  return { emer, rent, chor, social, health, base, advance, net: r2(monthly - social - health - advance) };
}
