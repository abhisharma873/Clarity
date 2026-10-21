create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  check_in_emails boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- Deleting the auth user should cascade cleanly even outside the app's
-- explicit deletion route. These FKs were created plain in Phases 3/5.
alter table public.sessions drop constraint if exists sessions_user_id_fkey,
  add constraint sessions_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.plans drop constraint if exists plans_user_id_fkey,
  add constraint plans_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

-- Real per-user RLS policies, coexisting with the existing deny-all posture
-- for anonymous (user_id IS NULL) rows, which stay accessible only through
-- server routes that check the anon_token cookie via the service-role client.
create policy "sessions_select_own" on public.sessions for select using (auth.uid() = user_id);
create policy "sessions_update_own" on public.sessions for update using (auth.uid() = user_id);

create policy "plans_select_own" on public.plans for select using (auth.uid() = user_id);
create policy "plans_update_own" on public.plans for update using (auth.uid() = user_id);

create policy "messages_select_own" on public.messages for select using (
  exists (
    select 1 from public.sessions
    where sessions.id = messages.session_id and sessions.user_id = auth.uid()
  )
);

create policy "usage_select_own" on public.usage for select using (
  exists (
    select 1 from public.sessions
    where sessions.id = usage.session_id and sessions.user_id = auth.uid()
  )
);
