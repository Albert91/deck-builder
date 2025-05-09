# Specyfikacja modułu autentykacji (rejestracja, logowanie, OTP, odzyskiwanie hasła)

Dokument specyfikuje architekturę frontendową, backendową oraz integrację z Supabase Auth dla funkcjonalności związanych z rejestracją, logowaniem (hasło i OTP) oraz odzyskiwaniem hasła. Dane wejściowe pochodzą z dokumentu PRD (US-001, US-002, US-003) oraz założeń tech stacku.

---

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1 Strony Astro (SSR)
- `/auth/register` – strona rejestracji użytkownika.
- `/auth/login` – strona logowania hasłem.
- `/auth/otp` – strona logowania przez OTP (wysłanie i weryfikacja kodu).
- `/auth/forgot-password` – strona odzyskiwania hasła (wysłanie linku resetującego).
- `/auth/reset-password?token=...` – strona ustawienia nowego hasła.

Każda strona korzysta z dedykowanego layoutu `src/layouts/auth.astro`, który:
- Wyłącza elementy nawigacji chronionej (dla zalogowanych).
- Renderuje nagłówek i kontener formularza.

### 1.2 Komponenty React (Client-side)
W katalogu `src/components/auth/` umieszczone zostaną dynamiczne komponenty:
- `<RegisterForm />` – zarządza stanem pól email, password, passwordConfirm.
- `<LoginForm />` – pola email i password.
- `<OtpRequestForm />` – tylko pole email do wysłania kodu.
- `<OtpVerifyForm />` – pola email i kod OTP do weryfikacji.
- `<ForgotPasswordForm />` – pole email do wysłania linku reset.
- `<ResetPasswordForm />` – pola newPassword i passwordConfirm oraz hidden token z query.
- `<FormField />` – generyczny komponent dla label+input z wbudowaną walidacją.
- `<ErrorMessage />` – wyświetla błędy walidacji lub serwera.

Każdy formularz:
- Używa hooków React (useState, useEffect) do obsługi stanu i efektów.
- Wstępnie waliduje wartości lokalnie przy użyciu Zod/schema w `src/lib/validators/auth.ts`.
- Wywołuje API przez `fetch('/api/auth/...')`, obsługuje JSON odpowiedź.
- Na sukces przekierowuje klienta (`window.location.href = '/dashboard'` lub pokazuje komunikat o wysłaniu email).

### 1.3 Walidacja i obsługa błędów
- **Walidacja client-side:** Zod + react-hook-form (opcjonalnie) dla pól wymaganych, poprawny format email, długość hasła, zgodność pól password.
- **Walidacja server-side:** Zod w endpointach API, zwraca HTTP 400 z ciałem `{ code: string, message: string }`.
- **Komunikaty:** Komponent `<ErrorMessage />` renderuje listę błędów pod odpowiednim polem lub nad formularzem.

### 1.4 Scenariusze użytkownika
- Rejestracja: sukces, email już użyty, słabe hasło.
- Logowanie hasłem: sukces, błędne dane, brak konta.
- Żądanie OTP: sukces (email wysłany), brak konta.
- Weryfikacja OTP: sukces, nieprawidłowy/wygaśnięty kod.
- Odzyskiwanie hasła: sukces (link wysłany), brak konta.
- Reset hasła: sukces, link nieważny.

---

## 2. LOGIKA BACKENDOWA

### 2.1 Struktura endpointów
W katalogu `src/pages/api/auth/` powstaną pliki:
- `register.ts` – obsługa POST rejestracji.
- `login.ts` – POST logowania hasłem.
- `request-otp.ts` – POST wysłania kodu OTP.
- `verify-otp.ts` – POST weryfikacji kodu.
- `forgot-password.ts` – POST wysłania linku resetującego.
- `reset-password.ts` – POST ustawienia nowego hasła.
- `logout.ts` – POST wylogowania i czyszczenia cookie.

### 2.2 Modele i typy
W pliku `src/types.ts`:
```ts
type UserDto = { id: string; email: string; };  
type AuthResponse = { user: UserDto; sessionToken: string; };  
type ErrorResponse = { code: string; message: string; };
```

### 2.3 Walidacja danych
W `src/lib/validators/auth.ts`:
- Zod schematy `registerSchema`, `loginSchema`, `otpRequestSchema`, `otpVerifySchema`, `forgotPasswordSchema`, `resetPasswordSchema`.
- Każdy endpoint wykonuje `schema.parse(req.body)` i rzuca błąd 400 z kodem i wiadomością.

### 2.4 Obsługa wyjątków
- Centralny try/catch w każdym endpointzie.
- Błędy walidacji -> HTTP 400.
- Błędy Supabase lub wewnętrzne -> HTTP 500 z ujednoliconym komunikatem.

### 2.5 SSR i redirecty
W `astro.config.mjs` włączamy middleware (`src/middleware/index.ts`):
- Dla chronionych tras (`/dashboard`, `/profile`) sprawdzamy cookie `supabase-auth-token`.
- Jeśli brak tokena lub nieważny, redirect do `/auth/login`.

---

## 3. SYSTEM AUTENTYKACJI (Supabase Auth)

### 3.1 Konfiguracja klienta
- Plik `src/db/supabaseClient.ts`: inicjalizacja Supabase z env `SUPABASE_URL` i `SUPABASE_ANON_KEY`.
- Zwraca obiekt `supabase` do użycia w usługach.

### 3.2 Rejestracja
- `supabase.auth.signUp({ email, password })`.
- Po pomyślnej rejestracji automatyczne logowanie lub wysłanie maila potwierdzającego.
- Ustawiamy HTTP-only cookie za pomocą `supabase.auth.setAuthCookie()`.

### 3.3 Logowanie hasłem
- `supabase.auth.signInWithPassword({ email, password })`.
- Na sukces: token w cookie dla kolejnych requestów.

### 3.4 Logowanie OTP
1. `supabase.auth.signInWithOtp({ email })` w `request-otp.ts`.
2. `supabase.auth.verifyOtp({ email, token })` w `verify-otp.ts`.
- Token zwrócony w ciele i zapisany w cookie.

### 3.5 Odzyskiwanie i reset hasła
- `supabase.auth.resetPasswordForEmail(email)` w `forgot-password.ts` – wysłanie maila z linkiem.
- `supabase.auth.updateUser({ password: newPassword, email: undefined, lowSecurityToken: token })` w `reset-password.ts`.

### 3.6 Wylogowanie
- `supabase.auth.signOut()` oraz usunięcie cookie w `logout.ts`.

### 3.7 Sesje i cookie
- Używamy HTTP-only cookie `sb:token` do przechowywania `access_token` i `refresh_token`.
- Middleware Astro odczytuje cookie i weryfikuje sesję.

---

**Kluczowe komponenty i lokalizacje:**
- `src/pages/auth/*.astro` – strony SSR.
- `src/components/auth/*.tsx` – client-side formy.
- `src/lib/validators/auth.ts` – Zod schematy.
- `src/lib/services/auth.ts` – logika korzystająca z `supabaseClient`.
- `src/db/supabaseClient.ts` – inicjalizacja klienta.
- `src/middleware/index.ts` – ochrona tras.
- `src/pages/api/auth/*.ts` – endpointy API.

*Uwaga:* Wszystkie zmiany przestrzegają istniejącego stylu, lintera (eslint.config.mjs) i używają yarn jako package manager. 