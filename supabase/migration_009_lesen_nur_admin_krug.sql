-- Migration 009: Einträge lesen nur noch Admin und Herr Krug
--
-- Bisher (Migration 008) durfte jeder angemeldete Supabase-User alle
-- Einträge lesen. Weitere Accounts (z. B. Kolleg*innen mit eigenem
-- Login) sollen aber nur das sehen, was alle anderen auch sehen –
-- also keine fremden Einträge. Lesen daher nur mit
-- app_metadata.role = 'admin' oder 'krug'.

drop policy if exists "Angemeldete können Einträge lesen" on entries;

create policy "Admin und Krug können Einträge lesen"
  on entries for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'krug'));

-- Rollen vergeben (einmalig):
update auth.users
  set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
  where email = 'mail@wd365.de';

update auth.users
  set raw_app_meta_data = raw_app_meta_data || '{"role":"krug"}'::jsonb
  where email = 'krug@abschiedsbuch.invalid';
