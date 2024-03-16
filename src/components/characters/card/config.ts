import { Side } from '@/domain/core/Side';

export const BACKGROUND_COLOR_SIDE_MAP: Record<Side, string> = {
  [Side.Greek]: 'bg-orange-400',
  [Side.Trojan]: 'bg-purple-400',
  [Side.None]: 'bg-amber-300',
};
