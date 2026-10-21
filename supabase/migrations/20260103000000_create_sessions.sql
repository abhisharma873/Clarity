create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  decision_type text,
  decision_text text,
  lens text,
  numerology_system text,
  chart jsonb,
  status text not null default 'started',
  user_id uuid references auth.users(id),
  anon_token text not null,
  created_at timestamptz not null default now()
);

create index if not exists sessions_anon_token_idx on public.sessions (anon_token);

alter table public.sessions enable row level security;

-- No policies are created: with RLS enabled and zero policies, all access
-- (read and write) is denied for anon/authenticated roles. Inserts/updates
-- happen server-side only, via the service role key, which bypasses RLS.
-- Ownership (which anonymous browser a session belongs to) is enforced at
-- the application layer by matching anon_token, not by RLS.
--
-- Deliberately absent: full_name and date_of_birth columns. Those values
-- are used in-memory to compute the numerology chart and are never stored.
