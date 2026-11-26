-- Early access requests: what the visitor told us, which email went out, and a simple event log for the funnel.
alter table public.discovery_requests add column if not exists when_needed text;
alter table public.discovery_requests add column if not exists would_pay text;
alter table public.discovery_requests add column if not exists partner_type text;
alter table public.discovery_requests add column if not exists email_status text;
alter table public.discovery_requests add column if not exists contacted_at timestamptz;
grant update on public.discovery_requests to service_role;

create table if not exists public.discovery_events (
  id bigserial primary key,
  strategy_id uuid,
  event text not null,
  detail text,
  created_at timestamptz not null default now()
);
alter table public.discovery_events enable row level security;
grant select, insert on public.discovery_events to service_role;
grant usage, select on sequence public.discovery_events_id_seq to service_role;
