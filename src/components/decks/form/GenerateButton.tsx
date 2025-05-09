import React from "react";
import { Button } from "@/components/ui/button";

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  type: "front" | "back";
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  isGenerating,
  type
}) => {
  const label = type === "front" ? "Generate Front" : "Generate Back";
  const icon = type === "front" ? (
    // Simple front card icon
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 mr-2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 21v-2a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" />
    </svg>
  ) : (
    // Simple back card icon
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 mr-2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="15" x2="13" y2="15" />
    </svg>
  );

  return (
    <Button
      variant="secondary"
      onClick={onClick}
      disabled={isGenerating}
      className="flex items-center"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full mr-2" />
          Generating...
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </Button>
  );
}; 