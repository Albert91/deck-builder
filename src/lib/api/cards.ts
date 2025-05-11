import type { CardDTO, CardListResponseDTO, CreateCardCommand, UpdateCardCommand } from '@/types';

/**
 * Fetches a list of cards for a specific deck
 */
export async function getCardList(deckId: string, page = 1, limit = 20): Promise<CardListResponseDTO> {
  const response = await fetch(`/api/decks/${deckId}/cards?page=${page}&limit=${limit}`);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Brak dostępu do talii');
    } else if (response.status === 404) {
      throw new Error('Talia nie istnieje');
    } else {
      throw new Error('Wystąpił błąd podczas pobierania kart');
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
      throw new Error('Karta nie istnieje');
    } else {
      throw new Error('Wystąpił błąd podczas pobierania karty');
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
      throw new Error('Osiągnięto limit 100 kart');
    } else {
      throw new Error('Wystąpił błąd podczas tworzenia karty');
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
    throw new Error('Wystąpił błąd podczas aktualizacji karty');
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
    throw new Error('Nie udało się usunąć karty');
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
      throw new Error('Osiągnięto limit 100 kart');
    } else {
      throw new Error('Nie udało się zduplikować karty');
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
    throw new Error('Nie udało się wyeksportować talii');
  }

  return await response.blob();
}
