import { Link } from "wouter";
import {
  ArrowRight,
  Sparkles,
  FileText,
  Zap,
  Calendar,
  Hammer,
  Sun,
} from "lucide-react";
import PackageCard from "../components/PackageCard";
import { kr, krSigned } from "../lib/format";
import { FORUTSETNINGER, RENTEBANER } from "../data/forutsetninger";

const { pakke1, pakke2, felles } = FORUTSETNINGER;

export default function Welcome() {
  return (
    <div className="space-y-12 sm:space-y-14 lg:space-y-16">
      {/* Hero */}
      <section className="relative -mx-4 overflow-hidden px-4 py-1 sm:-mx-6 sm:px-6 sm:py-3 lg:-mx-8 lg:px-8 lg:py-4">
        <div className="absolute inset-0 bg-hero-fade" aria-hidden />
        <div className="relative">
          <div className="chip">
            <Calendar size={12} />
            Ekstraordinær generalforsamling 15. juni 2026 · Persbråten vgs
          </div>
          <h1 className="display mt-5 max-w-3xl text-[32px] font-semibold leading-[1.05] tracking-tightest text-ink sm:text-[44px] lg:text-[58px]">
            Hva betyr rehabiliteringen for{" "}
            <span className="text-brand">akkurat din leilighet?</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/70 sm:text-[16.5px] lg:text-[17px]">
            På den ekstraordinære generalforsamlingen 15. juni 2026 skal
            andelseierne stemme over <strong>Pakke 1 — nødvendig
            vedlikehold</strong> av borettslaget bygget i 1972. Pakke 2
            (bergvarme og solceller) avgjøres på egen GF i slutten av
            august/start september 2026 — når Enova-svaret er klart.
            Verktøyet viser tallene per andel og tre rentebaner
            (5,04 / 5,54 / 6,04 %).
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/finn" className="btn-primary">
              Finn min leilighet <ArrowRight size={18} />
            </Link>
            <a href="#pakkene" className="btn-ghost">
              Sammenlign pakkene
            </a>
          </div>

          <div className="mt-6 max-w-3xl rounded-2xl border-l-4 border-warm bg-warm-bg/50 px-5 py-4 text-[13.5px] leading-relaxed text-ink/80 sm:text-[14px]">
            <strong>Dette er et hjelpemiddel.</strong> Verktøyet er laget for
            å hjelpe deg å forstå helheten i prosjektet og hva det betyr for
            din andel. Det offisielle beslutningsunderlaget til
            generalforsamlingen (innkalling, vedlegg og OBOS Bankens
            likviditetsanalyse) er det som gjelder — les alltid dette i tillegg
            for helhetskonteksten før du tar stilling.
          </div>

          <div className="mt-9 grid max-w-4xl gap-3 sm:gap-4 md:grid-cols-2">
            <PakkeIntro
              tone="brand"
              icon={<Hammer size={16} />}
              navn="Pakke 1 · vedtas 15. juni"
              tittel="Nødvendig vedlikehold"
              tekst="Nye tak på alle 13 blokker (~8 400 m²), nye vinduer og balkongdører (U=0,80) i 430 leiligheter, etterisolering av veggfelt, betongrehabilitering, oppussing av oppganger, nye inngangs- og kjellerdører, rens av ventilasjon og reparasjon av garasjehus. Prosjektkostnad 192 mill (lån 190 mill etter Enova 2 mill). Vanlig flertall (50 %)."
            />
            <PakkeIntro
              tone="warm"
              icon={<Sun size={16} />}
              navn="Pakke 2 · egen GF aug/sept"
              tittel="Bergvarme og solceller"
              tekst="Bygger oppå Pakke 1: bergvarmeanlegg, varmtvannssentraler, radiatorer og solcelleanlegg på takene i alle 13 blokker. Sparer ca 3,7 mill kWh/år (mot 0,5 mill for Pakke 1). Lån 341,7 mill (308 mill med full Enova-pott). Krever 2/3 flertall — egen GF når Enova-svaret kommer."
            />
          </div>

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-y-5 gap-x-4 sm:grid-cols-4 sm:gap-y-6 lg:mt-12">
            <Metric label="Andelseiere" value="430" />
            <Metric label="Boligblokker" value="13" />
            <Metric label="Bekreftet Enova-støtte" value="31,4 mill" sub="kr · 4 av 13 blokker" />
            <Metric label="Avstemning Pakke 1" value="15. juni" sub="2026 · Persbråten vgs" />
          </dl>
        </div>
      </section>

      {/* Snittall */}
      <section className="space-y-5">
        <div>
          <div className="label">Vektet snitt for alle 430 andeler — hovedscenario 5,04 %</div>
          <h2 className="display mt-2 text-[24px] font-semibold leading-tight text-ink sm:text-[28px] lg:text-[34px]">
            Felleskostnaden — i tall
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          <SnittKort
            id="p1"
            stripe="pkg-stripe-1"
            kostBrutto={pakke1.rentebaner.r1.bruttoSnittKrMnd}
            kostNetto={pakke1.rentebaner.r1.nettoSnittKrMnd}
            stromBesp={pakke1.rentebaner.r1.stromBespSnittKrMnd}
            skfr={pakke1.rentebaner.r1.skattefradragSnittKrMnd}
          />
          <SnittKort
            id="p2"
            stripe="pkg-stripe-2"
            kostBrutto={pakke2.rentebaner.r1.bruttoSnittKrMnd}
            kostNetto={pakke2.rentebaner.r1.nettoSnittKrMnd}
            stromBesp={pakke2.rentebaner.r1.stromBespSnittKrMnd}
            solenergi={pakke2.rentebaner.r1.solenergiSnittKrMnd}
            skfr={pakke2.rentebaner.r1.skattefradragSnittKrMnd}
          />
        </div>

        <DiffBox />
      </section>

      {/* Pakke-kort */}
      <section id="pakkene" className="space-y-5 sm:space-y-6">
        <div>
          <div className="label">To pakker — to generalforsamlinger</div>
          <h2 className="display mt-2 text-[24px] font-semibold leading-tight text-ink sm:text-[28px] lg:text-[34px]">
            Pakke 1 nå (15. juni) — Pakke 2 senere
          </h2>
          <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-muted sm:text-[15px]">
            <strong>Pakke 1</strong> (nødvendig vedlikehold) vedtas på den
            ekstraordinære generalforsamlingen 15. juni 2026 — vanlig flertall
            (50 %). <strong>Pakke 2</strong> (bergvarme og solceller) bygger
            oppå Pakke 1 og avgjøres på en egen generalforsamling i slutten
            av august eller start september 2026 når Enova-svaret er klart —
            krever 2/3 flertall. Begge pakker finansieres som grønt lån.
            Rente i hovedscenarioet er 5,04 %; tabellen viser også 5,54 % og
            6,04 %.
          </p>
        </div>
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          <PackageCard id="p1" />
          <PackageCard id="p2" />
        </div>
      </section>

      {/* Enova banner */}
      <section className="overflow-hidden rounded-3xl border border-save/30 bg-gradient-to-br from-save to-emerald-700 p-6 text-white shadow-card sm:p-8 lg:p-10">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 text-white sm:h-11 sm:w-11">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/70">
              Enova-støtte
            </div>
            <h3 className="display mt-1 text-[22px] font-semibold leading-tight sm:text-2xl lg:text-3xl">
              {kr(felles.enovaBekreftet)} bekreftet
            </h3>
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-white/85 sm:text-[15px]">
              Enova ga endelig tilsagn på {kr(felles.enovaBekreftet)} til
              bergvarme og solceller i 4 av 13 blokker. Styret søker for de
              resterende 9 blokkene — forventet svar slutten av juni 2026 kan
              gi ytterligere {kr(felles.enovaForventetTillegg)} (Pakke 2-lån
              ned til 307,9 mill).
            </p>
          </div>
        </div>
      </section>

      {/* Ressurslenker */}
      <section className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <Link
          href="/bakgrunn"
          className="group card flex items-start gap-3 transition hover:border-brand/40 hover:shadow-card sm:gap-4"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand sm:h-11 sm:w-11">
            <FileText size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="label">For alle andelseiere</div>
            <h3 className="display mt-1 text-lg font-semibold text-ink sm:text-xl">
              Bakgrunn og ofte stilte spørsmål
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted sm:text-[14px]">
              Hvorfor må vi gjøre noe nå? Hva er bergvarme? Hva betyr
              skattefradraget?
            </p>
          </div>
          <ArrowRight size={18} className="mt-1 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand" />
        </Link>
        <Link
          href="/grunnlag"
          className="group card flex items-start gap-3 transition hover:border-brand/40 hover:shadow-card sm:gap-4"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand sm:h-11 sm:w-11">
            <Zap size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="label">Fullstendig underlag</div>
            <h3 className="display mt-1 text-lg font-semibold text-ink sm:text-xl">
              Investeringsoversikt og forutsetninger
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted sm:text-[14px]">
              Detaljert oversikt over investering, energibesparelse, Enova,
              kostnadsvekst ved utsettelse og styrets vurdering.
            </p>
          </div>
          <ArrowRight size={18} className="mt-1 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand" />
        </Link>
      </section>
    </div>
  );
}

function PakkeIntro({
  tone,
  icon,
  navn,
  tittel,
  tekst,
}: {
  tone: "brand" | "warm";
  icon: React.ReactNode;
  navn: string;
  tittel: string;
  tekst: string;
}) {
  const stripe = tone === "brand" ? "pkg-stripe-1" : "pkg-stripe-2";
  const accentBg = tone === "brand" ? "bg-brand-50" : "bg-warm-bg";
  const accentText = tone === "brand" ? "text-brand" : "text-warm-deep";
  return (
    <div className="overflow-hidden rounded-2xl border border-line/70 bg-paper/90 backdrop-blur shadow-soft">
      <div className={`h-1 w-full ${stripe}`} />
      <div className="flex gap-3 p-4 sm:p-5">
        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${accentBg} ${accentText}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="label">{navn}</span>
            <span className="display text-[15px] font-semibold leading-tight text-ink sm:text-base">
              {tittel}
            </span>
          </div>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/75 sm:text-[14px]">
            {tekst}
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="num mt-1 text-[22px] font-semibold tracking-tight text-ink sm:text-2xl lg:text-3xl">
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[11px] text-muted sm:text-xs">{sub}</div>}
    </div>
  );
}

function SnittKort({
  id,
  stripe,
  kostBrutto,
  kostNetto,
  stromBesp,
  solenergi,
  skfr,
}: {
  id: "p1" | "p2";
  stripe: string;
  kostBrutto: number;
  kostNetto: number;
  stromBesp: number;
  solenergi?: number;
  skfr: number;
}) {
  const navn = id === "p1" ? "Pakke 1" : "Pakke 2";
  const flertall = id === "p1" ? "50 % flertall" : "2/3 flertall";
  const accentClass = id === "p1" ? "text-brand" : "text-warm-deep";
  return (
    <article className="relative overflow-hidden rounded-3xl border border-line/70 bg-paper shadow-card">
      <div className={`h-1.5 w-full ${stripe}`} />
      <div className="p-5 sm:p-7 lg:p-8">
        <div className="flex items-center justify-between gap-3">
          <div className="label">{navn} · vektet snitt · 5,04 %</div>
          <span className="chip !py-0.5 !px-2 text-[10.5px]">{flertall}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-6">
          <div>
            <div className="label">Brutto økning</div>
            <div className="num mt-1.5 display text-[30px] font-semibold leading-[1] tracking-tightest text-ink sm:text-[40px]">
              {krSigned(kostBrutto)}
            </div>
            <div className="mt-1 text-[11px] text-muted">/ mnd</div>
          </div>
          <div>
            <div className="label">Netto økning</div>
            <div className={`num mt-1.5 display text-[30px] font-semibold leading-[1] tracking-tightest sm:text-[40px] ${accentClass}`}>
              {krSigned(kostNetto)}
            </div>
            <div className="mt-1 text-[11px] text-muted">/ mnd · etter fradrag</div>
          </div>
        </div>
        <div className="mt-5 space-y-2 rounded-xl bg-surface/60 p-3.5 text-[13px] sm:mt-6 sm:p-4 sm:text-sm">
          <Reduksjon label="Strømbesparelse oppvarming" value={-stromBesp} kind="save" />
          {solenergi !== undefined && solenergi > 0 && (
            <Reduksjon label="Solenergi (areal-fordelt)" value={-solenergi} kind="sun" />
          )}
          <Reduksjon label="Skattefradrag (22 %, snitt)" value={-skfr} kind="tax" />
        </div>
      </div>
    </article>
  );
}

function Reduksjon({
  label,
  value,
  kind,
}: {
  label: string;
  value: number;
  kind: "save" | "tax" | "sun";
}) {
  const cls =
    kind === "save"
      ? "text-save"
      : kind === "sun"
      ? "text-warm-deep"
      : "text-tax-ink";
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink/75">{label}</span>
      <span className={`num font-semibold ${cls}`}>{krSigned(value)}</span>
    </div>
  );
}

/** 2 pakker × 3 rentebaner = 6 søyler */
function DiffBox() {
  return (
    <div className="rounded-3xl border-l-4 border-brand bg-paper p-5 shadow-soft sm:p-7">
      <div className="display text-base font-semibold text-ink sm:text-lg">
        Pakke 1 og Pakke 2 ved tre rentebaner
      </div>
      <p className="mt-1 text-[13px] text-muted sm:text-[13.5px]">
        Snitt for alle 430 andeler. Brutto er ren FK-økning fra OBOS-banken;
        netto trekker fra strømbesparelse, solenergi og snitt-skattefradrag.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <PakkeBox tone="brand" navn="Pakke 1 · 190 mill · 30 år" pakke={pakke1} />
        <PakkeBox tone="warm" navn="Pakke 2 · 341,7 mill · 40 år" pakke={pakke2} />
      </div>

      <div className="mt-4 rounded-2xl border border-save/30 bg-save-bg/40 p-4 text-[13px] leading-relaxed text-ink/85 sm:text-[13.5px]">
        <strong>Forventet tilleggsstøtte Enova:</strong> Hvis Enova innvilger
        søknad for de 9 resterende blokkene (svar slutten av juni 2026), kan
        Pakke 2-lånet reduseres med {kr(felles.enovaForventetTillegg)} —
        til 307,9 mill. Det reduserer netto FK-økning for Pakke 2 fra +1 577
        kr/mnd snitt til ca. +1 245 kr/mnd snitt (ved 5,04 %).
      </div>
    </div>
  );
}

function PakkeBox({
  tone,
  navn,
  pakke,
}: {
  tone: "brand" | "warm";
  navn: string;
  pakke: typeof pakke1 | typeof pakke2;
}) {
  const accentBg = tone === "brand" ? "bg-brand-50" : "bg-warm-bg";
  const accentText = tone === "brand" ? "text-brand" : "text-warm-deep";
  return (
    <div className={`rounded-2xl ${accentBg} p-4 sm:p-5`}>
      <div className={`label ${accentText}`}>{navn}</div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[320px] text-[12.5px] sm:text-[13px]">
          <thead>
            <tr className="text-muted">
              <th className="text-left font-medium pr-2 pb-1.5">Rente</th>
              {RENTEBANER.map((rb) => (
                <th key={rb.id} className="text-right font-medium pb-1.5 num">
                  {rb.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="num">
            <Tr label="Brutto FK-økning" cells={(["r1", "r2", "r3"] as const).map((r) => krSigned(pakke.rentebaner[r].bruttoSnittKrMnd))} />
            <Tr label="Strøm-besparelse" cells={(["r1", "r2", "r3"] as const).map((r) => krSigned(-pakke.rentebaner[r].stromBespSnittKrMnd))} tone="save" />
            {"solenergiSnittKrMnd" in pakke.rentebaner.r1 && (
              <Tr label="Solenergi" cells={(["r1", "r2", "r3"] as const).map((r) => {
                const v = (pakke.rentebaner[r] as { solenergiSnittKrMnd?: number }).solenergiSnittKrMnd ?? 0;
                return krSigned(-v);
              })} tone="sun" />
            )}
            <Tr label="Skattefradrag (snitt)" cells={(["r1", "r2", "r3"] as const).map((r) => krSigned(-pakke.rentebaner[r].skattefradragSnittKrMnd))} tone="tax" />
            <Tr label="Netto FK-økning" cells={(["r1", "r2", "r3"] as const).map((r) => krSigned(pakke.rentebaner[r].nettoSnittKrMnd))} bold />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Tr({
  label,
  cells,
  tone,
  bold,
}: {
  label: string;
  cells: string[];
  tone?: "save" | "tax" | "sun";
  bold?: boolean;
}) {
  const cls =
    tone === "save"
      ? "text-save"
      : tone === "sun"
      ? "text-warm-deep"
      : tone === "tax"
      ? "text-tax-ink"
      : "text-ink";
  return (
    <tr className="border-t border-line/40">
      <td className="py-1.5 pr-2 text-ink/80">{label}</td>
      {cells.map((c, i) => (
        <td key={i} className={`py-1.5 text-right ${cls} ${bold ? "font-bold" : "font-semibold"}`}>
          {c}
        </td>
      ))}
    </tr>
  );
}
