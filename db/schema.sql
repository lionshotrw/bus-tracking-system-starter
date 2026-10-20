create extension if not exists pgcrypto;

create table if not exists public.buses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  route_id uuid null,
  latitude double precision not null,
  longitude double precision not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_buses_updated_at
  on public.buses (updated_at desc);

alter table public.buses enable row level security;

drop policy if exists "Authenticated users can read buses" on public.buses;
create policy "Authenticated users can read buses"
  on public.buses
  for select
  to authenticated
  using (true);

insert into public.buses (name, latitude, longitude)
values
  ('Bus 101', 37.7749, -122.4194),
  ('Bus 202', 37.7848, -122.4080);
