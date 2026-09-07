const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_TOTAL_SIZE = 200 * 1024 * 1024;
const MAX_FILES = 3;

export const ANSWER_FIELDS = [
  'currentProcess',
  'creationFrequency',
  'creationLocation',
  'locationRestrictions',
  'currentTools',
  'cadenceSession',
  'workflowImpact',
  'friction',
  'likedFeatures',
  'dislikedFeatures',
  'loopingFeedback',
  'rhymeFeedback',
  'missingFeatures',
  'navigationReason',
  'bugs',
  'retentionTrigger',
  'replacementPotential',
  'recommendationTrigger',
  'recommendationBlocker',
  'pricingMonthly',
  'pricingAnnual',
  'pricingLifetime',
  'pricingCurrency',
];

export const FORM_FIELDS = [
  'name',
  'email',
  'wantsLifetimeAccess',
  'platform',
  'musicalIdentity',
  'language',
  ...ANSWER_FIELDS,
  'navigationScore',
  'consentResearch',
  'consentFollowup',
];

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'image/heif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
]);

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function requireFields(values, fields, errors) {
  for (const field of fields) {
    if (!text(values[field])) errors[field] = 'required';
  }
}

export function validateStage(stageIndex, values) {
  const errors = {};
  if (stageIndex === 0) {
    requireFields(values, ['name', 'email', 'platform', 'musicalIdentity', 'language'], errors);
    const email = text(values.email);
    if (email && !EMAIL_PATTERN.test(email)) errors.email = 'invalid';
    if (!['yes', 'no'].includes(text(values.wantsLifetimeAccess))) {
      errors.wantsLifetimeAccess = 'required';
    }
  } else if (stageIndex === 1) {
    requireFields(values, ['currentProcess', 'currentTools'], errors);
  } else if (stageIndex === 2) {
    requireFields(
      values,
      ['cadenceSession', 'workflowImpact', 'friction', 'likedFeatures'],
      errors,
    );
    const score = Number(values.navigationScore);
    if (!Number.isInteger(score) || score < 1 || score > 10) {
      errors.navigationScore = 'invalid';
    }
  } else if (stageIndex === 3) {
    requireFields(values, ['retentionTrigger', 'recommendationTrigger'], errors);
    if (text(values.consentResearch) !== 'on') errors.consentResearch = 'required';
  }
  return errors;
}

export function validateEvidenceFiles(filesLike) {
  const files = Array.from(filesLike ?? []);
  if (files.length > MAX_FILES) return [{ field: 'evidence', code: 'too_many' }];
  const errors = [];
  let total = 0;
  for (const file of files) {
    const name = typeof file.name === 'string' ? file.name : 'file';
    const type = typeof file.type === 'string' ? file.type.toLowerCase() : '';
    const size = Number(file.size);
    if (!ALLOWED_MIME_TYPES.has(type)) {
      errors.push({ field: 'evidence', code: 'unsupported', name });
    }
    if (!Number.isFinite(size) || size <= 0) {
      errors.push({ field: 'evidence', code: 'empty', name });
    } else if (size > MAX_FILE_SIZE) {
      errors.push({ field: 'evidence', code: 'too_large', name });
    }
    if (Number.isFinite(size) && size > 0) total += size;
  }
  if (total > MAX_TOTAL_SIZE) errors.push({ field: 'evidence', code: 'total_too_large' });
  return errors;
}

export function makeFileMetadata(filesLike) {
  return Array.from(filesLike ?? []).map((file, index) => ({
    clientId: `file-${index + 1}`,
    name: String(file.name ?? '').split(/[\\/]/).at(-1),
    type: String(file.type ?? '').toLowerCase(),
    size: Number(file.size),
  }));
}

export function buildSubmissionPayload(values, context) {
  const answers = {};
  for (const field of ANSWER_FIELDS) answers[field] = text(values[field]);
  return {
    startedAt: context.startedAt,
    honeypot: text(values.company),
    name: text(values.name),
    email: text(values.email).toLowerCase(),
    wantsLifetimeAccess: text(values.wantsLifetimeAccess) === 'yes',
    platform: text(values.platform),
    musicalIdentity: text(values.musicalIdentity),
    language: text(values.language),
    navigationScore: Number(values.navigationScore),
    answers,
    consentResearch: text(values.consentResearch) === 'on',
    consentFollowup: text(values.consentFollowup) === 'on',
    invitationToken: text(context.invitationToken) || null,
    referrer: text(context.referrer).slice(0, 2_048) || null,
    utm: {
      source: text(context.utmSource).slice(0, 120) || null,
      medium: text(context.utmMedium).slice(0, 120) || null,
      campaign: text(context.utmCampaign).slice(0, 120) || null,
    },
  };
}

export function sessionSnapshot(values) {
  const snapshot = {};
  for (const field of FORM_FIELDS) {
    if (typeof values[field] === 'string') snapshot[field] = values[field];
  }
  return snapshot;
}

export function restoreSessionValues(serialized) {
  try {
    const parsed = JSON.parse(serialized);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return sessionSnapshot(parsed);
  } catch {
    return {};
  }
}
