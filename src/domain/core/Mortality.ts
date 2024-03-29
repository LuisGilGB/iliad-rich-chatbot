export enum Mortality {
  Mortal = 'Mortal',
  God = 'God',
  Titan = 'Titan',
}

export const MORTALITY_EN_MAP: Record<Mortality, string> = {
  [Mortality.Mortal]: 'Mortal',
  [Mortality.God]: 'God',
  [Mortality.Titan]: 'Titan',
};

export const MORTALITY_ES_MAP: Record<Mortality, string> = {
  [Mortality.Mortal]: 'Mortal',
  [Mortality.God]: 'Dios',
  [Mortality.Titan]: 'Titán',
};
