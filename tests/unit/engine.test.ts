import { describe, it, expect } from 'vitest';
import ratesJson from '../../src/data/rates-2026.json';
import { compute, computeLabor, januaryPayslip, grossFromNet, scaleTax, childRelief, fuelUnit, packUnit, alcoholUnit, electricityMonthly, computeConsumption, freedomDay, workClock, whereItGoes, type Rates, type Input } from '../../src/lib/engine';

const R = ratesJson as unknown as Rates;
const base: Input = { people: [{ contract: 'uop', amount: 8000, amountIs: 'gross', under26: false }], basket: { persons: 1 }, zusAsTax: true };
const pit = (r: ReturnType<typeof computeLabor>) => r.employee.find((i) => i.id === 'pit')!.amount;

describe('dane', () => {
  it('kategorie koszyka sumują się do 100% w każdym kwintylu', () => {
    for (let q = 0; q < 5; q++) expect(R.basket.categories.reduce((s, c) => s + c.shares[q], 0)).toBeCloseTo(1, 3);
  });
  it('struktura COFOG sumuje się do 100%', () => {
    expect(R.cofog.functions.reduce((s, f) => s + f.share, 0)).toBeCloseTo(1, 3);
  });
  it('każdy parametr ma źródło', () => {
    const refs = (R as unknown as { refs: Record<string, string> }).refs;
    for (const id of Object.values(refs)) expect(R.sources[id], `brak źródła ${id}`).toBeTruthy();
    for (const s of Object.values(R.sources)) expect(s.url).toMatch(/^https:\/\//);
  });
  it('udziały VAT nie przekraczają 23/123', () => {
    for (const c of R.basket.categories) { expect(c.vatShare).toBeGreaterThanOrEqual(0); expect(c.vatShare).toBeLessThanOrEqual(23 / 123 + 1e-4); }
  });
});

describe('PIT – skala', () => {
  it('kwota wolna: dochód 30 000 zł = 0 zł podatku', () => { expect(scaleTax(R.pit.taxFree, R)).toBe(0); });
  it('dochód 120 000 zł = 10 800 zł', () => { expect(scaleTax(120000, R)).toBe(10800); });
  it('dochód 150 000 zł = 10 800 + 32% × 30 000', () => { expect(scaleTax(150000, R)).toBe(10800 + 9600); });
  it('ulga prorodzinna: 3 dzieci', () => { expect(childRelief(3, 80000, R)).toBeCloseTo(R.pit.childRelief[0] * 2 + R.pit.childRelief[2], 2); });
  it('ulga na 1 dziecko znika powyżej limitu', () => { expect(childRelief(1, R.pit.childReliefOneChildIncomeLimit + 1, R)).toBe(0); });
});

describe('umowa o pracę', () => {
  it('płaca minimalna: pierwsza wypłata zgodna z wzorcem', () => {
    const j = januaryPayslip(R.wages.minimum, R);
    expect(j.net).toBeCloseTo((R as unknown as { checks: { minWageNet: number } }).checks.minWageNet, 2);
  });
  it('roczne netto ≈ 12 × styczniowa wypłata dla pensji poniżej progu (różnica tylko z zaokrągleń)', () => {
    for (const m of [R.wages.minimum, 6000, 8000]) {
      const y = computeLabor({ contract: 'uop', monthly: m, under26: false }, R);
      expect(Math.abs(y.net - 12 * januaryPayslip(m, R).net)).toBeLessThan(15);
    }
  });
  it('koszt pracodawcy = brutto × (1 + 20,48%) poniżej limitu ZUS', () => {
    const y = computeLabor({ contract: 'uop', monthly: 8000, under26: false }, R);
    const z = R.zus; expect(y.laborCost).toBeCloseTo(96000 * (1 + z.emerEr + z.rentEr + z.wyp + z.fp + z.fgsp), 0);
  });
  it('limit 30-krotności obcina składki emerytalne i rentowe', () => {
    const y = computeLabor({ contract: 'uop', monthly: 40000, under26: false }, R);
    expect(y.employee.find((i) => i.id === 'zus_emer_emp')!.amount).toBeCloseTo(R.zus.annualCap * R.zus.emerEmp, 1);
  });
  it('ulga dla młodych: brak PIT poniżej limitu', () => {
    expect(pit(computeLabor({ contract: 'uop', monthly: 7000, under26: true }, R))).toBe(0);
  });
  it('netto rośnie z brutto (monotoniczność)', () => {
    let prev = -1; for (let m = 3000; m <= 60000; m += 1500) { const n = computeLabor({ contract: 'uop', monthly: m, under26: false }, R).net; expect(n).toBeGreaterThan(prev); prev = n; }
  });
  it('odwrotność: brutto z netto', () => {
    const n = computeLabor({ contract: 'uop', monthly: 8000, under26: false }, R).net / 12;
    expect(grossFromNet(n, { contract: 'uop', under26: false }, R)).toBeCloseTo(8000, 0);
  });
});

describe('zlecenie i B2B', () => {
  it('student do 26 lat na zleceniu: bez danin od pracy', () => {
    const y = computeLabor({ contract: 'zlecenie', monthly: 4000, under26: true, student: true }, R);
    expect(y.net).toBe(48000); expect(y.laborCost).toBe(48000);
  });
  it('B2B liniowy: PIT 19% od dochodu po składkach i części zdrowotnej', () => {
    const y = computeLabor({ contract: 'b2b', monthly: 20000, under26: false, b2bTax: 'liniowy', b2bZus: 'duzy' }, R);
    expect(pit(y)).toBeGreaterThan(0.15 * 240000 * 0.8);
    expect(y.net).toBeLessThan(240000);
  });
  it('B2B ryczałt: zdrowotna zależy od przychodu', () => {
    const a = computeLabor({ contract: 'b2b', monthly: 4000, under26: false, b2bTax: 'ryczalt', ryczaltRate: 0.12 }, R);
    const b = computeLabor({ contract: 'b2b', monthly: 30000, under26: false, b2bTax: 'ryczalt', ryczaltRate: 0.12 }, R);
    const h = (r: typeof a) => r.employee.find((i) => i.id === 'health')!.amount;
    expect(h(a)).toBeCloseTo(R.health.ryczaltMonthlyJanuary[0] + R.health.ryczaltMonthly[0] * 11, 1);
    expect(h(b)).toBeCloseTo(R.health.ryczaltMonthlyJanuary[2] + R.health.ryczaltMonthly[2] * 11, 1);
  });
});

describe('produkty – zgodność z niezależnymi wyliczeniami (research/consumption-2026.md, § 8)', () => {
  it('benzyna 95 po 5,81 zł (obniżka do 31.12.2026): ok. 1,96 zł podatków = 33,7%', () => { const u = fuelUnit(R, 'petrol'); expect(u.total).toBeCloseTo(1.96, 1); expect(u.total / u.price).toBeCloseTo(0.337, 2); });
  it('benzyna przy stawkach standardowych: ok. 6,97 zł i 44,8% podatków', () => { const u = fuelUnit(R, 'petrol', 'standard'); expect(u.price).toBeCloseTo(6.97, 1); expect(u.total / u.price).toBeCloseTo(0.448, 2); });
  it('olej napędowy po 7,12 zł: ok. 1,94 zł = 27,3%', () => { const u = fuelUnit(R, 'diesel'); expect(u.total).toBeCloseTo(1.94, 1); });
  it('papierosy: cena 2026 z ceny MF 2025 (20,75 zł) przy stałej marży = 23,56 zł; podatki 20,24 zł', () => { const u = packUnit(R); expect(u.price).toBeCloseTo(23.56, 2); expect(u.total).toBeCloseTo(20.24, 1); });
  it('akcyza minimalna na papierosy 2026: 105% × (414 + 32,05% × 1031,46) = 781,81 zł/1000 szt.', () => { expect(R.tobacco.minimumPerThousand).toBeCloseTo(1.05 * (414 + 0.3205 * 1031.46), 1); });
  it('wódka 0,5 l po 32 zł: 22,77 zł = 71,1%', () => { const u = alcoholUnit(R, 'vodka'); expect(u.total).toBeCloseTo(22.77, 1); });
  it('piwo 0,5 l po 4 zł: 1,44 zł = 35,9%', () => { const u = alcoholUnit(R, 'beer'); expect(u.total).toBeCloseTo(1.44, 1); });
});

describe('całość', () => {
  it('8000 zł brutto: udział danin w przedziale 40–55%', () => {
    const r = compute(base, R); expect(r.share).toBeGreaterThan(0.4); expect(r.share).toBeLessThan(0.55);
  });
  it('bilans: daniny + zostaje = koszt pracy', () => {
    const r = compute(base, R); expect(r.taxes + r.kept).toBeCloseTo(r.base, 1);
    const r2 = compute({ ...base, zusAsTax: false }, R); expect(r2.taxes + r2.kept + r2.pensionContrib).toBeCloseTo(r2.base, 1);
  });
  it('własne zużycie nie zmienia sumy wydatków', () => {
    const a = computeConsumption(60000, { persons: 1 }, R);
    const b = computeConsumption(60000, { persons: 1, fuelLitersMonthly: 60, packsWeekly: 3, kwhMonthly: 150 }, R);
    expect(b.spending).toBeCloseTo(a.spending, 0);
    expect(b.excise).toBeGreaterThan(a.excise);
  });
  it('dzień wolności i zegar', () => {
    expect(freedomDay(0.5, 2026).toISOString().slice(0, 10)).toBe('2026-07-03');
    expect(workClock(0.5)).toEqual({ h: 12, m: 0, minutes: 240 });
  });
  it('podział na funkcje państwa sumuje się do kwoty', () => {
    expect(whereItGoes(1000, R).reduce((s, f) => s + f.amount, 0)).toBeCloseTo(1000, 0);
  });
});

describe('zgodność z wyliczeniami wzorcowymi (research/labor-2026.md)', () => {
  it('płaca minimalna: koszt pracodawcy 5 790,28 zł miesięcznie', () => {
    const y = computeLabor({ contract: 'uop', monthly: R.wages.minimum, under26: false }, R);
    expect(y.laborCost / 12).toBeCloseTo(5790.28, 0);
  });
  it('duży ZUS: 1 926,76 zł miesięcznie z chorobową', () => {
    const y = computeLabor({ contract: 'b2b', monthly: 15000, under26: false, b2bZus: 'duzy', b2bSickness: true }, R);
    const social = y.employee.filter((i) => i.id.startsWith('b2b_')).reduce((s, i) => s + i.amount, 0);
    expect(social / 12).toBeCloseTo(1926.76, 1);
  });
  it('preferencyjny ZUS: 456,18 zł miesięcznie z chorobową (bez FP)', () => {
    const y = computeLabor({ contract: 'b2b', monthly: 8000, under26: false, b2bZus: 'preferencyjny', b2bSickness: true }, R);
    const social = y.employee.filter((i) => i.id.startsWith('b2b_')).reduce((s, i) => s + i.amount, 0);
    expect(social / 12).toBeCloseTo(456.18, 1);
  });
});

describe('regresje z niezależnego audytu', () => {
  it('FP+FS i FGŚP podlegają limitowi 30-krotności (30 000 zł/mies.)', () => {
    const y = computeLabor({ contract: 'uop', monthly: 30000, under26: false }, R);
    expect(y.employer.find((i) => i.id === 'fp')!.amount).toBeCloseTo(6923.7, 1);
    expect(y.employer.find((i) => i.id === 'fgsp')!.amount).toBeCloseTo(282.6, 1);
  });
  it('opłata mocowa: progi włącznie (1200 i 2800 kWh rocznie)', () => {
    expect(electricityMonthly(R, 100).capacity).toBe(10.31);
    expect(electricityMonthly(R, 2800 / 12).capacity).toBe(17.18);
    expect(electricityMonthly(R, 2801 / 12).capacity).toBe(24.05);
    expect(electricityMonthly(R, 499 / 12).capacity).toBe(4.29);
  });
  it('ryczałt: zdrowotna za styczeń wg kwot roku składkowego 2025', () => {
    const y = computeLabor({ contract: 'b2b', monthly: 10000, under26: false, b2bTax: 'ryczalt' }, R);
    expect(y.employee.find((i) => i.id === 'health')!.amount).toBeCloseTo(769.43 + 11 * 830.58, 1);
  });
  it('ulga na jedno dziecko: limit 112 000 zł liczony łącznie dla małżonków', () => {
    const solo = compute({ people: [{ contract: 'uop', amount: 9000, amountIs: 'gross', under26: false, children: 1 }], basket: { persons: 3 }, zusAsTax: true }, R);
    expect(solo.labor[0].childReliefUsed).toBeGreaterThan(0);
    const both = compute({ people: [{ contract: 'uop', amount: 9000, amountIs: 'gross', under26: false, children: 1 }, { contract: 'uop', amount: 9000, amountIs: 'gross', under26: false }], basket: { persons: 3 }, zusAsTax: true }, R);
    expect(both.labor[0].childReliefUsed).toBe(0);
  });
  it('B2B na skali: zwrot niewykorzystanej ulgi na dzieci', () => {
    const y = computeLabor({ contract: 'b2b', monthly: 5000, under26: false, b2bTax: 'skala', b2bZus: 'preferencyjny', children: 3 }, R);
    expect(y.childRefund).toBeGreaterThan(0);
  });
});
