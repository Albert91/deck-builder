import { useState, useEffect } from 'react';
import type { CardDTO, Toast, CreateCardCommand, UpdateCardCommand } from '@/types';

export interface CardFormData {
  title: string;
  description: string;
  attributes: {
    strength: number;
    defense: number;
    health: number;
  };
  frontImageUrl?: string;
  backImageUrl?: string;
}

export const useCardForm = (deckId: string, cardId?: string) => {
  const [formData, setFormData] = useState<CardFormData>({
    title: '',
    description: '',
    attributes: { strength: 0, defense: 0, health: 0 },
    frontImageUrl: undefined,
    backImageUrl: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  // Load card if in edit mode
  useEffect(() => {
    if (cardId) {
      loadCard(deckId, cardId);
    }
  }, [deckId, cardId]);

  // Load card data from API
  const loadCard = async (deckId: string, cardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`);
      if (!response.ok) {
        throw new Error('Failed to load card');
      }
      const cardData: CardDTO = await response.json();
      setFormData({
        title: cardData.title,
        description: cardData.description || '',
        attributes: {
          strength: cardData.attributes?.find((a) => a.attribute_type === 'strength')?.value || 0,
          defense: cardData.attributes?.find((a) => a.attribute_type === 'defense')?.value || 0,
          health: cardData.attributes?.find((a) => a.attribute_type === 'health')?.value || 0,
        },
        frontImageUrl: undefined, // To be loaded separately if needed
        backImageUrl: undefined,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setToast({
        type: 'error',
        message: errorMessage,
        id: crypto.randomUUID(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new card
  const createCard = async (): Promise<string | null> => {
    if (!formData.title) {
      setError('Title is required');
      setToast({
        type: 'error',
        message: 'Please provide a title for your card',
        id: crypto.randomUUID(),
      });
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const createCommand: CreateCardCommand = {
        title: formData.title,
        description: formData.description || null,
      };
      const response = await fetch(`/api/decks/${deckId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createCommand),
      });
      if (!response.ok) {
        throw new Error('Failed to create card');
      }
      const newCard: CardDTO = await response.json();
      setToast({
        type: 'success',
        message: 'Card created successfully',
        id: crypto.randomUUID(),
      });
      return newCard.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setToast({
        type: 'error',
        message: errorMessage,
        id: crypto.randomUUID(),
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing card
  const updateCard = async () => {
    if (!cardId) return;
    if (!formData.title) {
      setError('Title is required');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const updateCommand: UpdateCardCommand = {
        title: formData.title,
        description: formData.description || null,
      };
      const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateCommand),
      });
      if (!response.ok) {
        throw new Error('Failed to update card');
      }
      setToast({
        type: 'success',
        message: 'Changes saved',
        id: crypto.randomUUID(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setToast({
        type: 'error',
        message: errorMessage,
        id: crypto.randomUUID(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate image using AI
  const generateImage = async (prompt: string, type: 'front' | 'back'): Promise<string | null> => {
    if (!prompt) {
      setError('Prompt is required');
      return null;
    }
    setIsGeneratingAI(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      const result = await response.json();
      const imageUrl = result.imageUrl;
      setFormData((prev) => ({
        ...prev,
        [type === 'front' ? 'frontImageUrl' : 'backImageUrl']: imageUrl,
      }));
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setToast({
        type: 'error',
        message: errorMessage,
        id: crypto.randomUUID(),
      });
      return null;
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return {
    formData,
    isLoading,
    isGeneratingAI,
    error,
    toast,
    setToast,
    loadCard,
    createCard,
    updateCard,
    generateImage,
  };
};
