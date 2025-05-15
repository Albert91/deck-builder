interface CardAttributes {
  strength: number;
  defense: number;
  health: number;
}

interface CardPreviewData {
  title: string;
  description: string | null;
  attributes: CardAttributes;
  frontImageUrl: string | null;
  backImageUrl: string | null;
}

interface CardPreviewProps {
  cardData: CardPreviewData;
  viewMode: 'front' | 'back';
}

export default function CardPreview({ cardData, viewMode }: CardPreviewProps) {
  // Default placeholder image for when no image is available
  const defaultImage = '/images/default-card-front.jpeg';

  // Determine the image to show based on view mode
  const imageUrl =
    viewMode === 'front' ? cardData.frontImageUrl || defaultImage : cardData.backImageUrl || defaultImage;

  if (viewMode === 'back') {
    return (
      <div className="flex justify-center">
        <div className="relative w-[300px] h-[420px] rounded-xl overflow-hidden">
          <img src={imageUrl} alt="Card back" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="relative w-[300px] h-[420px] rounded-xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950 text-white shadow-lg">
        {/* Card image */}
        <div className="h-[180px] overflow-hidden">
          <img src={imageUrl} alt={cardData.title} className="w-full h-full object-cover" />
        </div>

        {/* Card content */}
        <div className="p-4 space-y-4">
          {/* Title */}
          <h3 className="text-lg font-bold truncate">{cardData.title}</h3>

          {/* Description */}
          <p className="text-sm text-gray-300 line-clamp-3">{cardData.description || 'No description'}</p>

          {/* Attributes */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div>
              <div className="text-xs text-gray-400">STR</div>
              <div className="font-bold">{cardData.attributes.strength}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">DEF</div>
              <div className="font-bold">{cardData.attributes.defense}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">HP</div>
              <div className="font-bold">{cardData.attributes.health}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
