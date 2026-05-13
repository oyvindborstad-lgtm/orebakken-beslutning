import type { Andel } from "../lib/types";
import { kr, krSigned } from "../lib/format";
import { solenergiKrMndForAndel } from "../lib/calc";
import InfoTip from "./InfoTip";

type Row = {
  label: string;
  info?: React.ReactNode;
  p1: number;
  p2: number;
  p3: number;
  accent?: "save" | "tax" | "net" | "sun";
  sign?: boolean;
};

export default function ComparisonTable({ andel }: { andel: Andel }) {
  // Solenergi for Alt 2 og Alt 3 (samme energimodell — kun lånebeløp varierer).
  const solenergi = solenergiKrMndForAndel(andel.brok, andel.areal); // positivt tall = besparelse

  const p2NettoAr1MedSol = andel.p2.nettoAr1 - solenergi;
  const p2NettoSnittMedSol = andel.p2.nettoSnitt - solenergi;
  const p3NettoAr1MedSol = andel.p3.nettoAr1 - solenergi;
  const p3NettoSnittMedSol = andel.p3.nettoSnitt - solenergi;

  const rows: Row[] = [
    {
      label: "Ny felleskostnad / mnd",
      p1: andel.p1.nyFu,
      p2: andel.p2.nyFu,
      p3: andel.p3.nyFu,
    },
    {
      label: "Bruttoøkning fra dagens",
      p1: andel.p1.okning,
      p2: andel.p2.okning,
      p3: andel.p3.okning,
      sign: true,
    },
    {
      label: "Strømbesparelse oppvarming (areal-fordelt)",
      info: (
        <>
          Alt 1 sparer 500 000 kWh/år (fasadeisolasjon). Alt 2 og Alt 3 sparer
          i tillegg 2 591 753 kWh/år (bergvarme reduserer 75 % av privat
          oppvarming). Fordeles per leilighet etter areal.
        </>
      ),
      p1: andel.p1.stromBesp,
      p2: andel.p2.stromBesp,
      p3: andel.p3.stromBesp,
      accent: "save",
      sign: true,
    },
    {
      label: "Solenergi (FK-reduksjon + overskuddsdeling)",
      info: (
        <>
          Solcelleanlegget produserer 978 180 kWh/år. Hele produksjonen
          verdsettes til 1,20 kr/kWh og fordeles per m² — dekker først
          Istad-felles (FK-reduksjon) og deretter overskuddsdeling til
          andelseierne. Samme verdi for Alt 2 og Alt 3.
        </>
      ),
      p1: 0,
      p2: -solenergi,
      p3: -solenergi,
      accent: "sun",
      sign: true,
    },
    {
      label: "Skattefradrag (22 %, år 1)",
      info: (
        <>
          22 % av borettslagets renteutgifter på nytt felleslån, fordelt etter
          din brøk via RF-1215. Tilfaller deg personlig. Lavere lånebeløp gir
          lavere fradrag (Alt 3 vs Alt 2).
        </>
      ),
      p1: andel.p1.skfrAr1,
      p2: andel.p2.skfrAr1,
      p3: andel.p3.skfrAr1,
      accent: "tax",
      sign: true,
    },
    {
      label: "Netto reell endring / mnd (år 1)",
      info: (
        <>
          Det faktiske beløpet du merker på pengeboken: bruttoøkning −
          strømbesparelse oppvarming − solenergi-kreditt − skattefradrag.
        </>
      ),
      p1: andel.p1.nettoAr1,
      p2: p2NettoAr1MedSol,
      p3: p3NettoAr1MedSol,
      accent: "net",
      sign: true,
    },
    {
      label: "Netto snitt (over hele lånetid)",
      info: (
        <>
          Snitt over hele lånetiden (30 år for Alt 1, 40 år for Alt 2/3). Mer
          representativt for langtidsbudsjettet enn år 1.
        </>
      ),
      p1: andel.p1.nettoSnitt,
      p2: p2NettoSnittMedSol,
      p3: p3NettoSnittMedSol,
      sign: true,
    },
  ];

  const colorFor = (accent: Row["accent"], v: number) => {
    if (accent === "save") return "text-save";
    if (accent === "sun") return "text-warm-deep";
    if (accent === "tax") return "text-tax-ink";
    if (accent === "net")
      return v > 0 ? "text-ink font-bold" : "text-save font-bold";
    return "text-ink";
  };

  return (
    <>
      {/* Mobile: stacked card view */}
      <div className="space-y-3 sm:hidden">
        <div className="rounded-2xl border border-line/70 bg-paper p-4 shadow-card">
          <div className="label">Sammenligning</div>
          <div className="mt-2 flex items-baseline justify-between gap-2 rounded-xl bg-surface/60 px-3 py-2.5">
            <span className="text-[12.5px] font-medium text-muted">
              Dagens fellesk.
            </span>
            <span className="num text-base font-bold text-ink">
              {kr(andel.dagensFu)}
              <span className="ml-1 text-[11px] font-normal text-muted">
                / mnd
              </span>
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-brand-50/70 p-3 text-center">
              <div className="label">Alt 1</div>
              <div className="num mt-1 display text-[17px] font-semibold leading-none text-brand">
                {kr(andel.p1.nyFu)}
              </div>
              <div className="mt-1 text-[10px] text-muted">/ mnd brutto</div>
            </div>
            <div className="rounded-xl bg-warm-bg/80 p-3 text-center">
              <div className="label">Alt 2</div>
              <div className="num mt-1 display text-[17px] font-semibold leading-none text-warm-deep">
                {kr(andel.p2.nyFu)}
              </div>
              <div className="mt-1 text-[10px] text-muted">/ mnd brutto</div>
            </div>
            <div className="rounded-xl bg-save-bg/70 p-3 text-center">
              <div className="label">Alt 3</div>
              <div className="num mt-1 display text-[17px] font-semibold leading-none text-save">
                {kr(andel.p3.nyFu)}
              </div>
              <div className="mt-1 text-[10px] text-muted">/ mnd brutto</div>
            </div>
          </div>
        </div>

        {rows.map((r) => (
          <MobileRow key={r.label} row={r} colorFor={colorFor} />
        ))}
      </div>

      {/* Desktop / tablet: 4-col grid */}
      <div className="hidden rounded-2xl border border-line/70 bg-paper shadow-card sm:block">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-stretch border-b border-line/70">
          <div className="px-6 py-5 sm:px-8">
            <div className="label">Sammenligning</div>
            <div className="mt-1 text-[13px] text-muted">
              Dagens FK:{" "}
              <span className="num font-semibold text-ink">
                {kr(andel.dagensFu)}
              </span>
            </div>
          </div>
          <div className="border-l border-line/70 bg-brand-50/50 px-3 py-5 text-center">
            <div className="label">Alt 1</div>
            <div className="num mt-1 display text-[18px] font-semibold leading-none text-brand">
              {kr(andel.p1.nyFu)}
            </div>
            <div className="mt-1 text-[10px] text-muted">/ mnd brutto</div>
          </div>
          <div className="border-l border-line/70 bg-warm-bg/60 px-3 py-5 text-center">
            <div className="label">Alt 2</div>
            <div className="num mt-1 display text-[18px] font-semibold leading-none text-warm-deep">
              {kr(andel.p2.nyFu)}
            </div>
            <div className="mt-1 text-[10px] text-muted">/ mnd brutto</div>
          </div>
          <div className="border-l border-line/70 bg-save-bg/50 px-3 py-5 text-center">
            <div className="label">Alt 3</div>
            <div className="num mt-1 display text-[18px] font-semibold leading-none text-save">
              {kr(andel.p3.nyFu)}
            </div>
            <div className="mt-1 text-[10px] text-muted">/ mnd brutto</div>
          </div>
        </div>

        <div className="num">
          {rows.map((r, i) => {
            const last = i === rows.length - 1;
            const fmt = (v: number) => (r.sign ? krSigned(v) : kr(v));
            return (
              <div
                key={r.label}
                role="row"
                className={`grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center ${
                  last ? "" : "border-b border-line/40"
                } ${r.accent === "net" ? "bg-tax-bg/40" : ""}`}
              >
                <div className="px-6 py-3.5 text-left text-[14px] font-medium text-ink/80 sm:px-8">
                  {r.label}
                  {r.info && <InfoTip>{r.info}</InfoTip>}
                </div>
                <div
                  className={`px-3 py-3.5 text-right text-[14px] ${colorFor(r.accent, r.p1)}`}
                >
                  {fmt(r.p1)}
                </div>
                <div
                  className={`px-3 py-3.5 text-right text-[14px] ${colorFor(r.accent, r.p2)}`}
                >
                  {fmt(r.p2)}
                </div>
                <div
                  className={`px-3 py-3.5 text-right text-[14px] ${colorFor(r.accent, r.p3)}`}
                >
                  {fmt(r.p3)}
                </div>
              </div>
            );
          })}
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
      <div className="num mt-2.5 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-line/60 bg-paper px-2 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Alt 1
          </div>
          <div className={`mt-1 text-[14px] font-semibold ${colorFor(row.accent, row.p1)}`}>
            {fmt(row.p1)}
          </div>
        </div>
        <div className="rounded-lg border border-line/60 bg-paper px-2 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Alt 2
          </div>
          <div className={`mt-1 text-[14px] font-semibold ${colorFor(row.accent, row.p2)}`}>
            {fmt(row.p2)}
          </div>
        </div>
        <div className="rounded-lg border border-line/60 bg-paper px-2 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Alt 3
          </div>
          <div className={`mt-1 text-[14px] font-semibold ${colorFor(row.accent, row.p3)}`}>
            {fmt(row.p3)}
          </div>
        </div>
      </div>
    </div>
  );
}
