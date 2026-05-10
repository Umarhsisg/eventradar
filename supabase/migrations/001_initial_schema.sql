-- EventRadar initial schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zyeqabocultzyakjjsvd/sql

-- ─── profiles ────────────────────────────────────────────────────────────────
-- Extends auth.users with app-specific fields
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  college    text,
  district   text,
  role       text not null default 'student' check (role in ('student', 'admin')),
  status     text not null default 'approved' check (status in ('approved', 'pending', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone can read approved profiles
create policy "Public profiles are viewable"
  on public.profiles for select
  using (status = 'approved');

-- Users can read their own profile regardless of status
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (not role/status)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can do anything on profiles
create policy "Admins have full access to profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-create profile on signup via trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, college, district)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'district'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─── events ──────────────────────────────────────────────────────────────────
create table if not exists public.events (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  type                  text not null check (type in ('Hackathon','Fest','Seminar','Contest','Workshop','Webinar')),
  district              text not null,
  date                  date not null,
  end_date              date,
  college               text not null,
  description           text not null,
  venue                 text not null,
  registration_link     text not null,
  registration_deadline date not null,
  team_size             text,
  prize                 text,
  organizer             text,
  tags                  text[] default '{}',
  status                text not null default 'pending' check (status in ('pending','approved','rejected')),
  posted_by             uuid references public.profiles(id) on delete set null,
  created_at            timestamptz not null default now()
);

alter table public.events enable row level security;

-- Anyone can view approved events
create policy "Approved events are public"
  on public.events for select
  using (status = 'approved');

-- Authors can see their own events regardless of status
create policy "Authors can view own events"
  on public.events for select
  using (auth.uid() = posted_by);

-- Authenticated users can insert events
create policy "Authenticated users can post events"
  on public.events for insert
  to authenticated
  with check (auth.uid() = posted_by);

-- Authors can update their own pending events
create policy "Authors can update own pending events"
  on public.events for update
  using (auth.uid() = posted_by and status = 'pending')
  with check (auth.uid() = posted_by);

-- Admins have full access
create policy "Admins have full access to events"
  on public.events for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );


-- ─── Seed: promote first user to admin (run after first signup) ───────────────
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
