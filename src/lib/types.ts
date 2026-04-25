export type PakkeTall = {
  nyFu: number;
  okning: number;
  stromBesp: number;
  skfrAr1: number;
  nettoAr1: number;
  nettoSnitt: number;
};

export type Andel = {
  andelsnr: number;
  leilNr: number;
  adresse: string;
  areal: number;
  brok: number;
  dagensFu: number;
  p1: PakkeTall;
  p2: PakkeTall;
};
