import type { Andel, PakkeId, RenteBaneId } from "../lib/types";
import { kr, krSigned } from "../lib/format";
import { solenergiKrMndForAndel } from "../lib/calc";
import InfoTip from "./InfoTip";

const RENTE_LABELS: Record<RenteBaneId, string> = {
  r1: "5,04 %",
  r2: "5,54 %",
  r3: "6,04 %",
};

type Cell = { pakke: PakkeId; rente: RenteBaneId };

const CELLS: Cell[] = [
  { pakke: "p1", rente: "r1" },
  { pakke: "p1", rente: "r2" },
  { pakke: "p1", rente: "r3" },
  { pakke: "p2", rente: "r1" },
  { pakke: "p2", rente: "r2" },
  { pakke: "p2", rente: "r3" },
];

type Row = {
  label: string;
  info?: React.ReactNode;
  values: number[];
  accent?: "save" | "tax" | "net" | "sun";
  sign?: boolean;
};

export default function ComparisonTable({ andel }: { andel: Andel }) {
  const solenergi = solenergiKrMndForAndel(andel.brok, andel.areal);

  const getValue = (cell: Cell, field: keyof Andel["p1"]["r1"]): number => {
    return andel[cell.pakke][cell.rente][field] as number;
  };

  const nyFu = CELLS.map((c) => getValue(c, "nyFu"));
  const okning = CELLS.map((c) => getValue(c, "okning"));
  const stromBesp = CELLS.map((c) => getValue(c, "stromBesp"));
  const skfrAr1 = CELLS.map((c) => getValue(c, "skfrAr1"));
  // P1 har ingen solenergi; P2 har den
  const sol = CELLS.map((c) => (c.pakke === "p2" ? -solenergi : 0));
  const nettoAr1 = CELLS.map((c) => getValue(c, "nettoAr1") - (c.pakke === "p2" ? solenergi : 0));
  const nettoSnitt = CELLS.map((c) => getValue(c, "nettoSnitt") - (c.pakke === "p2" ? solenergi : 0));

  const rows: Row[] = [
    { label: "Ny felleskostnad / mnd", values: nyFu },
    { label: "Bruttoøkning fra dagens", values: okning, sign: true },
    {
      label: "Strømbesparelse oppvarming (areal-fordelt)",
      info: (
        <>
          Pakke 1 sparer 500 000 kWh/år (vinduer + fasadeisolasjon). Pakke 2
          sparer i tillegg 2 591 753 kWh/år (bergvarme reduserer 75 % av
          privat oppvarming). Fordeles per leilighet etter areal — uavhengig
          av rentebane.
        </>
      ),
      values: stromBesp,
      accent: "save",
      sign: true,
    },
    {
      label: "Solenergi (areal-fordelt)",
      info: (
        <>
          Solcelleanlegget produserer 978 180 kWh/år (kun Pakke 2). Hele
          produksjonen verdsettes til 1,20 kr/kWh og fordeles per m².
        </>
      ),
      values: sol,
      accent: "sun",
      sign: true,
    },
    {
      label: "Skattefradrag (22 %, år 1)",
      info: (
        <>
          22 % av borettslagets renteutgifter, fordelt etter din brøk via
          RF-1215. Varierer med rentebane (høyere rente → høyere fradrag).
        </>
      ),
      values: skfrAr1,
      accent: "tax",
      sign: true,
    },
    {
      label: "Netto reell endring / mnd (år 1)",
      info: <>Bruttoøkning − strømbesparelse oppvarming − solenergi − skattefradrag år 1.</>,
      values: nettoAr1,
      accent: "net",
      sign: true,
    },
    {
      label: "Netto snitt (over hele lånetid)",
      info: <>Snitt over lånetiden (30 år P1 / 40 år P2). Mer representativt enn år 1.</>,
      values: nettoSnitt,
      sign: true,
    },
  ];

  const colorFor = (accent: Row["accent"], v: number) => {
    if (accent === "save") return "text-save";
    if (accent === "sun") return "text-warm-deep";
    if (accent === "tax") return "text-tax-ink";
    if (accent === "net") return v > 0 ? "text-ink font-bold" : "text-save font-bold";
    return "text-ink";
  };

  return (
    <>
      {/* Mobile: stacked card view, gruppert per pakke */}
      <div className="space-y-3 sm:hidden">
        <div className="rounded-2xl border border-line/70 bg-paper p-4 shadow-card">
          <div className="label">Sammenligning</div>
          <div className="mt-2 flex items-baseline justify-between gap-2 rounded-xl bg-surface/60 px-3 py-2.5">
            <span className="text-[12.5px] font-medium text-muted">
              Dagens fellesk.
            </span>
            <span className="num text-base font-bold text-ink">
              {kr(andel.dagensFu)}
              <span className="ml-1 text-[11px] font-normal text-muted">/ mnd</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-[11.5px] font-semibold text-brand mb-1.5">Pakke 1 — Ny FK brutto</div>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg bg-brand-50/70 p-2 text-center">
                  <div className="text-[9px] font-medium uppercase tracking-wide text-muted">
                    {RENTE_LABELS[CELLS[i].rente]}
                  </div>
                  <div className="num mt-0.5 text-[13px] font-semibold text-brand">
                    {kr(nyFu[i])}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[11.5px] font-semibold text-warm-deep mb-1.5">Pakke 2 — Ny FK brutto</div>
            <div className="grid grid-cols-3 gap-1.5">
              {[3, 4, 5].map((i) => (
                <div key={i} className="rounded-lg bg-warm-bg/80 p-2 text-center">
                  <div className="text-[9px] font-medium uppercase tracking-wide text-muted">
                    {RENTE_LABELS[CELLS[i].rente]}
                  </div>
                  <div className="num mt-0.5 text-[13px] font-semibold text-warm-deep">
                    {kr(nyFu[i])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {rows.map((r) => (
          <MobileRow key={r.label} row={r} colorFor={colorFor} />
        ))}
      </div>

      {/* Desktop: 7-col grid (label + 6 verdier), gruppert med to fargesoner */}
      <div className="hidden rounded-2xl border border-line/70 bg-paper shadow-card sm:block">
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[1.6fr_repeat(3,1fr)_repeat(3,1fr)] items-stretch border-b border-line/70">
              <div className="px-4 py-4 sm:px-6">
                <div className="label">Sammenligning</div>
                <div className="mt-1 text-[13px] text-muted">
                  Dagens FK:{" "}
                  <span className="num font-semibold text-ink">{kr(andel.dagensFu)}</span>
                </div>
              </div>
              <div className="col-span-3 border-l border-line/70 bg-brand-50/50 px-3 py-3 text-center">
                <div className="label !text-brand">Pakke 1 — 190 mill, 30 år</div>
                <div className="mt-0.5 text-[10.5px] text-muted">tre rentebaner (grønt lån)</div>
              </div>
              <div className="col-span-3 border-l border-line/70 bg-warm-bg/60 px-3 py-3 text-center">
                <div className="label !text-warm-deep">Pakke 2 — 341,7 mill, 40 år</div>
                <div className="mt-0.5 text-[10.5px] text-muted">tre rentebaner (grønt lån)</div>
              </div>
            </div>
            <div className="grid grid-cols-[1.6fr_repeat(3,1fr)_repeat(3,1fr)] items-stretch border-b border-line/70">
              <div className="px-4 py-2 sm:px-6" />
              {CELLS.map((c, i) => (
                <div
                  key={i}
                  className={`border-l border-line/70 px-2 py-2.5 text-center ${c.pakke === "p1" ? "bg-brand-50/30" : "bg-warm-bg/40"}`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    {RENTE_LABELS[c.rente]}
                  </div>
                  <div className={`num mt-1 text-[13px] font-semibold ${c.pakke === "p1" ? "text-brand" : "text-warm-deep"}`}>
                    {kr(nyFu[i])}
                  </div>
                </div>
              ))}
            </div>

            <div className="num">
              {rows.map((r, idx) => {
                const last = idx === rows.length - 1;
                const fmt = (v: number) => (r.sign ? krSigned(v) : kr(v));
                return (
                  <div
                    key={r.label}
                    role="row"
                    className={`grid grid-cols-[1.6fr_repeat(3,1fr)_repeat(3,1fr)] items-center ${
                      last ? "" : "border-b border-line/40"
                    } ${r.accent === "net" ? "bg-tax-bg/40" : ""}`}
                  >
                    <div className="px-4 py-3 text-left text-[13px] font-medium text-ink/80 sm:px-6 sm:text-[13.5px]">
                      {r.label}
                      {r.info && <InfoTip>{r.info}</InfoTip>}
                    </div>
                    {r.values.map((v, i) => (
                      <div
                        key={i}
                        className={`border-l border-line/30 px-2 py-3 text-right text-[12.5px] sm:text-[13.5px] ${colorFor(r.accent, v)}`}
                      >
                        {fmt(v)}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileRow({
  row,
  colorFor,
}: {
  row: Row;
  colorFor: (accent: Row["accent"], v: number) => string;
}) {
  const fmt = (v: number) => (row.sign ? krSigned(v) : kr(v));
  const bg = row.accent === "net" ? "bg-tax-bg/50" : "bg-paper";
  return (
    <div className={`rounded-2xl border border-line/70 p-4 ${bg}`}>
      <div className="flex items-center justify-between gap-2 text-[13.5px] font-medium text-ink/85">
        <span>{row.label}</span>
        {row.info && <InfoTip>{row.info}</InfoTip>}
      </div>
      <div className="num mt-2.5 space-y-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-brand mb-1">Pakke 1</div>
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-line/60 bg-paper px-2 py-1.5">
                <div className="text-[9px] font-medium text-muted">{RENTE_LABELS[CELLS[i].rente]}</div>
                <div className={`text-[13px] font-semibold ${colorFor(row.accent, row.values[i])}`}>
                  {fmt(row.values[i])}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-warm-deep mb-1">Pakke 2</div>
          <div className="grid grid-cols-3 gap-1.5">
            {[3, 4, 5].map((i) => (
              <div key={i} className="rounded-lg border border-line/60 bg-paper px-2 py-1.5">
                <div className="text-[9px] font-medium text-muted">{RENTE_LABELS[CELLS[i].rente]}</div>
                <div className={`text-[13px] font-semibold ${colorFor(row.accent, row.values[i])}`}>
                  {fmt(row.values[i])}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
