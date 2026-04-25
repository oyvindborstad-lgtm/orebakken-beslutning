import { useState, useMemo, useRef } from "react";
import { Sun, Flame, TrendingUp, Battery, ChevronLeft, ChevronRight } from "lucide-react";
import { FORUTSETNINGER } from "../data/forutsetninger";

const { manedlig, felles } = FORUTSETNINGER;

const fmt = (n: number) => n.toLocaleString("nb-NO");
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
  dekning: number;
};

export default function EnergiChart() {
  // Default-velg juli (høyest sol-produksjon, viser overskudd)
  const [selectedIdx, setSelectedIdx] = useState<number>(6);

  const { enriched, total, totalForbruk, dekning, dekningBergvarme, overskudd, yMax, yTicks } =
    useMemo(() => {
      const enriched: EnrichedMonth[] = manedlig.map((m) => {
        const forbruk = m.bergvarme + m.ovrig;
        const solBrukt = Math.min(m.sol, forbruk);
        const overskudd = Math.max(0, m.sol - forbruk);
        return { ...m, forbruk, solBrukt, overskudd, dekning: solBrukt / forbruk };
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
      const totalSolBrukt = total.sol - overskudd;
      const dekning = totalSolBrukt / totalForbruk;
      const dekningBergvarme = total.sol / total.bergvarme;
      const yMax = Math.max(...enriched.map((m) => Math.max(m.forbruk, m.sol)));
      const yTicks = [0, 100_000, 200_000, 300_000].filter((t) => t <= yMax * 1.1);
      return { enriched, total, totalForbruk, dekning, dekningBergvarme, overskudd, yMax, yTicks };
    }, []);

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
            Solenergi vs. energiforbruk
          </h3>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted sm:text-[14px]">
            Månedlig solproduksjon (Fusen) sammenlignet med strømforbruk til
            bergvarme (Dråpe AS) og øvrig fellesdrift. Klikk på en måned eller
            bruk piltastene for å se detaljer.
          </p>
        </div>
      </div>

      {/* Yearly KPIs */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
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
          icon={<TrendingUp size={16} />}
          tone="brand"
          label="Overskudd for salg"
          value={`${fmt(overskudd)} kWh`}
          sub="per år (jun–aug)"
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
          <table className="w-full min-w-[640px] text-[12.5px]">
            <thead>
              <tr className="bg-brand text-white">
                {["Måned", "Solprod.", "Bergvarme", "Øvrig", "Totalt forbruk", "Sol brukt", "Overskudd", "Dekning"].map(
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
                    {fmt(m.sol)} kWh
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right text-rose-700">
                    {fmt(m.bergvarme)} kWh
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right text-ink/75">
                    {fmt(m.ovrig)} kWh
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right font-semibold text-ink">
                    {fmt(m.forbruk)} kWh
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right text-save">
                    {fmt(m.solBrukt)} kWh
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right text-brand">
                    {m.overskudd > 0 ? `+${fmt(m.overskudd)} kWh` : "—"}
                  </td>
                  <td className="border-b border-line/40 px-3 py-2 text-right text-warm-deep">
                    {pctFmt(m.dekning)}
                  </td>
                </tr>
              ))}
              <tr className="bg-brand-50 font-semibold">
                <td className="px-3 py-2.5 text-left text-ink">Totalt</td>
                <td className="px-3 py-2.5 text-right text-warm-deep">{fmt(total.sol)} kWh</td>
                <td className="px-3 py-2.5 text-right text-rose-700">{fmt(total.bergvarme)} kWh</td>
                <td className="px-3 py-2.5 text-right text-ink/85">{fmt(total.ovrig)} kWh</td>
                <td className="px-3 py-2.5 text-right text-ink">{fmt(totalForbruk)} kWh</td>
                <td className="px-3 py-2.5 text-right text-save">
                  {fmt(total.sol - overskudd)} kWh
                </td>
                <td className="px-3 py-2.5 text-right text-brand">{fmt(overskudd)} kWh</td>
                <td className="px-3 py-2.5 text-right text-warm-deep">{pctFmt(dekning)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      <div className="mt-5 rounded-2xl border-l-4 border-warm bg-warm-bg/60 p-4 text-[13.5px] leading-relaxed text-ink/85">
        <div className="font-semibold text-ink">Om solenergi vs. bergvarme</div>
        <ul className="mt-2 space-y-1.5">
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Solcellene produserer {fmt(total.sol)} kWh per år — mest om sommeren (Jul:{" "}
              {fmt(191800)} kWh).
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Bergvarmen bruker {fmt(total.bergvarme)} kWh strøm per år — mest om vinteren (Jan:{" "}
              {fmt(182323)} kWh).
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Solenergi dekker {pctFmt(dekning)} av totalt strømforbruk og{" "}
              {pctFmt(dekningBergvarme)} av bergvarmeforbruket.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Juni–august gir solcellene overskudd ({fmt(felles.solcelleOverskuddSommerKWh)} kWh/år)
              som kan selges tilbake til nettet.
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
  const solH = Y(m.sol);
  const ariaLabel = `${m.mnd}: forbruk ${fmt(m.forbruk)} kWh, sol ${fmt(m.sol)} kWh${
    m.overskudd > 0 ? `, overskudd ${fmt(m.overskudd)} kWh` : ""
  }`;
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
      {/* Stacked: bergvarme + øvrig */}
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
      {/* Solar bar */}
      <span
        className={`relative z-10 flex-1 rounded-t-sm transition-colors ${
          isSelected ? "bg-warm-deep" : "bg-warm group-hover:bg-warm-deep"
        }`}
        style={{ height: `${solH}%` }}
      />
      {/* Overskudd marker */}
      {m.overskudd > 0 && (
        <span
          className="pointer-events-none absolute left-0 right-0 z-20 flex flex-col items-center"
          style={{ bottom: `${forbrukH}%` }}
        >
          <span className="num text-[9px] font-semibold text-save sm:text-[10px]">
            +{Math.round(m.overskudd / 1000)}k
          </span>
          <span
            className="border-l-2 border-dashed border-save"
            style={{ height: `${Y(m.overskudd)}%`, marginTop: 1 }}
          />
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
    Jan: "Januar",
    Feb: "Februar",
    Mar: "Mars",
    Apr: "April",
    Mai: "Mai",
    Jun: "Juni",
    Jul: "Juli",
    Aug: "August",
    Sep: "September",
    Okt: "Oktober",
    Nov: "November",
    Des: "Desember",
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
        <DetailRow
          label="Solproduksjon"
          value={`${fmt(month.sol)} kWh`}
          tone="warm"
          dot
        />
        <DetailRow
          label="Bergvarme"
          value={`${fmt(month.bergvarme)} kWh`}
          tone="rose"
          dot
        />
        <DetailRow
          label="Øvrig fellesdrift"
          value={`${fmt(month.ovrig)} kWh`}
          tone="muted"
          dot
        />
        <div className="my-3 border-t border-line/50" />
        <DetailRow
          label="Totalt forbruk"
          value={`${fmt(month.forbruk)} kWh`}
          bold
        />
        <DetailRow
          label="Sol brukt på stedet"
          value={`${fmt(month.solBrukt)} kWh`}
          tone="save"
        />
        {month.overskudd > 0 ? (
          <DetailRow
            label="Overskudd til salg"
            value={`+${fmt(month.overskudd)} kWh`}
            tone="brand"
          />
        ) : (
          <DetailRow label="Overskudd til salg" value="—" tone="muted" />
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
}: {
  label: string;
  value: string;
  tone?: "warm" | "rose" | "muted" | "save" | "brand";
  bold?: boolean;
  dot?: boolean;
}) {
  const cls =
    tone === "warm"
      ? "text-warm-deep"
      : tone === "rose"
      ? "text-rose-700"
      : tone === "save"
      ? "text-save"
      : tone === "brand"
      ? "text-brand"
      : tone === "muted"
      ? "text-ink/70"
      : "text-ink";
  const dotCls =
    tone === "warm"
      ? "bg-warm"
      : tone === "rose"
      ? "bg-rose-300"
      : tone === "muted"
      ? "bg-line"
      : "";
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <span className="flex items-center gap-2 text-[13px] text-ink/80">
        {dot && <span className={`inline-block h-2.5 w-2.5 rounded-sm ${dotCls}`} />}
        {label}
      </span>
      <span className={`num text-[14px] ${bold ? "font-semibold" : "font-medium"} ${cls}`}>
        {value}
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
      <div className="num mt-1.5 text-[16px] font-semibold leading-tight sm:text-[18px]">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] opacity-75 sm:text-[11.5px]">{sub}</div>
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
