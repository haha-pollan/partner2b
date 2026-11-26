-- Saves the structured result of every Program builder strategy, so partner discovery can match companies against it.
-- Run once in the Supabase SQL Editor. Safe to run again.
-- Row level security is ON with no policies: only the server-only service key can read or write.
-- Company level facts only. No names or emails are stored here (the email stays in builder_leads).

create table if not exists public.builder_strategies (
  id uuid primary key,
  company_name text,
  website text,
  category text,
  region text,
  audience text,
  goals text[] not null default '{}',
  partner_types text[] not null default '{}',
  profiles jsonb not null default '[]',
  created_at timestamptz not null default now()
);
alter table public.builder_strategies enable row level security;
grant select, insert on public.builder_strategies to service_role;
