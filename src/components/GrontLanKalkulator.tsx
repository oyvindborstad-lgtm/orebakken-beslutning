import { useState, useMemo } from "react";
import { Leaf, Info, RotateCcw } from "lucide-react";
import { kr, krSigned } from "../lib/format";

const DEFAULT_GRONN_RABATT_PP = 0.3; // standard grønn-rabatt: 0,3 prosentpoeng
const SKATTESATS = 0.22;

function formatNumberInput(s: string): string {
  // Tillat siffer, mellomrom, komma og punktum.
  return s.replace(/[^\d\s,.]/g, "");
}

function parseNumber(s: string): number {
  const cleaned = s.replace(/\s/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export default function GrontLanKalkulator() {
  const [lanInput, setLanInput] = useState<string>("");
  const [renteInput, setRenteInput] = useState<string>("");
  const [grontInput, setGrontInput] = useState<string>("");
  const [grontAndelInput, setGrontAndelInput] = useState<string>("75");

  const lan = parseNumber(lanInput);
  const dagensRentePct = parseNumber(renteInput);
  const grontAndel = Math.max(0, Math.min(1, parseNumber(grontAndelInput) / 100));

  // Default grønn rente: dagens rente − 0,3 pp (kan overstyres av bruker)
  const defaultGrontRentePct = dagensRentePct > 0 ? dagensRentePct - DEFAULT_GRONN_RABATT_PP : 0;
  const grontRentePct = grontInput ? parseNumber(grontInput) : defaultGrontRentePct;

  const harData = lan > 0 && dagensRentePct > 0;

  const beregning = useMemo(() => {
    if (!harData) return null;
    const grontDel = lan * grontAndel;
    const ikkeGrontDel = lan - grontDel;
    const renteDiff = (dagensRentePct - grontRentePct) / 100;
    const bruttoArligBesp = grontDel * renteDiff;
    const bruttoMndBesp = bruttoArligBesp / 12;
    const nettoMndBesp = bruttoMndBesp * (1 - SKATTESATS);
    return {
      grontDel,
      ikkeGrontDel,
      bruttoMndBesp,
      bruttoArligBesp,
      nettoMndBesp,
      nettoArligBesp: nettoMndBesp * 12,
    };
  }, [harData, lan, grontAndel, dagensRentePct, grontRentePct]);

  const reset = () => {
    setLanInput("");
    setRenteInput("");
    setGrontInput("");
    setGrontAndelInput("75");
  };

  return (
    <article className="card">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-save-bg text-save sm:h-11 sm:w-11">
          <Leaf size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="label !text-save">Grønt lån — privat boliglån</div>
          <h3 className="display mt-1.5 text-lg font-semibold text-ink sm:text-xl">
            Effekt på ditt eget boliglån etter Pakke 1+2
          </h3>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted sm:text-sm">
            Pakke 1+2 hever borettslagets energiklasse fra <strong>F til B</strong>. De
            fleste banker tilbyr grønne lån med lavere rente på leiligheter i
            energiklasse A eller B. Som en tommelfingerregel kvalifiserer ca.{" "}
            <strong>75 %</strong> av andelens lånebeløp (det som er innenfor
            grønn belåningsgrad). Bruk kalkulatoren for å se hvordan dette
            kan påvirke ditt eget lån.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-warm/20 bg-warm/10 px-4 py-3 text-[12.5px] leading-relaxed text-ink/75 sm:text-[13px]">
        <Info size={14} className="mt-0.5 shrink-0 text-warm-deep" />
        <div>
          <strong>Viktig:</strong> Dette er kun en illustrasjon. Faktiske
          rentebetingelser, grønn-andel og krav til energimerking varierer
          mellom banker. Du må selv kontakte din bank for å undersøke
          faktisk tilbud før Pakke 1+2 vedtas eller etter at energimerket er
          oppdatert.
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label htmlFor="lan" className="label">
              Ditt totale boliglån i dag
            </label>
            <div className="relative mt-2">
              <input
                id="lan"
                inputMode="numeric"
                type="text"
                value={lanInput}
                onChange={(e) => setLanInput(formatNumberInput(e.target.value))}
                placeholder="3 000 000"
                className="num block w-full rounded-xl border border-line/80 bg-white px-4 py-3 pr-14 text-lg font-semibold tracking-tight focus:border-save focus:ring-2 focus:ring-save/20 sm:text-xl"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-muted sm:text-[13px]">
                kr
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="rente" className="label">
                Dagens rente
              </label>
              <div className="relative mt-2">
                <input
                  id="rente"
                  inputMode="decimal"
                  type="text"
                  value={renteInput}
                  onChange={(e) => setRenteInput(formatNumberInput(e.target.value))}
                  placeholder="5,5"
                  className="num block w-full rounded-xl border border-line/80 bg-white px-3.5 py-3 pr-9 text-base font-semibold tracking-tight focus:border-save focus:ring-2 focus:ring-save/20"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-muted">
                  %
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="gront" className="label">
                Grønn rente
              </label>
              <div className="relative mt-2">
                <input
                  id="gront"
                  inputMode="decimal"
                  type="text"
                  value={grontInput}
                  onChange={(e) => setGrontInput(formatNumberInput(e.target.value))}
                  placeholder={
                    defaultGrontRentePct > 0
                      ? defaultGrontRentePct.toFixed(1).replace(".", ",")
                      : "5,2"
                  }
                  className="num block w-full rounded-xl border border-line/80 bg-white px-3.5 py-3 pr-9 text-base font-semibold tracking-tight focus:border-save focus:ring-2 focus:ring-save/20"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-muted">
                  %
                </span>
              </div>
              <div className="mt-1 text-[11px] text-muted">
                Standardrabatt: 0,3 pp lavere
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="andel" className="label">
              Andel av lån som kvalifiserer for grønn rente
            </label>
            <div className="relative mt-2">
              <input
                id="andel"
                inputMode="decimal"
                type="text"
                value={grontAndelInput}
                onChange={(e) => setGrontAndelInput(formatNumberInput(e.target.value))}
                className="num block w-full rounded-xl border border-line/80 bg-white px-3.5 py-3 pr-9 text-base font-semibold tracking-tight focus:border-save focus:ring-2 focus:ring-save/20"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-muted">
                %
              </span>
            </div>
            <div className="mt-1 text-[11px] text-muted">
              Default 75 % — typisk grønn belåningsgrad. Sjekk hva din bank tilbyr.
            </div>
          </div>

          {(lanInput || renteInput || grontInput || grontAndelInput !== "75") && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-save"
            >
              <RotateCcw size={12} /> Tilbakestill
            </button>
          )}
        </div>

        {/* Resultater */}
        <div className="rounded-2xl border border-save/20 bg-save-bg/40 p-4 sm:p-5">
          <div className="label !text-save">Estimert besparelse på ditt boliglån</div>

          {!harData ? (
            <div className="mt-3 rounded-xl border border-dashed border-line/70 bg-paper/60 p-5 text-center text-[13.5px] text-muted">
              Skriv inn lånebeløp og dagens rente for å se beregningen.
            </div>
          ) : (
            beregning && (
              <>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-paper p-3.5">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">
                      Grønn andel av lånet
                    </div>
                    <div className="num mt-1 text-base font-semibold text-save sm:text-lg">
                      {kr(beregning.grontDel)}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted">
                      til {grontRentePct.toFixed(2).replace(".", ",")} %
                    </div>
                  </div>
                  <div className="rounded-xl bg-paper p-3.5">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">
                      Resten av lånet
                    </div>
                    <div className="num mt-1 text-base font-semibold text-ink sm:text-lg">
                      {kr(beregning.ikkeGrontDel)}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted">
                      på {dagensRentePct.toFixed(2).replace(".", ",")} %
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3 rounded-xl bg-paper p-4 sm:p-5">
                  <div className="flex items-baseline justify-between gap-3 border-b border-line/50 pb-3">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-wide text-muted">
                        Brutto rentebesparelse
                      </div>
                      <div className="text-[11px] text-muted">
                        før skatt
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="num text-[20px] font-semibold leading-tight text-save sm:text-[22px]">
                        {krSigned(-beregning.bruttoMndBesp)}
                      </div>
                      <div className="text-[11px] text-muted">
                        / mnd · {kr(beregning.bruttoArligBesp)}/år
                      </div>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-wide text-muted">
                        Netto besparelse etter skatt
                      </div>
                      <div className="text-[11px] text-muted">
                        22 % av lavere renter trekkes også fra fradraget
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="num display text-[24px] font-semibold leading-tight text-save sm:text-[26px]">
                        {krSigned(-beregning.nettoMndBesp)}
                      </div>
                      <div className="text-[11px] text-muted">
                        / mnd · {kr(beregning.nettoArligBesp)}/år
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-[12px] leading-relaxed text-muted sm:text-[12.5px]">
                  Beregningen viser kun den årlige <em>renteforskjellen</em>{" "}
                  mellom dagens rente og grønn rente på den kvalifiserte delen
                  av lånet. Selve lånebeløpet og avdragsplanen forandres ikke
                  — det er rentekostnaden som blir lavere så lenge du har
                  grønt lån.
                </p>
              </>
            )
          )}
        </div>
      </div>

      <div className="mt-5 rounded-xl border-l-4 border-save bg-save-bg/40 px-4 py-3 text-[12.5px] leading-relaxed text-ink/80 sm:text-[13px]">
        <strong>Hvorfor 75 %?</strong> Bankenes grønne lån fordrer normalt
        belåningsgrad innenfor 75 % av boligens verdi (samme som ordinær
        boliglån-kategori). Den siste 25 % av lånet (mellomfinansiering eller
        rammelån) får sjelden grønn rente. Hvis du har lavere belåning enn
        75 % i utgangspunktet, kvalifiserer hele lånet — sett da andelen til
        100 %.
      </div>
    </article>
  );
}
