/**
 * Prognoza emerytury z FUS w „nowym systemie” (osoby urodzone po 31.12.1948).
 * Wzór ustawowy (art. 26 ustawy o emeryturach i rentach z FUS):
 *   emerytura miesięczna = (zwaloryzowane składki na koncie + zwaloryzowany kapitał początkowy + środki na subkoncie)
 *                          ÷ średnie dalsze trwanie życia w miesiącach (tablice GUS) dla wieku przejścia na emeryturę.
 * Prognoza jest liczona w cenach stałych (w „dzisiejszych pieniądzach”) według założeń wariantu pośredniego
 * prognozy ZUS. Wszystkie parametry są w src/data/rates-2026.json (pole `pension`) i opisane na stronie Metodologia.
 */
import type { Rates } from './types';
import { r2, scaleTax, r0 } from './labor';

export interface PensionInput {
  /** Wiek dziś (lata). */
  age: number;
  sex: 'k' | 'm';
  /** Wiek rozpoczęcia pracy z obowiązkowymi składkami. */
  startAge: number;
  /** Miesięczna podstawa składek emerytalnych dziś (brutto na umowie o pracę; przy B2B – zadeklarowana podstawa). */
  monthlyBase: number;
  /** Wiek przejścia na emeryturę (domyślnie ustawowy). */
  retirementAge?: number;
  /**
   * Stan konta z „Informacji o stanie konta” w ZUS (suma: zwaloryzowane składki + kapitał początkowy + subkonto).
   * Gdy podany, zastępuje szacunek przeszłych składek.
   */
  knownBalance?: number;
  /** Lata przerw w opłacaniu składek do emerytury (np. urlopy bezpłatne, praca bez składek). */
  gapYears?: number;
}

export interface PensionYear { age: number; year: number; balance: number }
export interface PensionResult {
  retirementAge: number; retirementYear: number;
  balance: number; months: number;
  gross: number; net: number;
  /** Emerytura minimalna (w cenach dzisiejszych) w roku przejścia i czy przysługuje dopłata do minimum. */
  minimum: number; minimumApplies: boolean; stazYears: number; stazRequired: number;
  /** Ostatnia pensja brutto przed emeryturą (w cenach dzisiejszych) i stopa zastąpienia brutto. */
  finalWage: number; replacementRate: number;
  path: PensionYear[];
  contributionsPaid: number;
}

/** Ścieżka realnego wzrostu dla danego roku z tabeli przedziałów { from, to, value }. */
export function pathValue(path: { from: number; to: number; value: number }[], year: number): number {
  const p = path.find((x) => year >= x.from && year <= x.to) ?? path[path.length - 1];
  return p.value;
}

/** Średnie dalsze trwanie życia (miesiące) dla wieku i roku przejścia: tablica GUS z bieżącego roku + prognozowany przyrost. */
export function lifeExpectancy(age: number, year: number, R: Rates): number {
  const P = R.pension;
  const a = Math.max(P.lifeTableMinAge, Math.min(P.lifeTableMaxAge, Math.round(age)));
  const base = P.lifeTable[String(a)];
  const years = Math.max(0, year - P.lifeTableYear);
  return r2(base + years * P.lifeExpectancyGainMonthsPerYear);
}

/** Emerytura netto: składka zdrowotna 9% i PIT według skali (bez kosztów uzyskania, z kwotą zmniejszającą). */
export function pensionNet(grossMonthly: number, R: Rates): number {
  const health = r2(grossMonthly * R.health.rate);
  const pit = scaleTax(r0(grossMonthly * 12), R) / 12;
  return r2(grossMonthly - health - pit);
}

export function computePension(input: PensionInput, R: Rates): PensionResult {
  const P = R.pension;
  const now = R.meta.year;
  const retAge = input.retirementAge ?? P.retirementAge[input.sex];
  const yearsToGo = Math.max(0, Math.round(retAge - input.age));
  const retYear = now + yearsToGo;
  const rate = P.kontoRate + P.subkontoRate; // 19,52% łącznie (konto + subkonto, bez OFE)
  const capRatio = R.zus.annualCap / 12 / R.wages.forecastAverage; // limit 30-krotności jako krotność przeciętnej płacy

  // Przeszłe składki (gdy brak danych z ZUS): zakładamy tę samą pozycję płacową względem przeciętnej pensji,
  // czyli pensja rosła w przeszłości w tempie przeciętnego wynagrodzenia (historyczne realne wskaźniki z danych).
  let balance = 0;
  const path: PensionYear[] = [];
  const pastYears = Math.max(0, Math.round(input.age - input.startAge));
  if (input.knownBalance != null) {
    balance = input.knownBalance;
  } else {
    // Cofamy się w czasie: realna pensja k lat temu = dzisiejsza / iloczyn realnych wzrostów płac; składki waloryzowane do dziś.
    for (let k = pastYears; k >= 1; k--) {
      let wageFactor = 1, valFactor = 1;
      for (let j = 0; j < k; j++) { wageFactor /= 1 + pathValue(P.pastRealWageGrowth, now - 1 - j); valFactor *= 1 + pathValue(P.pastRealValorization, now - 1 - j); }
      const base = Math.min(input.monthlyBase * wageFactor, R.wages.forecastAverage * wageFactor * capRatio) * 12;
      balance += base * rate * valFactor;
    }
  }
  path.push({ age: input.age, year: now, balance: r2(balance) });

  // Przyszłe składki: pensja rośnie realnie jak przeciętne wynagrodzenie w prognozie ZUS; konto waloryzowane realnie.
  let wage = input.monthlyBase, avg = R.wages.forecastAverage, paid = 0;
  const gapEvery = input.gapYears && yearsToGo > 0 ? yearsToGo / input.gapYears : Infinity;
  for (let i = 0; i < yearsToGo; i++) {
    const y = now + i;
    const working = !(input.gapYears && Math.floor((i + 1) / gapEvery) > Math.floor(i / gapEvery));
    const base = working ? Math.min(wage, avg * capRatio) * 12 : 0;
    balance = balance * (1 + pathValue(P.realValorization, y)) + base * rate;
    paid += base * rate;
    const g = pathValue(P.realWageGrowth, y);
    wage *= 1 + g; avg *= 1 + g;
    path.push({ age: input.age + i + 1, year: y + 1, balance: r2(balance) });
  }

  const months = lifeExpectancy(retAge, retYear, R);
  const gross = r2(balance / months);
  // Emerytura minimalna rośnie realnie wolniej niż płace (waloryzacja: inflacja + co najmniej 20% realnego wzrostu płac).
  let minimum = P.minimumPension;
  for (let i = 0; i < yearsToGo; i++) minimum *= 1 + P.minimumRealGrowthShare * pathValue(P.realWageGrowth, now + i);
  const stazYears = Math.max(0, Math.round(retAge - input.startAge - (input.gapYears ?? 0)));
  const stazRequired = P.minimumStazYears[input.sex];
  const minimumApplies = gross < minimum && stazYears >= stazRequired;
  const paidGross = minimumApplies ? r2(minimum) : gross;
  const finalWage = r2(wage / (1 + pathValue(P.realWageGrowth, retYear - 1)));
  return {
    retirementAge: retAge, retirementYear: retYear, balance: r2(balance), months,
    gross: paidGross, net: pensionNet(paidGross, R),
    minimum: r2(minimum), minimumApplies, stazYears, stazRequired,
    finalWage, replacementRate: finalWage > 0 ? paidGross / finalWage : 0,
    path, contributionsPaid: r2(paid),
  };
}
