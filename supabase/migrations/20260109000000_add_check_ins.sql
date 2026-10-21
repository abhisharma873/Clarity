alter table public.plans add column if not exists check_in_sent_at timestamptz;

create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  answer text not null check (answer in ('yes', 'partly', 'no')),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists check_ins_plan_id_idx on public.check_ins (plan_id);

alter table public.check_ins enable row level security;

-- No policies: deny-all for anon/authenticated, same posture as sessions/
-- messages. Written only via the signed single-use token route and read
-- only by the cron job and the thank-you page — both service-role.
