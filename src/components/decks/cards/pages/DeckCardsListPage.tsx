import { useEffect, useState } from 'react';
import { DeckCardsHeader } from '../../DeckCardsHeader';
import { CardGrid } from '../CardGrid';
import { EmptyState } from '../EmptyState';
import { ErrorState } from '../../../common/ErrorState';
import { LoadingState } from '../../../common/LoadingState';
import { Pagination } from '../Pagination';
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog';
import { useCardList } from '@/hooks/useCardList';
import * as deckApi from '@/lib/api/decks';
import type { CardViewModel, DeckDTO, DeckViewModel } from '@/types';

interface DeckCardsListPageProps {
  deckId: string;
}

export default function DeckCardsListPage({ deckId }: DeckCardsListPageProps) {
  const {
    cards,
    pagination,
    isLoading,
    error,
    showDeleteDialog,
    exportStatus,
    fetchCards,
    addCard,
    editCard,
    showDeleteConfirmation,
    cancelDelete,
    confirmDelete,
    changePage,
    exportToPdf,
    shareDeck,
  } = useCardList(deckId);

  const [deck, setDeck] = useState<DeckDTO | null>(null);
  const [deckError, setDeckError] = useState<string | null>(null);
  const [isDeckLoading, setIsDeckLoading] = useState(true);
  const [cardTitle] = useState<string>('');

  // Fetch deck details
  useEffect(() => {
    async function fetchDeckData() {
      setIsDeckLoading(true);
      setDeckError(null);

      try {
        const deckData = await deckApi.getDeckById(deckId);
        setDeck(deckData);
      } catch (err) {
        setDeckError(err instanceof Error ? err.message : 'Failed to fetch deck');
        console.error('Error fetching deck:', err);
      } finally {
        setIsDeckLoading(false);
      }
    }

    fetchDeckData();
  }, [deckId]);

  // Handler for card options
  const handleCardOptionsClick = (option: string, card: CardViewModel) => {
    switch (option) {
      case 'edit':
        editCard(card.id);
        break;
      case 'delete':
        showDeleteConfirmation(card.id);
        break;
      default:
        console.warn(`Unknown card option: ${option}`);
    }
  };

  // Helper for card limit display info
  const limitInfo = {
    totalCards: pagination.totalItems,
    cardLimit: 100,
  };

  // Create deck view model if deck data is available
  const deckViewModel: DeckViewModel | undefined = deck
    ? {
        ...deck,
        cardCount: pagination.totalItems,
        thumbnailUrl: deck.image_metadata_id ? `/api/images/${deck.image_metadata_id}` : '/placeholders/deck-cover.png',
      }
    : undefined;

  // Determine if we're ready to show content
  const isContentReady = !isDeckLoading && deck !== null && !deckError;
  const isEmpty = !isLoading && !error && (!cards || cards.length === 0);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {isContentReady && deckViewModel && (
        <>
          <DeckCardsHeader
            deck={deckViewModel}
            totalCards={limitInfo.totalCards}
            cardLimit={limitInfo.cardLimit}
            onExport={exportToPdf}
            onShare={shareDeck}
            exportStatus={exportStatus}
            onCreateCard={addCard}
          />
        </>
      )}

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCards} />
      ) : isEmpty ? (
        <EmptyState onAddCard={addCard} />
      ) : (
        <>
          <CardGrid cards={cards} onCardOptionsClick={handleCardOptionsClick} />

          <Pagination pagination={pagination} onPageChange={changePage} itemName="cards" />
        </>
      )}

      {showDeleteDialog && (
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          cardTitle={cardTitle}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
