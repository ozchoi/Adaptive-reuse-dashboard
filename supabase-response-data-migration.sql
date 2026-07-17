alter table public.survey_submissions
  add column if not exists stakeholder_group text,
  add column if not exists stakeholder_group_key text,
  add column if not exists statutory_body_type text,
  add column if not exists submitted_at timestamptz default now(),
  add column if not exists response_data jsonb;

alter table public.survey_submissions
  add column if not exists adaptive_reuse_knowledge text,
  add column if not exists project_involvement text;

alter table public.survey_submissions
  alter column response_data set default '{}'::jsonb;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'survey_submissions' and column_name = 'stakeholder_group'
  ) then
    alter table public.survey_submissions alter column stakeholder_group drop not null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'survey_submissions' and column_name = 'stakeholder_group_key'
  ) then
    alter table public.survey_submissions alter column stakeholder_group_key drop not null;
  end if;
end $$;
