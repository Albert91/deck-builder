<conversation_summary>
<decisions>
Wykorzystanie Supabase Storage dla przechowywania obrazów generowanych przez AI (tła, obrazy kart, rewersy).
Przechowywanie metadanych dla obrazów: prompt, model AI, parametry generowania, użytkownik i czas.
Dodanie pola username do tabeli users.
Implementacja udostępniania talii poprzez unikalny hash generowany przy tworzeniu rekordu, bez ograniczeń czasowych.
Śledzenie logów zmian: kiedy talia/karty zostały wygenerowane/modyfikowane/usunięte.
Implementacja limitów (5 talii, 100 kart) na poziomie aplikacji, nie bazy danych.
Zastosowanie hard delete dla usuniętych talii i kart, wraz z usunięciem plików obrazów z Supabase Storage.
Struktura folderów w Supabase Storage: /{user_id}/decks/{deck_id}/cards/ dla obrazów kart.
Implementacja atrybutów kart (siła, obrona, życie) w osobnej tabeli zależnej z domyślną wartością 0.
Walidacja wartości atrybutów: 0-99.
Przechowywanie typu atrybutu jako enum z możliwością dodawania nowych typów po MVP.
Implementacja pełnotekstowego wyszukiwania talii po nazwie.
Sortowanie talii według czasu (ostatni element jako pierwszy) i alfabetycznie.
</decisions>
<matched_recommendations>
Utworzenie schematu bazy danych z tabelami: users, templates, decks, cards, card_attributes i image_metadata.
Używanie UUID jako kluczy podstawowych dla wszystkich tabel.
Zaimplementowanie funkcji do generowania unikalnego share_hash z wykorzystaniem UUID v4 konwertowanego do base64url.
Utworzenie typu enum attribute_type dla atrybutów kart z ograniczeniem CHECK na wartościach (0-99).
Zastosowanie kaskadowego usuwania (ON DELETE CASCADE) dla kart i atrybutów przy usuwaniu talii.
Implementacja pełnotekstowego wyszukiwania z indeksem GIN na kolumnie name_tsv.
Utworzenie triggera dla automatycznego dodawania domyślnych atrybutów przy tworzeniu nowej karty.
Implementacja widoku cards_with_attributes dla łatwiejszego pobierania kart z ich atrybutami.
Skonfigurowanie polityk RLS w Supabase: właściciel ma pełen dostęp, udostępnione talie dostępne tylko do odczytu.
Dodanie indeksów dla kolumn używanych do wyszukiwania i sortowania (owner_id, deck_id, created_at, name).
</matched_recommendations>
<database_planning_summary>
Baza danych dla AI Card Deck Creator będzie zaimplementowana w PostgreSQL poprzez Supabase. Główne encje w systemie to:
1. Użytkownicy (users)
Przechowywanie podstawowych informacji: UUID, email, username
Integracja z systemem OTP Supabase dla autentykacji
Automatyczne timestampy utworzenia i aktualizacji
2. Szablony (templates)
Predefiniowane wzorce kart dostępne w systemie
Podstawowe informacje: nazwa, opis
Logika rozmieszczenia elementów przechowywana w aplikacji, nie w bazie
3. Talie (decks)
Powiązanie z właścicielem (owner_id) i szablonem (template_id)
Unikalny hash dla udostępniania (share_hash)
Pełnotekstowe wyszukiwanie po nazwie talii
Limity (5 talii na użytkownika) implementowane na poziomie aplikacji
4. Karty (cards)
Powiązanie z talią (deck_id)
Przechowywanie tytułu i opisu karty
Kaskadowe usuwanie przy usunięciu talii
Limity (100 kart na talię) implementowane na poziomie aplikacji
5. Atrybuty kart (card_attributes)
Relacja wiele-do-wielu z kartami
Typ atrybutu jako enum ('strength', 'defense', 'health')
Wartości domyślne: 0, z walidacją zakresu 0-99
Ograniczenie unikalności (card_id, attribute_name)
6. Metadane obrazów (image_metadata)
Przechowywanie informacji o wygenerowanych obrazach
Prompt, model AI, parametry generowania, użytkownik
Ścieżka do pliku w Supabase Storage
Bezpieczeństwo:
Implementacja Row Level Security (RLS) w Supabase
Polityki dostępu: właściciel ma pełny dostęp do swoich danych
Udostępnione talie dostępne tylko do odczytu dla innych użytkowników
Odpowiednie polityki RLS dla Supabase Storage
Wydajność i skalowalność:
Indeksy na kluczowych kolumnach (owner_id, deck_id, created_at, name)
Indeks GIN dla pełnotekstowego wyszukiwania
Widok dla łatwiejszego pobierania kart z atrybutami
Triggery dla automatycznego tworzenia atrybutów i aktualizacji indeksu pełnotekstowego
Zarządzanie plikami:
Struktura w Supabase Storage: /{user_id}/decks/{deck_id}/[background.jpg, back.jpg, cards/{card_id}.jpg]
Hard delete dla plików przy usuwaniu powiązanych rekordów
Triggery i funkcje:
Funkcja generowania unikalnego share_hash
Trigger inicjalizujący atrybuty dla nowych kart
Trigger aktualizujący indeks pełnotekstowy
Funkcja do usuwania plików z Storage przy usuwaniu rekordów
</database_planning_summary>
<unresolved_issues>
Dokładny mechanizm usuwania plików z Supabase Storage przy usuwaniu rekordów - może wymagać implementacji Edge Function w Supabase.
Szczegółowa implementacja logowania zmian (activity_logs) - format i zakres przechowywanych informacji.
Strategie optymalizacji przy potencjalnym skalowaniu poza limity MVP, szczególnie dla wygenerowanych obrazów.
Zarządzanie kosztami i limitami API dla usług generowania obrazów AI.
</unresolved_issues>
</conversation_summary>