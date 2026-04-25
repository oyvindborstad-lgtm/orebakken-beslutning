import andelerData from "../data/andeler.json";
import type { Andel } from "./types";

const ANDELER = andelerData as Andel[];

export function getAlleAndeler(): Andel[] {
  return ANDELER;
}

export function findAndel(input: string): Andel | null {
  const cleaned = input.trim().replace(/\s+/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;

  // Andelsnr-match (1–430)
  if (n >= 1 && n <= 430) {
    const byAndelsnr = ANDELER.find((a) => a.andelsnr === n);
    if (byAndelsnr) return byAndelsnr;
  }
  // Leilighetsnr-match (4-sifret matrikkelnr)
  const byLeilNr = ANDELER.find((a) => a.leilNr === n);
  if (byLeilNr) return byLeilNr;

  return null;
}

export function getAndelByNr(andelsnr: number): Andel | null {
  return ANDELER.find((a) => a.andelsnr === andelsnr) ?? null;
}
