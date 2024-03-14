import { Character } from '@/domain/core/Character';
import { Side } from '@/domain/core/Side';
import { cn } from '@/lib/utils';
import { BACKGROUND_COLOR_SIDE_MAP } from './config';

interface CharacterCardFrontProps {
  character: Character;
  className?: string;
}

const CharacterCardFront = ({
  character,
  className,
}: CharacterCardFrontProps) => (
  <div
    className={cn(
      'aspect-[5/7] p-4 rounded-lg drop-shadow-xl drop-shadow-gray-500 hover:scale-105 transition-transform',
      BACKGROUND_COLOR_SIDE_MAP[character.side],
      className,
    )}
  >
    <div className="flex flex-col h-full bg-white/20 gap-2 text-white">
      <section
        className={cn(
          'self-center flex flex-col items-center text-center px-4 pb-1',
          BACKGROUND_COLOR_SIDE_MAP[character.side],
        )}
      >
        <h5 className="text-2xl font-bold text-white">{character.name}</h5>
        <p className="text-lg text-white">{character.originalGreekName}</p>
      </section>
      <section className="flex-1 flex flex-col justify-end items-center">
        <section className="flex gap-4 self-stretch">
          <section className="flex-1 flex flex-col gap-1 items-center text-center">
            <p className="text-sm">Origin</p>
            <p>{character.origin}</p>
          </section>
          <section className="flex-1 flex flex-col gap-1 items-center text-center">
            <p className="text-sm">Father</p>
            <p>{character.father}</p>
          </section>
        </section>
      </section>
      <section className="flex justify-between px-2">
        <p className="font-bold text-white">{character.mortality}</p>
        <p className="font-bold text-white">
          {character.side === Side.None ? 'Neutral' : character.side}
        </p>
      </section>
    </div>
  </div>
);

export default CharacterCardFront;
