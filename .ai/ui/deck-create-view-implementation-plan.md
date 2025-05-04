# Plan implementacji widoku Kreator/Edytor Talii

## 1. Przegląd
Widok Kreatora/Edytora Talii umożliwia zalogowanym użytkownikom tworzenie nowych talii kart lub edycję istniejących. Użytkownik może nadać talii nazwę, wybrać szablon z karuzeli oraz generować tło i rewers karty za pomocą AI. Interfejs zapewnia podgląd obu stron karty w czasie rzeczywistym oraz automatyczny zapis zmian.

## 2. Routing widoku
- `/decks/new` - tworzenie nowej talii
- `/decks/:deckId/edit` - edycja istniejącej talii

## 3. Struktura komponentów
```
DeckFormPage
├── LoadingOverlay (warunkowy)
├── DeckNameField
├── TemplateCarousel
│   ├── TemplateCard (wielokrotny)
├── CardPreview
│   ├── CardFront
│   ├── CardBack
├── AIGeneratorPanel
│   ├── AIPromptField
│   ├── GenerateButton
└── ToastNotification (warunkowy)
```

## 4. Szczegóły komponentów

### DeckFormPage
- Opis komponentu: Główny komponent strony formularza, który zarządza stanem formularza i komunikacją z API
- Główne elementy: Kontener z nagłówkiem, formularzem do wprowadzania danych talii i przyciskami akcji
- Obsługiwane interakcje: Auto-zapis po zmianach, przekierowanie po utworzeniu talii
- Obsługiwana walidacja: 
  - Weryfikacja limitu 5 talii na użytkownika
  - Sprawdzanie czy pola wymagane są wypełnione
- Typy: DeckFormData, DeckResponseDTO
- Propsy: deckId (opcjonalny - dla trybu edycji)

### DeckNameField
- Opis komponentu: Pole do wprowadzania nazwy talii
- Główne elementy: Label, input, komunikat błędu
- Obsługiwane interakcje: Zmiana nazwy talii z auto-zapisem
- Obsługiwana walidacja: Niepusta nazwa (wymagana)
- Typy: { name: string, onChange: (name: string) => void, error?: string }
- Propsy: name, onChange, error

### TemplateCarousel
- Opis komponentu: Karuzela do wyboru szablonów talii, pokazująca max 3 elementy jednocześnie
- Główne elementy: Kontener karuzeli, przyciski przewijania, elementy szablonów
- Obsługiwane interakcje: Przewijanie szablonów, wybór szablonu
- Obsługiwana walidacja: Wybrany szablon jest wymagany
- Typy: Template[], selectedTemplateId, onTemplateSelect
- Propsy: templates, selectedTemplateId, onTemplateSelect, isLoading

### TemplateCard
- Opis komponentu: Pojedynczy element karuzeli reprezentujący szablon
- Główne elementy: Obrazek szablonu, nazwa, indicator wybranego elementu
- Obsługiwane interakcje: Kliknięcie wybiera szablon
- Obsługiwana walidacja: brak
- Typy: Template, boolean (isSelected), onSelect
- Propsy: template, isSelected, onSelect

### CardPreview
- Opis komponentu: Podgląd obu stron karty (awers i rewers)
- Główne elementy: Dwa kontenery z podglądem obrazów, przycisk przełączania stron
- Obsługiwane interakcje: Przełączanie między awersem a rewersem
- Obsługiwana walidacja: brak
- Typy: { frontImage?: string, backImage?: string }
- Propsy: frontImage, backImage

### AIGeneratorPanel
- Opis komponentu: Panel do generowania grafik za pomocą AI
- Główne elementy: Pola na prompt, przyciski generowania dla awersu i rewersu
- Obsługiwane interakcje: Wprowadzanie promptu, generowanie grafik
- Obsługiwana walidacja: Niepusty prompt
- Typy: { onGenerate: (prompt: string, type: 'front' | 'back') => Promise<string>, isGenerating: boolean }
- Propsy: onGenerate, isGenerating, prompt, onPromptChange

### LoadingOverlay
- Opis komponentu: Nakładka blokująca UI podczas generowania
- Główne elementy: Półprzezroczysty overlay, spinner, komunikat
- Obsługiwane interakcje: brak
- Obsługiwana walidacja: brak
- Typy: { isLoading: boolean, message: string }
- Propsy: isLoading, message

### ToastNotification
- Opis komponentu: Powiadomienie toast dla komunikatów o błędach/sukcesie
- Główne elementy: Kontener powiadomienia, ikona, tekst, przycisk zamknięcia
- Obsługiwane interakcje: Zamknięcie powiadomienia
- Obsługiwana walidacja: brak
- Typy: Toast
- Propsy: toast, onClose

## 5. Typy

```typescript
// Request DTO
interface DeckCreateDTO {
  name: string;
  template_id: string;
}

// Response DTO
interface DeckResponseDTO {
  id: string;
  name: string;
  share_hash: string;
  template_id: string;
}

// Template Model
interface Template {
  id: string;
  name: string;
  previewImage: string;
}

// Form ViewModel
interface DeckFormData {
  name: string;
  templateId: string;
  frontImage?: string;
  backImage?: string;
}

// Toast Notification
interface Toast {
  type: 'success' | 'error';
  message: string;
  id: string;
}

// AIGenerator Types
interface AIPrompt {
  text: string;
  type: 'front' | 'back';
}

interface AIGenerationResult {
  imageUrl: string;
  type: 'front' | 'back';
}
```

## 6. Zarządzanie stanem

Będzie wykorzystany niestandardowy hook `useDeckForm`, który zapewni wszystkie funkcje potrzebne do zarządzania stanem formularza:

```typescript
const useDeckForm = (deckId?: string) => {
  // Stan formularza, ładowania, błędy, toast
  const [formData, setFormData] = useState<DeckFormData>({
    name: '',
    templateId: '',
    frontImage: undefined,
    backImage: undefined
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  // Funkcje:
  // - loadDeck: ładowanie talii do edycji
  // - createDeck: tworzenie nowej talii
  // - updateDeck: aktualizacja istniejącej talii (auto-save)
  // - updateFormField: aktualizacja pojedynczego pola formularza
  // - generateImage: generowanie obrazu za pomocą AI
  
  // ...implementacja funkcji...
  
  return {
    formData,
    isLoading,
    isGeneratingAI,
    error,
    toast,
    // zwracane funkcje
  };
};
```

Dodatkowo, zostanie utworzony hook `useTemplates` do zarządzania szablonami:

```typescript
const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Funkcja do ładowania szablonów z API
  const loadTemplates = async () => {
    // implementacja
  };
  
  // Załadowanie szablonów po montażu komponentu
  useEffect(() => {
    loadTemplates();
  }, []);
  
  return { templates, isLoading };
};
```

## 7. Integracja API

Wykorzystane będą następujące endpointy:

1. **Tworzenie nowej talii**:
   - Metoda: `POST`
   - URL: `/decks`
   - Typ żądania: `DeckCreateDTO` 
   - Typ odpowiedzi: `DeckResponseDTO`
   - Obsługa błędów: 400 (nieprawidłowe dane), 403 (limit 5 talii)

2. **Pobieranie talii do edycji**:
   - Metoda: `GET`
   - URL: `/decks/:deckId`
   - Typ odpowiedzi: `DeckResponseDTO`

3. **Aktualizacja talii (auto-save)**:
   - Metoda: `PUT`
   - URL: `/decks/:deckId`
   - Typ żądania: `DeckCreateDTO`
   - Typ odpowiedzi: `DeckResponseDTO`

4. **Generowanie obrazu przez AI**:
   - Metoda: `POST`
   - URL: `/api/ai/generate-image`
   - Typ żądania: `{ prompt: string, type: 'front' | 'back' }`
   - Typ odpowiedzi: `{ imageUrl: string }`

## 8. Interakcje użytkownika

1. **Tworzenie nowej talii**:
   - Użytkownik wchodzi na `/decks/new`
   - Wprowadza nazwę talii
   - Wybiera szablon z karuzeli
   - System automatycznie zapisuje talię
   - Użytkownik zostaje przekierowany do widoku edycji

2. **Edycja nazwy talii**:
   - Użytkownik zmienia tekst w polu nazwy
   - Po zakończeniu edycji (blur, timeout) system zapisuje zmiany
   - Wyświetlany jest toast o powodzeniu lub błędzie

3. **Wybór szablonu**:
   - Użytkownik przewija karuzelę szablonów
   - Klika na wybrany szablon
   - System zapisuje zmianę i aktualizuje podgląd

4. **Generowanie grafiki AI**:
   - Użytkownik wprowadza prompt
   - Wybiera czy generować awers czy rewers
   - Klika przycisk generowania
   - UI zostaje zablokowane overlayem z komunikatem
   - Po wygenerowaniu podgląd jest aktualizowany
   - System zapisuje wygenerowany obraz

## 9. Warunki i walidacja

1. **Warunki dotyczące nazwy talii**:
   - Pole jest wymagane
   - Walidacja odbywa się w komponencie DeckNameField
   - Wyświetlanie komunikatu o błędzie pod polem
   - Blokada zapisu, jeśli pole jest puste

2. **Warunki dotyczące limitu talii**:
   - Limit 5 talii na użytkownika
   - Weryfikacja odbywa się na poziomie API
   - W razie przekroczenia wyświetlany jest toast z informacją

3. **Warunki dotyczące szablonu**:
   - Szablon jest wymagany
   - Domyślnie wybierany jest pierwszy z listy
   - Walidacja w komponencie TemplateCarousel

4. **Warunki dotyczące generatora AI**:
   - Prompt nie może być pusty
   - Walidacja w komponencie AIGeneratorPanel
   - Blokada przycisku generowania, jeśli prompt jest pusty

## 10. Obsługa błędów

1. **Błąd podczas tworzenia talii**:
   - Odblokowanie UI
   - Wyświetlenie toast z informacją o błędzie
   - Jeśli błąd to limit talii (403), wyświetlenie specjalnego komunikatu

2. **Błąd podczas generowania obrazu AI**:
   - Odblokowanie UI (wyłączenie LoadingOverlay)
   - Wyświetlenie toast z informacją o błędzie
   - Możliwość ponowienia operacji

3. **Błąd podczas auto-zapisu**:
   - Cichy retry (3 próby)
   - Po nieudanych próbach wyświetlenie toast z informacją
   - Umożliwienie ręcznego zapisu

4. **Błąd podczas ładowania szablonów**:
   - Wyświetlenie informacji o błędzie w komponencie TemplateCarousel
   - Przycisk "Spróbuj ponownie"

## 11. Kroki implementacji

1. **Przygotowanie typów**:
   - Zdefiniowanie wszystkich wymaganych interfejsów i typów
   - Umieszczenie ich w odpowiednich plikach w katalogu `src/types.ts`

2. **Implementacja hooków**:
   - Implementacja `useDeckForm` do zarządzania stanem formularza
   - Implementacja `useTemplates` do zarządzania szablonami

3. **Implementacja komponentów bazowych**:
   - Implementacja LoadingOverlay
   - Implementacja ToastNotification
   - Implementacja DeckNameField

4. **Implementacja komponentów związanych z szablonem**:
   - Implementacja TemplateCard
   - Implementacja TemplateCarousel

5. **Implementacja komponentów związanych z podglądem**:
   - Implementacja CardPreview (CardFront, CardBack)

6. **Implementacja generatora AI**:
   - Implementacja AIGeneratorPanel
   - Implementacja AIPromptField
   - Implementacja GenerateButton

7. **Integracja komponentów w DeckFormPage**:
   - Połączenie wszystkich komponentów
   - Implementacja logiki przełączania między trybami (nowa/edycja)

8. **Implementacja integracji z API**:
   - Implementacja wywołań API w hookach
   - Implementacja obsługi błędów

9. **Implementacja auto-zapisu**:
   - Dodanie debouncing do formularza
   - Implementacja logiki auto-zapisu

10. **Implementacja routingu**:
    - Konfiguracja ścieżek w Astro
    - Implementacja przekierowań

11. **Testowanie i finalizacja**:
    - Testowanie wszystkich interakcji użytkownika
    - Testowanie obsługi błędów
    - Finalne poprawki UX 