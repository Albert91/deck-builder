import React, { useState, useRef, useEffect } from "react";
import type { Template } from "@/types";
import { TemplateCard } from "./TemplateCard";
import { Button } from "@/components/ui/button";

interface TemplateCarouselProps {
  templates: Template[];
  selectedTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
  isLoading?: boolean;
}

export const TemplateCarousel: React.FC<TemplateCarouselProps> = ({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  isLoading = false
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check if scroll buttons should be enabled
  const checkScrollButtons = () => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // 10px buffer
  };

  // Update scroll buttons when templates change or on scroll
  useEffect(() => {
    checkScrollButtons();
    
    const handleScroll = () => checkScrollButtons();
    const carousel = carouselRef.current;
    
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
      return () => carousel.removeEventListener("scroll", handleScroll);
    }
  }, [templates, scrollPosition]);

  // Scroll carousel left
  const scrollLeft = () => {
    if (!carouselRef.current) return;
    
    const newPosition = Math.max(0, scrollPosition - 300);
    carouselRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
    setScrollPosition(newPosition);
  };

  // Scroll carousel right
  const scrollRight = () => {
    if (!carouselRef.current) return;
    
    const { scrollWidth, clientWidth } = carouselRef.current;
    const newPosition = Math.min(scrollWidth - clientWidth, scrollPosition + 300);
    carouselRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
    setScrollPosition(newPosition);
  };

  return (
    <div className="relative py-4">
      <h3 className="text-lg font-medium mb-3">Select Template</h3>
      
      {/* Carousel Container */}
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-md rounded-full"
            onClick={scrollLeft}
            disabled={isLoading || !canScrollLeft}
            aria-label="Scroll left"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
        )}
        
        {/* Carousel Scroll Area */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1"
          role="radiogroup"
          aria-label="Template selection"
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="w-40 min-w-[10rem] aspect-[3/4] bg-gray-200 animate-pulse rounded-lg"
              />
            ))
          ) : templates.length === 0 ? (
            // No templates message
            <div className="w-full text-center py-6 text-gray-500">
              No templates available
            </div>
          ) : (
            // Template cards
            templates.map((template) => (
              <div key={template.id} className="w-40 min-w-[10rem] flex-shrink-0">
                <TemplateCard
                  template={template}
                  isSelected={template.id === selectedTemplateId}
                  onSelect={onTemplateSelect}
                />
              </div>
            ))
          )}
        </div>
        
        {/* Right Scroll Button */}
        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-md rounded-full"
            onClick={scrollRight}
            disabled={isLoading || !canScrollRight}
            aria-label="Scroll right"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        )}
      </div>
      
      {/* Error message for no selection */}
      {!selectedTemplateId && templates.length > 0 && (
        <p className="text-sm text-red-500 mt-2">
          Please select a template
        </p>
      )}
    </div>
  );
}; 