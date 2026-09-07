import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FeedbackApiError,
  beginSubmission,
  encodeTusMetadata,
  finalizeSubmission,
  uploadTus,
} from '../cadence/feedback/api-client.js';

const FUNCTION_URL = 'https://project.supabase.co/functions/v1/cadence-beta-feedback';
const TUS_URL = 'https://project.storage.supabase.co/storage/v1/upload/resumable';

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

test('TUS metadata is encoded as key/base64 pairs', () => {
  const encoded = encodeTusMetadata({
    bucketName: 'cadence-feedback-evidence',
    objectName: 'response/file.png',
    contentType: 'image/png',
  });

  assert.equal(
    encoded,
    'bucketName Y2FkZW5jZS1mZWVkYmFjay1ldmlkZW5jZQ==,' +
      'objectName cmVzcG9uc2UvZmlsZS5wbmc=,' +
      'contentType aW1hZ2UvcG5n',
  );
});

test('begin sends only the public intake contract', async () => {
  let requestBody;
  const fakeFetch = async (_url, init) => {
    requestBody = JSON.parse(init.body);
    return jsonResponse(201, {
      ok: true,
      submissionId: 'response-id',
      completionToken: null,
      uploads: [],
    });
  };

  const result = await beginSubmission(fakeFetch, FUNCTION_URL, { name: 'Artist' }, []);

  assert.deepEqual(requestBody, {
    action: 'begin',
    payload: { name: 'Artist' },
    files: [],
  });
  assert.equal(result.submissionId, 'response-id');
});

test('API failures retain a stable public code', async () => {
  const fakeFetch = async () => jsonResponse(429, { ok: false, code: 'rate_limited' });

  await assert.rejects(
    beginSubmission(fakeFetch, FUNCTION_URL, {}, []),
    (error) => error instanceof FeedbackApiError && error.code === 'rate_limited' && error.status === 429,
  );
});

test('signed TUS upload creates one resource and patches fixed-size chunks', async () => {
  const calls = [];
  const offsets = [4, 8, 10];
  const fakeFetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (init.method === 'POST') {
      return new Response(null, {
        status: 201,
        headers: { location: '/storage/v1/upload/resumable/upload-id' },
      });
    }
    return new Response(null, {
      status: 204,
      headers: { 'upload-offset': String(offsets.shift()) },
    });
  };
  const progress = [];
  const file = new File([new Uint8Array(10)], 'screen.png', { type: 'image/png' });

  await uploadTus(fakeFetch, {
    endpoint: TUS_URL,
    bucketName: 'cadence-feedback-evidence',
    path: 'response/file.png',
    token: 'signed-token',
    file,
    chunkSize: 4,
    onProgress: (uploaded, total) => progress.push([uploaded, total]),
    sleep: async () => {},
  });

  assert.equal(calls.length, 4);
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['Tus-Resumable'], '1.0.0');
  assert.equal(calls[0].init.headers['Upload-Length'], '10');
  assert.equal(calls[0].init.headers['x-signature'], 'signed-token');
  assert.equal(calls[1].init.headers['Upload-Offset'], '0');
  assert.equal(calls[2].init.headers['Upload-Offset'], '4');
  assert.equal(calls[3].init.headers['Upload-Offset'], '8');
  assert.deepEqual(calls.slice(1).map((call) => call.init.body.size), [4, 4, 2]);
  assert.deepEqual(progress, [[4, 10], [8, 10], [10, 10]]);
});

test('transient TUS patch failures retry the same offset', async () => {
  let patchCalls = 0;
  const seenOffsets = [];
  const fakeFetch = async (_url, init) => {
    if (init.method === 'POST') {
      return new Response(null, { status: 201, headers: { location: TUS_URL + '/upload-id' } });
    }
    patchCalls += 1;
    seenOffsets.push(init.headers['Upload-Offset']);
    if (patchCalls === 1) return new Response(null, { status: 503 });
    return new Response(null, { status: 204, headers: { 'upload-offset': '4' } });
  };

  await uploadTus(fakeFetch, {
    endpoint: TUS_URL,
    bucketName: 'cadence-feedback-evidence',
    path: 'response/file.png',
    token: 'signed-token',
    file: new File([new Uint8Array(4)], 'screen.png', { type: 'image/png' }),
    chunkSize: 4,
    onProgress: () => {},
    sleep: async () => {},
  });

  assert.equal(patchCalls, 2);
  assert.deepEqual(seenOffsets, ['0', '0']);
});

test('finalize returns incomplete upload IDs without discarding the response', async () => {
  let requestBody;
  const fakeFetch = async (_url, init) => {
    requestBody = JSON.parse(init.body);
    return jsonResponse(200, {
      ok: true,
      status: 'complete_with_upload_errors',
      uploaded: 1,
      missingClientIds: ['file-2'],
    });
  };

  const result = await finalizeSubmission(
    fakeFetch,
    FUNCTION_URL,
    '11111111-1111-4111-8111-111111111111',
    'completion-token',
  );

  assert.deepEqual(requestBody, {
    action: 'finalize',
    submissionId: '11111111-1111-4111-8111-111111111111',
    completionToken: 'completion-token',
  });
  assert.deepEqual(result.missingClientIds, ['file-2']);
});
