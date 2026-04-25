import { Link } from "wouter";
import { ArrowRight, Sparkles, FileText, Zap, Calendar } from "lucide-react";
import PackageCard from "../components/PackageCard";
import { kr, krSigned } from "../lib/format";
import { FORUTSETNINGER } from "../data/forutsetninger";

const { pakke1, pakke2, felles } = FORUTSETNINGER;

export default function Welcome() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative -mx-5 overflow-hidden px-5 py-2 sm:-mx-8 sm:px-8 sm:py-4">
        <div className="absolute inset-0 bg-hero-fade" aria-hidden />
        <div className="relative">
          <div className="chip">
            <Calendar size={12} />
            Ekstraordinær generalforsamling 1. juni 2026
          </div>
          <h1 className="display mt-5 max-w-3xl text-[40px] font-semibold leading-[1.05] tracking-tightest text-ink sm:text-[58px]">
            Hva betyr rehabiliteringen for{" "}
            <span className="text-brand">akkurat din leilighet?</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink/70">
            Du skal stemme over om Orebakken BRL skal rehabilitere bygningene
            fra 1971–1974, og hvilken løsning vi velger. Dette verktøyet viser
            tallene som er beregnet for din andel — ny felleskostnad,
            strømbesparelse, skattefradrag og netto endring per måned.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/finn" className="btn-primary">
              Finn min leilighet <ArrowRight size={18} />
            </Link>
            <a href="#pakkene" className="btn-ghost">
              Sammenlign pakkene
            </a>
          </div>

          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-y-6 sm:grid-cols-4">
            <Metric label="Andelseiere" value="430" />
            <Metric label="Boligblokker" value="13" />
            <Metric label="Bekreftet Enova-støtte" value="31,4 mill" sub="kr · 4 av 13 blokker" />
            <Metric label="Avstemning" value="1. juni" sub="2026 · digital GF" />
          </dl>
        </div>
      </section>

      {/* Snittall — beslutningsunderlag-stil */}
      <section className="space-y-5">
        <div>
          <div className="label">Vektet snitt for alle 430 andeler</div>
          <h2 className="display mt-2 text-[28px] font-semibold leading-tight text-ink sm:text-[34px]">
            Felleskostnaden — i tall
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
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
            stromBesp={pakke2.stromBespSnittKrMnd}
            skfr={pakke2.skattefradragSnittKrMnd}
          />
        </div>

        <DiffBox />
      </section>

      {/* Pakke-kort */}
      <section id="pakkene" className="space-y-6">
        <div>
          <div className="label">To alternativer</div>
          <h2 className="display mt-2 text-[28px] font-semibold leading-tight text-ink sm:text-[34px]">
            Pakke 1 eller Pakke 1+2
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
            Pakke 1 kan vedtas alene. Pakke 2 (bergvarme + solceller) krever
            kvalifisert 2/3-flertall og forutsetter at Pakke 1 vedtas.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <PackageCard id="p1" />
          <PackageCard id="p2" />
        </div>
      </section>

      {/* Enova banner */}
      <section className="overflow-hidden rounded-3xl border border-save/30 bg-gradient-to-br from-save to-emerald-700 p-8 text-white shadow-card sm:p-10">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
              Enova-støtte
            </div>
            <h3 className="display mt-1 text-2xl font-semibold sm:text-3xl">
              {kr(felles.enovaBekreftet)} bekreftet
            </h3>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-white/85">
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
      <section className="grid gap-5 lg:grid-cols-2">
        <Link
          href="/bakgrunn"
          className="group card flex items-start gap-4 transition hover:border-brand/40 hover:shadow-card"
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
            <FileText size={20} />
          </div>
          <div className="flex-1">
            <div className="label">For alle andelseiere</div>
            <h3 className="display mt-1 text-xl font-semibold text-ink">
              Bakgrunn og ofte stilte spørsmål
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Hvorfor må vi gjøre noe nå? Hva er bergvarme? Hva betyr
              skattefradraget? Den tekniske og praktiske bakgrunnen for
              beslutningen.
            </p>
          </div>
          <ArrowRight size={18} className="mt-1 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand" />
        </Link>
        <Link
          href="/grunnlag"
          className="group card flex items-start gap-4 transition hover:border-brand/40 hover:shadow-card"
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
            <Zap size={20} />
          </div>
          <div className="flex-1">
            <div className="label">Fullstendig underlag</div>
            <h3 className="display mt-1 text-xl font-semibold text-ink">
              Investeringsoversikt og forutsetninger
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Detaljert oversikt over investering, energibesparelse, Enova-scenarier,
              kostnadsvekst ved utsettelse og styrets vurdering.
            </p>
          </div>
          <ArrowRight size={18} className="mt-1 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand" />
        </Link>
      </section>
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
      <div className="num mt-1.5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

function SnittKort({
  id,
  stripe,
  kostBrutto,
  kostNetto,
  stromBesp,
  skfr,
}: {
  id: "p1" | "p2";
  stripe: string;
  kostBrutto: number;
  kostNetto: number;
  stromBesp: number;
  skfr: number;
}) {
  const navn = id === "p1" ? "Pakke 1" : "Pakke 1+2";
  const flertall = id === "p1" ? "50 % flertall" : "2/3 flertall";
  return (
    <article className="relative overflow-hidden rounded-3xl border border-line/70 bg-paper shadow-card">
      <div className={`h-1.5 w-full ${stripe}`} />
      <div className="p-7 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div className="label">{navn} · vektet snitt</div>
          <span className="chip !py-0.5 !px-2 text-[10.5px]">{flertall}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-6">
          <div>
            <div className="label">Brutto økning</div>
            <div className="num mt-1.5 display text-[40px] font-semibold leading-[1] tracking-tightest text-ink">
              {krSigned(kostBrutto)}
            </div>
            <div className="mt-1 text-xs text-muted">/ mnd</div>
          </div>
          <div>
            <div className="label">Netto økning</div>
            <div className={`num mt-1.5 display text-[40px] font-semibold leading-[1] tracking-tightest ${id === "p1" ? "text-brand" : "text-warm-deep"}`}>
              {krSigned(kostNetto)}
            </div>
            <div className="mt-1 text-xs text-muted">/ mnd · etter fradrag</div>
          </div>
        </div>
        <div className="mt-6 space-y-2 rounded-xl bg-surface/60 p-4 text-sm">
          <Reduksjon label="Strømbesparelse" value={-stromBesp} kind="save" />
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
  kind: "save" | "tax";
}) {
  const cls = kind === "save" ? "text-save" : "text-tax-ink";
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink/75">{label}</span>
      <span className={`num font-semibold ${cls}`}>{krSigned(value)}</span>
    </div>
  );
}

function DiffBox() {
  return (
    <div className="rounded-3xl border-l-4 border-brand bg-paper p-6 shadow-soft sm:p-7">
      <div className="display text-lg font-semibold text-ink">
        Hva er forskjellen mellom Pakke 1 og Pakke 1+2?
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <DiffRow
          label="Netto FK-økning"
          p1="+624 kr/mnd"
          p2="+1 119 kr/mnd"
          diff="+495 kr/mnd"
        />
        <DiffRow
          label="Ekstra strømbesparelse"
          p1="116 kr/mnd"
          p2="866 kr/mnd"
          diff="−750 kr/mnd"
          diffSave
        />
        <DiffRow
          label="Netto inkl. ekstra strøm"
          p1="—"
          p2="—"
          diff="−255 kr/mnd"
          diffSave
          bold
        />
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        Ekstra strømbesparelse fra bergvarme og solceller (750 kr/mnd) er større
        enn merkostnaden ved Pakke 1+2 (495 kr/mnd) — i favør P1+2 med 255
        kr/mnd. Vektet snitt for alle 430 andeler.
      </p>
    </div>
  );
}

function DiffRow({
  label,
  p1,
  p2,
  diff,
  diffSave,
  bold,
}: {
  label: string;
  p1: string;
  p2: string;
  diff: string;
  diffSave?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line/60 bg-surface/40 p-4">
      <div className="label">{label}</div>
      <div className="mt-3 grid grid-cols-3 gap-1 text-[13px]">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted">P1</div>
          <div className="num font-semibold text-ink">{p1}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted">P1+2</div>
          <div className="num font-semibold text-ink">{p2}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted">Diff</div>
          <div
            className={`num ${bold ? "font-bold" : "font-semibold"} ${diffSave ? "text-save" : "text-ink"}`}
          >
            {diff}
          </div>
        </div>
      </div>
    </div>
  );
}
