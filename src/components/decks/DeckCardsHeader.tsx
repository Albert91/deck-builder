import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { DeckViewModel, ExportStatus } from '@/types';
import { Plus } from 'lucide-react';
import { LimitDisplay } from '../common/LimitDisplay';

interface DeckCardsHeaderProps {
  deck: DeckViewModel;
  totalCards: number;
  cardLimit: number;
  exportStatus: ExportStatus;
  onExport: () => void;
  onShare: () => void;
  onCreateCard: () => void;
}

export function DeckCardsHeader({
  deck,
  totalCards,
  cardLimit,
  exportStatus,
  onExport,
  onShare,
  onCreateCard,
}: DeckCardsHeaderProps) {
  const hasReachedLimit = totalCards >= cardLimit;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 mb-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Deck: {deck.name}</h1>
        <LimitDisplay currentCount={totalCards} title="Cards" maxLimit={cardLimit} />
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onCreateCard} disabled={hasReachedLimit} className="gap-2">
          <Plus className="h-4 w-4" />
          Create new card
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onShare} disabled={totalCards === 0}>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </Button>
          </TooltipTrigger>
          <TooltipContent>{totalCards === 0 ? 'Cannot share empty deck' : 'Share deck with others'}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
