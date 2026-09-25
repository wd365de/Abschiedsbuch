-- ============================================================
-- Migration 004: Neue Kategorien "Grüße" / "Erinnerungen" / "Abschiedsfeier"
-- Im Supabase SQL-Editor ausführen (einmalig)
-- ============================================================
--
-- Übergangsmigration: alte Slugs bleiben zunächst gültig, damit die
-- Seed-Beispieleinträge nicht gelöscht werden müssen. Vor Go-Live wird
-- migration_005_kategorien_cleanup.sql ausgeführt, die die alten Werte
-- (und Seeds) entfernt und den Constraint auf die drei neuen einschränkt.

alter table public.entries drop constraint if exists entries_category_check;

alter table public.entries
  add constraint entries_category_check
  check (category in (
    'gruesse',
    'erinnerungen',
    'abschiedsfeier',
    -- Legacy (nur für Seed-Daten, werden vor Go-Live entfernt):
    'dankbarkeit',
    'wuensche',
    'humor',
    'vermaechtnis'
  ));
