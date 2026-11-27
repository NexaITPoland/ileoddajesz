# Przyszła emerytura z ZUS (nowy system) – parametry i metoda, stan na 27.11.2026

*Plik maszynowy z tymi samymi danymi: [`pension-2026.json`](pension-2026.json).*

**Zasady.** Każdą liczbę oznaczoną ✔ odczytałem bezpośrednio ze źródła pierwotnego: PDF Dz.U./M.P. z `api.sejm.gov.pl` (przez `pdftotext`), PDF-y z zus.pl, raport KE (Ageing Report 2024) i druki sejmowe. Wartości *wyliczone* są tak oznaczone. Źródeł wtórnych nie użyłem.

**Teksty jednolite:**

| Skrót | Akt | Stan prawny |
|---|---|---|
| FUS | ustawa o emeryturach i rentach z FUS, t.j. [Dz.U. 2026 poz. 1533](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260001533) | 27.10.2026 |
| SUS | ustawa o systemie ubezpieczeń społecznych, t.j. [Dz.U. 2026 poz. 1474](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260001474) | 4.10.2026 |
| OFE | ustawa o organizacji i funkcjonowaniu funduszy emerytalnych, t.j. [Dz.U. 2026 poz. 1070](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260001070) | |
| 13. em. | ustawa z 9.01.2020, t.j. [Dz.U. 2024 poz. 891](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000891) | |
| 14. em. | ustawa z 26.05.2023, t.j. [Dz.U. 2025 poz. 183](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250000183) | bez zmian po 2025 |
| PIT | t.j. [Dz.U. 2026 poz. 592](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000592) | |

Monitor Polski cytuję jako `https://eli.gov.pl/eli/MP/<rok>/<poz>/ogl`. Tekst PDF jest pod `https://api.sejm.gov.pl/eli/acts/MP/<rok>/<poz>/text.pdf`.

---

## 1. Wzór emerytury (urodzeni po 31.12.1948)

**Wiek emerytalny:** co najmniej **60 lat dla kobiet i 65 lat dla mężczyzn** (art. 24 ust. 1 FUS) ✔. Samo prawo do emerytury nie wymaga stażu. Staż ma znaczenie tylko dla gwarancji emerytury minimalnej (pkt 4).

**Podstawa** (art. 25 ust. 1 FUS) ✔ jest sumą trzech składników:
1. składek zapisanych na **koncie** i zwaloryzowanych do końca miesiąca poprzedzającego wypłatę,
2. **zwaloryzowanego kapitału początkowego** (art. 173–175, dotyczy okresów sprzed 1999 r.),
3. **środków na subkoncie** (art. 40a SUS).

Podstawę pomniejsza się o pobrane wcześniej emerytury (art. 25 ust. 1b). Środki z subkonta pomija się przy emeryturach z art. 183/184 i po emeryturach wcześniejszych (ust. 1d–1g).

**Emerytura** (art. 26 FUS) ✔:

> **emerytura miesięczna = podstawa / średnie dalsze trwanie życia (w miesiącach) dla wieku przejścia na emeryturę**

- Wiek liczy się w ukończonych latach i miesiącach (ust. 2). Tablica jest **wspólna dla kobiet i mężczyzn** (ust. 3).
- Tablicę GUS ogłasza się do 31.03. Stosuje się ją do wniosków złożonych od 1.04 do 31.03 następnego roku (ust. 4–5).
- Jeśli to korzystniejsze, stosuje się tablicę obowiązującą w dniu ukończenia 60 lat (kobieta) lub 65 lat (mężczyzna) (ust. 6).
- Art. 26a: zwiększenie za okresy opłacania składek do KRUS. **Art. 26b jest uchylony.** Art. 26c: przeliczenie po okresowej emeryturze kapitałowej.
- Konto **nie podlega dziedziczeniu** (art. 25 ust. 2). Subkonto dzieli się przy śmierci lub rozwodzie przed emeryturą (art. 40e SUS). Po przejściu na emeryturę obowiązuje 3-letnia „wypłata gwarantowana” (art. 25b FUS).

**Podział składki emerytalnej 19,52%** (art. 22 ust. 1 pkt 1 i ust. 3 SUS) ✔:

| Kto | Konto (ZUS, I filar) | Subkonto (ZUS) | OFE |
|---|---|---|---|
| Nie przekazuje składki do OFE (domyślnie od 2014) | **12,22%** *(wyliczone: 19,52 − 7,30)* | **7,30%** (ust. 3 pkt 2) | – |
| Członek OFE, który złożył oświadczenie | **12,22%** | **4,38%** (ust. 3 pkt 1 lit. b) | **2,92%** (ust. 3 pkt 1 lit. a) |

**OFE w 2026 r.** ✔. OFE nadal istnieją (t.j. ustawy 2026 poz. 1070), a członkostwo jest dobrowolne. Ustawa z 12.09.2025 (Dz.U. 2025 poz. 1425) wprowadziła tylko zmiany techniczne: strona ogłoszeń i tajemnica zawodowa. Dane z Informacji RM, [druk sejmowy 2084](https://orka.sejm.gov.pl/Druki10ka.nsf/0/druk2084) (XII 2025):
- na koniec 2024 r. było **14 260,9 tys.** członków OFE, ale składkę do OFE przekazuje tylko **2 455,7 tys.**;
- ostatnie okno transferowe trwało od 1.04 do 31.07.2024 i zebrało 15 758 oświadczeń. Okna wypadają co 4 lata, więc następne będzie w 2028 r.;
- 10 lat przed wiekiem emerytalnym środki z OFE przechodzą na subkonto (tzw. „suwak”, art. 40a ust. 1 SUS).

**Dla silnika:** w modelu domyślnym przyjąć „nie w OFE”: 12,22% na konto i 7,30% na subkonto. Dla członka OFE: 2,92% wraca na subkonto przez suwak 10 lat przed emeryturą, z rynkową stopą zwrotu. ZUS w FUS23 przyjmuje, że nominalna stopa zwrotu OFE równa się nominalnemu wzrostowi PKB.

---

## 2. Waloryzacja

### 2a. Konto – waloryzacja roczna (art. 25 ust. 3–12 FUS) ✔
Wskaźnik to **CPI ogółem × realny wzrost sumy przypisu składek emerytalnych** z poprzedniego roku. W praktyce odpowiada to nominalnemu wzrostowi funduszu płac objętego składkami. Wskaźnik nie może być niższy niż CPI.
- Waloryzację przeprowadza się **od 1 czerwca**.
- Waloryzacji „za rok X” podlega stan konta na 31 stycznia roku X (ust. 4). Składki z roku t dostają więc pierwszy wskaźnik „za t+1”.
- Wskaźnik ogłasza MRPiPS w M.P.

| Waloryzacja za rok | Wskaźnik | Akt |
|---|---|---|
| 2015 | 105,37% | [M.P. 2016 poz. 456](https://eli.gov.pl/eli/MP/2016/456/ogl) |
| 2016 | 106,37% | [M.P. 2017 poz. 444](https://eli.gov.pl/eli/MP/2017/444/ogl) |
| 2017 | 108,68% | [M.P. 2018 poz. 493](https://eli.gov.pl/eli/MP/2018/493/ogl) |
| 2018 | 109,20% | [M.P. 2019 poz. 452](https://eli.gov.pl/eli/MP/2019/452/ogl) |
| 2019 | 108,94% | [M.P. 2020 poz. 443](https://eli.gov.pl/eli/MP/2020/443/ogl) |
| 2020 | 105,41% | [M.P. 2021 poz. 436](https://eli.gov.pl/eli/MP/2021/436/ogl) |
| 2021 | 109,33% | [M.P. 2022 poz. 471](https://eli.gov.pl/eli/MP/2022/471/ogl) |
| 2022 | 114,40% | [M.P. 2023 poz. 497](https://eli.gov.pl/eli/MP/2023/497/ogl) |
| 2023 | 114,87% | [M.P. 2024 poz. 382](https://eli.gov.pl/eli/MP/2024/382/ogl) |
| 2024 | 114,41% | [M.P. 2025 poz. 449](https://eli.gov.pl/eli/MP/2025/449/ogl) |
| **2025** (ogłoszony 16.05.2026, zastosowany 1.06.2026) | **109,81%** | [M.P. 2026 poz. 506](https://eli.gov.pl/eli/MP/2026/506/ogl) |

**Waloryzacja kwartalna konta** (art. 25a FUS) ✔. Stosuje się ją tylko przy ustalaniu emerytury, do składek zapisanych po 31.01 roku ostatniej waloryzacji rocznej. Wskaźnik liczy się kw/kw (CPI × realny przypis). Jest **silnie sezonowy**, więc nie można go przeliczać na stopę roczną.

| Kwartał | Wskaźnik | Akt |
|---|---|---|
| III kw. 2025 | 100,30% | [M.P. 2025 poz. 1253](https://eli.gov.pl/eli/MP/2025/1253/ogl) |
| IV kw. 2025 | 100,20% | [M.P. 2026 poz. 298](https://eli.gov.pl/eli/MP/2026/298/ogl) |
| I kw. 2026 | 110,50% | [M.P. 2026 poz. 625](https://eli.gov.pl/eli/MP/2026/625/ogl) |
| II kw. 2026 | 101,00% | [M.P. 2026 poz. 904](https://eli.gov.pl/eli/MP/2026/904/ogl) |

Wskaźnik za III kw. 2026 nie jest jeszcze ogłoszony; spodziewany w grudniu 2026. Który kwartał zostaje uwzględniony, zależy od kwartału przyznania emerytury (art. 25a ust. 2). Czerwiec ma regułę „jak w maju, jeśli korzystniej” (ust. 2a).

### 2b. Subkonto – waloryzacja roczna (art. 40c SUS) ✔
Wskaźnik to **średnioroczna dynamika nominalnego PKB z ostatnich 5 lat**. Ogłasza go Prezes GUS do 15 maja, a stosuje się od 1 czerwca.

| Rok ogłoszenia/zastosowania | Wskaźnik | Akt |
|---|---|---|
| 2016 | 104,37 | [M.P. 2016 poz. 449](https://eli.gov.pl/eli/MP/2016/449/ogl) |
| 2017 | 103,39 | [M.P. 2017 poz. 448](https://eli.gov.pl/eli/MP/2017/448/ogl) |
| 2018 | 103,99 | [M.P. 2018 poz. 476](https://eli.gov.pl/eli/MP/2018/476/ogl) |
| 2019 | 105,01 | [M.P. 2019 poz. 430](https://eli.gov.pl/eli/MP/2019/430/ogl) |
| 2020 | 105,73 | [M.P. 2020 poz. 416](https://eli.gov.pl/eli/MP/2020/416/ogl) |
| 2021 | 105,23 | [M.P. 2021 poz. 448](https://eli.gov.pl/eli/MP/2021/448/ogl) |
| 2022 | 107,07 | [M.P. 2022 poz. 473](https://eli.gov.pl/eli/MP/2022/473/ogl) |
| 2023 | 109,20 | [M.P. 2023 poz. 505](https://eli.gov.pl/eli/MP/2023/505/ogl) |
| 2024 | 109,91 | [M.P. 2024 poz. 370](https://eli.gov.pl/eli/MP/2024/370/ogl) |
| 2025 | 109,49 | [M.P. 2025 poz. 453](https://eli.gov.pl/eli/MP/2025/453/ogl) |
| **2026** (komunikat z 14.05.2026) | **110,61** | [M.P. 2026 poz. 487](https://eli.gov.pl/eli/MP/2026/487/ogl) |

Konwencja „za rok”: MRPiPS w druku 2084 (tab. 17) przypisuje wskaźnik ogłoszony w roku X+1 do roku X, np. 2022 → 9,20%. Jest to ta sama konwencja co dla konta (art. 40c ust. 2 SUS brzmi tak samo jak art. 25 ust. 4 FUS).

**Waloryzacja kwartalna subkonta** (art. 40d ust. 5 SUS) ✔ liczy się wzorem **WKW = (WRW − 100%)/4 + 100%**:
- III kw. 2025 i IV kw. 2025: 102,37% ([M.P. 2025/1195](https://eli.gov.pl/eli/MP/2025/1195/ogl), [2026/211](https://eli.gov.pl/eli/MP/2026/211/ogl));
- I–III kw. 2026: **102,65%** ([M.P. 2026/550](https://eli.gov.pl/eli/MP/2026/550/ogl), [838](https://eli.gov.pl/eli/MP/2026/838/ogl), [1160](https://eli.gov.pl/eli/MP/2026/1160/ogl)). Sprawdzenie: (110,61−100)/4 = 2,6525.

---

## 3. Tablice GUS średniego dalszego trwania życia (miesiące)

Tablica obowiązująca **od 1.04.2026 do 31.03.2027**: komunikat Prezesa GUS z 25.03.2026, [M.P. 2026 poz. 319](https://eli.gov.pl/eli/MP/2026/319/ogl) ✔. Wartości dla wieku pełnych lat i 0 miesięcy:

| Wiek | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Miesiące | **268,9** | 259,4 | 250,0 | 240,7 | 231,7 | **222,7** | 214,1 | 205,4 | 197,0 | 188,8 | 180,6 |

Wiersz dla 60 lat, kolumny 0–11 miesięcy: 268,9 268,1 267,3 266,5 265,7 264,9 264,2 263,4 262,6 261,8 261,0 260,2. Wiersz dla 65 lat: 222,7 222,0 221,3 220,6 219,8 219,1 218,4 217,7 217,0 216,3 215,5 214,8. Pełna tablica obejmuje wiek 30–90+ i jest w PDF.

**Trend.** Rok w tabeli to rok, od którego (1.04) obowiązuje tablica. Wszystkie wartości ✔.

| Tablica od 1.04. | 55 | 60 | 62 | 63 | 65 | 67 | 70 | M.P. |
|---|---|---|---|---|---|---|---|---|
| 2016 | 306,5 | 259,5 | 241,7 | 233,1 | 216,1 | 199,5 | 175,5 | 2016/291 |
| 2017 | 310,4 | 263,2 | 245,4 | 236,6 | 219,6 | 203,0 | 178,9 | 2017/292 |
| 2018 | 309,5 | 262,2 | 244,2 | 235,5 | 218,4 | 201,8 | 177,7 | 2018/329 |
| 2019 | 308,1 | 260,7 | 242,8 | 234,1 | 217,1 | 200,6 | 176,8 | 2019/279 |
| 2020 | 309,2 | 261,5 | 243,5 | 234,7 | 217,6 | 201,1 | 177,1 | 2020/326 |
| 2021 | 295,1 | 247,7 | 229,9 | 221,2 | 204,3 | 188,1 | 164,8 | 2021/307 |
| 2022 | 285,9 | 238,9 | 221,3 | 212,7 | 196,2 | 180,4 | 157,9 | 2022/372 |
| 2023 | 302,4 | 254,3 | 236,0 | 227,2 | 210,0 | 193,4 | 169,6 | 2023/298 |
| 2024 | 313,2 | 264,2 | 245,6 | 236,5 | 218,9 | 202,0 | 177,5 | 2024/234 |
| 2025 | 315,7 | 266,4 | 247,7 | 238,6 | 220,8 | 203,6 | 179,0 | 2025/279 |
| **2026** | **318,6** | **268,9** | **250,0** | **240,7** | **222,7** | **205,4** | **180,6** | 2026/319 |

Spadek w latach 2021–2022 to efekt COVID-19. Od 2024 r. tablice przekraczają poziom sprzed pandemii i rosną o ok. +2 mies. rocznie dla wieku 65 lat. W PDF z M.P. 2024/234 cyfry są zakodowane nietypowymi glifami. Odczytałem je po mapowaniu znaków, a ciągłość wierszy sprawdziłem.

---

## 4. Świadczenia i podatki w 2026 r.

| Parametr | Wartość | Podstawa |
|---|---|---|
| Wskaźnik waloryzacji emerytur od 1.03.2026 | **105,3%** ✔ | art. 88–89 FUS; [M.P. 2026 poz. 202](https://eli.gov.pl/eli/MP/2026/202/ogl). Zwiększenie o 20% realnego wzrostu płac ustaliła RM ([Dz.U. 2025 poz. 1048](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001048)). Dla porównania 2025: 105,5% ([M.P. 2025/129](https://eli.gov.pl/eli/MP/2025/129/ogl)). Na 2027 r. też 20% ([Dz.U. 2026 poz. 1018](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260001018)). |
| **Najniższa emerytura od 1.03.2026** | **1 978,49 zł** brutto ✔ | art. 85 ust. 2, art. 94 ust. 2 FUS; komunikat Prezesa ZUS, [M.P. 2026 poz. 220](https://eli.gov.pl/eli/MP/2026/220/ogl). Od 1.03.2025 było 1 878,91 zł. Kwota w art. 85 t.j. (1588,44 zł) jest historyczna, przypis 19 odsyła do komunikatu ZUS. |
| Staż do gwarancji minimum | **kobiety 20 lat, mężczyźni 25 lat** okresów składkowych i nieskładkowych ✔ | art. 87 ust. 1 FUS. Miesiące z podstawą poniżej płacy minimalnej liczą się proporcjonalnie (ust. 3). Dopłatę finansuje budżet (ust. 2). Nie przysługuje przy przychodzie wyższym niż kwota podwyższenia (ust. 5). |
| **Przeciętna emerytura wypłacana przez ZUS**, IX 2026 | **4 525,41 zł** brutto ✔ | [ZUS, informacja wstępna IX 2026](https://www.zus.pl/documents/10182/167606/wst%C4%99pna_09_2026.pdf/a0018ed0-feb8-186a-e0c7-170c5c1ae187), tabl. 16. Średnia I–IX 2026: 4 442,87 zł; XII 2025: 4 235,47 zł. Liczba emerytów: 6 459,8 tys. (tabl. 14). Dotyczy wszystkich emerytur, w starym i nowym systemie. |
| **13. emerytura 2026** | **1 978,49 zł** brutto *(wyliczone)* | art. 5 ustawy z 9.01.2020: równa najniższej emeryturze od 1.03 roku wypłaty. Pobiera się od niej PIT i składkę zdrowotną (art. 12). |
| **14. emerytura 2026** | pełna **1 978,49 zł** przy świadczeniu ≤ **2 900 zł** brutto ✔. Powyżej tej kwoty pomniejszenie „złotówka za złotówkę”. Nie przysługuje, gdy wyszłoby < 50 zł, czyli przy świadczeniu powyżej **4 828,49 zł** *(wyliczone)* | art. 3 ust. 1–2 ustawy z 26.05.2023 (t.j. 2025/183). Rozporządzenia podwyższającego kwotę na 2026 nie wydano. Wypłata we **wrześniu 2026** ([Dz.U. 2026 poz. 1092](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260001092)). |
| Opodatkowanie emerytury | skala **12% / 32%** (próg 120 000 zł), kwota zmniejszająca **3 600 zł** (kwota wolna 30 000 zł), **brak KUP** ✔ | art. 27 ust. 1, art. 12 ust. 7, art. 34 PIT. ZUS jako płatnik pobiera zaliczki wg art. 32 ust. 2/3, z 1/12 kwoty zmniejszającej przy oświadczeniu, i wystawia PIT-40A (art. 34 ust. 7). Ulga dla pracujących seniorów (art. 21 ust. 1 pkt 154) dotyczy tylko osób, które **nie pobierają** emerytury. |
| Składka zdrowotna od emerytury | **9%** emerytury brutto, nieodliczalna od podatku ✔ | art. 79 UŚOZ; dla 13./14. emerytury odesłania w art. 12 ust. 2 / art. 11 ust. 2 ustaw. |
| **Emerytury stażowe** | **nieuchwalone** ✔ | Poselski projekt, [druk 187](https://www.sejm.gov.pl/Sejm10.nsf/PrzebiegProc.xsp?nr=187): 35 lat stażu dla kobiet, 40 dla mężczyzn. Wpłynął 30.01.2024, I czytanie odbyło się 8.02.2024, potem skierowano go do komisji. Według API Sejmu z 27.11.2026 nie ma dalszych etapów. Inne projekty w toku nie dotyczą stażówek: prezydencki druk 1956 (indeksacja minimalnych świadczeń) i druk 3205 (warunek 25× płacy minimalnej na koncie dla dopłaty do minimum). |

---

## 5. Oficjalne założenia długoterminowe (projekcja w ujęciu realnym)

### 5a. ZUS – „Prognoza wpływów i wydatków Funduszu Emerytalnego do 2080 roku” (X 2025, model FUS23) ✔
[PDF na zus.pl](https://www.zus.pl/documents/10182/167761/Publikacja_Fundusz_Emerytalny_2026_2080.pdf/54000d69-b2f3-96cc-5814-9b6524f3d231). To **najnowsza** edycja: sporządza się ją co 3 lata (art. 61 SUS), poprzednia ukazała się w X 2022. **Horyzont to 2080, a nie 2100.** Edycja ma trzy warianty: nr 1 (pośredni), nr 2 (pesymistyczny) i nr 3 (optymistyczny). Korzysta z założeń makro MF z VIII 2025 i prognozy demograficznej MF z 2025 r.

**Tabela 1.1 – wariant nr 1 (pośredni):**

| Rok | 2026 | 2027 | 2028 | 2029 | 2030 | 2035 | 2040 | 2045 | 2050 | 2055 | 2060 | 2065 | 2070 | 2080 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CPI ogółem | 102,99 | 102,64 | 102,49 | 102,42 | 102,50 | 102,50 | 102,50 | 102,50 | 102,50 | 102,50 | 102,50 | 102,50 | 102,50 | 102,50 |
| Realny wzrost przeciętnego wynagrodzenia | 103,27 | 103,53 | 103,62 | 103,55 | 103,43 | 102,83 | 102,23 | 101,91 | 101,77 | 101,68 | 101,58 | 101,48 | 101,38 | 101,38 |
| Realny wzrost PKB | 103,53 | 102,99 | 102,92 | 102,81 | 102,81 | 101,99 | 101,14 | 100,38 | 100,33 | 100,44 | 100,65 | 100,90 | 100,42 | 100,22 |
| Stopa bezrobocia (koniec roku) | 4,97% | 5,06% | 5,18% | 5,25% | 5,30% | 5,81% | 5,96% | 5,96% | 5,96% | 5,96% | 5,96% | 5,96% | 5,96% | 5,96% |
| Ubezpieczeni emerytalnie, tys. (tab. 17) | 16 291 | 16 257 | 16 240 | 16 246 | 16 238 | 15 784 | 15 329 | 14 580 | 13 632 | 12 798 | 12 167 | 11 727 | 11 253 | 10 187 |

Dla 2025 r. tabela podaje: CPI 103,72, realne płace 104,38, PKB 103,35, ściągalność składek 99%. Lata 2031–2034 są w pliku JSON. CPI emerytów jest wyższe o 0,3 pp. Waloryzacja świadczeń w modelu wynosi CPI + 20% realnego wzrostu płac.

**Czego publikacja NIE zawiera** (sprawdziłem cały tekst): stopy zastąpienia, prognozy wskaźnika waloryzacji konta i subkonta, prognozy trwania życia. Nie ma tych danych także w poprzedniej edycji (2023–2080) ani w prognozie 5-letniej FUS 2026–2030. Dlatego w modelu:
- **realna waloryzacja konta** ≈ realny wzrost płac × (ubezpieczeni_t / ubezpieczeni_{t−1}). To przybliżenie autorskie: wskaźnik liczony od przypisu składek odpowiada funduszowi płac. Wynik: 2030 ≈ +3,4%, 2040 ≈ +1,6%, 2045–2060 ≈ +0,4–0,9% realnie;
- **realna waloryzacja subkonta** ≈ 5-letnia średnia realnego PKB. Upraszczam, przyjmując deflator PKB ≈ CPI;
- **inflacja**: 2,5% od 2030 r.

**Efekt odroczenia emerytury** (DSiPA ZUS w Informacji RM, [druk 1943](https://orka.sejm.gov.pl/Druki10ka.nsf/0/druk1943), XI 2025, wykres 8). Wzrost emerytury w cenach 2024 przy odroczeniu o 1/2/3/4/5 lat wynosi:
- mężczyźni: **+8,9% / 19,5% / 30,4% / 42,0% / 54,3%**;
- kobiety: +8,8% / 19,1% / 29,8% / 41,0% / 52,8%.

Druk jest skanem bez warstwy tekstowej. Wartości odczytałem z obrazu strony.

### 5b. KE – 2024 Ageing Report, Country fiche Poland ✔
[PDF](https://economy-finance.ec.europa.eu/document/download/568baf8e-3a50-4859-8507-f0d963411213_en?filename=2024-ageing-report-country-fiche-Poland.pdf). Raport 2027 nie jest jeszcze opublikowany; KE wydaje go w 2027 r.

| | 2022 | 2030 | 2040 | 2050 | 2060 | 2070 |
|---|---|---|---|---|---|---|
| **Stopa zastąpienia przy przejściu (RR), emerytury zarobkowe** (tab. 9) | **58%** | 47% | 32% | 27% | 27% | **27%** |
| Benefit ratio, system publiczny (średnia emerytura / średnia płaca) | 45% | 44% | 35% | 29% | 26% | 25% |
| e65 mężczyźni, lata (tab. 2, EUROPOP2023) | 15,4 | 17,1 | 18,5 | 19,9 | 21,2 | 22,4 |
| e65 kobiety, lata | 19,8 | 21,3 | 22,7 | 23,9 | 25,0 | 26,1 |
| *Proxy tablicy unisex, mies. = średnia × 12 (wyliczone)* | 211,2 | 230,4 | 247,2 | 262,8 | 277,2 | 291,0 |

RR liczy się jako pierwszą emeryturę podzieloną przez przeciętne wynagrodzenie w gospodarce w roku przejścia (brutto). Proxy dla 2022 (211 mies.) zgadza się z tablicą GUS od 1.04.2023 (210,0 mies.), która bazuje na danych za 2022. Proxy jest więc rozsądnym ekstrapolatorem dzielnika.

---

## 6. Jak sprawdzić własny stan konta (IOSK)

Podstawa: art. 50 SUS ✔. ZUS udostępnia **„Informację o stanie konta ubezpieczonego”** do 31 sierpnia, według stanu na 31 grudnia poprzedniego roku. Dostęp:
- **tylko elektronicznie**, po założeniu profilu na PUE/eZUS (ust. 1h);
- część informacji może być także w mObywatelu (ust. 1ha);
- na papierze tylko na żądanie (ust. 1i).

Pola, które trzeba przepisać do kalkulatora:
1. **„Kwota zwaloryzowanych składek na ubezpieczenie emerytalne”**, czyli konto (art. 50 ust. 1, art. 40 ust. 1), stan na 31.12;
2. **„Zwaloryzowany kapitał początkowy”**, jeśli był ustalony (ust. 1a pkt 1). Dotyczy pracy przed 1999 r.;
3. **„Kwota składek … zewidencjonowanych na subkoncie”** ogółem (ust. 1a pkt 2a);
4. dodatkowo widać składki z ostatnich 12 miesięcy w podziale na miesiące, składki do OFE (pkt 3–5) i **hipotetyczną emeryturę**.

Hipotetyczna emerytura:
- pokazuje się **tylko osobom, które na 31.12 miały ukończone 35 lat** (ust. 1ba);
- ma dwa warianty: **(1)** stan konta bez dalszych składek, **(2)** dalsze składki w średniej dotychczasowej wysokości (ust. 1c);
- liczy się jako (konto + KP [+ hipotetyczne składki]) / dalsze trwanie życia w wieku 60/65 lat z **bieżącej** tablicy GUS (ust. 2);
- **nie zawiera przyszłej waloryzacji ani wzrostu płac**, nie jest podnoszona do minimum, a w ujęciu ustawowym pomija subkonto. Według [opisu ZUS](https://www.zus.pl/swiadczenia/emerytury/kalkulatory-emerytalne/emerytura-na-nowych-zasadach/wyjasnienie-danych-zawartych-w-informacji-o-stanie-konta/wysokosc-hipotetycznej-emerytury) informacja podaje też dwa warianty „konto + subkonto”;
- osobom, którym do emerytury zostało ≤ 5 lat, pokazuje się warianty odroczone o 1–5 lat (ust. 1d).

**Wskazówka dla UI:** użytkownik wpisuje trzy kwoty (konto, KP, subkonto) na 31.12.2025. Silnik musi je jeszcze zwaloryzować wskaźnikami za 2025 (konto 109,81%, subkonto 110,61%), bo te zastosowano dopiero 1.06.2026. Dotyczy to stanu na 31.01.2025; składki z lutego–grudnia 2025 dostaną pierwszy wskaźnik dopiero „za 2026”.

---

## 7. Przykład: mężczyzna, 30 lat, 9 317 zł brutto, praca od 23. roku życia

**Założenia:**
- urodzony w 1996 r., pracuje od 2019 r., emerytura w wieku 65 lat, czyli w 2061 r.;
- **42 lata składek** (2019–2060);
- umowa o pracę, bez przerw, poniżej limitu 30× (282 600 zł);
- **zawsze 100% przeciętnego wynagrodzenia**: w latach 2019–2025 przeciętne roczne wg GUS ✔, w 2026 r. 9 317,01 zł (III kw. 2026), potem wzrost o realny wzrost płac z wariantu 1;
- nie jest w OFE: 12,22% na konto, 7,30% na subkonto; bez kapitału początkowego;
- składki z roku t dostają pierwszy wskaźnik „za t+1”. Pomijam waloryzację kwartalną w roku przejścia;
- wynik podaję w **złotych z 2026 r.**

**Krok 1 – stan na koniec 2026 r., nominalnie ≈ zł 2026.** Składki 2019–2024 zwaloryzowałem faktycznymi wskaźnikami za 2020–2025 (konto: tab. 2a; subkonto: 105,23 … 110,61). Składki z 2025 i 2026 r. nie są jeszcze zwaloryzowane.
→ konto **107 614 zł**, subkonto **60 191 zł**.

**Krok 2 – lata 2026–2060, realnie.** Co roku:
- konto × [realny wzrost płac_t × (ubezpieczeni_t/ubezpieczeni_{t−1})],
- subkonto × [5-letnia średnia geometryczna realnego PKB]. Dla lat 2021–2024 przyjąłem średnią z łącznej dynamiki 2020–2025 = 118,2 ✔ (M.P. 2026/386), czyli 2,83%/rok,
- następnie doliczam składki z kolejnego roku: płaca_t = płaca_{t−1} × realny wzrost płac_t.

Między latami podanymi w tabeli ZUS interpoluję: liniowo dla wskaźników wzrostu, geometrycznie dla liczby ubezpieczonych.

Wybrane realne wskaźniki: konto 2030 103,38 / 2040 101,63 / 2050 100,41 / 2060 100,56; subkonto 2030 103,01 / 2040 101,48 / 2050 100,35.
→ Kapitał w wieku 65 lat: konto **1 035 970 zł**, subkonto **602 864 zł**, razem **1 638 834 zł** (zł 2026).
→ Płaca w 2060 r. = przeciętna = **20 099 zł** (zł 2026).

**Krok 3 – dzielnik.** Tablica GUS na 2060/61 nie istnieje. Używam proxy z EU AR: (21,2 + 25,0)/2 × 12 = **277,2 mies.** Dla porównania dzisiejsza tablica daje 222,7 mies.

**Wynik (zł 2026, brutto):**

| Wariant | Emerytura | Stopa zastąpienia (vs płaca przed emeryturą) | vs dzisiejsza płaca 9 317 zł |
|---|---|---|---|
| **Centralny:** wariant 1 ZUS + trwanie życia wg EU AR | **≈ 5 900 zł** (5 912) | **≈ 29%** | 63% |
| Bez spadku liczby ubezpieczonych (konto rośnie jak płace) | ≈ 6 740 zł | 33,5% | 72% |
| Trwanie życia zamrożone na tablicy 2026 (222,7) – górna granica | ≈ 7 360 zł | 36,6% | 79% |

Netto przy zasadach z 2026 r.: z 5 912 zł odejmuje się zdrowotną 532 zł i PIT ≈ 409 zł/mies., co daje **≈ 4 970 zł**.

**Porównanie z publikacjami oficjalnymi:** KE (AR 2024) przewiduje RR w nowym systemie **27% w 2060 r.** Wynik centralny 29% jest bardzo zbliżony. Jest nieco wyższy, bo przykład zakłada pełną, ciągłą karierę bez bezrobocia i pracy na umowach cywilnych, a średnia KE tych założeń nie robi. ZUS nie publikuje przykładowych emerytur dla takiej osoby. Kalkulator ZUS na zus.pl jest interaktywny, a jego parametry są niejawne. Odroczenie o rok podnosi świadczenie o ok. 8,9% (druk 1943, pkt 5a).

Skrypt obliczeń leży w scratchpadzie sesji. Wszystkie wejścia są w `pension-2026.json` pod kluczami `projection_*`, `macro_history`, `valorization_*`.

---

## 8. Niezweryfikowane / niejednoznaczne

1. **Brak oficjalnej prognozy waloryzacji konta i subkonta oraz stopy zastąpienia od ZUS.** FUS23 jej nie publikuje. Realną waloryzację konta przybliżam jako realne płace × zmiana liczby ubezpieczonych. Ta jedna decyzja zmienia wynik o ok. 14% (5 912 vs 6 737 zł). Ponadto wskaźnik liczony od przypisu składek zależy od limitu 30× i struktury tytułów ubezpieczenia.
2. **Dzielnik w przyszłości** to proxy: średnia arytmetyczna e65 K i M z EUROPOP2023. GUS liczy tablicę unisex na podstawie struktury zgonów. Prognozy GUS/MF tablic unisex dla wieku 65 lat w źródłach nie znalazłem.
3. **Subkonto realnie:** zakładam, że deflator PKB ≈ CPI. W 2025 r. deflator wyniósł 102,9, a CPI 103,6.
4. **Okno 5 lat PKB dla lat 2021–2024** przybliżam średnią z łącznej dynamiki 2020–2025. Rocznych dynamik PKB 2021–2024 nie pobrałem osobno.
5. **Konwencja „za rok” subkonta** (rok ogłoszenia − 1) pochodzi z druku MRPiPS 2084, a nie wprost z komunikatów GUS.
6. **Hipotetyczna emerytura w IOSK:** ustawa (art. 50 ust. 2) mówi tylko o koncie i kapitale początkowym, a ZUS opisuje dodatkowo warianty z subkontem. Opis na zus.pl jest przykładem z IOSK za 2016 r. i nie jest aktualizowany.
7. **Druk 1943** (skan) czytałem z obrazu. Wartości z wykresu 8 mogą mieć błąd odczytu ±0,1 pp.
8. **Przeciętna emerytura 4 525,41 zł** pochodzi z danych **wstępnych** ZUS za IX 2026 i obejmuje wszystkie emerytury, także w starym systemie. Średnia wysokość nowo przyznanych emerytur nie jest w tej publikacji podana.
9. **Składka zdrowotna 9% od emerytury:** stawkę i podstawę wziąłem z UŚOZ t.j. 2025 poz. 1461 za `labor-2026.json`. W tej sesji nie czytałem jej ponownie.
10. Nie sprawdziłem, czy w M.P. ukazał się już wskaźnik waloryzacji konta za III kw. 2026. Termin to 25 dzień miesiąca przed terminem waloryzacji, więc spodziewam się go ok. XII 2026.
