import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Calendar,
  Sparkles,
  Check,
  ChevronDown,
  Hammer,
  Sun,
} from "lucide-react";
import { FORUTSETNINGER } from "../data/forutsetninger";
import { kr } from "../lib/format";

const { felles } = FORUTSETNINGER;

export default function Bakgrunn() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section>
        <div className="label">For alle andelseiere</div>
        <h1 className="display mt-3 max-w-3xl text-[30px] font-semibold leading-[1.05] tracking-tightest text-ink sm:text-[40px] lg:text-[52px]">
          Bakgrunn og spørsmål du kanskje stiller deg
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/75 sm:mt-5 sm:text-[16.5px]">
          Her finner du forklaringen bak rehabiliteringen — uten tekniske
          faguttrykk. Hvorfor må vi gjøre noe nå, hva er bergvarme, og hva betyr
          skattefradraget? Bla gjennom seksjonene under.
        </p>
      </section>

      {/* Hvorfor nå? */}
      <section className="card">
        <h2 className="display text-xl font-semibold text-ink sm:text-2xl">
          Hvorfor må vi gjøre noe nå?
        </h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          Orebakkens blokker ble bygget på 1970-tallet. Det meste har holdt
          godt, men nå er vi ved et naturlig punkt der store deler av
          bygningsskallet trenger utskifting:
        </p>
        <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink/85">
          <Bullet>
            <strong>Takene</strong> ble lagt 1999–2000 og er ved slutten av sin
            levetid.
          </Bullet>
          <Bullet>
            <strong>Fasader og vinduer</strong> fra 1984-rehabiliteringen er
            slitt og mister isolasjonsevnen.
          </Bullet>
          <Bullet>
            <strong>Betongskader</strong> på verandaer og fasader er mer
            alvorlige enn antatt og forverres raskt.
          </Bullet>
          <Bullet>
            <strong>Strømforbruket</strong> til oppvarming er svært høyt — gamle
            bygninger uten god isolasjon bruker mye mer energi enn nødvendig.
          </Bullet>
        </ul>
        <div className="mt-5 rounded-2xl border-l-4 border-warm bg-warm-bg/60 px-5 py-4 text-[14.5px] leading-relaxed text-ink/85">
          Hvert år vi venter, stiger byggeprisene med ca. 4 %. Utsetter vi tre
          år, koster det samme arbeidet om lag <strong>46 millioner kroner mer</strong>{" "}
          enn det gjør nå — det tilsvarer nesten 2 950 kr ekstra per andel per
          måned over låneperioden.
        </div>
      </section>

      {/* De to alternativene */}
      <section className="card">
        <h2 className="display text-xl font-semibold text-ink sm:text-2xl">
          De to alternativene
        </h2>

        <div className="mt-5 space-y-5">
          <Pakke
            tone="brand"
            icon={<Hammer size={18} />}
            tittel="Pakke 1 — Tak, fasader og betong"
            flertall="Krever 50 % flertall"
          >
            Pakke 1 omfatter nye tak, nye fasader med forbedret isolasjon,
            reparasjon av betongskader på verandaer og fasader, samt utbedring
            av oppganger og kjellerdører. Pakke 1 kan vedtas alene med simpelt
            flertall.
            <br />
            <br />
            Borettslaget tar opp <strong>190 millioner kroner</strong> i lån over
            30 år til 5,70 % rente. Brutto økning i felleskostnad er{" "}
            <strong>+1 034 kr/mnd</strong> i snitt. Netto økning, etter
            strømbesparelse og skattefradrag, er <strong>+624 kr/mnd</strong> i
            snitt.
          </Pakke>

          <Pakke
            tone="warm"
            icon={<Sun size={18} />}
            tittel="Pakke 2 — Bergvarme og solceller (i tillegg til Pakke 1)"
            flertall="Krever 2/3 flertall"
          >
            Pakke 2 kan kun vedtas i tillegg til Pakke 1. I tillegg til alt i
            Pakke 1 installeres bergvarme og solceller i alle 13 blokker.
            <br />
            <br />
            Borettslaget tar opp totalt{" "}
            <strong>349,6 millioner kroner</strong> over 40 år til 5,20 % rente
            (grønt lån). Brutto økning i felleskostnad er{" "}
            <strong>+2 499 kr/mnd</strong> i snitt. Netto økning er{" "}
            <strong>+1 119 kr/mnd</strong> i snitt.
          </Pakke>
        </div>

        <div className="mt-7">
          <div className="label">Tiltak som inngår</div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-line/70">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-line/50 bg-brand px-3.5 py-2.5 text-white sm:gap-4 sm:px-5">
              <div className="text-[10.5px] font-semibold uppercase tracking-wide sm:text-[11px]">
                Tiltak
              </div>
              <div className="min-w-[2.5rem] text-center text-[10.5px] font-semibold uppercase tracking-wide sm:text-[11px]">
                Pakke 1
              </div>
              <div className="min-w-[2.5rem] text-center text-[10.5px] font-semibold uppercase tracking-wide sm:text-[11px]">
                Pakke 1+2
              </div>
            </div>
            <Tiltak label="Nytt tak på alle blokker" p1 p2 />
            <Tiltak label="Nye fasader med bedre isolasjon" p1 p2 />
            <Tiltak
              label="Reparasjon av betongskader på verandaer og fasader"
              p1
              p2
            />
            <Tiltak label="Oppgradering av oppganger og kjellerdører" p1 p2 />
            <Tiltak label="Bergvarme — felles oppvarming fra bakken" p1={false} p2/>
            <Tiltak label="Solcelleanlegg på takene" p1={false} p2 />
            <Tiltak
              label={`Statsstøtte fra Enova (${(felles.enovaBekreftet / 1_000_000).toFixed(1)} MNOK bekreftet)`}
              p1={null}
              p2
              p2Label="Trukket fra"
            />
          </div>
        </div>
      </section>

      {/* Bergvarme + solceller */}
      <section className="card">
        <h2 className="display text-xl font-semibold text-ink sm:text-2xl">
          Bergvarme og solceller — teknisk forklaring
        </h2>
        <p className="mt-3 leading-relaxed text-ink/80">
          Bergvarme fungerer som en stor varmepumpe som henter energi fra
          bakken under blokkene. Bakken holder en konstant temperatur på ca.
          6–8 °C hele året. Varmepumpen bruker elektrisk kraft til å «løfte»
          denne energien opp til ønsket temperatur for oppvarming og
          varmtvann. Effektfaktoren (COP) er beregnet til 4–5 — det vil si at
          for hver kWh elektrisk kraft brukt, leveres 4–5 kWh varme.
        </p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <KeyStat
            label="Solcelleproduksjon"
            value={`${felles.solcelleProduksjonKWh.toLocaleString("nb-NO")} kWh / år`}
            sub="35,8 % av totalt forbruk"
          />
          <KeyStat
            label="Bergvarmens eget strømforbruk"
            value={`${felles.bergvarmeEgetForbrukKWh.toLocaleString("nb-NO")} kWh / år`}
            sub="erstatter direkte el-oppvarming"
          />
          <KeyStat
            label="Overskuddsstrøm sommer"
            value={`${felles.solcelleOverskuddSommerKWh.toLocaleString("nb-NO")} kWh / år`}
            sub="potensielt salg til Elvia"
          />
        </dl>

        <h3 className="display mt-7 text-lg font-semibold text-ink">
          Hva skjer i leiligheten?
        </h3>
        <p className="mt-2 leading-relaxed text-ink/80">
          Orebakken-leilighetene varmes i dag med elektriske panelovner. I
          forbindelse med bergvarmeanlegget legges <strong>helt nye rørføringer</strong>{" "}
          for vannbåren varme inn i hver leilighet, koblet til en ny felles
          varmesentral. Eksisterende panelovner erstattes — du får
          radiator/konvektor i stedet.
        </p>
        <div className="mt-5 rounded-2xl border-2 border-dashed border-line bg-surface/40 p-5 text-[14px] leading-relaxed text-muted">
          <div className="font-semibold text-ink">
            Bilder av planlagt rørføring kommer
          </div>
          <p className="mt-1.5">
            Detaljerte illustrasjoner av rørtraséer og plassering i leiligheten
            legges inn her før beslutningsunderlaget sendes ut 15. mai 2026.
          </p>
        </div>
      </section>

      {/* Enova-banner */}
      <section className="overflow-hidden rounded-3xl border border-save/30 bg-gradient-to-br from-save to-emerald-700 p-6 text-white shadow-card sm:p-8 lg:p-10">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 text-white sm:h-11 sm:w-11">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/70">
              Enova-støtte · innvilget april 2026
            </div>
            <h3 className="display mt-1 text-[22px] font-semibold leading-tight sm:text-2xl lg:text-3xl">
              {kr(felles.enovaBekreftet)} bekreftet
            </h3>
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-white/85 sm:text-[15px]">
              Enova ga endelig tilsagn på {kr(felles.enovaBekreftet)} til
              bergvarme og solceller i 4 av 13 blokker. Beløpet er allerede
              trukket fra lånebeløpet for Pakke 1+2. Styret søker for de
              resterende 9 blokkene innen mai 2026 — all støtte som innvilges,
              reduserer borettslagets lån.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="card">
        <h2 className="display text-xl font-semibold text-ink sm:text-2xl">
          Spørsmål og svar
        </h2>
        <div className="mt-5 divide-y divide-line/60">
          <Faq q="Hva om vi bare velger Pakke 1 og venter med energitiltakene?">
            Pakke 1 kan vedtas alene. Vedlikeholdet av tak, fasader og betong
            gjennomføres da som planlagt. Gjennomføring av bergvarme og
            solceller i et separat prosjekt på et senere tidspunkt vil medføre
            egne mobiliseringskostnader, ny anbudsrunde og nye
            prosjekteringskostnader. Når disse tiltakene gjennomføres samtidig
            med Pakke 1, deles en del av disse kostnadene mellom pakkene.
          </Faq>
          <Faq q="Hva er skattefradraget som er nevnt i tabellene?">
            Når borettslaget tar opp lån, betaler borettslaget renter. Disse
            rentekostnadene gir deg som andelseier rett til et{" "}
            <strong>skattefradrag på 22 %</strong> via skattemeldingen din (felt
            RF-1215). Det er ikke noe du trenger å gjøre aktivt — borettslaget
            rapporterer dette til Skatteetaten, og du ser det som en reduksjon
            i skatten din.
            <br />
            <br />
            Fradraget er størst de første årene (fordi renten er høyest da) og
            avtar gradvis. Tallene i tabellene bruker et gjennomsnitt over hele
            låneperioden, slik at du ser hva du realistisk kan forvente over
            tid.
          </Faq>
          <Faq q="Hva med de 9 blokkene som ikke har fått Enova-støtte ennå?">
            Styret har bestemt seg for å installere bergvarme og solceller i{" "}
            <strong>alle 13 blokker</strong>. Vi søker Enova om støtte for de
            resterende 9 blokkene i slutten av mai 2026. Basert på poengsummen
            vi fikk i de fire godkjente søknadene, er vi trygge på at vi vil få
            mer støtte. All tilleggsstøtte vi får, reduserer borettslagets lån
            — og dermed felleskostnadene for alle andelseiere.
          </Faq>
          <Faq q="Hva om renten stiger etter at vi tar opp lånet?">
            Borettslaget vil sannsynligvis ta opp lån med flytende rente. Det
            betyr at rentekostnaden kan endre seg over tid, akkurat som med et
            boliglån. Beregningene i dette dokumentet er basert på dagens
            rentenivå: 5,70 % for Pakke 1 og 5,20 % for Pakke 1+2 (grønt lån).
            <br />
            <br />
            Stiger renten, øker felleskostnadene noe. Faller renten, reduseres
            de. Styret vurderer fastrentelock for deler av lånet for å redusere
            risikoen.
          </Faq>
          <Faq q="Hva koster det å vente noen år?">
            Bygg- og materialpriser øker med om lag 4 % per år. Over tre år
            betyr det at det samme arbeidet koster rundt 12,5 % mer.
            <br />
            <br />
            For Pakke 1 alene (190 MNOK) betyr tre år med utsettelse en
            merkostnad på ca. 23,7 millioner kroner. For hele prosjektet (Pakke
            1+2, 366 MNOK) er merkostnaden ca. 45,7 millioner kroner. Det
            tilsvarer om lag 2 950 kr mer per andel per måned over
            låneperioden.
          </Faq>
          <Faq q="Hva betyr dette for verdien på leiligheten min?">
            Historisk sett har rehabiliteringsprosjekter i norske borettslag
            vist en engangseffekt på oppimot 20 % i økt andelsverdi etter
            ferdigstillelse. Orebakken har i dag et synlig vedlikeholdsetterslep,
            og markedet priser inn dette. Borettslag med god energistandard og
            nylig rehabiliterte bygninger tiltrekker seg kjøpere bedre enn
            borettslag der vedlikeholdet er utsatt.
          </Faq>
          <Faq q="Hva skjer hvis generalforsamlingen stemmer nei?">
            Da gjennomfører vi ingen rehabilitering nå. Bygningene fortsetter å
            bli eldre, og skadene på tak og betong fortsetter å forverres. Om
            noen år vil vi måtte kalle inn til en ny generalforsamling — men da
            vil kostnadene være høyere. Enova-tilsagnet vi allerede har fått
            (31,4 MNOK) er tidsbegrenset og kan falle bort hvis vi ikke
            gjennomfører prosjektet innen fristen.
          </Faq>
        </div>
      </section>

      {/* Framdrift */}
      <section className="card">
        <h2 className="display text-xl font-semibold text-ink sm:text-2xl">
          Framdriftsplan
        </h2>
        <div className="mt-5">
          <Timeline
            items={[
              { kind: "done", date: "2024–2026", text: "Tilstandskartlegging og tilbud innhentet · OBOS Prosjekt bistår" },
              { kind: "done", date: "April 2026", text: "Enova-støtte bekreftet: 31,4 MNOK · endelig tilsagn for 4 blokker" },
              { kind: "done", date: "Innen 10. mai", text: "Dialogmøte med beboere · lytte til bekymringer og spørsmål" },
              { kind: "key", date: "15. mai 2026", text: "Beslutningsunderlag sendes alle andelseiere" },
              { kind: "now", date: "Ca. 22. mai", text: "Open Office på Storstua · still spørsmål til styret" },
              { kind: "now", date: "Ca. 28. mai", text: "Open Office på Storstua · andre mulighet til å møte styret" },
              { kind: "key", date: "1. juni 2026", text: "Ekstraordinær generalforsamling · digital gjennomføring" },
              { kind: "now", date: "2.–4. juni 2026", text: "Elektronisk avstemning · stem i din egen tid" },
            ]}
          />
        </div>
      </section>

      <div className="rounded-3xl bg-paper p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-4">
          <Calendar size={20} className="text-brand" />
          <div className="flex-1">
            <div className="display text-xl font-semibold text-ink">
              Klar til å se dine egne tall?
            </div>
            <div className="text-sm text-muted">
              Skriv inn andelsnr eller leil.nr og se beregning for din leilighet.
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

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-brand" />
      <span>{children}</span>
    </li>
  );
}

function Pakke({
  tone,
  icon,
  tittel,
  flertall,
  children,
}: {
  tone: "brand" | "warm";
  icon: React.ReactNode;
  tittel: string;
  flertall: string;
  children: React.ReactNode;
}) {
  const stripe = tone === "brand" ? "pkg-stripe-1" : "pkg-stripe-2";
  const accentBg = tone === "brand" ? "bg-brand-50" : "bg-warm-bg";
  const accentText = tone === "brand" ? "text-brand" : "text-warm-deep";
  return (
    <div className="overflow-hidden rounded-2xl border border-line/70 bg-paper">
      <div className={`h-1 w-full ${stripe}`} />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${accentBg} ${accentText}`}
          >
            {icon}
          </div>
          <h3 className="display text-lg font-semibold text-ink">{tittel}</h3>
          <span className="chip !py-0.5 !px-2 text-[10.5px]">{flertall}</span>
        </div>
        <p className="mt-3 leading-relaxed text-ink/80">{children}</p>
      </div>
    </div>
  );
}

function Tiltak({
  label,
  p1,
  p2,
  p2Label,
}: {
  label: string;
  p1: boolean | null;
  p2: boolean;
  p2Label?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-line/50 px-3.5 py-3 last:border-b-0 sm:gap-4 sm:px-5 sm:py-3.5">
      <div className="min-w-0 text-[13px] text-ink/85 sm:text-[14px]">
        {label}
      </div>
      <Pill yes={p1 === true} no={p1 === false} />
      <Pill yes={p2 === true} no={p2 === false} label={p2Label} />
    </div>
  );
}

function Pill({
  yes,
  no,
  label,
}: {
  yes?: boolean;
  no?: boolean;
  label?: string;
}) {
  if (no) {
    return (
      <span className="inline-flex h-6 min-w-[2.5rem] items-center justify-center rounded-full bg-line/60 px-2.5 text-[11px] font-semibold text-muted">
        Nei
      </span>
    );
  }
  if (yes) {
    return (
      <span className="inline-flex h-6 min-w-[2.5rem] items-center justify-center rounded-full bg-save-bg px-2.5 text-[11px] font-semibold text-save">
        {label ?? "Ja"}
      </span>
    );
  }
  return <span className="text-[12px] text-muted">—</span>;
}

function KeyStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-line/70 bg-surface/40 p-4">
      <div className="label">{label}</div>
      <div className="num mt-1.5 text-[18px] font-semibold text-ink">{value}</div>
      {sub && <div className="mt-1 text-[12px] text-muted">{sub}</div>}
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold text-ink hover:text-brand"
      >
        <span>{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5 pr-7 text-[14.5px] leading-relaxed text-ink/80">
          {children}
        </div>
      )}
    </div>
  );
}

function Timeline({
  items,
}: {
  items: { kind: "done" | "key" | "now"; date: string; text: string }[];
}) {
  return (
    <ol className="relative ml-3 space-y-4 border-l-2 border-line pl-6">
      {items.map((it, i) => {
        const dotCls =
          it.kind === "done"
            ? "bg-save text-white"
            : it.kind === "key"
            ? "bg-warm text-white"
            : "bg-brand text-white";
        return (
          <li key={i} className="relative">
            <span
              className={`absolute -left-[33px] top-0.5 grid h-5 w-5 place-items-center rounded-full ${dotCls}`}
            >
              {it.kind === "done" ? <Check size={12} /> : (
                <span className="text-[9px] font-bold">●</span>
              )}
            </span>
            <div className="display text-[15px] font-semibold text-ink">
              {it.text}
            </div>
            <div className="text-[12.5px] text-muted">{it.date}</div>
          </li>
        );
      })}
    </ol>
  );
}
