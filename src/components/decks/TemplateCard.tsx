import React from "react";
import type { Template } from "@/types";

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect
}) => {
  const handleSelect = () => {
    onSelect(template.id);
  };

  return (
    <div
      className={`
        relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200
        ${isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:brightness-110"}
      `}
      onClick={handleSelect}
      role="radio"
      aria-checked={isSelected}
    >
      {/* Template Preview Image */}
      <div className="w-full aspect-[3/4] relative">
        <img
          src={template.preview_image || "/placeholder-template.png"}
          alt={template.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Template Name */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-white">
        <p className="text-sm truncate">{template.name}</p>
      </div>
      
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}; 