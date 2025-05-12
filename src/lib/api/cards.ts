import type { CardDTO, CardListResponseDTO, CreateCardCommand, UpdateCardCommand } from '@/types';

/**
 * Fetches a list of cards for a specific deck
 */
export async function getCardList(deckId: string, page = 1, limit = 20): Promise<CardListResponseDTO> {
  const response = await fetch(`/api/decks/${deckId}/cards?page=${page}&limit=${limit}`);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('No access to deck');
    } else if (response.status === 404) {
      throw new Error('Deck does not exist');
    } else {
      throw new Error('Error occurred while fetching cards');
    }
  }

  return await response.json();
}

/**
 * Fetches a single card by ID
 */
export async function getCardById(deckId: string, cardId: string): Promise<CardDTO> {
  const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Card does not exist');
    } else {
      throw new Error('Error occurred while fetching the card');
    }
  }

  return await response.json();
}

/**
 * Creates a new card in a deck
 */
export async function createCard(deckId: string, data: CreateCardCommand): Promise<CardDTO> {
  const response = await fetch(`/api/decks/${deckId}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Card limit of 100 cards reached');
    } else {
      throw new Error('Error occurred while creating the card');
    }
  }

  return await response.json();
}

/**
 * Updates an existing card
 */
export async function updateCard(deckId: string, cardId: string, data: UpdateCardCommand): Promise<CardDTO> {
  const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error occurred while updating the card');
  }

  return await response.json();
}

/**
 * Deletes a card
 */
export async function deleteCard(deckId: string, cardId: string): Promise<void> {
  const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete the card');
  }
}

/**
 * Duplicates a card within a deck
 */
export async function duplicateCard(deckId: string, cardId: string): Promise<CardDTO> {
  const response = await fetch(`/api/decks/${deckId}/cards/${cardId}/duplicate`, {
    method: 'POST',
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Card limit of 100 cards reached');
    } else {
      throw new Error('Failed to duplicate the card');
    }
  }

  return await response.json();
}

/**
 * Exports a deck to PDF
 */
export async function exportDeckToPdf(deckId: string): Promise<Blob> {
  const response = await fetch(`/api/decks/${deckId}/export/pdf`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to export deck');
  }

  return await response.blob();
}
