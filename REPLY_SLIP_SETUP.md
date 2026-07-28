# Reply Slip secure-storage setup

The electronic Reply Slip sends the anonymous questionnaire response and the private consent record to the `submit-questionnaire-with-consent` Edge Function. Names, stakeholder contact email addresses, and signature images are not placed in `survey_submissions.response_data`.

Before publishing the Reply Slip, complete these Supabase steps:

1. Run `supabase-reply-slip-migration.sql` in the SQL Editor.
2. In Storage, create a private bucket named `consent-signatures`. Do not enable public access or add public read policies.
3. In Authentication > Providers, enable Anonymous Sign-Ins. Enable CAPTCHA or Turnstile for anonymous sign-ins before production use.
4. Deploy the Edge Function: `supabase functions deploy submit-questionnaire-with-consent`.
5. Keep the function JWT verification enabled. The questionnaire creates an Anonymous Auth session and the function accepts only that session type.

The function uses the server-side Supabase service-role environment variable supplied by the Edge runtime. Never add a service-role or secret key to `supabase-config.js` or GitHub Pages.

`consent_records` deliberately has no browser SELECT policy. The existing frontend project-team code is only a soft UI lock, so it must not be used to expose participant names or signature files. Add a separate authenticated research-team consent-record view only after setting up Supabase Auth and appropriate RLS policies.
