create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  decision_type text,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- No policies are created: with RLS enabled and zero policies, all access
-- (read and write) is denied for anon/authenticated roles. Inserts happen
-- server-side only, via the service role key, which bypasses RLS.
