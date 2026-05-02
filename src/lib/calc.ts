import { FORUTSETNINGER } from "../data/forutsetninger";
import {
  DIFF_FLAT_KWH_PER_ANDEL,
  ELVIA_PER_ADRESSE,
} from "../data/forbruk";
import type { Andel } from "./types";

const { felles, pakke1 } = FORUTSETNINGER;

const P1_REDUKSJONS_FAKTOR = pakke1.energibesparelseKWh / felles.oppvarmingTotalKWh;

/**
 * Verdi av solar som dekker Istad-fellesforbruket (kr/år).
 * Reduserer FK-budsjettet → fordelt etter brøk.
 */
export const SOLAR_DEKKER_FELLES_KR_AR =
  felles.solcelleBruktTilFellesKWh * felles.stromPrisKrPerKWh;

/**
 * Verdi av solar overskudd (kr/år).
 * Fordeles til andelseiere etter m² (overskuddsdeling) ved forbrukspris.
 */
export const SOLAR_OVERSKUDD_KR_AR =
  felles.solcelleOverskuddSommerKWh * felles.stromPrisKrPerKWh;

/** Total solenergi-verdi (kr/år) for andelseiere samlet. */
export const TOTAL_SOLAR_VERDI_KR_AR =
  SOLAR_DEKKER_FELLES_KR_AR + SOLAR_OVERSKUDD_KR_AR;

/**
 * Solenergi-fordel per andel basert på todelt fordeling:
 *  - Brøk-del: andel × solar-dekning av Istad / 12 (FK-reduksjon)
 *  - Areal-del: (areal/totalt) × solar-overskudd / 12 (privat kreditt via m²)
 */
export function solenergiKrMndForAndel(brok: number, areal: number): number {
  const brokDel = (brok * SOLAR_DEKKER_FELLES_KR_AR) / 12;
  const arealDel =
    ((areal / felles.totaltAreal) * SOLAR_OVERSKUDD_KR_AR) / 12;
  return brokDel + arealDel;
}

/**
 * Backward-compat: solenergi for kun brøk (uten areal-input).
 * Antar snitt-areal for å gi en omtrentlig verdi tilpasset 1/430.
 */
export function solenergiKrMndForBrok(brok: number): number {
  const snittAreal = felles.totaltAreal / felles.antallAndeler;
  return solenergiKrMndForAndel(brok, snittAreal);
}

export function solenergiKWhForBrok(brok: number): number {
  return brok * felles.solcelleProduksjonKWh;
}

/**
 * Antall andeler per adresse — beregnes ved første bruk for å unngå hardkoding.
 * Fyles inn ved første kall til forventetKWhForAndel.
 */
let antallPerAdresseCache: Record<string, number> | null = null;

function antallPerAdresse(): Record<string, number> {
  if (antallPerAdresseCache) return antallPerAdresseCache;
  const cache: Record<string, number> = {};
  // Andelene er definert i andeler.json — vi laster denne lazily for å unngå
  // sirkulær import. (Antall-kalkulasjonen er deterministisk på 430 andeler.)
  // For enkelhet hardkodes tellingen under (matcher andeler.json):
  const counts: Record<string, number> = {
    "Landingsveien 56": 8, "Landingsveien 58": 8, "Landingsveien 60": 8,
    "Landingsveien 66": 8, "Landingsveien 68": 8, "Landingsveien 70": 8,
    "Landingsveien 72": 8, "Landingsveien 74": 8, "Landingsveien 76": 8,
    "Landingsveien 78": 8,
    "Landingsveien 80": 32, "Landingsveien 82": 32, "Landingsveien 84": 32,
    "Landingsveien 86": 32,
    "Landingsveien 88": 9, "Landingsveien 90": 9, "Landingsveien 92": 9,
    "Landingsveien 94": 9, "Landingsveien 96": 9, "Landingsveien 98": 9,
    "Landingsveien 100": 9, "Landingsveien 102": 9, "Landingsveien 104": 9,
    "Landingsveien 106": 9,
    "Landingsveien 110": 8, "Landingsveien 112": 8, "Landingsveien 114": 8,
    "Landingsveien 116": 9, "Landingsveien 118": 9, "Landingsveien 120": 9,
    "Landingsveien 122": 9, "Landingsveien 124": 9, "Landingsveien 126": 9,
    "Landingsveien 128": 9, "Landingsveien 130": 9, "Landingsveien 132": 9,
    "Landingsveien 134": 9, "Landingsveien 136": 9, "Landingsveien 138": 9,
  };
  Object.assign(cache, counts);
  antallPerAdresseCache = cache;
  return cache;
}

/**
 * Forventet kWh per år for en konkret andel basert på Elvia-data per adresse,
 * pluss et flat tillegg for fellesareal og estimatusikkerhet (slik at sum av
 * alle 430 andeler treffer borettslagets totalforbruk på ~6 000 000 kWh).
 */
export function forventetKWhForAndel(andel: Andel): number {
  const adresseTotal = ELVIA_PER_ADRESSE[andel.adresse];
  const counts = antallPerAdresse();
  const antall = counts[andel.adresse];
  if (adresseTotal && antall) {
    return Math.round(adresseTotal / antall + DIFF_FLAT_KWH_PER_ANDEL);
  }
  // Fallback til areal-fordeling hvis adressen mangler i Elvia-datasettet.
  return forventetKWhForAreal(andel.areal);
}

/** Forventet kWh basert på areal (areal-fordeling av borettslagets totalforbruk). */
export function forventetKWhForAreal(areal: number): number {
  return Math.round((felles.totalForbrukKWh / felles.totaltAreal) * areal);
}

/**
 * Personlig P1-besparelse: bedre fasadeisolasjon reduserer oppvarmingsbehovet.
 * Beregningsgrunnlag:
 *   - Byggforsk: ~75 % av totalt forbruk er oppvarming/varmtvann
 *   - Pakke 1 reduserer oppvarmingen med ~11,6 % (500 000 / 4 300 000 kWh)
 */
export function personligStromBesparelseP1(kWhFaktisk: number): number {
  if (!Number.isFinite(kWhFaktisk) || kWhFaktisk <= 0) return 0;
  const oppvarming = felles.byggforskOppvarmingsAndel * kWhFaktisk;
  const sparteKWh = oppvarming * P1_REDUKSJONS_FAKTOR;
  return (sparteKWh * felles.stromPrisKrPerKWh) / 12;
}

/**
 * Personlig P2-besparelse, splittet i to deler:
 *   1) Oppvarming: bergvarme reduserer ~75 % av oppvarmingsbehovet (COP 4-5)
 *   2) Solceller: produksjon på 978 180 kWh/år fordeles etter brøk (offsetter
 *      fellesareal-strøm som påvirker felleskostnaden via brøk).
 *
 * Returnerer både totalsum og delene, så vi kan vise dem hver for seg.
 */
export function personligP2Besparelse(
  kWhFaktisk: number,
  brok: number,
): { total: number; oppvarming: number; solceller: number } {
  const oppvarmingsBesp = (() => {
    if (!Number.isFinite(kWhFaktisk) || kWhFaktisk <= 0) return 0;
    const oppvarming = felles.byggforskOppvarmingsAndel * kWhFaktisk;
    const sparteKWh = oppvarming * felles.bergvarmeReduserer;
    return (sparteKWh * felles.stromPrisKrPerKWh) / 12;
  })();
  const solcellerBesp =
    (felles.solcelleProduksjonKWh * felles.stromPrisKrPerKWh * brok) / 12;
  return {
    oppvarming: oppvarmingsBesp,
    solceller: solcellerBesp,
    total: oppvarmingsBesp + solcellerBesp,
  };
}

/**
 * Personlig P1-besparelse-detaljer (for konsistent bruk i UI).
 */
export function personligP1Besparelse(kWhFaktisk: number): {
  total: number;
  oppvarming: number;
} {
  const total = personligStromBesparelseP1(kWhFaktisk);
  return { total, oppvarming: total };
}

/**
 * Beregner ny FK brutto + netto basert på areal-fordelt eller personlig
 * strømbesparelse. "Brutto" = ny felleskostnad uten fradrag. "Netto" = brutto
 * minus strømbesparelse minus skattefradrag år 1.
 *
 * Når kWhFaktisk er null/0, brukes Excel-arkets areal-fordelte besparelse.
 */
export type FkBeregning = {
  brutto: number;
  stromBesp: number;
  skattefradrag: number;
  netto: number;
};

export function beregnFkP1(andel: Andel, kWhFaktisk?: number): FkBeregning {
  const brutto = andel.p1.nyFu;
  const arealBesp = Math.abs(andel.p1.stromBesp);
  const personligBesp =
    kWhFaktisk && kWhFaktisk > 0 ? personligStromBesparelseP1(kWhFaktisk) : 0;
  const stromBesp = personligBesp > 0 ? personligBesp : arealBesp;
  const skattefradrag = Math.abs(andel.p1.skfrAr1);
  return {
    brutto,
    stromBesp,
    skattefradrag,
    netto: brutto - stromBesp - skattefradrag,
  };
}

export function beregnFkP2(andel: Andel, kWhFaktisk?: number): FkBeregning {
  const brutto = andel.p2.nyFu;
  const arealBesp = Math.abs(andel.p2.stromBesp);
  const personligBesp =
    kWhFaktisk && kWhFaktisk > 0
      ? personligP2Besparelse(kWhFaktisk, andel.brok).total
      : 0;
  const oppvarmingsBesp = personligBesp > 0 ? personligBesp : arealBesp;
  const solenergi = solenergiKrMndForBrok(andel.brok);
  const stromBesp = oppvarmingsBesp + solenergi;
  const skattefradrag = Math.abs(andel.p2.skfrAr1);
  return {
    brutto,
    stromBesp,
    skattefradrag,
    netto: brutto - stromBesp - skattefradrag,
  };
}
