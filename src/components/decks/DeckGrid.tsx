import type { DeckViewModel } from '../../types';
import { DeckCard } from './DeckCard';

interface DeckGridProps {
  decks: DeckViewModel[];
  onDeckSelect: (deckId: string) => void;
  onDeckOptionsClick: (option: string, deck: DeckViewModel) => void;
}

export function DeckGrid({ decks, onDeckSelect, onDeckOptionsClick }: DeckGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {decks.map((deck) => (
        <div key={deck.id} className="h-full">
          <DeckCard 
            deck={deck} 
            onClick={() => onDeckSelect(deck.id)} 
            onOptionsClick={onDeckOptionsClick}
          />
        </div>
      ))}
    </div>
  );
} 
