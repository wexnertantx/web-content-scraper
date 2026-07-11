-- Website Content Scraper MVP - initial schema
-- Authentication is handled by Supabase Auth (auth.users). Passwords are
-- hashed by Supabase, not by application code. `profiles` stores the
-- full_name that Supabase Auth does not natively track.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_name text not null,
  website_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on public.projects (user_id);

create table if not exists public.scrape_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'running', 'success', 'failed')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  summary text
);

create index if not exists scrape_runs_project_id_idx on public.scrape_runs (project_id);

create table if not exists public.scraped_results (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.scrape_runs (id) on delete cascade,
  json_data jsonb,
  markdown_data text,
  created_at timestamptz not null default now()
);

create index if not exists scraped_results_run_id_idx on public.scraped_results (run_id);

-- Keep projects.updated_at current whenever a project is modified.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- Create a profile row automatically when a user registers.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security: every table is scoped to the owning user.
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.scrape_runs enable row level security;
alter table public.scraped_results enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can manage their own projects"
  on public.projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage scrape runs for their own projects"
  on public.scrape_runs for all
  using (exists (select 1 from public.projects where projects.id = scrape_runs.project_id and projects.user_id = auth.uid()))
  with check (exists (select 1 from public.projects where projects.id = scrape_runs.project_id and projects.user_id = auth.uid()));

create policy "Users can manage results for their own scrape runs"
  on public.scraped_results for all
  using (
    exists (
      select 1 from public.scrape_runs
      join public.projects on projects.id = scrape_runs.project_id
      where scrape_runs.id = scraped_results.run_id and projects.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.scrape_runs
      join public.projects on projects.id = scrape_runs.project_id
      where scrape_runs.id = scraped_results.run_id and projects.user_id = auth.uid()
    )
  );
