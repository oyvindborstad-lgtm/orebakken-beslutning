import { Link } from "wouter";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { FORUTSETNINGER } from "../data/forutsetninger";
import { kr } from "../lib/format";
import EnergiChart from "../components/EnergiChart";

const { pakke1, pakke2, felles } = FORUTSETNINGER;

export default function Grunnlag() {
  return (
    <div className="space-y-12">
      <section>
        <div className="label">Fullstendig grunnlag</div>
        <h1 className="display mt-3 max-w-3xl text-[40px] font-semibold leading-[1.05] tracking-tightest text-ink sm:text-[52px]">
          Investeringsoversikt og forutsetninger
        </h1>
        <p className="mt-5 max-w-2xl text-[16.5px] leading-relaxed text-ink/75">
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
            <h2 className="display mt-1.5 text-2xl font-semibold text-ink">
              Investeringsoversikt
            </h2>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Kostnadspost" v1="Pakke 1 (kr)" v2="Pakke 1+2 tillegg (kr)" />
          <Row label="Tak og fasader" v1="110 000 000" v2="—" />
          <Row label="Betongrehabilitering" v1="65 000 000" v2="—" />
          <Row label="Bergvarme (energibrønner + varmesentral)" v1="—" v2="165 000 000" />
          <Row label="Solcelleanlegg" v1="—" v2="11 000 000" />
          <Row label="Prosjektledelse OBOS Prosjekt (per pakke)" v1="5 000 000" v2="5 000 000" />
          <Row label="Uforutsette kostnader (per pakke)" v1="10 000 000" v2="10 000 000" />
          <Row
            label="(−) Bekreftet Enova-støtte (4 blokker)"
            v1="—"
            v2="−31 375 000"
            tone="muted"
          />
          <Row
            label="Samlet netto lånebeløp"
            v1={kr(pakke1.laneSum).replace(" kr", "")}
            v2={kr(pakke2.laneSum).replace(" kr", "")}
            total
          />
          <Row
            label="Nedbetalingstid / rente"
            v1="30 år / 5,70 %"
            v2="40 år / 5,20 %"
          />
          <Row
            label="Månedlig annuitet (hele borettslaget)"
            v1="1 102 761 kr"
            v2="1 732 452 kr"
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
            <h2 className="display mt-1.5 text-2xl font-semibold text-ink">
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
            ["B – 54,7 m² (20 and.)", "3 935", "4 964", "+1 029", "−78", "−355", "+596", "4 531"],
            ["G – 74,6 m² (32 and.)", "4 876", "6 151", "+1 275", "−106", "−440", "+729", "5 605"],
            ["J – 81,3 m² (105 and.)", "5 134", "6 477", "+1 343", "−116", "−463", "+764", "5 898"],
            ["L – 85,5 m² (63 and.)", "5 323", "6 715", "+1 392", "−122", "−480", "+790", "6 113"],
            ["M – 89,7 m² (126 and.)", "5 405", "6 819", "+1 414", "−129", "−487", "+798", "6 203"],
          ]}
          snitt={["Vektet snitt — 430 andeler", "5 390", "6 424", "+1 034", "−116", "−294", "+624", "6 014"]}
        />

        <h3 className="display mt-8 text-lg font-semibold text-ink">
          2.2 Pakke 1+2 — per leilighetstype
        </h3>
        <FkTabell
          rows={[
            ["B – 54,7 m² (20 and.)", "3 935", "6 096", "+2 161", "−582", "−597", "+982", "4 917"],
            ["G – 74,6 m² (32 and.)", "4 876", "7 554", "+2 678", "−793", "−740", "+1 145", "6 021"],
            ["J – 81,3 m² (105 and.)", "5 134", "7 953", "+2 819", "−865", "−779", "+1 176", "6 310"],
            ["L – 85,5 m² (63 and.)", "5 323", "8 246", "+2 923", "−909", "−807", "+1 207", "6 530"],
            ["M – 89,7 m² (126 and.)", "5 405", "8 373", "+2 968", "−959", "−820", "+1 190", "6 595"],
          ]}
          snitt={["Vektet snitt — 430 andeler", "5 390", "7 889", "+2 499", "−866", "−514", "+1 119", "6 509"]}
          headerNyFu="Ny FK P1+2 brutto"
          headerNetto="Ny FK P1+2 netto"
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
            <h2 className="display mt-1.5 text-2xl font-semibold text-ink">
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
          <Row label="Kun bekreftet (4 blokker, april 2026)" v1="31 375 000" v2="+1 119 kr" />
          <Row label="+ 30 MNOK fra 9 nye søknader (lavt anslag)" v1="61 375 000" v2="ca. +773 kr" />
          <Row label="+ 40 MNOK fra 9 nye søknader (høyt anslag)" v1="71 375 000" v2="ca. +658 kr" />
        </div>
      </section>

      {/* 4. Energi */}
      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <div>
            <div className="label">Avsnitt 4</div>
            <h2 className="display mt-1.5 text-2xl font-semibold text-ink">
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
          <Row label="Netto strømbesparelse P1+2" v1="3 725 000 kWh/år" v2="bergvarme + solceller + isolasjon" rightLast />
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
            <h2 className="display mt-1.5 text-2xl font-semibold text-ink">
              Sentrale forutsetninger
            </h2>
          </div>
        </div>

        <h3 className="display mt-6 text-lg font-semibold text-ink">
          A. Investeringskostnader Pakke 1
        </h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Post" v1="Verdi" v2="Merknad" rightLast />
          <Row label="Tak og fasader" v1="110 000 000 kr" v2="basert på innhentet tilbud" rightLast />
          <Row label="Betongrehabilitering" v1="65 000 000 kr" v2="inkl. verandaer og fasadebetong" rightLast />
          <Row label="Prosjektledelse OBOS Prosjekt" v1="5 000 000 kr" v2="fordelt likt P1/P2" rightLast />
          <Row label="Uforutsette kostnader" v1="10 000 000 kr" v2="risikoavsetning" rightLast />
          <Row label="Sum lånebeløp P1" v1="190 000 000 kr" v2="" total rightLast />
        </div>

        <h3 className="display mt-7 text-lg font-semibold text-ink">
          B. Investeringskostnader Pakke 1+2 (tillegg)
        </h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Post" v1="Verdi" v2="Merknad" rightLast />
          <Row label="Bergvarme" v1="165 000 000 kr" v2="alle 13 blokker" rightLast />
          <Row label="Solcelleanlegg" v1="11 000 000 kr" v2="978 180 kWh/år produksjon" rightLast />
          <Row label="Prosjektledelse" v1="5 000 000 kr" v2="P2-andel av PL-honorar" rightLast />
          <Row label="Uforutsette kostnader" v1="10 000 000 kr" v2="separat risikoavsetning" rightLast />
          <Row label="(−) Bekreftet Enova-støtte" v1="−31 375 000 kr" v2="endelig tilsagn april 2026" tone="muted" rightLast />
          <Row label="Sum lånebeløp P1+P2" v1="349 625 000 kr" v2="" total rightLast />
        </div>

        <h3 className="display mt-7 text-lg font-semibold text-ink">
          C. Finansiering og drift
        </h3>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line/70">
          <Row header label="Forutsetning" v1="Verdi" v2="Merknad" rightLast />
          <Row label="Rente P1 / nedbetalingstid" v1="5,70 % / 30 år" v2="annuitetslån" rightLast />
          <Row label="Rente P1+2 / nedbetalingstid" v1="5,20 % / 40 år" v2="grønt lån, lavere rente" rightLast />
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
            <h2 className="display mt-1.5 text-2xl font-semibold text-ink">
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
          <Row label="Pakke 1 (190 MNOK)" v1="23 731 000 kr" v2="+1 533 kr/mnd" />
          <Row label="Pakke 2-tillegg (176 MNOK)" v1="21 976 000 kr" v2="+1 420 kr/mnd" />
          <Row label="Samlet P1+P2 (366 MNOK)" v1="45 700 000 kr" v2="+2 952 kr/mnd" total />
        </div>
      </section>

      {/* 7. Styrets vurdering */}
      <section className="overflow-hidden rounded-3xl border border-warm/30 bg-gradient-to-br from-warm-bg to-amber-100/40 p-7 sm:p-10">
        <div className="label">Avsnitt 7</div>
        <h2 className="display mt-2 text-2xl font-semibold text-ink">
          Styrets vurdering og anbefaling
        </h2>
        <p className="mt-4 leading-relaxed text-ink/85">
          Netto økning i felleskostnad er <strong>624 kr/mnd</strong> for Pakke
          1 og <strong>1 119 kr/mnd</strong> for Pakke 1+2 (vektet snitt for
          alle 430 andeler). Brutto økning er hhv. 1 034 og 2 499 kr/mnd.
          Fradragene som bringer brutto ned til netto er strømbesparelse og
          skattefradrag — begge beregnet over låneperiodens løpetid.
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
    ? `${header ? "" : "text-[13px]"}`
    : `text-right num ${header ? "" : "font-medium"}`;
  return (
    <div
      className={`grid grid-cols-[1.4fr_1fr_1fr] items-baseline gap-3 border-b border-line/50 px-5 py-3 last:border-b-0 ${cls} ${muted}`}
    >
      <div className={`text-[13.5px] ${header ? "uppercase tracking-wide text-[11px] font-semibold" : ""}`}>
        {label}
      </div>
      <div
        className={`text-right num text-[13.5px] ${header ? "uppercase tracking-wide text-[11px] font-semibold" : "font-medium"}`}
      >
        {v1}
      </div>
      <div className={v2Cls + " text-[13.5px]"}>{v2}</div>
    </div>
  );
}

function FkTabell({
  rows,
  snitt,
  headerNyFu = "Ny FK P1 brutto",
  headerNetto = "Ny FK P1 netto",
}: {
  rows: string[][];
  snitt: string[];
  headerNyFu?: string;
  headerNetto?: string;
}) {
  const cols = ["Type / areal", "I dag", headerNyFu, "Brutto økning", "Strøm-besp.", "Skattefradrag", "Netto økning", headerNetto];
  return (
    <div className="mt-3 overflow-x-auto rounded-2xl border border-line/70">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="bg-brand text-white">
            {cols.map((c, i) => (
              <th
                key={c}
                className={`px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-wide ${i === 0 ? "text-left" : "text-right"}`}
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
                  className={`border-b border-line/40 px-3 py-2 ${j === 0 ? "text-left font-medium text-ink" : "text-right text-ink/85"} ${j === 4 ? "text-save" : ""} ${j === 5 ? "text-tax-ink" : ""}`}
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
                className={`px-3 py-2.5 ${j === 0 ? "text-left text-ink" : "text-right text-ink"}`}
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
