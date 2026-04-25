import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";

export default function InfoTip({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open || !btnRef.current) return;
    const updatePos = () => {
      const r = btnRef.current!.getBoundingClientRect();
      const tipW = 288;
      let left = r.left + r.width / 2 - tipW / 2;
      const margin = 8;
      const maxLeft = window.innerWidth - tipW - margin;
      if (left < margin) left = margin;
      if (left > maxLeft) left = maxLeft;
      setPos({ top: r.bottom + 8, left });
    };
    updatePos();
    const onClick = (e: MouseEvent) => {
      if (
        tipRef.current &&
        !tipRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span className="relative inline-flex items-center align-middle">
      <button
        ref={btnRef}
        type="button"
        aria-describedby={open ? id : undefined}
        aria-label={label ?? "Mer informasjon"}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-muted hover:text-brand focus:text-brand"
      >
        <Info size={14} />
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={tipRef}
            id={id}
            role="tooltip"
            style={{ top: pos.top, left: pos.left, width: 288 }}
            className="fixed z-[100] rounded-xl bg-ink px-4 py-3 text-[12.5px] leading-relaxed text-white shadow-xl ring-1 ring-black/10"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Lukk"
              className="absolute right-2 top-2 rounded p-0.5 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X size={12} />
            </button>
            <div className="pr-4">{children}</div>
          </div>,
          document.body,
        )}
    </span>
  );
}
