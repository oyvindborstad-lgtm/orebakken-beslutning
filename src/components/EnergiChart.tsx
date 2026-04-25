import { Sun, Flame, TrendingUp, Battery } from "lucide-react";
import { FORUTSETNINGER } from "../data/forutsetninger";

const { manedlig, felles } = FORUTSETNINGER;

const fmt = (n: number) => n.toLocaleString("nb-NO");

export default function EnergiChart() {
  const total = manedlig.reduce(
    (acc, m) => ({
      sol: acc.sol + m.sol,
      bergvarme: acc.bergvarme + m.bergvarme,
      ovrig: acc.ovrig + m.ovrig,
    }),
    { sol: 0, bergvarme: 0, ovrig: 0 },
  );
  const totalForbruk = total.bergvarme + total.ovrig;

  const enriched = manedlig.map((m) => {
    const forbruk = m.bergvarme + m.ovrig;
    const solBrukt = Math.min(m.sol, forbruk);
    const overskudd = Math.max(0, m.sol - forbruk);
    return { ...m, forbruk, solBrukt, overskudd, dekning: solBrukt / forbruk };
  });
  const overskudd = enriched.reduce((a, m) => a + m.overskudd, 0);
  const totalSolBrukt = total.sol - overskudd;
  const dekning = totalSolBrukt / totalForbruk;
  const dekningBergvarme = total.sol / total.bergvarme;

  // Y-aksen skala
  const yMax = Math.max(
    ...enriched.map((m) => Math.max(m.forbruk, m.sol)),
  );
  const yTicks = [0, 100_000, 200_000, 300_000].filter((t) => t <= yMax * 1.1);
  const Y = (v: number) => (v / (yMax * 1.05)) * 100;

  return (
    <article className="card">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-warm-bg text-warm-deep">
          <Sun size={20} />
        </div>
        <div className="flex-1">
          <div className="label">Energiprofil — månedlig</div>
          <h3 className="display mt-1.5 text-2xl font-semibold text-ink">
            Solenergi vs. energiforbruk
          </h3>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted">
            Månedlig solproduksjon (Fusen) sammenlignet med strømforbruk til
            bergvarme (Dråpe AS) og øvrig fellesdrift. Solen produserer mest om
            sommeren, mens bergvarmen bruker mest om vinteren — sesongprofilene
            er komplementære.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
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
          value={`${(dekning * 100).toFixed(1).replace(".", ",")} %`}
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

      {/* Bar chart */}
      <div className="mt-7 overflow-hidden rounded-2xl border border-line/70 bg-paper p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1.5 text-[11.5px] text-ink/75">
          <Legend swatch="bg-rose-300" label="Bergvarme" />
          <Legend swatch="bg-line" label="Øvrig drift" />
          <Legend swatch="bg-warm" label="Solproduksjon" />
          <Legend swatch="border-2 border-dashed border-save/60" label="Overskudd (salg)" subtle />
        </div>

        <div className="relative mt-4 h-72 sm:h-80">
          {/* Y-axis grid */}
          <div className="absolute inset-0 flex flex-col-reverse justify-between pb-7 pt-1 pl-10 pr-2">
            {yTicks.map((t) => (
              <div key={t} className="relative">
                <div className="absolute -top-2 -left-10 w-9 text-right text-[10px] text-muted">
                  {t === 0 ? "0" : `${t / 1000}k`}
                </div>
                <div className="border-t border-dashed border-line/70" />
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end gap-1 pb-7 pl-10 pr-2 sm:gap-2">
            {enriched.map((m) => {
              const forbrukH = Y(m.forbruk);
              const bergvarmeH = Y(m.bergvarme);
              const solH = Y(m.sol);
              return (
                <div
                  key={m.mnd}
                  className="relative flex h-full flex-1 items-end gap-0.5"
                >
                  {/* Stacked: bergvarme + øvrig */}
                  <div
                    className="relative flex flex-1 flex-col-reverse overflow-hidden rounded-t-sm"
                    style={{ height: `${forbrukH}%` }}
                  >
                    <div
                      className="bg-rose-300"
                      style={{ height: `${(bergvarmeH / forbrukH) * 100}%` }}
                      title={`Bergvarme: ${fmt(m.bergvarme)} kWh`}
                    />
                    <div className="flex-1 bg-line/80" title={`Øvrig: ${fmt(m.ovrig)} kWh`} />
                  </div>
                  {/* Solar bar */}
                  <div
                    className="flex-1 rounded-t-sm bg-warm"
                    style={{ height: `${solH}%` }}
                    title={`Sol: ${fmt(m.sol)} kWh`}
                  />
                  {/* Overskudd label */}
                  {m.overskudd > 0 && (
                    <div
                      className="absolute left-0 right-0 flex flex-col items-center"
                      style={{ bottom: `${forbrukH}%` }}
                    >
                      <div className="num text-[10px] font-semibold text-save">
                        +{Math.round(m.overskudd / 1000)}k
                      </div>
                      <div
                        className="border-l border-dashed border-save/60"
                        style={{ height: `${Y(m.overskudd)}%`, marginTop: 1 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-10 right-2 flex gap-1 sm:gap-2">
            {enriched.map((m) => (
              <div
                key={m.mnd}
                className="flex-1 text-center text-[10.5px] font-medium text-muted"
              >
                {m.mnd}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 pl-10 text-[10px] text-muted">kWh / mnd</div>
      </div>

      {/* Tabell */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line/70">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="bg-brand text-white">
              {[
                "Måned",
                "Solprod.",
                "Bergvarme",
                "Øvrig",
                "Totalt forbruk",
                "Sol brukt",
                "Overskudd",
                "Dekning",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-wide ${
                    i === 0 ? "text-left" : "text-right"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="num">
            {enriched.map((m, i) => (
              <tr key={m.mnd} className={i % 2 ? "bg-surface/40" : "bg-paper"}>
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
                  {(m.dekning * 100).toFixed(1).replace(".", ",")} %
                </td>
              </tr>
            ))}
            <tr className="bg-brand-50 font-semibold">
              <td className="px-3 py-2.5 text-left text-ink">Totalt</td>
              <td className="px-3 py-2.5 text-right text-warm-deep">
                {fmt(total.sol)} kWh
              </td>
              <td className="px-3 py-2.5 text-right text-rose-700">
                {fmt(total.bergvarme)} kWh
              </td>
              <td className="px-3 py-2.5 text-right text-ink/85">
                {fmt(total.ovrig)} kWh
              </td>
              <td className="px-3 py-2.5 text-right text-ink">
                {fmt(totalForbruk)} kWh
              </td>
              <td className="px-3 py-2.5 text-right text-save">
                {fmt(total.sol - overskudd)} kWh
              </td>
              <td className="px-3 py-2.5 text-right text-brand">
                {fmt(overskudd)} kWh
              </td>
              <td className="px-3 py-2.5 text-right text-warm-deep">
                {(dekning * 100).toFixed(1).replace(".", ",")} %
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-2xl border-l-4 border-warm bg-warm-bg/60 p-4 text-[13.5px] leading-relaxed text-ink/85">
        <div className="font-semibold text-ink">Om solenergi vs. bergvarme</div>
        <ul className="mt-2 space-y-1.5">
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Solcellene produserer {fmt(total.sol)} kWh per år — mest om
              sommeren (Jul: {fmt(191800)} kWh).
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Bergvarmen bruker {fmt(total.bergvarme)} kWh strøm per år — mest
              om vinteren (Jan: {fmt(182323)} kWh).
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Solenergi dekker {(dekning * 100).toFixed(1).replace(".", ",")} %
              av totalt strømforbruk og{" "}
              {(dekningBergvarme * 100).toFixed(1).replace(".", ",")} % av
              bergvarmeforbruket.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-warm-deep" />
            <span>
              Juni–august gir solcellene overskudd ({fmt(felles.solcelleOverskuddSommerKWh)}{" "}
              kWh/år) som kan selges tilbake til nettet.
            </span>
          </li>
        </ul>
      </div>
    </article>
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
    <div className={`rounded-2xl border p-4 ${cls}`}>
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em]">
        {icon}
        {label}
      </div>
      <div className="num mt-1.5 text-[18px] font-semibold leading-tight">
        {value}
      </div>
      <div className="mt-0.5 text-[11.5px] opacity-75">{sub}</div>
    </div>
  );
}

function Legend({
  swatch,
  label,
  subtle,
}: {
  swatch: string;
  label: string;
  subtle?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block h-2.5 w-3 rounded-sm ${swatch} ${subtle ? "" : ""}`}
      />
      {label}
    </span>
  );
}
