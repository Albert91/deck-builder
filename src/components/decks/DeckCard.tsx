import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { MoreHorizontal } from 'lucide-react';
import type { DeckViewModel } from '../../types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export interface DeckCardProps {
  deck: DeckViewModel;
  onClick: () => void;
  onOptionsClick: (option: string, deck: DeckViewModel) => void;
}

export function DeckCard({ deck, onClick, onOptionsClick }: DeckCardProps) {
  const [isImageError, setIsImageError] = useState(false);
  
  // Format date as "X time ago" in Polish
  const formattedDate = formatDistanceToNow(new Date(deck.updated_at), {
    addSuffix: true,
    locale: pl,
  });

  // Format card count with proper Polish plural form
  const cardCountText = `${deck.cardCount} ${
    deck.cardCount === 1 ? 'karta' : 
    deck.cardCount % 10 >= 2 && deck.cardCount % 10 <= 4 && (deck.cardCount % 100 < 10 || deck.cardCount % 100 >= 20) ? 'karty' : 'kart'
  }`;

  // Determine the fallback image if the thumbnail fails to load
  const thumbnailUrl = isImageError 
    ? '/assets/deck-placeholder.jpg'
    : deck.thumbnailUrl;

  return (
    <Card 
      className="group h-full overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={(e) => {
        // Prevent click when clicking on the options menu
        if ((e.target as HTMLElement).closest('[data-options-menu]')) {
          return;
        }
        onClick();
      }}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={`Miniatura talii ${deck.name}`}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={() => setIsImageError(true)}
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl line-clamp-1">{deck.name}</CardTitle>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild data-options-menu>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Opcje</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOptionsClick('edit', deck)}>
                Edytuj
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOptionsClick('duplicate', deck)}>
                Duplikuj
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOptionsClick('share', deck)}>
                Udostępnij
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onOptionsClick('delete', deck)}
                className="text-destructive"
              >
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{cardCountText}</p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">
          Aktualizacja: {formattedDate}
        </p>
      </CardFooter>
    </Card>
  );
} 