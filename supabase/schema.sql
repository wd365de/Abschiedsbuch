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
  created_at  timestamptz default now()
);

-- Row Level Security aktivieren
alter table public.entries enable row level security;

-- Jeder kann Einträge lesen (öffentliche Galerie)
create policy "Einträge sind öffentlich lesbar"
  on public.entries for select
  using (true);

-- Jeder kann Einträge anlegen (Gäste ohne Login)
create policy "Gäste können Einträge anlegen"
  on public.entries for insert
  with check (true);

-- Nur eingeloggte Admins können Einträge löschen
create policy "Admin kann Einträge löschen"
  on public.entries for delete
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
