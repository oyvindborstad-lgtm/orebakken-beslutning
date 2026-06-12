export type RenteBaneId = "r1" | "r2" | "r3";
export type PakkeId = "p1" | "p2";

export type RenteBaneTall = {
  nyFu: number;
  okning: number;
  stromBesp: number;
  skfrAr1: number;
  nettoAr1: number;
  nettoSnitt: number;
  solenergi?: number;
};

export type PakkeData = {
  r1: RenteBaneTall;
  r2: RenteBaneTall;
  r3: RenteBaneTall;
};

export type Andel = {
  andelsnr: number;
  leilNr: number;
  adresse: string;
  areal: number;
  brok: number;
  dagensFu: number;
  p1: PakkeData;
  p2: PakkeData;
};
