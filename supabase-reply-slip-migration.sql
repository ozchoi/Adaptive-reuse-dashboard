-- Run in the Supabase SQL editor before deploying the Reply Slip endpoint.
-- This table holds identifiable consent data. Keep it out of public analytics.

alter table public.survey_submissions
  add column if not exists response_reference uuid unique;

create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  response_reference uuid not null unique references public.survey_submissions(response_reference) on delete cascade,
  participant_name text not null,
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

-- Create a private bucket in Storage Dashboard named `consent-signatures`.
-- Do not add public read policies. The Edge Function uses the server-side key.
