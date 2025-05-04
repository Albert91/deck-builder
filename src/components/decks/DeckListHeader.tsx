import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DeckLimitInfo } from '../../types';

interface DeckListHeaderProps {
  totalDecks: number;
  deckLimit: number;
  onCreateDeck: () => void;
}

export function DeckListHeader({ totalDecks, deckLimit, onCreateDeck }: DeckListHeaderProps) {
  const hasReachedLimit = totalDecks >= deckLimit;
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 mb-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moje talie</h1>
        <p className="text-muted-foreground mt-1">
          Wykorzystano: <span className={`font-medium ${hasReachedLimit ? 'text-destructive' : ''}`}>
            {totalDecks}/{deckLimit}
          </span>
        </p>
      </div>
      
      <Button 
        onClick={onCreateDeck} 
        disabled={hasReachedLimit}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Utwórz nową talię
      </Button>
      
      {hasReachedLimit && (
        <p className="text-xs text-destructive mt-1 sm:hidden">
          Osiągnięto limit talii. Usuń jedną z istniejących talii, aby utworzyć nową.
        </p>
      )}
    </div>
  );
} 