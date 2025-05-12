import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDebounce } from '@/hooks/useDebounce';
import { updateCard } from '@/lib/api/cards';
import type { CardDTO } from '@/types';
import CardTitleInput from './CardTitleInput';
import CardDescriptionTextarea from './CardDescriptionTextarea';
import CardAttributesSliders from './CardAttributesSliders';
import type { CardFormData } from '@/hooks/useCardForm';

interface CardEditorFormProps {
  deckId: string;
  card: CardDTO | null;
  isLoading: boolean;
  initialData: CardFormData;
  onUpdate: (data: Partial<CardFormData>) => void;
}

export default function CardEditorForm({ deckId, card, isLoading, initialData, onUpdate }: CardEditorFormProps) {
  const [formData, setFormData] = useState<CardFormData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Local dirty state for debounced save
  const [isDirty, setIsDirty] = useState(false);

  // Update local form data when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Create a debounced version of saveChanges
  const debouncedSave = useDebounce(async (data: CardFormData) => {
    if (!card || !card.id) return;
    try {
      setIsSaving(true);
      await updateCard(deckId, card.id, {
        title: data.title,
        description: data.description,
        // Eventually will add attributes saving
      });
    } catch (err) {
      console.error('Error saving card:', err);
      // Set error here if needed
    } finally {
      setIsSaving(false);
    }
  }, 1000);

  // Save changes when form data changes
  useEffect(() => {
    if (isDirty && card) {
      debouncedSave(formData);
      setIsDirty(false);
    }
  }, [formData, card, debouncedSave, isDirty]);

  // Handle form field changes
  const handleFieldChange = (field: keyof CardFormData, value: any) => {
    // Validate inputs
    const fieldErrors = { ...errors };

    if (field === 'title') {
      if (!value) {
        fieldErrors.title = 'Title is required';
      } else if (value.length > 100) {
        fieldErrors.title = 'Title cannot be longer than 100 characters';
      } else {
        delete fieldErrors.title;
      }
    }

    if (field === 'description') {
      if (value && value.length > 500) {
        fieldErrors.description = 'Description cannot be longer than 500 characters';
      } else {
        delete fieldErrors.description;
      }
    }

    setErrors(fieldErrors);

    // Update form data
    const updatedData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedData);
    setIsDirty(true);
    onUpdate({ [field]: value });
  };

  // Handle attribute changes
  const handleAttributeChange = (attribute: keyof CardFormData['attributes'], value: number) => {
    const updatedAttributes = {
      ...formData.attributes,
      [attribute]: value,
    };
    setFormData({
      ...formData,
      attributes: updatedAttributes,
    });
    setIsDirty(true);
    onUpdate({ attributes: updatedAttributes });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {card ? 'Edit Card' : 'New Card'}
          {isSaving && <span className="ml-2 text-sm text-muted-foreground">(Saving...)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <CardTitleInput
            value={formData.title}
            onChange={(value) => handleFieldChange('title', value)}
            error={errors.title}
          />

          <CardDescriptionTextarea
            value={formData.description || ''}
            onChange={(value) => handleFieldChange('description', value)}
            error={errors.description}
          />

          <CardAttributesSliders attributes={formData.attributes} onChange={handleAttributeChange} />
        </div>
      </CardContent>
    </Card>
  );
}
