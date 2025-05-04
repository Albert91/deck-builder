import { useCallback, useEffect, useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DeckFilterState, DeckSortOption } from '../../types';

interface DeckFilterBarProps {
  filters: DeckFilterState;
  onFilterChange: (filters: DeckFilterState) => void;
  sortOptions: DeckSortOption[];
}

export function DeckFilterBar({ filters, onFilterChange, sortOptions }: DeckFilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange({ ...filters, search: searchInput });
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchInput, filters, onFilterChange]);
  
  // Handle sort option change
  const handleSortChange = useCallback((sortBy: string) => {
    onFilterChange({ ...filters, sortBy });
  }, [filters, onFilterChange]);
  
  // Toggle sort direction (asc/desc)
  const toggleSortDirection = useCallback(() => {
    const newDirection = filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFilterChange({ ...filters, sortOrder: newDirection });
  }, [filters, onFilterChange]);
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Szukaj talii..."
          className="pl-8"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      
      {/* Sort options */}
      <div className="flex items-center gap-2">
        <Select
          value={filters.sortBy}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sortuj według" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSortDirection}
          aria-label={filters.sortOrder === 'asc' ? 'Sortuj rosnąco' : 'Sortuj malejąco'}
        >
          <ArrowUpDown className={`h-4 w-4 ${filters.sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`} />
        </Button>
      </div>
    </div>
  );
} 