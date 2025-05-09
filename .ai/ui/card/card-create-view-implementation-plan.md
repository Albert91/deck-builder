# Plan implementacji widoku Edytora Karty

## 1. Przegląd
Edytor Karty pozwala użytkownikowi na tworzenie nowej karty lub edycję istniejącej w wybranej talii. Widok umożliwia edycję tytułu, opisu oraz atrybutów karty, a także podgląd karty w czasie rzeczywistym. Zmiany są automatycznie zapisywane.

## 2. Routing widoku
- Nowa karta: `/decks/:deckId/cards/new`
- Edycja istniejącej karty: `/decks/:deckId/cards/:cardId/edit`

## 3. Struktura komponentów
```
CardEditorPage
├── CardEditorForm
│   ├── CardTitleInput
│   ├── CardDescriptionTextarea
│   ├── CardAttributesSliders
│   │   ├── AttributeSlider (strength)
│   │   ├── AttributeSlider (defense)
│   │   └── AttributeSlider (health)
│   └── CardActionButtons
└── CardPreviewSection
    ├── CardPreview
    └── CardImageGenerateButton
```

## 4. Szczegóły komponentów

### CardEditorPage
- Opis komponentu: Strona główna edytora kart, która zawiera formularz i sekcję podglądu.
- Główne elementy: Layout z podziałem na dwie kolumny (formularz i podgląd).
- Obsługiwane interakcje: Nawigacja powrotna do listy kart.
- Obsługiwana walidacja: Sprawdzanie limitu kart w talii przy tworzeniu nowej karty.
- Typy: DeckDTO, CardDTO, CardFormState.
- Propsy: deckId, cardId (opcjonalnie).

### CardEditorForm
- Opis komponentu: Formularz z polami edycji karty i przyciskami akcji.
- Główne elementy: Pola dla tytułu, opisu, suwaki dla atrybutów, przyciski akcji.
- Obsługiwane interakcje: Wprowadzanie danych, automatyczne zapisywanie zmian.
- Obsługiwana walidacja: 
  - Tytuł: wymagany, 1-100 znaków
  - Opis: opcjonalny, do 500 znaków
  - Atrybuty: wartości 0-99
- Typy: CardFormData, CardUpdateCommand.
- Propsy: initialData, onSave, isLoading, deck.

### CardTitleInput
- Opis komponentu: Pole do wprowadzania tytułu karty.
- Główne elementy: Etykieta, pole tekstowe.
- Obsługiwane interakcje: Wprowadzanie tekstu, debounced zapisywanie.
- Obsługiwana walidacja: 1-100 znaków, wymagane.
- Typy: brak specyficznych.
- Propsy: value, onChange, error.

### CardDescriptionTextarea
- Opis komponentu: Pole do wprowadzania opisu karty.
- Główne elementy: Etykieta, pole tekstowe wieloliniowe.
- Obsługiwane interakcje: Wprowadzanie tekstu, debounced zapisywanie.
- Obsługiwana walidacja: Maksymalnie 500 znaków.
- Typy: brak specyficznych.
- Propsy: value, onChange, error.

### CardAttributesSliders
- Opis komponentu: Kontener dla suwaków atrybutów.
- Główne elementy: Grupa suwaków atrybutów.
- Obsługiwane interakcje: Brak bezpośrednich.
- Obsługiwana walidacja: Brak bezpośrednich.
- Typy: CardAttributes.
- Propsy: attributes, onChange.

### AttributeSlider
- Opis komponentu: Komponent suwaka dla pojedynczego atrybutu karty.
- Główne elementy: Etykieta atrybutu, suwak, pole numeryczne.
- Obsługiwane interakcje: Przesuwanie suwaka, wpisywanie wartości liczbowej.
- Obsługiwana walidacja: Wartość 0-99, całkowita.
- Typy: brak specyficznych.
- Propsy: name, label, value, onChange, min, max.

### CardActionButtons
- Opis komponentu: Grupa przycisków akcji dla formularza.
- Główne elementy: Przyciski zapisz, anuluj, usuń.
- Obsługiwane interakcje: Kliknięcie przycisków, potwierdzenie usunięcia.
- Obsługiwana walidacja: Brak.
- Typy: brak specyficznych.
- Propsy: onSave, onCancel, onDelete, isNewCard, isDirty.

### CardPreviewSection
- Opis komponentu: Sekcja podglądu karty i generowania obrazu.
- Główne elementy: Podgląd karty, przycisk generowania obrazu.
- Obsługiwane interakcje: Przełączanie między awersem i rewersem, generowanie obrazu.
- Obsługiwana walidacja: Brak.
- Typy: CardPreviewData.
- Propsy: cardData, deckId, cardId, onImageGenerated.

### CardPreview
- Opis komponentu: Wizualizacja karty z aktualnie wprowadzonymi danymi.
- Główne elementy: Obraz karty, tytuł, opis, wartości atrybutów.
- Obsługiwane interakcje: Przełączanie widoku awers/rewers.
- Obsługiwana walidacja: Brak.
- Typy: CardViewModel.
- Propsy: cardData, frontImage, backImage.

### CardImageGenerateButton
- Opis komponentu: Przycisk do generowania obrazu karty przez AI.
- Główne elementy: Przycisk, wskaźnik ładowania.
- Obsługiwane interakcje: Kliknięcie przycisku, anulowanie generowania.
- Obsługiwana walidacja: Brak.
- Typy: brak specyficznych.
- Propsy: onGenerate, isGenerating, title.

## 5. Typy

```typescript
// Model danych formularza karty
interface CardFormData {
  title: string;
  description: string | null;
  attributes: CardAttributes;
  isDirty: boolean;
}

// Model atrybutów karty
interface CardAttributes {
  strength: number;
  defense: number;
  health: number;
}

// Model dla kontekstu edytora karty
interface CardEditorContext {
  formData: CardFormData;
  isLoading: boolean;
  isSaving: boolean;
  isGeneratingImage: boolean;
  errors: CardFormErrors;
  cardImageUrl: string | null;
  updateField: (field: string, value: any) => void;
  saveCard: () => Promise<CardDTO>;
  generateCardImage: () => Promise<string>;
}

// Model błędów walidacji formularza
interface CardFormErrors {
  title?: string;
  description?: string;
  attributes?: {
    strength?: string;
    defense?: string;
    health?: string;
  };
  form?: string;
}

// Model statusu operacji API
interface CardApiStatus {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
}

// Model podglądu karty
interface CardPreviewData {
  title: string;
  description: string | null;
  attributes: CardAttributes;
  frontImageUrl: string | null;
  backImageUrl: string | null;
}

// Komenda aktualizacji karty
interface CardUpdateCommand {
  title?: string;
  description?: string | null;
  attributes?: {
    strength?: number;
    defense?: number;
    health?: number;
  };
}
```

## 6. Zarządzanie stanem

### useCardEditor - Custom Hook

## 7. Integracja API

### Endpointy kart
1. **Pobieranie karty**
   - Metoda: GET
   - URL: `/api/decks/:deckId/cards/:cardId`
   - Typ odpowiedzi: `CardDTO`

2. **Tworzenie karty**
   - Metoda: POST
   - URL: `/api/decks/:deckId/cards`
   - Typ żądania: `CreateCardCommand`
   - Typ odpowiedzi: `CardDTO`

3. **Aktualizacja karty**
   - Metoda: PUT
   - URL: `/api/decks/:deckId/cards/:cardId`
   - Typ żądania: `UpdateCardCommand`
   - Typ odpowiedzi: `CardDTO`

4. **Usuwanie karty**
   - Metoda: DELETE
   - URL: `/api/decks/:deckId/cards/:cardId`
   - Typ odpowiedzi: 204 No Content

5. **Generowanie obrazu karty**
   - Metoda: POST
   - URL: `/api/decks/:deckId/cards/:cardId/generate-image`
   - Typ żądania: `GenerateImageCommand`
   - Typ odpowiedzi: `GeneratedImageDTO`

### Klasy klienckie API w `/src/lib/api/cards.ts`
```typescript
export async function getCard(deckId: string, cardId: string): Promise<CardDTO> {
  // Implementacja pobierania karty
}

export async function createCard(deckId: string, data: CreateCardCommand): Promise<CardDTO> {
  // Implementacja tworzenia karty
}

export async function updateCard(deckId: string, cardId: string, data: UpdateCardCommand): Promise<CardDTO> {
  // Implementacja aktualizacji karty
}

export async function deleteCard(deckId: string, cardId: string): Promise<void> {
  // Implementacja usuwania karty
}

export async function generateCardImage(deckId: string, cardId: string, prompt: string): Promise<GeneratedImageDTO> {
  // Implementacja generowania obrazu karty
}
```

## 8. Interakcje użytkownika

1. **Wprowadzanie/edycja tytułu karty:**
   - Użytkownik wprowadza tytuł w polu tekstowym
   - System waliduje długość (1-100 znaków)
   - Zmiany są automatycznie zapisywane po krótkiej przerwie w pisaniu (debounce)
   - Podgląd karty jest aktualizowany na żywo

2. **Wprowadzanie/edycja opisu karty:**
   - Użytkownik wprowadza opis w polu tekstowym wieloliniowym
   - System waliduje długość (max 500 znaków)
   - Zmiany są automatycznie zapisywane po krótkiej przerwie w pisaniu (debounce)
   - Podgląd karty jest aktualizowany na żywo

3. **Ustawianie atrybutów karty:**
   - Użytkownik przesuwa suwak dla atrybutu lub wprowadza wartość liczbową
   - System waliduje, czy wartość mieści się w zakresie (0-99)
   - Zmiany są automatycznie zapisywane
   - Podgląd karty jest aktualizowany na żywo

4. **Generowanie obrazu karty:**
   - Użytkownik klika przycisk "Generuj obraz"
   - Interfejs jest blokowany i wyświetlany jest komunikat "Tworzenie obrazu karty"
   - Obraz jest generowany na podstawie tytułu karty
   - Po zakończeniu generowania obraz jest wyświetlany w podglądzie karty
   - Jeśli wystąpi błąd, interfejs jest odblokowywany i wyświetlany jest komunikat o błędzie

5. **Przełączanie podglądu karty:**
   - Użytkownik może przełączać między awersem i rewersem karty
   - Przełączanie nie wpływa na dane karty

## 9. Warunki i walidacja

1. **Walidacja tytułu karty:**
   - Tytuł jest wymagany
   - Długość tytułu: 1-100 znaków
   - Walidacja wykonywana przy zmianie pola i przed zapisem

2. **Walidacja opisu karty:**
   - Opis jest opcjonalny
   - Maksymalna długość: 500 znaków
   - Walidacja wykonywana przy zmianie pola i przed zapisem

3. **Walidacja atrybutów karty:**
   - Wartość atrybutu: liczba całkowita od 0 do 99
   - Domyślna wartość: 0
   - Walidacja wykonywana przy zmianie wartości i przed zapisem

4. **Walidacja limitu kart:**
   - Podczas tworzenia nowej karty system sprawdza, czy nie przekroczono limitu 100 kart w talii
   - Jeśli limit został osiągnięty, formularz jest blokowany i wyświetlany jest komunikat o limicie

## 10. Obsługa błędów

1. **Błędy podczas pobierania karty:**
   - Wyświetlanie komunikatu "Nie udało się pobrać danych karty"
   - Przycisk ponownego ładowania
   - Przycisk powrotu do listy kart

2. **Błędy podczas zapisywania karty:**
   - Wyświetlanie szczegółowego komunikatu błędu
   - Automatyczne ponowienie próby zapisu
   - Blokowanie nawigacji, jeśli zmiany nie zostały zapisane

3. **Błędy podczas generowania obrazu:**
   - Wyświetlanie komunikatu "Nie udało się wygenerować obrazu karty"
   - Przycisk ponownej próby
   - Możliwość kontynuowania edycji bez obrazu

4. **Błędy walidacji:**
   - Wyświetlanie komunikatów o błędach pod odpowiednimi polami
   - Podświetlanie niepoprawnych pól
   - Blokowanie zapisu do czasu poprawienia błędów

## 11. Kroki implementacji

1. Utwórz pliki Astro dla tras `/decks/:deckId/cards/new` i `/decks/:deckId/cards/:cardId/edit`
2. Zaimplementuj model danych i typy potrzebne do implementacji widoku (CardFormData, CardAttributes, itp.)
3. Utwórz hook `useCardEditor` do zarządzania stanem edytora karty
4. Stwórz nowe API klienckie funkcje w `src/lib/api/cards.ts`
5. Zaimplementuj komponent CardEditorPage jako główny kontener
6. Zaimplementuj komponent CardEditorForm do obsługi formularza
7. Zaimplementuj komponenty pól formularza (CardTitleInput, CardDescriptionTextarea)
8. Zaimplementuj komponent CardAttributesSliders i AttributeSlider
9. Dostosuj istniejący komponent CardPreview do wymagań edytora
10. Zaimplementuj komponent CardImageGenerateButton
11. Zaimplementuj logikę automatycznego zapisywania z debounce
12. Dodaj mechanizm walidacji formularza
13. Zaimplementuj obsługę błędów i komunikaty dla użytkownika
14. Zaimplementuj blokadę UI podczas generowania obrazu
15. Dodaj testy jednostkowe dla kluczowych komponentów
16. Przeprowadź testy manualne i dostosuj interfejs użytkownika 