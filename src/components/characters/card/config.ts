import { Side } from '@/domain/core/Side';

export const BACKGROUND_COLOR_SIDE_MAP: Record<Side, string> = {
  [Side.Greek]: 'bg-orange-600',
  [Side.Trojan]: 'bg-purple-600',
  [Side.None]: 'bg-amber-300',
};
