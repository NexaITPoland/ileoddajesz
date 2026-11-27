/**
 * Kalkulator: czyta formularz, liczy silnikiem (te same funkcje co w testach) i rysuje wizualizacje.
 * Stan trzymamy w części # adresu, której przeglądarka nie wysyła na serwer.
 */
import ratesJson from '../data/rates-2026.json';
import { compute, freedomDay, workClock, whereItGoes, type Input, type Result, type Slice, type Group, type PersonInput, type Rates } from '../lib/engine';

const R = ratesJson as unknown as Rates;
const $ = <T extends HTMLElement = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector(s) as T;
const $$ = <T extends HTMLElement = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll(s)] as T[];

const zl = (n: number, dec = false) => `${(dec ? Math.round(n * 100) / 100 : Math.round(n)).toLocaleString('pl-PL', dec ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {})} zł`;
const pct = (x: number) => `${Math.round(x * 100)}%`;
const parseNum = (s: string | null | undefined): number | undefined => {
  if (s == null) return undefined;
  const t = String(s).replace(/\s| /g, '').replace(',', '.').replace(/zł/i, '');
  if (t === '') return undefined;
  const n = Number(t); return Number.isFinite(n) && n >= 0 ? n : undefined;
};

const GROUPS: Record<Group | 'you' | 'pension', { label: string; plain: string }> = {
  you: { label: 'Realnie dla Ciebie', plain: 'Na zakupy (już bez podatków w cenach) i oszczędności' },
  zus: { label: 'ZUS', plain: 'Emerytury, renty, L4, wypadki' },
  pension: { label: 'Odłożone na emeryturę i rentę', plain: 'Składki emerytalne i rentowe (wrócą jako świadczenie)' },
  nfz: { label: 'NFZ', plain: 'Leczenie' },
  pit: { label: 'PIT', plain: 'Podatek dochodowy od pensji' },
  fp: { label: 'Fundusz Pracy i inne', plain: 'Zasiłki dla bezrobotnych, pomoc gdy firma upadnie' },
  vat: { label: 'VAT', plain: 'W cenach zakupów' },
  akcyza: { label: 'Akcyza', plain: 'Dodatkowy podatek w cenie paliwa, prądu, alkoholu i papierosów' },
  lokalne: { label: 'Gmina', plain: 'Opłata za śmieci (i ewentualnie RTV, podatek od mieszkania)' },
};
const ORDER: (Group | 'pension')[] = ['pension', 'zus', 'fp', 'nfz', 'pit', 'vat', 'akcyza', 'lokalne'];

type State = {
  amount: number; amountIs: 'gross' | 'net'; contract: 'uop' | 'zlecenie' | 'b2b'; under26: boolean; student: boolean;
  b2bTax: 'liniowy' | 'skala' | 'ryczalt'; ryczaltRate: number; b2bZus: 'duzy' | 'preferencyjny' | 'ulga'; b2bCosts: number;
  persons: number; children: number; partner?: number;
  fuel?: number; fuelType: 'petrol' | 'diesel'; packs?: number; kwh?: number; beers?: number; vodka?: number; wine?: number;
  m2?: number; savings?: number; capital?: number; rtv: boolean;
  zusAsTax: boolean; period: 'm' | 'y'; guess?: number;
};

const state: State = {
  amount: R.wages.average, amountIs: 'gross', contract: 'uop', under26: false, student: false,
  b2bTax: 'liniowy', ryczaltRate: 0.12, b2bZus: 'duzy', b2bCosts: 0,
  persons: 1, children: 0, fuelType: 'petrol', rtv: false, zusAsTax: true, period: 'm',
};

/* ---------- Formularze ---------- */
const calc = $<HTMLFormElement>('#calc');
const fit = $<HTMLFormElement>('#fit');

function readCalc() {
  const f = new FormData(calc);
  state.amount = parseNum($<HTMLInputElement>('#amount').value) ?? 0;
  state.amountIs = f.get('amountIs') as State['amountIs'];
  state.contract = f.get('contract') as State['contract'];
  state.under26 = $<HTMLInputElement>('#under26').checked;
  state.student = $<HTMLInputElement>('#student').checked;
  state.b2bTax = f.get('b2bTax') as State['b2bTax'];
  state.ryczaltRate = Number(f.get('ryczaltRate'));
  state.b2bZus = f.get('b2bZus') as State['b2bZus'];
  state.b2bCosts = parseNum(String(f.get('b2bCosts'))) ?? 0;
  syncVisibility();
}

function readFit() {
  const v = (id: string) => parseNum($<HTMLInputElement>(`#${id}`).value);
  state.persons = Math.max(1, Math.round(v('persons') ?? 1));
  state.children = Math.round(v('children') ?? 0);
  state.partner = v('partner') || undefined;
  state.fuel = v('fuel'); state.packs = v('packs'); state.kwh = v('kwh');
  state.beers = v('beers'); state.vodka = v('vodka'); state.wine = v('wine');
  state.m2 = v('m2'); state.capital = v('capital');
  const s = v('savings'); state.savings = s == null ? undefined : Math.min(90, s);
  state.fuelType = $<HTMLSelectElement>('#fuelType').value as State['fuelType'];
  state.rtv = $<HTMLInputElement>('#rtv').checked;
}

function syncVisibility() {
  const b2b = state.contract === 'b2b';
  $$('[data-show="b2b"]').forEach((el) => (el.hidden = !b2b));
  $$('[data-show="zlecenie"]').forEach((el) => (el.hidden = state.contract !== 'zlecenie'));
  $$('[data-show="ryczalt"]').forEach((el) => (el.hidden = !(b2b && state.b2bTax === 'ryczalt')));
  $('#amount-label').textContent = b2b ? 'Ile wynosi Twój przychód miesięcznie (faktury netto)?' : 'Ile zarabiasz miesięcznie?';
  const netRadio = $<HTMLInputElement>('input[name="amountIs"][value="net"]');
  netRadio.closest('label')!.hidden = b2b;
  if (b2b && state.amountIs === 'net') { $<HTMLInputElement>('input[name="amountIs"][value="gross"]').checked = true; state.amountIs = 'gross'; }
}

function toInput(): Input {
  const main: PersonInput = {
    contract: state.contract, amount: state.amount, amountIs: state.contract === 'b2b' ? 'gross' : state.amountIs,
    under26: state.under26, student: state.student, children: state.children,
    b2bTax: state.b2bTax, b2bZus: state.b2bZus, ryczaltRate: state.ryczaltRate, b2bCostsMonthly: state.b2bCosts,
  };
  const people: PersonInput[] = [main];
  if (state.partner) people.push({ contract: 'uop', amount: state.partner, amountIs: 'net', under26: false });
  const persons = Math.max(state.persons, people.length);
  return {
    people,
    basket: {
      persons, fuelLitersMonthly: state.fuel, fuelType: state.fuelType, packsWeekly: state.packs, kwhMonthly: state.kwh,
      beersWeekly: state.beers, vodkaMonthly: state.vodka, wineMonthly: state.wine,
      savingsRate: state.savings == null ? undefined : state.savings / 100,
    },
    ownM2: state.m2, paysRtv: state.rtv, capitalGains: state.capital, zusAsTax: state.zusAsTax,
  };
}

/* ---------- Adres (#) ---------- */
const KEYS: (keyof State)[] = ['amount', 'amountIs', 'contract', 'under26', 'student', 'b2bTax', 'ryczaltRate', 'b2bZus', 'b2bCosts', 'persons', 'children', 'partner', 'fuel', 'fuelType', 'packs', 'kwh', 'beers', 'vodka', 'wine', 'm2', 'savings', 'capital', 'rtv', 'zusAsTax', 'period'];
function writeHash() {
  const p = new URLSearchParams();
  for (const k of KEYS) { const v = state[k]; if (v === undefined) continue; p.set(k, typeof v === 'boolean' ? (v ? '1' : '0') : String(v)); }
  history.replaceState(null, '', `#${p.toString()}`);
}
function readHash(): boolean {
  if (location.hash.length < 3) return false;
  const p = new URLSearchParams(location.hash.slice(1));
  if (!p.has('amount')) return false;
  const s = state as Record<string, unknown>;
  for (const k of KEYS) {
    const v = p.get(k); if (v == null) continue;
    const cur = (state as Record<string, unknown>)[k];
    if (typeof cur === 'boolean' || ['under26', 'student', 'rtv', 'zusAsTax'].includes(k)) s[k] = v === '1';
    else if (['amountIs', 'contract', 'b2bTax', 'b2bZus', 'fuelType', 'period'].includes(k)) s[k] = v;
    else { const n = parseNum(v); if (n !== undefined) s[k] = n; }
  }
  // Odtwórz formularze.
  $<HTMLInputElement>('#amount').value = Math.round(state.amount).toLocaleString('pl-PL');
  $<HTMLInputElement>(`input[name="amountIs"][value="${state.amountIs}"]`).checked = true;
  $<HTMLInputElement>(`input[name="contract"][value="${state.contract}"]`).checked = true;
  $<HTMLInputElement>('#under26').checked = state.under26; $<HTMLInputElement>('#student').checked = state.student;
  $<HTMLSelectElement>('#b2bTax').value = state.b2bTax; $<HTMLSelectElement>('#ryczaltRate').value = String(state.ryczaltRate);
  $<HTMLSelectElement>('#b2bZus').value = state.b2bZus; $<HTMLInputElement>('#b2bCosts').value = String(state.b2bCosts);
  const setv = (id: string, v: number | undefined) => { $<HTMLInputElement>(`#${id}`).value = v == null ? '' : String(v); };
  setv('persons', state.persons); setv('children', state.children); setv('partner', state.partner);
  setv('fuel', state.fuel); setv('packs', state.packs); setv('kwh', state.kwh); setv('beers', state.beers); setv('vodka', state.vodka); setv('wine', state.wine);
  setv('m2', state.m2); setv('savings', state.savings); setv('capital', state.capital);
  $<HTMLSelectElement>('#fuelType').value = state.fuelType; $<HTMLInputElement>('#rtv').checked = state.rtv;
  $<HTMLInputElement>('#zusAsTax').checked = state.zusAsTax;
  syncVisibility();
  return true;
}

/* ---------- Pomocnicze ---------- */
const per = (annual: number) => (state.period === 'm' ? annual / 12 : annual);
const perLabel = () => (state.period === 'm' ? 'miesięcznie' : 'rocznie');
function grouped(res: Result) {
  const g = new Map<Group | 'pension', number>();
  for (const s of res.slices) { const k = s.pension && !state.zusAsTax ? 'pension' : s.group; g.set(k, (g.get(k) ?? 0) + s.amount); }
  if (!state.zusAsTax && res.pensionContrib) g.set('pension', res.pensionContrib);
  return ORDER.filter((k) => (g.get(k) ?? 0) > 0.5).map((k) => ({ key: k, amount: g.get(k)! }));
}
const cssGroup = (k: string) => `g-${k}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/* ---------- Render ---------- */
let last: Result | null = null;

function render() {
  const res = compute(toInput(), R);
  last = res;
  const groups = grouped(res);
  const pensionAsSeparate = !state.zusAsTax;
  const base = res.base || 1;

  // Pasek przyklejony
  $('#st-label').textContent = `Oddajesz ${state.period === 'm' ? 'miesięcznie' : 'rocznie'}`;
  $('#st-amount').textContent = zl(per(res.taxes));
  $('#st-pct').textContent = pct(res.share);
  $$('[data-period]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.period === state.period)));

  // Wielki wynik
  const per100 = Math.round(res.share * 100);
  const b2b = state.contract === 'b2b';
  $('#big-result').innerHTML = `Z każdych 100&nbsp;zł, które ${b2b ? 'zarabia Twoja firma' : 'pracodawca wydaje na Ciebie'}, państwo dostaje <em class="num">${per100}&nbsp;zł</em>`;
  const inPrices = res.taxes - res.slices.filter((x) => x.payer === 'employer' || x.payer === 'you').reduce((a, x) => a + x.amount, 0);
  $('#three').innerHTML = `
    <div class="three-i"><span class="three-k">${b2b ? 'Firma zarabia' : 'Pracodawca wydaje na Ciebie'}</span><b class="num">${zl(res.laborCost / 12)}</b><small>${b2b ? 'przychód minus koszty, miesięcznie' : 'pensja brutto + składki, których nie widzisz na pasku'}</small></div>
    <div class="three-op" aria-hidden="true">=</div>
    <div class="three-i three-you"><span class="three-k">Na Twoje konto</span><b class="num">${zl(res.net / 12)}</b><small>${b2b ? 'po ZUS, NFZ i podatku' : `na rękę (w umowie: ${zl(res.gross / 12)} brutto)`}</small></div>
    <div class="three-op" aria-hidden="true">+</div>
    <div class="three-i three-state"><span class="three-k">Do państwa</span><b class="num">${zl((res.laborCost - res.net) / 12)}</b><small>składki i podatek, zanim dostaniesz pensję</small></div>`;
  $('#big-sub').innerHTML = `A to nie koniec: z ${zl(res.net / 12)} na koncie około <strong class="num">${zl(inPrices / 12)}</strong> wraca do państwa przy zakupach (VAT, akcyza) i w opłacie za śmieci. Razem oddajesz więc <strong class="num">${zl(res.taxes / 12)}</strong> miesięcznie, czyli <strong class="num">${zl(res.taxes)}</strong> rocznie${pensionAsSeparate ? ` (bez <strong class="num">${zl(res.pensionContrib / 12)}</strong> miesięcznie składek emerytalnych i rentowych)` : ''}. Realnie dla Ciebie zostaje <strong class="num">${zl(res.kept / 12)}</strong> miesięcznie.`;
  const gc = $('#guess-cmp');
  if (state.guess != null) {
    const fullShare = state.zusAsTax ? per100 : Math.round(compute({ ...toInput(), zusAsTax: true }, R).share * 100);
    const diff = fullShare - state.guess;
    gc.hidden = false;
    // Typ zawsze oceniamy względem pełnego wyniku (ze składkami emerytalnymi i rentowymi), niezależnie od przełącznika.
    const full = state.zusAsTax ? per100 : Math.round(compute({ ...toInput(), zusAsTax: true }, R).share * 100);
    const ratio = state.guess > 0 ? full / state.guess : 0;
    const times = ratio >= 1.8 ? ` – prawie ${Math.round(ratio)} razy więcej` : ` – o ${diff} zł więcej`;
    const extra = state.zusAsTax ? '' : ` (bez składek emerytalnych i rentowych: ${per100} zł)`;
    gc.textContent = Math.abs(diff) <= 3 ? `Strzelałeś ${state.guess} zł, a jest ${full} zł${extra}. Prawie idealnie!` : diff > 0 ? `Strzelałeś ${state.guess} zł, a naprawdę jest ${full} zł${times}${extra}.` : `Strzelałeś ${state.guess} zł, a naprawdę jest ${full} zł – o ${-diff} zł mniej${extra}.`;
  } else gc.hidden = true;

  renderCoins(res, groups, base);
  renderFlow(res);
  renderReceipt(res);
  renderTimeline(res);
  renderCalendar(res, groups, base);
  renderWhere(res);
  renderReturns(res);
  renderFitNote(res);
  drawShare(res, groups, base);
  writeHash();
}

function renderCoins(res: Result, groups: { key: string; amount: number }[], base: number) {
  // 100 monet: zaokrąglamy metodą największych reszt, żeby suma zawsze wynosiła 100.
  const parts = groups.map((g) => ({ key: g.key, exact: (g.amount / base) * 100 }));
  const youExact = Math.max(0, 100 - parts.reduce((s, p) => s + p.exact, 0));
  const all = [...parts, { key: 'you', exact: youExact }];
  const floor = all.map((p) => ({ ...p, n: Math.floor(p.exact), rem: p.exact - Math.floor(p.exact) }));
  let left = 100 - floor.reduce((s, p) => s + p.n, 0);
  [...floor].sort((a, b) => b.rem - a.rem).forEach((p) => { if (left > 0) { p.n++; left--; } });
  const coins: string[] = []; let i = 0;
  for (const p of floor) for (let k = 0; k < p.n; k++) coins.push(`<i class="coin ${cssGroup(p.key)}${p.key === 'pension' ? ' is-pension' : ''}" style="--i:${i++}"></i>`);
  const el = $('#coins'); el.innerHTML = coins.join('');
  el.setAttribute('aria-label', `100 monet: ${floor.map((p) => `${p.n} – ${GROUPS[p.key as keyof typeof GROUPS].label}`).join(', ')}`);
  $('#coins-legend').innerHTML = `<li class="legend-h"><span></span><span></span><span class="num">ze 100 zł<small>${perLabel()}</small></span></li>` + floor.map((p) => {
    const g = GROUPS[p.key as keyof typeof GROUPS];
    const amount = p.key === 'you' ? res.kept : groups.find((x) => x.key === p.key)!.amount;
    const n = p.n === 0 ? '<1 zł' : `${p.n} zł`;
    return `<li><span class="dot ${cssGroup(p.key)}"></span><span><b>${g.label}</b><small>${g.plain}</small></span><span class="num">${n}<small>${zl(per(amount))}</small></span></li>`;
  }).join('');
}

function renderFlow(res: Result) {
  const base = res.base || 1;
  const bySlice = (pred: (s: Slice) => boolean) => res.slices.filter(pred);
  const pensionSlices = !state.zusAsTax ? computePensionSlices(res) : [];
  const stages: { title: string; tag: string; sub: string; cutLabel?: string; cut: { label: string; group: string; amount: number }[] }[] = [];
  const b2b = state.contract === 'b2b';
  const employer = bySlice((s) => s.payer === 'employer').concat(pensionSlices.filter((s) => s.payer === 'employer'));
  const you = bySlice((s) => s.payer === 'you').concat(pensionSlices.filter((s) => s.payer === 'you'));
  const local = bySlice((s) => s.payer === 'local');
  const prices = bySlice((s) => s.payer === 'prices');
  const cutOf = (arr: Slice[]) => arr.map((s) => ({ label: s.label, group: s.pension && !state.zusAsTax ? 'pension' : s.group, amount: s.amount }));
  stages.push({ title: b2b ? 'Twoja firma zarabia' : 'Pracodawca wydaje na Ciebie', tag: b2b ? '' : 'tego nie widzisz nigdzie', sub: b2b ? 'Przychód minus koszty firmy' : 'Pensja brutto plus składki płacone „od pracodawcy”', cut: [] });
  if (!b2b && employer.length) stages.push({ title: 'Pensja brutto', tag: 'to masz w umowie', sub: 'Zanim ją zobaczysz, pracodawca przelał już swoją część składek', cutLabel: 'Tyle pracodawca płaci ponad Twoje brutto:', cut: cutOf(employer) });
  stages.push({ title: 'Na rękę', tag: 'to widzisz na koncie', sub: b2b ? 'Po opłaceniu ZUS, zdrowotnej i podatku' : 'Po Twoich składkach i podatku potrąconych z pensji', cutLabel: b2b ? 'Tyle płacisz z przychodu:' : 'Tyle potrącono z Twojej pensji brutto:', cut: cutOf(you) });
  if (local.length) stages.push({ title: 'Po opłatach dla gminy', tag: '', sub: local.map((x) => x.label).join(', '), cutLabel: 'Tyle płacisz gminie:', cut: cutOf(local) });
  stages.push({ title: 'Co naprawdę możesz kupić', tag: 'realnie Twoje', sub: 'Przy zakupach część pieniędzy wraca do państwa w cenach (VAT, akcyza)', cutLabel: 'Tyle wraca do państwa w cenach zakupów:', cut: cutOf(prices) });

  let remaining = base; let lost = 0;
  const html = stages.map((st) => {
    const cutSum = st.cut.reduce((s, c) => s + c.amount, 0);
    remaining -= cutSum;
    const prevLost = lost; lost += cutSum;
    const w = (x: number) => `${Math.max(0, (x / base) * 100).toFixed(2)}%`;
    const bar = `<span class="keep" style="width:${w(remaining)}"></span>${st.cut.map((c) => `<span class="gone ${cssGroup(c.group)}" style="width:${w(c.amount)}" title="${esc(c.label)}"></span>`).join('')}<span class="lost" style="width:${w(prevLost)}"></span>`;
    const cut = st.cut.length ? `<div class="flow-cut">${st.cutLabel ? `<em class="flow-cut-h">${st.cutLabel}</em>` : ''}${st.cut.map((c) => `<span><i class="dot ${cssGroup(c.group)}"></i>${esc(c.label)} <b class="num">−${zl(per(c.amount))}</b></span>`).join('')}</div>` : '';
    return `<li class="flow-step"><div class="flow-top"><div><b>${st.title}</b>${st.tag ? ` <span class="flow-tag">${st.tag}</span>` : ''}<small>${st.sub}</small></div><span class="num">${zl(per(remaining))}</span></div><div class="flow-bar" aria-hidden="true">${bar}</div>${cut}</li>`;
  }).join('');
  $('#flow').innerHTML = html;
}

/** Gdy przełącznik ZUS jest wyłączony, składki emerytalno-rentowe nie są w `slices`; odtwarzamy je do wizualizacji. */
function computePensionSlices(_res: Result): Slice[] {
  const full = compute({ ...toInput(), zusAsTax: true }, R);
  return full.slices.filter((s) => s.pension);
}

function renderReceipt(res: Result) {
  const m = (x: number) => zl(per(x), true);
  const pensionSlices = !state.zusAsTax ? computePensionSlices(res) : [];
  const sections: { title: string; items: Slice[] }[] = [
    { title: state.contract === 'b2b' ? 'PŁACISZ SAM (ZUS, NFZ, US)' : 'PŁACI PRACODAWCA (ZA TWOJĄ PRACĘ)', items: res.slices.filter((s) => s.payer === 'employer') },
    { title: state.contract === 'b2b' ? '' : 'POTRĄCONE Z TWOJEJ PENSJI', items: res.slices.filter((s) => s.payer === 'you') },
    { title: 'W CENACH ZAKUPÓW', items: res.slices.filter((s) => s.payer === 'prices') },
    { title: 'GMINA I INNE', items: res.slices.filter((s) => s.payer === 'local') },
  ];
  if (state.contract === 'b2b') { sections[0].items = sections[1].items; sections[1].items = []; }
  const line = (s: Slice) => `<div class="rc-l"><span><span class="rc-dot ${cssGroup(s.pension && !state.zusAsTax ? 'pension' : s.group)}"></span>${esc(s.label)}<small>${esc(s.plain)}</small></span><i></i><span class="num">${m(s.amount)}</span></div>`;
  const date = new Date().toLocaleDateString('pl-PL');
  let h = `<h3>PARAGON OD PAŃSTWA</h3><p class="rc-c">wydruk edukacyjny · nie jest dokumentem fiskalnym<br>${state.period === 'm' ? 'okres: 1 miesiąc' : `okres: rok ${R.meta.year}`} · ${date}</p><hr>`;
  for (const sec of sections) if (sec.items.length) h += `<p class="rc-g">${sec.title}</p>${sec.items.map(line).join('')}`;
  h += `<hr><div class="rc-l rc-tot"><span>RAZEM DO PAŃSTWA</span><i></i><span class="num">${m(res.taxes)}</span></div>`;
  h += `<p class="rc-c" style="text-align:left">to ${pct(res.share)} z ${m(res.base)}, które ${state.contract === 'b2b' ? 'zarabia firma' : 'wydaje na Ciebie pracodawca'}</p>`;
  if (pensionSlices.length) h += `<hr><p class="rc-g">ODŁOŻONE NA TWOJĄ EMERYTURĘ (NIE LICZONE JAKO PODATEK)</p>${pensionSlices.map(line).join('')}`;
  h += `<hr><div class="rc-l rc-keep"><span>REALNIE DLA CIEBIE</span><i></i><span class="num">${m(res.kept)}</span></div>`;
  h += `<p class="rc-c" style="margin-top:14px">Źródła i wzory: strona Metodologia.<br>Stan prawny: ${new Date(R.meta.asOf).toLocaleDateString('pl-PL')}</p>`;
  $('#receipt').innerHTML = h;
}

const ICONS: Record<string, string> = {
  pay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></svg>',
  shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>',
  fuel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M14 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3M7 8h4"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10M10 20v-5h4v5"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>',
};

function renderTimeline(res: Result) {
  const sum = (pred: (s: Slice) => boolean) => res.slices.filter(pred).reduce((a, s) => a + s.amount, 0);
  const pension = !state.zusAsTax ? res.pensionContrib : 0;
  const payroll = sum((s) => s.payer === 'employer' || s.payer === 'you') + pension;
  const pit = sum((s) => s.id === 'pit');
  const vat = sum((s) => s.id === 'vat'), exc = sum((s) => s.id === 'excise');
  const local = res.slices.filter((s) => s.payer === 'local');
  const b2b = state.contract === 'b2b';
  const items: string[] = [];
  items.push(tl('pay', 'g-zus', 'Co miesiąc, zanim pieniądze trafią na Twoje konto', b2b ? 'Przelewasz sam: ZUS, NFZ i PIT' : 'Pracodawca potrąca i przelewa za Ciebie',
    b2b
      ? `Do 20. dnia następnego miesiąca wysyłasz do ZUS składki społeczne i zdrowotną, a do urzędu skarbowego zaliczkę na podatek. Razem <span class="amt">${zl(payroll / 12)}</span> miesięcznie. Fakturując z VAT, co miesiąc do 25. rozliczasz też VAT pobrany od klientów, ale to pieniądze klientów, nie Twój koszt.`
      : `Co miesiąc pracodawca przelewa za Ciebie <span class="amt">${zl(payroll / 12)}</span>: do ZUS (emerytura, renta, chorobowe, NFZ) i do urzędu skarbowego (podatek). Na pasku płacowym widzisz tylko część tej kwoty.${more('Terminy: składki do ZUS do 15. dnia następnego miesiąca (firmy z osobowością prawną, np. sp. z o.o.) albo do 20. (pozostali pracodawcy). ZUS przekazuje składkę zdrowotną do NFZ. Zaliczkę na podatek pracodawca wpłaca do urzędu skarbowego do 20.')}`));
  items.push(tl('shop', 'g-vat', 'Codziennie, przy każdym zakupie', 'VAT w cenie: sklep płaci, Ty finansujesz',
    `Około <span class="amt">${zl(vat / 12)}</span> miesięcznie. VAT jest już wliczony w każdą cenę – na paragonie widać go na samym dole.${more('Sklep odprowadza VAT do urzędu skarbowego do 25. dnia następnego miesiąca. Stawki: 5% podstawowa żywność i książki, 8% m.in. jedzenie w restauracji, leki, bilety, 23% pozostałe rzeczy.')}`));
  items.push(tl('fuel', 'g-akcyza', 'Na stacji, przy rachunku za prąd, w sklepie z alkoholem', 'Akcyza i opłaty: płaci producent, Ty w cenie',
    `Około <span class="amt">${zl(exc / 12)}</span> miesięcznie. Akcyza to dodatkowy podatek na paliwo, prąd, alkohol i papierosy. Płaci go producent, a Ty w cenie. VAT liczy się nawet od akcyzy – to podatek od podatku.${more('Akcyza trafia do budżetu państwa, opłata paliwowa do Krajowego Funduszu Drogowego i Funduszu Kolejowego, opłata emisyjna do funduszu ochrony środowiska.')}`));
  if (local.length) items.push(tl('home', 'g-lokalne', 'W ratach, kilka razy w roku', local.some((s) => s.id === 'rtv') ? 'Opłaty dla gminy i abonament RTV' : 'Opłaty dla gminy',
    local.map((s) => `${esc(s.label)}: <span class="amt">${zl(s.amount)}</span> rocznie`).join(' · ') + '. ' + (local.some((s) => s.id === 'property') ? (R.deadlines.find((d) => d.id === 'property')?.what ?? '') : 'Opłatę za śmieci płacisz gminie w terminach, które ustala rada gminy (zwykle co miesiąc lub co kwartał).')));
  items.push(tl('doc', 'g-pit', b2b ? 'Raz w roku: do 30 kwietnia' : 'Raz w roku: od 15 lutego do 30 kwietnia', b2b ? 'Roczne zeznanie (PIT-36 / PIT-36L / PIT-28)' : 'Roczny PIT-37: wyrównanie',
    b2b ? `Rozliczasz cały rok i dopłacasz albo dostajesz zwrot. Twój podatek za rok: <span class="amt">${zl(pit)}</span>.`
      : `Urząd sprawdza, czy pracodawca pobrał dobry podatek. Twój podatek za cały rok: <span class="amt">${zl(pit)}</span>${res.labor[0].childReliefUsed ? ' (po uldze na dzieci)' : ''}. Jeśli pobrano za dużo – dostajesz zwrot.${more('Zeznanie przygotowuje automatycznie usługa Twój e-PIT. Około 86% wpływów z PIT trafia do gmin, powiatów i województw (plan na 2026 r.: 193,8 z 225,9 mld zł).')}`));
  $('#timeline').innerHTML = items.join('');
}
const more = (t: string) => `<details class="tl-more"><summary>Szczegóły</summary><span>${t}</span></details>`;
const tl = (icon: string, g: string, when: string, title: string, text: string) =>
  `<li class="tl ${g}"><span class="tl-ico" aria-hidden="true">${ICONS[icon]}</span><div><p class="tl-when">${when}</p><h3>${title}</h3><div class="tl-text">${text}</div></div></li>`;

function renderCalendar(res: Result, groups: { key: string; amount: number }[], base: number) {
  const y = R.meta.year;
  const fd = freedomDay(res.share, y);
  const days = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365;
  const fdStr = fd.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  $('#cal-title').textContent = `Twój dzień wolności podatkowej: ${fdStr}`;
  $('#cal-lead').textContent = `Wyobraź sobie, że wszystko, co zarabiasz od 1 stycznia, idzie najpierw na podatki i składki. Wtedy dopiero od ${fdStr} pracowałbyś dla siebie. Każdy kwadracik to jeden dzień roku.`;
  // Przypisz dni do grup proporcjonalnie (kolejność jak na pasku płacowym).
  const seq: string[] = [];
  let acc = 0;
  for (const g of groups) { acc += (g.amount / base) * days; while (seq.length < Math.round(acc)) seq.push(g.key); }
  while (seq.length < days) seq.push('you');
  const months = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
  let d = 0; const rows: string[] = [];
  const fdIndex = Math.round(res.share * days);
  for (let mo = 0; mo < 12; mo++) {
    const len = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
    const cells: string[] = [];
    for (let k = 0; k < len; k++, d++) cells.push(`<i class="${cssGroup(seq[d])}${d === fdIndex ? ' fd' : ''}"></i>`);
    rows.push(`<div class="cal-row"><b>${months[mo]}</b><div class="cal-days">${cells.join('')}</div></div>`);
  }
  const cal = $('#cal'); cal.innerHTML = rows.join('');
  cal.setAttribute('aria-label', `Kalendarz ${y}: od 1 stycznia do ${fdStr} dni przypadają na podatki i składki, potem dla Ciebie.`);
  $('#cal-legend').innerHTML = [...groups.map((g) => g.key), 'you'].map((k) => {
    const n = seq.filter((s) => s === k).length;
    return `<li><span class="dot ${cssGroup(k)}"></span><span><b>${GROUPS[k as keyof typeof GROUPS].label}</b></span><span class="num">${n} ${n === 1 ? 'dzień' : 'dni'}</span></li>`;
  }).join('');
  const c = workClock(res.share);
  $('#clock-title').textContent = `W 8-godzinnym dniu pracy: od 8:00 do ${c.h}:${String(c.m).padStart(2, '0')} pracujesz na podatki i składki, potem dla siebie`;
  const clock = $('#clock');
  clock.innerHTML = [...groups.map((g) => `<span class="${cssGroup(g.key)}" style="width:${(g.amount / base) * 100}%" title="${GROUPS[g.key as keyof typeof GROUPS].label}"></span>`), `<span class="g-you" style="flex:1"></span>`].join('');
  clock.setAttribute('aria-label', `Dzień pracy: ${c.minutes} z 480 minut przypada na podatki i składki.`);
}

function renderWhere(res: Result) {
  const items = whereItGoes(res.taxes + (!state.zusAsTax ? res.pensionContrib : 0), R).sort((a, b) => b.amount - a.amount);
  const max = items[0]?.amount || 1;
  $('#where-title').textContent = `Twoje ${zl(per(res.taxes + (!state.zusAsTax ? res.pensionContrib : 0)))} ${perLabel()}: na co idą`;
  $('#where').innerHTML = items.map((f) => `<li><span><b>${esc(f.label)}</b><small>${esc(f.plain)}</small></span><span class="num">${zl(per(f.amount))}<small> ${perLabel()}</small></span><span class="bar"><span style="width:${(f.amount / max) * 100}%"></span></span></li>`).join('');
}

function renderReturns(res: Result) {
  const c = R.context;
  const perCap = c.govSpendingTotal / c.population;
  const fn = (id: string) => R.cofog.functions.find((f) => f.id === id)?.share ?? 0;
  const ctx = R.context;
  const paid = res.taxes + (!state.zusAsTax ? res.pensionContrib : 0);
  const persons = Math.max(state.persons, state.partner ? 2 : 1);
  const cmp = paid / persons;
  $('#returns').innerHTML = `
    <div class="ret"><span class="kicker">Wszystkie wydatki państwa</span><span class="num">${zl(perCap)}</span><p>rocznie na jednego mieszkańca (${c.govSpendingYear} r.)</p></div>
    <div class="ret"><span class="kicker">W tym zdrowie</span><span class="num">${zl(perCap * fn('health'))}</span><p>na osobę rocznie: szpitale, lekarze, leki refundowane</p></div>
    <div class="ret"><span class="kicker">W tym edukacja</span><span class="num">${zl(perCap * fn('education'))}</span><p>na osobę rocznie: szkoły, przedszkola, uczelnie</p></div>
    <div class="ret"><span class="kicker">W tym emerytury i renty</span><span class="num">${zl(perCap * fn('pensions'))}</span><p>na osobę rocznie: emerytury, renty z tytułu niezdolności do pracy, renty rodzinne</p></div>
    <div class="ret wide"><p class="ret-big">Państwo wydaje średnio <strong>${zl(perCap)}</strong> rocznie na każdego mieszkańca – na dzieci, uczniów, emerytów i chorych też. Ty dziś wpłacasz <strong>${zl(cmp)}</strong> rocznie${persons > 1 ? ' na osobę w gospodarstwie' : ''}.</p><p class="ret-big">Tak działa system: w wieku pracy wpłaca się więcej niż średnia, a jako dziecko, w czasie nauki, choroby i na emeryturze dostaje się więcej, niż się wpłaca.</p>
    <details class="why"><summary>Deficyt i jak ostrożnie liczymy</summary><div><p>Państwo wydaje więcej, niż zbiera: w ${c.deficitYear} r. deficyt wyniósł ${c.deficitPctGdp.toLocaleString('pl-PL')}% PKB. Różnicę pokrywa dług publiczny, a jego odsetki (w 2024 r. ok. 4,9% wszystkich wydatków) płaci się z kolejnych podatków.</p><p>Dla porównania: wpływy z VAT w ${c.taxToGdpYear} r. to średnio ${zl(ctx.vatPerCapita)}, a z akcyzy ${zl(ctx.excisePerCapita)} na każdego mieszkańca rocznie. Nasz szacunek VAT i akcyzy w Twoich zakupach jest ostrożny: obejmuje tylko podatki wliczone w ceny towarów i usług kupowanych przez gospodarstwa domowe, a ludzie w badaniach GUS zwykle zaniżają wydatki na alkohol i papierosy. Rzeczywista kwota jest więc raczej wyższa. Wszystkie podatki i składki w Polsce to ${c.taxToGdp.toLocaleString('pl-PL')}% PKB (średnia UE: ${c.euTaxToGdp.toLocaleString('pl-PL')}%).</p></div></details></div>`;
}

function renderFitNote(res: Result) {
  const q = res.consumption.quintile;
  $('#fit-note').textContent = `Do szacunku zakupów przyjęto wydatki ${zl(res.consumption.spending / 12)} miesięcznie (gospodarstwa z ${q}. grupy dochodowej GUS, odkładane ${Math.round(res.consumption.savingsRate * 100)}% dochodu).`;
}

/* ---------- Obrazek do udostępnienia (bez kwot) ---------- */
const SITE_HOST = (() => { try { return new URL(import.meta.env.SITE).host; } catch { return 'ileoddajesz.pl'; } })();
function drawShare(res: Result, groups: { key: string; amount: number }[], base: number) {
  // Canvas nie czeka na czcionki sam – rysujemy po ich wczytaniu (i od razu, jako wersję zapasową).
  const fonts = ['700 150px Sora', '600 40px Sora', '500 30px Inter', '600 24px Inter'];
  if (document.fonts) {
    Promise.all(fonts.flatMap((f) => [document.fonts.load(f, 'Aa'), document.fonts.load(f, 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ')])).then(() => drawShareNow(res, groups, base)).catch(() => {});
  }
  drawShareNow(res, groups, base);
}
function drawShareNow(res: Result, groups: { key: string; amount: number }[], base: number) {
  const cv = $<HTMLCanvasElement>('#share-canvas'); const ctx = cv.getContext('2d'); if (!ctx) return;
  const css = getComputedStyle(document.documentElement);
  const col = (k: string) => css.getPropertyValue(`--c-${k}`).trim() || '#888';
  ctx.fillStyle = '#f7f4ee'; ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = '#1c1a17'; ctx.font = '600 40px Sora, Inter, sans-serif'; ctx.fillText('Z każdych 100 zł kosztu mojej pracy', 64, 110);
  ctx.font = '700 150px Sora, Inter, sans-serif'; ctx.fillStyle = '#2f4bdb'; ctx.fillText(`${Math.round(res.share * 100)} zł`, 60, 270);
  ctx.fillStyle = '#1c1a17'; ctx.font = '600 40px Sora, Inter, sans-serif'; ctx.fillText('trafia do państwa', 64, 330);
  const fd = freedomDay(res.share, R.meta.year).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  ctx.font = '500 30px Inter, sans-serif'; ctx.fillStyle = '#5d584f'; ctx.fillText(`Mój dzień wolności podatkowej: ${fd}`, 64, 392);
  // pasek
  let x = 64; const w = 1072, y = 430, h = 54;
  for (const g of groups) { const gw = (g.amount / base) * w; ctx.fillStyle = col(g.key); ctx.fillRect(x, y, gw, h); x += gw; }
  ctx.fillStyle = col('you'); ctx.fillRect(x, y, 64 + w - x, h);
  ctx.font = '500 22px Inter, sans-serif'; let lx = 64, ly = 532;
  for (const k of [...groups.map((g) => g.key), 'you']) {
    const label = GROUPS[k as keyof typeof GROUPS].label; const w2 = ctx.measureText(label).width + 58;
    if (lx + w2 > 1150) { lx = 64; ly += 30; }
    ctx.fillStyle = col(k); ctx.fillRect(lx, ly, 18, 18); ctx.fillStyle = '#1c1a17'; ctx.fillText(label, lx + 26, ly + 17); lx += w2;
  }
  ctx.fillStyle = '#5d584f'; ctx.font = '600 24px Inter, sans-serif'; ctx.fillText(`Sprawdź swoje: ${SITE_HOST}`, 64, 612);
}

/* ---------- Zdarzenia ---------- */
function reveal(scroll: boolean) {
  $('#results').hidden = false;
  render();
  if (scroll) $('#wynik').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

calc.addEventListener('input', () => { readCalc(); if (!$('#results').hidden) render(); });
calc.addEventListener('change', () => { readCalc(); if (!$('#results').hidden) render(); });
calc.addEventListener('submit', (e) => {
  e.preventDefault(); readCalc();
  if (!state.amount) { $<HTMLInputElement>('#amount').focus(); return; }
  if (state.guess == null && $('#results').hidden) { $('#zgadnij').hidden = false; $('#zgadnij').scrollIntoView({ behavior: 'smooth' }); $<HTMLInputElement>('#guess').focus(); }
  else reveal(true);
});
$<HTMLInputElement>('#amount').addEventListener('blur', (e) => { const t = e.target as HTMLInputElement; const n = parseNum(t.value); if (n != null) t.value = Math.round(n).toLocaleString('pl-PL'); });
const guess = $<HTMLInputElement>('#guess');
let guessTouched = false;
guess.addEventListener('input', () => { guessTouched = true; $('#guess-out').textContent = `${guess.value} zł`; });
$('#guess-go').addEventListener('click', () => { state.guess = guessTouched ? Number(guess.value) : undefined; $('#zgadnij').hidden = true; reveal(true); });
$('#guess-skip').addEventListener('click', () => { state.guess = undefined; $('#zgadnij').hidden = true; reveal(true); });
fit.addEventListener('input', () => { readFit(); render(); });
fit.addEventListener('change', () => { readFit(); render(); });
fit.addEventListener('submit', (e) => e.preventDefault());
$<HTMLInputElement>('#zusAsTax').addEventListener('change', (e) => { state.zusAsTax = (e.target as HTMLInputElement).checked; render(); });
$$('[data-period]').forEach((b) => b.addEventListener('click', () => { state.period = b.dataset.period as 'm' | 'y'; render(); }));

$('#share-img').addEventListener('click', () => {
  const cv = $<HTMLCanvasElement>('#share-canvas');
  cv.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ile-oddaje.png'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    $('#share-msg').textContent = 'Obrazek zapisany.';
  }, 'image/png');
});
$('#share-link').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); $('#share-msg').textContent = 'Link skopiowany.'; }
  catch { $('#share-msg').textContent = 'Skopiuj adres z paska przeglądarki.'; }
});

// Start: jeśli link zawiera ustawienia, od razu pokaż wynik.
readCalc(); readFit();
if (readHash()) { readFit(); reveal(false); }
void last;

// Stopniowe odsłanianie: dalsze sekcje i więcej produktów po kliknięciu.
$('#more-btn')?.addEventListener('click', (e) => {
  const btn = e.currentTarget as HTMLButtonElement;
  $('#more').hidden = false; btn.setAttribute('aria-expanded', 'true'); $('#more-gate').hidden = true;
  $('#kiedy').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
$('#prod-more')?.addEventListener('click', (e) => { $('#prod-list').classList.remove('collapsed'); (e.currentTarget as HTMLElement).hidden = true; });
// „Dopasuj” na pasku: odsłoń resztę strony przed przewinięciem.
$$('a[href="#dopasuj"]').forEach((a) => a.addEventListener('click', () => { $('#more').hidden = false; $('#more-gate').hidden = true; }));
