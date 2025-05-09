import { CardItem } from "./CardItem";
import type { CardViewModel } from "@/types";

interface CardGridProps {
  cards: CardViewModel[];
  isCardSideBack: boolean;
  onCardEdit: (cardId: string) => void;
  onCardDuplicate: (cardId: string) => void;
  onCardDelete: (cardId: string) => void;
}

export function CardGrid({
  cards,
  isCardSideBack,
  onCardEdit,
  onCardDuplicate,
  onCardDelete
}: CardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map(card => (
        <CardItem
          key={card.id}
          card={card}
          isCardSideBack={isCardSideBack}
          onEdit={() => onCardEdit(card.id)}
          onDuplicate={() => onCardDuplicate(card.id)}
          onDelete={() => onCardDelete(card.id)}
        />
      ))}
    </div>
  );
} 