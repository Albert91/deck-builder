import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AIPromptFieldProps {
  prompt: string;
  onChange: (prompt: string) => void;
  isDisabled?: boolean;
  error?: string;
}

export const AIPromptField: React.FC<AIPromptFieldProps> = ({ prompt, onChange, isDisabled = false, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="ai-prompt" className="text-sm font-medium">
        AI Generation Prompt
      </Label>
      <Input
        id="ai-prompt"
        type="text"
        value={prompt}
        onChange={handleChange}
        placeholder="Describe the image you want to generate..."
        className={`${error ? 'border-red-500' : ''}`}
        disabled={isDisabled}
        aria-invalid={!!error}
        aria-describedby={error ? 'ai-prompt-error' : undefined}
      />
      {error && (
        <p id="ai-prompt-error" className="text-sm text-red-500">
          {error}
        </p>
      )}
      <p className="text-xs text-gray-500">
        Provide a detailed description of the image you want to generate. The more specific you are, the better the
        results will be.
      </p>
    </div>
  );
};
