-- Run this in the Supabase SQL editor for your project to set up the
-- table that stores skincare test submissions.

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null default 'Bariu',
  answers jsonb not null
);

-- Row Level Security is enabled with no policies, which denies all access
-- from the anon/public API key. The app only ever talks to Supabase from
-- the server using the service role key, which bypasses RLS, so this table
-- stays private even though the project's public API key is exposed in
-- the browser bundle.
alter table submissions enable row level security;
