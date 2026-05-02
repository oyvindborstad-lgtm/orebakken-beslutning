export const FORUTSETNINGER = {
  pakke1: {
    navn: "Pakke 1",
    undertittel: "Tak, fasader og betong",
    laneSum: 192_000_000,
    nedbetalingAr: 30,
    rentePct: 5.0,
    arligTermin: 12_368_370,
    flertallskrav: "50 %" as const,
    inkluderer: [
      "Tak og fasader (105 mill)",
      "Betongrehabilitering (65 mill)",
      "Prosjektledelse OBOS Prosjekt (5 mill)",
      "Uforutsette kostnader (17 mill)",
    ],
    energibesparelseKWh: 500_000,
    bruttoSnittKrMnd: 1_252,
    nettoSnittKrMnd: 881,
    stromBespSnittKrMnd: 116,
    skattefradragSnittKrMnd: 254,
  },
  pakke2: {
    navn: "Pakke 1+2",
    undertittel: "Pakke 1 + bergvarme og solceller",
    laneSum: 354_225_000,
    nedbetalingAr: 40,
    rentePct: 4.9,
    arligTermin: 20_216_007,
    flertallskrav: "2/3" as const,
    inkluderer: [
      "Tak og fasader (105 mill)",
      "Betongrehabilitering (65 mill)",
      "Bergvarme (160 mill)",
      "Solceller (11 mill)",
      "Prosjektledelse OBOS Prosjekt (10 mill)",
      "Uforutsette kostnader (34,6 mill — 10 % av total)",
      "− Enova-støtte (31,375 mill)",
    ],
    energibesparelseKWh: 3_633_610,
    bruttoSnittKrMnd: 2_772,
    /** Netto FK-økning inkl. ny solar-modell (1,20 forbruk + 0,50 spot for salg). */
    nettoSnittKrMnd: 1_257,
    /** Oppvarmingsbesparelse (845) + solar dekker felles + salg (186) = 1 031 snitt. */
    stromBespSnittKrMnd: 1_031,
    /** Total solar-verdi snitt: forbruksverdi 803 849 + salgsinntekt 154 153 = 958 002 / 430 / 12. */
    solenergiSnittKrMnd: 186,
    skattefradragSnittKrMnd: 484,
  },
  /**
   * Månedlig energi-balanse (kWh).
   * - sol = solcelleproduksjon (Fusen energirapport)
   * - bergvarme = pumpens eget el-forbruk (Dråpe AS)
   * - ovrig = faktisk fellesareal-strøm 2025 (Istad Kraft, full kalenderår)
   *
   * Felles post-P2 = bergvarme + ovrig. Solenergi dekker først felles, og
   * det som er igjen om sommeren selges som overskudd til nettet.
   */
  manedlig: [
    { mnd: "Jan", sol: 19_180, bergvarme: 182_323, ovrig: 158_563 },
    { mnd: "Feb", sol: 28_770, bergvarme: 164_279, ovrig: 144_242 },
    { mnd: "Mar", sol: 38_360, bergvarme: 122_598, ovrig: 153_842 },
    { mnd: "Apr", sol: 67_130, bergvarme: 70_906, ovrig: 117_136 },
    { mnd: "Mai", sol: 115_080, bergvarme: 40_283, ovrig: 59_175 },
    { mnd: "Jun", sol: 163_030, bergvarme: 29_718, ovrig: 57_076 },
    { mnd: "Jul", sol: 191_800, bergvarme: 28_084, ovrig: 47_688 },
    { mnd: "Aug", sol: 182_210, bergvarme: 33_374, ovrig: 48_416 },
    { mnd: "Sep", sol: 95_900, bergvarme: 59_117, ovrig: 49_814 },
    { mnd: "Okt", sol: 47_950, bergvarme: 91_108, ovrig: 58_745 },
    { mnd: "Nov", sol: 9_590, bergvarme: 134_766, ovrig: 94_017 },
    { mnd: "Des", sol: 19_180, bergvarme: 171_462, ovrig: 147_486 },
  ],
  felles: {
    antallAndeler: 430,
    antallBlokker: 13,
    totaltAreal: 35_038.6,
    /** Privat strømforbruk (sum av andelseiere, Elvia per 26.02.2026). */
    totalForbrukKWh: 5_570_863,
    /** Faktisk fellesareal-strøm 2025 (Istad Kraft, 12 mnd). */
    fellesForbrukKWh: 1_136_201,
    fellesKostnadKrAr: 1_363_441,
    /** 75 % av privatforbruket regnes som oppvarming + tappevann. */
    oppvarmingTotalKWh: 4_178_147,
    stromPrisKrPerKWh: 1.2,
    /** Spot-pris for salg av solenergi-overskudd (konservativt anslag). */
    salgsprisKrPerKWh: 0.5,
    skattesats: 0.22,
    byggforskOppvarmingsAndel: 0.75,
    bergvarmeReduserer: 0.75,
    solcelleProduksjonKWh: 978_180,
    bergvarmeEgetForbrukKWh: 1_128_018,
    /** Solar dekker felles direkte (når sol ≤ felles, mest av året). */
    solcelleBruktTilFellesKWh: 669_874,
    /** Solar overskudd som selges til nettet (mai–aug, der sol > felles). */
    solcelleOverskuddSommerKWh: 308_306,
    enovaBekreftet: 31_375_000,
    enovaSokerFor: 9,
    enovaInnvilgetFor: 4,
    fkSnittIDagKrMnd: 5_092,
    dagensBudsjettFKKrAr: 27_810_829,
    byggprisIndeksPctPrAr: 0.04,
  },
} as const;

export type PakkeId = "p1" | "p2";
