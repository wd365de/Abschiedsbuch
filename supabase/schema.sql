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
  category    text        not null check (category in ('privat', 'team', 'sonstige')),
  photo_url   text,
  approved    boolean     not null default true,
  anonymous   boolean     not null default false,
  created_at  timestamptz default now()
);

-- Row Level Security aktivieren
alter table public.entries enable row level security;

-- Lesen nur Admin + Herr Krug (app_metadata.role) – alle anderen sehen keine fremden Einträge
create policy "Admin und Krug können Einträge lesen"
  on public.entries for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'krug'));

-- Jeder kann Einträge anlegen (Gäste ohne Login)
create policy "Gäste können Einträge anlegen"
  on public.entries for insert
  with check (true);

-- Bearbeiten/Löschen nur mit Admin-Rolle (app_metadata.role = 'admin')
create policy "Admin kann Einträge bearbeiten"
  on public.entries for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin kann Einträge löschen"
  on public.entries for delete
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Zähler für die Startseite (ohne Lesezugriff auf Inhalte)
create or replace function public.entry_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*) from public.entries where approved = true;
$$;

revoke all on function public.entry_count() from public;
grant execute on function public.entry_count() to anon, authenticated;

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

-- Bild-URLs sind über den public Bucket abrufbar; Auflisten nur für Admin
create policy "Admin kann Fotos auflisten"
  on storage.objects for select
  using (bucket_id = 'photos' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Nur Admins können Fotos löschen
create policy "Admin kann Fotos löschen"
  on storage.objects for delete
  using (bucket_id = 'photos' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
