import type { ReactNode } from "react";
import { Link } from "wouter";
import { Building2 } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="no-print border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white">
              <Building2 size={18} />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold text-ink">
                Orebakken — Rehabilitering 2026
              </div>
              <div className="label">Beslutningsverktøy for andelseiere</div>
            </div>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        {children}
      </main>
      <footer className="no-print mx-auto max-w-5xl px-4 pb-12 sm:px-8">
        <p className="text-xs text-muted">
          Vedlegg til beslutningsunderlag · Tall hentet fra vedtatt
          budsjettgrunnlag (21.04.2026) · Nettoendring inkluderer strømbesparelse
          og 22 % rentefradrag
        </p>
      </footer>
    </div>
  );
}
