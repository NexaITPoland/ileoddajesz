# World survey: "how much tax do I really pay, and where does it go" tools

Surveyed 2026-11-27. Evidence levels:
- **[LIVE]**: used hands-on in Chrome with a sample salary, screenshots inspected.
- **[WEB]**: read from the tool's own page or press coverage, not used hands-on.
- **[KNOWN]**: described from prior knowledge of a historic or login-only tool; check before quoting.

Blocked or unreachable: Fraser Institute (Cloudflare bot check, not bypassed), ATO and economie.gouv.fr (HTTP 403 to fetchers), NPR article (timeout).

---

## 1. Adam Smith Institute: "The 2026 Tax Calculator" (UK) [LIVE]
- **URL:** https://adam-smith-institute.github.io/tax-calculator/
- **Inputs:** tax year toggle (2026-27 "this year" or 2027-28 "after Budget 2026"), age, annual salary, checkbox "Include the National Insurance my employer pays", self-employment profit. Collapsed accordions for savings/investments, renting out property, pensions, allowances/Child Benefit.
- **Computed:** direct taxes only (income tax, employee NI, optional employer NI). No VAT or excise. Employer NI is shown as "76% of £4,500". The tool assumes about 76% of employer NI is passed on to the worker and states this incidence assumption on the line itself.
- **Sample result (salary £35,000, employer NI on):** one hero number, "£9,700 a year", then "Average tax rate 25.3%" with a (?) tooltip. Below that, a three-row mini receipt (income tax £4,486, NI £1,794, employer NI £3,420) and a "+ How it is worked out" expander. Also the line "Your tax would be the same in 2027-28".
- **"Where it goes" tab:** a donut with the user's total in the centre, next to a colour-keyed table with columns "Your tax" (£) and "In £1" (pence). Rows: welfare and pensions £2,857 / 29p, health £2,095 / 22p, education £1,023 / 11p, debt interest £898 / 9.3p, defence £532 / 5.5p … overseas aid £58 / 0.6p. **Clicking a row drills down.** The donut redraws to that category (e.g. Education £1,023) and lists sub-programmes with plain-language notes, e.g. secondary schools £495 or primary schools £275, plus honest caveats ("Understated: the Department records all academy spending as secondary"). Includes a "← All spending" back link, "Show as a table", and "About these figures" with sources (PESA Table 5.2, OSCAR II).
- **Great:** one big number first, then breakdown; values shown in both your pounds and pence per £1; drill-down to recognisable things like schools; caveats written in plain words; a **"Download image to share"** button; a before/after-budget toggle; employer cost is opt-in and its assumption is stated.
- **Confusing:** the "76% incidence" is correct but opaque to laypeople. The donut has 14 slices and the small ones can't be read. Showing £0 before the first input looks broken.
- **Techniques:** progressive disclosure (accordions, drill-down), share card, explained sources, hypothetical toggle.

## 2. Bund der Steuerzahler "Belastungs-Check" / Steuerzahlergedenktag (Germany) [LIVE]
- **URL:** https://www.steuerzahler.de/belastungs-check/ (redirect from /steuerzahlergedenktag)
- **Flow:** a full-width wizard, **one question per screen**, with large rounded buttons and a "Weiter" (next) button. It starts with "Ich lebe allein" vs "Ich lebe mit anderen Personen zusammen", then sections with coloured headers and icons (EINKOMMENSSITUATION in red with coin stacks, STEUERN UND ABGABEN in mauve with a money bag).
- **Inputs:** monthly gross on a slider (**pre-set to the national average**, labelled "Voreingestellt ist der Bundesdurchschnitt"), side income on a slider, then income tax + Soli per month (pre-filled with an average). Consumption questions follow for the indirect taxes.
- **Interim screens ("Zwischenstand"):** after each section the tool shows your figure next to the national average, e.g. "Ihr monatliches Gesamteinkommen 5,378 €" vs "Bundesdurchschnitt 5,472 €". Here gross plus employer social contributions is presented as your real total income. Then "Ihre direkten Monatsabzüge 2,512 €" vs average.
- **Computed:** the most complete burden of all the tools: income tax, Soli, all social contributions **including the employer share and levies** (U1/U2, insolvency, accident insurance), indirect taxes (VAT, energy tax, CO2 levy, alcohol and tobacco), plus "quasi-taxes" (electricity levies, the €18.36 broadcasting fee). Final output is a burden % and **your personal date** of working for the state. National 2026 figures: 53.1%, 13 July; singles 54.0%, 17 July.
- **Methodology page:** long expandable text explaining the data (Destatis household budget survey), the assumptions, and a worked example of the average household: €8,139 total income → €981 income tax + €2,627 social contributions + €717 indirect taxes = €4,325 → 193 of 365 days.
- **Great:** sensible defaults so a user can just click "Weiter"; comparison with the average at every step; a calendar date as the headline metaphor; employer cost made visible as "your money".
- **Confusing / anti-patterns:** it asks users to **type in their own income tax**, which most people don't know. The calculator should compute it. A **live red debt clock** runs in the site header ("Staatsverschuldung", "Neuverschuldung pro Sekunde", "Zinsen pro Sekunde", "Schulden pro Kopf"), which is alarmist framing. Advocacy tone, with a "Mitglied werden" CTA. The tool is inside an iframe, which hurts accessibility and linking.
- **Techniques:** wizard, defaults equal to average, interim feedback, calendar day, social comparison.

## 3. Fraser Institute: Personal Tax Freedom Day calculator (Canada) [WEB]
- **URL:** https://www.fraserinstitute.org/tax-freedom-day-calculator (behind a bot-check wall)
- **Inputs (per coverage):** province, family type, income. The calculator estimates **all** taxes: income, payroll, health, sales (GST/HST), property, fuel, carbon, liquor/tobacco, import duties, profit taxes attributed to households.
- **Output:** your personal Tax Freedom Day. National 2026 figures: 9 June, average family pays CAD 72,539 on CAD 166,790 (43.5%). There is also a "Balanced Budget Tax Freedom Day" (25 June) that counts the deficit as deferred taxes.
- **Great:** one memorable date, a provincial comparison, and a "deficit = future taxes" variant.
- **Confusing / criticized:** Oxfam Canada and others argue it ignores benefits received and that it uses family income definitions that inflate the burden. It is a press-release product as much as a tool.
- **Techniques:** calendar metaphor, personal vs national, deficit variant.

## 4. HMRC Annual Tax Summary (UK, official) [WEB + KNOWN]
- **URL:** https://www.gov.uk/annual-tax-summary (login via Personal Tax Account)
- **Inputs:** none, because it uses the user's real data.
- **Computed:** income tax + employee NI actually paid; average rate; then "**how your tax was spent**" as £ per spending category (welfare, health, state pensions, education, debt interest, defence…, around 15 rows) in a simple table/bar format. Excludes VAT and employer NI.
- **Great:** a government-official, personal, annual "receipt" with zero input effort.
- **Confusing:** it ignores the employer NI and VAT the user also bears. Static, with no drill-down. Hidden behind a login. Paper copies stopped in 2020, so few people see it.
- **Techniques:** receipt format, personal annual statement.

## 5. ATO Tax Receipt (Australia, official) [WEB]
- **URL:** https://www.ato.gov.au/individuals-and-families/your-tax-return/your-notice-of-assessment/tax-receipt (sent to myGov inbox)
- **Inputs:** none. Issued automatically with the notice of assessment when income tax is AUD 100 or more.
- **Computed:** income tax (+ Medicare levy) split across **about 20 expenditure categories** (welfare, health, defence, education, recreation & culture, general public services, debt interest…). It is a printed receipt, with a dollar figure per line. The 2014 Treasury launch published sample receipts for fixed incomes (e.g. AUD 5,000 and AUD 20,000 of tax).
- **Great:** an automatic, personal, receipt format that is familiar from shopping.
- **Confusing:** GST and excise are not included. The categories use budget jargon. It was introduced with a political message.
- **Techniques:** receipt, personalisation, sample personas.

## 6. White House "Federal Taxpayer Receipt" (US, 2011–2015, discontinued) [KNOWN]
- **Inputs:** income tax paid, Social Security tax, Medicare tax (or estimated from income).
- **Output:** a long receipt with **cents-level line items**, e.g. hundreds of dollars for Medicare, a few dollars for the NEA, a few cents for specific small programmes. Total = taxes paid.
- **Great:** extreme concreteness, and it drew a lot of media attention ("$x for…").
- **Criticized:** it ignores deficit-financed spending (federal spending was around 1.5× revenue), which implicitly suggests taxes cover everything. Many line items are too granular to mean anything. The tool died with the administration because it had no institutional owner.
- **Techniques:** receipt, granular line items.

## 7. National Priorities Project "Tax Receipt" (US, NGO, annual) [WEB]
- **URL:** https://www.nationalpriorities.org/ (Tax Day 2026 edition; notes at /analysis/2026/tax-day-2026/tax-day-2026-notes-and-sources/)
- **Inputs:** income / taxes paid (interactive "your tax receipt").
- **Output:** a per-taxpayer receipt of federal income tax use, grouped (military, health incl. Medicare/Medicaid/NIH, nutrition incl. SNAP/school lunch, science NASA/NSF, transport…), with headline framing of "$4,049 for war and the Pentagon per average taxpayer".
- **Great:** named, recognisable programmes and solid published notes.
- **Anti-pattern:** strongly editorialised category grouping (e.g. "militarization"), which shows how category choice alone creates a narrative. **A neutral tool should use official COFOG functions.**

## 8. LLRI/LFMI "Moku mokesčius" (Lithuania, 2014–) [WEB]
- **URL:** https://mokumokescius.lt (project page: https://en.llri.lt/project-initiative/mokumokescius-lt/)
- **Inputs:** **net** wage (what people actually know), monthly spending by category of goods/services.
- **Computed:** full burden: income tax, Sodra (social insurance) and health contributions **including employer-paid parts**, Guarantee Fund, **VAT on consumption and excise on fuel/alcohol/tobacco**. Then how the state spends it (pensions, health, education, police, defence).
- **Format:** a "story-telling journey through a personalized tax and government-expenditure universe" that ends in a personal tax "bill".
- **Reach:** 25,600 sessions in its first week, a media partnership with the largest portal (Delfi), and outdoor ads in seven cities.
- **Great:** **starts from net pay** and works backwards to the hidden taxes; spending categories make VAT tangible; narrative journey; the closest analogue to the Polish project.
- **Techniques:** storytelling, net-first input, spending-based VAT estimate, receipt/bill.

## 9. Institut économique Molinari: "Tax burden of the typical EU employee / Tax Liberation Day" [WEB]
- **URL:** https://www.institutmolinari.org/2026/07/21/the-average-european-employee-worked-until-june-12th-... (annual since 2010, computed by EY)
- **Inputs:** none (average-wage persona per country).
- **Computed:** employer + employee social contributions + income tax + **estimated VAT**, giving a "real tax rate" on the **"real gross salary" (super-gross = employer cost)**. EU-27 2026: 44.6%, liberation day 12 June; France 55.6% / 22 July; Poland +2 days vs 2025.
- **Visuals:** a calendar graphic with each country's day; a Datawrapper map of rates; a podium; a table "what's left of €100 of employer cost as real purchasing power" and the **step-down from employer cost to purchasing power**.
- **Great:** the "€100 of employer cost → €X you actually spend" framing is very easy to understand, and the cross-country context.
- **Confusing:** persona-only, with no personal input; advocacy framing ("champions of compulsory taxation").
- **Techniques:** €100 normalisation, waterfall from employer cost, calendar, international comparison.

## 10. Den daňové svobody (Czech Republic, Liberální institut) [WEB]
- **URL:** https://dendanovesvobody.cz/
- **Computed:** a **national** metric, not personal: government outlays / GDP (spending side, so deficits count). 2026: 29 May, day 149. Series from 2000 to 2026 (highest 176 days in 2003, lowest 137 in 2017).
- **Visuals:** an interactive year-by-year chart; "of every 1,000 CZK earned, X CZK is under your control"; contrasted with Deloitte's revenue-based method.
- **Great:** a long time series and a clear method comparison (spending-based vs revenue-based give different days, which is important to explain).
- **Missing:** a personal calculator. No VAT/excise split.
- **Techniques:** calendar, per-1,000 normalisation, time series.

## 11. France "À quoi servent mes impôts ?" (economie.gouv.fr/aqsmi) [WEB]
- **URL:** https://www.economie.gouv.fr/aqsmi/ (official; returns 403 to fetchers)
- **Inputs (historic simulator, launched 2018):** the amount of income tax paid. Output: euros per public function.
- **Content:** a **"for 1,000 € of public spending"** breakdown (social protection 561 €, education 88 €, debt, defence, research…), and a **"100 € of taxes collected: households 37 €, companies 30 €, administrations 7 €, indirect taxes 26 €"** infographic. Plus explainer pages ("what different taxes do we pay", "taxes to reduce inequalities").
- **Great:** official, neutral, normalised to round numbers, and explains *who* pays as well as *what for*.
- **Confusing:** the simulator only takes income tax, which in France is a small share of what people pay. This understates the real burden versus CSG, social contributions, and VAT.
- **Techniques:** 100/1,000 normalisation, explainer articles.

## 12. OECD "Taxing Wages" (+ country notes / tax wedge) [KNOWN]
- **URL:** https://www.oecd.org/tax/taxing-wages (annual)
- **Computed:** the **tax wedge**: (income tax + employee + employer SSC − cash benefits) / total labour cost, for 8 household types at multiples of the average wage. Excludes VAT. Poland's average-wage single tax wedge is usually in the mid-30s %, below the OECD average.
- **Visuals:** stacked bars per country (income tax / employee SSC / employer SSC), and a household-type selector.
- **Great:** the **authoritative, neutral benchmark** and the "total labour cost" denominator. **Includes benefits** (net of cash transfers) for families.
- **Confusing:** technical vocabulary ("wedge", "AW 67%"). Not personalised.
- **Use for us:** reuse its method for the labour part, and cite it for neutrality and the international comparison.

## 13. Where Does My Money Go? (OpenSpending / mySociety, UK, 2009–~2014, dead) [KNOWN]
- **Inputs:** income (and later daily-spend framing).
- **Output:** the famous **"daily bread"**: your tax converted into **£ per day**, split across functions with icons (e.g. "health £3.12/day, education £1.87/day"), plus a zoomable bubble chart of departments.
- **Great:** per-day units are tiny, concrete, and comparable to a coffee; icons work for low literacy.
- **Lesson:** a volunteer project with no maintenance budget died. **Plan yearly data updates from day one.**

## 14. Swedish "dolda skatter" (Skattebetalarna / Timbro / Svenskt Näringsliv) [WEB]
- **Sources:** Skattebetalarna reports "Svenska folket underskattar skatt" (2024), the "Sofias skatter" persona PDF, and the Timbro report "Dolda skatter" (2023).
- **Technique:** a **persona story** ("Sofia's taxes: what do you really earn?") goes from employer cost → payslip → spending. It shows the "allmän löneavgift" (11.62% of salary, unrelated to any benefit) and electricity tax, stamp duty, etc. Surveys show **people underestimate their total tax**, and the gap is used as a hook ("guess first").
- **Great:** an evidence base for "guess first", plus a named persona.
- **Missing:** a live personal calculator (I didn't find one).

## 15. Tax Policy Associates UK tax calculator / IFS spending explorer [WEB]
- **URLs:** https://taxpolicy.org.uk/uk-tax-calculator/ ; https://ifs.org.uk/calculators/where-and-how-does-government-spend-its-money
- **TPA:** a **marginal-rate chart across all incomes** that shows cliff edges. You can compare Scotland vs rUK and party proposals. Useful pattern: a curve, with "you are here".
- **IFS:** spending by function over time and by region (≈£1.2tn, 39.9% of GDP 2024-25), with neutral academic tone and no personal receipt.

## Poland: existing landscape [WEB]
- No Polish calculator was found that combines salary + VAT/excise + spending. Existing tools are separate brutto-netto calculators (podatki.gov.pl "kalkulator taryfowy", Omni, money.pl, infor) and VAT calculators.
- **WEI "Całkowity ciężar podatkowy" (2023, PDF):** https://wei.org.pl/wp-content/uploads/2023/10/Calkowity-ciezar-podatkowy.pdf. It estimates local taxes/fees at about 2.4% of average gross income and excise at up to 26% of monthly spending on selected goods. **This is the closest methodological base.**
- Press pieces on hidden taxes in prices (e.g. superbiz.se.pl): about 75.8% of a 0.5 l vodka price is tax; for cigarettes 6.90 zł excise + 3.89 zł VAT per pack; petrol 95 would cost about 3.33 zł/l without taxes. These are ready-made "everyday item" examples, but verify them against current rates.
- Molinari 2026 notes Poland's burden rose (+2 days).
- **There is a clear gap in the market.**

---

## Top 15 patterns to adopt

1. **One hero number, then the breakdown.** ASI shows "£9,700 a year" + average rate before anything else. For us: "Na państwo pracujesz X zł miesięcznie / Y% całego kosztu Twojej pracy".
2. **Start from the number people know: net pay (na rękę), with gross as an alternative.** LLRI uses net wage. BdSt asking users for their own income tax is the counter-example.
3. **Pre-fill defaults with the national average** so a user can click through without knowing anything (BdSt "Voreingestellt ist der Bundesdurchschnitt"). Sliders + typed input.
4. **Make the employer cost visible as "your money".** Use a waterfall/step-down: *całkowity koszt pracodawcy → brutto → netto → po VAT/akcyzie → realna siła nabywcza* (Molinari's step-down, BdSt "Gesamteinkommen"). This is the core "aha" for Poland (ZUS pracodawcy, FP, FGŚP, PPK).
5. **Estimate VAT/excise from a few simple spending sliders or household personas**, not a shopping diary. LLRI uses spending categories; BdSt uses household-survey averages. Use GUS "Budżety gospodarstw domowych" averages as defaults per income decile, with optional toggles (palę / jeżdżę autem / piję alkohol), because excise varies hugely with these.
6. **Personal calendar day ("Twój Dzień Wolności Podatkowej").** Show a 12-month strip with days coloured by what they "pay for": ZUS, NFZ, PIT, VAT, akcyza, then "dla siebie". It is a memorable, shareable metaphor (Fraser, BdSt, Molinari). Phrase it neutrally: "do tego dnia Twoje zarobki statystycznie pokrywają podatki i składki".
7. **Normalise to 100 zł and to per-day amounts.** "Z każdych 100 zł kosztu Twojej pracy…" (Molinari €100, France 100 €/1,000 €, ASI "in £1"). "Dziennie płacisz 4,10 zł na szkoły" (WDMMG daily bread).
8. **The receipt (paragon) format for "where it goes".** Polish shoppers know paragony. Use real category amounts with icons, from COFOG functions (ATO, HMRC, White House, NPP). It can double as the share image.
9. **Click-to-drill-down from category to recognisable things** (ASI: Education → secondary schools £495 → note). E.g. Ochrona zdrowia → szpitale, leki refundowane; Emerytury → "Twoje składki opłacają dziś emerytury ~X osób". Keep it at 2 levels max.
10. **Everyday-item price anatomy.** Interactive "rozbierz cenę": litr benzyny, paczka papierosów, piwo, chleb (5% VAT), prąd. Show the bar split into producer/sklep/VAT/akcyza/opłata paliwowa. This makes "hidden" taxes tangible (Swedish dolda skatter, PL press examples).
11. **Guess first, then reveal.** Ask "Jak myślisz, ile procent oddajesz?" and compare it with the result. Swedish surveys show systematic underestimation, so the gap itself teaches. Show how others guessed (aggregate).
12. **Comparison anchors:** you vs the Polish average (BdSt Zwischenstand), Poland vs EU/OECD (Molinari map, OECD stacked bars), this year vs last year or a policy change (ASI 2026-27 vs 2027-28 toggle).
13. **Progressive disclosure + plain-language caveats.** Use "Jak to policzyliśmy" expanders, source links, and honest notes such as "uproszczenie: …" (ASI). Methodology belongs on its own page with a worked example of the average household (BdSt).
14. **Show the other side of the ledger, neutrally.** What you get back: benefits (800+, ulgi), healthcare value, future pension entitlement from składki emerytalne. Distinguish **taxes vs insurance-like contributions** (emerytalna = Twoje konto w ZUS). Mention the deficit (spending > revenue) as a footnote line, as Fraser's balanced-budget day does. OECD nets out cash benefits.
15. **Share card + stable personal URL.** Offer a one-click downloadable image (ASI "Download image to share"), e.g. "Mój Dzień Wolności Podatkowej: 14 czerwca", with a receipt thumbnail and no personal amounts by default (privacy). Parameters stay in the URL only if they are non-identifying, or in the hash. Plan a media launch around the date (LLRI got 25k sessions in week one through a portal partnership).

Bonus details: one question per screen on mobile (BdSt wizard); colour-coded sections that stay consistent from input to result; "Show as a table" alternative for accessibility (ASI); WHEN taxes are paid (monthly PIT/ZUS from payroll, VAT at each purchase, annual PIT-37 settlement) as a timeline of a typical month.

## Top 5 anti-patterns to avoid

1. **Asking for numbers people don't know** (BdSt asks for "your monthly income tax"). Compute it. Only ask for net or gross pay plus a few lifestyle toggles.
2. **Alarmist or advocacy framing:** live debt clocks ticking in red (BdSt header), "champions of taxation" wording (Molinari), "working for the government" language, membership CTAs. Editorial category groupings ("militarism", NPP) are the same problem. For neutrality, use official COFOG categories and descriptive verbs.
3. **Telling only half the story.** Direct-only tools (HMRC, ATO, France's income-tax-only simulator) understate the burden. Burden-only tools (Fraser, BdSt) ignore benefits received and deficits. Show both, and label pension contributions as deferred entitlement, not pure tax.
4. **Over-granular or unreadable charts:** 14-slice donuts with sliver categories (ASI), cents-level line items for obscure programmes (White House receipt), jargon labels ("tax wedge", "general public services"). Cap it at about 8 categories + "inne", and use icons and everyday words.
5. **Hidden or opaque assumptions:** unexplained incidence factors ("76% of employer NI"), mixing spending-based vs revenue-based "freedom days" (Czech vs Deloitte give different dates), stale data (BdSt forced to use 2022 data), and no update plan (WDMMG and the White House receipt died). State each assumption in one plain sentence next to the number it affects, and version the data by year.
