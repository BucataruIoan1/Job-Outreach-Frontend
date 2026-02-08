# Job Outreach Frontend

Aceasta este aplicația de frontend pentru platforma **Job Outreach**, dezvoltată pentru a gestiona procesul de aplicare la joburi, inclusiv administrarea companiilor, pozițiilor și a template-urilor de email.

## 🚀 Tehnologii Utilizate

*   **React 19** - Librărie pentru construirea interfeței utilizator.
*   **Vite** - Build tool rapid pentru dezvoltare modernă.
*   **React Router DOM** - Pentru navigare și routing în aplicație.
*   **Lucide React** - Set de iconițe modern.
*   **CSS Modules / Standard CSS** - Pentru stilizare.

## 🛠️ Instalare și Rulare

Urmează acești pași pentru a rula aplicația local:

1.  **Clonează repository-ul** (dacă nu l-ai clonat deja):
    ```bash
    git clone <url-repository>
    ```

2.  **Instalează dependențele**:
    Asigură-te că ești în folderul `Job-Outreach-Frontend` și rulează:
    ```bash
    npm install
    ```

3.  **Pornește serverul de dezvoltare**:
    ```bash
    npm run dev
    ```
    Aplicația va fi accesibilă la `http://localhost:5173` (sau alt port dacă 5173 este ocupat).

## 📂 Structura Proiectului

*   `src/api` - Configurații pentru API (endpoints).
*   `src/components` - Componentele React organizate pe funcționalități (Company, Email, Position, etc.).
*   `src/hooks` - Custom hooks pentru logica de business și state management.
*   `src/services` - Servicii pentru comunicarea cu backend-ul (API calls).
*   `src/types` - Definiții de tipuri TypeScript (chiar dacă fișierele sunt .js/.jsx, structura e pregătită).
*   `src/assets` - Imagini și resurse statice.

## ✨ Funcționalități Principale

### 1. Gestionare Email-uri
*   **Email Template Grid**: Vizualizarea template-urilor de email existente.
    *   Posibilitate de descărcare atașament (PDF).
    *   Editare template (Subiect, Conținut, Atașament, etc.).
*   **Creare/Editare Email**: Formular complex pentru crearea și actualizarea template-urilor, inclusiv upload de fișiere PDF.
*   **Istoric Email-uri**: Vizualizarea email-urilor trimise către companii.

### 2. Gestionare Companii
*   Listare, adăugare, editare și ștergere companii.
*   Filtrare și sortare avansată.

### 3. Gestionare Poziții și Țări
*   Administrarea nomenclatoarelor pentru pozițiile joburilor și țările vizate.

### 4. Trimitere Email-uri
*   Interfață dedicată pentru selectarea și trimiterea email-urilor de outreach.

## ⚙️ Configurare Backend

Aplicația se așteaptă ca backend-ul să ruleze local.
*   **Proxy**: Este configurat un proxy în `vite.config.js` pentru a redirecționa cererile `/api` către `http://localhost:5088`.
*   Dacă backend-ul rulează pe alt port, modifică fișierul `vite.config.js`.

## 📦 Scripturi Disponibile

*   `npm run dev` - Pornește serverul de dezvoltare.
*   `npm run build` - Compilează aplicația pentru producție.
*   `npm run lint` - Verifică codul pentru erori de stil (ESLint).
*   `npm run preview` - Previzualizează build-ul de producție local.
