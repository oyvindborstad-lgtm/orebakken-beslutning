import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const TABS = [
  { href: "/", label: "Sammendrag" },
  { href: "/bakgrunn", label: "Bakgrunn" },
  { href: "/grunnlag", label: "Grunnlag" },
  { href: "/underlag", label: "Underlag" },
  { href: "/finn", label: "Min leilighet" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return location === "/";
    if (href === "/finn") return location === "/finn" || location.startsWith("/leilighet/");
    return location.startsWith(href);
  }

  function go() {
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="no-print sticky top-0 z-30 border-b border-line/70 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
          <Link href="/" onClick={go} className="flex min-w-0 items-center gap-3">
            <BrandMark />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[14px] font-semibold tracking-tight text-ink sm:text-[15px]">
                Orebakken Borettslag
              </div>
              <div className="truncate text-[11px] font-medium text-muted sm:text-[12px]">
                Rehabilitering 2026 · Beslutningsverktøy
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
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

          {/* Mobile/tablet hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Lukk meny" : "Åpne meny"}
            aria-expanded={menuOpen}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-ink hover:bg-brand-50 hover:text-brand lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="border-t border-line/70 bg-paper lg:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col gap-1 p-3 sm:p-4">
              {TABS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  onClick={go}
                  className={
                    "rounded-xl px-4 py-3 text-[15px] font-medium transition " +
                    (isActive(t.href)
                      ? "bg-brand text-white shadow-soft"
                      : "text-ink/80 hover:bg-brand-50 hover:text-brand")
                  }
                >
                  {t.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {children}
      </main>

      <footer className="no-print mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
        <div className="border-t border-line/70 pt-5 text-[11.5px] leading-relaxed text-muted sm:text-xs">
          Vedlegg til beslutningsunderlag for rehabiliteringsprosjektet · Tall hentet fra vedtatt budsjettgrunnlag (21.04.2026) · Nettoendring inkluderer
          arealfordelt strømbesparelse og 22 % rentefradrag på nytt felleslån.
        </div>
      </footer>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-soft sm:h-10 sm:w-10">
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
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
