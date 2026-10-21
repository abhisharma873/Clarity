create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id),
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_session_id_idx on public.messages (session_id, created_at);

alter table public.messages enable row level security;

create table if not exists public.usage (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id),
  input_tokens integer not null,
  output_tokens integer not null,
  created_at timestamptz not null default now()
);

create index if not exists usage_session_id_idx on public.usage (session_id);

alter table public.usage enable row level security;

-- No policies on either table: deny-all for anon/authenticated; service-role
-- (server-only) bypasses RLS. Same pattern as waitlist and sessions.
