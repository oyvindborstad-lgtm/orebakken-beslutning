import { useState, type FormEvent } from "react";
import { useLocation, Link } from "wouter";
import { Search, ArrowLeft } from "lucide-react";
import { findAndel } from "../lib/findAndel";

export default function FindAndel() {
  const [, setLocation] = useLocation();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const andel = findAndel(input);
    if (!andel) {
      setError(
        "Fant ingen leilighet på det nummeret. Prøv andelsnr (1–430) eller leilighetsnr (4 sifre, f.eks. 1001).",
      );
      return;
    }
    setLocation(`/leilighet/${andel.andelsnr}`);
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand"
      >
        <ArrowLeft size={14} /> Tilbake
      </Link>

      <div className="card mt-4">
        <div className="label">Steg 1 av 2</div>
        <h1 className="display mt-2 text-[24px] font-semibold leading-tight text-ink sm:text-2xl">
          Finn din leilighet
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted sm:text-sm">
          Skriv inn enten <span className="font-medium text-ink">andelsnr</span>{" "}
          (1–430) eller{" "}
          <span className="font-medium text-ink">leilighetsnr</span> (4-sifret
          matrikkel/bolignummer, f.eks. 1001). Du finner begge på
          husleieinnbetalingen og i andelseierlisten.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <label htmlFor="search" className="label">
            Andelsnr eller leilighetsnr
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="search"
                type="text"
                inputMode="numeric"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="f.eks. 42 eller 1001"
                className="num w-full rounded-xl border border-line/80 bg-white py-3 pl-10 pr-4 text-lg font-semibold focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <button type="submit" className="btn-primary">
              Vis tall
            </button>
          </div>
          {error && (
            <p className="rounded-lg bg-warm-bg/80 px-3 py-2 text-[13px] text-warm-deep sm:text-sm">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
