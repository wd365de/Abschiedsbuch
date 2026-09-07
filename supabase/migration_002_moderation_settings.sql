-- ============================================================
-- Migration 002: Freigabe-Workflow + Galerie-Sichtbarkeit
-- Im Supabase SQL-Editor ausführen (einmalig)
-- ============================================================

-- Freigabe-Feld ergänzen (bestehende Einträge automatisch freigeben,
-- damit nichts aus der bisherigen Galerie verschwindet)
alter table public.entries
  add column if not exists approved boolean not null default false;

update public.entries set approved = true where approved = false;

-- Alte, zu offene Lese-Policy entfernen
drop policy if exists "Einträge sind öffentlich lesbar" on public.entries;

-- Öffentlich sind nur freigegebene Einträge lesbar
create policy "Freigegebene Einträge sind öffentlich lesbar"
  on public.entries for select
  using (approved = true);

-- Admin sieht auch nicht freigegebene Einträge
create policy "Admin kann alle Einträge lesen"
  on public.entries for select
  using (auth.role() = 'authenticated');

-- Admin kann Einträge freigeben/bearbeiten
create policy "Admin kann Einträge bearbeiten"
  on public.entries for update
  using (auth.role() = 'authenticated');

-- Settings-Tabelle für Galerie-Sichtbarkeit
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
