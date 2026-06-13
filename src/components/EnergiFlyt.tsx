import { useState, useMemo } from "react";
import {
  ENERGI_2026,
  SOL_ALLE_BYGG_AR,
  SOL_KUN_PHUS_AR,
  FORBRUKSPRIS_KR_PER_KWH,
  SALGSPRIS_SPOT_KR_PER_KWH,
  solFordelingForMnd,
  solFordelingArs,
} from "../data/energi-historikk";

const fmt = (n: number) => Math.round(n).toLocaleString("nb-NO");
const fmtKr = (n: number) => `${fmt(n)} kr`;
const pct = (n: number) =>
  `${(n * 100).toFixed(1).replace(".", ",")} %`;

type Scenario = "alle" | "phus";

/**
 * Viser produksjon vs forbruk per måned + hvordan sol-overskuddet
 * kan absorberes av varmtvann-lager (bergvarmens akkumulatortank).
 */
export default function EnergiFlyt() {
  const [scenario, setScenario] = useState<Scenario>("alle");
  const [lagring, setLagring] = useState<number>(80); // % av overskudd som lagres

  const data = useMemo(() => {
    const månedlig = ENERGI_2026.map((m) => {
      const fordeling = solFordelingForMnd(m, scenario);
      // Lagring tar (lagring/100)% av overskuddet til varmtvann; resten selges
      const tilLager = fordeling.overskudd * (lagring / 100);
      const tilSalg = fordeling.overskudd - tilLager;
      return {
        ...m,
        sol: fordeling.sol,
        tilFelles: fordeling.tilFelles,
        tilAndel: fordeling.tilAndel,
        tilLager,
        tilSalg,
        overskudd: fordeling.overskudd,
      };
    });
    const totSol = scenario === "alle" ? SOL_ALLE_BYGG_AR : SOL_KUN_PHUS_AR;
    const sum = solFordelingArs(scenario);
    const tilLagerAr = sum.overskudd * (lagring / 100);
    const tilSalgAr = sum.overskudd - tilLagerAr;
    // Verdi:
    // - sol til felles + sol til andel: erstatter strøm-kjøp à 1,20 kr
    // - sol til lager: erstatter varmtvann-oppvarming à 1,20 kr
    // - sol til salg: 0,50 kr
    const verdiUtenLager =
      (sum.tilFelles + sum.tilAndel) * FORBRUKSPRIS_KR_PER_KWH +
      sum.overskudd * SALGSPRIS_SPOT_KR_PER_KWH;
    const verdiMedLager =
      (sum.tilFelles + sum.tilAndel) * FORBRUKSPRIS_KR_PER_KWH +
      tilLagerAr * FORBRUKSPRIS_KR_PER_KWH +
      tilSalgAr * SALGSPRIS_SPOT_KR_PER_KWH;
    const gevinst = verdiMedLager - verdiUtenLager;
    return {
      månedlig,
      totSol,
      sum,
      tilLagerAr,
      tilSalgAr,
      verdiUtenLager,
      verdiMedLager,
      gevinst,
      dekningTotal: (sum.tilFelles + sum.tilAndel) / (sum.fellesKjopt + sum.tilFelles + sum.tilAndel + sum.andelKjopt),
    };
  }, [scenario, lagring]);

  // Beregn y-akse maks for å skalere stolper
  const yMax = useMemo(() => {
    const maxFelles = Math.max(...ENERGI_2026.map((m) => m.fellesKWh));
    const maxSol = scenario === "alle" ? 191_800 : 60_393;
    return Math.max(maxFelles, maxSol) * 1.1;
  }, [scenario]);

  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-warm-bg text-warm-deep sm:h-11 sm:w-11">
          ☀️
        </div>
        <div className="min-w-0 flex-1">
          <div className="label !text-warm-deep">Pakke 2 · energi-flyt</div>
          <h3 className="display mt-1 text-lg font-semibold text-ink sm:text-xl">
            Produsert sol vs forbrukt strøm — og hvordan vi unngår å selge billig
          </h3>
          <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-muted sm:text-[14px]">
            Solproduksjonen topper i juni–august, men da har vi minst behov
            for fellesstrøm. Bergvarmens varmtvannstank kan brukes som
            energilager: vi varmer opp tanken når sola produserer mest, og
            unngår å selge til lav spot-pris (0,50 kr) når vi heller kan
            erstatte kjøpsstrøm (1,20 kr).
          </p>
        </div>
      </div>

      {/* Scenario-toggle */}
      <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="label">Solcelle-scenario:</span>
        <button
          type="button"
          onClick={() => setScenario("alle")}
          className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition ${
            scenario === "alle"
              ? "border-warm-deep bg-warm-deep text-white"
              : "border-line/70 bg-paper text-ink/80 hover:border-warm/60"
          }`}
        >
          Alle bygg · 978 180 kWh/år
        </button>
        <button
          type="button"
          onClick={() => setScenario("phus")}
          className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition ${
            scenario === "phus"
              ? "border-warm-deep bg-warm-deep text-white"
              : "border-line/70 bg-paper text-ink/80 hover:border-warm/60"
          }`}
        >
          Kun parkeringshus · 308 000 kWh/år
        </button>
      </div>

      {/* Lagring-slider */}
      <div className="mt-4 rounded-2xl border border-line/70 bg-surface/40 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor="lagring" className="label">
            Andel av sommer-overskudd som lagres i varmtvann
          </label>
          <span className="num text-base font-semibold text-warm-deep">
            {lagring} %
          </span>
        </div>
        <input
          id="lagring"
          type="range"
          min={0}
          max={100}
          step={5}
          value={lagring}
          onChange={(e) => setLagring(Number(e.target.value))}
          className="mt-3 w-full accent-warm-deep"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span>0 % = alt selges til nettet (0,50 kr/kWh)</span>
          <span>100 % = alt lagres som varmtvann (1,20 kr/kWh)</span>
        </div>
      </div>

      {/* Månedlig chart */}
      <div className="mt-6">
        <div className="label mb-2">Produsert sol vs forbruk · per måned 2026</div>
        <div className="rounded-2xl border border-line/70 bg-paper p-3 sm:p-4">
          <div className="grid grid-cols-12 gap-1 sm:gap-1.5">
            {data.månedlig.map((m) => {
              const total = m.tilFelles + m.tilAndel + m.tilLager + m.tilSalg;
              const fellesPct = (m.tilFelles / yMax) * 100;
              const andelPct = (m.tilAndel / yMax) * 100;
              const lagerPct = (m.tilLager / yMax) * 100;
              const salgPct = (m.tilSalg / yMax) * 100;
              const forbrukPct = (m.fellesKWh / yMax) * 100;
              return (
                <div key={m.mnd} className="flex flex-col items-center">
                  <div className="relative h-32 w-full sm:h-40">
                    {/* Stack: sol-fordeling */}
                    <div
                      className="absolute bottom-0 left-0 right-0 flex flex-col-reverse rounded-sm overflow-hidden"
                      style={{ height: `${Math.min(100, (total / yMax) * 100)}%` }}
                    >
                      {fellesPct > 0 && (
                        <div
                          className="bg-brand"
                          style={{ height: `${(m.tilFelles / total) * 100}%` }}
                          title={`Sol → felles: ${fmt(m.tilFelles)} kWh`}
                        />
                      )}
                      {andelPct > 0 && (
                        <div
                          className="bg-save"
                          style={{ height: `${(m.tilAndel / total) * 100}%` }}
                          title={`Sol → andelseiere: ${fmt(m.tilAndel)} kWh`}
                        />
                      )}
                      {lagerPct > 0 && (
                        <div
                          className="bg-warm-deep"
                          style={{ height: `${(m.tilLager / total) * 100}%` }}
                          title={`Sol → varmtvann-lager: ${fmt(m.tilLager)} kWh`}
                        />
                      )}
                      {salgPct > 0 && (
                        <div
                          className="bg-tax-ink/60"
                          style={{ height: `${(m.tilSalg / total) * 100}%` }}
                          title={`Sol → salg: ${fmt(m.tilSalg)} kWh`}
                        />
                      )}
                    </div>
                    {/* Linje for fellesareal-forbruk */}
                    <div
                      className="absolute left-0 right-0 border-t-2 border-dashed border-ink/40"
                      style={{ bottom: `${forbrukPct}%` }}
                      title={`Fellesareal-forbruk: ${fmt(m.fellesKWh)} kWh`}
                    />
                  </div>
                  <div className="mt-1 text-[9px] font-medium text-muted sm:text-[10px]">
                    {m.mnd}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Forklaring av farger */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-ink/80 sm:text-[12px]">
            <LegendDot color="bg-brand" label="Sol → fellesareal" />
            <LegendDot color="bg-save" label="Sol → andelseiere" />
            <LegendDot color="bg-warm-deep" label="Sol → varmtvann (lager)" />
            <LegendDot color="bg-tax-ink/60" label="Sol → salg til nett" />
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 border-t-2 border-dashed border-ink/40" />
              Fellesareal-forbruk
            </span>
          </div>
        </div>
      </div>

      {/* Sammenstilling: verdi-effekt */}
      <div className="mt-6 grid gap-3 sm:gap-4 md:grid-cols-3">
        <KpiKort
          label="Sol som dekker forbruk"
          value={`${fmt(data.sum.tilFelles + data.sum.tilAndel)} kWh/år`}
          sub={`${pct(data.dekningTotal)} av totalt strøm-kjøp`}
        />
        <KpiKort
          label="Sommer-overskudd"
          value={`${fmt(data.sum.overskudd)} kWh/år`}
          sub={`Lagres: ${fmt(data.tilLagerAr)} kWh · Selges: ${fmt(data.tilSalgAr)} kWh`}
          tone="warm"
        />
        <KpiKort
          label="Årsverdi av solar"
          value={fmtKr(data.verdiMedLager)}
          sub={
            data.gevinst > 0
              ? `+${fmtKr(data.gevinst)} mer enn ved kun salg`
              : "Alt overskudd selges"
          }
          tone="save"
        />
      </div>

      {/* Detaljer-tabell */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line/70">
        <table className="w-full min-w-[640px] text-[12.5px]">
          <thead>
            <tr className="bg-brand text-white">
              <th className="px-3 py-2 text-left text-[10.5px] font-semibold uppercase tracking-wide">Måned</th>
              <th className="px-3 py-2 text-right text-[10.5px] font-semibold uppercase tracking-wide">Sol</th>
              <th className="px-3 py-2 text-right text-[10.5px] font-semibold uppercase tracking-wide">Felles forbruk</th>
              <th className="px-3 py-2 text-right text-[10.5px] font-semibold uppercase tracking-wide">→ Felles</th>
              <th className="px-3 py-2 text-right text-[10.5px] font-semibold uppercase tracking-wide">→ Andeler</th>
              <th className="px-3 py-2 text-right text-[10.5px] font-semibold uppercase tracking-wide">→ Lager</th>
              <th className="px-3 py-2 text-right text-[10.5px] font-semibold uppercase tracking-wide">→ Salg</th>
            </tr>
          </thead>
          <tbody className="num">
            {data.månedlig.map((m, i) => (
              <tr key={m.mnd} className={i % 2 ? "bg-surface/40" : "bg-paper"}>
                <td className="px-3 py-1.5 font-medium text-ink">{m.mnd}{m.prognose && <span className="ml-1 text-[9px] text-muted">(p)</span>}</td>
                <td className="px-3 py-1.5 text-right text-warm-deep">{fmt(m.sol)}</td>
                <td className="px-3 py-1.5 text-right text-ink/70">{fmt(m.fellesKWh)}</td>
                <td className="px-3 py-1.5 text-right text-brand">{fmt(m.tilFelles)}</td>
                <td className="px-3 py-1.5 text-right text-save">{fmt(m.tilAndel)}</td>
                <td className="px-3 py-1.5 text-right text-warm-deep">{fmt(m.tilLager)}</td>
                <td className="px-3 py-1.5 text-right text-tax-ink">{fmt(m.tilSalg)}</td>
              </tr>
            ))}
            <tr className="bg-brand-50 font-semibold">
              <td className="px-3 py-2 text-ink">SUM år</td>
              <td className="px-3 py-2 text-right text-warm-deep">{fmt(data.sum.sol)}</td>
              <td className="px-3 py-2 text-right text-ink">{fmt(data.sum.tilFelles + data.sum.fellesKjopt)}</td>
              <td className="px-3 py-2 text-right text-brand">{fmt(data.sum.tilFelles)}</td>
              <td className="px-3 py-2 text-right text-save">{fmt(data.sum.tilAndel)}</td>
              <td className="px-3 py-2 text-right text-warm-deep">{fmt(data.tilLagerAr)}</td>
              <td className="px-3 py-2 text-right text-tax-ink">{fmt(data.tilSalgAr)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-muted sm:text-[12.5px]">
        <strong>Logikk:</strong> Hver kWh sol dekker først fellesarealet
        (Istad), så fordeles overskuddet til andelseiernes private målere
        (snitt 99 276 kWh/mnd for hele borettslaget). Det som er igjen
        sommerstid kan enten lagres som varmtvann (1,20 kr/kWh erstatningsverdi)
        eller selges til nettet (0,50 kr/kWh spotpris).
        Lagrings-modellen forutsetter at bergvarme + varmtvannstank fra
        Pakke 2 er installert. <em>Tall for 2026 inneholder prognose for
        apr–des.</em>
      </p>
    </div>
  );
}

function KpiKort({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "warm" | "save";
}) {
  const accent =
    tone === "warm" ? "text-warm-deep" : tone === "save" ? "text-save" : "text-ink";
  return (
    <div className="rounded-2xl border border-line/70 bg-paper p-4">
      <div className="label">{label}</div>
      <div className={`num mt-1.5 display text-[20px] font-semibold leading-tight sm:text-[22px] ${accent}`}>
        {value}
      </div>
      <div className="mt-1 text-[11.5px] leading-relaxed text-muted">{sub}</div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`block h-2.5 w-2.5 rounded-sm ${color}`} />
      {label}
    </span>
  );
}
