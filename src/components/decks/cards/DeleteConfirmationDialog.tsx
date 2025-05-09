import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  cardTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  cardTitle,
  onConfirm,
  onCancel
}: DeleteConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <Alert variant="destructive">
          <div className="flex flex-col space-y-4">
            <AlertTitle className="text-lg font-semibold">
              Czy na pewno chcesz usunąć tę kartę?
            </AlertTitle>
            <AlertDescription>
              Zamierzasz usunąć kartę <strong className="font-medium">{cardTitle}</strong>.
              Ta operacja jest nieodwracalna i spowoduje trwałe usunięcie karty z talii.
            </AlertDescription>
            
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button 
                variant="outline" 
                onClick={onCancel}
              >
                Anuluj
              </Button>
              <Button 
                variant="destructive"
                onClick={onConfirm}
                className="bg-red-500 hover:bg-red-600"
              >
                Usuń
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    </div>
  );
} 