-- ============================================================
-- Migration 005: Cleanup vor Go-Live
-- Im Supabase SQL-Editor ausführen (einmalig, unmittelbar vor Go-Live)
-- ============================================================
--
-- Löscht alle Beispieleinträge mit alten Kategorien-Slugs und schränkt
-- den Constraint auf die drei aktiven Kategorien ein. Nach dem Lauf
-- akzeptiert die DB nur noch "gruesse", "erinnerungen", "abschiedsfeier".
--
-- ACHTUNG: löscht Daten unwiderruflich. Vorher CSV-Export erwägen.

delete from public.entries
  where category in ('dankbarkeit', 'wuensche', 'humor', 'vermaechtnis');

alter table public.entries drop constraint if exists entries_category_check;

alter table public.entries
  add constraint entries_category_check
  check (category in ('gruesse', 'erinnerungen', 'abschiedsfeier'));
