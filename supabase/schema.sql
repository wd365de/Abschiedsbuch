-- ============================================================
-- Abschiedsbuch – Supabase Schema
-- Dieses SQL im Supabase SQL-Editor ausführen
-- ============================================================

-- UUID-Extension (ist in Supabase standardmäßig aktiv)
create extension if not exists "uuid-ossp";

-- ============================================================
-- Tabelle: entries
-- ============================================================
create table if not exists public.entries (
  id          uuid        default uuid_generate_v4() primary key,
  name        text        not null,
  message     text        not null,
  category    text        not null check (category in ('dankbarkeit', 'erinnerungen', 'wuensche', 'humor')),
  photo_url   text,
  approved    boolean     not null default false,
  created_at  timestamptz default now()
);

-- Row Level Security aktivieren
alter table public.entries enable row level security;

-- Öffentlich sind nur freigegebene Einträge lesbar (Moderation vor Veröffentlichung)
create policy "Freigegebene Einträge sind öffentlich lesbar"
  on public.entries for select
  using (approved = true);

-- Admin sieht auch nicht freigegebene Einträge
create policy "Admin kann alle Einträge lesen"
  on public.entries for select
  using (auth.role() = 'authenticated');

-- Jeder kann Einträge anlegen (Gäste ohne Login) – landen zunächst unfreigegeben
create policy "Gäste können Einträge anlegen"
  on public.entries for insert
  with check (true);

-- Nur eingeloggte Admins können Einträge freigeben/bearbeiten
create policy "Admin kann Einträge bearbeiten"
  on public.entries for update
  using (auth.role() = 'authenticated');

-- Nur eingeloggte Admins können Einträge löschen
create policy "Admin kann Einträge löschen"
  on public.entries for delete
  using (auth.role() = 'authenticated');

-- ============================================================
-- Tabelle: settings (Key-Value, z.B. Galerie-Sichtbarkeit)
-- ============================================================
create table if not exists public.settings (
  key   text primary key,
  value jsonb not null
);

insert into public.settings (key, value)
values ('gallery_visible', 'false'::jsonb)
on conflict (key) do nothing;

alter table public.settings enable row level security;

create policy "Settings sind öffentlich lesbar"
  on public.settings for select
  using (true);

create policy "Admin kann Settings ändern"
  on public.settings for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- Storage Bucket: photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Jeder kann Fotos hochladen
create policy "Fotos hochladen erlaubt"
  on storage.objects for insert
  with check (bucket_id = 'photos');

-- Fotos sind öffentlich abrufbar
create policy "Fotos sind öffentlich"
  on storage.objects for select
  using (bucket_id = 'photos');

-- Nur Admins können Fotos löschen
create policy "Admin kann Fotos löschen"
  on storage.objects for delete
  using (bucket_id = 'photos' and auth.role() = 'authenticated');
