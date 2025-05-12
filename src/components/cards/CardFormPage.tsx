import React, { useEffect, useState } from 'react';
import CardEditorForm from './CardEditorForm';
import CardPreview from './CardPreview';
import { AIGeneratorPanel } from '../decks/form/AIGeneratorPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LoadingOverlay } from '../common/LoadingOverlay';
import { useCardForm } from '@/hooks/useCardForm';

interface CardFormPageProps {
  deckId: string;
  cardId?: string;
}

const CardFormPage: React.FC<CardFormPageProps> = ({ deckId, cardId }) => {
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [aiPrompt, setAiPrompt] = useState('');

  const {
    formData,
    isLoading,
    isGeneratingAI,
    toast: formToast,
    setToast,
    createCard,
    updateCard,
    generateImage,
  } = useCardForm(deckId, cardId);

  useEffect(() => {
    if (isGeneratingAI) {
      setLoadingMessage('Generating image with AI. This may take a moment.');
    } else if (isLoading) {
      setLoadingMessage(cardId ? 'Loading card...' : 'Creating card...');
    }
  }, [isLoading, isGeneratingAI, cardId]);

  useEffect(() => {
    if (formToast) {
      toast[formToast.type === 'success' ? 'success' : 'error'](formToast.type === 'success' ? 'Success' : 'Error', {
        description: formToast.message,
      });
      setToast(null);
    }
  }, [formToast, setToast]);

  const handleCreateCard = async () => {
    const newCardId = await createCard();
    if (newCardId) {
      window.location.href = `/decks/${deckId}/cards/${newCardId}/edit`;
    }
  };

  const handleCancel = () => {
    window.location.href = `/decks/${deckId}`;
  };

  const handleGenerate = async (prompt: string, type: 'front' | 'back') => {
    const imageUrl = await generateImage(prompt, type);
    if (imageUrl) {
      toast.success(`${type === 'front' ? 'Front' : 'Back'} image generated successfully`);
    }
    return imageUrl || '';
  };

  const isFormValid = !!formData.title;
  const showLoading = isLoading || isGeneratingAI;
  const pageTitle = cardId ? 'Edit Card' : 'Create New Card';

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <LoadingOverlay isLoading={showLoading} message={loadingMessage} />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CardEditorForm
            deckId={deckId}
            card={null} // TODO: Pass actual card data if needed
            isLoading={isLoading}
            initialData={formData}
          />
          <CardPreview
            cardData={{
              title: formData.title,
              description: formData.description,
              attributes: formData.attributes,
              frontImageUrl: formData.frontImageUrl ?? '/images/default-card-front.jpeg',
              backImageUrl: formData.backImageUrl ?? '/images/default-card-back.jpeg',
            }}
            viewMode="front"
          />
          <AIGeneratorPanel
            prompt={aiPrompt}
            onPromptChange={setAiPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGeneratingAI}
            isCardGenerator={true}
          />
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={showLoading}>
              Cancel
            </Button>
            {!cardId ? (
              <Button onClick={handleCreateCard} disabled={!isFormValid || showLoading}>
                Create Card
              </Button>
            ) : (
              <Button onClick={updateCard} disabled={!isFormValid || showLoading}>
                Save Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardFormPage;
