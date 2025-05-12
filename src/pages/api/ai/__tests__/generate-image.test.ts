import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../generate-image';
import { ImageService } from '../../../../lib/services/imageService';

// Mock dependencies
vi.mock('../../../../lib/services/imageService');

// Mock environment variables
vi.mock('import.meta.env', () => ({
  env: {
    OPENROUTER_API_KEY: 'mock-api-key',
  },
}));

describe('generate-image API endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock ImageService implementation
    (ImageService as any).mockImplementation(() => ({
      generateImage: vi.fn().mockResolvedValue('https://example.com/generated-image.jpg'),
    }));
  });
  
  it('should return 401 when user is not authenticated', async () => {
    // Arrange
    const request = new Request('https://example.com/api/ai/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Test prompt', type: 'front' }),
    });
    
    const context = {
      request,
      locals: { session: null },
      params: {},
      render: vi.fn(),
      redirect: vi.fn(),
    };
    
    // Act
    const response = await POST(context as any);
    
    // Assert
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized. You must be signed in.');
  });
  
  it('should return 400 for invalid JSON body', async () => {
    // Arrange
    const request = new Request('https://example.com/api/ai/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json',
    });
    
    const context = {
      request,
      locals: { session: { user: { id: 'user1' } } },
      params: {},
      render: vi.fn(),
      redirect: vi.fn(),
    };
    
    // Act
    const response = await POST(context as any);
    
    // Assert
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Invalid request body');
  });
  
  it('should return 400 for validation errors', async () => {
    // Arrange
    const request = new Request('https://example.com/api/ai/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: '', type: 'invalid' }),
    });
    
    const context = {
      request,
      locals: { session: { user: { id: 'user1' } } },
      params: {},
      render: vi.fn(),
      redirect: vi.fn(),
    };
    
    // Act
    const response = await POST(context as any);
    
    // Assert
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation error');
  });
  
  it('should return 200 with imageUrl for valid request', async () => {
    // Arrange
    const request = new Request('https://example.com/api/ai/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'A majestic dragon', type: 'front' }),
    });
    
    const context = {
      request,
      locals: { session: { user: { id: 'user1' } } },
      params: {},
      render: vi.fn(),
      redirect: vi.fn(),
    };
    
    // Act
    const response = await POST(context as any);
    
    // Assert
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.imageUrl).toBe('https://example.com/generated-image.jpg');
    expect(ImageService).toHaveBeenCalledWith('mock-api-key');
  });
  
  it('should return 500 when image generation fails', async () => {
    // Arrange
    const request = new Request('https://example.com/api/ai/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'A majestic dragon', type: 'front' }),
    });
    
    const context = {
      request,
      locals: { session: { user: { id: 'user1' } } },
      params: {},
      render: vi.fn(),
      redirect: vi.fn(),
    };
    
    // Mock image generation error
    (ImageService as any).mockImplementation(() => ({
      generateImage: vi.fn().mockRejectedValue(new Error('Generation failed')),
    }));
    
    // Act
    const response = await POST(context as any);
    
    // Assert
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('Failed to generate image');
    expect(body.details).toBe('Generation failed');
  });
}); 