import { z } from 'zod';
import type {
  ChatCompletionInput,
  ChatCompletionResult,
  Message,
  OpenRouterPayload,
  OpenRouterResponse,
  ResponseFormat
} from './openrouter.types';
import {
  OpenRouterAuthError,
  OpenRouterError,
  OpenRouterRateLimitError,
  OpenRouterServerError,
  OpenRouterValidationError
} from './openrouter.types';

// Validation schemas
const responseFormatSchema = z.object({
  type: z.literal('json_schema'),
  json_schema: z.object({
    name: z.string(),
    strict: z.boolean(),
    schema: z.record(z.unknown())
  })
});

const chatCompletionInputSchema = z.object({
  systemPrompt: z.string(),
  userPrompt: z.string(),
  model: z.string().optional(),
  params: z.record(z.unknown()).optional(),
  responseFormat: responseFormatSchema.optional()
});

// OpenRouter service
export class OpenRouterService {
  private readonly _logger?: Console;
  private readonly _baseUrl = 'https://openrouter.ai/api/v1';
  
  // Configuration state
  private _config: {
    apiKey: string;
    defaultModel?: string;
    defaultParams?: Record<string, unknown>;
  };

  constructor({
    apiKey,
    defaultModel,
    defaultParams,
    logger = console
  }: {
    apiKey: string;
    defaultModel?: string;
    defaultParams?: Record<string, unknown>;
    logger?: Console;
  }) {
    if (!apiKey) {
      throw new OpenRouterAuthError('API key is required');
    }
    
    this._config = {
      apiKey,
      defaultModel,
      defaultParams
    };
    
    this._logger = logger;
  }

  /**
   * Gets the current API key
   */
  public get apiKey(): string {
    return this._config.apiKey;
  }

  /**
   * Gets the current default model
   */
  public get defaultModel(): string | undefined {
    return this._config.defaultModel;
  }

  /**
   * Gets the current default parameters
   */
  public get defaultParams(): Record<string, unknown> | undefined {
    return this._config.defaultParams;
  }

  /**
   * Updates the service configuration
   * @param config New configuration values
   */
  public updateConfig(config: {
    apiKey?: string;
    defaultModel?: string;
    defaultParams?: Record<string, unknown>;
  }): void {
    if (config.apiKey !== undefined) {
      if (!config.apiKey) {
        throw new OpenRouterAuthError('API key is required');
      }
      this._config.apiKey = config.apiKey;
    }

    if (config.defaultModel !== undefined) {
      this._config.defaultModel = config.defaultModel;
    }

    if (config.defaultParams !== undefined) {
      this._config.defaultParams = config.defaultParams;
    }
  }

  /**
   * Generates a chat completion using OpenRouter API
   * @param input Chat completion input parameters
   * @returns Chat completion result
   */
  public async generateChatCompletion(input: ChatCompletionInput): Promise<ChatCompletionResult> {
    try {
      // Validate input
      const validatedInput = chatCompletionInputSchema.parse(input);
      
      // Use model from input or default
      const model = validatedInput.model || this._config.defaultModel;
      if (!model) {
        throw new OpenRouterValidationError('Model is required (either in input or as default)');
      }

      // Build request payload with validated input and model
      const inputWithModel = { ...validatedInput, model };
      const payload = this._buildRequestPayload(inputWithModel);
      
      // Call OpenRouter API
      const response = await this._callOpenRouterApi(payload);

      // Validate response
      if (!this._validateResponse(response, validatedInput.responseFormat)) {
        throw new OpenRouterValidationError('Invalid response from OpenRouter API');
      }

      // Extract content from response
      const content = validatedInput.responseFormat?.type === 'json_schema'
        ? JSON.parse(response.choices[0].message.content)
        : response.choices[0].message.content;

      // Return formatted result
      return {
        content,
        model: response.model,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        },
        id: response.id
      };
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Builds the request payload for OpenRouter API
   * @param input Validated chat completion input
   * @returns OpenRouter API payload
   * @private
   */
  private _buildRequestPayload(input: ChatCompletionInput & { model: string }): OpenRouterPayload {
    // Create messages array with system and user prompts
    const messages: Message[] = [
      { role: 'system', content: input.systemPrompt },
      { role: 'user', content: input.userPrompt }
    ];

    // Create base payload with required fields
    const payload: OpenRouterPayload = {
      messages,
      model: input.model,
    };

    // Add response format if provided
    if (input.responseFormat) {
      payload.response_format = input.responseFormat;
    }

    // Merge default params with provided params
    const params = { ...this._config.defaultParams, ...input.params };
    
    // Add all params to payload
    Object.keys(params).forEach(key => {
      payload[key] = params[key];
    });

    return payload;
  }

  /**
   * Calls the OpenRouter API with the provided payload
   * @param payload Request payload
   * @returns API response
   * @private
   */
  private async _callOpenRouterApi(payload: OpenRouterPayload): Promise<OpenRouterResponse> {
    const endpoint = `${this._baseUrl}/chat/completions`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._config.apiKey}`,
          'HTTP-Referer': 'https://deck-builder.app', // For tracking in OpenRouter
          'X-Title': 'Deck Builder App' // For tracking in OpenRouter
        },
        body: JSON.stringify(payload)
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        
        // Handle specific error status codes
        switch (response.status) {
          case 401:
          case 403:
            throw new OpenRouterAuthError('Invalid API key or unauthorized access');
          case 429:
            throw new OpenRouterRateLimitError('Rate limit exceeded');
          case 500:
          case 502:
          case 503:
          case 504:
            throw new OpenRouterServerError('OpenRouter server error');
          default:
            throw new OpenRouterError(`API error (${response.status}): ${errorData?.error?.message || response.statusText}`);
        }
      }

      // Parse and return successful response
      const data = await response.json();
      return data as OpenRouterResponse;
    } catch (error) {
      // Re-throw OpenRouter errors
      if (error instanceof OpenRouterError) {
        throw error;
      }
      
      // Handle network or parsing errors
      throw new OpenRouterError(`Network or parsing error: ${(error as Error).message}`);
    }
  }

  /**
   * Validates the response from OpenRouter API
   * @param response API response
   * @param responseFormat Expected response format
   * @returns True if valid, false otherwise
   * @private
   */
  private _validateResponse(response: OpenRouterResponse, responseFormat?: ResponseFormat): boolean {
    // Check if response has the expected structure
    if (!response.choices || !response.choices.length || !response.choices[0].message) {
      this._logger?.error('Invalid response structure', { response });
      return false;
    }

    // If JSON response format is expected, validate JSON structure
    if (responseFormat?.type === 'json_schema') {
      try {
        const content = response.choices[0].message.content;
        const parsedContent = JSON.parse(content);
        
        // Basic check for JSON structure
        if (typeof parsedContent !== 'object' || parsedContent === null) {
          this._logger?.error('Invalid JSON response', { content });
          return false;
        }
        
        // We could add more schema validation here if needed
        return true;
      } catch (error) {
        this._logger?.error('Error parsing JSON response', { error });
        return false;
      }
    }

    // For text responses, just check if content exists
    return !!response.choices[0].message.content;
  }

  /**
   * Handles errors in a consistent way
   * @param error Error to handle
   * @throws Appropriate OpenRouter error
   * @private
   */
  private _handleError(error: unknown): never {
    // Log the error (sanitize sensitive data)
    this._logger?.error('OpenRouter service error', { 
      name: error instanceof Error ? error.name : 'Unknown error',
      message: error instanceof Error ? error.message : String(error)
    });
    
    // Re-throw OpenRouter errors
    if (error instanceof OpenRouterError) {
      throw error;
    }
    
    // Handle validation errors from zod
    if (error instanceof z.ZodError) {
      throw new OpenRouterValidationError(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    
    // Handle other errors
    throw new OpenRouterError(`Unexpected error: ${(error as Error)?.message || String(error)}`);
  }
} 