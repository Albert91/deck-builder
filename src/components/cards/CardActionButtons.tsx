import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { deleteCard } from '@/lib/api/cards';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

interface CardActionButtonsProps {
  deckId: string;
  cardId?: string;
  isNewCard: boolean;
  isDirty: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function CardActionButtons({
  deckId,
  cardId,
  isNewCard,
  isDirty,
  onSave,
  onCancel,
  onDelete,
}: CardActionButtonsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Handle card deletion
  const handleDeleteCard = async () => {
    if (!cardId) return;
    
    try {
      setIsDeleting(true);
      await deleteCard(deckId, cardId);
      onDelete();
    } catch (err) {
      console.error('Error deleting card:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-end gap-3 pt-4">
      <Button 
        variant="outline" 
        onClick={onCancel}
      >
        Anuluj
      </Button>
      
      <Button
        onClick={onSave}
        disabled={!isDirty}
      >
        Zapisz
      </Button>
      
      {!isNewCard && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              Usuń kartę
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Czy na pewno chcesz usunąć tę kartę?</AlertDialogTitle>
              <AlertDialogDescription>
                Ta akcja jest nieodwracalna. Karta zostanie trwale usunięta z talii.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anuluj</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCard}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? 'Usuwanie...' : 'Usuń'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
} 