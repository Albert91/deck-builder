import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CardPreviewProps {
  frontImage?: string;
  backImage?: string;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ frontImage, backImage }) => {
  const [showingFront, setShowingFront] = useState(true);

  // Toggle between front and back
  const toggleSide = () => {
    setShowingFront((prev) => !prev);
  };

  // Use placeholder images when no images are provided
  const frontSrc = frontImage || '/placeholder-card-front.png';
  const backSrc = backImage || '/placeholder-card-back.png';

  return (
    <div className="py-4" data-test-id="card-preview-container">
      <h3 className="text-lg font-medium mb-3">Card Preview</h3>

      <div className="flex flex-col items-center">
        {/* Card Preview Image */}
        <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-lg mb-4" data-test-id="card-preview-image">
          <div
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
              showingFront ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            data-test-id="card-front-preview"
          >
            <img src={frontSrc} alt="Card Front" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 bg-gray-900/70 text-white text-xs px-2 py-1 rounded">Front</div>
          </div>

          <div
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
              !showingFront ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            data-test-id="card-back-preview"
          >
            <img src={backSrc} alt="Card Back" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 bg-gray-900/70 text-white text-xs px-2 py-1 rounded">Back</div>
          </div>
        </div>

        {/* Flip Button */}
        <Button
          variant="outline"
          onClick={toggleSide}
          className="flex items-center gap-2"
          data-test-id="flip-card-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          {showingFront ? 'Show Back' : 'Show Front'}
        </Button>
      </div>
    </div>
  );
};
