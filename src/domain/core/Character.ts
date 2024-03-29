import { Mortality } from '@/domain/core/Mortality';
import { Side } from './Side';

export type Character = {
  name: string;
  originalGreekName?: string;
  mortality: `${Mortality}`;
  side: `${Side}`;
  origin: string;
  father: string;
  survives: boolean;
};
