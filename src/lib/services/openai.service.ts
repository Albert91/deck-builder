import { z } from 'zod';
import OpenAI from 'openai';
import type { ImagesResponse } from 'openai/resources';
import type { GenerationPrompt, ImageGenerationOptions, ImageGenerationResult } from './openai.types';
import {
  OpenAIAuthError,
  OpenAIError,
  OpenAIRateLimitError,
  OpenAIServerError,
  OpenAIValidationError,
} from './openai.types';

// Validation schemas
const imageGenerationOptionsSchema = z
  .object({
    model: z.string().optional(),
    n: z.number().int().min(1).max(10).optional(),
    style: z.enum(['vivid', 'natural']).optional(),
    responseFormat: z.enum(['url', 'b64_json']).optional(),
    quality: z.enum(['standard', 'hd']).optional(),
  })
  .optional();

const generationPromptSchema = z.object({
  prompt: z.string().min(1).max(4000),
  options: imageGenerationOptionsSchema,
});

/**
 * Service for generating images using OpenAI's API
 */
export class OpenAIService {
  private readonly _client: OpenAI;
  private readonly _logger?: Console;

  // Configuration state
  private _config: {
    defaultModel: string;
    defaultOptions: Partial<ImageGenerationOptions>;
  };

  /**
   * Creates a new OpenAI service instance
   */
  constructor({
    apiKey,
    defaultModel = 'dall-e-2',
    defaultOptions = {
      n: 1,
      quality: 'standard',
      responseFormat: 'url',
    },
    logger = console,
  }: {
    apiKey: string;
    defaultModel?: string;
    defaultOptions?: Partial<ImageGenerationOptions>;
    logger?: Console;
  }) {
    if (!apiKey) {
      throw new OpenAIAuthError('API key is required');
    }

    this._client = new OpenAI({
      apiKey,
    });

    this._config = {
      defaultModel,
      defaultOptions,
    };

    this._logger = logger;
  }

  /**
   * Gets the current default model
   */
  public get defaultModel(): string {
    return this._config.defaultModel;
  }

  /**
   * Gets the current default options
   */
  public get defaultOptions(): Partial<ImageGenerationOptions> {
    return this._config.defaultOptions;
  }

  /**
   * Updates the service configuration
   * @param config New configuration values
   */
  public updateConfig(config: { defaultModel?: string; defaultOptions?: Partial<ImageGenerationOptions> }): void {
    if (config.defaultModel !== undefined) {
      this._config.defaultModel = config.defaultModel;
    }

    if (config.defaultOptions !== undefined) {
      this._config.defaultOptions = {
        ...this._config.defaultOptions,
        ...config.defaultOptions,
      };
    }
  }

  /**
   * Generates an image using the OpenAI API
   * @param input Image generation input parameters
   * @returns Generated image result
   */
  public async generateImage(input: GenerationPrompt): Promise<ImageGenerationResult> {
    try {
      // Validate input
      const validatedInput = generationPromptSchema.parse(input);

      // Merge options with defaults
      const options = {
        ...this._config.defaultOptions,
        ...validatedInput.options,
      };

      // Use model from input or default
      const model = options.model || this._config.defaultModel;
      if (!model) {
        throw new OpenAIValidationError('Model is required (either in options or as default)');
      }

      // Call OpenAI API
      const response = await this._generateImageWithOpenAI(validatedInput.prompt, model, options);

      // Extract result based on response format
      const result = this._extractImageResult(model, response, options.responseFormat);

      return result;
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Calls the OpenAI API to generate an image
   * @param prompt Text prompt for image generation
   * @param model Model to use
   * @param options Generation options
   * @returns API response
   * @private
   */
  private async _generateImageWithOpenAI(
    prompt: string,
    model: string,
    options: Partial<ImageGenerationOptions>
  ): Promise<ImagesResponse> {
    try {
      // Build request parameters
      const params: OpenAI.Images.ImageGenerateParams = {
        model,
        prompt,
        n: options.n || 1,
        size: '256x256',
        style: options.style,
        response_format: options.responseFormat,
        quality: options.quality,
      };

      // Call OpenAI API
      return await this._client.images.generate(params);
    } catch (error: any) {
      // Handle OpenAI API errors
      if (error?.status === 401) {
        throw new OpenAIAuthError('Invalid API key or unauthorized access');
      } else if (error?.status === 429) {
        throw new OpenAIRateLimitError('Rate limit exceeded');
      } else if (error?.status >= 500) {
        throw new OpenAIServerError('OpenAI server error');
      } else {
        throw new OpenAIError(`API error: ${error?.message || error?.error?.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * Extracts image result from API response
   * @param response API response
   * @param responseFormat Response format
   * @returns Formatted image result
   * @private
   */
  private _extractImageResult(
    model: string,
    response: ImagesResponse,
    responseFormat?: 'url' | 'b64_json'
  ): ImageGenerationResult {
    if (!response.data || !response.data.length) {
      throw new OpenAIValidationError('Invalid response from OpenAI API');
    }

    const imageData = response.data[0];

    // Create result object
    const result: ImageGenerationResult = {
      model,
      created: response.created,
    };

    // Add URL or base64 data based on response format
    if (responseFormat === 'b64_json') {
      result.base64Data = imageData.b64_json;
    } else {
      result.imageUrl = imageData.url;
    }

    // Add revision ID if available
    if ('id' in response) {
      result.id = response.id as string;
    }

    return result;
  }

  /**
   * Handles errors in a consistent way
   * @param error Error to handle
   * @throws Appropriate OpenAI error
   * @private
   */
  private _handleError(error: unknown): never {
    // Log the error (sanitize sensitive data)
    this._logger?.error('OpenAI service error', {
      name: error instanceof Error ? error.name : 'Unknown error',
      message: error instanceof Error ? error.message : String(error),
    });

    // Re-throw OpenAI errors
    if (error instanceof OpenAIError) {
      throw error;
    }

    // Handle validation errors from zod
    if (error instanceof z.ZodError) {
      throw new OpenAIValidationError(`Validation error: ${error.errors.map((e) => e.message).join(', ')}`);
    }

    // Handle other errors
    throw new OpenAIError(`Unexpected error: ${(error as Error)?.message || String(error)}`);
  }
}
