import type { Andel } from "../lib/types";
import { kr, krSigned } from "../lib/format";
import InfoTip from "./InfoTip";

export default function ComparisonTable({ andel }: { andel: Andel }) {
  const rows: {
    label: string;
    info?: React.ReactNode;
    p1: number;
    p2: number;
    accent?: "save" | "tax" | "net";
    sign?: boolean;
  }[] = [
    { label: "Ny felleskostnad / mnd", p1: andel.p1.nyFu, p2: andel.p2.nyFu },
    {
      label: "Bruttoøkning fra dagens",
      p1: andel.p1.okning,
      p2: andel.p2.okning,
      sign: true,
    },
    {
      label: "Strømbesparelse",
      info: (
        <>
          Pakke 1 sparer ca. 500 000 kWh/år (bedre isolering). Pakke 1+2 sparer
          3,725 mill kWh/år (også bergvarme + solceller). Fordeles per leilighet
          etter areal.
        </>
      ),
      p1: andel.p1.stromBesp,
      p2: andel.p2.stromBesp,
      accent: "save",
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
          Det faktiske beløpet du merker på pengeboken: bruttoøkning − strømbesparelse −
          skattefradrag. Dette er tallet som teller i privatøkonomien din.
        </>
      ),
      p1: andel.p1.nettoAr1,
      p2: andel.p2.nettoAr1,
      accent: "net",
      sign: true,
    },
    {
      label: "Netto snitt (over hele lånetid)",
      info: (
        <>
          Som over, men med gjennomsnittlig rentekostnad fordelt over hele
          nedbetalingstiden — et mer representativt langtidsbudsjett.
        </>
      ),
      p1: andel.p1.nettoSnitt,
      p2: andel.p2.nettoSnitt,
      sign: true,
    },
  ];

  return (
    <div className="card overflow-hidden p-0">
      <div className="grid grid-cols-[1.6fr_1fr_1fr] items-stretch border-b border-black/5">
        <div className="px-6 py-4 sm:px-8">
          <div className="label">Sammenligning</div>
          <div className="mt-1 text-sm text-muted">
            Dagens FK: <span className="num font-semibold text-ink">{kr(andel.dagensFu)}</span>
          </div>
        </div>
        <div className="bg-brand-50/60 px-4 py-4 text-center">
          <div className="label">Pakke 1</div>
          <div className="num mt-1 text-base font-semibold text-brand">{kr(andel.p1.nyFu)}</div>
        </div>
        <div className="bg-warm/10 px-4 py-4 text-center">
          <div className="label">Pakke 1+2</div>
          <div className="num mt-1 text-base font-semibold text-warm">{kr(andel.p2.nyFu)}</div>
        </div>
      </div>

      <div className="num">
        {rows.map((r, i) => {
          const last = i === rows.length - 1;
          const fmt = (v: number) => (r.sign ? krSigned(v) : kr(v));
          const colorFor = (v: number) => {
            if (r.accent === "save") return "text-save";
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
                last ? "" : "border-b border-black/5"
              } ${r.accent === "net" ? "bg-tax-bg/40" : ""}`}
            >
              <div className="px-6 py-3.5 text-left text-sm font-medium text-ink/80 sm:px-8">
                {r.label}
                {r.info && <InfoTip>{r.info}</InfoTip>}
              </div>
              <div className={`px-4 py-3.5 text-right text-sm ${colorFor(r.p1)}`}>
                {fmt(r.p1)}
              </div>
              <div className={`px-4 py-3.5 text-right text-sm ${colorFor(r.p2)}`}>
                {fmt(r.p2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
