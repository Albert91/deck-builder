import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { updateCard } from './cards';
import type { UpdateCardCommand, CardDTO } from '@/types';

// Mock fetch globally
global.fetch = vi.fn();

describe('updateCard', () => {
  // Sample test data
  const deckId = 'deck-123';
  const cardId = 'card-456';
  const updateData: UpdateCardCommand = {
    title: 'Updated title1',
    description: 'Updated description',
  };

  const mockResponse: CardDTO = {
    id: cardId,
    title: 'Updated title',
    description: 'Updated description',
    image_metadata_id: 'image-123',
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-01-02T12:00:00Z',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call the API with correct URL and method', async () => {
    // Arrange
    const mockFetchResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    };
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockFetchResponse);

    // Act
    await updateCard(deckId, cardId, updateData);

    // Assert
    expect(fetch).toHaveBeenCalledWith(`/api/decks/${deckId}/cards/${cardId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
  });

  it('should return the updated card data when successful', async () => {
    // Arrange
    const mockFetchResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    };
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockFetchResponse);

    // Act
    const result = await updateCard(deckId, cardId, updateData);

    // Assert
    expect(result).toEqual(mockResponse);
    expect(mockFetchResponse.json).toHaveBeenCalled();
  });

  it('should throw an error when the API response is not OK', async () => {
    // Arrange
    const mockFetchResponse = {
      ok: false,
      status: 500,
    };
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockFetchResponse);

    // Act & Assert
    await expect(updateCard(deckId, cardId, updateData)).rejects.toThrow('Error occurred while updating the card');
  });

  it('should handle network errors properly', async () => {
    // Arrange
    (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    // Act & Assert
    await expect(updateCard(deckId, cardId, updateData)).rejects.toThrow('Network error');
  });
});
