import { useState, useEffect } from "react";
import type { Template } from "@/types";

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load templates from API
  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/templates");
      
      if (!response.ok) {
        throw new Error("Failed to load templates");
      }
      
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  return { 
    templates, 
    isLoading, 
    error,
    loadTemplates
  };
}; 