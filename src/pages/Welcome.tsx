import { Link } from "wouter";
import { ArrowRight, FileText, Wrench, Sun } from "lucide-react";
import PackageCard from "../components/PackageCard";

export default function Welcome() {
  return (
    <div className="space-y-10">
      <section>
        <div className="label">Beslutningsverktøy</div>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          Hva betyr Pakke 1 og Pakke 1+2 for din egen leilighet?
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
          Som vedlegg til beslutningsunderlaget for rehabiliteringsprosjektet
          har du her et personlig regneverktøy. Skriv inn andelsnummeret eller
          leilighetsnummeret ditt, og se de eksakte tallene som er beregnet for
          akkurat din andel — ny felleskostnad, strømbesparelse, skattefradrag
          og netto reell endring per måned.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/finn" className="btn-primary">
            Finn min leilighet <ArrowRight size={18} />
          </Link>
          <a href="#pakkene" className="btn-ghost">
            Les om pakkene
          </a>
        </div>
      </section>

      <section id="pakkene" className="space-y-4">
        <div>
          <div className="label">Tiltakspakker</div>
          <h2 className="mt-2 text-xl font-semibold text-ink">
            Generalforsamlingen skal velge mellom to alternativer
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <PackageCard id="p1" />
          <PackageCard id="p2" />
        </div>
      </section>

      <section className="card">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
            <FileText size={20} />
          </div>
          <div>
            <div className="label">Slik er tallene beregnet</div>
            <h3 className="mt-1 text-lg font-semibold text-ink">
              Fra felleskostnad til netto reell endring
            </h3>
          </div>
        </div>

        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink/80">
          <li>
            <span className="font-semibold text-ink">Ny felleskostnad</span> = din
            brøk × nødvendige felleskostnader for valgt pakke (drift +
            eksisterende lån + nytt lån + 1,5 mill buffer − inntekter), delt på
            12.
          </li>
          <li>
            <span className="font-semibold text-ink">Strømbesparelse</span>{" "}
            fordeles etter areal: andel av total kWh-besparelse × strømpris (1,20
            kr/kWh).
          </li>
          <li>
            <span className="font-semibold text-ink">Skattefradrag</span> =
            22 % × din brøk × renteutgift på nytt felleslån. Fradraget tilfaller
            deg personlig via RF-1215.
          </li>
          <li>
            <span className="font-semibold text-ink">Netto reell endring</span>{" "}
            = bruttoøkning − strømbesparelse − skattefradrag. Dette er det
            faktiske beløpet du merker.
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border-2 border-dashed border-black/10 bg-white/40 p-6 sm:p-8">
        <div className="label">Kommer senere</div>
        <h3 className="mt-2 text-lg font-semibold text-ink">
          Tilleggsmoduler under arbeid
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-warm/10 text-warm">
              <Wrench size={18} />
            </div>
            <div>
              <div className="font-medium text-ink">Føringsveier</div>
              <div className="text-sm text-muted">
                Detaljert info om rør- og kabelføringer i rehabiliteringen
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-warm/10 text-warm">
              <Sun size={18} />
            </div>
            <div>
              <div className="font-medium text-ink">Solcellestyring</div>
              <div className="text-sm text-muted">
                Hvordan solcellestrømmen fordeles og styres mellom andelene
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
