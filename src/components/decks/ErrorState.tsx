import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  error: { message: string };
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Alert variant="destructive" className="max-w-md mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Wystąpił błąd</AlertTitle>
        <AlertDescription>
          {error.message || 'Nie udało się załadować talii. Spróbuj ponownie.'}
        </AlertDescription>
      </Alert>
      
      <Button onClick={onRetry} variant="outline" className="mt-4">
        Spróbuj ponownie
      </Button>
    </div>
  );
} 