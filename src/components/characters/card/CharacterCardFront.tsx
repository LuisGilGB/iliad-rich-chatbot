import { Character } from '@/domain/core/Character';
import { Side } from '@/domain/core/Side';
import { cn } from '@/lib/utils';
import { BACKGROUND_COLOR_SIDE_MAP } from './config';

interface CharacterCardFrontProps {
  character: Character;
  imageSrc: string;
  className?: string;
}

const CharacterCardFront = ({
  character,
  imageSrc,
  className,
}: CharacterCardFrontProps) => (
  <div className={cn('p-4 rounded-lg', className)}>
    <div className="relative size-full">
      <img
        src={imageSrc}
        alt={character.name}
        className="absolute size-full opacity-70 inset-0 object-cover object-center"
      />
      <div className="absolute size-full flex flex-col h-full bg-white/20 gap-2 text-white z-10">
        <section
          className={cn(
            'self-center flex flex-col items-center text-center px-4 pb-1 rounded-b-lg',
            BACKGROUND_COLOR_SIDE_MAP[character.side],
          )}
        >
          <h5 className="text-2xl font-bold text-white">{character.name}</h5>
          <p className="text-lg text-white">{character.originalGreekName}</p>
        </section>
        <section className="flex-1 flex flex-col justify-end items-center">
          <section className="flex gap-4 self-stretch bg-white/20 py-1">
            <section className="flex-1 flex flex-col gap-1 items-center text-center">
              <p className="text-sm">Origin</p>
              <p className="font-bold">{character.origin}</p>
            </section>
            <section className="flex-1 flex flex-col gap-1 items-center text-center">
              <p className="text-sm">Father</p>
              <p className="font-bold">{character.father}</p>
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
  </div>
);

export default CharacterCardFront;
