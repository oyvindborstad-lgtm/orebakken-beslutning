import { Link, useRoute } from "wouter";
import { ArrowLeft, Printer, Home, Ruler, Percent, Wallet } from "lucide-react";
import { getAndelByNr } from "../lib/findAndel";
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
          <h1 className="text-xl font-semibold">Fant ikke andelsnummer {params?.nr}</h1>
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

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-between">
        <Link
          href="/finn"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand"
        >
          <ArrowLeft size={14} /> Endre leilighet
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-ghost text-sm"
        >
          <Printer size={16} /> Skriv ut / lagre som PDF
        </button>
      </div>

      <header className="card">
        <div className="label">Din leilighet</div>
        <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">
          {andel.adresse} · Leil. {andel.leilNr}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Andelsnr {andel.andelsnr}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-y-5 gap-x-4 sm:grid-cols-4">
          <Fact
            icon={<Ruler size={16} />}
            label="Areal"
            value={m2(andel.areal)}
          />
          <Fact
            icon={<Percent size={16} />}
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
            icon={<Wallet size={16} />}
            label="Dagens fellesk."
            value={kr(andel.dagensFu)}
            sub="/ mnd"
          />
          <Fact
            icon={<Home size={16} />}
            label="Adresse"
            value={andel.adresse}
          />
        </dl>
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
    <div>
      <div className="label flex items-center gap-1.5">
        <span className="text-muted">{icon}</span>
        {label}
      </div>
      <div className="num mt-1.5 text-lg font-semibold text-ink">
        {value}
        {sub && <span className="ml-1 text-xs font-normal text-muted">{sub}</span>}
      </div>
    </div>
  );
}
