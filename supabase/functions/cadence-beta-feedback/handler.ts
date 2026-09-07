export type ValidationError = { field: string; code: string };

export interface NormalizedPayload {
  startedAt: number;
  honeypot: string;
  name: string;
  email: string;
  wantsLifetimeAccess: boolean;
  platform: string;
  musicalIdentity: string;
  language: string;
  navigationScore: number;
  answers: Record<string, string>;
  consentResearch: true;
  consentFollowup: boolean;
  invitationToken: string | null;
  referrer: string | null;
  utm: { source: string | null; medium: string | null; campaign: string | null };
}

export interface EvidenceFile {
  clientId: string;
  name: string;
  type: string;
  size: number;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ValidationError[] };

export interface BeginSubmissionInput {
  payload: NormalizedPayload;
  files: EvidenceFile[];
  ipHash: string | null;
  userAgent: string | null;
}

export interface UploadInstruction {
  clientId: string;
  uploadId: string;
  path: string;
  token: string;
}

export interface BeginSubmissionResult {
  submissionId: string;
  completionToken: string | null;
  uploads: UploadInstruction[];
}

export interface FinalizeSubmissionInput {
  submissionId: string;
  completionToken: string;
}

export type FinalizeSubmissionResult =
  | { kind: 'not_found' }
  | { kind: 'complete'; uploaded: number; missingClientIds: string[] }
  | { kind: 'incomplete'; uploaded: number; missingClientIds: string[] };

export interface FeedbackDependencies {
  now: () => number;
  hashIp: (value: string) => Promise<string | null>;
  countRecentSubmissions: (ipHash: string) => Promise<number>;
  beginSubmission: (input: BeginSubmissionInput) => Promise<BeginSubmissionResult>;
  finalizeSubmission: (input: FinalizeSubmissionInput) => Promise<FinalizeSubmissionResult>;
}

const ANSWER_KEYS = [
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
] as const;

const REQUIRED_ANSWER_KEYS = new Set([
  'cadenceSession',
  'workflowImpact',
  'friction',
  'likedFeatures',
  'retentionTrigger',
  'recommendationTrigger',
]);

const ANSWER_KEY_SET = new Set<string>(ANSWER_KEYS);
const MAX_ANSWER_LENGTH = 8_000;
const MAX_ANSWER_TOTAL = 50_000;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_FILE_TOTAL = 200 * 1024 * 1024;
const MAX_FILES = 3;
const MIN_COMPLETION_MS = 8_000;
const RATE_LIMIT_PER_HOUR = 5;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CLIENT_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const ALLOWED_PLATFORMS = new Set(['iPhone', 'Android', 'Both', 'Other']);
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
const FIXED_ORIGINS = new Set([
  'https://brandnamechanges.com',
  'https://www.brandnamechanges.com',
  'https://lukejazzdudley-hub.github.io',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function boundedString(
  value: unknown,
  field: string,
  errors: ValidationError[],
  options: { required?: boolean; max: number },
): string {
  if (typeof value !== 'string') {
    if (options.required) errors.push({ field, code: 'required' });
    else if (value !== undefined && value !== null) errors.push({ field, code: 'invalid' });
    return '';
  }
  const normalized = value.trim();
  if (options.required && !normalized) errors.push({ field, code: 'required' });
  else if (normalized.length > options.max) errors.push({ field, code: 'too_long' });
  return normalized.slice(0, options.max);
}

function optionalBoundedString(
  value: unknown,
  field: string,
  errors: ValidationError[],
  max: number,
): string | null {
  const normalized = boundedString(value, field, errors, { max });
  return normalized || null;
}

export function validateBeginPayload(value: unknown): ValidationResult<NormalizedPayload> {
  if (!isRecord(value)) {
    return { ok: false, errors: [{ field: 'payload', code: 'invalid' }] };
  }

  const errors: ValidationError[] = [];
  const name = boundedString(value.name, 'name', errors, { required: true, max: 160 });
  const email = boundedString(value.email, 'email', errors, { required: true, max: 320 }).toLowerCase();
  if (email && !EMAIL_PATTERN.test(email)) errors.push({ field: 'email', code: 'invalid' });

  const wantsLifetimeAccess = value.wantsLifetimeAccess;
  if (typeof wantsLifetimeAccess !== 'boolean') {
    errors.push({ field: 'wantsLifetimeAccess', code: 'invalid' });
  }

  const platform = boundedString(value.platform, 'platform', errors, { required: true, max: 40 });
  if (platform && !ALLOWED_PLATFORMS.has(platform)) {
    errors.push({ field: 'platform', code: 'invalid' });
  }
  const musicalIdentity = boundedString(value.musicalIdentity, 'musicalIdentity', errors, {
    required: true,
    max: 500,
  });
  const language = boundedString(value.language, 'language', errors, { required: true, max: 80 });

  const navigationScore = value.navigationScore;
  if (!Number.isInteger(navigationScore) || (navigationScore as number) < 1 || (navigationScore as number) > 10) {
    errors.push({ field: 'navigationScore', code: 'invalid' });
  }

  const normalizedAnswers: Record<string, string> = {};
  let answerTotal = 0;
  if (!isRecord(value.answers)) {
    errors.push({ field: 'answers', code: 'invalid' });
  } else {
    for (const key of ANSWER_KEYS) {
      const normalized = boundedString(value.answers[key], `answers.${key}`, errors, {
        required: REQUIRED_ANSWER_KEYS.has(key),
        max: MAX_ANSWER_LENGTH,
      });
      normalizedAnswers[key] = normalized;
      answerTotal += normalized.length;
    }
    for (const key of Object.keys(value.answers)) {
      if (!ANSWER_KEY_SET.has(key)) {
        errors.push({ field: `answers.${key}`, code: 'unexpected' });
      }
    }
  }
  if (answerTotal > MAX_ANSWER_TOTAL) errors.push({ field: 'answers', code: 'too_long' });

  if (value.consentResearch !== true) errors.push({ field: 'consentResearch', code: 'required' });
  if (typeof value.consentFollowup !== 'boolean') {
    errors.push({ field: 'consentFollowup', code: 'invalid' });
  }
  if (typeof value.startedAt !== 'number' || !Number.isFinite(value.startedAt) || value.startedAt <= 0) {
    errors.push({ field: 'startedAt', code: 'invalid' });
  }

  const honeypot = boundedString(value.honeypot, 'honeypot', errors, { max: 500 });
  const invitationToken = optionalBoundedString(
    value.invitationToken,
    'invitationToken',
    errors,
    256,
  );
  const referrer = optionalBoundedString(value.referrer, 'referrer', errors, 2_048);
  const utmValue = isRecord(value.utm) ? value.utm : {};
  if (value.utm !== undefined && value.utm !== null && !isRecord(value.utm)) {
    errors.push({ field: 'utm', code: 'invalid' });
  }
  const utm = {
    source: optionalBoundedString(utmValue.source, 'utm.source', errors, 120),
    medium: optionalBoundedString(utmValue.medium, 'utm.medium', errors, 120),
    campaign: optionalBoundedString(utmValue.campaign, 'utm.campaign', errors, 120),
  };

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      startedAt: value.startedAt as number,
      honeypot,
      name,
      email,
      wantsLifetimeAccess: wantsLifetimeAccess as boolean,
      platform,
      musicalIdentity,
      language,
      navigationScore: navigationScore as number,
      answers: normalizedAnswers,
      consentResearch: true,
      consentFollowup: value.consentFollowup as boolean,
      invitationToken,
      referrer,
      utm,
    },
  };
}

export function validateFiles(value: unknown): ValidationResult<EvidenceFile[]> {
  if (!Array.isArray(value)) {
    return { ok: false, errors: [{ field: 'files', code: 'invalid' }] };
  }
  if (value.length > MAX_FILES) {
    return { ok: false, errors: [{ field: 'files', code: 'too_many' }] };
  }

  const errors: ValidationError[] = [];
  const normalized: EvidenceFile[] = [];
  let totalSize = 0;
  for (const item of value) {
    if (!isRecord(item)) {
      errors.push({ field: 'files', code: 'invalid' });
      continue;
    }
    const clientId = typeof item.clientId === 'string' ? item.clientId.trim() : '';
    const prefix = clientId && CLIENT_ID_PATTERN.test(clientId) ? `files.${clientId}` : 'files';
    if (!CLIENT_ID_PATTERN.test(clientId)) errors.push({ field: `${prefix}.clientId`, code: 'invalid' });

    const name = typeof item.name === 'string' ? item.name.trim() : '';
    if (!name) errors.push({ field: `${prefix}.name`, code: 'required' });
    else if (name.length > 255) errors.push({ field: `${prefix}.name`, code: 'too_long' });

    const type = typeof item.type === 'string' ? item.type.toLowerCase().trim() : '';
    if (!ALLOWED_MIME_TYPES.has(type)) errors.push({ field: `${prefix}.type`, code: 'unsupported' });

    const size = item.size;
    if (!Number.isInteger(size) || (size as number) <= 0) {
      errors.push({ field: `${prefix}.size`, code: 'invalid' });
    } else if ((size as number) > MAX_FILE_SIZE) {
      errors.push({ field: `${prefix}.size`, code: 'too_large' });
    }
    if (Number.isInteger(size) && (size as number) > 0) totalSize += size as number;

    normalized.push({
      clientId,
      name: name.slice(0, 255),
      type,
      size: typeof size === 'number' ? size : 0,
    });
  }
  if (totalSize > MAX_FILE_TOTAL) errors.push({ field: 'files', code: 'total_too_large' });
  return errors.length ? { ok: false, errors } : { ok: true, value: normalized };
}

export function extractClientIp(request: Request): string | null {
  const direct = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-real-ip');
  if (direct?.trim()) return direct.trim().slice(0, 128);
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first ? first.slice(0, 128) : null;
}

export function constantTimeEqual(actual: string, expected: string): boolean {
  const actualBytes = new TextEncoder().encode(actual);
  const expectedBytes = new TextEncoder().encode(expected);
  let difference = actualBytes.length ^ expectedBytes.length;
  const length = Math.max(actualBytes.length, expectedBytes.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (actualBytes[index] ?? 0) ^ (expectedBytes[index] ?? 0);
  }
  return difference === 0;
}

function allowedOrigin(origin: string): boolean {
  if (FIXED_ORIGINS.has(origin)) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(origin);
}

function corsHeaders(origin: string): HeadersInit {
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-max-age': '86400',
    'cache-control': 'no-store',
    vary: 'Origin',
  };
}

function jsonResponse(
  origin: string,
  status: number,
  body: Record<string, unknown>,
): Response {
  return Response.json(body, { status, headers: corsHeaders(origin) });
}

function isBotPayload(body: Record<string, unknown>, now: number): boolean {
  if (!isRecord(body.payload)) return false;
  const honeypot = body.payload.honeypot;
  if (typeof honeypot === 'string' && honeypot.trim()) return true;
  const startedAt = body.payload.startedAt;
  return typeof startedAt === 'number' && Number.isFinite(startedAt) && now - startedAt < MIN_COMPLETION_MS;
}

function validFinalizeBody(body: Record<string, unknown>): body is Record<string, unknown> & {
  submissionId: string;
  completionToken: string;
} {
  return typeof body.submissionId === 'string' &&
    UUID_PATTERN.test(body.submissionId) &&
    typeof body.completionToken === 'string' &&
    body.completionToken.length >= 8 &&
    body.completionToken.length <= 256;
}

export function createFeedbackHandler(
  dependencies: FeedbackDependencies,
): (request: Request) => Promise<Response> {
  return async (request) => {
    const origin = request.headers.get('origin') ?? '';
    if (!allowedOrigin(origin)) {
      return Response.json({ ok: false, code: 'origin_not_allowed' }, { status: 403 });
    }
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== 'POST') return jsonResponse(origin, 405, { ok: false, code: 'method_not_allowed' });

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return jsonResponse(origin, 400, { ok: false, code: 'invalid_submission' });
    }
    if (!isRecord(rawBody) || typeof rawBody.action !== 'string') {
      return jsonResponse(origin, 400, { ok: false, code: 'invalid_submission' });
    }

    try {
      if (rawBody.action === 'begin') {
        if (isBotPayload(rawBody, dependencies.now())) {
          return jsonResponse(origin, 202, { ok: true, accepted: true });
        }
        const payloadResult = validateBeginPayload(rawBody.payload);
        const fileResult = validateFiles(rawBody.files);
        if (!payloadResult.ok || !fileResult.ok) {
          return jsonResponse(origin, 400, {
            ok: false,
            code: 'invalid_submission',
            errors: [
              ...(payloadResult.ok ? [] : payloadResult.errors),
              ...(fileResult.ok ? [] : fileResult.errors),
            ],
          });
        }

        const clientIp = extractClientIp(request);
        const ipHash = clientIp ? await dependencies.hashIp(clientIp) : null;
        if (ipHash && await dependencies.countRecentSubmissions(ipHash) >= RATE_LIMIT_PER_HOUR) {
          return jsonResponse(origin, 429, { ok: false, code: 'rate_limited' });
        }
        const result = await dependencies.beginSubmission({
          payload: payloadResult.value,
          files: fileResult.value,
          ipHash,
          userAgent: request.headers.get('user-agent')?.slice(0, 512) ?? null,
        });
        return jsonResponse(origin, 201, { ok: true, ...result });
      }

      if (rawBody.action === 'finalize') {
        if (!validFinalizeBody(rawBody)) {
          return jsonResponse(origin, 400, { ok: false, code: 'invalid_submission' });
        }
        const result = await dependencies.finalizeSubmission({
          submissionId: rawBody.submissionId,
          completionToken: rawBody.completionToken,
        });
        if (result.kind === 'not_found') {
          return jsonResponse(origin, 404, { ok: false, code: 'submission_not_found' });
        }
        const status = result.kind === 'complete' ? 'complete' : 'complete_with_upload_errors';
        return jsonResponse(origin, 200, {
          ok: true,
          status,
          uploaded: result.uploaded,
          missingClientIds: result.missingClientIds,
        });
      }

      return jsonResponse(origin, 400, { ok: false, code: 'invalid_submission' });
    } catch {
      return jsonResponse(origin, 503, { ok: false, code: 'temporarily_unavailable' });
    }
  };
}
