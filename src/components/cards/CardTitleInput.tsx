import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CardTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function CardTitleInput({ value, onChange, error }: CardTitleInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="title" className="text-sm font-medium">
          Card title
        </Label>
        <span className="text-xs text-muted-foreground">{value.length}/100</span>
      </div>
      <Input
        id="title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter card title..."
        className={error ? 'border-red-500' : ''}
        maxLength={100}
        aria-invalid={!!error}
        aria-describedby={error ? 'title-error' : undefined}
      />
      {error && (
        <p id="title-error" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
