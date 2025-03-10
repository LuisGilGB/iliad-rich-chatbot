'use client';
import { BACKGROUND_COLOR_SIDE_MAP } from '@/components/characters/card/config';
import { Character } from '@/domain/core/Character';
import { cn } from '@/lib/utils';
import { MouseEventHandler } from 'react';
import styles from './CharacterCard.module.css';
import CharacterCardBack from './CharacterCardBack';
import CharacterCardFront from './CharacterCardFront';

interface CharacterCardProps {
  character: Character;
  imageSrc: string;
  className?: string;
}

const flip: MouseEventHandler<HTMLDivElement> = event => {
  event.currentTarget.classList.toggle(styles.flipped);
};

const CharacterCard = ({
  character,
  imageSrc,
  className,
}: CharacterCardProps) => (
  <div
    className={cn('aspect-5/7 rounded-lg bg-white', styles.root, className)}
    onClick={flip}
  >
    <CharacterCardFront
      character={character}
      imageSrc={imageSrc}
      className={cn(
        styles.face,
        styles.front,
        BACKGROUND_COLOR_SIDE_MAP[character.side],
      )}
    />
    <CharacterCardBack
      className={cn(
        styles.face,
        styles.back,
        BACKGROUND_COLOR_SIDE_MAP[character.side],
      )}
    />
  </div>
);

export default CharacterCard;
