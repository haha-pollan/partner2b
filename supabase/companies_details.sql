-- Marks which companies have had their region, size and stage filled in. Safe to run again.
alter table public.companies add column if not exists details_checked_at timestamptz;
