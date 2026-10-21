create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id),
  user_id uuid references auth.users(id),
  plan jsonb not null,
  feedback text,
  check_in_date timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now()
);

create index if not exists plans_session_id_idx on public.plans (session_id);

alter table public.plans enable row level security;

-- No policies: deny-all for anon/authenticated; service-role (server-only)
-- bypasses RLS. Same pattern as every other table.
