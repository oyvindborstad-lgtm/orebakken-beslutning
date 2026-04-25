export const FORUTSETNINGER = {
  pakke1: {
    navn: "Pakke 1",
    undertittel: "Tak, fasader og betong",
    laneSum: 190_000_000,
    nedbetalingAr: 30,
    rentePct: 5.7,
    arligTermin: 13_233_130,
    inkluderer: [
      "Tak og fasader (110 mill)",
      "Betongrehabilitering (65 mill)",
      "Prosjektledelse OBOS Prosjekt (5 mill)",
      "Uforutsette kostnader (10 mill)",
    ],
    energibesparelseKWh: 500_000,
  },
  pakke2: {
    navn: "Pakke 1+2",
    undertittel: "Pakke 1 + solceller + bergvarme",
    laneSum: 349_625_000,
    nedbetalingAr: 40,
    rentePct: 5.2,
    arligTermin: 20_789_425,
    inkluderer: [
      "Alt i Pakke 1",
      "Solceller (11 mill)",
      "Bergvarme (165 mill)",
      "− Enova-støtte (31,375 mill)",
    ],
    energibesparelseKWh: 3_725_000,
  },
  felles: {
    totaltAreal: 35_038.6,
    totalForbrukKWh: 6_200_000,
    oppvarmingTotalKWh: 4_300_000,
    stromPrisKrPerKWh: 1.2,
    skattesats: 0.22,
    byggforskOppvarmingsAndel: 0.75,
  },
} as const;

export type PakkeId = "p1" | "p2";
