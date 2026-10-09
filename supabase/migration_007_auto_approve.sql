-- ============================================================
-- Migration 007: Automatische Freigabe neuer Beiträge
-- Im Supabase SQL-Editor ausführen (einmalig)
-- ============================================================
--
-- Bisher kamen Gäste-Beiträge mit approved=false in die DB und
-- mussten vom Admin manuell freigegeben werden. Das soll entfallen:
-- Beiträge werden direkt veröffentlicht.
--
-- Zwei Änderungen:
--  1) Default-Wert der Spalte "approved" auf true setzen
--  2) INSERT-Policy so umstellen, dass approved=true erlaubt ist

alter table public.entries alter column approved set default true;

drop policy if exists "Gäste können Einträge anlegen" on public.entries;

create policy "Gäste können Einträge anlegen"
  on public.entries for insert
  with check (true);

-- Hinweis: Admins können weiterhin Beiträge löschen oder bearbeiten
-- (Update- und Delete-Policies bleiben unverändert).
