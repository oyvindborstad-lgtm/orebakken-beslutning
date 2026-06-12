import { FORUTSETNINGER } from "../data/forutsetninger";
import {
  DIFF_FLAT_KWH_PER_ANDEL,
  ELVIA_PER_ADRESSE,
} from "../data/forbruk";
import type { Andel, PakkeId, RenteBaneId, RenteBaneTall } from "./types";

const { felles, pakke1, pakke2 } = FORUTSETNINGER;

const P1_REDUKSJONS_FAKTOR = pakke1.energibesparelseKWh / felles.oppvarmingTotalKWh;

export const TOTAL_SOLAR_VERDI_KR_AR =
  felles.solcelleProduksjonKWh * felles.stromPrisKrPerKWh;

export function solenergiKrMndForAndel(_brok: number, areal: number): number {
  return ((areal / felles.totaltAreal) * TOTAL_SOLAR_VERDI_KR_AR) / 12;
}

export function solenergiKrMndForBrok(brok: number): number {
  const snittAreal = felles.totaltAreal / felles.antallAndeler;
  return solenergiKrMndForAndel(brok, snittAreal);
}

export function solenergiKWhForBrok(brok: number): number {
  return brok * felles.solcelleProduksjonKWh;
}

export function getPakkeRente(
  andel: Andel,
  pakkeId: PakkeId,
  rente: RenteBaneId,
): RenteBaneTall {
  return andel[pakkeId][rente];
}

let antallPerAdresseCache: Record<string, number> | null = null;

function antallPerAdresse(): Record<string, number> {
  if (antallPerAdresseCache) return antallPerAdresseCache;
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
  antallPerAdresseCache = counts;
  return counts;
}

export function forventetKWhForAndel(andel: Andel): number {
  const adresseTotal = ELVIA_PER_ADRESSE[andel.adresse];
  const counts = antallPerAdresse();
  const antall = counts[andel.adresse];
  if (adresseTotal && antall) {
    return Math.round(adresseTotal / antall + DIFF_FLAT_KWH_PER_ANDEL);
  }
  return forventetKWhForAreal(andel.areal);
}

export function forventetKWhForAreal(areal: number): number {
  return Math.round((felles.totalForbrukKWh / felles.totaltAreal) * areal);
}

export function personligStromBesparelseP1(kWhFaktisk: number): number {
  if (!Number.isFinite(kWhFaktisk) || kWhFaktisk <= 0) return 0;
  const oppvarming = felles.byggforskOppvarmingsAndel * kWhFaktisk;
  const sparteKWh = oppvarming * P1_REDUKSJONS_FAKTOR;
  return (sparteKWh * felles.stromPrisKrPerKWh) / 12;
}

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

export function personligP1Besparelse(kWhFaktisk: number): {
  total: number;
  oppvarming: number;
} {
  const total = personligStromBesparelseP1(kWhFaktisk);
  return { total, oppvarming: total };
}

export type FkBeregning = {
  brutto: number;
  stromBesp: number;
  skattefradrag: number;
  netto: number;
};

export function beregnFkP1(
  andel: Andel,
  rente: RenteBaneId = "r1",
  kWhFaktisk?: number,
): FkBeregning {
  const r = andel.p1[rente];
  const brutto = r.nyFu;
  const arealBesp = Math.abs(r.stromBesp);
  const personligBesp =
    kWhFaktisk && kWhFaktisk > 0 ? personligStromBesparelseP1(kWhFaktisk) : 0;
  const stromBesp = personligBesp > 0 ? personligBesp : arealBesp;
  const skattefradrag = Math.abs(r.skfrAr1);
  return { brutto, stromBesp, skattefradrag, netto: brutto - stromBesp - skattefradrag };
}

export function beregnFkP2(
  andel: Andel,
  rente: RenteBaneId = "r1",
  kWhFaktisk?: number,
): FkBeregning {
  const r = andel.p2[rente];
  const brutto = r.nyFu;
  const arealBesp = Math.abs(r.stromBesp);
  const personligBesp =
    kWhFaktisk && kWhFaktisk > 0
      ? personligP2Besparelse(kWhFaktisk, andel.brok).total
      : 0;
  const oppvarmingsBesp = personligBesp > 0 ? personligBesp : arealBesp;
  const solenergi = solenergiKrMndForAndel(andel.brok, andel.areal);
  const stromBesp = oppvarmingsBesp + solenergi;
  const skattefradrag = Math.abs(r.skfrAr1);
  return { brutto, stromBesp, skattefradrag, netto: brutto - stromBesp - skattefradrag };
}

/** Pakke 2 m/utvidet Enova-støtte 33,78 mill: lån ned til 307,9 mill, kun 5,04 %. */
export function beregnFkP2Utvidet(andel: Andel): FkBeregning {
  const r = andel.p2.r1;
  const reduksjonsAndel = (pakke2.laneSum - pakke2.laneSumUtvidet) / pakke2.laneSum;
  const arligTerminDiff = pakke2.rentebaner.r1.arligTermin - pakke2.utvidetEnova.arligTermin;
  const brutto = r.nyFu - (arligTerminDiff * andel.brok) / 12;
  const stromBesp = Math.abs(r.stromBesp) + solenergiKrMndForAndel(andel.brok, andel.areal);
  const skattefradrag = Math.abs(r.skfrAr1) * (1 - reduksjonsAndel);
  return { brutto, stromBesp, skattefradrag, netto: brutto - stromBesp - skattefradrag };
}
