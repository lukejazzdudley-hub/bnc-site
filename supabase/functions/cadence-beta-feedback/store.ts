import {
  constantTimeEqual,
  type BeginSubmissionInput,
  type FeedbackDependencies,
} from './handler.ts';

export interface FeedbackResponseRow {
  id: string;
  source: string;
  schema_version: number;
  status: string;
  name: string;
  email: string;
  wants_lifetime_access: boolean;
  platform: string;
  musical_identity: string;
  language: string;
  navigation_score: number;
  answers: Record<string, string>;
  consent_research: boolean;
  consent_followup: boolean;
  client_started_at: string;
  submitted_at: string;
  completed_at: string | null;
  invitation_token_hash: string | null;
  completion_token_hash: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

export interface FeedbackUploadRow {
  id: string;
  response_id: string;
  client_id: string;
  original_filename: string;
  storage_path: string;
  content_type: string;
  file_size_bytes: number;
  status: string;
}

export interface StoredEvidenceObject {
  name: string;
  size: number;
  contentType: string | null;
  etag: string | null;
}

export interface FeedbackPersistence {
  countRecentSubmissions: (ipHash: string, since: string) => Promise<number>;
  insertResponse: (row: FeedbackResponseRow) => Promise<void>;
  insertUploads: (rows: FeedbackUploadRow[]) => Promise<void>;
  createSignedUpload: (path: string) => Promise<string>;
  getResponseForFinalize: (
    responseId: string,
  ) => Promise<{ completionTokenHash: string | null } | null>;
  listUploads: (responseId: string) => Promise<FeedbackUploadRow[]>;
  listStoredObjects: (responseId: string) => Promise<StoredEvidenceObject[]>;
  updateUpload: (id: string, values: Record<string, unknown>) => Promise<void>;
  updateResponse: (id: string, values: Record<string, unknown>) => Promise<void>;
}

export interface FeedbackDependencyOptions {
  ipSalt: string;
  now?: () => number;
  randomUuid?: () => string;
  randomToken?: () => string;
}

const MIME_EXTENSIONS: Readonly<Record<string, string>> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
};

export function mimeExtension(mimeType: string): string {
  const extension = MIME_EXTENSIONS[mimeType];
  if (!extension) throw new Error('unsupported evidence type');
  return extension;
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function normalizeStorageObject(value: unknown): StoredEvidenceObject | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.name !== 'string' || !record.name) return null;
  if (typeof record.metadata !== 'object' || record.metadata === null || Array.isArray(record.metadata)) {
    return null;
  }
  const metadata = record.metadata as Record<string, unknown>;
  if (typeof metadata.size !== 'number' || !Number.isFinite(metadata.size)) return null;
  const contentType = typeof metadata.mimetype === 'string'
    ? metadata.mimetype
    : typeof metadata.contentType === 'string'
    ? metadata.contentType
    : null;
  const etag = typeof metadata.eTag === 'string'
    ? metadata.eTag
    : typeof metadata.etag === 'string'
    ? metadata.etag
    : null;
  return { name: record.name, size: metadata.size, contentType, etag };
}

function secureRandomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function purposeHash(purpose: string, salt: string, value: string): Promise<string> {
  return sha256Hex(`${purpose}\0${salt}\0${value}`);
}

function responseRow(
  input: BeginSubmissionInput,
  responseId: string,
  nowIso: string,
  completionTokenHash: string | null,
  invitationTokenHash: string | null,
): FeedbackResponseRow {
  const payload = input.payload;
  const hasUploads = input.files.length > 0;
  return {
    id: responseId,
    source: 'website_v1',
    schema_version: 1,
    status: hasUploads ? 'awaiting_uploads' : 'complete',
    name: payload.name,
    email: payload.email,
    wants_lifetime_access: payload.wantsLifetimeAccess,
    platform: payload.platform,
    musical_identity: payload.musicalIdentity,
    language: payload.language,
    navigation_score: payload.navigationScore,
    answers: payload.answers,
    consent_research: payload.consentResearch,
    consent_followup: payload.consentFollowup,
    client_started_at: new Date(payload.startedAt).toISOString(),
    submitted_at: nowIso,
    completed_at: hasUploads ? null : nowIso,
    invitation_token_hash: invitationTokenHash,
    completion_token_hash: completionTokenHash,
    ip_hash: input.ipHash,
    user_agent: input.userAgent,
    referrer: payload.referrer,
    utm_source: payload.utm.source,
    utm_medium: payload.utm.medium,
    utm_campaign: payload.utm.campaign,
  };
}

export function createFeedbackDependencies(
  persistence: FeedbackPersistence,
  options: FeedbackDependencyOptions,
): FeedbackDependencies {
  if (!options.ipSalt) throw new Error('feedback IP salt is required');
  const now = options.now ?? Date.now;
  const randomUuid = options.randomUuid ?? crypto.randomUUID;
  const randomToken = options.randomToken ?? secureRandomToken;

  return {
    now,

    hashIp(value) {
      return purposeHash('ip', options.ipSalt, value);
    },

    countRecentSubmissions(ipHash) {
      const since = new Date(now() - 60 * 60 * 1_000).toISOString();
      return persistence.countRecentSubmissions(ipHash, since);
    },

    async beginSubmission(input) {
      const responseId = randomUuid();
      const nowIso = new Date(now()).toISOString();
      const completionToken = input.files.length ? randomToken() : null;
      const completionTokenHash = completionToken
        ? await purposeHash('complete', options.ipSalt, completionToken)
        : null;
      const invitationTokenHash = input.payload.invitationToken
        ? await purposeHash('invite', options.ipSalt, input.payload.invitationToken)
        : null;

      await persistence.insertResponse(responseRow(
        input,
        responseId,
        nowIso,
        completionTokenHash,
        invitationTokenHash,
      ));

      if (!input.files.length) {
        return { submissionId: responseId, completionToken: null, uploads: [] };
      }

      const rows: FeedbackUploadRow[] = input.files.map((file) => {
        const id = randomUuid();
        return {
          id,
          response_id: responseId,
          client_id: file.clientId,
          original_filename: file.name,
          storage_path: `${responseId}/${id}.${mimeExtension(file.type)}`,
          content_type: file.type,
          file_size_bytes: file.size,
          status: 'pending',
        };
      });
      await persistence.insertUploads(rows);

      const uploads = [];
      for (const row of rows) {
        const token = await persistence.createSignedUpload(row.storage_path);
        uploads.push({
          clientId: row.client_id,
          uploadId: row.id,
          path: row.storage_path,
          token,
        });
      }
      return { submissionId: responseId, completionToken, uploads };
    },

    async finalizeSubmission(input) {
      const response = await persistence.getResponseForFinalize(input.submissionId);
      if (!response?.completionTokenHash) return { kind: 'not_found' };
      const suppliedHash = await purposeHash('complete', options.ipSalt, input.completionToken);
      if (!constantTimeEqual(suppliedHash, response.completionTokenHash)) {
        return { kind: 'not_found' };
      }

      const [uploads, objects] = await Promise.all([
        persistence.listUploads(input.submissionId),
        persistence.listStoredObjects(input.submissionId),
      ]);
      const byName = new Map(objects.map((object) => [object.name, object]));
      const missingClientIds: string[] = [];
      let uploaded = 0;
      const nowIso = new Date(now()).toISOString();

      for (const upload of uploads) {
        const objectName = upload.storage_path.split('/').at(-1) ?? '';
        const object = byName.get(objectName);
        const matches = object?.size === upload.file_size_bytes &&
          object.contentType === upload.content_type;
        if (matches && object) {
          uploaded += 1;
          await persistence.updateUpload(upload.id, {
            status: 'uploaded',
            storage_etag: object.etag,
            uploaded_at: nowIso,
          });
        } else {
          missingClientIds.push(upload.client_id);
          await persistence.updateUpload(upload.id, {
            status: 'missing',
            storage_etag: null,
            uploaded_at: null,
          });
        }
      }

      if (!missingClientIds.length) {
        await persistence.updateResponse(input.submissionId, {
          status: 'complete',
          completed_at: nowIso,
          completion_token_hash: null,
        });
        return { kind: 'complete', uploaded, missingClientIds };
      }

      await persistence.updateResponse(input.submissionId, {
        status: 'complete_with_upload_errors',
        completed_at: nowIso,
      });
      return { kind: 'incomplete', uploaded, missingClientIds };
    },
  };
}
