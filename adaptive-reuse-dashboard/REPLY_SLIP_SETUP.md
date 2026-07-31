# Reply Slip secure-storage setup

The electronic Reply Slip sends the anonymous questionnaire response and the private consent record to the `submit-questionnaire-with-consent` Edge Function. Names, stakeholder contact email addresses, and signature images are not placed in `survey_submissions.response_data`.

The production project is `nzmljorsmzdexzacnqzg`. A fresh environment should complete these Supabase steps:

1. Apply `supabase/migrations/20260731091300_add_secure_questionnaire_consent_storage.sql`. It creates the restricted consent table, response reference, and private `consent-signatures` bucket without changing existing submissions.
2. In Authentication > Sign In / Providers, enable Anonymous Sign-Ins. Enable CAPTCHA or Turnstile for anonymous sign-ins before production use.
3. Deploy the Edge Function: `supabase functions deploy submit-questionnaire-with-consent --project-ref nzmljorsmzdexzacnqzg`.
4. Confirm `SUPABASE_URL` and a server-only key (`SUPABASE_SECRET_KEYS` or the legacy `SUPABASE_SERVICE_ROLE_KEY`) are available to the Edge Function runtime.
5. Keep the function JWT verification enabled. The questionnaire creates an Anonymous Auth session and the function accepts only that session type.

Supabase supplies the platform environment variables to deployed Edge Functions. Never add a service-role or secret key to `supabase-config.js`, `app.js`, GitHub Pages, or Git.

`consent_records` deliberately has no browser SELECT policy. The existing frontend project-team code is only a soft UI lock, so it must not be used to expose participant names or signature files. Add a separate authenticated research-team consent-record view only after setting up Supabase Auth and appropriate RLS policies.
