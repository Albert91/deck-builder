// Custom error types for OpenAI service
export class OpenAIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export class OpenAIAuthError extends OpenAIError {
  constructor(message = 'Authentication error with OpenAI API') {
    super(message);
    this.name = 'OpenAIAuthError';
  }
}

export class OpenAIValidationError extends OpenAIError {
  constructor(message = 'Validation error with request or response data') {
    super(message);
    this.name = 'OpenAIValidationError';
  }
}

export class OpenAIRateLimitError extends OpenAIError {
  constructor(message = 'Rate limit exceeded for OpenAI API') {
    super(message);
    this.name = 'OpenAIRateLimitError';
  }
}

export class OpenAIServerError extends OpenAIError {
  constructor(message = 'OpenAI API server error') {
    super(message);
    this.name = 'OpenAIServerError';
  }
}

// Types for image generation
export interface ImageGenerationOptions {
  model?: string;
  style?: 'vivid' | 'natural';
  responseFormat?: 'url' | 'b64_json';
  quality?: 'standard' | 'hd';
}

export interface ImageGenerationResult {
  imageUrl?: string;
  base64Data?: string;
  model: string;
  created: number;
  id?: string;
}

export interface GenerationPrompt {
  prompt: string;
  options?: ImageGenerationOptions;
}
