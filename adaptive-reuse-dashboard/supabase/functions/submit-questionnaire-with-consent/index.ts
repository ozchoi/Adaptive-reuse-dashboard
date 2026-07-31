import { createClient } from 'npm:@supabase/supabase-js@2.95.0';

type JsonRecord = Record<string, unknown>;

const allowedOrigins = new Set([
  'https://ozchoi.github.io',
  'http://localhost:8765',
  'http://127.0.0.1:8765'
]);
const signatureBucket = 'consent-signatures';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requestOriginAllowed(request: Request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  try {
    const url = new URL(origin);
    return (url.hostname === 'localhost' || url.hostname === '127.0.0.1') && ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function corsHeaders(request: Request) {
  const origin = request.headers.get('Origin');
  return {
    'Access-Control-Allow-Origin': origin && requestOriginAllowed(request) ? origin : 'https://ozchoi.github.io',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };
}

function json(request: Request, body: JsonRecord, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json' }
  });
}

function validationError(request: Request, message: string) {
  return json(request, { success: false, error: 'VALIDATION_ERROR', message }, 400);
}

function serverKey() {
  try {
    const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}') as Record<string, string>;
    if (keys.default) return keys.default;
    const firstKey = Object.values(keys).find(Boolean);
    if (firstKey) return firstKey;
  } catch {
    // Fall through to the legacy server-only environment variable.
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
}

function objectValue(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : {};
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(item => String(item || '').trim()).filter(Boolean))];
}

function stringValue(value: unknown) {
  return String(value || '').trim();
}

function questionnaireValidation(questionnaire: JsonRecord) {
  const responseReference = stringValue(questionnaire.responseReference || questionnaire.response_reference);
  const stakeholderGroup = stringValue(questionnaire.stakeholderGroup || questionnaire.stakeholder_group);
  const stakeholderGroupKey = stringValue(questionnaire.stakeholderGroupKey || questionnaire.stakeholder_group_key);
  const participantBased = stringValue(questionnaire.participantBased || questionnaire.participant_based);
  const knowledge = stringValue(questionnaire.adaptiveReuseKnowledge || questionnaire.adaptive_reuse_knowledge);
  const involvement = stringValue(questionnaire.projectInvolvement || questionnaire.project_involvement);
  const strategy = stringValue(questionnaire.selectedStrategy || questionnaire.selected_strategy);
  const selectedFactors = stringArray(questionnaire.selectedFactors || questionnaire.selected_factors);
  const ranking = stringArray(questionnaire.factorRanking || questionnaire.factor_ranking);
  const scores = objectValue(questionnaire.factorImportanceScores || questionnaire.factor_importance_scores);
  const selectedOutcomes = stringArray(
    questionnaire.selectedReuseRedevelopmentOutcomes || questionnaire.selected_reuse_redevelopment_outcomes
  );
  const outcomeRatings = objectValue(questionnaire.preferredOutcomeRatings || questionnaire.preferred_outcome_ratings);

  if (!uuidPattern.test(responseReference)) return 'A valid response reference is required.';
  if (!stakeholderGroup || !stakeholderGroupKey || !participantBased || !knowledge || !involvement) {
    return 'All required participant background questions must be completed.';
  }
  if (!['adaptiveReuse', 'demolitionRedevelopment'].includes(strategy)) {
    return 'A valid development strategy is required.';
  }
  if (selectedFactors.length !== 5) return 'Exactly five selected factors are required.';
  if (ranking.length !== 5 || ranking.some(id => !selectedFactors.includes(id))) {
    return 'The factor ranking must contain the same five selected factors.';
  }
  if (selectedFactors.some(id => !Number.isFinite(Number(scores[id])) || Number(scores[id]) < 0 || Number(scores[id]) > 100)) {
    return 'Every selected factor must have an importance score from 0 to 100.';
  }
  for (let index = 0; index < ranking.length - 1; index += 1) {
    if (Number(scores[ranking[index]]) < Number(scores[ranking[index + 1]])) {
      return 'The factor ranking must be consistent with the importance scores.';
    }
  }
  if (selectedOutcomes.length !== 5) return 'Exactly five selected outcomes are required.';
  if (selectedOutcomes.some(id => {
    const rating = Number(outcomeRatings[id]);
    return !Number.isFinite(rating) || rating < 2 || rating > 4;
  })) {
    return 'Every selected outcome must have a preference level.';
  }
  const consent = objectValue(questionnaire.consent);
  if (questionnaire.consentAccepted !== true && questionnaire.consent_accepted !== true && consent.accepted !== true) {
    return 'Consent to participate is required.';
  }
  return '';
}

Deno.serve(async request => {
  if (!requestOriginAllowed(request)) {
    return json(request, { success: false, error: 'ORIGIN_NOT_ALLOWED', message: 'This request origin is not allowed.' }, 403);
  }
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== 'POST') {
    return json(request, { success: false, error: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' }, 405);
  }

  try {
    const body = objectValue(await request.json());
    const questionnaireResponse = objectValue(body.questionnaireResponse);
    const consentRecord = objectValue(body.consentRecord);
    if (!Object.keys(questionnaireResponse).length) {
      return validationError(request, 'A questionnaire response is required.');
    }

    const questionnaireError = questionnaireValidation(questionnaireResponse);
    if (questionnaireError) return validationError(request, questionnaireError);

    const responseReference = stringValue(
      questionnaireResponse.responseReference || questionnaireResponse.response_reference
    );
    const consentResponseReference = stringValue(consentRecord.responseReference || consentRecord.response_reference);
    const participantName = stringValue(consentRecord.participantName);
    const signatureDataUrl = stringValue(consentRecord.signatureDataUrl);
    const participantLocalDate = stringValue(consentRecord.participantLocalDate);
    const meetingParticipant = consentRecord.stakeholderMeetingParticipant === true;
    const rawContactEmail = meetingParticipant ? stringValue(consentRecord.contactEmail) : '';
    const emailAt = rawContactEmail.lastIndexOf('@');
    const contactEmail = meetingParticipant && emailAt > 0
      ? rawContactEmail.slice(0, emailAt) + '@' + rawContactEmail.slice(emailAt + 1).toLowerCase()
      : null;

    if (consentResponseReference !== responseReference) {
      return validationError(request, 'The questionnaire and consent references must match.');
    }
    if (!participantName || participantName.length > 200) {
      return validationError(request, 'A participant name is required.');
    }
    if (consentRecord.consentToParticipate !== true) {
      return validationError(request, 'Consent to participate is required.');
    }
    if (consentRecord.signatureConfirmed !== true) {
      return validationError(request, 'Electronic-signature confirmation is required.');
    }
    if (!signatureDataUrl.startsWith('data:image/png;base64,') || signatureDataUrl.length < 150 || signatureDataUrl.length > 2_000_000) {
      return validationError(request, 'A valid electronic signature is required.');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(participantLocalDate)) {
      return validationError(request, 'A valid participant date is required.');
    }
    if (meetingParticipant && (!contactEmail || contactEmail.length > 320 || !emailPattern.test(contactEmail))) {
      return validationError(request, 'A valid stakeholder contact email is required.');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const adminKey = serverKey();
    if (!supabaseUrl || !adminKey) throw new Error('Required server environment is unavailable.');
    const admin = createClient(supabaseUrl, adminKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') || '';
    const { data: caller, error: callerError } = await admin.auth.getUser(token);
    if (callerError || !caller.user?.is_anonymous) {
      return json(request, {
        success: false,
        error: 'AUTHENTICATION_REQUIRED',
        message: 'An authenticated participant session is required.'
      }, 401);
    }

    const signatureBytes = Uint8Array.from(
      atob(signatureDataUrl.split(',')[1]),
      character => character.charCodeAt(0)
    );
    if (signatureBytes.byteLength < 100) return validationError(request, 'A valid electronic signature is required.');

    const signaturePath = `${responseReference}/signature.png`;
    const { data: existingSurvey } = await admin
      .from('survey_submissions')
      .select('id, response_reference, response_data')
      .eq('response_reference', responseReference)
      .maybeSingle();
    const { data: existingConsent } = await admin
      .from('consent_records')
      .select('id, response_reference, signature_storage_path')
      .eq('response_reference', responseReference)
      .maybeSingle();
    if (existingSurvey && existingConsent) {
      return json(request, {
        success: true,
        responseReference,
        surveySubmission: existingSurvey
      });
    }
    if (existingConsent) await admin.from('consent_records').delete().eq('response_reference', responseReference);
    if (existingSurvey) await admin.from('survey_submissions').delete().eq('response_reference', responseReference);
    await admin.storage.from(signatureBucket).remove([signaturePath]);

    const { error: uploadError } = await admin.storage
      .from(signatureBucket)
      .upload(signaturePath, signatureBytes, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });
    if (uploadError) throw uploadError;

    const stakeholderGroup = stringValue(
      questionnaireResponse.stakeholderGroup || questionnaireResponse.stakeholder_group
    );
    const stakeholderGroupKey = stringValue(
      questionnaireResponse.stakeholderGroupKey || questionnaireResponse.stakeholder_group_key
    );
    const submittedAt = stringValue(
      questionnaireResponse.submittedAt || questionnaireResponse.submitted_at
    ) || new Date().toISOString();
    const { data: surveySubmission, error: surveyError } = await admin
      .from('survey_submissions')
      .insert({
        response_reference: responseReference,
        stakeholder_group: stakeholderGroup,
        stakeholder_group_key: stakeholderGroupKey,
        statutory_body_type: questionnaireResponse.statutoryBodyType || questionnaireResponse.statutory_body_type || null,
        submitted_at: submittedAt,
        response_data: questionnaireResponse
      })
      .select()
      .single();
    if (surveyError) {
      await admin.storage.from(signatureBucket).remove([signaturePath]);
      throw surveyError;
    }

    const { error: consentError } = await admin.from('consent_records').insert({
      response_reference: responseReference,
      participant_name: participantName,
      contact_email: contactEmail,
      consent_to_participate: true,
      signature_storage_path: signaturePath,
      signature_confirmed: true,
      participant_local_date: participantLocalDate,
      consented_at: new Date().toISOString(),
      stakeholder_meeting_participant: meetingParticipant,
      audio_recording_consent: meetingParticipant ? consentRecord.audioRecordingConsent === true : null,
      video_recording_consent: meetingParticipant ? consentRecord.videoRecordingConsent === true : null,
      photography_consent: meetingParticipant ? consentRecord.photographyConsent === true : null,
      confidentiality_undertaking: meetingParticipant ? consentRecord.confidentialityUndertaking === true : null,
      consent_form_version: stringValue(consentRecord.consentFormVersion),
      reply_slip_version: stringValue(consentRecord.replySlipVersion)
    });
    if (consentError) {
      await admin.from('survey_submissions').delete().eq('response_reference', responseReference);
      await admin.storage.from(signatureBucket).remove([signaturePath]);
      throw consentError;
    }

    return json(request, {
      success: true,
      responseReference,
      surveySubmission
    });
  } catch (error) {
    console.error('Reply Slip submission failed', error);
    return json(request, {
      success: false,
      error: 'SUBMISSION_FAILED',
      message: 'Your questionnaire and consent record could not be saved. Please try again.'
    }, 500);
  }
});
