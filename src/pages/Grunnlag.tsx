import { Link } from "wouter";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { FORUTSETNINGER } from "../data/forutsetninger";
import { kr } from "../lib/format";
import EnergiChart from "../components/EnergiChart";

const { pakke1, pakke2, felles } = FORUTSETNINGER;

export default function Grunnlag() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section>
        <div className="label">Fullstendig grunnlag</div>
        <h1 className="display mt-3 max-w-3xl text-[30px] font-semibold leading-[1.05] tracking-tightest text-ink sm:text-[40px] lg:text-[52px]">
          Investeringsoversikt og forutsetninger
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/75 sm:mt-5 sm:text-[16.5px]">
          Styrets komplette grunnlag for vedtaket 1. juni 2026. Alle tall er
          oppdatert pr. april 2026.
        </p>
        <div className="mt-6 rounded-2xl border-l-4 border-brand bg-brand-50 px-5 py-4 text-[14.5px] leading-relaxed text-ink/85">
          <strong>Flertallskrav:</strong> Vedtakspunkt 1 (Pakke 1) krever
          simpelt flertall (over 50 %). Vedtakspunkt 2 (Pakke 2 — bergvarme og
          solceller) krever kvalifisert 2/3 flertall, jf. borettslagsloven §
          8-9 og § 8-10. Vedtakspunkt 2 forutsetter at Vedtakspunkt 1 er
          vedtatt.
        </div>
      </section>

      {/* 1. Investering */}
      <section className="card">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
            <FileText size={20} />
          </div>
          <div>
            <div className="label">Avsnitt 1</div>
            <h2 className="display mt-1.5 text-xl font-semibold text-ink sm:text-2xl">
              Investeringsoversikt
            </h2>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Kostnadspost" v1="Pakke 1 (kr)" v2="Pakke 2 totalt (kr)" />
          <Row label="Rehabiliteringskostnad" v1="192 000 000" v2="379 753 000" />
          <Row label="Finanskostnader byggeperiode" v1="12 247 200" v2="23 738 400" />
          <Row label="Totalprosjektkostnad" v1="204 247 200" v2="403 491 400" total />
          <Row
            label="(−) ENØK-støtte (P1: 2 mill etter prosjektslutt / P2: 31,3 mill bekreftet)"
            v1="−2 000 000"
            v2="−31 300 000"
            tone="muted"
          />
          <Row
            label="Samlet nytt lånebeløp"
            v1={kr(pakke1.laneSum).replace(" kr", "")}
            v2={kr(pakke2.laneSum).replace(" kr", "")}
            total
          />
          <Row
            label="Nedbetalingstid / hovedrente"
            v1="30 år / 5,04 %"
            v2="40 år / 5,04 %"
          />
          <Row
            label="Avdragsfri periode"
            v1="24 mnd"
            v2="24 mnd"
          />
          <Row
            label="Årlig termin ved 5,04 % (grønt lån)"
            v1={`${kr(pakke1.rentebaner.r1.arligTermin).replace(" kr", "")} kr`}
            v2={`${kr(pakke2.rentebaner.r1.arligTermin).replace(" kr", "")} kr`}
          />
          <Row
            label="Årlig termin ved 5,54 %"
            v1={`${kr(pakke1.rentebaner.r2.arligTermin).replace(" kr", "")} kr`}
            v2={`${kr(pakke2.rentebaner.r2.arligTermin).replace(" kr", "")} kr`}
          />
          <Row
            label="Årlig termin ved 6,04 %"
            v1={`${kr(pakke1.rentebaner.r3.arligTermin).replace(" kr", "")} kr`}
            v2={`${kr(pakke2.rentebaner.r3.arligTermin).replace(" kr", "")} kr`}
          />
        </div>
      </section>

      {/* 2. FK per leilighetstype */}
      <section className="card">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
            <FileText size={20} />
          </div>
          <div>
            <div className="label">Avsnitt 2</div>
            <h2 className="display mt-1.5 text-xl font-semibold text-ink sm:text-2xl">
              Felleskostnad per leilighetstype
            </h2>
          </div>
        </div>
        <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
          Per OBOS-bankens analyse 12.06.2026: to-trinns FK-økning (01.07.2027
          og 01.07.2028) ved tre rentebaner. Etter dette er det forutsatt
          3 % inflasjonsjustering 01.07.2029 og 01.07.2030.
        </p>

        <h3 className="display mt-6 text-lg font-semibold text-ink">
          2.1 Pakke 1 — 190 mill, 30 år (per leilighet, 13 typer fra OBOS-PDF)
        </h3>
        <p className="mt-1 text-[13px] text-muted">
          Tre rentebaner: 5,04 % (+24 % cum), 5,54 % (+27 % cum), 6,04 % (+29 % cum).
        </p>
        <PdfFkTabell
          rows={[
            ["1 – 54,7 m²", "3 836", "4 769", "4 855", "4 942"],
            ["2 – 54,7 m²", "4 329", "5 382", "5 479", "5 577"],
            ["3 – 66,9 m²", "4 490", "5 582", "5 683", "5 784"],
            ["4 – 66,9 m²", "4 937", "6 138", "6 248", "6 360"],
            ["5 – 78,5 m²", "5 000", "6 216", "6 328", "6 441"],
            ["6 – 85,6 m²", "5 221", "6 491", "6 608", "6 726"],
            ["7 – 74,6 m²", "5 364", "6 669", "6 789", "6 910"],
            ["8 – 85,5 m²", "5 436", "6 758", "6 880", "7 003"],
            ["9 – 78,5 m²", "5 551", "6 901", "7 025", "7 151"],
            ["10 – 81,3 m²", "5 648", "7 022", "7 148", "7 276"],
            ["11 – 83,6 m²", "5 745", "7 142", "7 271", "7 401"],
            ["12 – 85,5 m²", "5 856", "7 280", "7 411", "7 544"],
            ["13 – 91,5 m²", "5 946", "7 392", "7 525", "7 660"],
          ]}
          snitt={[
            "Vektet snitt — 430 andeler",
            `${felles.fkSnittIDagKrMnd.toLocaleString("nb-NO")}`,
            `${(felles.fkSnittIDagKrMnd + pakke1.rentebaner.r1.bruttoSnittKrMnd).toLocaleString("nb-NO")}`,
            `${(felles.fkSnittIDagKrMnd + pakke1.rentebaner.r2.bruttoSnittKrMnd).toLocaleString("nb-NO")}`,
            `${(felles.fkSnittIDagKrMnd + pakke1.rentebaner.r3.bruttoSnittKrMnd).toLocaleString("nb-NO")}`,
          ]}
        />

        <h3 className="display mt-8 text-lg font-semibold text-ink">
          2.2 Pakke 2 — 341,7 mill, 40 år (per leilighet, forholdsmessig fra mai-analysen)
        </h3>
        <p className="mt-1 text-[13px] text-muted">
          Tre rentebaner ved samme leilighetsstørrelser. Cum.-økninger:
          5,04 % → +53,7 %, 5,54 % → +58,6 %, 6,04 % → +63,7 %.
        </p>
        <PdfFkTabell
          rows={[
            ["1 – 54,7 m²", "3 836", "5 895", "6 084", "6 281"],
            ["2 – 54,7 m²", "4 329", "6 653", "6 866", "7 088"],
            ["3 – 66,9 m²", "4 490", "6 900", "7 121", "7 351"],
            ["4 – 66,9 m²", "4 937", "7 587", "7 830", "8 083"],
            ["5 – 78,5 m²", "5 000", "7 684", "7 930", "8 186"],
            ["6 – 85,6 m²", "5 221", "8 023", "8 281", "8 548"],
            ["7 – 74,6 m²", "5 364", "8 243", "8 508", "8 783"],
            ["8 – 85,5 m²", "5 436", "8 354", "8 622", "8 901"],
            ["9 – 78,5 m²", "5 551", "8 531", "8 804", "9 089"],
            ["10 – 81,3 m²", "5 648", "8 680", "8 957", "9 248"],
            ["11 – 83,6 m²", "5 745", "8 829", "9 111", "9 407"],
            ["12 – 85,5 m²", "5 856", "8 999", "9 287", "9 588"],
            ["13 – 91,5 m²", "5 946", "9 138", "9 430", "9 736"],
          ]}
          snitt={[
            "Vektet snitt — 430 andeler",
            `${felles.fkSnittIDagKrMnd.toLocaleString("nb-NO")}`,
            `${(felles.fkSnittIDagKrMnd + pakke2.rentebaner.r1.bruttoSnittKrMnd).toLocaleString("nb-NO")}`,
            `${(felles.fkSnittIDagKrMnd + pakke2.rentebaner.r2.bruttoSnittKrMnd).toLocaleString("nb-NO")}`,
            `${(felles.fkSnittIDagKrMnd + pakke2.rentebaner.r3.bruttoSnittKrMnd).toLocaleString("nb-NO")}`,
          ]}
        />

        <div className="mt-5 rounded-2xl border-l-4 border-save bg-save-bg/40 px-5 py-4 text-[14px] leading-relaxed text-ink/85">
          <strong>Pakke 2 med forventet tilleggsstøtte fra Enova:</strong>{" "}
          Hvis Enova innvilger søknad for de 9 resterende blokkene (svar
          slutten av juni 2026), kan ytterligere {kr(felles.enovaForventetTillegg)} bli
          innvilget. Pakke 2-lånet reduseres da til 307,9 mill, og snitt netto
          FK-økning faller fra +{pakke2.rentebaner.r1.nettoSnittKrMnd} kr/mnd
          til ca. +{pakke2.utvidetEnova.nettoSnittKrMnd} kr/mnd (ved 5,04 %).
        </div>
      </section>

      {/* 3. Enova */}
      <section className="card">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-save-bg text-save">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="label">Avsnitt 3</div>
            <h2 className="display mt-1.5 text-xl font-semibold text-ink sm:text-2xl">
              Enova-støtte — status og strategi
            </h2>
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-ink/80">
          Enova innvilget i april 2026 et endelig tilsagn på{" "}
          <strong>{kr(felles.enovaBekreftet)}</strong> til bergvarme og
          solceller i fire av borettslagets 13 blokker. Tilsagnet er
          rettskraftig og kan ikke trekkes tilbake. Styret søker for de
          resterende ni blokkene innen mai 2026, og forventet svar er slutten
          av juni 2026.
        </p>

        <div className="mt-5 rounded-2xl border-l-4 border-save bg-save-bg/60 px-5 py-4 text-[14.5px] leading-relaxed text-ink/85">
          <strong>Strategi:</strong> Styret har besluttet å prosjektere og
          gjennomføre bergvarme og solceller for alle 13 blokker samlet. Alle
          andelseiere skal ha samme løsning. All Enova-støtte som innvilges —
          uavhengig av tidspunkt — reduserer borettslagets samlede lån direkte.
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Scenario" v1="Enova totalt" v2="Pakke 2 netto økning/mnd snitt" />
          <Row label="Bekreftet (4 blokker)" v1="31 300 000" v2={`+${pakke2.rentebaner.r1.nettoSnittKrMnd} kr`} />
          <Row label="Forventet tilleggsstøtte (svar slutten av juni 2026)" v1="+ 33 781 024" v2={`ca. +${pakke2.utvidetEnova.nettoSnittKrMnd} kr`} />
          <Row label="Sum hvis innvilget" v1="65 081 024" v2={`ca. +${pakke2.utvidetEnova.nettoSnittKrMnd} kr`} total />
        </div>
      </section>

      {/* 4. Energi */}
      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <div>
            <div className="label">Avsnitt 4</div>
            <h2 className="display mt-1.5 text-xl font-semibold text-ink sm:text-2xl">
              Energi — solceller og bergvarme
            </h2>
          </div>
          <span className="chip !py-0.5 !px-2 text-[10.5px]">
            Data: Dråpe AS · Fusen
          </span>
        </div>
        <EnergiChart />

        <div className="mt-5 overflow-hidden rounded-2xl border border-line/70 bg-paper">
          <Row header label="Aggregerte tall" v1="Verdi" v2="Merknad" rightLast />
          <Row label="Strømbesparelse P1 (vinduer + fasadeisolasjon)" v1="500 000 kWh/år" v2="fordeles pr. m²" rightLast />
          <Row label="Strømbesparelse bergvarme (Alt 2/3)" v1="2 591 753 kWh/år" v2="75 % × privat oppvarming (3 455 671 kWh), fordeles pr. m²" rightLast />
          <Row label="Sum oppvarmings-besparelse Alt 2/3" v1="3 091 753 kWh/år" v2="P1 + bergvarme, fordeles pr. m²" rightLast />
          <Row label="Solcelleproduksjon (Alt 2/3)" v1="978 180 kWh/år" v2="dekker felles + overskuddsdeling, fordeles pr. m²" rightLast />
          <Row label="Reduksjon i oppvarmingsstrøm" v1="ca. 75 %" v2="bergvarme COP ≈ 4–5" rightLast />
          <Row label="Strømpris (beregningsgrunnlag)" v1="1,20 kr/kWh" v2="konservativt anslag" rightLast />
        </div>
      </section>

      {/* 5. Forutsetninger */}
      <section className="card">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
            <FileText size={20} />
          </div>
          <div>
            <div className="label">Avsnitt 5</div>
            <h2 className="display mt-1.5 text-xl font-semibold text-ink sm:text-2xl">
              Sentrale forutsetninger
            </h2>
          </div>
        </div>

        <h3 className="display mt-6 text-lg font-semibold text-ink">
          A. Investeringskostnader Pakke 1
        </h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Post" v1="Verdi" v2="Merknad" rightLast />
          <Row label="Rehabiliteringskostnad" v1="192 000 000 kr" v2="tak, fasader, vinduer, betong + 10 % uforutsett" rightLast />
          <Row label="Finanskostnader byggeperiode (5,04 %)" v1="12 247 200 kr" v2="2 års byggetid, delutbetaling" rightLast />
          <Row label="Totalprosjektkostnad" v1="204 247 200 kr" v2="brutto investering" rightLast />
          <Row label="(−) ENØK-støtte" v1="−2 000 000 kr" v2="utbetales etter prosjektslutt" tone="muted" rightLast />
          <Row label="Nytt lån (etter Enova)" v1="190 000 000 kr" v2="OBOS Banken 12.06.2026" total rightLast />
        </div>

        <h3 className="display mt-7 text-lg font-semibold text-ink">
          B. Investeringskostnader Pakke 2 (totalt)
        </h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Post" v1="Verdi" v2="Merknad" rightLast />
          <Row label="Rehabiliteringskostnad" v1="379 753 000 kr" v2="P1 + bergvarme + solceller m.m." rightLast />
          <Row label="Finanskostnader byggeperiode" v1="23 738 400 kr" v2="2 års byggetid" rightLast />
          <Row label="Totalprosjektkostnad" v1="403 491 400 kr" v2="brutto investering" rightLast />
          <Row label="(−) ENØK-støtte (bekreftet)" v1="−31 300 000 kr" v2="4 blokker (april 2026)" tone="muted" rightLast />
          <Row label="Nytt lån (etter bekreftet Enova)" v1="341 700 000 kr" v2="basis-scenario Pakke 2" total rightLast />
          <Row label="(−) Forventet tilleggsstøtte" v1="−33 781 024 kr" v2="svar slutten av juni 2026" tone="muted" rightLast />
          <Row label="Nytt lån m/ tilleggsstøtte" v1="307 918 976 kr" v2="dersom innvilget" total rightLast />
        </div>

        <h3 className="display mt-7 text-lg font-semibold text-ink">
          C. Finansiering og drift
        </h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Forutsetning" v1="Verdi" v2="Merknad" rightLast />
          <Row label="Hovedrente (grønt lån) P1 / P2" v1="5,04 % / 5,04 %" v2="hovedscenario" rightLast />
          <Row label="Rentebaner (sensitivitet)" v1="5,04 / 5,54 / 6,04 %" v2="grønt lån, P1 30 år / P2 40 år" rightLast />
          <Row label="Avdragsfri periode" v1="24 mnd" v2="til prosjektslutt 30.06.2028" rightLast />
          <Row label="Strømpris" v1="1,20 kr/kWh" v2="konservativt anslag" rightLast />
          <Row label="Strømbesparelse P1 (input)" v1="500 000 kWh/år" v2="vinduer + fasadeisolasjon" rightLast />
          <Row label="Skattesats rentefradrag" v1="22 %" v2="RF-1215" rightLast />
          <Row label="Inflasjonsjustering FK" v1="3 % 01.07.2029 og 01.07.2030" v2="iht. OBOS-analyse 12.06.2026" rightLast />
          <Row label="Dagens budsjetterte FK 2026" v1="27 810 829 kr/år" v2="referanseverdi" rightLast />
        </div>
      </section>

      {/* 6. Kostnad ved å vente */}
      <section className="card">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-warm-bg text-warm-deep">
            <FileText size={20} />
          </div>
          <div>
            <div className="label">Avsnitt 6</div>
            <h2 className="display mt-1.5 text-xl font-semibold text-ink sm:text-2xl">
              Kostnad ved å utsette beslutningen
            </h2>
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-ink/80">
          Byggekostnadsindeksen (SSB) viser 4–5 % prisvekst per år de siste fem
          årene. En fremskrivning på 4 % per år gir 12,5 % merkostnad over tre
          år.
        </p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-line/70">
          <Row
            header
            label="Scenario"
            v1="Merkostnad totalt"
            v2="Per andel / mnd"
          />
          <Row label="Pakke 1 (190 MNOK)" v1="23 760 000 kr" v2="+1 535 kr/mnd" />
          <Row label="Pakke 2-tillegg (151,7 MNOK over P1)" v1="18 962 000 kr" v2="+1 224 kr/mnd" />
          <Row label="Samlet Pakke 2 (341,7 MNOK)" v1="42 722 000 kr" v2="+2 759 kr/mnd" total />
        </div>
      </section>

      {/* 6b. Risiko og følsomhet */}
      <section className="card">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-warm-bg text-warm-deep">
            <FileText size={20} />
          </div>
          <div>
            <div className="label">Avsnitt 6b</div>
            <h2 className="display mt-1.5 text-xl font-semibold text-ink sm:text-2xl">
              Risiko og følsomhetsanalyse
            </h2>
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-ink/80">
          Modellen bygger på punkt-estimater. Tabellen under viser hvordan
          andelseiers <strong>netto FK-økning</strong> for Pakke 2 kan endre
          seg ved variasjoner i sentrale forutsetninger. Snitt-andelen ligger
          ved 5,04 % på +{pakke2.rentebaner.r1.nettoSnittKrMnd} kr/mnd —
          tabellen viser endring fra dette nivået.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Risikofaktor" v1="Endring" v2="Effekt på netto FK / mnd snitt" />
          <Row label="Rente 5,54 % (vs 5,04 %)" v1="−" v2={`ca. +${pakke2.rentebaner.r2.nettoSnittKrMnd - pakke2.rentebaner.r1.nettoSnittKrMnd} kr/mnd høyere`} />
          <Row label="Rente 6,04 % (vs 5,04 %)" v1="−" v2={`ca. +${pakke2.rentebaner.r3.nettoSnittKrMnd - pakke2.rentebaner.r1.nettoSnittKrMnd} kr/mnd høyere`} />
          <Row label="Strømpris ned 50 % (0,60 kr/kWh)" v1="−" v2="ca. +473 kr/mnd høyere" />
          <Row label="Strømpris opp 50 % (1,80 kr/kWh)" v1="−" v2="ca. −473 kr/mnd lavere" />
          <Row label="Bergvarme COP 3 (vs. forutsatt 4–5)" v1="−" v2="ca. +180 kr/mnd høyere" />
          <Row label="Byggekostnader +10 % (uforutsett)" v1="−" v2="ca. +175 kr/mnd høyere" />
          <Row label="Forventet Enova-tilleggsstøtte (33,78 MNOK)" v1="−" v2={`ca. −${pakke2.rentebaner.r1.nettoSnittKrMnd - pakke2.utvidetEnova.nettoSnittKrMnd} kr/mnd lavere`} />
        </div>

        <div className="mt-5 rounded-2xl border-l-4 border-warm bg-warm-bg/60 px-5 py-4 text-[14px] leading-relaxed text-ink/85">
          <strong>Konklusjon på risiko:</strong> Netto-tallet er svært
          følsomt for rente og strømpris. En kombinasjon av høyere rente og
          lavere strømpris kan øke andelens netto FK-belastning med flere
          hundre kr/mnd ut over presenterte tall. Motsatt scenarioer (lavere
          rente, mer Enova-støtte) kan redusere belastningen betydelig.
          Verktøyet erstatter ikke en formell økonomisk vurdering.
        </div>
      </section>

      {/* 6c. Marginal kostnad P2 vs P1 */}
      <section className="card">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
            <FileText size={20} />
          </div>
          <div>
            <div className="label">Avsnitt 6c</div>
            <h2 className="display mt-1.5 text-xl font-semibold text-ink sm:text-2xl">
              Marginal merkostnad: P2 over P1
            </h2>
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-ink/80">
          Pakke 1+2 forutsetter at Pakke 1 vedtas. Den{" "}
          <strong>marginale</strong> kostnaden av å velge tilleggspakken
          (bergvarme + solceller + ekstra prosjektering og Enova) over Pakke
          1 alene — er forskjellen i netto FK-økning. Dette er det reelle
          beløpet andelseiere bør vurdere når de avgjør om P2 lønner seg.
        </p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Differanse P2 vs P1 (ved 5,04 %)" v1="Snitt per andel" v2="Per år" />
          <Row label="Brutto FK-økning" v1={`+${pakke2.rentebaner.r1.bruttoSnittKrMnd - pakke1.rentebaner.r1.bruttoSnittKrMnd} kr/mnd`} v2={`+${((pakke2.rentebaner.r1.bruttoSnittKrMnd - pakke1.rentebaner.r1.bruttoSnittKrMnd) * 12).toLocaleString("nb-NO")} kr`} />
          <Row label="Ekstra strømbesparelse (bergvarme + solar)" v1={`−${(pakke2.rentebaner.r1.stromBespSnittKrMnd + pakke2.rentebaner.r1.solenergiSnittKrMnd - pakke1.rentebaner.r1.stromBespSnittKrMnd)} kr/mnd`} v2={`−${((pakke2.rentebaner.r1.stromBespSnittKrMnd + pakke2.rentebaner.r1.solenergiSnittKrMnd - pakke1.rentebaner.r1.stromBespSnittKrMnd) * 12).toLocaleString("nb-NO")} kr`} />
          <Row label="Ekstra skattefradrag" v1={`−${pakke2.rentebaner.r1.skattefradragSnittKrMnd - pakke1.rentebaner.r1.skattefradragSnittKrMnd} kr/mnd`} v2={`−${((pakke2.rentebaner.r1.skattefradragSnittKrMnd - pakke1.rentebaner.r1.skattefradragSnittKrMnd) * 12).toLocaleString("nb-NO")} kr`} />
          <Row label="Marginal netto merkostnad" v1={`+${pakke2.rentebaner.r1.nettoSnittKrMnd - pakke1.rentebaner.r1.nettoSnittKrMnd} kr/mnd`} v2={`+${((pakke2.rentebaner.r1.nettoSnittKrMnd - pakke1.rentebaner.r1.nettoSnittKrMnd) * 12).toLocaleString("nb-NO")} kr`} total />
          <Row label="Marginal netto m/utvidet Enova" v1={`+${pakke2.utvidetEnova.nettoSnittKrMnd - pakke1.rentebaner.r1.nettoSnittKrMnd} kr/mnd`} v2={`+${((pakke2.utvidetEnova.nettoSnittKrMnd - pakke1.rentebaner.r1.nettoSnittKrMnd) * 12).toLocaleString("nb-NO")} kr`} total />
        </div>
        <div className="mt-4 text-[13.5px] leading-relaxed text-muted sm:text-[14px]">
          For andelseiere med stort eget boliglån kan den marginale gevinsten
          fra grønt lån (energiklasse F→B) endre regnestykket. Bruk
          grønt lån-kalkulatoren under «Min leilighet» for personlig estimat.
        </div>
      </section>

      {/* 7. Styrets vurdering */}
      <section className="overflow-hidden rounded-3xl border border-warm/30 bg-gradient-to-br from-warm-bg to-amber-100/40 p-7 sm:p-10">
        <div className="label">Avsnitt 7</div>
        <h2 className="display mt-2 text-2xl font-semibold text-ink">
          Styrets vurdering og anbefaling
        </h2>
        <p className="mt-4 leading-relaxed text-ink/85">
          Netto økning i felleskostnad er <strong>{pakke1.rentebaner.r1.nettoSnittKrMnd} kr/mnd</strong> for Pakke 1
          og <strong>{pakke2.rentebaner.r1.nettoSnittKrMnd} kr/mnd</strong> for Pakke 2 — snitt for alle 430
          andeler ved 5,04 % grønt lån. Brutto økning er hhv.{" "}
          {pakke1.rentebaner.r1.bruttoSnittKrMnd} og {pakke2.rentebaner.r1.bruttoSnittKrMnd}{" "}
          kr/mnd. Fradragene som bringer brutto ned til netto er
          strømbesparelse oppvarming ({pakke2.rentebaner.r1.stromBespSnittKrMnd} kr/mnd snitt
          for P2), solenergi ({pakke2.rentebaner.r1.solenergiSnittKrMnd} kr/mnd
          snitt — areal-fordelt) og skattefradrag ({pakke2.rentebaner.r1.skattefradragSnittKrMnd} kr/mnd
          snitt for P2). Tallene er basert på OBOS Banken likviditetsanalyse
          12.06.2026 (Pakke 1) og 13.05.2026 (Pakke 2) sammen med Elvia-totalen
          5,57 mill kWh og Istad-data 2024–2026. Tre rentebaner er vist
          (5,04 / 5,54 / 6,04 %).
        </p>
        <div className="mt-5 rounded-2xl border-l-4 border-warm bg-paper px-5 py-4 text-[14.5px] leading-relaxed text-ink/85">
          <strong>Styrets rolle:</strong> Styret fremmer begge pakker som
          selvstendige vedtakspunkter. Andelseierne avgjør kostnadsnivå i
          generalforsamlingen. Styrets ansvar er å sikre at tallgrunnlaget er
          fullstendig og korrekt.
        </div>
      </section>

      <div className="rounded-3xl bg-paper p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <div className="display text-xl font-semibold text-ink">
              Klar til å se din egen leilighet?
            </div>
            <div className="text-sm text-muted">
              Skriv inn andelsnr eller leil.nr for personlig beregning.
            </div>
          </div>
          <Link href="/finn" className="btn-primary">
            Finn min leilighet <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  v1,
  v2,
  header,
  total,
  tone,
  rightLast,
}: {
  label: string;
  v1: string;
  v2: string;
  header?: boolean;
  total?: boolean;
  tone?: "muted";
  rightLast?: boolean;
}) {
  const cls = header
    ? "bg-brand text-white"
    : total
    ? "bg-brand-50 font-semibold text-ink"
    : "bg-paper text-ink";
  const muted = tone === "muted" ? "text-muted" : "";
  const v2Cls = rightLast
    ? `${header ? "" : "text-[12.5px] sm:text-[13px]"} sm:text-left text-right`
    : `text-right num ${header ? "" : "font-medium"} text-[12.5px] sm:text-[13.5px]`;
  return (
    <div
      className={`grid grid-cols-[1.3fr_1fr_1fr] items-baseline gap-2 border-b border-line/50 px-3.5 py-3 last:border-b-0 sm:grid-cols-[1.4fr_1fr_1fr] sm:gap-3 sm:px-5 ${cls} ${muted}`}
    >
      <div className={`text-[13px] sm:text-[13.5px] ${header ? "uppercase tracking-wide !text-[10.5px] sm:!text-[11px] font-semibold" : ""}`}>
        {label}
      </div>
      <div
        className={`text-right num text-[13px] sm:text-[13.5px] ${header ? "uppercase tracking-wide !text-[10.5px] sm:!text-[11px] font-semibold" : total ? "font-bold" : "font-semibold"}`}
      >
        {v1}
      </div>
      <div className={v2Cls.replace("text-[12.5px] sm:text-[13px]", "text-[12px] sm:text-[13px]").replace("text-[12.5px] sm:text-[13.5px]", "text-[13px] sm:text-[13.5px]")}>{v2}</div>
    </div>
  );
}

/** Tabell tilpasset OBOS-PDF: 5 kolonner — Leilighetstype, I dag, og 3 rentebaner. */
function PdfFkTabell({ rows, snitt }: { rows: string[][]; snitt: string[] }) {
  const cols = ["Leilighet / areal", "I dag", "5,04 %", "5,54 %", "6,04 %"];
  return (
    <div className="mt-3 overflow-x-auto rounded-2xl border border-line/70">
      <div className="px-4 pt-3 text-[11px] text-muted sm:hidden">
        ← sveip for å se alle kolonner →
      </div>
      <table className="w-full min-w-[560px] text-[13px]">
        <thead>
          <tr className="bg-brand text-white">
            {cols.map((c, i) => (
              <th
                key={c}
                className={`px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-wide ${i === 0 ? "text-left" : "text-right whitespace-nowrap min-w-[78px]"}`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="num">
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-surface/40" : "bg-paper"}>
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={`border-b border-line/40 px-3 py-2 ${j === 0 ? "text-left font-medium text-ink" : "text-right whitespace-nowrap text-ink/85"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-brand-50 font-semibold">
            {snitt.map((cell, j) => (
              <td
                key={j}
                className={`px-3 py-2.5 ${j === 0 ? "text-left text-ink" : "text-right whitespace-nowrap text-ink"}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

