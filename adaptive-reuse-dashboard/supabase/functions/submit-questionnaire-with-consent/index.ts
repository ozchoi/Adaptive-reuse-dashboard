import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const { questionnaireResponse, consentRecord } = await request.json();
    const responseReference = questionnaireResponse?.responseReference;
    const participantName = String(consentRecord?.participantName || '').trim();
    const signatureDataUrl = String(consentRecord?.signatureDataUrl || '');
    const meetingParticipant = !!consentRecord?.stakeholderMeetingParticipant;
    const rawContactEmail = meetingParticipant ? String(consentRecord?.contactEmail || '').trim() : '';
    const emailAt = rawContactEmail.lastIndexOf('@');
    const contactEmail = meetingParticipant && emailAt > 0
      ? rawContactEmail.slice(0, emailAt) + '@' + rawContactEmail.slice(emailAt + 1).toLowerCase()
      : null;
    const emailIsValid = contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
    if (!responseReference || !participantName || consentRecord?.consentToParticipate !== true || consentRecord?.signatureConfirmed !== true || !signatureDataUrl.startsWith('data:image/png;base64,')) {
      return json({ error: 'Invalid consent record.' }, 400);
    }
    if (meetingParticipant && !emailIsValid) return json({ error: 'Valid stakeholder contact email required.' }, 400);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
    const { data: caller, error: callerError } = await admin.auth.getUser(token);
    if (callerError || !caller.user?.is_anonymous) return json({ error: 'Authenticated participant session required.' }, 401);
    const signatureBytes = Uint8Array.from(atob(signatureDataUrl.split(',')[1]), character => character.charCodeAt(0));
    const signaturePath = `${responseReference}/signature.png`;
    const insertPayload = {
      response_reference: responseReference,
      response_data: questionnaireResponse
    };
    const { data: surveySubmission, error: surveyError } = await admin.from('survey_submissions').insert(insertPayload).select().single();
    if (surveyError) throw surveyError;

    const { error: uploadError } = await admin.storage.from('consent-signatures').upload(signaturePath, signatureBytes, { contentType: 'image/png', upsert: false });
    if (uploadError) {
      await admin.from('survey_submissions').delete().eq('response_reference', responseReference);
      throw uploadError;
    }
    const { error: consentError } = await admin.from('consent_records').insert({
      response_reference: responseReference,
      participant_name: participantName,
      contact_email: contactEmail,
      consent_to_participate: true,
      signature_storage_path: signaturePath,
      signature_confirmed: true,
      participant_local_date: consentRecord.participantLocalDate,
      consented_at: new Date().toISOString(),
      stakeholder_meeting_participant: meetingParticipant,
      audio_recording_consent: consentRecord.audioRecordingConsent,
      video_recording_consent: consentRecord.videoRecordingConsent,
      photography_consent: consentRecord.photographyConsent,
      confidentiality_undertaking: consentRecord.confidentialityUndertaking,
      consent_form_version: consentRecord.consentFormVersion,
      reply_slip_version: consentRecord.replySlipVersion
    });
    if (consentError) {
      await admin.storage.from('consent-signatures').remove([signaturePath]);
      await admin.from('survey_submissions').delete().eq('response_reference', responseReference);
      throw consentError;
    }
    return json({ responseReference, surveySubmission });
  } catch (error) {
    console.error('Reply Slip submission failed', error);
    return json({ error: 'Your consent record could not be saved. Please try again.' }, 500);
  }
});
