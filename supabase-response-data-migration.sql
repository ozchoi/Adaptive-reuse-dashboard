alter table public.survey_submissions
  add column if not exists stakeholder_group text,
  add column if not exists statutory_body_type text,
  add column if not exists submitted_at timestamptz default now(),
  add column if not exists response_data jsonb;

alter table public.survey_submissions
  add column if not exists adaptive_reuse_knowledge text,
  add column if not exists project_involvement text;
