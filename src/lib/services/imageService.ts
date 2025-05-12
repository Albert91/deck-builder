import { readFile } from 'fs/promises';
import { join } from 'path';
import { OpenRouterService } from './openrouter.service';
import type { GenerateImageSchema } from '../validators/images';

export class ImageService {
  private _openRouter: OpenRouterService;

  constructor(openRouterApiKey: string) {
    this._openRouter = new OpenRouterService({
      apiKey: openRouterApiKey,
      defaultModel: 'google/gemini-flash-1.5',
      defaultParams: {
        temperature: 0.7,
        max_tokens: 4096,
      },
    });
  }

  /**
   * Generates an image based on a prompt
   * @param params Generation parameters
   * @returns URL to the generated image
   */
  public async generateImage(params: GenerateImageSchema): Promise<string> {
    if (!params.prompt) {
      throw new Error('Prompt is required');
    }

    try {
      // Determine which template image to use based on type
      const templateImagePath = join(
        process.cwd(),
        'public',
        'images',
        params.type === 'front' ? 'default-card-front.jpeg' : 'default-card-back.jpeg'
      );

      // Read the image file
      const imageBuffer = await readFile(templateImagePath);
      const base64Image = imageBuffer.toString('base64');

      // Create system prompt
      const systemPrompt = `
        You are an expert image generator that creates high-quality card images for a trading card game.
        You must generate a detailed, professional-looking image based on the user's description.
        The image should fit well on a card and have good composition.
        Use the provided template as reference for style and dimensions.
      `;

      // Create JSON schema for response
      const responseFormat = {
        type: 'json_schema' as const,
        json_schema: {
          name: 'imageGeneration',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              imageBase64: { type: 'string' },
            },
            required: ['imageBase64'],
          },
        },
      };

      // Call OpenRouter API with special parameters for image generation
      const result = await this._openRouter.generateChatCompletion({
        systemPrompt,
        userPrompt: `
          Generate a high-quality image for a ${params.type} card based on this description: "${params.prompt}".
          Apply these parameters:
          - Size: 1024x1024
          - Guidance scale: 7.5
          - Image generation model: google/gemini-flash-1.5
        `,
        params: {
          tools: [
            {
              type: 'image_generation',
              image_generation: {
                model: 'google/gemini-flash-1.5',
                size: '1024x1024',
                guidance_scale: 7.5,
              },
            },
          ],
        },
        // responseFormat,
      });

      console.log(result);
      // Extract image URL from response
      const { imageUrl } = result.content as { imageUrl: string };

      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error('Invalid response from image generation service');
      }

      return imageUrl;
    } catch (error) {
      console.error('Image generation error:', error);
      throw new Error(`Failed to generate image: ${(error as Error).message}`);
    }
  }
}
