import { Link, useRoute } from "wouter";
import { ArrowLeft, Printer, Ruler, Percent, Wallet, Hash } from "lucide-react";
import { getAndelByNr } from "../lib/findAndel";
import { forventetKWhForAreal } from "../lib/calc";
import { kr, m2, pct } from "../lib/format";
import ComparisonTable from "../components/ComparisonTable";
import StromCalculator from "../components/StromCalculator";
import InfoTip from "../components/InfoTip";

export default function Result() {
  const [, params] = useRoute("/leilighet/:nr");
  const nr = Number(params?.nr);
  const andel = Number.isFinite(nr) ? getAndelByNr(nr) : null;

  if (!andel) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card">
          <h1 className="display text-xl font-semibold">
            Fant ikke andelsnummer {params?.nr}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Andelsnummer skal være mellom 1 og 430.
          </p>
          <Link href="/finn" className="btn-primary mt-4">
            Prøv på nytt
          </Link>
        </div>
      </div>
    );
  }

  const baseline = forventetKWhForAreal(andel.areal);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="no-print flex items-center justify-between gap-3">
        <Link
          href="/finn"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand"
        >
          <ArrowLeft size={14} /> Endre leilighet
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-brand hover:bg-brand-50 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
        >
          <Printer size={15} />
          <span className="hidden sm:inline">Skriv ut / lagre som PDF</span>
          <span className="sm:hidden">Skriv ut</span>
        </button>
      </div>

      <header className="relative overflow-hidden rounded-3xl border border-line/70 bg-paper p-5 shadow-card sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-hero-fade" aria-hidden />
        <div className="relative">
          <div className="label">Din leilighet</div>
          <h1 className="display mt-2 text-[26px] font-semibold leading-[1.05] tracking-tightest text-ink sm:text-[34px] lg:text-[44px]">
            {andel.adresse}
            <span className="text-muted/60"> · </span>
            <span className="num text-brand">Leil. {andel.leilNr}</span>
          </h1>

          <dl className="mt-6 grid grid-cols-2 gap-y-4 gap-x-3 sm:mt-8 sm:gap-y-6 sm:gap-x-4 md:grid-cols-4">
            <Fact icon={<Hash size={14} />} label="Andelsnr" value={String(andel.andelsnr)} />
            <Fact icon={<Ruler size={14} />} label="Areal" value={m2(andel.areal)} />
            <Fact
              icon={<Percent size={14} />}
              label={
                <>
                  Brøk
                  <InfoTip>
                    Eierbrøken fra borettslagets stiftelse — bestemmer hvordan
                    felleskostnader og lån fordeles. Sum av alle brøker = 1,000.
                  </InfoTip>
                </>
              }
              value={pct(andel.brok, 4)}
            />
            <Fact
              icon={<Wallet size={14} />}
              label="Dagens fellesk."
              value={kr(andel.dagensFu)}
              sub="/ mnd"
            />
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-warm-deep" />
              Kalkulert strømforbruk:{" "}
              <span className="num font-semibold text-ink">
                {baseline.toLocaleString("nb-NO")} kWh / år
              </span>
            </span>
            <span className="chip hidden sm:inline-flex">
              Areal-fordelt av borettslagets totalforbruk
            </span>
          </div>
        </div>
      </header>

      <ComparisonTable andel={andel} />

      <StromCalculator andel={andel} />
    </div>
  );
}

function Fact({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  value: string;
  sub?: string;
}) {
  return (
    <div className="min-w-0">
      <div className="label flex items-center gap-1.5">
        <span className="text-muted">{icon}</span>
        {label}
      </div>
      <div className="num mt-1.5 truncate text-[17px] font-semibold text-ink sm:text-xl">
        {value}
        {sub && (
          <span className="ml-1 text-[11px] font-normal text-muted sm:text-xs">{sub}</span>
        )}
      </div>
    </div>
  );
}
