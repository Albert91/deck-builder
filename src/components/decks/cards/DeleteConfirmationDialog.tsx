import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  cardTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({ isOpen, cardTitle, onConfirm, onCancel }: DeleteConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <Alert variant="destructive">
          <div className="flex flex-col space-y-4">
            <AlertTitle className="text-lg font-semibold">Are you sure you want to delete this card?</AlertTitle>
            <AlertDescription>
              You are about to delete the card <strong className="font-medium">{cardTitle}</strong>. This action is
              irreversible and will permanently remove the card from the deck.
            </AlertDescription>

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    </div>
  );
}
