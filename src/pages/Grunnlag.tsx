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
          <Row header label="Kostnadspost" v1="Pakke 1 (kr)" v2="Pakke 1+2 totalt (kr)" />
          <Row label="Rehabiliteringskostnad" v1="193 254 000" v2="379 753 000" />
          <Row label="Finanskostnader byggeperiode" v1="11 844 000" v2="23 738 400" />
          <Row label="Totalprosjektkostnad" v1="205 098 000" v2="403 491 400" total />
          <Row
            label="(−) ENØK-støtte (Alt 1: tak+fasader / Alt 2: P1+P2 m/Enova)"
            v1="−10 000 000"
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
            label="Nedbetalingstid / rente"
            v1="30 år / 5,14 %"
            v2="40 år / 5,04 %"
          />
          <Row
            label="Avdragsfri periode"
            v1="24 mnd"
            v2="24 mnd"
          />
          <Row
            label="Halvårlig termin (hele BRL)"
            v1="5 871 110 kr"
            v2="10 105 486 kr"
          />
          <Row
            label="Årlig termin (hele BRL)"
            v1="11 742 220 kr"
            v2="20 210 972 kr"
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
          Strømbesparelse fordeles etter areal. Skattefradrag på 22 % er for år
          1 (høyest); livsløpsgjennomsnitt brukes på snittraden. Strømpris 1,20
          kr/kWh.
        </p>

        <h3 className="display mt-6 text-lg font-semibold text-ink">
          2.1 Pakke 1 — per leilighetstype
        </h3>
        <FkTabell
          rows={[
            ["B – 54,7 m² (20 and.)", "3 935", "4 808", "+873", "−78", "−309", "+486", "4 421"],
            ["G – 74,6 m² (32 and.)", "4 876", "5 958", "+1 082", "−106", "−383", "+592", "5 468"],
            ["J – 81,3 m² (105 and.)", "5 134", "6 273", "+1 139", "−116", "−404", "+620", "5 754"],
            ["L – 85,5 m² (63 and.)", "5 323", "6 504", "+1 181", "−122", "−418", "+641", "5 964"],
            ["M – 89,7 m² (126 and.)", "5 405", "6 605", "+1 200", "−128", "−425", "+647", "6 052"],
          ]}
          snitt={["Vektet snitt — 430 andeler", "5 092", "6 222", "+1 130", "−116", "−240", "+774", "5 866"]}
        />

        <h3 className="display mt-8 text-lg font-semibold text-ink">
          2.2 Pakke 1+2 — per leilighetstype
        </h3>
        <FkTabell
          rows={[
            ["B – 54,7 m² (20 and.)", "3 935", "6 077", "+2 142", "−640", "−585", "+916", "4 851"],
            ["G – 74,6 m² (32 and.)", "4 876", "7 530", "+2 654", "−861", "−725", "+1 068", "5 944"],
            ["J – 81,3 m² (105 and.)", "5 134", "7 928", "+2 794", "−934", "−763", "+1 097", "6 231"],
            ["L – 85,5 m² (63 and.)", "5 323", "8 220", "+2 897", "−980", "−792", "+1 125", "6 448"],
            ["M – 89,7 m² (126 and.)", "5 405", "8 347", "+2 942", "−1 024", "−804", "+1 114", "6 519"],
          ]}
          snitt={["Vektet snitt — 430 andeler", "5 092", "7 863", "+2 771", "−935", "−319", "+1 517", "6 609"]}
          headerNyFu="Ny FK P1+2 brutto"
          headerNetto="Ny FK P1+2 netto"
          stromCol="Strøm + sol"
        />
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
          <Row header label="Scenario" v1="Enova totalt" v2="P1+2 netto økning/mnd" />
          <Row label="Alt 2 — kun bekreftet (4 blokker)" v1="31 300 000" v2="+1 517 kr" />
          <Row label="Mellom-scenario (40 mill total)" v1="40 000 000" v2="ca. +1 416 kr" />
          <Row label="Alt 3 — utvidet (60 mill etter nye søknader)" v1="60 000 000" v2="+1 215 kr" />
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
          <Row label="Netto strømbesparelse P1" v1="500 000 kWh/år" v2="bedre fasadeisolasjon" rightLast />
          <Row label="Netto strømbesparelse P1+2 (oppvarming)" v1="3 633 610 kWh/år" v2="bergvarme + isolasjon (75 % av Elvia-total × 75 %)" rightLast />
          <Row label="Solenergi via overskuddsdeling (i tillegg)" v1="978 180 kWh/år" v2="brøkfordelt på private målere" rightLast />
          <Row label="Reduksjon i oppvarmingsstrøm" v1="ca. 75 %" v2="bergvarme COP ≈ 4–5" rightLast />
          <Row label="Strømpris (beregningsgrunnlag)" v1="1,20 kr/kWh" v2="konservativt anslag" rightLast />
          <Row label="Solenergi via overskuddsdeling" v1="978 180 kWh/år" v2="fordelt etter brøk på private målere" rightLast />
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
          <Row label="Rehabiliteringskostnad" v1="193 254 000 kr" v2="tak, fasader, betong, vinduer m.m." rightLast />
          <Row label="Finanskostnader byggeperiode" v1="11 844 000 kr" v2="2 års byggetid" rightLast />
          <Row label="Totalprosjektkostnad" v1="205 098 000 kr" v2="brutto investering" rightLast />
          <Row label="(−) ENØK-støtte" v1="−10 000 000 kr" v2="for tak/fasader/isolasjon" tone="muted" rightLast />
          <Row label="Nytt lån (etter Enova)" v1="176 000 000 kr" v2="OBOS Banken Alt 1 (13.05.2026)" total rightLast />
        </div>

        <h3 className="display mt-7 text-lg font-semibold text-ink">
          B. Investeringskostnader Pakke 1+2 (totalt)
        </h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Post" v1="Verdi" v2="Merknad" rightLast />
          <Row label="Rehabiliteringskostnad" v1="379 753 000 kr" v2="P1 + bergvarme + solceller m.m." rightLast />
          <Row label="Finanskostnader byggeperiode" v1="23 738 400 kr" v2="2 års byggetid" rightLast />
          <Row label="Totalprosjektkostnad" v1="403 491 400 kr" v2="brutto investering" rightLast />
          <Row label="(−) ENØK-støtte Alt 2" v1="−31 300 000 kr" v2="bekreftet 4 blokker (april 2026)" tone="muted" rightLast />
          <Row label="Nytt lån Alt 2 (etter Enova)" v1="341 700 000 kr" v2="OBOS Banken Alt 2" total rightLast />
          <Row label="(−) ENØK-støtte Alt 3 (utvidet)" v1="−60 000 000 kr" v2="m/ tilsagn for resterende 9 blokker" tone="muted" rightLast />
          <Row label="Nytt lån Alt 3 (etter Enova)" v1="313 000 000 kr" v2="OBOS Banken Alt 3" total rightLast />
        </div>

        <h3 className="display mt-7 text-lg font-semibold text-ink">
          C. Finansiering og drift
        </h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Forutsetning" v1="Verdi" v2="Merknad" rightLast />
          <Row label="Rente P1 / nedbetalingstid" v1="5,14 % / 30 år" v2="annuitet, 24 mnd avdragsfritt" rightLast />
          <Row label="Rente P1+2 / nedbetalingstid" v1="5,04 % / 40 år" v2="OBOS-tilbud, 24 mnd avdragsfritt" rightLast />
          <Row label="Strømpris" v1="1,20 kr/kWh" v2="konservativt anslag" rightLast />
          <Row label="Strømbesparelse P1 (input)" v1="500 000 kWh/år" v2="fasadeisolasjon" rightLast />
          <Row label="Skattesats rentefradrag" v1="22 %" v2="RF-1215" rightLast />
          <Row label="Ønsket likviditetsoverskudd" v1="1 500 000 kr/år" v2="buffer i driftsbudsjettet" rightLast />
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
          <Row label="Pakke 1 — Alt 1 (176 MNOK)" v1="22 000 000 kr" v2="+1 421 kr/mnd" />
          <Row label="Pakke 2-tillegg (Alt 2, 165,7 MNOK)" v1="20 713 000 kr" v2="+1 337 kr/mnd" />
          <Row label="Samlet P1+P2 (Alt 2, 341,7 MNOK)" v1="42 713 000 kr" v2="+2 759 kr/mnd" total />
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
          andelseiers <strong>netto FK-økning</strong> for Pakke 1+2 kan endre
          seg ved variasjoner i sentrale forutsetninger. Snitt-andelen ligger
          i dag på +1 517 kr/mnd (Alt 2); tallene under viser endring fra dette nivået.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Risikofaktor" v1="Endring" v2="Effekt på netto FK / mnd snitt" />
          <Row label="Rente +1 prosentpoeng (P2 til 5,9 %)" v1="−" v2="ca. +290 kr/mnd høyere" />
          <Row label="Rente −1 prosentpoeng (P2 til 3,9 %)" v1="−" v2="ca. −290 kr/mnd lavere" />
          <Row label="Strømpris ned 50 % (0,60 kr/kWh)" v1="−" v2="ca. +536 kr/mnd høyere" />
          <Row label="Strømpris opp 50 % (1,80 kr/kWh)" v1="−" v2="ca. −536 kr/mnd lavere" />
          <Row label="Bergvarme COP 3 (vs. forutsatt 4–5)" v1="−" v2="ca. +180 kr/mnd høyere" />
          <Row label="Byggekostnader +10 % (uforutsett)" v1="−" v2="ca. +175 kr/mnd høyere" />
          <Row label="Enova-tilleggsstøtte 30 MNOK (lavt anslag)" v1="−" v2="ca. −359 kr/mnd lavere" />
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
          <Row header label="Differanse P1+2 vs P1" v1="Snitt per andel" v2="Per år" />
          <Row label="Brutto FK-økning" v1="+1 641 kr/mnd" v2="19 692 kr" />
          <Row label="Ekstra strømbesparelse + solenergi" v1="−819 kr/mnd" v2="−9 828 kr" />
          <Row label="Ekstra skattefradrag (snitt)" v1="−79 kr/mnd" v2="−948 kr" />
          <Row label="Ekstra skattefradrag" v1="−229 kr/mnd" v2="−2 748 kr" />
          <Row label="Marginal netto merkostnad (Alt 2)" v1="+743 kr/mnd" v2="8 916 kr" total />
          <Row label="Marginal netto merkostnad (Alt 3, 60 mill Enova)" v1="+441 kr/mnd" v2="5 292 kr" total />
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
          Netto økning i felleskostnad er <strong>774 kr/mnd</strong> for Pakke
          1 (Alt 1) og <strong>1 517 kr/mnd</strong> for Pakke 1+2 (Alt 2 —
          snitt for alle 430 andeler). Brutto økning er hhv. 1 130 og 2 771
          kr/mnd. Fradragene som bringer brutto ned til netto er
          strømbesparelse oppvarming (719 kr/mnd snitt for P2), solenergi
          (216 kr/mnd snitt) og skattefradrag (319 kr/mnd snitt). Tallene er
          basert på OBOS Banken likviditetsanalyse 13.05.2026 (lånebeløp,
          rente 5,04 %, 24 mnd avdragsfritt) sammen med Elvia-totalen
          5,57 mill kWh og Istad-data 2024–2026. Med utvidet ENØK-støtte
          (60 mill, Alt 3) blir netto P2 = +1 215 kr/mnd.
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

function FkTabell({
  rows,
  snitt,
  headerNyFu = "Ny FK P1 brutto",
  headerNetto = "Ny FK P1 netto",
  stromCol = "Strøm-besp.",
}: {
  rows: string[][];
  snitt: string[];
  headerNyFu?: string;
  headerNetto?: string;
  stromCol?: string;
}) {
  const cols = ["Type / areal", "I dag", headerNyFu, "Brutto økning", stromCol, "Skattefradrag", "Netto økning", headerNetto];
  return (
    <div className="mt-3 overflow-x-auto rounded-2xl border border-line/70">
      <div className="px-4 pt-3 text-[11px] text-muted sm:hidden">
        ← sveip for å se alle kolonner →
      </div>
      <table className="w-full min-w-[860px] text-[13px]">
        <thead>
          <tr className="bg-brand text-white">
            {cols.map((c, i) => (
              <th
                key={c}
                className={`px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wide ${i === 0 ? "text-left" : "text-right whitespace-nowrap min-w-[88px]"}`}
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
                  className={`border-b border-line/40 px-4 py-2 ${j === 0 ? "text-left font-medium text-ink" : "text-right whitespace-nowrap min-w-[88px] text-ink/85"} ${j === 4 ? "text-save" : ""} ${j === 5 ? "text-tax-ink" : ""}`}
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
                className={`px-4 py-2.5 ${j === 0 ? "text-left text-ink" : "text-right whitespace-nowrap min-w-[88px] text-ink"}`}
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
