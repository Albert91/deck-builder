import { CardItem } from './CardItem';
import type { CardViewModel } from '@/types';

interface CardGridProps {
  cards: CardViewModel[];
  onCardOptionsClick: (option: string, card: CardViewModel) => void;
}

export function CardGrid({ cards, onCardOptionsClick }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} onOptionsClick={onCardOptionsClick} />
      ))}
    </div>
  );
}
