import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";

const TABS = [
  { href: "/", label: "Sammendrag" },
  { href: "/bakgrunn", label: "Bakgrunn" },
  { href: "/grunnlag", label: "Grunnlag" },
  { href: "/finn", label: "Min leilighet" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  function isActive(href: string) {
    if (href === "/") return location === "/";
    if (href === "/finn") return location === "/finn" || location.startsWith("/leilighet/");
    return location.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="no-print sticky top-0 z-30 border-b border-line/70 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark />
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight text-ink">
                Orebakken Borettslag
              </div>
              <div className="text-[12px] font-medium text-muted">
                Rehabilitering 2026 · Beslutningsverktøy
              </div>
            </div>
          </Link>
          <nav className="-mx-1 flex items-center gap-1 overflow-x-auto sm:overflow-visible">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={
                  "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition " +
                  (isActive(t.href)
                    ? "bg-brand text-white shadow-soft"
                    : "text-ink/65 hover:bg-brand-50 hover:text-brand")
                }
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
      <footer className="no-print mx-auto max-w-6xl px-5 pb-14 sm:px-8">
        <div className="border-t border-line/70 pt-5 text-xs leading-relaxed text-muted">
          Vedlegg til beslutningsunderlag for rehabiliteringsprosjektet · Tall hentet fra vedtatt budsjettgrunnlag (21.04.2026) · Nettoendring inkluderer
          arealfordelt strømbesparelse og 22 % rentefradrag på nytt felleslån.
        </div>
      </footer>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white shadow-soft">
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11 12 4l9 7" />
        <path d="M5 10v9h14v-9" />
        <path d="M10 19v-5h4v5" />
      </svg>
    </div>
  );
}
