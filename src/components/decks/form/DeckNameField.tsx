import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeckNameFieldProps {
  name: string;
  onChange: (name: string) => void;
  error?: string;
}

export const DeckNameField: React.FC<DeckNameFieldProps> = ({ name, onChange, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="deck-name" className="text-sm font-medium">
        Deck Name
      </Label>
      <Input
        id="deck-name"
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="Enter deck name"
        className={error ? 'border-red-500' : ''}
        aria-invalid={!!error}
        aria-describedby={error ? 'deck-name-error' : undefined}
      />
      {error && (
        <p id="deck-name-error" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};
