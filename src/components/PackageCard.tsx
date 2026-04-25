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
  const flertall =
    pakke.flertallskrav === "50 %"
      ? "Krever 50 % flertall"
      : "Krever 2/3 flertall";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line/70 bg-paper shadow-card">
      <div className={`h-1.5 w-full ${stripe}`} />
      <div className="flex flex-1 flex-col p-5 sm:p-7 lg:p-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label">{pakke.navn}</span>
              <span className="chip !py-0.5 !px-2 text-[10.5px]">{flertall}</span>
            </div>
            <h3 className="display mt-1.5 text-[22px] font-semibold leading-[1.1] text-ink sm:text-[26px]">
              {pakke.undertittel}
            </h3>
          </div>
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-11 sm:w-11 ${accentBg} ${accentText}`}>
            <Icon size={20} />
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-line/70 bg-surface/60 p-3 sm:gap-3 sm:p-4">
          <Stat
            label="Lånebeløp"
            valueMobile={`${(pakke.laneSum / 1_000_000).toFixed(1).replace(".0", "").replace(".", ",")} mill`}
            valueDesktop={kr(pakke.laneSum)}
          />
          <Stat label="Løpetid" valueMobile={`${pakke.nedbetalingAr} år`} />
          <Stat
            label="Rente"
            valueMobile={`${pakke.rentePct.toString().replace(".", ",")} %`}
          />
        </dl>

        <ul className="mt-5 space-y-2 text-[13.5px] leading-relaxed text-ink/85 sm:text-[14px]">
          {pakke.inkluderer.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className={`mt-2 block h-1 w-1 shrink-0 rounded-full sm:mt-2.5 ${id === "p1" ? "bg-brand" : "bg-warm-deep"}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-save/20 bg-save-bg/60 p-3.5 sm:p-4">
          <div className="min-w-0">
            <div className="label !text-save">Energibesparelse</div>
            <div className="num mt-1 text-[16px] font-semibold leading-tight text-save sm:text-lg">
              {pakke.energibesparelseKWh.toLocaleString("nb-NO")}{" "}
              <span className="text-[11px] font-medium text-muted sm:text-xs">kWh / år</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="label !text-save">Snitt FK netto / mnd</div>
            <div className="num mt-1 text-[16px] font-semibold leading-tight text-save sm:text-lg">
              {krSigned(pakke.nettoSnittKrMnd)}
            </div>
          </div>
          {id === "p2" && (
            <div className="col-span-2 mt-1 border-t border-save/15 pt-3 text-[11.5px] leading-relaxed text-ink/75 sm:text-[12px]">
              <div className="flex flex-wrap justify-between gap-2">
                <span>Solcelleproduksjon</span>
                <span className="num font-semibold text-ink">
                  {felles.solcelleProduksjonKWh.toLocaleString("nb-NO")} kWh/år
                </span>
              </div>
              <div className="mt-1 flex flex-wrap justify-between gap-2">
                <span>Bergvarmens eget strømforbruk</span>
                <span className="num font-semibold text-ink">
                  −{felles.bergvarmeEgetForbrukKWh.toLocaleString("nb-NO")} kWh/år
                </span>
              </div>
              <div className="mt-1 text-muted">
                Netto-besparelsen over inkluderer både solceller og at
                bergvarmen selv bruker strøm.
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-end justify-end pt-5">
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
  valueMobile,
  valueDesktop,
}: {
  label: string;
  valueMobile: string;
  valueDesktop?: string;
}) {
  return (
    <div className="min-w-0">
      <div className="label">{label}</div>
      <div className="num mt-1 text-[13px] font-semibold text-ink sm:text-sm">
        {valueDesktop ? (
          <>
            <span className="sm:hidden">{valueMobile}</span>
            <span className="hidden sm:inline">{valueDesktop}</span>
          </>
        ) : (
          valueMobile
        )}
      </div>
    </div>
  );
}
