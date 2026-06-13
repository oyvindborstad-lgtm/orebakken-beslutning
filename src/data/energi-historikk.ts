/**
 * Månedlig energi-historikk og solprognose for Orebakken.
 * Kilder:
 * - Fellesareal: Istad Kraft (faktiske tall 2024-2026, prognose apr-des 2026)
 * - Solprognose: Fusen-tilbud okt 2025 / brev mar 2026
 * - Andelseier-snitt: 99 276 kWh/mnd (snitt for hele borettslaget)
 */

export type EnergiMnd = {
  mnd: string;
  /** Måned 1-12 */
  mndNr: number;
  /** Fellesareal-forbruk faktisk (kWh) */
  fellesKWh: number;
  /** Solproduksjon — alle bygg scenario (kWh) */
  solAlleBygg: number;
  /** Solproduksjon — kun parkeringshus scenario (kWh) */
  solKunPhus: number;
  /** Er dette prognose for 2026 (apr-des)? */
  prognose: boolean;
};

export const ANDELSEIER_SNITT_KWH_MND = 99_276;
export const SOL_ALLE_BYGG_AR = 978_180;
export const SOL_KUN_PHUS_AR = 308_000;

/** 12 måneder, basis 2026 (faktiske jan-mar, prognose apr-des). */
export const ENERGI_2026: EnergiMnd[] = [
  { mnd: "Jan", mndNr: 1, fellesKWh: 137_802, solAlleBygg: 19_180, solKunPhus: 6_039, prognose: false },
  { mnd: "Feb", mndNr: 2, fellesKWh: 112_657, solAlleBygg: 28_770, solKunPhus: 9_059, prognose: false },
  { mnd: "Mar", mndNr: 3, fellesKWh: 99_766, solAlleBygg: 38_360, solKunPhus: 12_078, prognose: false },
  { mnd: "Apr", mndNr: 4, fellesKWh: 89_837, solAlleBygg: 67_130, solKunPhus: 21_137, prognose: true },
  { mnd: "Mai", mndNr: 5, fellesKWh: 45_384, solAlleBygg: 115_080, solKunPhus: 36_235, prognose: true },
  { mnd: "Jun", mndNr: 6, fellesKWh: 43_774, solAlleBygg: 163_030, solKunPhus: 51_333, prognose: true },
  { mnd: "Jul", mndNr: 7, fellesKWh: 36_574, solAlleBygg: 191_800, solKunPhus: 60_393, prognose: true },
  { mnd: "Aug", mndNr: 8, fellesKWh: 37_133, solAlleBygg: 182_210, solKunPhus: 57_373, prognose: true },
  { mnd: "Sep", mndNr: 9, fellesKWh: 38_205, solAlleBygg: 95_900, solKunPhus: 30_196, prognose: true },
  { mnd: "Okt", mndNr: 10, fellesKWh: 45_055, solAlleBygg: 47_950, solKunPhus: 15_098, prognose: true },
  { mnd: "Nov", mndNr: 11, fellesKWh: 72_106, solAlleBygg: 9_590, solKunPhus: 3_020, prognose: true },
  { mnd: "Des", mndNr: 12, fellesKWh: 113_114, solAlleBygg: 19_180, solKunPhus: 6_039, prognose: true },
];

/**
 * Beregn sol-fordeling per måned per scenario.
 * Logikk: Sol dekker først fellesareal, deretter andelseiere, så går
 * overskudd til "lager" (varmtvann i bergvarme-systemet) eller salg.
 */
export type SolFordeling = {
  mnd: string;
  sol: number;
  tilFelles: number;
  tilAndel: number;
  overskudd: number;
  fellesKjopt: number;
  andelKjopt: number;
};

export function solFordelingForMnd(
  data: EnergiMnd,
  scenario: "alle" | "phus" = "alle",
): SolFordeling {
  const sol = scenario === "alle" ? data.solAlleBygg : data.solKunPhus;
  const tilFelles = Math.min(sol, data.fellesKWh);
  const restEtterFelles = sol - tilFelles;
  const tilAndel = Math.min(restEtterFelles, ANDELSEIER_SNITT_KWH_MND);
  const overskudd = restEtterFelles - tilAndel;
  return {
    mnd: data.mnd,
    sol,
    tilFelles,
    tilAndel,
    overskudd,
    fellesKjopt: data.fellesKWh - tilFelles,
    andelKjopt: ANDELSEIER_SNITT_KWH_MND - tilAndel,
  };
}

/** Total sol-fordeling for hele året, per scenario. */
export function solFordelingArs(scenario: "alle" | "phus" = "alle") {
  const månedlig = ENERGI_2026.map((d) => solFordelingForMnd(d, scenario));
  return månedlig.reduce(
    (acc, m) => ({
      sol: acc.sol + m.sol,
      tilFelles: acc.tilFelles + m.tilFelles,
      tilAndel: acc.tilAndel + m.tilAndel,
      overskudd: acc.overskudd + m.overskudd,
      fellesKjopt: acc.fellesKjopt + m.fellesKjopt,
      andelKjopt: acc.andelKjopt + m.andelKjopt,
    }),
    { sol: 0, tilFelles: 0, tilAndel: 0, overskudd: 0, fellesKjopt: 0, andelKjopt: 0 },
  );
}

/** Pris-konstanter (kr/kWh) */
export const FORBRUKSPRIS_KR_PER_KWH = 1.20;
export const SALGSPRIS_SPOT_KR_PER_KWH = 0.50;
