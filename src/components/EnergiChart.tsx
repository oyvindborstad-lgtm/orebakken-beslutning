import { useState, useMemo, useRef } from "react";
import { Sun, Flame, TrendingUp, Battery, Droplet, ChevronLeft, ChevronRight } from "lucide-react";
import { FORUTSETNINGER } from "../data/forutsetninger";

const { manedlig, felles } = FORUTSETNINGER;

const FORBRUKSPRIS = 1.20; // kr/kWh — verdi når sol erstatter strøm-kjøp
const SALGSPRIS = 0.50;    // kr/kWh — spot ved tilbakesalg

const fmt = (n: number) => Math.round(n).toLocaleString("nb-NO");
const fmtKr = (n: number) => `${fmt(n)} kr`;
const pctFmt = (n: number) =>
  `${(n * 100).toFixed(1).replace(".", ",")} %`;

type EnrichedMonth = {
  mnd: string;
  sol: number;
  bergvarme: number;
  ovrig: number;
  forbruk: number;
  solBrukt: number;
  overskudd: number;
  tilLager: number;
  tilSalg: number;
  dekning: number;
};

export default function EnergiChart() {
  // Default-velg juli (høyest sol-produksjon, viser overskudd)
  const [selectedIdx, setSelectedIdx] = useState<number>(6);
  // Andel av sommer-overskudd som lagres som varmtvann (0–100 %)
  const [lagring, setLagring] = useState<number>(80);

  const { enriched, total, totalForbruk, dekning, overskudd, totalLager, totalSalg, verdiSparing, yMax, yTicks } =
    useMemo(() => {
      const f = lagring / 100;
      const enriched: EnrichedMonth[] = manedlig.map((m) => {
        const forbruk = m.bergvarme + m.ovrig;
        const solBrukt = Math.min(m.sol, forbruk);
        const overskudd = Math.max(0, m.sol - forbruk);
        const tilLager = overskudd * f;
        const tilSalg = overskudd - tilLager;
        return { ...m, forbruk, solBrukt, overskudd, tilLager, tilSalg, dekning: solBrukt / forbruk };
      });
      const total = manedlig.reduce(
        (acc, m) => ({
          sol: acc.sol + m.sol,
          bergvarme: acc.bergvarme + m.bergvarme,
          ovrig: acc.ovrig + m.ovrig,
        }),
        { sol: 0, bergvarme: 0, ovrig: 0 },
      );
      const totalForbruk = total.bergvarme + total.ovrig;
      const overskudd = enriched.reduce((a, m) => a + m.overskudd, 0);
      const totalLager = enriched.reduce((a, m) => a + m.tilLager, 0);
      const totalSalg = enriched.reduce((a, m) => a + m.tilSalg, 0);
      const totalSolBrukt = total.sol - overskudd;
      const dekning = totalSolBrukt / totalForbruk;
      // Verdi: sol på stedet (1,20) + lager (1,20) + salg (0,50)
      const verdiMed = totalSolBrukt * FORBRUKSPRIS + totalLager * FORBRUKSPRIS + totalSalg * SALGSPRIS;
      const verdiUten = totalSolBrukt * FORBRUKSPRIS + overskudd * SALGSPRIS;
      const verdiSparing = verdiMed - verdiUten;
      const yMax = Math.max(...enriched.map((m) => Math.max(m.forbruk, m.sol)));
      const yTicks = [0, 100_000, 200_000, 300_000].filter((t) => t <= yMax * 1.1);
      return { enriched, total, totalForbruk, dekning, overskudd, totalLager, totalSalg, verdiSparing, yMax, yTicks };
    }, [lagring]);

  const Y = (v: number) => (v / (yMax * 1.05)) * 100;
  const sel = enriched[selectedIdx];

  const move = (delta: number) =>
    setSelectedIdx((i) => Math.max(0, Math.min(enriched.length - 1, i + delta)));

  return (
    <article className="card">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-warm-bg text-warm-deep sm:h-11 sm:w-11">
          <Sun size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="label">Energiprofil — månedlig</div>
          <h3 className="display mt-1.5 text-xl font-semibold text-ink sm:text-2xl">
            Solenergi vs. energiforbruk — med varmtvann som lager
          </h3>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted sm:text-[14px]">
            Sommer-overskuddet kan styres til bergvarmens varmtvannstank
            (1,20 kr/kWh erstatning) framfor å selges til nettet (0,50 kr/kWh
            spot). Justér slideren for å se effekten på årsverdien.
          </p>
        </div>
      </div>

      {/* Lagrings-slider */}
      <div className="mt-5 rounded-2xl border border-warm/30 bg-warm-bg/50 p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor="energi-lagring" className="label !text-warm-deep">
            Andel av sommer-overskudd lagret som varmtvann
          </label>
          <span className="num text-lg font-semibold text-warm-deep">
            {lagring} %
          </span>
        </div>
        <input
          id="energi-lagring"
          type="range"
          min={0}
          max={100}
          step={5}
          value={lagring}
          onChange={(e) => setLagring(Number(e.target.value))}
          className="mt-3 w-full accent-warm-deep"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span>0 % = alt selges (0,50 kr/kWh)</span>
          <span>100 % = alt lagres (1,20 kr/kWh)</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Lagret som varmtvann" value={`${fmt(totalLager)} kWh`} tone="warm" />
          <MiniStat label="Solgt til nett" value={`${fmt(totalSalg)} kWh`} tone="brand" />
          <MiniStat label="Årsverdi solar" value={fmtKr(total.sol * FORBRUKSPRIS - totalSalg * (FORBRUKSPRIS - SALGSPRIS))} tone="save" />
          <MiniStat
            label="Gevinst vs kun salg"
            value={verdiSparing > 0 ? `+${fmtKr(verdiSparing)}` : "—"}
            tone="save"
          />
        </div>
      </div>

      {/* Yearly KPIs */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiKort
          icon={<Sun size={16} />}
          tone="warm"
          label="Solproduksjon"
          value={`${fmt(total.sol)} kWh`}
          sub="per år"
        />
        <KpiKort
          icon={<Flame size={16} />}
          tone="rose"
          label="Bergvarme"
          value={`${fmt(total.bergvarme)} kWh`}
          sub="strømforbruk per år"
        />
        <KpiKort
          icon={<Battery size={16} />}
          tone="save"
          label="Dekningsgrad"
          value={pctFmt(dekning)}
          sub="av totalt forbruk"
        />
        <KpiKort
          icon={<Droplet size={16} />}
          tone="warm"
          label="→ Varmtvann (lager)"
          value={`${fmt(totalLager)} kWh`}
          sub={`Verdi: ${fmtKr(totalLager * FORBRUKSPRIS)}`}
        />
        <KpiKort
          icon={<TrendingUp size={16} />}
          tone="brand"
          label="→ Salg til nett"
          value={`${fmt(totalSalg)} kWh`}
          sub={`Verdi: ${fmtKr(totalSalg * SALGSPRIS)}`}
        />
      </div>

      {/* Chart + detail panel */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:gap-5">
        <ChartSurface
          enriched={enriched}
          selectedIdx={selectedIdx}
          onSelect={setSelectedIdx}
          onMove={move}
          Y={Y}
          yTicks={yTicks}
        />
        <DetailPanel
          month={sel}
          idx={selectedIdx}
          total={enriched.length}
          onPrev={() => move(-1)}
          onNext={() => move(1)}
        />
      </div>

      {/* Tabell — som referanse */}
      <details className="group mt-6">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-muted hover:bg-surface/60">
          <span className="grid h-4 w-4 place-items-center text-[10px] transition group-open:rotate-90">
            ▶
          </span>
          Vis full månedstabell
        </summary>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line/70">
          <div className="px-4 pt-3 text-[11px] text-muted sm:hidden">
            ← sveip for å se alle kolonner →
          </div>
          <table className="w-full min-w-[780px] text-[13px]">
            <thead>
              <tr className="bg-brand text-white">
                {["Måned", "Solprod.", "Forbruk", "Sol brukt", "→ Varmtvann", "→ Salg", "Dekning"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-wide ${
                        i === 0 ? "text-left" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="num">
              {enriched.map((m, i) => (
                <tr
                  key={m.mnd}
                  onClick={() => setSelectedIdx(i)}
                  className={`cursor-pointer transition hover:bg-brand-50 ${
                    i === selectedIdx ? "bg-brand-50" : i % 2 ? "bg-surface/40" : "bg-paper"
                  }`}
                >
                  <td className="border-b border-line/40 px-3 py-2 text-left font-medium text-ink">
                    {m.mnd}
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right text-warm-deep">
                    {fmt(m.sol)}
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right text-ink">
                    {fmt(m.forbruk)}
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right text-save">
                    {fmt(m.solBrukt)}
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right text-warm-deep">
                    {m.tilLager > 0 ? fmt(m.tilLager) : "—"}
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right text-brand">
                    {m.tilSalg > 0 ? fmt(m.tilSalg) : "—"}
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right text-warm-deep">
                    {pctFmt(m.dekning)}
                  </td>
                </tr>
              ))}
              <tr className="bg-brand-50 font-semibold">
                <td className="px-3 py-2.5 text-left text-ink">Totalt</td>
                <td className="px-3 py-2.5 text-right text-warm-deep">{fmt(total.sol)}</td>
                <td className="px-3 py-2.5 text-right text-ink">{fmt(totalForbruk)}</td>
                <td className="px-3 py-2.5 text-right text-save">{fmt(total.sol - overskudd)}</td>
                <td className="px-3 py-2.5 text-right text-warm-deep">{fmt(totalLager)}</td>
                <td className="px-3 py-2.5 text-right text-brand">{fmt(totalSalg)}</td>
                <td className="px-3 py-2.5 text-right text-warm-deep">{pctFmt(dekning)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      <div className="mt-5 rounded-2xl border-l-4 border-warm bg-warm-bg/60 p-4 text-[13.5px] leading-relaxed text-ink/85">
        <div className="font-semibold text-ink">Varmtvann som energilager</div>
        <ul className="mt-2 space-y-1.5">
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Solcellene produserer {fmt(total.sol)} kWh/år — mest om sommeren
              når oppvarmingsbehovet er lavest.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Bergvarmens varmtvannstank kan brukes som termisk batteri: vi
              kjører ekstra varme inn i tanken når sola produserer mest, og
              henter den ut når vi trenger varmtvann uten å kjøpe strøm.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Hver kWh som flyttes fra «salg» til «lager» tjener{" "}
              <strong>0,70 kr</strong> (1,20 kr erstatningsverdi − 0,50 kr
              spotpris). Ved 80 % lagring av {fmt(felles.solcelleOverskuddSommerKWh)} kWh sommer-overskudd gir
              det ca. {fmtKr(felles.solcelleOverskuddSommerKWh * 0.8 * (FORBRUKSPRIS - SALGSPRIS))} ekstra per år.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Forutsetning: bergvarme + varmtvannstank fra Pakke 2 installert
              og styringssystem konfigurert for sol-prioritert varmtvann-
              produksjon.
            </span>
          </li>
        </ul>
      </div>
    </article>
  );
}

function ChartSurface({
  enriched,
  selectedIdx,
  onSelect,
  onMove,
  Y,
  yTicks,
}: {
  enriched: EnrichedMonth[];
  selectedIdx: number;
  onSelect: (i: number) => void;
  onMove: (delta: number) => void;
  Y: (v: number) => number;
  yTicks: number[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onMove(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onMove(1);
    } else if (e.key === "Home") {
      e.preventDefault();
      onSelect(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onSelect(enriched.length - 1);
    }
  }

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-line/70 bg-paper p-3 sm:p-5"
      role="figure"
      aria-label="Månedlig solproduksjon og energiforbruk"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10.5px] text-ink/75 sm:gap-x-5 sm:text-[11.5px]">
        <Legend swatch="bg-rose-300" label="Bergvarme" />
        <Legend swatch="bg-line" label="Øvrig drift" />
        <Legend swatch="bg-warm" label="Sol" />
        <Legend swatch="bg-warm-deep" label="→ Varmtvann" />
        <Legend swatch="bg-brand/60" label="→ Salg" />
      </div>

      <div
        className="relative mt-4 h-56 sm:h-64 lg:h-72"
        role="group"
        aria-label="Velg måned med piltastene"
        onKeyDown={handleKey}
      >
        {/* Y-grid */}
        <div className="absolute inset-0 flex flex-col-reverse justify-between pb-7 pt-1 pl-8 pr-1 sm:pl-10 sm:pr-2">
          {yTicks.map((t) => (
            <div key={t} className="relative">
              <div className="absolute -top-2 -left-8 w-7 text-right text-[9.5px] text-muted sm:-left-10 sm:w-9 sm:text-[10px]">
                {t === 0 ? "0" : `${t / 1000}k`}
              </div>
              <div className="border-t border-dashed border-line/60" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-0 flex items-end gap-0.5 pb-7 pl-8 pr-1 sm:gap-1.5 sm:pl-10 sm:pr-2 lg:gap-2">
          {enriched.map((m, i) => {
            const isSelected = i === selectedIdx;
            return (
              <BarColumn
                key={m.mnd}
                m={m}
                isSelected={isSelected}
                onClick={() => onSelect(i)}
                Y={Y}
                tabIndex={isSelected ? 0 : -1}
              />
            );
          })}
        </div>

        {/* X-axis */}
        <div className="absolute bottom-0 left-8 right-1 flex gap-0.5 sm:left-10 sm:right-2 sm:gap-1.5 lg:gap-2">
          {enriched.map((m, i) => (
            <div
              key={m.mnd}
              className={`flex-1 text-center text-[10px] font-medium transition sm:text-[11px] ${
                i === selectedIdx ? "text-brand font-semibold" : "text-muted"
              }`}
            >
              {m.mnd}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 pl-8 sm:pl-10">
        <span className="text-[10px] text-muted">kWh / mnd</span>
        <span className="hidden text-[10.5px] text-muted sm:inline">
          ← → for navigasjon
        </span>
      </div>
    </div>
  );
}

function BarColumn({
  m,
  isSelected,
  onClick,
  Y,
  tabIndex,
}: {
  m: EnrichedMonth;
  isSelected: boolean;
  onClick: () => void;
  Y: (v: number) => number;
  tabIndex: number;
}) {
  const forbrukH = Y(m.forbruk);
  const bergvarmeH = Y(m.bergvarme);
  // Sol-bar splittes: solBrukt (lyseste varm), tilLager (varm-deep), tilSalg (brand/60)
  const solBruktH = Y(m.solBrukt);
  const lagerH = Y(m.tilLager);
  const salgH = Y(m.tilSalg);
  const solH = solBruktH + lagerH + salgH;
  const ariaLabel = `${m.mnd}: forbruk ${fmt(m.forbruk)} kWh, sol ${fmt(m.sol)} kWh${
    m.tilLager > 0 ? `, varmtvann-lager ${fmt(m.tilLager)} kWh` : ""
  }${m.tilSalg > 0 ? `, salg ${fmt(m.tilSalg)} kWh` : ""}`;
  return (
    <button
      type="button"
      onClick={onClick}
      onFocus={onClick}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className={`group relative flex h-full flex-1 cursor-pointer items-end gap-px rounded-t-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:gap-0.5 ${
        isSelected ? "" : "opacity-90 hover:opacity-100"
      }`}
    >
      {/* Selection backdrop */}
      {isSelected && (
        <span className="pointer-events-none absolute inset-x-0 -top-1 bottom-[-2px] -mx-0.5 rounded-md bg-brand/8 ring-1 ring-brand/25" />
      )}
      {/* Stacked: bergvarme + øvrig (forbruks-stack) */}
      <span
        className="relative z-10 flex flex-1 flex-col-reverse overflow-hidden rounded-t-sm"
        style={{ height: `${forbrukH}%` }}
      >
        <span
          className={`transition-colors ${
            isSelected ? "bg-rose-400" : "bg-rose-300 group-hover:bg-rose-400"
          }`}
          style={{ height: `${(bergvarmeH / Math.max(forbrukH, 0.001)) * 100}%` }}
        />
        <span
          className={`flex-1 transition-colors ${
            isSelected ? "bg-line" : "bg-line/80 group-hover:bg-line"
          }`}
        />
      </span>
      {/* Solar-stack: solBrukt + lager + salg */}
      <span
        className="relative z-10 flex flex-1 flex-col-reverse overflow-hidden rounded-t-sm"
        style={{ height: `${solH}%` }}
      >
        {/* Bunn: sol brukt på stedet (lyseste) */}
        <span
          className={`transition-colors ${
            isSelected ? "bg-warm" : "bg-warm/80 group-hover:bg-warm"
          }`}
          style={{ height: `${(solBruktH / Math.max(solH, 0.001)) * 100}%` }}
        />
        {/* Midten: lagret (deep) */}
        {m.tilLager > 0 && (
          <span
            className={`transition-colors ${
              isSelected ? "bg-warm-deep" : "bg-warm-deep/85 group-hover:bg-warm-deep"
            }`}
            style={{ height: `${(lagerH / Math.max(solH, 0.001)) * 100}%` }}
          />
        )}
        {/* Topp: solgt (brand) */}
        {m.tilSalg > 0 && (
          <span
            className="bg-brand/60 transition-colors group-hover:bg-brand/75"
            style={{ height: `${(salgH / Math.max(solH, 0.001)) * 100}%` }}
          />
        )}
      </span>
      {/* Overskudd-marker (lagret + solgt) */}
      {m.overskudd > 0 && (
        <span
          className="pointer-events-none absolute left-0 right-0 z-20 flex flex-col items-center"
          style={{ bottom: `${forbrukH}%` }}
        >
          <span className="num text-[9px] font-semibold text-save sm:text-[10px]">
            +{Math.round(m.overskudd / 1000)}k
          </span>
        </span>
      )}
    </button>
  );
}

function DetailPanel({
  month,
  idx,
  total,
  onPrev,
  onNext,
}: {
  month: EnrichedMonth;
  idx: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const monthName: Record<string, string> = {
    Jan: "Januar", Feb: "Februar", Mar: "Mars", Apr: "April",
    Mai: "Mai", Jun: "Juni", Jul: "Juli", Aug: "August",
    Sep: "September", Okt: "Oktober", Nov: "November", Des: "Desember",
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line/70 bg-paper">
      <div className="flex items-center justify-between gap-3 border-b border-line/50 bg-surface/40 px-4 py-3">
        <div>
          <div className="label">Valgt måned</div>
          <div className="display text-base font-semibold text-ink sm:text-lg">
            {monthName[month.mnd] ?? month.mnd}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onPrev}
            disabled={idx === 0}
            aria-label="Forrige måned"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-paper text-ink hover:bg-brand-50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={idx === total - 1}
            aria-label="Neste måned"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-paper text-ink hover:bg-brand-50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <DetailRow label="Solproduksjon" value={`${fmt(month.sol)} kWh`} tone="warm" dot />
        <DetailRow label="Bergvarme" value={`${fmt(month.bergvarme)} kWh`} tone="rose" dot />
        <DetailRow label="Øvrig fellesdrift" value={`${fmt(month.ovrig)} kWh`} tone="muted" dot />
        <div className="my-3 border-t border-line/50" />
        <DetailRow label="Totalt forbruk" value={`${fmt(month.forbruk)} kWh`} bold />
        <DetailRow label="Sol brukt på stedet" value={`${fmt(month.solBrukt)} kWh`} tone="save" />
        {month.tilLager > 0 ? (
          <DetailRow
            label="→ Varmtvann (lager)"
            value={`+${fmt(month.tilLager)} kWh`}
            tone="warm"
            sub={`Verdi ${fmtKr(month.tilLager * FORBRUKSPRIS)}`}
          />
        ) : (
          <DetailRow label="→ Varmtvann (lager)" value="—" tone="muted" />
        )}
        {month.tilSalg > 0 ? (
          <DetailRow
            label="→ Salg til nett"
            value={`+${fmt(month.tilSalg)} kWh`}
            tone="brand"
            sub={`Verdi ${fmtKr(month.tilSalg * SALGSPRIS)}`}
          />
        ) : (
          <DetailRow label="→ Salg til nett" value="—" tone="muted" />
        )}

        <div className="mt-4 rounded-xl bg-save-bg/70 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-medium text-save">
              Dekningsgrad denne måneden
            </span>
            <span className="num text-[15px] font-semibold text-save">
              {pctFmt(month.dekning)}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-save/15">
            <div
              className="h-full rounded-full bg-save transition-all"
              style={{ width: `${Math.min(100, month.dekning * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  tone,
  bold,
  dot,
  sub,
}: {
  label: string;
  value: string;
  tone?: "warm" | "rose" | "muted" | "save" | "brand";
  bold?: boolean;
  dot?: boolean;
  sub?: string;
}) {
  const cls =
    tone === "warm" ? "text-warm-deep"
    : tone === "rose" ? "text-rose-700"
    : tone === "save" ? "text-save"
    : tone === "brand" ? "text-brand"
    : tone === "muted" ? "text-ink/70"
    : "text-ink";
  const dotCls =
    tone === "warm" ? "bg-warm"
    : tone === "rose" ? "bg-rose-300"
    : tone === "muted" ? "bg-line"
    : "";
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5">
      <span className="flex items-center gap-2 text-[13px] text-ink/80">
        {dot && <span className={`inline-block h-2.5 w-2.5 rounded-sm ${dotCls}`} />}
        {label}
      </span>
      <span className="text-right">
        <span className={`num text-[14px] ${bold ? "font-semibold" : "font-medium"} ${cls}`}>
          {value}
        </span>
        {sub && <div className="text-[10.5px] text-muted">{sub}</div>}
      </span>
    </div>
  );
}

function KpiKort({
  icon,
  tone,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  tone: "warm" | "rose" | "save" | "brand";
  label: string;
  value: string;
  sub: string;
}) {
  const cls = {
    warm: "border-warm/30 bg-warm-bg/60 text-warm-deep",
    rose: "border-rose-300/40 bg-rose-50 text-rose-700",
    save: "border-save/25 bg-save-bg/70 text-save",
    brand: "border-brand/20 bg-brand-50 text-brand",
  }[tone];
  return (
    <div className={`rounded-2xl border p-3.5 sm:p-4 ${cls}`}>
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em]">
        {icon}
        {label}
      </div>
      <div className="num mt-1.5 text-[15px] font-semibold leading-tight sm:text-[17px]">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] opacity-75 sm:text-[11.5px]">{sub}</div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "warm" | "brand" | "save";
}) {
  const cls = tone === "warm" ? "text-warm-deep" : tone === "brand" ? "text-brand" : "text-save";
  return (
    <div className="rounded-xl bg-paper px-3 py-2 shadow-soft">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </div>
      <div className={`num mt-0.5 text-[14px] font-semibold ${cls}`}>{value}</div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-3 rounded-sm ${swatch}`} />
      {label}
    </span>
  );
}
