import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { CardDTO } from '@/types';
import CardTitleInput from './CardTitleInput';
import CardDescriptionTextarea from './CardDescriptionTextarea';
import CardAttributesSliders from './CardAttributesSliders';
import type { CardFormData } from '@/hooks/useCardForm';

interface CardEditorFormProps {
  deckId: string;
  card: CardDTO | null;
  isLoading: boolean;
  formData: CardFormData;
  setFormData: (data: CardFormData) => void;
}

export default function CardEditorForm({ isLoading, formData, setFormData }: CardEditorFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

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
