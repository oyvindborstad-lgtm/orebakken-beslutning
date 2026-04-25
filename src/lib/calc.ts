import { FORUTSETNINGER } from "../data/forutsetninger";
import type { Andel } from "./types";

const { felles, pakke1 } = FORUTSETNINGER;

const P1_REDUKSJONS_FAKTOR = pakke1.energibesparelseKWh / felles.oppvarmingTotalKWh;

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
  const stromBesp = personligBesp > 0 ? personligBesp : arealBesp;
  const skattefradrag = Math.abs(andel.p2.skfrAr1);
  return {
    brutto,
    stromBesp,
    skattefradrag,
    netto: brutto - stromBesp - skattefradrag,
  };
}
