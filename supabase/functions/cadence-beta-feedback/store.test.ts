import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createFeedbackDependencies,
  mimeExtension,
  normalizeStorageObject,
  sha256Hex,
  type FeedbackPersistence,
  type FeedbackResponseRow,
  type FeedbackUploadRow,
  type StoredEvidenceObject,
} from './store.ts';
import type { BeginSubmissionInput } from './handler.ts';

const NOW = Date.parse('2026-09-07T14:00:00.000Z');
const RESPONSE_ID = '11111111-1111-4111-8111-111111111111';
const UPLOAD_ID = '22222222-2222-4222-8222-222222222222';

function input(withFiles = true): BeginSubmissionInput {
  return {
    payload: {
      startedAt: NOW - 60_000,
      honeypot: '',
      name: 'Test Artist',
      email: 'artist@example.com',
      wantsLifetimeAccess: true,
      platform: 'iPhone',
      musicalIdentity: 'Songwriter',
      language: 'English',
      navigationScore: 9,
      answers: { cadenceSession: 'Drafted a verse.' },
      consentResearch: true,
      consentFollowup: false,
      invitationToken: 'invite-token',
      referrer: 'https://mail.example/',
      utm: { source: 'resend', medium: 'email', campaign: 'september-beta' },
    },
    files: withFiles
      ? [{ clientId: 'file-1', name: 'screen.mov', type: 'video/quicktime', size: 1_024 }]
      : [],
    ipHash: 'ip-hash',
    userAgent: 'Test browser',
  };
}

interface PersistenceState {
  operations: string[];
  responseRows: FeedbackResponseRow[];
  uploadRows: FeedbackUploadRow[];
  responseForFinalize: { completionTokenHash: string | null } | null;
  uploadsForFinalize: FeedbackUploadRow[];
  objects: StoredEvidenceObject[];
  responseUpdates: Array<{ id: string; values: Record<string, unknown> }>;
  uploadUpdates: Array<{ id: string; values: Record<string, unknown> }>;
}

function persistence(overrides: Partial<FeedbackPersistence> = {}) {
  const state: PersistenceState = {
    operations: [],
    responseRows: [],
    uploadRows: [],
    responseForFinalize: null,
    uploadsForFinalize: [],
    objects: [],
    responseUpdates: [],
    uploadUpdates: [],
  };
  const adapter: FeedbackPersistence = {
    countRecentSubmissions: async () => 0,
    insertResponse: async (row) => {
      state.operations.push('insert-response');
      state.responseRows.push(row);
    },
    insertUploads: async (rows) => {
      state.operations.push('insert-uploads');
      state.uploadRows.push(...rows);
    },
    createSignedUpload: async (path) => {
      state.operations.push(`sign:${path}`);
      return 'signed-token';
    },
    getResponseForFinalize: async () => state.responseForFinalize,
    listUploads: async () => state.uploadsForFinalize,
    listStoredObjects: async () => state.objects,
    updateUpload: async (id, values) => {
      state.uploadUpdates.push({ id, values });
    },
    updateResponse: async (id, values) => {
      state.responseUpdates.push({ id, values });
    },
    ...overrides,
  };
  return { state, adapter };
}

function deterministicOptions() {
  const ids = [RESPONSE_ID, UPLOAD_ID];
  return {
    ipSalt: 'server-only-salt',
    now: () => NOW,
    randomUuid: () => ids.shift() ?? '33333333-3333-4333-8333-333333333333',
    randomToken: () => 'completion-token',
  };
}

test('MIME types map to server-selected extensions', () => {
  assert.equal(mimeExtension('image/jpeg'), 'jpg');
  assert.equal(mimeExtension('video/quicktime'), 'mov');
  assert.equal(mimeExtension('video/webm'), 'webm');
  assert.throws(() => mimeExtension('application/pdf'), /unsupported evidence type/);
});

test('SHA-256 hashing is deterministic and hexadecimal', async () => {
  assert.equal(
    await sha256Hex('test'),
    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  );
});

test('Supabase object metadata is normalized without trusting missing fields', () => {
  assert.deepEqual(normalizeStorageObject({
    name: `${UPLOAD_ID}.mov`,
    metadata: { size: 1_024, mimetype: 'video/quicktime', eTag: 'etag-1' },
  }), {
    name: `${UPLOAD_ID}.mov`,
    size: 1_024,
    contentType: 'video/quicktime',
    etag: 'etag-1',
  });
  assert.equal(normalizeStorageObject({ name: 'folder', metadata: null }), null);
});

test('a no-file submission is complete as soon as its answers are stored', async () => {
  const { state, adapter } = persistence();
  const dependencies = createFeedbackDependencies(adapter, deterministicOptions());

  const result = await dependencies.beginSubmission(input(false));

  assert.equal(result.submissionId, RESPONSE_ID);
  assert.equal(result.completionToken, null);
  assert.deepEqual(result.uploads, []);
  assert.equal(state.responseRows[0].status, 'complete');
  assert.equal(state.responseRows[0].completed_at, '2026-09-07T14:00:00.000Z');
  assert.deepEqual(state.operations, ['insert-response']);
});

test('the production UUID generator remains bound to Web Crypto', async () => {
  const { state, adapter } = persistence();
  const dependencies = createFeedbackDependencies(adapter, {
    ipSalt: 'server-only-salt',
    now: () => NOW,
  });

  const result = await dependencies.beginSubmission(input(false));

  assert.match(result.submissionId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  assert.equal(state.responseRows[0].id, result.submissionId);
});

test('answers are persisted before any upload token is issued', async () => {
  const { state, adapter } = persistence();
  const dependencies = createFeedbackDependencies(adapter, deterministicOptions());

  const result = await dependencies.beginSubmission(input(true));

  assert.deepEqual(state.operations, [
    'insert-response',
    'insert-uploads',
    `sign:${RESPONSE_ID}/${UPLOAD_ID}.mov`,
  ]);
  assert.deepEqual(result.uploads, [{
    clientId: 'file-1',
    uploadId: UPLOAD_ID,
    path: `${RESPONSE_ID}/${UPLOAD_ID}.mov`,
    token: 'signed-token',
  }]);
});

test('begin maps identity, consent, provenance and hashes into the database row', async () => {
  const { state, adapter } = persistence();
  const dependencies = createFeedbackDependencies(adapter, deterministicOptions());

  await dependencies.beginSubmission(input(true));

  const row = state.responseRows[0];
  assert.equal(row.id, RESPONSE_ID);
  assert.equal(row.source, 'website_v1');
  assert.equal(row.status, 'awaiting_uploads');
  assert.equal(row.name, 'Test Artist');
  assert.equal(row.email, 'artist@example.com');
  assert.equal(row.platform, 'iPhone');
  assert.equal(row.navigation_score, 9);
  assert.equal(row.consent_research, true);
  assert.equal(row.consent_followup, false);
  assert.equal(row.ip_hash, 'ip-hash');
  assert.equal(row.user_agent, 'Test browser');
  assert.equal(row.referrer, 'https://mail.example/');
  assert.equal(row.utm_source, 'resend');
  assert.equal(row.client_started_at, '2026-09-07T13:59:00.000Z');
  assert.match(row.invitation_token_hash ?? '', /^[0-9a-f]{64}$/);
  assert.match(row.completion_token_hash ?? '', /^[0-9a-f]{64}$/);
  assert.deepEqual(row.answers, { cadenceSession: 'Drafted a verse.' });
});

test('upload metadata uses the generated path but retains the original filename', async () => {
  const { state, adapter } = persistence();
  const dependencies = createFeedbackDependencies(adapter, deterministicOptions());

  await dependencies.beginSubmission(input(true));

  assert.deepEqual(state.uploadRows, [{
    id: UPLOAD_ID,
    response_id: RESPONSE_ID,
    client_id: 'file-1',
    original_filename: 'screen.mov',
    storage_path: `${RESPONSE_ID}/${UPLOAD_ID}.mov`,
    content_type: 'video/quicktime',
    file_size_bytes: 1_024,
    status: 'pending',
  }]);
});

test('IP hashing is salted and purpose-separated', async () => {
  const { adapter } = persistence();
  const dependencies = createFeedbackDependencies(adapter, deterministicOptions());

  const hash = await dependencies.hashIp('203.0.113.8');

  assert.equal(hash, await sha256Hex('ip\0server-only-salt\0' + '203.0.113.8'));
  assert.notEqual(hash, await sha256Hex('203.0.113.8'));
});

test('finalize returns not-found for a missing response', async () => {
  const { adapter } = persistence();
  const dependencies = createFeedbackDependencies(adapter, deterministicOptions());

  const result = await dependencies.finalizeSubmission({
    submissionId: RESPONSE_ID,
    completionToken: 'completion-token',
  });

  assert.deepEqual(result, { kind: 'not_found' });
});

test('finalize rejects the wrong completion token without reading objects', async () => {
  let listCalls = 0;
  const { state, adapter } = persistence({
    listStoredObjects: async () => {
      listCalls += 1;
      return [];
    },
  });
  state.responseForFinalize = {
    completionTokenHash: await sha256Hex('complete\0server-only-salt\0correct-token'),
  };
  const dependencies = createFeedbackDependencies(adapter, deterministicOptions());

  const result = await dependencies.finalizeSubmission({
    submissionId: RESPONSE_ID,
    completionToken: 'wrong-token',
  });

  assert.deepEqual(result, { kind: 'not_found' });
  assert.equal(listCalls, 0);
});

test('finalize marks matching private objects uploaded and clears the token', async () => {
  const { state, adapter } = persistence();
  state.responseForFinalize = {
    completionTokenHash: await sha256Hex('complete\0server-only-salt\0completion-token'),
  };
  state.uploadsForFinalize = [{
    id: UPLOAD_ID,
    response_id: RESPONSE_ID,
    client_id: 'file-1',
    original_filename: 'screen.mov',
    storage_path: `${RESPONSE_ID}/${UPLOAD_ID}.mov`,
    content_type: 'video/quicktime',
    file_size_bytes: 1_024,
    status: 'pending',
  }];
  state.objects = [{
    name: `${UPLOAD_ID}.mov`,
    size: 1_024,
    contentType: 'video/quicktime',
    etag: 'etag-1',
  }];
  const dependencies = createFeedbackDependencies(adapter, deterministicOptions());

  const result = await dependencies.finalizeSubmission({
    submissionId: RESPONSE_ID,
    completionToken: 'completion-token',
  });

  assert.deepEqual(result, { kind: 'complete', uploaded: 1, missingClientIds: [] });
  assert.deepEqual(state.uploadUpdates, [{
    id: UPLOAD_ID,
    values: {
      status: 'uploaded',
      storage_etag: 'etag-1',
      uploaded_at: '2026-09-07T14:00:00.000Z',
    },
  }]);
  assert.deepEqual(state.responseUpdates, [{
    id: RESPONSE_ID,
    values: {
      status: 'complete',
      completed_at: '2026-09-07T14:00:00.000Z',
      completion_token_hash: null,
    },
  }]);
});

test('finalize keeps retry authority when an expected object is missing', async () => {
  const { state, adapter } = persistence();
  state.responseForFinalize = {
    completionTokenHash: await sha256Hex('complete\0server-only-salt\0completion-token'),
  };
  state.uploadsForFinalize = [{
    id: UPLOAD_ID,
    response_id: RESPONSE_ID,
    client_id: 'file-1',
    original_filename: 'screen.mov',
    storage_path: `${RESPONSE_ID}/${UPLOAD_ID}.mov`,
    content_type: 'video/quicktime',
    file_size_bytes: 1_024,
    status: 'pending',
  }];
  const dependencies = createFeedbackDependencies(adapter, deterministicOptions());

  const result = await dependencies.finalizeSubmission({
    submissionId: RESPONSE_ID,
    completionToken: 'completion-token',
  });

  assert.deepEqual(result, { kind: 'incomplete', uploaded: 0, missingClientIds: ['file-1'] });
  assert.deepEqual(state.uploadUpdates, [{
    id: UPLOAD_ID,
    values: { status: 'missing', storage_etag: null, uploaded_at: null },
  }]);
  assert.deepEqual(state.responseUpdates, [{
    id: RESPONSE_ID,
    values: {
      status: 'complete_with_upload_errors',
      completed_at: '2026-09-07T14:00:00.000Z',
    },
  }]);
});
