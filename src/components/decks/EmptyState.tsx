import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreateDeck: () => void;
  hasFilters?: boolean;
}

export function EmptyState({ onCreateDeck, hasFilters = false }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <Plus className="h-10 w-10 text-muted-foreground" />
      </div>
      
      {hasFilters ? (
        <>
          <h3 className="text-lg font-semibold mb-2">Brak wyników wyszukiwania</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Nie znaleziono talii pasujących do podanych kryteriów. Zmień parametry wyszukiwania lub utwórz nową talię.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2">Nie masz jeszcze żadnych talii</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Utwórz swoją pierwszą talię, aby rozpocząć tworzenie kart.
          </p>
        </>
      )}
      
      <Button onClick={onCreateDeck} className="gap-2">
        <Plus className="h-4 w-4" />
        Utwórz {hasFilters ? 'nową' : 'pierwszą'} talię
      </Button>
    </div>
  );
} 