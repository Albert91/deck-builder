import { Label } from '@/components/ui/label';

interface CardDescriptionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function CardDescriptionTextarea({ value, onChange, error }: CardDescriptionTextareaProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="description" className="text-sm font-medium">
          Opis karty
        </Label>
        <span className="text-xs text-muted-foreground">{value.length}/500</span>
      </div>
      <textarea
        id="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Wpisz opis karty (opcjonalnie)..."
        maxLength={500}
        className={`w-full min-h-[100px] px-3 py-2 rounded-md border ${
          error ? 'border-red-500' : 'border-input'
        } bg-transparent text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
        aria-invalid={!!error}
        aria-describedby={error ? 'description-error' : undefined}
      />
      {error && (
        <p id="description-error" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
