-- Run once in the Supabase SQL editor (project lfqtbjlanbrodvvcodjq).
-- Stores everyone who downloads the Ecosystem-Led Growth Playbook from /playbook.
-- The public site can only INSERT. Reading the rows needs the dashboard or the service role.

create table if not exists public.playbook_downloads (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  email        text not null check (char_length(email) <= 320 and email like '%@%'),
  name         text check (char_length(name) <= 200),
  company      text check (char_length(company) <= 200),
  consent      boolean not null default false,
  playbook     text not null default 'ecosystem-led-growth-2026',
  utm_source   text check (char_length(utm_source) <= 200),
  utm_medium   text check (char_length(utm_medium) <= 200),
  utm_campaign text check (char_length(utm_campaign) <= 200),
  referrer     text check (char_length(referrer) <= 500)
);

create index if not exists playbook_downloads_email_idx on public.playbook_downloads (lower(email));
create index if not exists playbook_downloads_created_idx on public.playbook_downloads (created_at desc);

alter table public.playbook_downloads enable row level security;

drop policy if exists "anon can insert playbook downloads" on public.playbook_downloads;
create policy "anon can insert playbook downloads"
  on public.playbook_downloads for insert to anon, authenticated
  with check (consent = true);

grant insert on public.playbook_downloads to anon, authenticated;
