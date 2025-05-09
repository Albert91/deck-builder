import { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PaginationModel } from '@/types';

interface PaginationProps {
  pagination: PaginationModel;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  itemName?: string;
}

export function Pagination({ 
  pagination, 
  onPageChange, 
  onLimitChange,
  itemName = 'elementów'
}: PaginationProps) {
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
  
  // Generate array of page numbers to display
  const getPageNumbers = useCallback(() => {
    const range: number[] = [];
    const maxVisiblePages = 5;
    const delta = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  }, [currentPage, totalPages]);
  
  const pageNumbers = getPageNumbers();
  
  // Handle limit change
  const handleLimitChange = (value: string) => {
    onLimitChange?.(Number(value));
  };
  
  // Calculate range of items being displayed
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      <div className="text-sm text-muted-foreground">
        {totalItems > 0 ? (
          <>
            Pokazano <span className="font-medium">{startItem}-{endItem}</span> z <span className="font-medium">{totalItems}</span> {itemName}
          </>
        ) : (
          <>Brak wyników</>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {/* Items per page selector - only display if onLimitChange is provided */}
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Na stronie</span>
            <Select 
              value={String(itemsPerPage)} 
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="60">60</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Page navigation */}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Poprzednia strona"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {pageNumbers.map(page => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              disabled={page === currentPage}
              aria-label={`Strona ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Następna strona"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 