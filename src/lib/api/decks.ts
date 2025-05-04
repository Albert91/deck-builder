import type { DeckLimitInfo } from '../../types';

/**
 * Fetches information about the user's deck limit
 */
export async function fetchDeckLimit(): Promise<DeckLimitInfo> {
  try {
    const response = await fetch('/api/decks/count');
    
    if (!response.ok) {
      throw new Error('Nie udało się pobrać informacji o limicie');
    }
    
    const data: DeckLimitInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Błąd podczas pobierania limitu talii:', error);
    // Default values in case of error
    return { totalDecks: 0, deckLimit: 5 };
  }
} 