-- ReachRadar · admin role (1/2) · new enum value.
-- Postgres refuses to use a new enum value inside the transaction that adds it, so this stays alone.
alter type public.user_role add value if not exists 'admin';
