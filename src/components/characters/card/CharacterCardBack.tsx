import { cn } from '@/lib/utils';

interface CharacterCardBackProps {
  className?: string;
}

const CharacterCardBack = ({ className }: CharacterCardBackProps) => (
  <div className={cn('p-4 rounded-lg', className)}></div>
);

export default CharacterCardBack;
