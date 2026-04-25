import { FORUTSETNINGER } from "../data/forutsetninger";

const { felles, pakke2 } = FORUTSETNINGER;

/**
 * Personlig P2-besparelse basert på faktisk strømforbruk.
 *
 * Beregningsgrunnlag:
 * - Byggforsk: ~75 % av totalt strømforbruk går til oppvarming/varmtvann
 * - Pakke 2 erstatter ~87 % av oppvarmings-energien (3,725 / 4,3 mill kWh)
 *
 * Returnerer kr/mnd (positivt tall = besparelse).
 */
export function personligStromBesparelseP2(kWhFaktisk: number): number {
  if (!Number.isFinite(kWhFaktisk) || kWhFaktisk <= 0) return 0;
  const oppvarmingForbruk = felles.byggforskOppvarmingsAndel * kWhFaktisk;
  const reduksjonsfaktor =
    pakke2.energibesparelseKWh / felles.oppvarmingTotalKWh;
  const sparteKWh = oppvarmingForbruk * reduksjonsfaktor;
  return (sparteKWh * felles.stromPrisKrPerKWh) / 12;
}

/**
 * Forventet kWh basert på areal — som referanse til brukeren.
 * Bruker totalforbruket fordelt etter areal som baseline.
 */
export function forventetKWhForAreal(areal: number): number {
  return Math.round(
    (felles.totalForbrukKWh / felles.totaltAreal) * areal,
  );
}
