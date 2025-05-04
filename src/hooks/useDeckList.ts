import { useEffect, useState } from 'react';
import type { 
  DeckViewModel, 
  DeckListParams,
  DeckListResponseDTO,
  PaginationModel
} from '../types';

/**
 * Custom hook for managing deck list state and fetching data
 */
export function useDeckList(initialParams: DeckListParams = { page: 1, limit: 12 }) {
  // State
  const [decks, setDecks] = useState<DeckViewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<DeckListParams>(initialParams);
  const [pagination, setPagination] = useState<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: initialParams.limit || 12
  });

  // Fetch decks with provided parameters
  const fetchDecks = async (queryParams: DeckListParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build URL parameters
      const urlParams = new URLSearchParams({
        page: String(queryParams.page || 1),
        limit: String(queryParams.limit || 12),
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
      setPagination({
        currentPage: queryParams.page || 1,
        totalPages: Math.ceil(data.totalCount / (queryParams.limit || 12)),
        totalItems: data.totalCount,
        itemsPerPage: queryParams.limit || 12
      });
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
      sortOrder: params.sortOrder,
      limit: params.limit
    }));
  }, [params.sortBy, params.sortOrder, params.limit]);

  // Parameter update methods
  const setPage = (page: number) => setParams(prev => ({ ...prev, page }));
  const setLimit = (limit: number) => setParams(prev => ({ ...prev, limit, page: 1 }));
  const setSearch = (search: string) => setParams(prev => ({ ...prev, search, page: 1 }));
  const setSortBy = (sortBy: string) => setParams(prev => ({ ...prev, sortBy, page: 1 }));
  const setSortOrder = (sortOrder: 'asc' | 'desc') => setParams(prev => ({ ...prev, sortOrder, page: 1 }));

  return {
    decks,
    isLoading,
    error,
    pagination,
    params,
    setPage,
    setLimit,
    setSearch,
    setSortBy,
    setSortOrder,
    refetch: () => fetchDecks(params)
  };
} 