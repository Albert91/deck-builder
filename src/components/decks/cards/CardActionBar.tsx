import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

interface CardActionBarProps {
  cardCount: number;
  maxLimit?: number;
  isCardSideBack: boolean;
  onAddCard: () => void;
  onToggleCardSide: () => void;
}

export function CardActionBar({
  cardCount,
  maxLimit = 100,
  isCardSideBack,
  onAddCard,
  onToggleCardSide
}: CardActionBarProps) {
  const isLimitReached = cardCount >= maxLimit;

  return (
    <Card>
      <CardContent className="flex justify-between items-center p-4">
        <div>
          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button 
                onClick={onAddCard} 
                disabled={isLimitReached}
              >
                <svg 
                  className="mr-2 h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
                Dodaj kartę
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              {isLimitReached 
                ? "Osiągnięto limit 100 kart" 
                : "Dodaj nową kartę do talii"}
            </Tooltip.Content>
          </Tooltip>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Widok:
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className={!isCardSideBack ? "bg-primary/10" : ""}
            onClick={onToggleCardSide}
            aria-pressed={!isCardSideBack}
          >
            Awers
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={isCardSideBack ? "bg-primary/10" : ""}
            onClick={onToggleCardSide}
            aria-pressed={isCardSideBack}
          >
            Rewers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 