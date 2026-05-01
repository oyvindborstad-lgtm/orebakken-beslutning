import type { Andel } from "../lib/types";
import { kr, krSigned } from "../lib/format";
import { solenergiKrMndForBrok } from "../lib/calc";
import InfoTip from "./InfoTip";

type Row = {
  label: string;
  info?: React.ReactNode;
  p1: number;
  p2: number;
  accent?: "save" | "tax" | "net" | "sun";
  sign?: boolean;
};

export default function ComparisonTable({ andel }: { andel: Andel }) {
  // Solenergi via overskuddsdeling: andelens andel av solproduksjonen,
  // fordelt etter brøk og kreditert direkte på private strømregningen.
  // Inngår nå i strømbesparelsen og dermed i netto reell endring.
  const solenergi = solenergiKrMndForBrok(andel.brok); // positivt tall = besparelse
  const p2NettoAr1MedSol = andel.p2.nettoAr1 - solenergi;
  const p2NettoSnittMedSol = andel.p2.nettoSnitt - solenergi;

  const rows: Row[] = [
    { label: "Ny felleskostnad / mnd", p1: andel.p1.nyFu, p2: andel.p2.nyFu },
    {
      label: "Bruttoøkning fra dagens",
      p1: andel.p1.okning,
      p2: andel.p2.okning,
      sign: true,
    },
    {
      label: "Strømbesparelse oppvarming (areal-fordelt)",
      info: (
        <>
          Pakke 1 sparer 500 000 kWh/år (bedre fasadeisolasjon). Pakke 1+2
          sparer 3 875 000 kWh/år oppvarming (P1-isolasjon + bergvarme som
          erstatter ~75 % av oppvarmingen, der bergvarmens eget strømforbruk på
          1 128 018 kWh/år allerede er trukket fra). Fordeles per leilighet
          etter areal.
        </>
      ),
      p1: andel.p1.stromBesp,
      p2: andel.p2.stromBesp,
      accent: "save",
      sign: true,
    },
    {
      label: "Solenergi via overskuddsdeling (brøk-fordelt)",
      info: (
        <>
          Solcelleanlegget produserer 978 180 kWh/år. Borettslaget vil bruke
          overskuddsdelingsordningen til å fordele produksjonen direkte på
          hver andels private strømmåler via Elhub, etter eierbrøk. Kreditten
          reduserer din private strømregning og er nå inkludert i netto reell
          endring.
        </>
      ),
      p1: 0,
      p2: -solenergi,
      accent: "sun",
      sign: true,
    },
    {
      label: "Skattefradrag (22 %, år 1)",
      info: (
        <>
          22 % av borettslagets renteutgifter på nytt felleslån, fordelt etter
          din brøk via RF-1215. Tilfaller deg personlig — ikke borettslaget. År
          1 er høyest; reduseres etter hvert som lånet nedbetales.
        </>
      ),
      p1: andel.p1.skfrAr1,
      p2: andel.p2.skfrAr1,
      accent: "tax",
      sign: true,
    },
    {
      label: "Netto reell endring / mnd (år 1)",
      info: (
        <>
          Det faktiske beløpet du merker på pengeboken: bruttoøkning −
          strømbesparelse oppvarming − solenergi-kreditt − skattefradrag.
          Solenergi via overskuddsdeling er inkludert.
        </>
      ),
      p1: andel.p1.nettoAr1,
      p2: p2NettoAr1MedSol,
      accent: "net",
      sign: true,
    },
    {
      label: "Netto snitt (over hele lånetid)",
      info: (
        <>
          Renten — og dermed skattefradraget på 22 % — er høyest år 1 og synker
          gradvis etter hvert som lånet nedbetales. «Snitt» er gjennomsnittet
          over hele lånetiden (30 år for P1, 40 år for P1+2) og er det mest
          representative langtidsbudsjettet for husstanden din. Solenergi via
          overskuddsdeling er inkludert.
        </>
      ),
      p1: andel.p1.nettoSnitt,
      p2: p2NettoSnittMedSol,
      sign: true,
    },
  ];

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
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-brand-50/70 p-3 text-center">
              <div className="label">Pakke 1</div>
              <div className="num mt-1 display text-[20px] font-semibold leading-none text-brand">
                {kr(andel.p1.nyFu)}
              </div>
              <div className="mt-1 text-[10.5px] text-muted">/ mnd brutto</div>
            </div>
            <div className="rounded-xl bg-warm-bg/80 p-3 text-center">
              <div className="label">Pakke 1+2</div>
              <div className="num mt-1 display text-[20px] font-semibold leading-none text-warm-deep">
                {kr(andel.p2.nyFu)}
              </div>
              <div className="mt-1 text-[10.5px] text-muted">/ mnd brutto</div>
            </div>
          </div>
        </div>

        {rows.map((r) => (
          <MobileRow key={r.label} row={r} />
        ))}
      </div>

      {/* Desktop / tablet: 3-col grid */}
      <div className="hidden rounded-2xl border border-line/70 bg-paper shadow-card sm:block">
        <div className="grid grid-cols-[1.6fr_1fr_1fr] items-stretch border-b border-line/70">
          <div className="px-6 py-5 sm:px-8">
            <div className="label">Sammenligning</div>
            <div className="mt-1 text-[13px] text-muted">
              Dagens FK:{" "}
              <span className="num font-semibold text-ink">
                {kr(andel.dagensFu)}
              </span>
            </div>
          </div>
          <div className="border-l border-line/70 bg-brand-50/50 px-4 py-5 text-center">
            <div className="label">Pakke 1</div>
            <div className="num mt-1 display text-[22px] font-semibold leading-none text-brand">
              {kr(andel.p1.nyFu)}
            </div>
            <div className="mt-1 text-[10.5px] text-muted">/ mnd brutto</div>
          </div>
          <div className="border-l border-line/70 bg-warm-bg/60 px-4 py-5 text-center">
            <div className="label">Pakke 1+2</div>
            <div className="num mt-1 display text-[22px] font-semibold leading-none text-warm-deep">
              {kr(andel.p2.nyFu)}
            </div>
            <div className="mt-1 text-[10.5px] text-muted">/ mnd brutto</div>
          </div>
        </div>

        <div className="num">
          {rows.map((r, i) => {
            const last = i === rows.length - 1;
            const fmt = (v: number) => (r.sign ? krSigned(v) : kr(v));
            const colorFor = (v: number) => {
              if (r.accent === "save") return "text-save";
              if (r.accent === "sun") return "text-warm-deep";
              if (r.accent === "tax") return "text-tax-ink";
              if (r.accent === "net")
                return v > 0 ? "text-ink font-bold" : "text-save font-bold";
              return "text-ink";
            };
            return (
              <div
                key={r.label}
                role="row"
                className={`grid grid-cols-[1.6fr_1fr_1fr] items-center ${
                  last ? "" : "border-b border-line/40"
                } ${r.accent === "net" ? "bg-tax-bg/40" : ""}`}
              >
                <div className="px-6 py-3.5 text-left text-[14px] font-medium text-ink/80 sm:px-8">
                  {r.label}
                  {r.info && <InfoTip>{r.info}</InfoTip>}
                </div>
                <div
                  className={`px-4 py-3.5 text-right text-[14px] ${colorFor(r.p1)}`}
                >
                  {fmt(r.p1)}
                </div>
                <div
                  className={`px-4 py-3.5 text-right text-[14px] ${colorFor(r.p2)}`}
                >
                  {fmt(r.p2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function MobileRow({ row }: { row: Row }) {
  const fmt = (v: number) => (row.sign ? krSigned(v) : kr(v));
  const colorFor = (v: number) => {
    if (row.accent === "save") return "text-save";
    if (row.accent === "sun") return "text-warm-deep";
    if (row.accent === "tax") return "text-tax-ink";
    if (row.accent === "net")
      return v > 0 ? "text-ink font-bold" : "text-save font-bold";
    return "text-ink";
  };
  const bg = row.accent === "net" ? "bg-tax-bg/50" : "bg-paper";
  return (
    <div className={`rounded-2xl border border-line/70 p-4 ${bg}`}>
      <div className="flex items-center justify-between gap-2 text-[13.5px] font-medium text-ink/85">
        <span>{row.label}</span>
        {row.info && <InfoTip>{row.info}</InfoTip>}
      </div>
      <div className="num mt-2.5 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-line/60 bg-paper px-3 py-2.5">
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">
            Pakke 1
          </div>
          <div className={`mt-1 text-[16px] font-semibold ${colorFor(row.p1)}`}>
            {fmt(row.p1)}
          </div>
        </div>
        <div className="rounded-lg border border-line/60 bg-paper px-3 py-2.5">
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">
            Pakke 1+2
          </div>
          <div className={`mt-1 text-[16px] font-semibold ${colorFor(row.p2)}`}>
            {fmt(row.p2)}
          </div>
        </div>
      </div>
    </div>
  );
}
