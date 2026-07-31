-- Identifiable consent data stays separate from questionnaire analytics.
-- This migration is idempotent and preserves all existing questionnaire rows.

alter table public.survey_submissions
  add column if not exists response_reference uuid;

create unique index if not exists survey_submissions_response_reference_key
  on public.survey_submissions (response_reference);

create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  response_reference uuid not null unique references public.survey_submissions(response_reference) on delete cascade,
  participant_name text not null,
  contact_email text,
  consent_to_participate boolean not null,
  signature_storage_path text,
  signature_confirmed boolean not null default false,
  participant_local_date date not null,
  consented_at timestamptz not null default now(),
  stakeholder_meeting_participant boolean not null default false,
  audio_recording_consent boolean,
  video_recording_consent boolean,
  photography_consent boolean,
  confidentiality_undertaking boolean,
  consent_form_version text not null,
  reply_slip_version text not null,
  created_at timestamptz not null default now()
);

alter table public.consent_records enable row level security;
revoke all on public.consent_records from anon, authenticated;

alter table public.consent_records
  add column if not exists contact_email text;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'consent-signatures',
  'consent-signatures',
  false,
  2097152,
  array['image/png']::text[]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.consent_records is
  'Restricted participant consent records linked to anonymous questionnaire responses by UUID.';
