-- Partner2B company database and enrichment tool.
-- Run once in the Supabase SQL Editor. Safe to run again.
-- All tables have row level security ON and NO policies: the public key cannot read or write them.
-- The admin and the enrichment job use the server-only service key.
-- Company level facts only. No personal names, emails or phone numbers are stored.

create table if not exists public.companies (
  id bigserial primary key,
  domain text not null unique,
  name text not null,
  website text not null,
  description text,
  country text,
  region text,
  company_kind text not null default 'partner_side' check (company_kind in ('vendor', 'partner_side')),
  partner_types text[] not null default '{}',
  subtype text,
  categories text[] not null default '{}',
  serves_sizes text[] not null default '{}',
  serves_industries text,
  engages_at text[] not null default '{}',
  size_band text,
  has_program boolean,
  program_url text,
  program_id integer,
  source_url text,
  confidence smallint,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  added_by text not null default 'enrichment',
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists companies_status_idx on public.companies (status);
create index if not exists companies_types_idx on public.companies using gin (partner_types);
create index if not exists companies_cats_idx on public.companies using gin (categories);
alter table public.companies enable row level security;

create table if not exists public.enrich_sources (
  id bigserial primary key,
  url text not null unique,
  label text,
  kind text not null default 'list' check (kind in ('list', 'partner_finder')),
  partner_type_hint text,
  category_hint text,
  active boolean not null default true,
  found_count integer not null default 0,
  last_run_at timestamptz,
  last_status text,
  added_by text not null default 'staff',
  created_at timestamptz not null default now()
);
alter table public.enrich_sources enable row level security;

create table if not exists public.enrich_queue (
  id bigserial primary key,
  domain text not null,
  name text,
  url text not null,
  source_id bigint references public.enrich_sources(id) on delete set null,
  partner_type_hint text,
  category_hint text,
  needs_resolve boolean not null default false,
  status text not null default 'queued' check (status in ('queued', 'done', 'failed', 'skipped')),
  attempts smallint not null default 0,
  note text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);
create unique index if not exists enrich_queue_domain_idx on public.enrich_queue (domain);
create index if not exists enrich_queue_status_idx on public.enrich_queue (status);
alter table public.enrich_queue enable row level security;

create table if not exists public.enrich_state (
  id integer primary key default 1 check (id = 1),
  paused boolean not null default false,
  daily_cap integer not null default 300,
  last_run_at timestamptz,
  last_run_note text
);
insert into public.enrich_state (id) values (1) on conflict do nothing;
alter table public.enrich_state enable row level security;

grant usage on schema public to service_role;
grant select, insert, update, delete on public.companies, public.enrich_sources, public.enrich_queue, public.enrich_state to service_role;
grant usage, select on sequence public.companies_id_seq, public.enrich_sources_id_seq, public.enrich_queue_id_seq to service_role;
