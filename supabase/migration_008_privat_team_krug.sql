-- ============================================================
-- Migration 008: Kategorien Privat/Team/Sonstige + Galerie nur
--                für Admin und Herrn Krug
-- Im Supabase SQL-Editor ausführen (einmalig)
-- ============================================================
--
-- ACHTUNG: löscht alle bisherigen Einträge (nur Testdaten).
--
-- Vorher im Supabase-Dashboard (Authentication → Users):
--   1) User für Herrn Krug anlegen (E-Mail + Passwort). Die E-Mail
--      als VITE_KRUG_EMAIL in Vercel hinterlegen.
--   2) Nach dieser Migration dem Admin-User die Rolle geben (unten).

-- ── Kategorien ───────────────────────────────────────────────
delete from public.entries;

alter table public.entries drop constraint if exists entries_category_check;

alter table public.entries
  add constraint entries_category_check
  check (category in ('privat', 'team', 'sonstige'));

-- ── Lesen nur noch mit Login (Admin + Herr Krug) ─────────────
-- Kolleg*innen dürfen Einträge anlegen, aber keine fremden lesen.
drop policy if exists "Freigegebene Einträge sind öffentlich lesbar" on public.entries;
drop policy if exists "Admin kann alle Einträge lesen" on public.entries;

create policy "Angemeldete können Einträge lesen"
  on public.entries for select
  using (auth.role() = 'authenticated');

-- ── Bearbeiten/Löschen nur für Admin ─────────────────────────
drop policy if exists "Admin kann Einträge bearbeiten" on public.entries;
drop policy if exists "Admin kann Einträge löschen" on public.entries;

create policy "Admin kann Einträge bearbeiten"
  on public.entries for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin kann Einträge löschen"
  on public.entries for delete
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── Zähler für die Startseite (ohne Lesezugriff auf Inhalte) ─
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

-- ── Storage: Bucket nicht mehr öffentlich auflistbar ─────────
-- Die öffentlichen Bild-URLs funktionieren beim public Bucket
-- weiterhin; nur das Auflisten per API ist dem Admin vorbehalten.
drop policy if exists "Fotos sind öffentlich" on storage.objects;
drop policy if exists "Admin kann Fotos auflisten" on storage.objects;
drop policy if exists "Admin kann Fotos löschen" on storage.objects;

create policy "Admin kann Fotos auflisten"
  on storage.objects for select
  using (bucket_id = 'photos' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin kann Fotos löschen"
  on storage.objects for delete
  using (bucket_id = 'photos' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── Admin-Rolle vergeben (E-Mail anpassen!) ──────────────────
-- Danach einmal ab- und wieder anmelden, damit das Token die Rolle enthält.
--
-- update auth.users
--   set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
--   where email = 'admin@example.de';
