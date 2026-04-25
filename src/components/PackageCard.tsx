import { Hammer, Sun, ArrowUpRight } from "lucide-react";
import { FORUTSETNINGER } from "../data/forutsetninger";
import { kr, krSigned } from "../lib/format";

type Props = { id: "p1" | "p2" };

export default function PackageCard({ id }: Props) {
  const pakke = id === "p1" ? FORUTSETNINGER.pakke1 : FORUTSETNINGER.pakke2;
  const felles = FORUTSETNINGER.felles;
  const Icon = id === "p1" ? Hammer : Sun;
  const stripe = id === "p1" ? "pkg-stripe-1" : "pkg-stripe-2";
  const accentText = id === "p1" ? "text-brand" : "text-warm-deep";
  const accentBg = id === "p1" ? "bg-brand-50" : "bg-warm-bg";
  const flertall = pakke.flertallskrav === "50 %" ? "Krever 50 % flertall" : "Krever 2/3 flertall";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line/70 bg-paper shadow-card">
      <div className={`h-1.5 w-full ${stripe}`} />
      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="label">{pakke.navn}</span>
              <span className="chip !py-0.5 !px-2 text-[10.5px]">{flertall}</span>
            </div>
            <h3 className="display mt-1.5 text-[26px] font-semibold leading-[1.1] text-ink">
              {pakke.undertittel}
            </h3>
          </div>
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accentBg} ${accentText}`}>
            <Icon size={20} />
          </div>
        </div>

        <dl className="mt-7 grid grid-cols-3 gap-3 rounded-2xl border border-line/70 bg-surface/60 p-4">
          <Stat label="Lånebeløp" value={kr(pakke.laneSum)} compact />
          <Stat label="Løpetid" value={`${pakke.nedbetalingAr} år`} />
          <Stat
            label="Rente"
            value={`${pakke.rentePct.toString().replace(".", ",")} %`}
          />
        </dl>

        <ul className="mt-6 space-y-2 text-[14px] leading-relaxed text-ink/85">
          {pakke.inkluderer.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className={`mt-2.5 block h-1 w-1 shrink-0 rounded-full ${id === "p1" ? "bg-brand" : "bg-warm-deep"}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-save/20 bg-save-bg/60 p-4">
          <div>
            <div className="label !text-save">Energibesparelse</div>
            <div className="num mt-1 text-lg font-semibold text-save">
              {pakke.energibesparelseKWh.toLocaleString("nb-NO")}{" "}
              <span className="text-xs font-medium text-muted">kWh / år</span>
            </div>
          </div>
          <div>
            <div className="label !text-save">Snitt FK netto / mnd</div>
            <div className="num mt-1 text-lg font-semibold text-save">
              {krSigned(pakke.nettoSnittKrMnd)}
            </div>
          </div>
          {id === "p2" && (
            <div className="col-span-2 mt-1 border-t border-save/15 pt-3 text-[12px] leading-relaxed text-ink/75">
              <div className="flex justify-between gap-2">
                <span>Solcelleproduksjon</span>
                <span className="num font-semibold text-ink">
                  {felles.solcelleProduksjonKWh.toLocaleString("nb-NO")} kWh / år
                </span>
              </div>
              <div className="mt-1 flex justify-between gap-2">
                <span>Bergvarmens eget strømforbruk</span>
                <span className="num font-semibold text-ink">
                  −{felles.bergvarmeEgetForbrukKWh.toLocaleString("nb-NO")} kWh / år
                </span>
              </div>
              <div className="mt-1 text-muted">
                Netto-besparelsen over inkluderer både solceller og at
                bergvarmen selv bruker strøm.
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-end justify-end pt-6">
          <ArrowUpRight
            size={18}
            className="text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
          />
        </div>
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  compact,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div>
      <div className="label">{label}</div>
      <div
        className={`num mt-1 font-semibold text-ink ${
          compact ? "text-[13.5px]" : "text-sm"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
