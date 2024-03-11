import { Character } from '@/domain/core/Character';
import { Side } from '@/domain/core/Side';
import { cn } from '@/lib/utils';

interface CharacterCardProps {
  character: Character;
  className?: string;
}

const BACKGROUND_COLOR_SIDE_MAP: Record<Side, string> = {
  [Side.Greek]: 'bg-orange-600',
  [Side.Trojan]: 'bg-purple-600',
  [Side.None]: 'bg-amber-300',
};

const CharacterCard = ({ character, className }: CharacterCardProps) => {
  return (
    <div
      className={cn(
        'aspect-[5/7] p-4 rounded-lg drop-shadow-xl drop-shadow-gray-500 hover:scale-105 transition-transform',
        BACKGROUND_COLOR_SIDE_MAP[character.side],
        className,
      )}
    >
      <div className="flex flex-col h-full bg-white bg-/20">
        <div className="">
          <h5 className="text-2xl font-bold text-white">{character.name}</h5>
          <p className="text-lg text-white">{character.originalGreekName}</p>
        </div>
        <div className="flex-1">
          <p className="text-white">Mortality: {character.mortality}</p>
          <p className="text-white">Origin: {character.origin}</p>
          <p className="text-white">Father: {character.father}</p>
          <p className="text-white">
            Survives: {character.survives ? 'Yes' : 'No'}
          </p>
        </div>
        <div className="flex justify-end">
          <p className="text-lg font-bold text-white">{character.side}</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
