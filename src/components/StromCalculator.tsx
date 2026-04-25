import { useState, useMemo } from "react";
import { Zap, ExternalLink, RotateCcw } from "lucide-react";
import type { Andel } from "../lib/types";
import { kr, krSigned } from "../lib/format";
import {
  forventetKWhForAreal,
  personligStromBesparelseP1,
  personligP2Besparelse,
  beregnFkP1,
  beregnFkP2,
} from "../lib/calc";
import { FORUTSETNINGER } from "../data/forutsetninger";

export default function StromCalculator({
  andel,
  onChange,
}: {
  andel: Andel;
  onChange?: (kWh: number | null) => void;
}) {
  const baseline = useMemo(() => forventetKWhForAreal(andel.areal), [andel.areal]);
  const [input, setInput] = useState<string>("");

  const kWh = Number(input.replace(/\s/g, "").replace(",", "."));
  const harVerdi = Number.isFinite(kWh) && kWh > 0;

  const setVal = (v: string) => {
    setInput(v);
    const n = Number(v.replace(/\s/g, "").replace(",", "."));
    onChange?.(Number.isFinite(n) && n > 0 ? n : null);
  };

  const reset = () => {
    setInput("");
    onChange?.(null);
  };

  const p2Besp = harVerdi ? personligP2Besparelse(kWh, andel.brok) : null;
  const p1Besp = harVerdi ? personligStromBesparelseP1(kWh) : 0;

  const fkP1Personlig = harVerdi ? beregnFkP1(andel, kWh) : null;
  const fkP2Personlig = harVerdi ? beregnFkP2(andel, kWh) : null;

  const arealP1 = Math.abs(andel.p1.stromBesp);
  const arealP2 = Math.abs(andel.p2.stromBesp);

  return (
    <article className="card">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-warm-bg text-warm-deep">
          <Zap size={20} />
        </div>
        <div className="flex-1">
          <div className="label">Egenkontroll</div>
          <h3 className="display mt-1.5 text-xl font-semibold text-ink">
            Sjekk besparelsen mot ditt eget strømforbruk
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Beregningene fra Excel fordeler strømbesparelsen etter areal. Hvis
            du oppgir ditt faktiske årsforbruk, regner vi ut en personlig
            estimering basert på Byggforsk-normalen om at ~75 % av forbruket
            går til oppvarming og varmtvann — og oppdaterer din nye
            felleskostnad både brutto og netto.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="label">Mitt totale årsforbruk</div>
          <div className="relative mt-2">
            <input
              id="kwh"
              inputMode="numeric"
              type="text"
              value={input}
              onChange={(e) => setVal(e.target.value.replace(/[^\d\s,.]/g, ""))}
              placeholder={baseline.toLocaleString("nb-NO")}
              className="num block w-full rounded-xl border border-line/80 bg-white px-4 py-4 pr-20 text-2xl font-semibold tracking-tight focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
              kWh / år
            </span>
          </div>
          {harVerdi && (
            <button
              type="button"
              onClick={reset}
              className="mt-2 inline-flex items-center gap-1 text-xs text-muted hover:text-brand"
            >
              <RotateCcw size={12} /> Tilbakestill til areal-fordeling
            </button>
          )}
          <div className="mt-3 rounded-xl border border-line/60 bg-surface/50 p-3 text-[12.5px] leading-relaxed text-ink/80">
            <div className="font-medium text-ink">
              Vi har kalkulert forbruket til{" "}
              <span className="num">{baseline.toLocaleString("nb-NO")} kWh/år</span>
            </div>
            <div className="mt-1 text-muted">
              Estimat basert på areal-fordeling av borettslagets totalforbruk på{" "}
              {FORUTSETNINGER.felles.totalForbrukKWh.toLocaleString("nb-NO")} kWh/år
              fordelt på {FORUTSETNINGER.felles.totaltAreal.toLocaleString("nb-NO")} m².
            </div>
            <div className="mt-2 text-muted">
              Du finner ditt faktiske årsforbruk på{" "}
              <a
                href="https://elvia.no"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-brand underline-offset-2 hover:underline"
              >
                elvia.no <ExternalLink size={11} />
              </a>{" "}
              eller hos din strømleverandør.
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <PakkeResultat
            tittel="Pakke 1"
            tone="brand"
            harVerdi={harVerdi}
            arealBesp={arealP1}
            personligBesp={p1Besp}
            fkPersonlig={fkP1Personlig}
            arealFu={andel.p1.nyFu}
            arealNetto={andel.p1.nettoAr1}
          />
          <PakkeResultat
            tittel="Pakke 1+2"
            tone="warm"
            harVerdi={harVerdi}
            arealBesp={arealP2}
            personligBesp={p2Besp?.total ?? 0}
            fkPersonlig={fkP2Personlig}
            arealFu={andel.p2.nyFu}
            arealNetto={andel.p2.nettoAr1}
            split={p2Besp ?? undefined}
          />
        </div>
      </div>

      {harVerdi && (
        <p className="mt-5 text-[12.5px] leading-relaxed text-muted">
          Personlig P2-besparelse splittes i bergvarme-effekt
          (oppvarming/varmtvann × 75 %) og solcelleproduksjon (978 180 kWh/år
          fordelt etter brøk). P1-besparelsen er bedre fasadeisolasjon på 500
          000 kWh/år fordelt på oppvarmingsforbruket.
        </p>
      )}
    </article>
  );
}

function PakkeResultat({
  tittel,
  tone,
  harVerdi,
  arealBesp,
  personligBesp,
  fkPersonlig,
  arealFu,
  arealNetto,
  split,
}: {
  tittel: string;
  tone: "brand" | "warm";
  harVerdi: boolean;
  arealBesp: number;
  personligBesp: number;
  fkPersonlig: { brutto: number; netto: number } | null;
  arealFu: number;
  arealNetto: number;
  split?: { oppvarming: number; solceller: number };
}) {
  const stripe = tone === "brand" ? "pkg-stripe-1" : "pkg-stripe-2";
  const accent = tone === "brand" ? "text-brand" : "text-warm-deep";
  const diff = personligBesp - arealBesp;

  return (
    <div className="overflow-hidden rounded-2xl border border-line/60 bg-paper">
      <div className={`h-1 w-full ${stripe}`} />
      <div className="p-4">
        <div className="label">{tittel}</div>
        {harVerdi && fkPersonlig ? (
          <>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10.5px] uppercase tracking-wide text-muted">
                  Ny FK brutto
                </div>
                <div className="num mt-0.5 text-lg font-semibold text-ink">
                  {kr(fkPersonlig.brutto)}
                </div>
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-wide text-muted">
                  Ny FK netto
                </div>
                <div className={`num mt-0.5 text-lg font-semibold ${accent}`}>
                  {kr(fkPersonlig.netto)}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 border-t border-line/50 pt-3 text-[12px] leading-relaxed">
              <Linje label="Strømbesparelse (din)" value={-personligBesp} kind="save" />
              {split && (
                <>
                  <Linje
                    label="– herav bergvarme/oppvarming"
                    value={-split.oppvarming}
                    sub
                  />
                  <Linje
                    label="– herav solceller (din brøk)"
                    value={-split.solceller}
                    sub
                  />
                </>
              )}
              <div className="mt-1 flex justify-between text-[11px] text-muted">
                <span>Areal-fordelt:</span>
                <span className="num">{kr(arealBesp)} ({krSigned(diff)})</span>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-2 space-y-1.5 text-[13px]">
            <div className="flex justify-between">
              <span className="text-muted">Ny FK brutto</span>
              <span className="num font-semibold text-ink">{kr(arealFu)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Ny FK netto (år 1)</span>
              <span className={`num font-semibold ${accent}`}>
                {kr(arealFu - arealBesp - (arealFu - arealNetto - arealBesp))}
              </span>
            </div>
            <div className="mt-2 text-[11.5px] text-muted">
              Skriv inn faktisk forbruk for personlig estimering.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Linje({
  label,
  value,
  kind,
  sub,
}: {
  label: string;
  value: number;
  kind?: "save";
  sub?: boolean;
}) {
  const cls = kind === "save" ? "text-save" : sub ? "text-muted" : "text-ink";
  return (
    <div className={`flex justify-between ${sub ? "pl-2 text-[11px]" : ""}`}>
      <span className={sub ? "text-muted" : "text-ink/75"}>{label}</span>
      <span className={`num font-semibold ${cls}`}>{krSigned(value)}</span>
    </div>
  );
}
