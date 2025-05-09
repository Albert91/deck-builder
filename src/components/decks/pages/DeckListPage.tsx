import { useEffect, useState } from 'react';
import { useDeckList } from '../../../hooks/useDeckList';
import { fetchDeckLimit } from '../../../lib/api/decks';
import type { DeckLimitInfo, DeckSortOption, DeckViewModel } from '../../../types';

import { DeckListHeader } from '../DeckListHeader';
import { DeckFilterBar } from '../DeckFilterBar';
import { DeckGrid } from '../DeckGrid';
import { LoadingState } from '../../common/LoadingState';
import { ErrorState } from '../../common/ErrorState';
import { EmptyState } from '../DeckEmptyState';

// Default sort options
const sortOptions: DeckSortOption[] = [
  { id: 'updated', label: 'Data aktualizacji', value: 'updated_at' },
  { id: 'created', label: 'Data utworzenia', value: 'created_at' },
  { id: 'name', label: 'Nazwa', value: 'name' },
];

export default function DeckListPage() {
  const [limitInfo, setLimitInfo] = useState<DeckLimitInfo>({ totalDecks: 0, deckLimit: 5 });
  const [isLimitLoading, setIsLimitLoading] = useState(true);
  
  // Get deck list data from custom hook
  const {
    decks,
    isLoading,
    error,
    params,
    setSearch,
    setSortBy,
    setSortOrder,
    refetch
  } = useDeckList({ 
    sortBy: 'updated_at',
    sortOrder: 'desc',
    search: ''
  });
  
  // Load deck limit info
  useEffect(() => {
    const getLimitInfo = async () => {
      setIsLimitLoading(true);
      try {
        const data = await fetchDeckLimit();
        setLimitInfo(data);
      } catch (err) {
        console.error('Error fetching deck limit:', err);
      } finally {
        setIsLimitLoading(false);
      }
    };
    
    getLimitInfo();
  }, []);
  
  // Navigation handlers - using window.location for Astro compatibility
  const handleCreateDeck = () => {
    window.location.href = '/decks/new';
  };
  
  const handleDeckSelect = (deckId: string) => {
    window.location.href = `/decks/${deckId}/cards`;
  };
  
  // Handle deck options
  const handleDeckOptions = (option: string, deck: DeckViewModel) => {
    switch (option) {
      case 'edit':
        window.location.href = `/decks/${deck.id}/edit`;
        break;
      case 'duplicate':
        // TODO: Implement duplication logic
        console.log('Duplicate deck:', deck.id);
        break;
      case 'share':
        // TODO: Implement sharing logic
        console.log('Share deck:', deck.id);
        break;
      case 'delete':
        // TODO: Implement deletion logic
        console.log('Delete deck:', deck.id);
        break;
      default:
        break;
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    if (filters.search !== undefined) setSearch(filters.search);
    if (filters.sortBy !== undefined) setSortBy(filters.sortBy);
    if (filters.sortOrder !== undefined) setSortOrder(filters.sortOrder);
  };
  
  // Determine if we have any active filters
  const hasActiveFilters = Boolean(params.search);
  
  // Check if decks is empty
  const isEmpty = !isLoading && !error && (!decks || decks.length === 0);
  
  return (
    <div>
      <DeckListHeader 
        totalDecks={limitInfo.totalDecks} 
        deckLimit={limitInfo.deckLimit}
        onCreateDeck={handleCreateDeck}
      />
      
      <DeckFilterBar
        filters={{
          search: params.search || '',
          sortBy: params.sortBy || 'updated_at',
          sortOrder: params.sortOrder || 'desc'
        }}
        onFilterChange={handleFilterChange}
        sortOptions={sortOptions}
      />
      
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error.toString()} onRetry={refetch} />
      ) : isEmpty ? (
        <EmptyState onCreateDeck={handleCreateDeck} hasFilters={hasActiveFilters} />
      ) : (
        <DeckGrid 
          decks={decks} 
          onDeckSelect={handleDeckSelect} 
          onDeckOptionsClick={handleDeckOptions} 
        />
      )}
    </div>
  );
} 