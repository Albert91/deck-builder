import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LimitDisplay } from '../common/LimitDisplay';

interface DeckListHeaderProps {
  totalDecks: number;
  deckLimit: number;
  onCreateDeck: () => void;
}

export function DeckListHeader({ totalDecks, deckLimit, onCreateDeck }: DeckListHeaderProps) {
  const hasReachedLimit = totalDecks >= deckLimit;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 mb-2">
      <LimitDisplay currentCount={totalDecks} title="Decks" maxLimit={deckLimit} />

      <Button onClick={onCreateDeck} disabled={hasReachedLimit} className="gap-2">
        <Plus className="h-4 w-4" />
        Create new deck
      </Button>

      {hasReachedLimit && (
        <p className="text-xs text-destructive mt-1 sm:hidden">
          Deck limit reached. Delete one of the existing decks to create a new one.
        </p>
      )}
    </div>
  );
}
