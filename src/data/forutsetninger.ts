export const FORUTSETNINGER = {
  pakke1: {
    navn: "Alt 1",
    undertittel: "Tak, fasader og betong",
    /** OBOS Banken Alt 1 (13.05.2026): lån etter 10 mill ENØK-støtte. */
    laneSum: 176_000_000,
    nedbetalingAr: 30,
    rentePct: 5.14,
    arligTermin: 11_742_220,
    flertallskrav: "50 %" as const,
    inkluderer: [
      "Rehab-kostnad 193,3 mill (tak, fasader, betong, vinduer m.m.)",
      "Finanskostnader i byggeperiode 11,8 mill",
      "Totalprosjektkostnad 205,1 mill",
      "− ENØK-støtte 10 mill",
      "= Nytt lån 176 mill (24 mnd avdragsfritt)",
    ],
    energibesparelseKWh: 500_000,
    bruttoSnittKrMnd: 1_130,
    nettoSnittKrMnd: 774,
    stromBespSnittKrMnd: 116,
    skattefradragSnittKrMnd: 240,
  },
  pakke2: {
    navn: "Alt 2",
    undertittel: "P1 + bergvarme og solceller (31 mill Enova)",
    /** OBOS Banken Alt 2 (13.05.2026): lån etter 31,3 mill ENØK-støtte. */
    laneSum: 341_700_000,
    nedbetalingAr: 40,
    rentePct: 5.04,
    arligTermin: 20_210_972,
    flertallskrav: "2/3" as const,
    inkluderer: [
      "Rehab-kostnad 379,8 mill (tak, fasader, betong, bergvarme, solceller, m.m.)",
      "Finanskostnader i byggeperiode 23,7 mill",
      "Totalprosjektkostnad 403,5 mill",
      "− ENØK-støtte 31,3 mill (bekreftet for 4 blokker)",
      "= Nytt lån 341,7 mill (24 mnd avdragsfritt)",
    ],
    /**
     * Oppvarmings-besparelse P2:
     * - P1 fasade-isolasjon: 500 000 kWh
     * - Bergvarme reduserer 75 % av privat oppvarming (75 % × 3 455 671) = 2 591 753 kWh
     * - Sum: 3 091 753 kWh
     */
    energibesparelseKWh: 3_091_753,
    bruttoSnittKrMnd: 2_771,
    /**
     * Netto FK-økning snitt. Solar-modell (per HTML «Alle bygg – fordeling»):
     *  - Solar dekker Istad felles direkte (492 329 kWh × 1,20 = 590 795 kr/år)
     *    → reduserer FK, brøk-fordelt
     *  - Solar overskuddsdeling til andelseiere (399 819 kWh × 1,20 = 479 783
     *    kr/år), areal-fordelt
     *  - Solar selges til nettet (86 032 kWh × 0,50 spot = 43 016 kr/år),
     *    brøk-fordelt (BRL-inntekt → FK-reduksjon)
     *  - Total solar-verdi: 1 113 594 kr/år
     */
    nettoSnittKrMnd: 1_506,
    /** Oppvarmingsbesparelse (719) + solar (227) = 946 snitt. */
    stromBespSnittKrMnd: 946,
    /**
     * Solar fordeles per m²: hele 978 180 kWh × 1,20 = 1 173 816 kr/år
     * fordelt over 35 038,6 m². Snitt per andel (81,5 m²): 227 kr/mnd.
     */
    solenergiSnittKrMnd: 227,
    skattefradragSnittKrMnd: 319,
  },
  pakke3: {
    navn: "Alt 3",
    undertittel: "P1 + bergvarme og solceller (60 mill Enova)",
    /** OBOS Banken Alt 3 (13.05.2026): lån etter 60 mill ENØK-støtte (utvidet). */
    laneSum: 313_000_000,
    nedbetalingAr: 40,
    rentePct: 5.04,
    arligTermin: 18_513_416,
    flertallskrav: "2/3" as const,
    inkluderer: [
      "Rehab-kostnad 379,8 mill (tak, fasader, betong, bergvarme, solceller, m.m.)",
      "Finanskostnader i byggeperiode 23,7 mill",
      "Totalprosjektkostnad 403,5 mill",
      "− ENØK-støtte 60 mill (utvidet — alle 13 blokker innvilget)",
      "= Nytt lån 313 mill (24 mnd avdragsfritt)",
    ],
    energibesparelseKWh: 3_091_753,
    bruttoSnittKrMnd: 2_441,
    nettoSnittKrMnd: 1_203,
    stromBespSnittKrMnd: 946,
    solenergiSnittKrMnd: 227,
    skattefradragSnittKrMnd: 292,
  },
  /**
   * Månedlig energi-balanse (kWh).
   * - sol = solcelleproduksjon (Fusen energirapport)
   * - bergvarme = pumpens eget el-forbruk (oppvarming/tappevann minus
   *   bergvarme-besparelse = 3 455 671 − 2 591 753 = 863 918 kWh/år).
   *   Månedlig fordeling skalert fra opprinnelig Dråpe-data (faktor 0,766).
   * - ovrig = faktisk fellesareal-strøm 2025 (Istad Kraft, full kalenderår)
   */
  manedlig: [
    { mnd: "Jan", sol: 19_180, bergvarme: 139_636, ovrig: 158_563 },
    { mnd: "Feb", sol: 28_770, bergvarme: 125_817, ovrig: 144_242 },
    { mnd: "Mar", sol: 38_360, bergvarme: 93_894, ovrig: 153_842 },
    { mnd: "Apr", sol: 67_130, bergvarme: 54_305, ovrig: 117_136 },
    { mnd: "Mai", sol: 115_080, bergvarme: 30_852, ovrig: 59_175 },
    { mnd: "Jun", sol: 163_030, bergvarme: 22_760, ovrig: 57_076 },
    { mnd: "Jul", sol: 191_800, bergvarme: 21_509, ovrig: 47_688 },
    { mnd: "Aug", sol: 182_210, bergvarme: 25_560, ovrig: 48_416 },
    { mnd: "Sep", sol: 95_900, bergvarme: 45_276, ovrig: 49_814 },
    { mnd: "Okt", sol: 47_950, bergvarme: 69_777, ovrig: 58_745 },
    { mnd: "Nov", sol: 9_590, bergvarme: 103_214, ovrig: 94_017 },
    { mnd: "Des", sol: 19_180, bergvarme: 131_318, ovrig: 147_486 },
  ],
  felles: {
    antallAndeler: 430,
    antallBlokker: 13,
    totaltAreal: 35_038.6,
    /** Totalt strømforbruk borettslaget (Elvia per 26.02.2026). */
    totalForbrukKWh: 5_570_863,
    /** Snitt fellesareal-strøm (Istad Kraft, 3-års snitt 2024–2026). */
    fellesForbrukKWh: 963_302,
    fellesKostnadKrAr: 1_155_962,
    /**
     * Privat oppvarming + tappevann.
     * Privat = total − felles = 5 570 863 − 963 302 = 4 607 561 kWh.
     * 75 % × privat = 3 455 671 kWh (Byggforsk-norm).
     */
    oppvarmingTotalKWh: 3_455_671,
    stromPrisKrPerKWh: 1.2,
    /** Spot-pris for salg av solenergi-overskudd (konservativt anslag). */
    salgsprisKrPerKWh: 0.5,
    skattesats: 0.22,
    byggforskOppvarmingsAndel: 0.75,
    bergvarmeReduserer: 0.75,
    solcelleProduksjonKWh: 978_180,
    /**
     * Bergvarmens eget strømforbruk = oppvarming/tappevann (3 455 671 kWh)
     * minus bergvarme-besparelse (2 591 753 kWh) = 863 918 kWh/år.
     * Implisitt COP ≈ 4,0.
     */
    bergvarmeEgetForbrukKWh: 863_918,
    /**
     * Solar dekker Istad-fellesforbruket direkte (sum av min(sol, istad) per
     * mnd) — vises som info i Underlag. Hele solar (978 180 kWh) verdsettes
     * imidlertid til full forbrukspris 1,20 kr/kWh og fordeles per m².
     */
    solcelleBruktTilFellesKWh: 492_329,
    solcelleOverskuddSommerKWh: 485_851,
    enovaBekreftet: 31_375_000,
    enovaSokerFor: 9,
    enovaInnvilgetFor: 4,
    fkSnittIDagKrMnd: 5_092,
    dagensBudsjettFKKrAr: 27_810_829,
    byggprisIndeksPctPrAr: 0.04,
  },
} as const;

export type PakkeId = "p1" | "p2" | "p3";
