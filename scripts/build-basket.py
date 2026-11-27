"""
Buduje koszyk (kategorie, udziały w kwintylach, udział VAT i akcyzy) z wyników badania GUS
„Budżety gospodarstw domowych w 2025 r.” (research/data-2026.json) i stawek z research/consumption-2026.json.
Wynik: wypisuje JSON z polem basket, do wklejenia w src/data/rates-2026.json (uruchamiane ręcznie przy aktualizacji danych).
Uruchom: python3 -I scripts/build-basket.py research/data-2026.json units.json
"""
import json, sys
d = json.load(open(sys.argv[1]))
units = json.load(open(sys.argv[2]))  # udziały akcyzy w cenie: fuel, tobacco, alcohol, electricity, gas, cars
g = d['1_gus_budzety_gospodarstw_domowych_2025']
def val(x): return x['value'] if isinstance(x, dict) and 'value' in x else x
div = {k: val(v) for k, v in g['wydatki_wg_coicop1999_kwintyle'].items() if k[:2].isdigit()}
sub = {k: val(v) for k, v in g['wydatki_podkategorie_ogolem'].items()}
c18 = {k: val(v) for k, v in g['wydatki_wg_coicop2018_ogolem'].items()}
Q = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']
# Podział działów na podkategorie z akcyzą: proporcja z ogółu gospodarstw (GUS podaje podkategorie tylko łącznie).
alc = sub['02a_napoje_alkoholowe'] / (sub['02a_napoje_alkoholowe'] + sub['02b_wyroby_tytoniowe'])
h04 = c18['04']
el = sub['04g1_energia_elektryczna'] / h04
heat = (sub['04g2_gaz'] + sub['04g3_paliwa_stale'] + sub['04g4_cieplo']) / h04
waste = sub['04d_wywoz_smieci'] / h04          # liczona osobno jako opłata gminna, więc usunięta z koszyka
fuel = sub['07b_paliwa_i_smary'] / c18['07']
cars = sub['07a_zakup_pojazdow'] / c18['07']
# VAT w pozostałej części działu 04 (bez prądu, ciepła/gazu, śmieci): z mapowania pozycji.
m = val(d['2_vat_efektywny']['mapowanie_pozycji'])
def vat_of(names): return sum(x['VAT_PLN'] for x in m if x['pozycja'] in names), sum(x['wydatek_PLN'] for x in m if x['pozycja'] in names)
h_rest = ['najem i pozostałe opłaty mieszkaniowe (rezydualnie)', 'materiały do konserwacji i napraw mieszkania', 'usługi konserwacji i napraw mieszkania', 'zaopatrzenie w wodę', 'usługi kanalizacyjne', 'pozostałe usługi mieszkaniowe n.e.c. (zarządca, wspólnota)']
hv, hs = vat_of(h_rest)
heat_v, heat_s = vat_of(['gaz', 'paliwa stałe', 'ciepło systemowe'])
t_rest = ['zakup pojazdów', 'części i akcesoria', 'konserwacja i naprawa pojazdów', 'pozostałe usługi (parking, autostrady)', 'transport pasażerski kolej/drogowy/mieszany', 'transport lotniczy', 'usługi pocztowe i kurierskie, inne']
tv, ts = vat_of(t_rest)
eff = val(d['2_vat_efektywny']['efektywna_stawka_COICOP1999_dla_kwintyli'])
V23 = 23 / 123
cats = [
  ('food', 'Żywność i napoje', 'Jedzenie, napoje bez alkoholu', lambda q: div['01_zywnosc_napoje_bezalk'][q], eff['01'] / 100, units['food_sugar'], 'Stawki 5% (podstawowa żywność), 8% (np. cukier, przyprawy) i 23% (kawa, herbata, słodycze z kakao, woda butelkowana, napoje słodzone). Akcyza: opłata cukrowa w napojach słodzonych.'),
  ('alcohol', 'Alkohol', 'Piwo, wódka, wino', lambda q: div['02_alkohol_tyton'][q] * alc, V23, units['alcohol'], 'VAT 23% oraz akcyza; struktura wydatków: ok. 47% mocne alkohole, 44% piwo, 9% wino (dane rynkowe).'),
  ('tobacco', 'Papierosy i tytoń', 'Wyroby tytoniowe', lambda q: div['02_alkohol_tyton'][q] * (1 - alc), V23, units['tobacco'], 'VAT 23% oraz akcyza liczona dla typowej paczki papierosów.'),
  ('clothing', 'Ubrania i buty', 'Odzież, obuwie', lambda q: div['03_odziez_obuwie'][q], V23, 0, 'Stawka 23%.'),
  ('electricity', 'Prąd', 'Energia elektryczna', lambda q: div['04_mieszkanie_energia'][q] * el, V23, units['electricity'], 'VAT 23%; akcyza 5 zł/MWh oraz opłaty mocowa, OZE i kogeneracyjna.'),
  ('heat', 'Ogrzewanie i gaz', 'Gaz, ciepło, węgiel, drewno', lambda q: div['04_mieszkanie_energia'][q] * heat, heat_v / heat_s, units['heat'], 'VAT 23% (gaz, ciepło systemowe, opał); akcyza na gaz i węgiel dla gospodarstw domowych jest zwolniona.'),
  ('housing', 'Mieszkanie: czynsz, woda, remonty', 'Czynsz, woda, ścieki, naprawy', lambda q: div['04_mieszkanie_energia'][q] * (1 - el - heat - waste), hv / hs, 0, 'Najem mieszkań i opłaty wspólnot zwolnione z VAT; woda i ścieki 8%; materiały remontowe 23%. Opłata śmieciowa liczona osobno.'),
  ('furnishings', 'Wyposażenie domu', 'Meble, AGD, środki czystości', lambda q: div['05_wyposazenie'][q], V23, 0, 'Stawka 23%.'),
  ('health', 'Zdrowie', 'Leki, prywatne wizyty', lambda q: div['06_zdrowie'][q], eff['06'] / 100, 0, 'Leki i wyroby medyczne 8%; usługi medyczne zwolnione.'),
  ('fuel', 'Paliwo do auta', 'Benzyna, olej napędowy, LPG', lambda q: div['07_transport'][q] * fuel, units['fuel_vat'], units['fuel'], 'VAT (obecnie obniżony do 8%), akcyza, opłata paliwowa i emisyjna – liczone dla benzyny 95 po cenie maksymalnej z 27.11.2026.'),
  ('transport', 'Auto i transport', 'Zakup i naprawy auta, bilety', lambda q: div['07_transport'][q] * (1 - fuel), tv / ts, units['cars'] * cars / (1 - fuel), 'Pojazdy i części 23% (część aut używanych bez VAT), bilety 8%; akcyza od samochodów w cenie zakupu.'),
  ('communication', 'Telefon i internet', 'Abonamenty, sprzęt', lambda q: div['08_lacznosc'][q], eff['08_lacznosc'] / 100, 0, 'Stawka 23%.'),
  ('recreation', 'Rekreacja i kultura', 'Hobby, wycieczki, książki', lambda q: div['09_rekreacja_kultura'][q], eff['09_rekreacja_kultura'] / 100, 0, 'Mieszanka stawek: książki 5%, bilety i usługi 8%, sprzęt 23%, wycieczki zorganizowane w procedurze marży.'),
  ('education', 'Edukacja', 'Szkoły, kursy', lambda q: div['10_edukacja'][q], 0, 0, 'Usługi edukacyjne zwolnione z VAT.'),
  ('restaurants', 'Restauracje i hotele', 'Jedzenie na mieście, noclegi', lambda q: div['11_restauracje_hotele'][q], eff['11'] / 100, 0, 'Gastronomia i noclegi 8%, napoje alkoholowe i kawa 23%.'),
  ('other', 'Pozostałe', 'Kosmetyki, fryzjer, ubezpieczenia', lambda q: div['12_pozostale'][q], eff['12_pozostale'] / 100, 0, 'Kosmetyki 23%, fryzjer 8%, ubezpieczenia i usługi finansowe zwolnione.'),
]
tot = {q: sum(f(q) for _, _, _, f, _, _, _ in cats) for q in Q}
out = []
for cid, label, plain, f, vat, exc, note in cats:
  out.append({'id': cid, 'label': label, 'plain': plain, 'shares': [round(f(q) / tot[q], 5) for q in Q], 'vatShare': round(vat, 5), 'exciseShare': round(exc, 5), 'note': note})
# Korekta zaokrągleń: suma udziałów = 1.
for i in range(5):
  s = sum(c['shares'][i] for c in out); out[-1]['shares'][i] = round(out[-1]['shares'][i] + 1 - s, 5)
inc = val(g['dochod_rozporzadzalny_na_osobe'])
print(json.dumps({'categories': out, 'quintileIncome': [inc[q] for q in Q], 'avgHouseholdSize': val(g['przecietna_liczba_osob_w_gospodarstwie'])['ogolem']}, ensure_ascii=False, indent=1))
