# Deployment-Anleitung – Hochzeits-Gästebuch

## Schritt 1: Supabase einrichten

1. Gehe zu [supabase.com](https://supabase.com) → "Start your project"
2. Konto anlegen (kostenlos, GitHub-Login empfohlen)
3. **"New project"** klicken, Name z. B. `gaestebuch`, Region `EU West`
4. Warte ~2 Minuten bis das Projekt bereit ist

### 1a. Datenbank-Schema anlegen

1. Im Supabase-Dashboard: linke Leiste → **SQL Editor**
2. "New query" klicken
3. Den kompletten Inhalt aus `supabase/schema.sql` einfügen
4. **Run** (▶) klicken – alles grün = fertig

### 1b. Admin-Benutzer anlegen

1. Linke Leiste → **Authentication** → **Users**
2. **"Invite user"** klicken
3. Eure E-Mail-Adresse eingeben und bestätigen
4. Danach Passwort über den Link in der Mail setzen

### 1c. Zugangsdaten kopieren

1. Linke Leiste → **Project Settings** → **API**
2. Notiere dir:
   - **Project URL** (z. B. `https://abc123.supabase.co`)
   - **anon public** Key (langer String unter "Project API keys")

---

## Schritt 2: Projekt lokal einrichten

```bash
# 1. Repository klonen (oder Ordner ins Terminal ziehen)
cd gaestebuch

# 2. Abhängigkeiten installieren
npm install

# 3. Umgebungsvariablen anlegen
cp .env.example .env.local
```

Datei `.env.local` öffnen und die Werte aus Schritt 1c eintragen:

```
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key
```

```bash
# 4. Entwicklungsserver starten
npm run dev
```

Öffne http://localhost:5173 – die App sollte laufen.

---

## Schritt 3: Auf Vercel deployen

1. Gehe zu [vercel.com](https://vercel.com) → kostenloses Konto anlegen
2. **"Add New Project"** → GitHub verbinden → dieses Repository importieren
3. Framework wird automatisch als **Vite** erkannt
4. Unter **Environment Variables** eintragen:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Deploy** klicken

Vercel gibt euch eine URL wie `gaestebuch.vercel.app` – fertig!

---

## Schritt 4: Git-Repository verbinden

```bash
git init
git add .
git commit -m "Initial commit: Hochzeits-Gästebuch"
git branch -M main
git remote add origin https://github.com/wd365de/G-stebuch.git
git push -u origin main
```

Ab jetzt: jeder `git push` → Vercel deployed automatisch.

---

## Schritt 5: QR-Code erstellen

1. Geht auf [qr-code-generator.com](https://www.qr-code-generator.com)
2. URL eintragen: `https://eure-app.vercel.app/eintrag`
3. Design anpassen (Gold/Creme passt gut)
4. Als SVG herunterladen → auf Tischkärtchen drucken

---

## Routen-Übersicht

| URL           | Funktion                        |
|---------------|----------------------------------|
| `/`           | Startseite                       |
| `/eintrag`    | Formular für Gäste (QR-Code Ziel)|
| `/galerie`    | Öffentliche Galerie              |
| `/admin`      | Admin-Login + Dashboard          |

---

## Speicherplatz (Supabase Free Tier)

- Datenbank: 500 MB (völlig ausreichend)
- Storage: 1 GB für Fotos
- Mit clientseitiger Komprimierung (~400 KB/Foto): **reicht für ~2.500 Fotos**
- Monatliche Bandbreite: 5 GB

Bei größeren Hochzeiten (>200 Gäste) empfiehlt sich der Supabase Pro Plan ($25/Monat, 100 GB Storage).
