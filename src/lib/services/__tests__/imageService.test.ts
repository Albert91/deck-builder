import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageService } from '../imageService';
import { OpenRouterService } from '../openrouter.service';

// Mock dependencies
vi.mock('../openrouter.service');
vi.mock('fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue(Buffer.from('mock-image-data')),
}));

describe('ImageService', () => {
  let imageService: ImageService;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock OpenRouterService implementation
    (OpenRouterService as any).mockImplementation(() => ({
      generateChatCompletion: vi.fn().mockResolvedValue({
        content: { imageUrl: 'https://example.com/generated-image.jpg' },
        model: 'mock-model',
        usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
        id: 'mock-id',
      }),
    }));

    // Create instance of service to test
    imageService = new ImageService('mock-api-key');
  });

  it('should generate an image with valid parameters', async () => {
    // Arrange
    const params = {
      prompt: 'A majestic dragon',
      type: 'front' as const,
    };

    // Act
    const result = await imageService.generateImage(params);

    // Assert
    expect(result).toBe('https://example.com/generated-image.jpg');
  });

  it('should throw an error when prompt is empty', async () => {
    // Arrange
    const params = {
      prompt: '',
      type: 'back' as const,
    };

    // Act & Assert
    await expect(imageService.generateImage(params)).rejects.toThrow('Prompt is required');
  });

  it('should handle API errors appropriately', async () => {
    // Arrange
    const params = {
      prompt: 'A beautiful landscape',
      type: 'front' as const,
    };

    // Mock API error
    (OpenRouterService as any).mockImplementation(() => ({
      generateChatCompletion: vi.fn().mockRejectedValue(new Error('API error')),
    }));

    imageService = new ImageService('mock-api-key');

    // Act & Assert
    await expect(imageService.generateImage(params)).rejects.toThrow('Failed to generate image: API error');
  });

  it('should handle invalid API responses', async () => {
    // Arrange
    const params = {
      prompt: 'A magical forest',
      type: 'back' as const,
    };

    // Mock invalid response
    (OpenRouterService as any).mockImplementation(() => ({
      generateChatCompletion: vi.fn().mockResolvedValue({
        content: {
          /* missing imageUrl */
        },
      }),
    }));

    imageService = new ImageService('mock-api-key');

    // Act & Assert
    await expect(imageService.generateImage(params)).rejects.toThrow('Invalid response from image generation service');
  });
});
