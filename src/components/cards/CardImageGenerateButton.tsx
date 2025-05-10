import { Button } from '@/components/ui/button';

interface CardImageGenerateButtonProps {
  onGenerate: () => void;
  isGenerating: boolean;
  title: string;
}

export default function CardImageGenerateButton({
  onGenerate,
  isGenerating,
  title
}: CardImageGenerateButtonProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-center text-muted-foreground">
        Wygeneruj obraz dla karty przy pomocy AI
      </p>
      <div className="flex justify-center">
        <Button
          onClick={onGenerate}
          disabled={isGenerating || !title}
          className="w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generowanie...
            </>
          ) : (
            'Generuj obraz'
          )}
        </Button>
      </div>
      {!title && (
        <p className="text-xs text-center text-red-500">
          Najpierw dodaj tytuł karty
        </p>
      )}
    </div>
  );
} 