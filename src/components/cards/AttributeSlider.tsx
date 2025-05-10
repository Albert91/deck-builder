import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AttributeSliderProps {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

export default function AttributeSlider({
  name,
  label,
  value,
  onChange,
  min,
  max,
}: AttributeSliderProps) {
  const [localValue, setLocalValue] = useState<number>(value);

  const handleSliderChange = (newValue: number[]) => {
    const valueToSet = newValue[0];
    setLocalValue(valueToSet);
    onChange(valueToSet);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input for easier editing
    if (inputValue === '') {
      setLocalValue(0);
      return;
    }
    
    // Parse and validate the value
    let numericValue = parseInt(inputValue, 10);
    
    // Ensure it's a valid number
    if (isNaN(numericValue)) {
      return;
    }
    
    // Clamp the value between min and max
    numericValue = Math.max(min, Math.min(max, numericValue));
    
    setLocalValue(numericValue);
    onChange(numericValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
        <Input
          id={`${name}-value`}
          type="number"
          value={localValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-16 h-8 text-center"
          aria-label={`${label} value`}
        />
      </div>
      <Slider
        id={name}
        value={[localValue]}
        min={min}
        max={max}
        step={1}
        onValueChange={handleSliderChange}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={localValue}
        aria-label={label}
      />
    </div>
  );
} 