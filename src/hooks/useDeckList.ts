import { useEffect, useState } from 'react';
import type { 
  DeckViewModel, 
  DeckListParams,
  DeckListResponseDTO
} from '../types';

/**
 * Custom hook for managing deck list state and fetching data
 */
export function useDeckList(initialParams: DeckListParams = {}) {
  // State
  const [decks, setDecks] = useState<DeckViewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<DeckListParams>(initialParams);

  // Fetch decks with provided parameters
  const fetchDecks = async (queryParams: DeckListParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build URL parameters
      const urlParams = new URLSearchParams({
        ...(queryParams.search ? { search: queryParams.search } : {}),
        ...(queryParams.sortBy ? { sortBy: queryParams.sortBy } : {}),
        ...(queryParams.sortOrder ? { sortOrder: queryParams.sortOrder } : {})
      });
      
      // API call
      const response = await fetch(`/api/decks?${urlParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: DeckListResponseDTO = await response.json();
      
      // Map DTO to ViewModel
      const deckViewModels: DeckViewModel[] = data.items.map(deck => ({
        ...deck,
        cardCount: 0, // This should be provided by API or fetched separately
        thumbnailUrl: `/assets/deck-thumbnails/${deck.id}.jpg` // Example path
      }));
      
      setDecks(deckViewModels);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Wystąpił nieznany błąd'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch decks when parameters change
  useEffect(() => {
    fetchDecks(params);
  }, [params]);

  // Save user preferences in localStorage
  useEffect(() => {
    localStorage.setItem('deckListPreferences', JSON.stringify({
      sortBy: params.sortBy,
      sortOrder: params.sortOrder
    }));
  }, [params.sortBy, params.sortOrder]);

  // Parameter update methods
  const setSearch = (search: string) => setParams(prev => ({ ...prev, search }));
  const setSortBy = (sortBy: string) => setParams(prev => ({ ...prev, sortBy }));
  const setSortOrder = (sortOrder: 'asc' | 'desc') => setParams(prev => ({ ...prev, sortOrder }));

  return {
    decks,
    isLoading,
    error,
    params,
    setSearch,
    setSortBy,
    setSortOrder,
    refetch: () => fetchDecks(params)
  };
} 