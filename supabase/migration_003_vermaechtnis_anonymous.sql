-- ============================================================
-- Migration 003: Kategorie "Vermächtnis" + Option "Anonym"
-- Im Supabase SQL-Editor ausführen (einmalig)
-- ============================================================

-- Anonym-Flag ergänzen
alter table public.entries
  add column if not exists anonymous boolean not null default false;

-- Kategorie-Constraint um "vermaechtnis" erweitern
alter table public.entries drop constraint if exists entries_category_check;

alter table public.entries
  add constraint entries_category_check
  check (category in ('dankbarkeit', 'erinnerungen', 'wuensche', 'humor', 'vermaechtnis'));
