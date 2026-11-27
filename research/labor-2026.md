# Parametry opodatkowania pracy – Polska, rok 2026

*Stan na 27.11.2026. Plik maszynowy z tymi samymi danymi: [`labor-2026.json`](labor-2026.json).*

**Zasady.** Każdą liczbę odczytałem bezpośrednio ze źródła pierwotnego: tekst jednolity ustawy w ISAP/Dz.U., Monitor Polski, zus.pl, stat.gov.pl. Wartości wyliczone (np. kwoty roczne z miesięcznych) są oznaczone jako *wyliczone*. Serwisy wtórne (infakt, podatki.biz, pit.pl, money, bankier) posłużyły tylko do znalezienia aktu i zaznaczam je jako **[wtórne]**.

**Teksty jednolite, z których korzystałem:**

| Skrót | Akt | Stan prawny |
|---|---|---|
| PIT | ustawa o podatku dochodowym od osób fizycznych, t.j. [Dz.U. 2026 poz. 592](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000592) | 1.04.2026. Późniejsze nowelizacje (Dz.U. 2026 poz. 779, 1354, 1371, 1541) sprawdzone: nie zmieniają parametrów pracy na 2026. |
| SUS | ustawa o systemie ubezpieczeń społecznych, t.j. [Dz.U. 2026 poz. 1474](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260001474) | 4.10.2026 |
| UŚOZ | ustawa o świadczeniach opieki zdrowotnej…, t.j. [Dz.U. 2025 poz. 1461](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001461) ze zm. | Kwoty na 2026 potwierdzone dodatkowo w komunikacie ZUS z 2.02.2026 |
| Ryczałt | ustawa o zryczałtowanym podatku dochodowym…, t.j. [Dz.U. 2025 poz. 843](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250000843) ze zm. | Stawek z art. 12 nie zmieniono w 2026 |
| OP | Ordynacja podatkowa, t.j. [Dz.U. 2026 poz. 622](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000622) | |
| UB | ustawa budżetowa na rok 2026, [Dz.U. 2026 poz. 62](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000062) | |
| PPK | ustawa o pracowniczych planach kapitałowych, t.j. [Dz.U. 2026 poz. 192](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000192) | |

---

## 6. Wielkości makro (od nich zależy reszta, więc są na początku)

| Parametr | Wartość | Podstawa / źródło |
|---|---|---|
| Minimalne wynagrodzenie 2026 | **4 806 zł** | § 1 rozp. RM z 11.09.2025, [Dz.U. 2025 poz. 1242](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001242) |
| Minimalna stawka godzinowa 2026 | **31,40 zł** | § 2 tamże. Dotyczy zlecenia i umów o świadczenie usług, nie dzieła. |
| Prognozowane przeciętne wynagrodzenie 2026 | **9 420 zł** | art. 24 UB 2026; obwieszczenie MRPiPS z 19.11.2025, [M.P. 2025 poz. 1206](https://eli.gov.pl/eli/MP/2025/1206/ogl) |
| Roczny limit podstawy emerytalno-rentowej (30×) | **282 600 zł** | art. 19 ust. 1 i 10 SUS; [M.P. 2025 poz. 1206](https://eli.gov.pl/eli/MP/2025/1206/ogl) |
| Limit podstawy dobrowolnej chorobowej (250%) | **23 550,00 zł/mies.** | art. 20 ust. 3 SUS; [ZUS](https://www.zus.pl/baza-wiedzy/skladki-wskazniki-odsetki/skladki/wysokosc-skladek-na-ubezpieczenia-spoleczne) |
| Przeciętne wynagrodzenie w sektorze przedsiębiorstw (z wypłatami z zysku), IV kw. 2025 | **9 228,64 zł** | obwieszczenie Prezesa GUS z 22.01.2026, [M.P. 2026 poz. 117](https://eli.gov.pl/eli/MP/2026/117/ogl). Od tej kwoty liczy się składkę zdrowotną na ryczałcie w 2026. |
| Przeciętne wynagrodzenie w gospodarce narodowej, cały 2025 | **8 903,56 zł** | [komunikat GUS z 9.02.2026](https://stat.gov.pl/sygnalne/komunikaty-i-obwieszczenia/lista-komunikatow-i-obwieszczen/komunikat-w-sprawie-przecietnego-wynagrodzenia-w-gospodarce-narodowej-w-2025-r-,273,13.html) |
| Przeciętne wynagrodzenie, **III kw. 2026** (najnowszy kwartał) | **9 317,01 zł** | [komunikat GUS z 9.11.2026](https://stat.gov.pl/sygnalne/komunikaty-i-obwieszczenia/lista-komunikatow-i-obwieszczen/komunikat-w-sprawie-przecietnego-wynagrodzenia-w-trzecim-kwartale-2026-r-,271,54.html) |
| Przeciętne wynagrodzenie w sektorze przedsiębiorstw, **październik 2026** (najnowszy miesiąc) | **9 405,04 zł** | [komunikat GUS z 23.11.2026](https://stat.gov.pl/sygnalne/komunikaty-i-obwieszczenia/lista-komunikatow-i-obwieszczen/komunikat-w-sprawie-przecietnego-miesiecznego-wynagrodzenia-w-sektorze-przedsiebiorstw-bez-wyplat-nagrod-z-zysku-w-pazdzierniku-2026-r-,57,156.html) (bez nagród z zysku; firmy powyżej 9 osób) |
| **Mediana** wynagrodzeń w gospodarce narodowej, listopad 2025 | **7 432,00 zł** | [GUS, „Rozkład wynagrodzeń…” (publ. 6.05.2026)](https://stat.gov.pl/obszary-tematyczne/rynek-pracy/pracujacy-zatrudnieni-wynagrodzenia-koszty-pracy/rozklad-wynagrodzen-w-gospodarce-narodowej-w-listopadzie-2025-r-,32,23.html). Sektor prywatny 6 770,00; publiczny 8 687,21; firmy do 9 osób 4 666,00. Mediany za 2026 jeszcze nie ma, bo GUS nie robi tego badania co rok. |

---

## 1. PIT – skala podatkowa i pracownicy

| Parametr | Wartość | Podstawa (PIT, t.j. 2026 poz. 592, chyba że wskazano inaczej) |
|---|---|---|
| Stawki skali | **12% / 32%** | art. 27 ust. 1 |
| Próg | **120 000 zł** | art. 27 ust. 1. Podatek w II progu = 10 800 zł + 32% nadwyżki. |
| Kwota zmniejszająca podatek | **3 600 zł/rok** | art. 27 ust. 1 |
| Kwota zmniejszająca w zaliczce (PIT-2) | **300 zł/mies.** (1/12); albo 150 zł (1/24), albo 100 zł (1/36) | art. 31b ust. 1–3. Najwyżej 3 płatników, łącznie nie więcej niż 1/12. |
| „Kwota wolna” | **30 000 zł** | Wynika z 3 600 / 12%. Kwota 30 000 zł pada wprost w art. 31c ust. 2. |
| KUP z umowy o pracę, standardowe | **250 zł/mies.**, rocznie maks. **3 000 zł**; przy kilku umowach maks. **4 500 zł** | art. 22 ust. 2 pkt 1–2 |
| KUP z umowy o pracę, dojazd z innej miejscowości | **300 zł/mies.**, rocznie maks. **3 600 zł**; przy kilku umowach maks. **5 400 zł** | art. 22 ust. 2 pkt 3–4 |
| KUP 50% (prawa autorskie, wynalazki) | **50%** przychodu pomniejszonego o składki społeczne; limit roczny **120 000 zł** | art. 22 ust. 9 pkt 1–3, ust. 9a. Przy uldze dla młodych i pozostałych ulgach zerowych limit 120 000 zł obejmuje łącznie KUP 50% i przychód zwolniony z umowy o pracę (art. 22 ust. 9aa). |
| KUP 20% (zlecenie, dzieło) | **20%** przychodu pomniejszonego o składki społeczne | art. 22 ust. 9 pkt 4 i 6 |
| KUP przy uldze zerowej | KUP z umowy o pracę i zlecenia odlicza się tylko od opodatkowanej części przychodu | art. 22 ust. 3b (przepis z 2022 r.) |
| Ulga dla młodych (do 26 lat) | zwolnienie do **85 528 zł/rok** | art. 21 ust. 1 pkt 148: umowa o pracę, zlecenie, praktyki absolwenckie, staż uczniowski, zasiłek macierzyński. Nie obejmuje B2B ani dzieła. |
| Ulga na powrót | **85 528 zł/rok** przez 4 kolejne lata | art. 21 ust. 1 pkt 152. Obejmuje też B2B na skali, liniowym i ryczałcie. |
| Ulga dla rodzin 4+ | **85 528 zł/rok** | art. 21 ust. 1 pkt 153 (obejmuje też B2B) |
| Ulga dla pracujących seniorów | **85 528 zł/rok** | art. 21 ust. 1 pkt 154: kobiety od 60 lat, mężczyźni od 65 lat, bez pobierania emerytury |
| Łączny limit ulg zerowych | **85 528 zł/rok** razem | art. 21 ust. 44 |
| Ulga prorodzinna: 1. i 2. dziecko | **92,67 zł/mies.** na dziecko (*wyliczone*: 1 112,04 zł/rok) | art. 27f ust. 2. Przy jednym dziecku limit dochodu: **112 000 zł** (małżonkowie łącznie lub samotny rodzic), **56 000 zł** (osoba niebędąca w związku małżeńskim). |
| Ulga prorodzinna: 3. dziecko | **166,67 zł/mies.** (*wyliczone*: 2 000,04 zł/rok) | art. 27f ust. 2 pkt 3 lit. b |
| Ulga prorodzinna: 4. i każde kolejne dziecko | **225,00 zł/mies.** (*wyliczone*: 2 700,00 zł/rok) | art. 27f ust. 2 pkt 3 lit. c |
| Wspólne rozliczenie małżonków | podatek = 2 × podatek od połowy łącznych dochodów (tylko skala) | art. 6 ust. 2. Samotny rodzic: art. 6 ust. 4. |
| Ryczałt od małych umów | **12%** przychodu, bez KUP, gdy należność z umowy (zlecenie, dzieło itp.) z osobą, która nie jest pracownikiem płatnika, wynosi **≤ 200 zł** | art. 30 ust. 1 pkt 5a. Odpowiedź na pytanie z briefu: tak, nadal obowiązuje. |
| Danina solidarnościowa | **4%** nadwyżki ponad **1 000 000 zł** | art. 30h ust. 1–2. Podstawa: skala + liniowy + kapitały (30b) + 30f, po odliczeniu składek. |
| Składka zdrowotna pracownika | **nie** obniża PIT | art. 27b uchylony (od 2022) |
| Wpłata pracodawcy do PPK | jest **przychodem** pracownika do PIT, ale **nie** wchodzi do podstawy ZUS ani składki zdrowotnej | art. 12 ust. 1 PIT (ogólna definicja przychodu, nie ma osobnego przepisu); art. 26 ust. 5 ustawy o PPK; potwierdza [mojeppk.pl](https://www.mojeppk.pl/faq.html) (oficjalny portal PFR) |

### Zaliczka PIT na liście płac

Podstawa: art. 32 ust. 2–4, art. 31b PIT; zaokrąglenia według art. 63 § 1 OP.

```
dochód_mies = przychód − KUP (250/300) − składki społeczne pracownika (9,76% + 1,5% + 2,45%)
podstawa    = round(dochód_mies)                    # do pełnych zł; <50 gr w dół, ≥50 gr w górę (art. 63 § 1 OP)
zaliczka    = round(12% × podstawa − 300)           # 300 tylko przy PIT-2; nie mniej niż 0
# od miesiąca, w którym dochód narastająco u tego płatnika przekroczy 120 000 zł: 32% od nadwyżki,
# a w kolejnych miesiącach 32% (art. 32 ust. 2 pkt 2–3)
```

Składki zdrowotnej nie odejmuje się od zaliczki. Przychód z ulgi dla młodych do 85 528 zł zaliczki nie podlega. Podatnik może jednak złożyć wniosek, żeby płatnik ulgi nie stosował (art. 32 ust. 6).

---

## 2. ZUS – umowa o pracę, 2026

| Składka | Pracownik | Pracodawca | Podstawa prawna |
|---|---|---|---|
| Emerytalna (19,52%) | **9,76%** | **9,76%** | art. 22 ust. 1 pkt 1, art. 16 ust. 1 SUS |
| Rentowa (8,00%) | **1,50%** | **6,50%** | art. 22 ust. 1 pkt 2, art. 16 ust. 1b SUS |
| Chorobowa | **2,45%** | – | art. 22 ust. 1 pkt 3, art. 16 ust. 2 SUS |
| Wypadkowa | – | **1,67%** (do 9 ubezpieczonych) | art. 28 ust. 1 ustawy wypadkowej; [poradnik ZUS, stan prawny 1.01.2026](https://www.zus.pl/documents/10182/167567/poradnik_wypadkowe.pdf/15281e1b-c3f3-472a-81b3-7d10e1a434c8) |
| Fundusz Pracy + Fundusz Solidarnościowy | – | **2,45%** (FP 1,00% + FS 1,45%) | art. 25–26 UB 2026; art. 259 ustawy o rynku pracy ([Dz.U. 2025 poz. 620](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250000620)) |
| FGŚP | – | **0,10%** | art. 27 UB 2026 |
| FEP | – | **1,5%**, tylko praca w szczególnych warunkach | art. 35–36 ustawy o emeryturach pomostowych ([Dz.U. 2024 poz. 1696](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240001696)). Dla typowego pracownika 0. |
| Zdrowotna | **9%** od (brutto − składki społeczne pracownika) | – | art. 79 ust. 1, art. 81 ust. 1 i 6 UŚOZ |
| PPK, wpłata podstawowa | **2%** (0,5–2%, jeśli dochód ≤ 1,2 × min. = *5 767,20 zł*) | **1,5%** | art. 27 ust. 1–2, art. 26 ust. 1 PPK |
| PPK, wpłata dodatkowa | do **2%** | do **2,5%** | art. 27 ust. 3, art. 26 ust. 2 PPK |

Uwagi:
- **Wypadkowa 1,67% obowiązuje bez zmian od 1.04.2018.** To 50% najwyższej stopy w tabeli grup działalności (3,33%). Poradnik ZUS (stan prawny 1.01.2026) potwierdza tę stopę na rok składkowy **1.04.2026–31.03.2027**. ZUS stosuje ją też w tabeli składek na 2026 ([komunikat z 27.03.2026](https://www.zus.pl/-/zawiadomienie-o-wysoko%C5%9Bci-stopy-procentowej-sk%C5%82adki-na-ubezpieczenie-wypadkowe-do-odebrania-w-portalu-ezus)). Płatnicy z co najmniej 10 ubezpieczonymi mają stopę indywidualną (zakres ustawowy 0,40–8,12%, art. 22 ust. 1 pkt 4 SUS). Od 2027 r. grupy działalności ustala się według PKD 2025.
- **Limit 30×** (282 600 zł) dotyczy tylko składki emerytalnej i rentowych, po obu stronach. Chorobową, wypadkową, zdrowotną, FP/FS i FGŚP płaci się dalej. Dla FP przepis mówi to wprost: „bez stosowania ograniczenia” (art. 259 ust. 1 ustawy o rynku pracy).
- **FP/FS** płaci się tylko wtedy, gdy podstawa w przeliczeniu na miesiąc wynosi co najmniej 4 806 zł. Nie płaci się ich za kobiety od 55 lat i mężczyzn od 60 lat.

### Przykład kontrolny: płaca minimalna 4 806 zł, PIT-2, KUP 250 zł (*wyliczone*)

| Pozycja | Kwota |
|---|---|
| Emerytalna / rentowa / chorobowa pracownika | 469,07 / 72,09 / 117,75 → razem **658,91** |
| Zdrowotna 9% × 4 147,09 | **373,24** |
| Podstawa PIT: 4 806 − 658,91 − 250 = 3 897,09 → 3 897 | zaliczka 12% × 3 897 − 300 = 167,64 → **168** |
| **Netto** | **3 605,85 zł** |
| Pracodawca: emerytalna 469,07 + rentowa 312,39 + wypadkowa 80,26 + FP/FS 117,75 + FGŚP 4,81 | **984,28** |
| **Koszt pracodawcy** | **5 790,28 zł** |

Kwota netto zgadza się z wartościami ok. 3 605–3 606 zł podawanymi przez serwisy **[wtórne]**.

---

## 3. Składka zdrowotna 2026

**Pracownik:** 9% podstawy (brutto minus składki społeczne pracownika). Składka nie jest odliczana od PIT.

**Przedsiębiorca:** według [komunikatu ZUS z 2.02.2026](https://www.zus.pl/baza-wiedzy/skladki-wskazniki-odsetki/skladki/wysokosc-skladek-na-ubezpieczenia-spoleczne) i UŚOZ:

| Forma opodatkowania | Stawka / podstawa | Kwota 2026 | Podstawa prawna |
|---|---|---|---|
| Skala | 9% dochodu z poprzedniego miesiąca | min. **432,54 zł** (luty 2026 – styczeń 2027) | art. 79 ust. 1, art. 81 ust. 2 UŚOZ |
| Liniowy | 4,9% dochodu | min. **432,54 zł** | art. 79a ust. 1 UŚOZ |
| IP Box, karta podatkowa | – | **432,54 zł** | art. 81 UŚOZ |
| Wszystkie powyższe, **styczeń 2026** | 9% × 3 499,50 zł | **314,96 zł** | ostatni miesiąc roku składkowego 2025/26 |
| Ryczałt, przychód ≤ 60 000 zł | 9% × 5 537,18 zł (60%) | **498,35 zł/mies.** (*5 980,20 zł/rok*) | art. 81 ust. 2f pkt 1 |
| Ryczałt, przychód 60 000–300 000 zł | 9% × 9 228,64 zł (100%) | **830,58 zł/mies.** (*9 966,96 zł/rok*) | art. 81 ust. 2f pkt 2 |
| Ryczałt, przychód > 300 000 zł | 9% × 16 611,55 zł (180%) | **1 495,04 zł/mies.** (*17 940,48 zł/rok*) | art. 81 ust. 2f pkt 3 |
| Osoba współpracująca | 9% × 6 921,48 zł (75%) | **622,93 zł** | art. 81 ust. 2ya (według przypisu ZUS) |

**Czy zdrowotna przedsiębiorcy obniża podatek:**
- **Skala:** nie.
- **Liniowy:** do kosztów albo jako odliczenie od dochodu, maksymalnie **14 100 zł** w 2026 r. (12 900 zł w 2025). Podstawa: art. 30c ust. 2 pkt 2 PIT; obwieszczenie MFiG z 12.12.2025, [M.P. 2025 poz. 1274](https://eli.gov.pl/eli/MP/2025/1274/ogl).
- **Ryczałt:** 50% zapłaconych składek obniża przychód (art. 11 ust. 1a ustawy o ryczałcie).

**Zmiany w 2026 r., na które warto uważać:**
- Minimalna podstawa w wysokości **75%** płacy minimalnej (314,96 zł) obowiązywała **wyłącznie** w roku składkowym 1.02.2025–31.01.2026. Wynika to z art. 4 ustawy nowelizującej, zacytowanego w obwieszczeniu t.j. Dz.U. 2025 poz. 1461. Od lutego 2026 r. minimum wraca do **100%** płacy minimalnej, czyli 432,54 zł. Serwisy **[wtórne]** (gazetaprawna, infakt) piszą o tym jako o skutku weta prezydenta wobec szerszej reformy z 2025 r.
- Liniowy: 4,9% przewyższa minimum dopiero przy dochodzie powyżej ok. **8 827,35 zł/mies.** (*wyliczone*: 432,54 / 4,9%).

---

## 4. B2B: ZUS i podatek dochodowy, 2026

Kwoty według [ZUS, „Informacja o wysokości składek… w 2026 r.”](https://www.zus.pl/baza-wiedzy/skladki-wskazniki-odsetki/skladki/wysokosc-skladek-na-ubezpieczenia-spoleczne):

| | Duży ZUS | Preferencyjny |
|---|---|---|
| Podstawa | **5 652,00 zł** (60% × 9 420; art. 18 ust. 8 SUS) | **1 441,80 zł** (30% × 4 806; art. 18a SUS; pierwsze 24 miesiące) |
| Emerytalna 19,52% | **1 103,27** | **281,44** |
| Rentowa 8% | **452,16** | **115,34** |
| Wypadkowa 1,67% | **94,39** | **24,08** |
| Chorobowa 2,45% (dobrowolna, art. 11 ust. 2 SUS) | **138,47** | **35,32** |
| FP + FS 2,45% | **138,47** | nie płaci się (podstawa niższa niż płaca minimalna) |
| **Razem z chorobową** | **1 926,76 zł** | **456,18 zł** |
| **Razem bez chorobowej** | **1 788,29 zł** | **420,86 zł** |

Do tego dochodzi składka zdrowotna z sekcji 3.

| Ulga | Zasada | Podstawa |
|---|---|---|
| Ulga na start | **6 miesięcy** bez składek społecznych; składkę zdrowotną płaci się normalnie | art. 18 ust. 1 Prawa przedsiębiorców ([t.j. Dz.U. 2026 poz. 1484](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260001484)) |
| Mały ZUS plus | przychód w poprzednim roku ≤ **120 000 zł**; podstawa = 0,5 × przeciętny miesięczny dochód z poprzedniego roku, w granicach **1 441,80–5 652,00 zł**; łącznie najwyżej 36 miesięcy w ciągu 60 | art. 18c SUS |
| Wakacje składkowe | 1 miesiąc w roku bez składki emerytalnej, rentowej i wypadkowej (do 10 ubezpieczonych, limit przychodu) | art. 17a SUS |

**Podatek dochodowy przedsiębiorcy:**
- **Liniowy: 19%** (art. 30c ust. 1 PIT). Bez kwoty wolnej, bez ulgi prorodzinnej, bez wspólnego rozliczenia.
- **Ryczałt** (art. 12 ust. 1 ustawy o ryczałcie):

| Stawka | Rodzaj przychodów |
|---|---|
| **17%** | wolne zawody |
| **15%** | wybrane usługi (m.in. doradztwo, reklama, usługi biznesowe) |
| **14%** | opieka zdrowotna (PKWiU 86), usługi architektoniczne i inżynierskie (71), specjalistyczne projektowanie (74.1) |
| **12%** | IT: oprogramowanie (62.01), doradztwo IT (62.02), zarządzanie sieciami (62.03.1), wydawanie oprogramowania |
| **10%** | obrót nieruchomościami na własny rachunek |
| **8,5%** | pozostałe usługi; najem: 8,5% do 100 000 zł, 12,5% od nadwyżki |
| **5,5%** | produkcja, roboty budowlane |
| **3%** | handel, gastronomia |
| **2%** | sprzedaż przetworzonych produktów rolnych |

---

## 5. Umowa zlecenie i umowa o dzieło

**Umowa zlecenie**
- ZUS jak przy umowie o pracę: emerytalna 9,76% + 9,76%, rentowa 1,5% + 6,5%. Chorobowa jest dobrowolna. Wypadkowa jest obowiązkowa i płaci ją zleceniodawca. Zdrowotna 9%. FP/FS tylko przy podstawie ≥ 4 806 zł. FGŚP 0,10%.
- Podstawa: art. 6 ust. 1 pkt 4, art. 11 ust. 2, art. 16 SUS. Zbieg z innym tytułem do ubezpieczeń może zwalniać ze składek.
- Podatek: KUP 20%, zaliczka 12% (art. 41 ust. 1 PIT); kwota zmniejszająca tylko po złożeniu PIT-2. Umowy do 200 zł: ryczałt 12%.

**Student lub uczeń do 26 lat na zleceniu**
- Nie płaci składki emerytalnej ani rentowych (art. 6 ust. 4 SUS).
- W konsekwencji nie płaci też składki zdrowotnej. Obowiązek ubezpieczenia zdrowotnego zleceniobiorcy wymaga spełnienia warunków objęcia ubezpieczeniami społecznymi (art. 66 ust. 1 pkt 1 lit. e UŚOZ).
- PIT: zwolnienie do 85 528 zł (ulga dla młodych).
- W praktyce: brutto = netto.

**Umowa o dzieło**
- Nie jest tytułem do ubezpieczeń społecznych: brak składek ZUS i zdrowotnej.
- Wyjątek: dzieło zawarte z własnym pracodawcą albo wykonywane na jego rzecz. Wtedy oskładkowanie jest jak przy umowie o pracę (art. 8 ust. 2a SUS).
- Podatek: KUP 20% albo 50% przy przeniesieniu praw autorskich (limit 120 000 zł); zaliczka 12%.

---

## 7. Terminy – kiedy i gdzie płynie pieniądz

| Co | Termin | Podstawa |
|---|---|---|
| ZUS + zdrowotna za pracowników, płatnik z **osobowością prawną** (sp. z o.o., S.A., fundacja) | **15.** dnia następnego miesiąca | art. 47 ust. 1 pkt 3 SUS; [ZUS](https://www.zus.pl/baza-wiedzy/skladki-wskazniki-odsetki/skladki/terminy-rozliczania-i-oplacania-skladek-na-ubezpieczenia-spoleczne) |
| ZUS + zdrowotna, **pozostali płatnicy**: JDG (także zatrudniająca pracowników), spółki osobowe, B2B za siebie | **20.** dnia następnego miesiąca | art. 47 ust. 1 pkt 4 SUS |
| ZUS, jednostki budżetowe | **5.** dnia następnego miesiąca | art. 47 ust. 1 pkt 2 SUS |
| Zaliczki PIT pobrane od pracowników i zleceniobiorców | **20.** dnia miesiąca po miesiącu poboru | art. 38 ust. 1 PIT |
| PIT-4R za 2026 | do końca stycznia 2027 (31.01 to niedziela, więc **1.02.2027**) | art. 38 ust. 1a PIT; art. 12 § 5 OP |
| Zaliczka PIT przedsiębiorcy (skala, liniowy) / ryczałt | **20.** dnia następnego miesiąca (kwartalnie: 20. po kwartale); za grudzień do 20 stycznia | art. 44 ust. 6 PIT; art. 21 ust. 1 ustawy o ryczałcie |
| VAT (JPK_V7M) – deklaracja i wpłata | **25.** dnia następnego miesiąca (kwartalnie: 25. po kwartale) | art. 99 ust. 1–3, art. 103 ust. 1 ustawy o VAT ([t.j. Dz.U. 2026 poz. 1263](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260001263)) |
| Zeznanie roczne PIT za 2026 | **15.02 – 30.04.2027** (30.04.2027 to piątek) | art. 45 ust. 1 PIT |
| Danina solidarnościowa (DSF-1) | **30.04.2027** | art. 30h ust. 4 PIT |
| Termin w sobotę lub dzień wolny | przesuwa się na najbliższy dzień roboczy | art. 12 § 5 OP |

### Przypisy: zmiany na 2027 już uchwalone lub ogłoszone

| Parametr 2027 | Wartość | Źródło |
|---|---|---|
| Minimalne wynagrodzenie | **4 950 zł** | § 1 rozp. RM z 14.09.2026, [Dz.U. 2026 poz. 1213](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260001213) |
| Minimalna stawka godzinowa | **32,30 zł** | § 2 tamże |
| Prognozowane przeciętne wynagrodzenie | **10 033 zł** | obwieszczenie MRPiPS z 3.11.2026, [M.P. 2026 poz. 1098](https://eli.gov.pl/eli/MP/2026/1098/ogl) |
| Limit 30× | **300 990 zł** | tamże |
| Podstawa dużego ZUS | *6 019,80 zł* (wyliczone, ZUS jeszcze tego nie potwierdził) | 60% × 10 033 |
| Podstawa preferencyjna | *1 485,00 zł* (wyliczone) | 30% × 4 950 |
| Minimalna składka zdrowotna od 02.2027 | *445,50 zł* (wyliczone, przy niezmienionych przepisach) | 9% × 4 950 |
| PIT | od 1.01.2027 uchylona **ulga internetowa**, wyższe odliczenie dla krwiodawców; skala, kwota wolna, KUP i ulga dla młodych bez zmian | ustawa z 22.10.2026, [Dz.U. 2026 poz. 1541](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260001541) |
| Składka zdrowotna 2027 | Nie znalazłem uchwalonej zmiany zasad. Nowelizacje UŚOZ z 2026 r. (poz. 972, 1540) nie dotyczą składki. | przegląd ELI API Sejmu |

---

## Niezweryfikowane lub niejednoznaczne

1. **Kwoty na 2027** (podstawa dużego ZUS 6 019,80 zł, preferencyjna 1 485,00 zł, zdrowotna 445,50 zł) to moje wyliczenia z opublikowanych danych wejściowych. ZUS ich jeszcze nie opublikował. W JSON mają `verified: false`.
2. **Opodatkowanie wpłaty pracodawcy do PPK**: ustawa nie ma przepisu, który mówi to wprost. Skutek wynika z art. 12 ust. 1 PIT i potwierdza go oficjalny portal mojeppk.pl. Kiedy dokładnie powstaje przychód (wpłata czy naliczenie), interpretacje się różnią.
3. **Numer artykułu dla stopy wypadkowej ≤ 9 osób** (art. 28 ust. 1 ustawy wypadkowej) podaję według odesłań w poradniku ZUS. Samej ustawy wypadkowej nie otwierałem. Wartość 1,67% jest natomiast pewna (ZUS).
4. **Osoba współpracująca, art. 81 ust. 2ya UŚOZ**: przypisy na stronie ZUS są przesunięte, a kwota 622,93 zł pochodzi wprost z ZUS.
5. **Mediana**: najnowsza dostępna dotyczy listopada 2025. Za 2026 jej jeszcze nie ma. Badanie „Struktura wynagrodzeń według zawodów” jest osobne i go nie sprawdzałem.
6. **Stawki ryczałtu**: odczytane z t.j. 2025 poz. 843. Nowelizacje z 2026 r. (poz. 779, 1098, 1541) sprawdziłem tylko co do zakresu: nie zmieniają art. 12.
7. **Nowelizacje UŚOZ z 2025 r.** (poz. 1537, 1739) nie zostały przeczytane. Kwoty na 2026 potwierdza jednak komunikat ZUS z 2.02.2026.
8. **Termin PIT-11** nie jest ujęty, bo nie zweryfikowałem go w tekście ustawy.
