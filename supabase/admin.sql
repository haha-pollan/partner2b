-- Partner2B internal admin: staff, audit log, submission handling fields.
-- Run once in the Supabase SQL Editor. Safe to run again.
-- Both new tables have row level security ON and NO policies, so the public key
-- cannot read or write them. The admin uses the server-only service key.

create table if not exists public.staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null check (role in ('super_admin', 'staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.staff enable row level security;

create table if not exists public.admin_log (
  id bigserial primary key,
  at timestamptz not null default now(),
  staff_email text not null,
  action text not null,
  target text,
  detail text
);
alter table public.admin_log enable row level security;

alter table public.submissions
  add column if not exists internal_note text,
  add column if not exists handled_by text,
  add column if not exists handled_at timestamptz,
  add column if not exists replied_at timestamptz,
  add column if not exists replied_by text;

-- The admin uses the server-only key (service_role). Tables created in the SQL Editor
-- do not give that role table rights automatically, so grant them here.
grant usage on schema public to service_role;
grant select, insert, update, delete on public.staff, public.admin_log, public.submissions, public.programs to service_role;
grant usage, select on sequence public.admin_log_id_seq to service_role;

-- After creating each person under Authentication > Users (Add user, with password),
-- add them here. Replace the email, keep the role.
-- insert into public.staff (user_id, email, name, role)
-- select id, email, 'Elena', 'super_admin' from auth.users where email = 'REPLACE@EXAMPLE.COM';
-- insert into public.staff (user_id, email, name, role)
-- select id, email, 'Colleague name', 'staff' from auth.users where email = 'REPLACE@EXAMPLE.COM';
