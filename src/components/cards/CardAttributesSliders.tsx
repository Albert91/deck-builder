import AttributeSlider from './AttributeSlider';

interface CardAttributes {
  strength: number;
  defense: number;
  health: number;
}

interface CardAttributesSlidersProps {
  attributes: CardAttributes;
  onChange: (attribute: keyof CardAttributes, value: number) => void;
}

export default function CardAttributesSliders({
  attributes,
  onChange,
}: CardAttributesSlidersProps) {
  return (
    <div className="space-y-4 pt-2">
      <h3 className="text-sm font-medium">Atrybuty karty</h3>
      
      <div className="space-y-6">
        <AttributeSlider
          name="strength"
          label="Siła"
          value={attributes.strength}
          onChange={(value) => onChange('strength', value)}
          min={0}
          max={99}
        />
        
        <AttributeSlider
          name="defense"
          label="Obrona"
          value={attributes.defense}
          onChange={(value) => onChange('defense', value)}
          min={0}
          max={99}
        />
        
        <AttributeSlider
          name="health"
          label="Zdrowie"
          value={attributes.health}
          onChange={(value) => onChange('health', value)}
          min={0}
          max={99}
        />
      </div>
    </div>
  );
} 