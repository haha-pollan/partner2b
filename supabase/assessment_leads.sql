-- Run once in the Supabase SQL editor (project lfqtbjlanbrodvvcodjq).
-- Stores everyone who unlocks the full result of the Partner program assessment at /partner-program-assessment.
-- The public site can only INSERT. Reading the rows needs the dashboard or the service role.
-- No company name is collected. Same pattern as calculator_leads.sql.

create table if not exists public.assessment_leads (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  email        text not null check (char_length(email) <= 320 and email like '%@%'),
  name         text check (char_length(name) <= 200),
  consent      boolean not null default false,
  tool         text not null default 'partner-program-assessment',
  inputs       jsonb,
  results      jsonb,
  utm_source   text check (char_length(utm_source) <= 200),
  utm_medium   text check (char_length(utm_medium) <= 200),
  utm_campaign text check (char_length(utm_campaign) <= 200),
  referrer     text check (char_length(referrer) <= 500)
);

create index if not exists assessment_leads_email_idx on public.assessment_leads (lower(email));
create index if not exists assessment_leads_created_idx on public.assessment_leads (created_at desc);

alter table public.assessment_leads enable row level security;

drop policy if exists "anon can insert assessment leads" on public.assessment_leads;
create policy "anon can insert assessment leads"
  on public.assessment_leads for insert to anon, authenticated
  with check (consent = true);

grant insert on public.assessment_leads to anon, authenticated;
