import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  constantTimeEqual,
  createFeedbackHandler,
  extractClientIp,
  validateBeginPayload,
  validateFiles,
  type FeedbackDependencies,
} from './handler.ts';

const PRODUCTION_ORIGIN = 'https://brandnamechanges.com';
const NOW = Date.parse('2026-09-07T14:00:00.000Z');

function validPayload() {
  return {
    startedAt: NOW - 120_000,
    honeypot: '',
    name: 'Test Artist',
    email: 'artist@example.com',
    wantsLifetimeAccess: true,
    platform: 'iPhone',
    musicalIdentity: 'Songwriter and producer',
    language: 'English',
    navigationScore: 8,
    answers: {
      currentProcess: 'Voice memo, lyric draft, then a demo.',
      creationFrequency: 'Daily',
      creationLocation: 'At home and while travelling',
      locationRestrictions: 'I cannot always open a laptop.',
      currentTools: 'Notes, Voice Memos and Ableton',
      cadenceSession: 'I imported a beat, drafted a verse and recorded two takes.',
      workflowImpact: 'The beat and lyrics stayed together.',
      friction: 'Loop handles took a moment to understand.',
      likedFeatures: 'Rhyme families and two-take recording.',
      dislikedFeatures: '',
      loopingFeedback: 'Useful once the loop was set.',
      rhymeFeedback: 'The near rhymes kept the verse moving.',
      missingFeatures: 'Markers on the beat timeline.',
      navigationReason: 'Most actions were where I expected.',
      bugs: 'None.',
      retentionTrigger: 'Fast access to every unfinished song.',
      replacementPotential: 'It could replace Notes and Voice Memos.',
      recommendationTrigger: 'One place for the whole writing session.',
      recommendationBlocker: 'I would need confidence in backups.',
      pricingMonthly: '5',
      pricingAnnual: '50',
      pricingLifetime: '100',
      pricingCurrency: 'GBP',
    },
    consentResearch: true,
    consentFollowup: true,
    invitationToken: 'invite-token',
    referrer: 'https://mail.example/',
    utm: {
      source: 'resend',
      medium: 'email',
      campaign: 'beta-feedback-september',
    },
  };
}

function validFiles() {
  return [
    {
      clientId: 'file-1',
      name: 'cadence-screen.png',
      type: 'image/png',
      size: 24_000,
    },
  ];
}

function dependencies(overrides: Partial<FeedbackDependencies> = {}): FeedbackDependencies {
  return {
    now: () => NOW,
    hashIp: async (value) => `hash:${value}`,
    countRecentSubmissions: async () => 0,
    beginSubmission: async () => ({
      submissionId: '11111111-1111-4111-8111-111111111111',
      completionToken: 'completion-token',
      uploads: [
        {
          clientId: 'file-1',
          uploadId: '22222222-2222-4222-8222-222222222222',
          path: '11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222.png',
          token: 'signed-upload-token',
        },
      ],
    }),
    finalizeSubmission: async () => ({
      kind: 'complete',
      uploaded: 1,
      missingClientIds: [],
    }),
    ...overrides,
  };
}

function beginRequest(body: unknown, origin = PRODUCTION_ORIGIN): Request {
  return new Request('https://example.supabase.co/functions/v1/cadence-beta-feedback', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin,
      'cf-connecting-ip': '203.0.113.8',
      'user-agent': 'Feedback test browser',
    },
    body: JSON.stringify({ action: 'begin', payload: body, files: validFiles() }),
  });
}

test('a complete begin payload is normalized', () => {
  const result = validateBeginPayload(validPayload());

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.email, 'artist@example.com');
  assert.equal(result.value.name, 'Test Artist');
  assert.equal(result.value.navigationScore, 8);
  assert.equal(result.value.answers.cadenceSession.includes('imported a beat'), true);
});

test('required actionable answers cannot be blank', () => {
  const payload = validPayload();
  payload.answers.friction = '   ';

  const result = validateBeginPayload(payload);

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(result.errors, [{ field: 'answers.friction', code: 'required' }]);
});

test('research consent must be affirmative', () => {
  const result = validateBeginPayload({ ...validPayload(), consentResearch: false });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(result.errors, [{ field: 'consentResearch', code: 'required' }]);
});

test('email addresses and navigation scores are bounded', () => {
  const result = validateBeginPayload({
    ...validPayload(),
    email: 'not-an-email',
    navigationScore: 11,
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(result.errors, [
    { field: 'email', code: 'invalid' },
    { field: 'navigationScore', code: 'invalid' },
  ]);
});

test('unexpected answer keys are rejected instead of stored', () => {
  const payload = validPayload();
  const answers = { ...payload.answers, arbitraryPrivateBlob: 'unexpected' };

  const result = validateBeginPayload({ ...payload, answers });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(result.errors, [{ field: 'answers.arbitraryPrivateBlob', code: 'unexpected' }]);
});

test('oversized answer content is rejected', () => {
  const payload = validPayload();
  payload.answers.cadenceSession = 'x'.repeat(8_001);

  const result = validateBeginPayload(payload);

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(result.errors, [{ field: 'answers.cadenceSession', code: 'too_long' }]);
});

test('valid evidence metadata is normalized', () => {
  const result = validateFiles(validFiles());

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.value, validFiles());
});

test('evidence file count is limited to three', () => {
  const files = Array.from({ length: 4 }, (_, index) => ({
    ...validFiles()[0],
    clientId: `file-${index}`,
  }));

  const result = validateFiles(files);

  assert.deepEqual(result, {
    ok: false,
    errors: [{ field: 'files', code: 'too_many' }],
  });
});

test('evidence MIME types are allowlisted', () => {
  const files = [{ ...validFiles()[0], type: 'application/pdf' }];

  const result = validateFiles(files);

  assert.deepEqual(result, {
    ok: false,
    errors: [{ field: 'files.file-1.type', code: 'unsupported' }],
  });
});

test('per-file and aggregate evidence sizes are enforced', () => {
  const oversized = validateFiles([{ ...validFiles()[0], size: 104_857_601 }]);
  const excessiveTotal = validateFiles([
    { ...validFiles()[0], clientId: 'file-1', size: 80 * 1024 * 1024 },
    { ...validFiles()[0], clientId: 'file-2', size: 80 * 1024 * 1024 },
    { ...validFiles()[0], clientId: 'file-3', size: 80 * 1024 * 1024 },
  ]);

  assert.deepEqual(oversized, {
    ok: false,
    errors: [{ field: 'files.file-1.size', code: 'too_large' }],
  });
  assert.deepEqual(excessiveTotal, {
    ok: false,
    errors: [{ field: 'files', code: 'total_too_large' }],
  });
});

test('client IP extraction prefers the trusted edge header', () => {
  const request = new Request('https://example.test', {
    headers: {
      'cf-connecting-ip': '203.0.113.9',
      'x-forwarded-for': '198.51.100.1, 198.51.100.2',
    },
  });

  assert.equal(extractClientIp(request), '203.0.113.9');
});

test('constant-time comparison handles equal and unequal lengths', () => {
  assert.equal(constantTimeEqual('same-token', 'same-token'), true);
  assert.equal(constantTimeEqual('short', 'longer-token'), false);
  assert.equal(constantTimeEqual('token-a', 'token-b'), false);
});

test('preflight returns the production origin and no credential access', async () => {
  const handler = createFeedbackHandler(dependencies());
  const response = await handler(new Request('https://example.test', {
    method: 'OPTIONS',
    headers: { origin: PRODUCTION_ORIGIN },
  }));

  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), PRODUCTION_ORIGIN);
  assert.equal(response.headers.get('access-control-allow-credentials'), null);
});

test('unapproved origins are rejected before persistence', async () => {
  let beginCalls = 0;
  const handler = createFeedbackHandler(dependencies({
    beginSubmission: async () => {
      beginCalls += 1;
      throw new Error('must not be called');
    },
  }));

  const response = await handler(beginRequest(validPayload(), 'https://attacker.example'));

  assert.equal(response.status, 403);
  assert.equal(beginCalls, 0);
});

test('non-POST methods are rejected', async () => {
  const handler = createFeedbackHandler(dependencies());
  const response = await handler(new Request('https://example.test', {
    method: 'GET',
    headers: { origin: PRODUCTION_ORIGIN },
  }));

  assert.equal(response.status, 405);
});

test('malformed JSON returns a stable public error', async () => {
  const handler = createFeedbackHandler(dependencies());
  const response = await handler(new Request('https://example.test', {
    method: 'POST',
    headers: { origin: PRODUCTION_ORIGIN, 'content-type': 'application/json' },
    body: '{broken',
  }));

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, code: 'invalid_submission' });
});

test('honeypot submissions are absorbed without persistence', async () => {
  let beginCalls = 0;
  const handler = createFeedbackHandler(dependencies({
    beginSubmission: async () => {
      beginCalls += 1;
      throw new Error('must not be called');
    },
  }));
  const response = await handler(beginRequest({ ...validPayload(), honeypot: 'spam' }));

  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { ok: true, accepted: true });
  assert.equal(beginCalls, 0);
});

test('impossibly fast submissions are absorbed without persistence', async () => {
  let beginCalls = 0;
  const handler = createFeedbackHandler(dependencies({
    beginSubmission: async () => {
      beginCalls += 1;
      throw new Error('must not be called');
    },
  }));
  const response = await handler(beginRequest({ ...validPayload(), startedAt: NOW - 2_000 }));

  assert.equal(response.status, 202);
  assert.equal(beginCalls, 0);
});

test('the sixth submission from an IP within one hour is throttled', async () => {
  const handler = createFeedbackHandler(dependencies({
    countRecentSubmissions: async () => 5,
  }));
  const response = await handler(beginRequest(validPayload()));

  assert.equal(response.status, 429);
  assert.deepEqual(await response.json(), { ok: false, code: 'rate_limited' });
});

test('begin stores normalized answers and returns upload instructions', async () => {
  let captured: unknown;
  const handler = createFeedbackHandler(dependencies({
    beginSubmission: async (input) => {
      captured = input;
      return dependencies().beginSubmission(input);
    },
  }));
  const response = await handler(beginRequest(validPayload()));
  const expectedNormalized = validateBeginPayload(validPayload());

  assert.equal(response.status, 201);
  assert.equal(response.headers.get('access-control-allow-origin'), PRODUCTION_ORIGIN);
  assert.deepEqual(await response.json(), {
    ok: true,
    submissionId: '11111111-1111-4111-8111-111111111111',
    completionToken: 'completion-token',
    uploads: [
      {
        clientId: 'file-1',
        uploadId: '22222222-2222-4222-8222-222222222222',
        path: '11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222.png',
        token: 'signed-upload-token',
      },
    ],
  });
  assert.equal(expectedNormalized.ok, true);
  if (!expectedNormalized.ok) return;
  assert.deepEqual(captured, {
    payload: expectedNormalized.value,
    files: validFiles(),
    ipHash: 'hash:203.0.113.8',
    userAgent: 'Feedback test browser',
  });
});

test('provider failures never expose their private message', async () => {
  const handler = createFeedbackHandler(dependencies({
    beginSubmission: async () => {
      throw new Error('database host and secret detail');
    },
  }));
  const response = await handler(beginRequest(validPayload()));

  assert.equal(response.status, 503);
  const responseText = await response.text();
  assert.deepEqual(JSON.parse(responseText), { ok: false, code: 'temporarily_unavailable' });
  assert.equal(responseText.includes('database host'), false);
});

test('finalize forwards only bounded identifiers and returns completion', async () => {
  let captured: unknown;
  const handler = createFeedbackHandler(dependencies({
    finalizeSubmission: async (input) => {
      captured = input;
      return { kind: 'complete', uploaded: 1, missingClientIds: [] };
    },
  }));
  const response = await handler(new Request('https://example.test', {
    method: 'POST',
    headers: { origin: PRODUCTION_ORIGIN, 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'finalize',
      submissionId: '11111111-1111-4111-8111-111111111111',
      completionToken: 'completion-token',
    }),
  }));

  assert.equal(response.status, 200);
  assert.deepEqual(captured, {
    submissionId: '11111111-1111-4111-8111-111111111111',
    completionToken: 'completion-token',
  });
  assert.deepEqual(await response.json(), {
    ok: true,
    status: 'complete',
    uploaded: 1,
    missingClientIds: [],
  });
});

test('invalid finalize credentials use a non-enumerating response', async () => {
  const handler = createFeedbackHandler(dependencies({
    finalizeSubmission: async () => ({ kind: 'not_found' }),
  }));
  const response = await handler(new Request('https://example.test', {
    method: 'POST',
    headers: { origin: PRODUCTION_ORIGIN, 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'finalize',
      submissionId: '11111111-1111-4111-8111-111111111111',
      completionToken: 'wrong-token',
    }),
  }));

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { ok: false, code: 'submission_not_found' });
});

test('missing uploaded objects preserve the response and report bounded client IDs', async () => {
  const handler = createFeedbackHandler(dependencies({
    finalizeSubmission: async () => ({
      kind: 'incomplete',
      uploaded: 0,
      missingClientIds: ['file-1'],
    }),
  }));
  const response = await handler(new Request('https://example.test', {
    method: 'POST',
    headers: { origin: PRODUCTION_ORIGIN, 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'finalize',
      submissionId: '11111111-1111-4111-8111-111111111111',
      completionToken: 'completion-token',
    }),
  }));

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    status: 'complete_with_upload_errors',
    uploaded: 0,
    missingClientIds: ['file-1'],
  });
});
