# Orebakken — Beslutningsverktøy

Personlig beslutningsverktøy for andelseiere i Orebakken Borettslag. Vises som
vedlegg til beslutningsunderlaget for rehabiliteringsprosjektet 2026, slik at
hver andelseier raskt kan se egne tall for **Pakke 1** og **Pakke 1+2**.

## Komme i gang

```bash
npm install
npm run dev
```

App tilgjengelig på `http://localhost:5173` (eller 5174 hvis Iceland-appen
allerede kjører).

## Bygg for prod

```bash
npm run build      # → dist/
npm run preview    # serv dist lokalt
```

## Datagrunnlag

Tallene kommer fra
`/Users/oyvindborstad/Library/CloudStorage/Dropbox/Orebakken BRL/Forslag til budsjett Rehab Orebakken 2026 pakke 1 og 2.xlsx`.

Når Excel-arket endres, regenerer JSON ved å kjøre Python-skriptet i
`scripts/excel-to-json.py` (eller bruk inline-kommandoen i Git-historikken).
JSON ligger i `src/data/andeler.json` (430 rader). Konstanter for pakker,
strømpris og skattesats ligger i `src/data/forutsetninger.ts`.

## Sider

- `/` — Velkomst med pakkesammendrag og forklaring
- `/finn` — Skriv inn andelsnr (1–430) eller leilighetsnr (4-sifret)
- `/leilighet/:nr` — Personlig oversikt med sammenligningstabell, strøm-egenkontroll
  og print-funksjon

## Senere utvidelser

Plassholdere på velkomstsiden for:
- **Føringsveier** (rør- og kabelinfo)
- **Solcellestyring** (fordeling av solcellestrøm)

Begge integreres når innholdet er klart fra Cowork.

## Deploy

`render.yaml` er forhåndskonfigurert for statisk hosting på Render. Push til
git, koble repo til Render, og en ny deploy bygger automatisk på `main`.
