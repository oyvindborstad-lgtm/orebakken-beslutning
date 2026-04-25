const krFmt = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function kr(n: number): string {
  return `${krFmt.format(Math.round(n))} kr`;
}

export function krSigned(n: number): string {
  const rounded = Math.round(n);
  if (rounded > 0) return `+${krFmt.format(rounded)} kr`;
  if (rounded < 0) return `−${krFmt.format(Math.abs(rounded))} kr`;
  return "0 kr";
}

export function pct(n: number, decimals = 2): string {
  return `${(n * 100).toFixed(decimals).replace(".", ",")} %`;
}

export function m2(n: number): string {
  return `${n.toLocaleString("nb-NO", { maximumFractionDigits: 1 })} m²`;
}
