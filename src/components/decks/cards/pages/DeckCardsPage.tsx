import { useEffect, useState } from 'react';
import { DeckCardsHeader } from '../../DeckCardsHeader';
import { CardActionBar } from '../CardActionBar';
import { CardGrid } from '../CardGrid';
import { EmptyState } from '../EmptyState';
import { ErrorState } from '../../../common/ErrorState';
import { LoadingState } from '../../../common/LoadingState';
import { Pagination } from '../Pagination';
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog';
import { useCardList } from '@/hooks/useCardList';
import * as deckApi from '@/lib/api/decks';
import type { CardViewModel, DeckDTO, DeckViewModel } from '@/types';

interface DeckCardsPageProps {
  deckId: string;
}

export default function DeckCardsPage({ deckId }: DeckCardsPageProps) {
  const {
    cards,
    pagination,
    filters,
    isLoading,
    error,
    showDeleteDialog,
    cardToDelete,
    exportStatus,
    fetchCards,
    addCard,
    editCard,
    duplicateCard,
    showDeleteConfirmation,
    cancelDelete,
    confirmDelete,
    changePage,
    exportToPdf,
    shareDeck,
    toggleCardSide
  } = useCardList(deckId);

  const [deck, setDeck] = useState<DeckDTO | null>(null);
  const [deckError, setDeckError] = useState<string | null>(null);
  const [isDeckLoading, setIsDeckLoading] = useState(true);
  const [cardTitle, setCardTitle] = useState<string>('');

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

  useEffect(() => {
    fetchCards();

    // Find card title when a card is selected for deletion
    if (cardToDelete) {
      const card = cards.find((c: CardViewModel) => c.id === cardToDelete);
      if (card) {
        setCardTitle(card.title);
      }
    }
  }, [fetchCards, cardToDelete, cards]);

  // Helper for card limit display info
  const cardLimitInfo = {
    totalCards: pagination.totalItems,
    cardLimit: 100
  };

  // Show combined loading state
  if ((isLoading && !cards.length) || isDeckLoading) {
    return <LoadingState />;
  }

  // Show error state for card loading
  if (error && !cards.length) {
    return <ErrorState message={error} onRetry={fetchCards} />;
  }

  // Show error state for deck loading
  if (deckError) {
    return <ErrorState message={deckError} onRetry={() => window.location.reload()} />;
  }

  if (!deck) {
    return <ErrorState message="Nie można załadować talii" onRetry={() => window.location.reload()} />;
  }

  // Create deck view model
  const deckViewModel: DeckViewModel = {
    ...deck,
    cardCount: pagination.totalItems,
    thumbnailUrl: deck.image_metadata_id 
      ? `/api/images/${deck.image_metadata_id}` 
      : '/placeholders/deck-cover.png'
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <DeckCardsHeader 
        deck={deckViewModel}
        cardLimitInfo={cardLimitInfo}
        onExport={exportToPdf}
        onShare={shareDeck}
        exportStatus={exportStatus}
      />

      <CardActionBar 
        cardCount={pagination.totalItems}
        maxLimit={100}
        isCardSideBack={filters.isCardSideBack}
        onAddCard={addCard}
        onToggleCardSide={toggleCardSide}
      />

      {cards.length > 0 ? (
        <>
          <CardGrid
            cards={cards}
            isCardSideBack={filters.isCardSideBack}
            onCardEdit={editCard}
            onCardDuplicate={duplicateCard}
            onCardDelete={showDeleteConfirmation}
          />
          
          <Pagination 
            pagination={pagination}
            onPageChange={changePage}
            itemName="kart"
          />
        </>
      ) : (
        <EmptyState onAddCard={addCard} />
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