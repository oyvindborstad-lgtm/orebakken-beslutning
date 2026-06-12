import { FORUTSETNINGER } from "../data/forutsetninger";

const { pakke1, pakke2 } = FORUTSETNINGER;

/**
 * Annuitet (PMT) per måned for et lån.
 * P = lånebeløp, r = månedlig rente (desimal), n = antall måneder.
 */
function annuitetMnd(P: number, rentePctPrAr: number, ar: number): number {
  const r = rentePctPrAr / 100 / 12;
  const n = ar * 12;
  if (r === 0) return P / n;
  return (P * r) / (1 - Math.pow(1 + r, -n));
}

/** Totalrente betalt over hele lånetid for et annuitetslån. */
function totalRenter(P: number, rentePctPrAr: number, ar: number): number {
  return annuitetMnd(P, rentePctPrAr, ar) * ar * 12 - P;
}

/**
 * Beregner snitt rentekostnad per år over hele lånetid (lik totalRenter / ar).
 * Brukes til å estimere snitt skattefradrag (22 % av rente).
 */
function snittRenteAr(P: number, rentePctPrAr: number, ar: number): number {
  return totalRenter(P, rentePctPrAr, ar) / ar;
}

/**
 * Netto kontantstrøm per år for andelseier-snitt.
 * Negativ = belastning, Positiv = besparelse.
 */
export function aarligKontantstromSnitt(
  pakke: "p1" | "p2",
  rentePctOverstyring?: number,
  stromPrisOverstyring?: number,
): { ar: number[]; verdi: number[]; sum: number } {
  const p = pakke === "p1" ? pakke1 : pakke2;
  const basisRente = p.rentebaner.r1.rentePct; // hovedscenario 5,04 %
  const rente = rentePctOverstyring ?? basisRente;

  const A = FORUTSETNINGER.felles.antallAndeler;
  const renteJusteringAr =
    (totalRenter(p.laneSum, rente, p.nedbetalingAr) -
      totalRenter(p.laneSum, basisRente, p.nedbetalingAr)) /
    p.nedbetalingAr /
    A;

  const stromPrisFaktor = stromPrisOverstyring
    ? stromPrisOverstyring / FORUTSETNINGER.felles.stromPrisKrPerKWh
    : 1;

  const r1 = p.rentebaner.r1;
  const stromBespAr = r1.stromBespSnittKrMnd * 12 * stromPrisFaktor;
  const skfrAr = r1.skattefradragSnittKrMnd * 12;
  const skfrJustering =
    (snittRenteAr(p.laneSum, rente, p.nedbetalingAr) /
      snittRenteAr(p.laneSum, basisRente, p.nedbetalingAr) -
      1) *
    skfrAr;

  const bruttoBaseAr = r1.bruttoSnittKrMnd * 12;
  const nettoAr =
    bruttoBaseAr +
    renteJusteringAr -
    stromBespAr -
    (skfrAr + skfrJustering);

  const ar: number[] = [];
  const verdi: number[] = [];
  for (let y = 1; y <= p.nedbetalingAr; y++) {
    ar.push(y);
    verdi.push(-nettoAr); // negativ = belastning for andelseier
  }
  return { ar, verdi, sum: ar.length * -nettoAr };
}

/** Nåverdi (NPV) av kontantstrømmer med diskonteringsrente. */
export function nv(
  kontantstrom: number[],
  diskonteringsrentePct: number,
): number {
  const r = diskonteringsrentePct / 100;
  return kontantstrom.reduce(
    (sum, c, i) => sum + c / Math.pow(1 + r, i + 1),
    0,
  );
}
