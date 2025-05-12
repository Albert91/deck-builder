import type { DeckLimitInfo, DeckDTO, DeckListResponseDTO, CreateDeckCommand, UpdateDeckCommand } from '@/types';

/**
 * Fetches information about the user's deck limit
 */
export async function fetchDeckLimit(): Promise<DeckLimitInfo> {
  try {
    const response = await fetch('/api/decks/count');

    if (!response.ok) {
      throw new Error('Failed to retrieve limit information');
    }

    const data: DeckLimitInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error while fetching deck limit:', error);
    // Default values in case of error
    return { totalDecks: 0, deckLimit: 5 };
  }
}

/**
 * Fetches a list of decks with pagination
 */
export async function getDeckList(
  page = 1,
  limit = 12,
  search?: string,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): Promise<DeckListResponseDTO> {
  let url = `/api/decks?page=${page}&limit=${limit}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  if (sortBy) {
    url += `&sortBy=${sortBy}`;
  }

  if (sortOrder) {
    url += `&sortOrder=${sortOrder}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch decks');
  }

  return await response.json();
}

/**
 * Fetches a single deck by ID
 */
export async function getDeckById(deckId: string): Promise<DeckDTO> {
  const response = await fetch(`/api/decks/${deckId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Deck does not exist');
    } else if (response.status === 403) {
      throw new Error('No access to deck');
    } else {
      throw new Error('Error occurred while fetching the deck');
    }
  }

  return await response.json();
}

/**
 * Creates a new deck
 */
export async function createDeck(data: CreateDeckCommand): Promise<DeckDTO> {
  const response = await fetch('/api/decks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Deck limit reached');
    } else {
      throw new Error('Failed to create deck');
    }
  }

  return await response.json();
}

/**
 * Updates an existing deck
 */
export async function updateDeck(deckId: string, data: UpdateDeckCommand): Promise<DeckDTO> {
  const response = await fetch(`/api/decks/${deckId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update deck');
  }

  return await response.json();
}

/**
 * Deletes a deck
 */
export async function deleteDeck(deckId: string): Promise<void> {
  const response = await fetch(`/api/decks/${deckId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete deck');
  }
}

/**
 * Shares a deck by generating a share link
 */
export async function shareDeck(deckId: string): Promise<{ shareUrl: string }> {
  const response = await fetch(`/api/decks/${deckId}/share`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to share deck');
  }

  return await response.json();
}
