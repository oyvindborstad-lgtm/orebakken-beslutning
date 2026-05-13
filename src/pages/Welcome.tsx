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
import { FORUTSETNINGER } from "../data/forutsetninger";

const { pakke1, pakke2, pakke3, felles } = FORUTSETNINGER;

export default function Welcome() {
  return (
    <div className="space-y-12 sm:space-y-14 lg:space-y-16">
      {/* Hero */}
      <section className="relative -mx-4 overflow-hidden px-4 py-1 sm:-mx-6 sm:px-6 sm:py-3 lg:-mx-8 lg:px-8 lg:py-4">
        <div className="absolute inset-0 bg-hero-fade" aria-hidden />
        <div className="relative">
          <div className="chip">
            <Calendar size={12} />
            Ekstraordinær generalforsamling 1. juni 2026
          </div>
          <h1 className="display mt-5 max-w-3xl text-[32px] font-semibold leading-[1.05] tracking-tightest text-ink sm:text-[44px] lg:text-[58px]">
            Hva betyr rehabiliteringen for{" "}
            <span className="text-brand">akkurat din leilighet?</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/70 sm:text-[16.5px] lg:text-[17px]">
            Du skal stemme over om Orebakken BRL skal rehabilitere bygningene
            fra 1971–1974, og hvilken løsning vi velger. Dette verktøyet viser
            tallene som er beregnet for din andel — ny felleskostnad,
            strømbesparelse, skattefradrag og netto endring per måned.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/finn" className="btn-primary">
              Finn min leilighet <ArrowRight size={18} />
            </Link>
            <a href="#pakkene" className="btn-ghost">
              Sammenlign pakkene
            </a>
          </div>

          <div className="mt-9 grid max-w-4xl gap-3 sm:gap-4 md:grid-cols-2">
            <PakkeIntro
              tone="brand"
              icon={<Hammer size={16} />}
              navn="Pakke 1"
              tittel="Tak, fasader og betong"
              tekst="Nye tak på alle 13 blokker, fasader med forbedret isolasjon, reparasjon av betongskader på verandaer og fasader, og oppgradering av oppganger og kjellerdører."
            />
            <PakkeIntro
              tone="warm"
              icon={<Sun size={16} />}
              navn="Pakke 1+2"
              tittel="Pakke 1 + bergvarme og solceller"
              tekst="Alt i Pakke 1, pluss bergvarmeanlegg som felles oppvarming fra bakken og solcelleanlegg på takene i alle 13 blokker. Erstatter dagens elektriske panelovner."
            />
          </div>

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-y-5 gap-x-4 sm:grid-cols-4 sm:gap-y-6 lg:mt-12">
            <Metric label="Andelseiere" value="430" />
            <Metric label="Boligblokker" value="13" />
            <Metric label="Bekreftet Enova-støtte" value="31,4 mill" sub="kr · 4 av 13 blokker" />
            <Metric label="Avstemning" value="1. juni" sub="2026 · digital GF" />
          </dl>
        </div>
      </section>

      {/* Snittall */}
      <section className="space-y-5">
        <div>
          <div className="label">Vektet snitt for alle 430 andeler</div>
          <h2 className="display mt-2 text-[24px] font-semibold leading-tight text-ink sm:text-[28px] lg:text-[34px]">
            Felleskostnaden — i tall
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          <SnittKort
            id="p1"
            stripe="pkg-stripe-1"
            kostBrutto={pakke1.bruttoSnittKrMnd}
            kostNetto={pakke1.nettoSnittKrMnd}
            stromBesp={pakke1.stromBespSnittKrMnd}
            skfr={pakke1.skattefradragSnittKrMnd}
          />
          <SnittKort
            id="p2"
            stripe="pkg-stripe-2"
            kostBrutto={pakke2.bruttoSnittKrMnd}
            kostNetto={pakke2.nettoSnittKrMnd}
            stromBesp={pakke2.stromBespSnittKrMnd - pakke2.solenergiSnittKrMnd}
            solenergi={pakke2.solenergiSnittKrMnd}
            skfr={pakke2.skattefradragSnittKrMnd}
          />
          <SnittKort
            id="p3"
            stripe="pkg-stripe-3"
            kostBrutto={pakke3.bruttoSnittKrMnd}
            kostNetto={pakke3.nettoSnittKrMnd}
            stromBesp={pakke3.stromBespSnittKrMnd - pakke3.solenergiSnittKrMnd}
            solenergi={pakke3.solenergiSnittKrMnd}
            skfr={pakke3.skattefradragSnittKrMnd}
          />
        </div>

        <DiffBox />
      </section>

      {/* Pakke-kort */}
      <section id="pakkene" className="space-y-5 sm:space-y-6">
        <div>
          <div className="label">Tre alternativer</div>
          <h2 className="display mt-2 text-[24px] font-semibold leading-tight text-ink sm:text-[28px] lg:text-[34px]">
            Alt 1, Alt 2 eller Alt 3
          </h2>
          <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-muted sm:text-[15px]">
            Alt 1 (tak/fasader/betong) kan vedtas alene. Alt 2 og Alt 3 inkluderer
            i tillegg bergvarme og solceller. Forskjellen mellom Alt 2 og Alt 3
            er hvor mye ENØK-støtte Enova innvilger: Alt 2 (31 mill, bekreftet) /
            Alt 3 (60 mill, mulig ved utvidet tilsagn). Alle Pakke 1+2-varianter
            krever 2/3-flertall.
          </p>
        </div>
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          <PackageCard id="p1" />
          <PackageCard id="p2" />
          <PackageCard id="p3" />
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
              Enova ga i april 2026 endelig tilsagn på{" "}
              {kr(felles.enovaBekreftet)} til bergvarme og solceller i 4 av 13
              blokker. Beløpet er allerede trukket fra lånebeløpet for
              Pakke 1+2. Styret søker for de resterende 9 blokkene innen mai
              2026 — all støtte som innvilges, reduserer borettslagets lån.
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
              skattefradraget? Den tekniske og praktiske bakgrunnen for
              beslutningen.
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
              Detaljert oversikt over investering, energibesparelse, Enova-scenarier,
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
        <div
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${accentBg} ${accentText}`}
        >
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
  id: "p1" | "p2" | "p3";
  stripe: string;
  kostBrutto: number;
  kostNetto: number;
  stromBesp: number;
  solenergi?: number;
  skfr: number;
}) {
  const navn = id === "p1" ? "Alt 1" : id === "p2" ? "Alt 2" : "Alt 3";
  const flertall = id === "p1" ? "50 % flertall" : "2/3 flertall";
  const accentClass =
    id === "p1" ? "text-brand" : id === "p2" ? "text-warm-deep" : "text-save";
  return (
    <article className="relative overflow-hidden rounded-3xl border border-line/70 bg-paper shadow-card">
      <div className={`h-1.5 w-full ${stripe}`} />
      <div className="p-5 sm:p-7 lg:p-8">
        <div className="flex items-center justify-between gap-3">
          <div className="label">{navn} · vektet snitt</div>
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
            <Reduksjon label="Solenergi (dekker felleskost.)" value={-solenergi} kind="sun" />
          )}
          <Reduksjon label="Skattefradrag (22 %)" value={-skfr} kind="tax" />
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

function DiffBox() {
  return (
    <div className="rounded-3xl border-l-4 border-brand bg-paper p-5 shadow-soft sm:p-7">
      <div className="display text-base font-semibold text-ink sm:text-lg">
        Sammenligning av Alt 1, Alt 2 og Alt 3
      </div>
      <div className="mt-4 grid gap-3 sm:gap-4 lg:grid-cols-2">
        <DiffRow3
          label="Bruttoøkning FK / mnd"
          a1="+1 130 kr"
          a2="+2 771 kr"
          a3="+2 441 kr"
        />
        <DiffRow3
          label="Strømbesparelse + solenergi"
          a1="−116 kr"
          a2="−946 kr"
          a3="−946 kr"
          tone="save"
        />
        <DiffRow3
          label="Skattefradrag (22 %)"
          a1="−240 kr"
          a2="−319 kr"
          a3="−292 kr"
          tone="tax"
        />
        <DiffRow3
          label="Netto FK-økning"
          a1="+774 kr"
          a2="+1 506 kr"
          a3="+1 203 kr"
          bold
        />
      </div>
      <p className="mt-4 text-[12.5px] leading-relaxed text-muted sm:text-[13px]">
        <strong>Alt 1:</strong> bare tak/fasader/betong, krever 50 % flertall.
        Lånebeløp 176 mill kr.
        <br />
        <strong>Alt 2:</strong> alt i Alt 1 pluss bergvarme og solceller, med
        31 mill kr i Enova-støtte. Lånebeløp 341,7 mill kr. Krever 2/3-flertall.
        <br />
        <strong>Alt 3:</strong> samme investering som Alt 2, men med 60 mill kr
        i Enova-støtte. Lånebeløp 313 mill kr. Krever 2/3-flertall.
        <br />
        Marginal merkostnad: Alt 2 vs Alt 1 = +732 kr/mnd. Alt 3 vs Alt 1 =
        +429 kr/mnd. Snitt for alle 430 andeler, basert på OBOS Banken
        likviditetsanalyse 13.05.2026.
      </p>
    </div>
  );
}

function DiffRow3({
  label,
  a1,
  a2,
  a3,
  tone,
  bold,
}: {
  label: string;
  a1: string;
  a2: string;
  a3: string;
  tone?: "save" | "tax";
  bold?: boolean;
}) {
  const cls =
    tone === "save"
      ? "text-save"
      : tone === "tax"
      ? "text-tax-ink"
      : bold
      ? "text-ink"
      : "text-ink";
  return (
    <div className="rounded-xl border border-line/60 bg-surface/40 p-3.5 sm:p-4">
      <div className="label">{label}</div>
      <div className="mt-2.5 grid grid-cols-3 gap-1 text-[12.5px] sm:text-[13px]">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted">Alt 1</div>
          <div className={`num ${bold ? "font-bold" : "font-semibold"} ${cls}`}>{a1}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted">Alt 2</div>
          <div className={`num ${bold ? "font-bold" : "font-semibold"} ${cls}`}>{a2}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted">Alt 3</div>
          <div className={`num ${bold ? "font-bold" : "font-semibold"} ${cls}`}>{a3}</div>
        </div>
      </div>
    </div>
  );
}
