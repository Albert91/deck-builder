import React, { useState } from "react";
import { AIPromptField } from "./AIPromptField";
import { GenerateButton } from "./GenerateButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIGeneratorPanelProps {
  onGenerate: (prompt: string, type: "front" | "back") => Promise<string>;
  isGenerating: boolean;
  prompt: string;
  onPromptChange: (prompt: string) => void;
}

export const AIGeneratorPanel: React.FC<AIGeneratorPanelProps> = ({
  onGenerate,
  isGenerating,
  prompt,
  onPromptChange
}) => {
  const [promptError, setPromptError] = useState<string | undefined>();

  const handleGenerate = async (type: "front" | "back") => {
    // Validate prompt
    if (!prompt.trim()) {
      setPromptError("Please enter a prompt before generating");
      return;
    }
    
    setPromptError(undefined);
    try {
      await onGenerate(prompt, type);
    } catch (error) {
      setPromptError("Failed to generate image. Please try again.");
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">AI Image Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AIPromptField
          prompt={prompt}
          onChange={onPromptChange}
          isDisabled={isGenerating}
          error={promptError}
        />
        
        <div className="flex flex-wrap gap-3 justify-end">
          <GenerateButton
            type="front"
            onClick={() => handleGenerate("front")}
            isGenerating={isGenerating}
          />
          <GenerateButton
            type="back"
            onClick={() => handleGenerate("back")}
            isGenerating={isGenerating}
          />
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-1">💡 Prompt Tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Be specific about the style you want (e.g., "watercolor", "digital art", "pixel art")</li>
            <li>Mention colors, lighting, and composition</li>
            <li>Avoid too complex scenes or very specific characters</li>
            <li>Keep your prompt focused on what you want to see in the image</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}; 