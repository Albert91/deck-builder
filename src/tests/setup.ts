// src/tests/setup.ts
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Rozszerzamy oczekiwania Vitest o matchery Testing Library
expect.extend(matchers);

// Automatyczne czyszczenie po każdym teście
afterEach(() => {
  cleanup();
});

// Mock dla Supabase
vi.mock('@/db/supabase.client.ts', async () => {
  const actual = await vi.importActual('@/db/supabase.client.ts');
  return {
    ...actual,
    supabaseClient: {
      auth: {
        getUser: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
            order: vi.fn(() => ({
              limit: vi.fn(() => ({
                range: vi.fn(),
              })),
            })),
          })),
          match: vi.fn(),
          neq: vi.fn(),
          insert: vi.fn(),
          update: vi.fn(),
          delete: vi.fn(),
          count: vi.fn(),
        })),
      })),
    },
    createSupabaseServerClient: vi.fn(() => ({
      auth: {
        getUser: vi.fn(),
        getSession: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
    })),
  };
});

// Globalne mocki
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Zmienne środowiskowe dla testów
vi.stubGlobal('import.meta.env', {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_KEY: 'mock-supabase-key',
  OPENAI_API_KEY: 'mock-openai-api-key',
});
