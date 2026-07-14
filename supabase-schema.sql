create extension if not exists pgcrypto;

create table if not exists public.survey_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  stakeholder_group text not null,
  stakeholder_group_key text not null,
  industrial_ownership_type text,
  ratings jsonb not null default '{}'::jsonb,
  selected_factors text[] not null default '{}',
  factor_ranking text[] not null default '{}',
  factor_ratings jsonb not null default '{}'::jsonb,
  respondent_profile jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  "selectedFactors" text[] not null default '{}',
  "factorRanking" text[] not null default '{}',
  "factorRatings" jsonb not null default '{}'::jsonb,
  "stakeholderGroup" text,
  "respondentProfile" jsonb not null default '{}'::jsonb,
  "submittedAt" timestamptz,
  top_factor_ids text[] not null default '{}',
  top_factor_names text[] not null default '{}',
  preferred_reuse_outcomes text[] not null default '{}'
);

alter table public.survey_submissions add column if not exists selected_factors text[] not null default '{}';
alter table public.survey_submissions add column if not exists factor_ranking text[] not null default '{}';
alter table public.survey_submissions add column if not exists factor_ratings jsonb not null default '{}'::jsonb;
alter table public.survey_submissions add column if not exists respondent_profile jsonb not null default '{}'::jsonb;
alter table public.survey_submissions add column if not exists submitted_at timestamptz;
alter table public.survey_submissions add column if not exists "selectedFactors" text[] not null default '{}';
alter table public.survey_submissions add column if not exists "factorRanking" text[] not null default '{}';
alter table public.survey_submissions add column if not exists "factorRatings" jsonb not null default '{}'::jsonb;
alter table public.survey_submissions add column if not exists "stakeholderGroup" text;
alter table public.survey_submissions add column if not exists "respondentProfile" jsonb not null default '{}'::jsonb;
alter table public.survey_submissions add column if not exists "submittedAt" timestamptz;

create table if not exists public.stakeholder_suggested_factors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  factor_name text not null,
  suggested_by text not null default 'Unspecified',
  stakeholder_group text not null,
  related_dimension text not null,
  comment text not null default 'No comment provided.',
  include_in_final_model boolean not null default true
);

alter table public.survey_submissions enable row level security;
alter table public.stakeholder_suggested_factors enable row level security;

drop policy if exists "Public dashboard can insert survey submissions" on public.survey_submissions;
create policy "Public dashboard can insert survey submissions"
on public.survey_submissions
for insert
to anon
with check (true);

drop policy if exists "Public dashboard can read survey submissions" on public.survey_submissions;
create policy "Public dashboard can read survey submissions"
on public.survey_submissions
for select
to anon
using (true);

drop policy if exists "Public dashboard can insert suggested factors" on public.stakeholder_suggested_factors;
create policy "Public dashboard can insert suggested factors"
on public.stakeholder_suggested_factors
for insert
to anon
with check (true);

drop policy if exists "Public dashboard can read suggested factors" on public.stakeholder_suggested_factors;
create policy "Public dashboard can read suggested factors"
on public.stakeholder_suggested_factors
for select
to anon
using (true);
