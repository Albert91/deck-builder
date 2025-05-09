import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import type { CardViewModel } from "@/types";

interface CardItemProps {
  card: CardViewModel;
  onOptionsClick: (option: string, card: CardViewModel) => void;
}

export function CardItem({
  card,
  onOptionsClick
}: CardItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailUrl = card.thumbnailUrl;

  return (
    <Card 
      className="relative overflow-hidden h-64 group transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 h-full">
        <div className="relative h-full">
          {/* Card thumbnail */}
          <div className="absolute inset-0 bg-muted">
            <img 
              src={thumbnailUrl} 
              alt={card.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Card title overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2 backdrop-blur-sm">
            <h3 className="font-medium text-sm truncate">{card.title}</h3>
          </div>

          {/* Action buttons (visible on hover) */}
          <div 
            className={`absolute top-2 right-2 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                  aria-label="Opcje karty"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onOptionsClick("edit", card)}>
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                  </svg>
                  Edytuj
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOptionsClick("duplicate", card)}>
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
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" 
                    />
                  </svg>
                  Duplikuj
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onOptionsClick("delete", card)}
                  className="text-red-500 focus:text-red-500"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                  Usuń
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 