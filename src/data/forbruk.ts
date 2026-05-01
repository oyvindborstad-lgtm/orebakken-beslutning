/**
 * Estimert årlig strømforbruk per adresse fra Elvia (datagrunnlag fra
 * 26.02.2026, hentet via Odin). Tallene er sum av private målepunkter på
 * hver adresse. Total fra Elvia: 5 570 863 kWh.
 *
 * Modellen i appen antar at borettslagets totale forbruk er 6 000 000 kWh
 * (jf. forutsetninger.totalForbrukKWh). Differansen mellom Elvia-tallene og
 * 6 mill kWh fordeles likt over alle 430 andeler som et flat-tillegg
 * (representerer fellesareal-strøm, vaktmesterleilighet (98A) og
 * estimat-usikkerhet i Elvia-tallene).
 *
 * Beregning per andel:
 *   forventet kWh = ELVIA_PER_ADRESSE[andel.adresse] / antallAndelerPåAdresse
 *                 + DIFF_FLAT_KWH_PER_ANDEL
 *
 * 98A inngår i Elvia-totalen, men har ingen matchende andel i
 * andeler.json — beløpet havner derfor i felles-bucketen (DIFF).
 */
export const ELVIA_PER_ADRESSE: Record<string, number> = {
  "Landingsveien 56": 78_338,
  "Landingsveien 58": 107_515,
  "Landingsveien 60": 78_098,
  "Landingsveien 66": 69_602,
  "Landingsveien 68": 101_654,
  "Landingsveien 70": 93_223,
  "Landingsveien 72": 67_521,
  "Landingsveien 74": 93_232,
  "Landingsveien 76": 141_961,
  "Landingsveien 78": 84_527,
  "Landingsveien 80": 381_934,
  "Landingsveien 82": 310_726,
  "Landingsveien 84": 995_260,
  "Landingsveien 86": 308_172,
  "Landingsveien 88": 99_832,
  "Landingsveien 90": 126_937,
  "Landingsveien 92": 85_580,
  "Landingsveien 94": 104_960,
  "Landingsveien 96": 125_372,
  "Landingsveien 98": 24_472,
  "Landingsveien 100": 104_704,
  "Landingsveien 102": 102_111,
  "Landingsveien 104": 127_074,
  "Landingsveien 106": 94_036,
  "Landingsveien 110": 85_935,
  "Landingsveien 112": 137_320,
  "Landingsveien 114": 91_961,
  "Landingsveien 116": 103_397,
  "Landingsveien 118": 130_874,
  "Landingsveien 120": 100_620,
  "Landingsveien 122": 102_966,
  "Landingsveien 124": 121_783,
  "Landingsveien 126": 95_898,
  "Landingsveien 128": 92_160,
  "Landingsveien 130": 144_747,
  "Landingsveien 132": 101_272,
  "Landingsveien 134": 97_382,
  "Landingsveien 136": 135_936,
  "Landingsveien 138": 75_151,
};

/** Sum av Elvia-tallene over for matchende adresser (eks. 98A). */
export const ELVIA_SUM_MATCHED_KWH = 5_524_243;

/** Felles + 98A + estimatusikkerhet, fordelt likt på 430 andeler. */
export const DIFF_FLAT_KWH_PER_ANDEL = Math.round(
  (6_000_000 - ELVIA_SUM_MATCHED_KWH) / 430,
);
