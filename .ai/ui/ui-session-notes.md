
<conversation_summary>
<decisions>
1. Interfejs powinien pokazywać limity (5 talii/użytkownika, 100 kart/talię) poprzez przyciski disabled z tooltipem
2. Aplikacja powinna być w pełni responsywna
3. W edytorze widoczny powinien być tylko awers karty
4. Użytkownik powinien widzieć tekst informujący o tym, co aktualnie jest generowane przez AI
5. Wyświetlanie wszystkich kart bez paginacji w układzie kolumnowym (2 na mobile, 4 na tablet, tyle kolumn ile możliwe na desktop)
6. Panel administratora nie powinien być implementowany
7. Generyczne informacje o błędach rozróżniające grupy błędów (2xx, 4xx, 5xx)
8. Nie ma potrzeby podglądu całej talii na jednym ekranie przed eksportem do PDF
10. Nie ma potrzeby zaawansowanego sortowania/filtrowania kart w ramach talii
11. Użytkownik może edytować atrybuty karty (strength, defense, health)
12. Podgląd rewersu karty potrzebny tylko na poziomie tworzenia talii
13. Proces generowania AI powinien blokować możliwość innych akcji, interfejs powinien zostać odblokowany po błędach
14. Wyświetlanie "Tworzenie obrazu karty" podczas generowania
15. Powiadomienia toast dla timeoutów
16. Brak możliwości anulowania generowania AI
17. Atrybuty karty pokazane jako suwaki z zakresem 0-99 i wartością domyślną 0
18. Lista talii powinna umożliwiać edycję i usuwanie z poziomu listy
19. Przycisk duplikacji powinien znajdować się obok przycisków edycji i usunięcia
20. Nie ma potrzeby podglądu PDF przed generowaniem
22. Limity powinny być pokazane jako paski postępu z tooltipami pokazującymi x/5 lub x/100 po najechaniu
23. Nawigacja powinna zawierać zarówno menu jak i breadcrumbs (responsywne)
24. Wymagany jest przełącznik trybu jasnego/ciemnego (bez respektowania preferencji systemowych)
25. Na urządzeniach mobilnych nawigacja powinna być zwijana
26. Miniatury talii powinny pokazywać losową kartę z talii
</decisions>

<matched_recommendations>
1. Zaprojektowanie struktury UI opartej na trzech głównych sekcjach: autentykacja, zarządzanie taliami, edycja talii/kart, z responsywnym layoutem wspierającym wszystkie rozmiary urządzeń.
2. Implementacja ręcznego przełącznika motywu jasny/ciemny w nagłówku aplikacji bez respektowania preferencji systemowych.
3. Stworzenie responsywnego menu nawigacyjnego: pełne dla desktop, wysuwane dla urządzeń mobilnych, uzupełnione o breadcrumbs dla nawigacji kontekstowej.
4. Zaprojektowanie dashboardu z listą talii użytkownika, pokazującego miniatury (losowa karta z talii) oraz pasek postępu z tooltipem dla wizualizacji limitów (x/5).
5. Stworzenie zoptymalizowanej siatki kart w widoku talii, z 2 kolumnami na mobile, 4 na tablet i elastyczną liczbą na desktop.
6. Implementacja interfejsu edycji karty z intuicyjnymi kontrolkami: pole tytułu, opis, oraz suwaki dla atrybutów (0-99) z domyślną wartością 0.
7. Stworzenie kompaktowego komponentu karty w widoku listy z paskiem akcji zawierającym przyciski edycji, duplikacji i usunięcia.
8. Zaprojektowanie dwuetapowego interfejsu generowania talii: wybór nazwy, a następnie generowanie awersu/rewersu z podglądem obu stron.
10. Stworzenie przejrzystego systemu powiadomień toast dla komunikatów o błędach i sukcesach.
11. Implementacja blokowania interfejsu podczas generowania AI z komunikatem "Tworzenie obrazu karty" i automatycznym odblokowaniem po zakończeniu lub błędzie.
12. Zaprojektowanie interfejsu eksportu do PDF z prostym przepływem: przycisk eksportu → wskaźnik postępu → komunikat o sukcesie i link do pobrania.
13. Stworzenie widoku udostępnionej talii z wyraźnym oznaczeniem trybu "tylko do odczytu" i responsywną siatką kart.
</matched_recommendations>

<ui_architecture_planning_summary>
# Architektura UI dla MVP AI Card Deck Creator

## 1. Główna struktura aplikacji
Architektura UI będzie oparta na trzech głównych sekcjach, zgodnie z przepływem użytkownika:
- **Autentykacja**: logowanie i rejestracja (hasło lub OTP)
- **Zarządzanie taliami**: dashboard z listą talii użytkownika
- **Edycja talii/kart**: szczegółowy widok edycji pojedynczej talii i jej kart

## 2. Responsywność i dostępność
- Pełna responsywność z podejściem mobile-first
- Układ kolumnowy dla kart: 2 kolumny na mobile, 4 na tablet, elastycznie na desktop
- Przełącznik trybu jasny/ciemny bez respektowania preferencji systemowych
- Nawigacja: pełne menu dla desktop, wysuwane drawer menu dla urządzeń mobilnych
- Breadcrumbs dla łatwej nawigacji kontekstowej

## 3. Główne komponenty UI

### 3.1 Dashboard użytkownika
- Lista talii z miniaturami (losowa karta z talii)
- Paski postępu z tooltipami dla wizualizacji limitów (x/5 talii)
- Sortowanie alfabetyczne talii
- Przyciski szybkich akcji dla każdej talii (edycja, usunięcie)

### 3.2 Interfejs tworzenia/edycji talii
- Dwuetapowy proces: (1) nazwa, (2) generowanie awersu/rewersu
- Podgląd zarówno awersu jak i rewersu talii podczas generowania

### 3.3 Lista kart w talii
- Responsywna siatka kart bez paginacji
- Pasek akcji dla każdej karty (edycja, duplikacja, usunięcie)
- Pasek postępu z tooltipem dla wizualizacji limitów (x/100 kart)
- Disabled buttony gdy osiągnięto limit kart

### 3.4 Edytor karty
- Pola edycji: tytuł, opis
- Suwaki dla atrybutów karty (strength, defense, health) z zakresem 0-99 i wartością domyślną 0
- Podgląd tylko awersu karty w czasie rzeczywistym
- Blokowanie interfejsu podczas generowania obrazu przez AI

### 3.5 Udostępnianie talii
- Widok talii w trybie "tylko do odczytu" z wyraźnym oznaczeniem
- Responsywna siatka kart bez możliwości edycji
- Kopiowanie linku do schowka

## 4. Obsługa procesów AI i komunikacja błędów
- Blokowanie interfejsu podczas procesów generowania AI
- Komunikat "Tworzenie obrazu karty" podczas generowania
- System powiadomień toast dla błędów (z rozróżnieniem grup błędów 2xx, 4xx, 5xx)
- Automatyczne odblokowanie interfejsu po wystąpieniu błędu
- Brak możliwości anulowania procesu generowania AI

## 5. Integracja z API
- Autentykacja poprzez JWT z Supabase
- Weryfikacja limitów (5 talii, 100 kart) po stronie klienta i serwera
- Cachowanie wygenerowanych obrazów AI z wykorzystaniem możliwości Astro
- Automatyczne zapisywanie zmian w tle z wizualnym wskaźnikiem statusu zapisu
</ui_architecture_planning_summary>

<unresolved_issues>
1. Szczegóły implementacji cachowania wygenerowanych obrazów AI z wykorzystaniem Astro
2. Dokładna strategia obsługi braku połączenia internetowego podczas generowania AI
3. Czy powinien być zaimplementowany system onboardingu/samouczka dla nowych użytkowników
4. Czy mechanizm OTP powinien zawierać licznik czasu pokazujący ważność kodu (15 minut)
5. Szczegóły implementacji walidacji pól podczas edycji kart i talii
</unresolved_issues>
</conversation_summary>
