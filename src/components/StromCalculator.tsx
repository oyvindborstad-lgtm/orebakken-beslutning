import { useState } from "react";
import { Zap, ExternalLink } from "lucide-react";
import type { Andel } from "../lib/types";
import { kr, krSigned } from "../lib/format";
import { forventetKWhForAreal, personligStromBesparelseP2 } from "../lib/calc";
import { FORUTSETNINGER } from "../data/forutsetninger";

export default function StromCalculator({ andel }: { andel: Andel }) {
  const placeholder = forventetKWhForAreal(andel.areal);
  const [input, setInput] = useState<string>("");
  const kWh = Number(input.replace(/\s/g, "").replace(",", "."));
  const harVerdi = Number.isFinite(kWh) && kWh > 0;

  const personligP2 = harVerdi ? personligStromBesparelseP2(kWh) : 0;
  const arealP2 = Math.abs(andel.p2.stromBesp);
  const diff = personligP2 - arealP2;

  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-warm/10 text-warm">
          <Zap size={20} />
        </div>
        <div className="flex-1">
          <div className="label">Egenkontroll</div>
          <h3 className="mt-1 text-xl font-semibold text-ink">
            Sjekk besparelsen mot ditt eget strømforbruk
          </h3>
          <p className="mt-2 text-sm text-muted">
            Tabellen over fordeler strømbesparelsen etter areal. Hvis du oppgir
            ditt faktiske årsforbruk, regner vi ut en personlig estimering for
            Pakke 1+2 basert på Byggforsk-normalen om at ~75 % av forbruket går
            til oppvarming og varmtvann.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1fr]">
        <div>
          <label htmlFor="kwh" className="label">
            Mitt totale årsforbruk (kWh)
          </label>
          <input
            id="kwh"
            inputMode="numeric"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^\d\s,.]/g, ""))}
            placeholder={`f.eks. ${placeholder.toLocaleString("nb-NO")}`}
            className="num mt-2 block w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-lg font-semibold focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <p className="mt-2 text-xs text-muted">
            Du finner forbruket på{" "}
            <a
              href="https://elvia.no"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-0.5 text-brand underline-offset-2 hover:underline"
            >
              elvia.no <ExternalLink size={11} />
            </a>{" "}
            eller hos din strømleverandør. Stipulert for ~{andel.areal} m²
            leilighet: ca.{" "}
            <span className="num font-medium text-ink">
              {placeholder.toLocaleString("nb-NO")} kWh/år
            </span>
            .
          </p>
        </div>

        <div className="rounded-xl bg-surface p-4">
          <div className="label">Estimert P2-besparelse for deg</div>
          {harVerdi ? (
            <>
              <div className="num mt-1 text-3xl font-bold text-save">
                −{kr(personligP2)} <span className="text-base font-normal text-muted">/ mnd</span>
              </div>
              <div className="mt-2 space-y-1 text-xs leading-relaxed text-muted">
                <div>
                  Ditt oppvarmingsforbruk antas å være{" "}
                  <span className="num font-medium text-ink">
                    {Math.round(
                      kWh * FORUTSETNINGER.felles.byggforskOppvarmingsAndel,
                    ).toLocaleString("nb-NO")}{" "}
                    kWh/år
                  </span>{" "}
                  (75 % av {kWh.toLocaleString("nb-NO")} kWh).
                </div>
                <div>
                  Pakke 1+2 fjerner ~87 % av denne energien (bergvarme + solceller).
                </div>
              </div>
              <div className="mt-3 border-t border-black/5 pt-3 text-xs text-muted">
                Til sammenligning: areal-fordelt P2-besparelse for din leilighet
                er{" "}
                <span className="num font-medium text-ink">
                  {kr(arealP2)} / mnd
                </span>{" "}
                (
                <span className={diff >= 0 ? "text-save" : "text-warm"}>
                  {krSigned(diff)} avvik
                </span>
                )
              </div>
            </>
          ) : (
            <div className="mt-1 text-sm text-muted">
              Skriv inn årsforbruket ditt for å se en personlig estimering.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
