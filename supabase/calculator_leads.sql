-- Run once in the Supabase SQL editor (project lfqtbjlanbrodvvcodjq).
-- Stores everyone who unlocks the full results of the Partner pipeline calculator at /partner-pipeline-calculator.
-- The public site can only INSERT. Reading the rows needs the dashboard or the service role.
-- Same pattern as playbook_downloads.sql.

create table if not exists public.calculator_leads (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  email        text not null check (char_length(email) <= 320 and email like '%@%'),
  name         text check (char_length(name) <= 200),
  consent      boolean not null default false,
  tool         text not null default 'partner-pipeline-calculator',
  company_type text check (char_length(company_type) <= 60),
  inputs       jsonb,
  results      jsonb,
  utm_source   text check (char_length(utm_source) <= 200),
  utm_medium   text check (char_length(utm_medium) <= 200),
  utm_campaign text check (char_length(utm_campaign) <= 200),
  referrer     text check (char_length(referrer) <= 500)
);

create index if not exists calculator_leads_email_idx on public.calculator_leads (lower(email));
create index if not exists calculator_leads_created_idx on public.calculator_leads (created_at desc);

alter table public.calculator_leads enable row level security;

drop policy if exists "anon can insert calculator leads" on public.calculator_leads;
create policy "anon can insert calculator leads"
  on public.calculator_leads for insert to anon, authenticated
  with check (consent = true);

grant insert on public.calculator_leads to anon, authenticated;
