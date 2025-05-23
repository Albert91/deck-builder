import { useState, useCallback, useEffect } from 'react';
import type { CardViewModel, PaginationModel, CardFilterState, CardDTO } from '@/types';
import * as cardApi from '@/lib/api/cards';
import * as deckApi from '@/lib/api/decks';

export function useCardList(deckId: string) {
  // Basic state
  const [cards, setCards] = useState<CardViewModel[]>([]);
  const [pagination, setPagination] = useState<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });
  const [filters, setFilters] = useState<CardFilterState>({
    page: 1,
    limit: 20,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Data fetching function
  const fetchCards = useCallback(async () => {
    if (!deckId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await cardApi.getCardList(deckId, filters.page, filters.limit);

      // Transform cards to CardViewModel
      const transformedCards = data.items.map(
        (card: CardDTO): CardViewModel => ({
          ...card,
          thumbnailUrl: card.image_data?.url ?? '/images/default-card-back.jpeg',
        })
      );

      setCards(transformedCards);
      setPagination({
        currentPage: data.page,
        totalPages: Math.ceil(data.totalCount / data.limit),
        totalItems: data.totalCount,
        itemsPerPage: data.limit,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  }, [deckId, filters.page, filters.limit]);

  // Card actions
  const addCard = useCallback(() => {
    window.location.href = `/decks/${deckId}/cards/new`;
  }, [deckId]);

  const editCard = useCallback(
    (cardId: string) => {
      window.location.href = `/decks/${deckId}/cards/${cardId}/edit`;
    },
    [deckId]
  );

  const deleteCard = useCallback(async () => {
    if (!deckId || !cardToDelete) return;

    setIsLoading(true);
    setError(null);

    try {
      await cardApi.deleteCard(deckId, cardToDelete);

      // Refresh the card list
      await fetchCards();

      // Close the delete dialog
      setShowDeleteDialog(false);
      setCardToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  }, [deckId, cardToDelete, fetchCards]);

  // Pagination functions
  const changePage = useCallback((page: number) => {
    setFilters((prev: CardFilterState) => ({ ...prev, page }));
  }, []);

  const shareDeck = useCallback(async () => {
    if (!deckId) return;

    try {
      const result = await deckApi.shareDeck(deckId);

      // Create a temporary input to copy the URL to clipboard
      const input = document.createElement('input');
      input.value = result.shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);

      // Show success notification
      alert('Link do talii został skopiowany do schowka');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Nie udało się udostępnić talii');
    }
  }, [deckId]);

  const showDeleteConfirmation = useCallback((cardId: string) => {
    setCardToDelete(cardId);
    setShowDeleteDialog(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
    setCardToDelete(null);
  }, []);

  // Initialize the card list
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return {
    cards,
    pagination,
    filters,
    isLoading,
    error,
    showDeleteDialog,
    cardToDelete,
    fetchCards,
    addCard,
    editCard,
    showDeleteConfirmation,
    cancelDelete,
    confirmDelete: deleteCard,
    changePage,
    shareDeck,
  };
}
