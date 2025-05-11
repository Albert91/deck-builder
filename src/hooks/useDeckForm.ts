import { useState, useEffect } from 'react';
import type { DeckFormData, Toast, DeckDTO, CreateDeckCommand, UpdateDeckCommand } from '@/types';

export const useDeckForm = (deckId?: string) => {
  // Form state, loading states, errors, toast
  const [formData, setFormData] = useState<DeckFormData>({
    name: '',
    frontImage: undefined,
    backImage: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  // Load deck if in edit mode
  useEffect(() => {
    if (deckId) {
      loadDeck(deckId);
    }
  }, [deckId]);

  // Load deck data from API
  const loadDeck = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/decks/${id}`);

      if (!response.ok) {
        throw new Error('Failed to load deck');
      }

      const deckData: DeckDTO = await response.json();

      setFormData({
        name: deckData.name,
        frontImage: undefined, // These would be loaded separately
        backImage: undefined,
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

  // Create a new deck
  const createDeck = async (): Promise<string | null> => {
    if (!formData.name) {
      setError('Name is required');
      setToast({
        type: 'error',
        message: 'Please provide a name for your deck',
        id: crypto.randomUUID(),
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const createCommand: CreateDeckCommand = {
        name: formData.name,
      };

      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createCommand),
      });

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 403) {
          throw new Error("You've reached the limit of 5 decks. Please delete some before creating new ones.");
        }
        throw new Error('Failed to create deck');
      }

      const newDeck: DeckDTO = await response.json();

      setToast({
        type: 'success',
        message: 'Deck created successfully',
        id: crypto.randomUUID(),
      });

      return newDeck.id;
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

  // Update existing deck (auto-save)
  const updateDeck = async () => {
    if (!deckId) return;

    if (!formData.name) {
      setError('Name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updateCommand: UpdateDeckCommand = {
        name: formData.name,
      };

      const response = await fetch(`/api/decks/${deckId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateCommand),
      });

      if (!response.ok) {
        throw new Error('Failed to update deck');
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

  // Update a single form field
  const updateFormField = <K extends keyof DeckFormData>(field: K, value: DeckFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-save if editing an existing deck after a short delay
    if (deckId) {
      const debounceTimer = setTimeout(() => {
        updateDeck();
      }, 1000);

      return () => clearTimeout(debounceTimer);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const result = await response.json();
      const imageUrl = result.imageUrl;

      // Update the appropriate image field
      setFormData((prev) => ({
        ...prev,
        [type === 'front' ? 'frontImage' : 'backImage']: imageUrl,
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
    loadDeck,
    createDeck,
    updateDeck,
    updateFormField,
    generateImage,
  };
};
