// Custom error types for OpenRouter service
export class OpenRouterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export class OpenRouterAuthError extends OpenRouterError {
  constructor(message: string = 'Authentication error with OpenRouter API') {
    super(message);
    this.name = 'OpenRouterAuthError';
  }
}

export class OpenRouterValidationError extends OpenRouterError {
  constructor(message: string = 'Validation error with request or response data') {
    super(message);
    this.name = 'OpenRouterValidationError';
  }
}

export class OpenRouterRateLimitError extends OpenRouterError {
  constructor(message: string = 'Rate limit exceeded for OpenRouter API') {
    super(message);
    this.name = 'OpenRouterRateLimitError';
  }
}

export class OpenRouterServerError extends OpenRouterError {
  constructor(message: string = 'OpenRouter API server error') {
    super(message);
    this.name = 'OpenRouterServerError';
  }
}

// Types
export type ResponseFormat = {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: Record<string, unknown>;
  };
};

export type ChatCompletionInput = {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  params?: Record<string, unknown>;
  responseFormat?: ResponseFormat;
};

export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type OpenRouterPayload = {
  messages: Message[];
  model: string;
  response_format?: ResponseFormat;
  [key: string]: unknown;
};

export type OpenRouterResponse = {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
    index: number;
  }[];
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  created: number;
};

export type ChatCompletionResult = {
  content: string | Record<string, unknown>;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  id: string;
}; 