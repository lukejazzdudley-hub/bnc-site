import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  createFeedbackHandler,
  type FeedbackDependencies,
} from './handler.ts';
import {
  createFeedbackDependencies,
  normalizeStorageObject,
  type FeedbackPersistence,
  type FeedbackResponseRow,
  type FeedbackUploadRow,
} from './store.ts';

const RESPONSE_TABLE = 'cadence_beta_feedback_responses';
const UPLOAD_TABLE = 'cadence_beta_feedback_uploads';
const EVIDENCE_BUCKET = 'cadence-feedback-evidence';

function fail(code: string): never {
  throw new Error(code);
}

function unavailableDependencies(): FeedbackDependencies {
  const unavailable = async (): Promise<never> => fail('feedback_configuration_unavailable');
  return {
    now: Date.now,
    hashIp: unavailable,
    countRecentSubmissions: unavailable,
    beginSubmission: unavailable,
    finalizeSubmission: unavailable,
  };
}

function buildPersistence(): { persistence: FeedbackPersistence; ipSalt: string } | null {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const ipSalt = Deno.env.get('FEEDBACK_IP_SALT') ?? '';
  if (!supabaseUrl || !serviceRoleKey || !ipSalt) return null;

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const persistence: FeedbackPersistence = {
    async countRecentSubmissions(ipHash, since) {
      const { count, error } = await admin
        .from(RESPONSE_TABLE)
        .select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('submitted_at', since);
      if (error) fail('feedback_rate_limit_read_failed');
      return count ?? 0;
    },

    async insertResponse(row: FeedbackResponseRow) {
      const { error } = await admin.from(RESPONSE_TABLE).insert(row);
      if (error) fail('feedback_response_insert_failed');
    },

    async insertUploads(rows: FeedbackUploadRow[]) {
      if (!rows.length) return;
      const { error } = await admin.from(UPLOAD_TABLE).insert(rows);
      if (error) fail('feedback_upload_rows_insert_failed');
    },

    async createSignedUpload(path) {
      const { data, error } = await admin.storage
        .from(EVIDENCE_BUCKET)
        .createSignedUploadUrl(path, { upsert: false });
      if (error || !data) fail('feedback_upload_sign_failed');
      const token = data.token ?? new URL(data.signedUrl).searchParams.get('token');
      if (!token) fail('feedback_upload_token_missing');
      return token;
    },

    async getResponseForFinalize(responseId) {
      const { data, error } = await admin
        .from(RESPONSE_TABLE)
        .select('completion_token_hash')
        .eq('id', responseId)
        .maybeSingle();
      if (error) fail('feedback_response_read_failed');
      if (!data) return null;
      return {
        completionTokenHash: typeof data.completion_token_hash === 'string'
          ? data.completion_token_hash
          : null,
      };
    },

    async listUploads(responseId) {
      const { data, error } = await admin
        .from(UPLOAD_TABLE)
        .select('id,response_id,client_id,original_filename,storage_path,content_type,file_size_bytes,status')
        .eq('response_id', responseId)
        .order('created_at', { ascending: true });
      if (error) fail('feedback_upload_rows_read_failed');
      return (data ?? []) as FeedbackUploadRow[];
    },

    async listStoredObjects(responseId) {
      const { data, error } = await admin.storage
        .from(EVIDENCE_BUCKET)
        .list(responseId, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });
      if (error) fail('feedback_storage_list_failed');
      return (data ?? []).flatMap((item) => {
        const normalized = normalizeStorageObject(item);
        return normalized ? [normalized] : [];
      });
    },

    async updateUpload(id, values) {
      const { error } = await admin.from(UPLOAD_TABLE).update(values).eq('id', id);
      if (error) fail('feedback_upload_row_update_failed');
    },

    async updateResponse(id, values) {
      const { error } = await admin.from(RESPONSE_TABLE).update(values).eq('id', id);
      if (error) fail('feedback_response_update_failed');
    },
  };
  return { persistence, ipSalt };
}

const configured = buildPersistence();
const dependencies = configured
  ? createFeedbackDependencies(configured.persistence, { ipSalt: configured.ipSalt })
  : unavailableDependencies();

Deno.serve(createFeedbackHandler(dependencies));
