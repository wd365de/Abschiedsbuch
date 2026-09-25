-- ============================================================
-- Migration 006: Fehlende INSERT-Policy für anonyme Gäste
-- Im Supabase SQL-Editor ausführen (einmalig)
-- ============================================================
--
-- Beim Test wurde festgestellt, dass anonyme Inserts (aus dem
-- Gäste-Formular) mit "new row violates row-level security policy"
-- abgelehnt wurden. Die Policy war zwar in schema.sql definiert,
-- fehlte aber in der laufenden Datenbank (vermutlich weil sie nie
-- in einer Migration nachgezogen wurde). Diese Migration legt sie
-- idempotent an.

drop policy if exists "Gäste können Einträge anlegen" on public.entries;

create policy "Gäste können Einträge anlegen"
  on public.entries for insert
  with check (approved = false);

-- Hinweis: with check (approved = false) verhindert, dass anonyme
-- Beiträge sich selbst freigeben können. Freigabe erfolgt nur über
-- die vorhandene Admin-Update-Policy.
