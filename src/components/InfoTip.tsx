import { useState, useId, type ReactNode } from "react";
import { Info } from "lucide-react";

export default function InfoTip({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline-flex items-center align-middle">
      <button
        type="button"
        aria-describedby={id}
        aria-label={label ?? "Mer informasjon"}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-muted hover:text-brand focus:text-brand"
      >
        <Info size={14} />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-xs leading-relaxed text-white shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  );
}
