import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Pencil, Copy, Share2, Trash2 } from 'lucide-react';
import type { DeckViewModel } from '../../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    deck.cardCount === 1
      ? 'karta'
      : deck.cardCount % 10 >= 2 &&
          deck.cardCount % 10 <= 4 &&
          (deck.cardCount % 100 < 10 || deck.cardCount % 100 >= 20)
        ? 'karty'
        : 'kart'
  }`;

  // Determine the fallback image if the thumbnail fails to load
  const thumbnailUrl = isImageError ? '/images/default-card-back.jpeg' : deck.thumbnailUrl;

  return (
    <Card
      className="group h-full overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={(e) => {
        // Prevent click when clicking on action buttons
        if ((e.target as HTMLElement).closest('[data-action-button]')) {
          return;
        }
        onClick();
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={`Miniatura talii ${deck.name}`}
          className="h-full w-full"
          onError={() => setIsImageError(true)}
        />
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl line-clamp-1">{deck.name}</CardTitle>

          <div className="flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    data-action-button
                    onClick={() => onOptionsClick('edit', deck)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edytuj</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edytuj talię</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    data-action-button
                    onClick={() => onOptionsClick('share', deck)}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Udostępnij</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Udostępnij talię</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    data-action-button
                    onClick={() => onOptionsClick('delete', deck)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Usuń</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Usuń talię</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{cardCountText}</p>
      </CardContent>

      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">Aktualizacja: {formattedDate}</p>
      </CardFooter>
    </Card>
  );
}
