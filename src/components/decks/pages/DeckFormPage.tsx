import React, { useEffect, useState } from "react";
import { useDeckForm } from "@/hooks/useDeckForm";
import { DeckNameField } from "../form/DeckNameField";
import { CardPreview } from "../cards/CardPreview";
import { LoadingOverlay } from "../../common/LoadingOverlay";
import { AIGeneratorPanel } from "../form/AIGeneratorPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DeckFormPageProps {
  deckId?: string;
}

const DeckFormPage: React.FC<DeckFormPageProps> = ({ deckId }) => {
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [aiPrompt, setAiPrompt] = useState("");
  
  const {
    formData,
    isLoading,
    isGeneratingAI,
    error,
    toast: formToast,
    setToast,
    createDeck,
    updateDeck,
    updateFormField,
    generateImage
  } = useDeckForm(deckId);

  // Update loading message based on state
  useEffect(() => {
    if (isGeneratingAI) {
      setLoadingMessage("Generating image with AI... This may take a moment.");
    } else if (isLoading) {
      setLoadingMessage(deckId ? "Loading deck..." : "Creating deck...");
    }
  }, [isLoading, isGeneratingAI, deckId]);

  // Show toast notifications from form state
  useEffect(() => {
    if (formToast) {
      toast[formToast.type === "success" ? "success" : "error"](
        formToast.type === "success" ? "Success" : "Error",
        {
          description: formToast.message,
        }
      );
      
      // Clear toast after showing
      setToast(null);
    }
  }, [formToast, setToast]);

  // Handle form submission for new deck
  const handleCreateDeck = async () => {
    const newDeckId = await createDeck();
    if (newDeckId) {
      window.location.href = `/decks/${newDeckId}/edit`;
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    window.location.href = "/";
  };

  // Handle AI image generation
  const handleGenerate = async (prompt: string, type: "front" | "back") => {
    const imageUrl = await generateImage(prompt, type);
    if (imageUrl) {
      toast.success(`${type === "front" ? "Front" : "Back"} image generated successfully`);
    }
    return imageUrl || "";
  };

  // Determine if form is valid
  const isFormValid = !!formData.name;
  
  // Display loading overlay when necessary
  const showLoading = isLoading || isGeneratingAI;
  
  // Determine page title based on mode
  const pageTitle = deckId ? "Edit Deck" : "Create New Deck";

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {/* Loading Overlay */}
      <LoadingOverlay isLoading={showLoading} message={loadingMessage} />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{pageTitle}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Deck Name Field */}
          <DeckNameField
            name={formData.name}
            onChange={(name) => updateFormField("name", name)}
            error={!formData.name && error ? "Deck name is required" : undefined}
          />
          
          {/* Card Preview */}
          <CardPreview
            frontImage={formData.frontImage ?? '/images/default-card-front.jpeg'}
            backImage={formData.backImage ?? '/images/default-card-back.jpeg'}
          />
          
          {/* AI Generator Panel */}
          <AIGeneratorPanel
            prompt={aiPrompt}
            onPromptChange={setAiPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGeneratingAI}
          />
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={showLoading}
            >
              Cancel
            </Button>
            
            {!deckId ? (
              <Button
                onClick={handleCreateDeck}
                disabled={!isFormValid || showLoading}
              >
                Create Deck
              </Button>
            ) : (
              <Button
                onClick={updateDeck}
                disabled={!isFormValid || showLoading}
              >
                Save Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckFormPage; 