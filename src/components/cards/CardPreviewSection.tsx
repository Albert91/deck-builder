import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CardPreview from './CardPreview';
import CardImageGenerateButton from './CardImageGenerateButton';

interface CardAttributes {
  strength: number;
  defense: number;
  health: number;
}

interface CardPreviewData {
  title: string;
  description: string | null;
  attributes: CardAttributes;
  frontImageUrl: string | null;
  backImageUrl: string | null;
}

interface CardPreviewSectionProps {
  deckId: string;
  cardId?: string;
  cardData: CardPreviewData;
  onImageGenerated?: (imageUrl: string) => void;
}

export default function CardPreviewSection({ cardId, cardData, onImageGenerated }: CardPreviewSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');

  // Handle image generation
  const handleGenerateImage = async () => {
    if (!cardId) return;

    try {
      setIsGenerating(true);
      // Will implement actual image generation later
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock generated URL for now
      const mockImageUrl = `https://example.com/generated-image-${Date.now()}.jpg`;

      if (onImageGenerated) {
        onImageGenerated(mockImageUrl);
      }
    } catch (err) {
      console.error('Error generating image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Card Preview</CardTitle>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={viewMode === 'front' ? 'default' : 'outline'}
              onClick={() => setViewMode('front')}
            >
              Front
            </Button>
            <Button size="sm" variant={viewMode === 'back' ? 'default' : 'outline'} onClick={() => setViewMode('back')}>
              Back
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <CardPreview cardData={cardData} viewMode={viewMode} />

          {cardId && (
            <CardImageGenerateButton
              onGenerate={handleGenerateImage}
              isGenerating={isGenerating}
              title={cardData.title}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
