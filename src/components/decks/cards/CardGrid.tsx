import { CardItem } from "./CardItem";
import type { CardViewModel } from "@/types";

interface CardGridProps {
  cards: CardViewModel[];
  isCardSideBack: boolean;
  onCardOptionsClick: (option: string, card: CardViewModel) => void;
}

export function CardGrid({
  cards,
  isCardSideBack,
  onCardOptionsClick
}: CardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map(card => (
        <CardItem
          key={card.id}
          card={card}
          isCardSideBack={isCardSideBack}
          onOptionsClick={onCardOptionsClick}
        />
      ))}
    </div>
  );
} 