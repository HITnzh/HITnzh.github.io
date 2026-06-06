create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content jsonb not null default '[]'::jsonb,
  cover_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  read_time text not null default '5 min',
  category_id uuid references public.categories(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  stack text[] not null default '{}',
  repo_url text,
  demo_url text,
  status text not null default '进行中',
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  filename text not null,
  mime_type text,
  size integer,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_posts_updated_at on public.posts;
create trigger touch_posts_updated_at
before update on public.posts
for each row execute function public.touch_updated_at();

drop trigger if exists touch_projects_updated_at on public.projects;
create trigger touch_projects_updated_at
before update on public.projects
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_tags enable row level security;
alter table public.projects enable row level security;
alter table public.assets enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "profiles can read own row" on public.profiles;
create policy "profiles can read own row"
on public.profiles for select
using (auth.uid() = user_id);

drop policy if exists "admins can manage profiles" on public.profiles;
create policy "admins can manage profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read categories" on public.categories;
create policy "public can read categories"
on public.categories for select
using (true);

drop policy if exists "admins can manage categories" on public.categories;
create policy "admins can manage categories"
on public.categories for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read tags" on public.tags;
create policy "public can read tags"
on public.tags for select
using (true);

drop policy if exists "admins can manage tags" on public.tags;
create policy "admins can manage tags"
on public.tags for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read published posts" on public.posts;
create policy "public can read published posts"
on public.posts for select
using (status = 'published' or public.is_admin());

drop policy if exists "admins can manage posts" on public.posts;
create policy "admins can manage posts"
on public.posts for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read published post tags" on public.post_tags;
create policy "public can read published post tags"
on public.post_tags for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.posts
    where posts.id = post_tags.post_id
      and posts.status = 'published'
  )
);

drop policy if exists "admins can manage post tags" on public.post_tags;
create policy "admins can manage post tags"
on public.post_tags for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read projects" on public.projects;
create policy "public can read projects"
on public.projects for select
using (true);

drop policy if exists "admins can manage projects" on public.projects;
create policy "admins can manage projects"
on public.projects for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read assets" on public.assets;
create policy "public can read assets"
on public.assets for select
using (true);

drop policy if exists "admins can manage assets" on public.assets;
create policy "admins can manage assets"
on public.assets for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read site settings" on public.site_settings;
create policy "public can read site settings"
on public.site_settings for select
using (true);

drop policy if exists "admins can manage site settings" on public.site_settings;
create policy "admins can manage site settings"
on public.site_settings for all
using (public.is_admin())
with check (public.is_admin());

insert into public.categories (name, slug)
values
  ('技术', 'tech'),
  ('前端', 'frontend'),
  ('研究', 'research'),
  ('项目', 'projects'),
  ('生活', 'life')
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('blog-assets', 'blog-assets', true)
on conflict (id) do nothing;

drop policy if exists "public can read blog assets" on storage.objects;
create policy "public can read blog assets"
on storage.objects for select
using (bucket_id = 'blog-assets');

drop policy if exists "admins can upload blog assets" on storage.objects;
create policy "admins can upload blog assets"
on storage.objects for insert
with check (bucket_id = 'blog-assets' and public.is_admin());

drop policy if exists "admins can update blog assets" on storage.objects;
create policy "admins can update blog assets"
on storage.objects for update
using (bucket_id = 'blog-assets' and public.is_admin())
with check (bucket_id = 'blog-assets' and public.is_admin());

drop policy if exists "admins can delete blog assets" on storage.objects;
create policy "admins can delete blog assets"
on storage.objects for delete
using (bucket_id = 'blog-assets' and public.is_admin());

-- After creating your admin user in Supabase Auth, run this once:
-- insert into public.profiles (user_id, role)
-- values ('YOUR_AUTH_USER_ID', 'admin')
-- on conflict (user_id) do update set role = excluded.role;
