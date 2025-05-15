import { OpenAIService } from './openai.service';
import type { GenerateImageSchema } from '../validators/images';

interface GenerateImageResult {
  imageUrl: string;
  model: string;
  parameters: Record<string, unknown>;
}

export class ImageService {
  private _openai: OpenAIService;
  private readonly _logger: Console;

  constructor(openaiApiKey: string, logger = console) {
    this._openai = new OpenAIService({
      apiKey: openaiApiKey,
      defaultModel: 'dall-e-3',
      defaultOptions: {
        responseFormat: 'url',
      },
      logger,
    });
    this._logger = logger;
  }

  /**
   * Generates an image based on a prompt
   * @param params Generation parameters
   * @returns URL to the generated image
   */
  public async generateImage(params: GenerateImageSchema): Promise<GenerateImageResult> {
    if (!params.prompt) {
      throw new Error('Prompt is required');
    }

    try {
      // Determine which template to use based on type
      const templateType = params.type === 'front' ? 'front card' : 'back card';

      // Prepare a detailed prompt with image type
      const enhancedPrompt = `
        Create a high-quality ${templateType} image for a trading card game with the following description:
        ${params.prompt}
        
        The image should be detailed, vibrant, and suitable for a card game.
        Make sure the image has good composition and works well on a ${params.type} card.
        Always make a picture from profile view.
      `;

      // Generate image with OpenAI
      const result = await this._openai.generateImage({
        prompt: enhancedPrompt,
      });

      // Check if we have an image URL
      if (!result.imageUrl) {
        throw new Error('No image URL returned from generation service');
      }

      return {
        imageUrl: result.imageUrl,
        model: result.model,
        parameters: {
          type: params.type,
          style: 'vivid',
          quality: 'hd',
        },
      };
    } catch (error) {
      this._logger.error('Image generation error:', error);
      throw new Error(`Failed to generate image: ${(error as Error).message}`);
    }
  }
}
