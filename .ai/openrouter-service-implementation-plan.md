# Przewodnik implementacji usługi OpenRouter

## 1. Opis usługi

Usługa OpenRouter jest warstwą pośredniczącą między frontendem aplikacji a API OpenRouter, umożliwiającą generowanie odpowiedzi LLM (Large Language Model) na potrzeby czatów. Odpowiada za:
- Przyjmowanie i walidację żądań od użytkownika (prompt, parametry modelu, format odpowiedzi, itp.).
- Komunikację z API OpenRouter (autoryzacja, przekazywanie parametrów, obsługa odpowiedzi i błędów).
- Standaryzację i walidację odpowiedzi (w tym obsługę response_format).
- Bezpieczne zarządzanie kluczami API i ochronę przed nadużyciami.

## 2. Opis konstruktora

Konstruktor usługi powinien przyjmować:
- Klucz API OpenRouter (zazwyczaj z `import.meta.env`)
- Opcjonalnie: domyślne parametry modelu, domyślny model, domyślny system prompt
- Logger do obsługi błędów

**Przykład:**
```ts
constructor({ apiKey, defaultModel, defaultParams, logger }: {
  apiKey: string;
  defaultModel?: string;
  defaultParams?: Record<string, unknown>;
  logger?: Logger;
})
```

## 3. Publiczne metody i pola

- `generateChatCompletion(input: ChatCompletionInput): Promise<ChatCompletionResult>`
  - Przyjmuje: komunikaty (system, user), model, parametry, response_format
  - Zwraca: odpowiedź modelu (tekst lub JSON), metadane
- `setApiKey(key: string): void`
- `setDefaultModel(model: string): void`
- `setDefaultParams(params: Record<string, unknown>): void`

**Typy:**
```ts
type ChatCompletionInput = {
  systemPrompt: string;
  userPrompt: string;
  model: string;
  params?: Record<string, unknown>;
  responseFormat?: ResponseFormat;
};

type ResponseFormat = {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: Record<string, unknown>;
  };
};
```

## 4. Prywatne metody i pola

- `_buildRequestPayload(input: ChatCompletionInput): OpenRouterPayload`
- `_callOpenRouterApi(payload: OpenRouterPayload): Promise<OpenRouterResponse>`
- `_validateResponse(response: OpenRouterResponse, responseFormat?: ResponseFormat): boolean`
- `_handleError(error: unknown): never`
- Pola prywatne: `_apiKey`, `_defaultModel`, `_defaultParams`, `_logger`

## 5. Obsługa błędów

**Scenariusze błędów:**
1. Brak klucza API
2. Błąd sieciowy lub timeout
3. Błąd walidacji wejścia (np. niepoprawny prompt, model, response_format)
4. Błąd walidacji odpowiedzi (niezgodność z response_format)
5. Błąd autoryzacji (401/403)
6. Przekroczenie limitów API (429)
7. Błąd serwera OpenRouter (5xx)

**Praktyki:**
- Używaj custom error types (np. `OpenRouterAuthError`, `OpenRouterValidationError`)
- Loguj szczegóły błędów (bez wrażliwych danych)
- Zwracaj przyjazne komunikaty dla użytkownika
- Stosuj guard clauses i early returns

## 6. Kwestie bezpieczeństwa

- Przechowuj klucz API wyłącznie po stronie serwera (np. w zmiennych środowiskowych)
- Waliduj i filtruj wszystkie dane wejściowe (zod lub własne schematy)
- Ogranicz liczbę żądań (rate limiting, np. na poziomie middleware)
- Maskuj szczegóły błędów w odpowiedziach do klienta
- Loguj tylko niezbędne informacje (bez promptów i kluczy)
- Stosuj CORS i inne zabezpieczenia HTTP na endpointach API

## 7. Plan wdrożenia krok po kroku

1. **Utwórz plik serwisu:**
   - `src/lib/services/openrouter.ts`
2. **Zaimplementuj klasę `OpenRouterService` zgodnie z powyższą specyfikacją.**
3. **Dodaj walidację wejścia:**
   - Użyj zod do walidacji promptów, modelu, response_format.
4. **Zaimplementuj obsługę komunikatów:**
   - System prompt: przekazuj jako pierwszy komunikat w tablicy messages.
   - User prompt: przekazuj jako drugi komunikat.
   - Przykład:
     ```ts
     messages: [
       { role: 'system', content: systemPrompt },
       { role: 'user', content: userPrompt }
     ]
     ```
5. **Obsłuż response_format:**
   - Przekazuj do API OpenRouter w polu `response_format`:
     ```ts
     response_format: {
       type: 'json_schema',
       json_schema: {
         name: 'CardSchema',
         strict: true,
         schema: {
           type: 'object',
           properties: {
             title: { type: 'string' },
             description: { type: 'string' }
           },
           required: ['title', 'description']
         }
       }
     }
     ```
6. **Obsłuż wybór modelu i parametrów:**
   - Przekazuj nazwę modelu w polu `model` (np. 'openai/gpt-4-turbo')
   - Przekazuj parametry modelu (np. temperature, max_tokens) w polu `params`
   - Przykład:
     ```ts
     model: 'openai/gpt-4-turbo',
     params: { temperature: 0.7, max_tokens: 512 }
     ```
7. **Zaimplementuj obsługę błędów zgodnie z sekcją 5.**
8. **Dodaj testy jednostkowe dla serwisu.**
9. **Zaimplementuj endpoint API:**
   - `src/pages/api/openrouter.ts` (lub w podkatalogu)
   - Endpoint przyjmuje żądania, waliduje je, wywołuje serwis i zwraca odpowiedź.
10. **Zintegruj z frontendem:**
    - Wywołuj endpoint API z poziomu React/Astro, nie przekazuj klucza API do klienta.
11. **Zaimplementuj limity i logowanie błędów.**
12. **Przetestuj całość end-to-end.**

---

### Przykłady implementacji kluczowych elementów

#### 1. Komunikat systemowy i użytkownika
```ts
messages: [
  { role: 'system', content: 'Jesteś pomocnym asystentem.' },
  { role: 'user', content: 'Wygeneruj opis karty.' }
]
```

#### 2. response_format (schemat JSON)
```ts
response_format: {
  type: 'json_schema',
  json_schema: {
    name: 'CardSchema',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' }
      },
      required: ['title', 'description']
    }
  }
}
```

#### 3. Nazwa modelu i parametry
```ts
model: 'openai/gpt-4-turbo',
params: { temperature: 0.7, max_tokens: 512 }
```

---

> **Uwaga:**
> - Przestrzegaj zasad lintowania (eslint.config.mjs) i używaj yarn do instalacji zależności.
> - Umieść serwis w `src/lib/services` zgodnie z konwencją projektu.
> - Waliduj wszystkie dane wejściowe i wyjściowe.
> - Nie przekazuj klucza API do klienta. 