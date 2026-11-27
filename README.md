# Ile oddajesz?

Bezpłatne, otwarte narzędzie edukacyjne. Pokazuje, ile naprawdę płacisz państwu: składki ZUS i NFZ, PIT, VAT i akcyzę w cenach zakupów oraz opłaty lokalne. Wyjaśnia też, kiedy i gdzie te pieniądze płyną i na co są wydawane. Stan prawny i dane: 27 listopada 2026 r. (rok podatkowy 2026).

## Zasady

- **Neutralność.** Pokazujemy fakty i obie strony rachunku (daniny i wydatki). Nie wymieniamy polityków ani partii; pilnuje tego bramka w buildzie.
- **Weryfikowalność.** Każda liczba ma źródło. Jedynym źródłem liczb jest `src/data/rates-2026.json`: liczy z niego kalkulator i z niego powstaje strona „Metodologia”.
- **Prywatność.** Obliczenia działają w przeglądarce. Bez backendu, cookies, analityki i zasobów z obcych domen.

## Stos

Astro 7, TypeScript 6, czysty TS w komponentach (bez frameworka UI), ręczne SVG/CSS, Vitest, Playwright + axe. Hosting: Cloudflare Workers Static Assets. Wszystkie zależności są na licencjach MIT/Apache-2.0/MPL-2.0; czcionki Inter i Sora na licencji SIL OFL 1.1 (`public/fonts/OFL-*.txt`).

## Komendy

```bash
npm install
npm run dev        # podgląd na żywo
npm test           # testy silnika obliczeń
npm run build      # astro check + build + nagłówki CSP + bramki jakości
npm run test:e2e   # testy w przeglądarce (wymaga zbudowanego dist/)
npm run preview    # serwuje dist/ na :4400
```

Publikacja (po zakupie domeny i decyzji właściciela): `npx wrangler deploy` (projekt ma `wrangler.jsonc`). Zmienne przy buildzie: `PUBLIC_SITE_URL`, `PUBLIC_INDEXABLE=true` (włącza indeksowanie), `PUBLIC_REPO_URL` (domyślnie https://github.com/NexaITPoland/ileoddajesz).

## Struktura

- `src/lib/engine/` – silnik: `labor.ts` (składki i PIT), `consumption.ts` (VAT, akcyza), `index.ts` (całość, dzień wolności, podział wydatków).
- `src/data/rates-2026.json` – stawki, dane i źródła (`sources`, `refs`).
- `src/scripts/app.ts` – kalkulator i wizualizacje.
- `research/` – notatki z weryfikacji źródeł (płace, konsumpcja, budżet, przegląd podobnych narzędzi na świecie).
- `scripts/` – CSP, bramki jakości, budowa koszyka z danych GUS.

## Coroczna aktualizacja

1. Skopiuj `rates-2026.json` do `rates-2027.json`, zaktualizuj wartości i źródła (lista parametrów: strona Metodologia).
2. Koszyk: nowe „Budżety gospodarstw domowych” GUS → `scripts/build-basket.py`.
3. `npm test && npm run build`, przejrzyj Metodologię.

## Licencja

Kod: MIT. Treści, metodologia i dane: CC BY 4.0.
