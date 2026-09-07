export class FeedbackApiError extends Error {
  constructor(code, status) {
    super(code);
    this.name = 'FeedbackApiError';
    this.code = code;
    this.status = status;
  }
}

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(String(value));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function encodeTusMetadata(metadata) {
  return Object.entries(metadata)
    .map(([key, value]) => `${key} ${encodeBase64(value)}`)
    .join(',');
}

async function callFeedbackApi(fetchImpl, url, body) {
  let response;
  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  } catch {
    throw new FeedbackApiError('temporarily_unavailable', 0);
  }

  let result = {};
  try {
    result = await response.json();
  } catch {
    // The public error contract must remain stable even if an upstream proxy
    // returns HTML or an empty response.
  }

  if (!response.ok || result.ok !== true) {
    throw new FeedbackApiError(result.code || 'temporarily_unavailable', response.status);
  }

  return result;
}

export function beginSubmission(fetchImpl, url, payload, files) {
  return callFeedbackApi(fetchImpl, url, {
    action: 'begin',
    payload,
    files,
  });
}

const DEFAULT_CHUNK_SIZE = 6 * 1024 * 1024;
const RETRY_DELAYS_MS = [0, 500, 1500, 3000];

function isTransientStatus(status) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

async function patchChunk(fetchImpl, uploadUrl, token, offset, chunk, sleep) {
  let lastStatus = 0;

  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt += 1) {
    if (RETRY_DELAYS_MS[attempt] > 0) await sleep(RETRY_DELAYS_MS[attempt]);

    try {
      const response = await fetchImpl(uploadUrl, {
        method: 'PATCH',
        headers: {
          'Tus-Resumable': '1.0.0',
          'Upload-Offset': String(offset),
          'Content-Type': 'application/offset+octet-stream',
          'x-signature': token,
        },
        body: chunk,
      });

      if (response.status === 204) return response;
      lastStatus = response.status;
      if (!isTransientStatus(response.status)) break;
    } catch {
      lastStatus = 0;
    }
  }

  throw new FeedbackApiError('upload_failed', lastStatus);
}

export async function uploadTus(fetchImpl, options) {
  const {
    endpoint,
    bucketName,
    path,
    token,
    file,
    chunkSize = DEFAULT_CHUNK_SIZE,
    onProgress = () => {},
    sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
  } = options;

  let createResponse;
  try {
    createResponse = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Tus-Resumable': '1.0.0',
        'Upload-Length': String(file.size),
        'Upload-Metadata': encodeTusMetadata({
          bucketName,
          objectName: path,
          contentType: file.type,
          cacheControl: '0',
        }),
        'x-signature': token,
      },
    });
  } catch {
    throw new FeedbackApiError('upload_failed', 0);
  }

  if (createResponse.status !== 201) {
    throw new FeedbackApiError('upload_failed', createResponse.status);
  }

  const location = createResponse.headers.get('location');
  if (!location) throw new FeedbackApiError('upload_failed', 502);
  const uploadUrl = new URL(location, endpoint).href;

  let offset = 0;
  while (offset < file.size) {
    const chunk = file.slice(offset, Math.min(offset + chunkSize, file.size));
    const response = await patchChunk(fetchImpl, uploadUrl, token, offset, chunk, sleep);
    const nextOffset = Number(response.headers.get('upload-offset'));

    if (!Number.isInteger(nextOffset) || nextOffset <= offset || nextOffset > file.size) {
      throw new FeedbackApiError('upload_failed', 502);
    }

    offset = nextOffset;
    onProgress(offset, file.size);
  }
}

export function finalizeSubmission(fetchImpl, url, submissionId, completionToken) {
  return callFeedbackApi(fetchImpl, url, {
    action: 'finalize',
    submissionId,
    completionToken,
  });
}
