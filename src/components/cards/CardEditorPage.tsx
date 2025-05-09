import { useEffect, useState } from 'react';
import { getCardById, createCard } from '@/lib/api/cards';
import type { CardDTO, CreateCardCommand } from '@/types';
import CardEditorForm from './CardEditorForm';
import CardPreviewSection from './CardPreviewSection';

// Initial empty form data
const DEFAULT_CARD_DATA = {
  title: '',
  description: '',
  attributes: {
    strength: 0,
    defense: 0,
    health: 0
  }
};

// Types for the component
interface CardFormData {
  title: string;
  description: string | null;
  attributes: {
    strength: number;
    defense: number;
    health: number;
  };
  isDirty: boolean;
}

interface CardEditorPageProps {
  deckId: string;
  cardId?: string;
}

export default function CardEditorPage({ deckId, cardId }: CardEditorPageProps) {
  const [card, setCard] = useState<CardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CardFormData>({
    ...DEFAULT_CARD_DATA,
    isDirty: false
  });

  // Load card data if editing an existing card
  useEffect(() => {
    async function loadCard() {
      if (!cardId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const cardData = await getCardById(deckId, cardId);
        setCard(cardData);
        
        // Initialize form with card data
        setFormData({
          title: cardData.title,
          description: cardData.description || '',
          attributes: {
            // Default attributes if not present
            strength: cardData.attributes?.find(a => a.attribute_type === 'strength')?.value || 0,
            defense: cardData.attributes?.find(a => a.attribute_type === 'defense')?.value || 0,
            health: cardData.attributes?.find(a => a.attribute_type === 'health')?.value || 0
          },
          isDirty: false
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania karty');
      } finally {
        setIsLoading(false);
      }
    }

    loadCard();
  }, [deckId, cardId]);

  // Create a new card if not editing
  useEffect(() => {
    async function initializeNewCard() {
      if (cardId || card) {
        return;
      }

      try {
        setIsLoading(true);
        const newCardData: CreateCardCommand = {
          title: 'Nowa karta',
          description: null
        };
        
        const createdCard = await createCard(deckId, newCardData);
        setCard(createdCard);
        
        // Initialize form with new card data
        setFormData({
          title: createdCard.title,
          description: createdCard.description || '',
          attributes: {
            strength: 0,
            defense: 0,
            health: 0
          },
          isDirty: false
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas tworzenia karty');
      } finally {
        setIsLoading(false);
      }
    }

    if (!cardId && !isLoading && !card) {
      initializeNewCard();
    }
  }, [deckId, cardId, card, isLoading]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={() => window.history.back()}
        >
          Powrót
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <CardEditorForm 
            deckId={deckId}
            card={card}
            isLoading={isLoading}
            initialData={formData}
            onUpdate={(updatedData) => {
              setFormData(prev => ({
                ...prev,
                ...updatedData,
                isDirty: true
              }));
            }}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <CardPreviewSection 
            deckId={deckId}
            cardId={card?.id}
            cardData={{
              title: formData.title,
              description: formData.description,
              attributes: formData.attributes,
              frontImageUrl: null, // Will be populated from API
              backImageUrl: null   // Will be populated from API
            }}
          />
        </div>
      </div>
    </div>
  );
} 