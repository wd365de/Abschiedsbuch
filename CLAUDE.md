# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt: Abschiedsbuch – Web-Dienste365.de

Digitales Abschiedsbuch für ausscheidende Institutsleitungen (Altersteilzeit / Rentenbeginn).

## Git
- Remote: https://github.com/wd365de/Abschiedsbuch.git
- Branch: main

## Tech-Stack
- Frontend: React 18 + Tailwind CSS v3 + Vite 5
- Backend: Supabase (Auth, Datenbank, Storage)
- Hosting: Vercel

---

## Entwicklung

```bash
npm install          # Abhängigkeiten installieren
npm run dev          # Dev-Server starten → http://localhost:5173
npm run build        # Produktions-Build
npm run preview      # Produktions-Build lokal testen
```

Keine Test- oder Lint-Skripte vorhanden.

### Umgebungsvariablen

Für lokale Entwicklung `.env.local` anlegen (wird nicht ins Git eingecheckt):

```
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key
```

---

## Architektur

### Routing (`src/App.jsx`)

React Router v6 SPA — alle Nicht-API-Anfragen landen via `vercel.json` Rewrite auf `index.html`.

| Route              | Seite / Zweck                                  |
|--------------------|------------------------------------------------|
| `/`                | Startseite (`Home.jsx`)                        |
| `/eintrag`         | Formular zum Eintrag hinterlassen (`GuestPage`)|
| `/galerie`         | Öffentliche Galerie (`GalleryPage`)            |
| `/admin`           | Admin-Login + Dashboard (`AdminPage`)          |
| `/fotobuch`        | PDF-Vorschau des Abschiedsbuchs (`FotobuchPreview`)|

### Supabase-Anbindung (`src/lib/supabase.js`)

Singleton-Client – wird in allen Komponenten via `import { supabase } from '../lib/supabase'` genutzt. Wirft beim Start, wenn Umgebungsvariablen fehlen.

### Datenbankschema (`supabase/schema.sql`)

Einzige Tabelle: **`entries`**

| Spalte       | Typ          | Besonderheit                                         |
|--------------|--------------|------------------------------------------------------|
| `id`         | uuid PK      |                                                      |
| `name`       | text         |                                                      |
| `message`    | text         |                                                      |
| `category`   | text         | CHECK: `dankbarkeit` \| `erinnerungen` \| `wuensche` \| `humor` |
| `photo_url`  | text         | Öffentliche URL aus Supabase Storage (Bucket: photos)|
| `created_at` | timestamptz  |                                                      |

**Besonderheit:** Das `fotobuch`-Feld existiert nicht – alle Einträge fließen automatisch in das Abschiedsbuch ein.

RLS-Regeln: öffentlich lesen + anlegen; löschen nur als `authenticated`.

Storage-Bucket `photos` ist öffentlich. Fotos werden vor dem Upload clientseitig auf max. 1200 px / ~400 KB komprimiert (`src/lib/imageCompression.js`).

### Admin-Bereich

`AdminPage` prüft `supabase.auth.getSession()` und zeigt je nach Zustand `AdminLogin` oder `AdminDashboard`. Kein eigenes Auth-Routing — Session-State per `onAuthStateChange`.

Dashboard-Funktionen: Einträge filtern/löschen, CSV-Export, Fotos als ZIP (JSZip), Speicherverbrauch-Anzeige, PDF-Abschiedsbuch-Export (`@react-pdf/renderer`).

**Zugriff auf PDF-Export:** Admin + ausscheidende Person (via Email + Passwort Login)

### Gäste-Formular

Mehrstufiger Wizard in `src/components/GuestForm/`:
`StepCategory` → `StepMessage` → `StepPhoto` → `StepPreview` → `StepSuccess`

### Tailwind-Theme (`tailwind.config.js`)

Benutzerdefinierte Design-Tokens:
- **Farben:** `cream`, `blush`, `gold`, `ink` (je mit `.light`/`.dark`-Variante)
- **Fonts:** `font-display` → Cormorant Garamond (serif), `font-body` → DM Sans (sans-serif)
- **Animationen:** `animate-fade-up`, `animate-fade-in`

---

## Rolle
Du bist ein erfahrener Full-Stack-Entwickler.
