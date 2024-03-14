import { Character } from '@/domain/core/Character';
import { cn } from '@/lib/utils';
import { BACKGROUND_COLOR_SIDE_MAP } from './config';

interface CharacterCardBackProps {
  character: Character;
  className?: string;
}

const CharacterCardBack = ({
  character,
  className,
}: CharacterCardBackProps) => (
  <div
    className={cn(
      'aspect-[5/7] p-4 rounded-lg drop-shadow-xl drop-shadow-gray-500 hover:scale-105 transition-transform',
      BACKGROUND_COLOR_SIDE_MAP[character.side],
      className,
    )}
  ></div>
);

export default CharacterCardBack;
