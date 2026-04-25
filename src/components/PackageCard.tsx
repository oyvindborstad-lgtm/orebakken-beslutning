import { Hammer, Sun } from "lucide-react";
import { FORUTSETNINGER } from "../data/forutsetninger";
import { kr } from "../lib/format";

type Props = { id: "p1" | "p2" };

export default function PackageCard({ id }: Props) {
  const pakke = id === "p1" ? FORUTSETNINGER.pakke1 : FORUTSETNINGER.pakke2;
  const Icon = id === "p1" ? Hammer : Sun;
  const accent =
    id === "p1"
      ? "bg-brand-50 text-brand"
      : "bg-warm/10 text-warm";

  return (
    <div className="card flex h-full flex-col">
      <div className="flex items-start gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${accent}`}>
          <Icon size={20} />
        </div>
        <div>
          <div className="label">{pakke.navn}</div>
          <h3 className="mt-1 text-xl font-semibold text-ink">
            {pakke.undertittel}
          </h3>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-black/5 py-4">
        <div>
          <dt className="label">Lånebeløp</dt>
          <dd className="num mt-1 text-sm font-semibold">
            {kr(pakke.laneSum)}
          </dd>
        </div>
        <div>
          <dt className="label">Løpetid</dt>
          <dd className="num mt-1 text-sm font-semibold">
            {pakke.nedbetalingAr} år
          </dd>
        </div>
        <div>
          <dt className="label">Rente</dt>
          <dd className="num mt-1 text-sm font-semibold">
            {pakke.rentePct.toString().replace(".", ",")} %
          </dd>
        </div>
      </dl>

      <ul className="mt-4 space-y-1.5 text-sm text-ink/80">
        {pakke.inkluderer.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-muted" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <div className="label">Estimert energibesparelse</div>
        <div className="num mt-1 text-base font-semibold text-save">
          {pakke.energibesparelseKWh.toLocaleString("nb-NO")} kWh / år
        </div>
      </div>
    </div>
  );
}
