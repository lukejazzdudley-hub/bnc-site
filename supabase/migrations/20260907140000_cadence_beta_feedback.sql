-- Cadence beta feedback storage contract.
-- Client roles have no direct access; the Edge Function writes with service_role.

begin;

create table if not exists public.cadence_beta_feedback_responses (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'website_v1'
    check (source ~ '^[a-z0-9_]{1,64}$'),
  schema_version smallint not null default 1
    check (schema_version between 1 and 100),
  status text not null default 'received'
    check (status in (
      'received',
      'awaiting_uploads',
      'complete',
      'complete_with_upload_errors',
      'imported'
    )),

  name text not null check (char_length(name) between 1 and 160),
  email text not null check (char_length(email) between 3 and 320),
  wants_lifetime_access boolean not null default false,
  platform text not null check (char_length(platform) between 1 and 40),
  musical_identity text not null check (char_length(musical_identity) between 1 and 500),
  language text not null check (char_length(language) between 1 and 80),
  navigation_score smallint check (navigation_score between 1 and 10),
  answers jsonb not null default '{}'::jsonb
    check (jsonb_typeof(answers) = 'object'),

  consent_research boolean not null default false,
  consent_followup boolean not null default false,
  client_started_at timestamptz,
  submitted_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  invitation_token_hash text check (
    invitation_token_hash is null or char_length(invitation_token_hash) = 64
  ),
  completion_token_hash text check (
    completion_token_hash is null or char_length(completion_token_hash) = 64
  ),
  ip_hash text check (ip_hash is null or char_length(ip_hash) = 64),
  user_agent text check (user_agent is null or char_length(user_agent) <= 512),
  referrer text check (referrer is null or char_length(referrer) <= 2048),
  utm_source text check (utm_source is null or char_length(utm_source) <= 120),
  utm_medium text check (utm_medium is null or char_length(utm_medium) <= 120),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 120),

  original_submitted_at timestamptz,
  legacy_payload jsonb check (
    legacy_payload is null or jsonb_typeof(legacy_payload) = 'object'
  ),
  legacy_row_hash text unique check (
    legacy_row_hash is null or char_length(legacy_row_hash) = 64
  )
);

create table if not exists public.cadence_beta_feedback_uploads (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null
    references public.cadence_beta_feedback_responses (id) on delete cascade,
  original_filename text not null
    check (char_length(original_filename) between 1 and 255),
  storage_path text not null check (char_length(storage_path) between 10 and 500),
  content_type text not null check (content_type in (
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/heic',
    'image/heif',
    'video/mp4',
    'video/quicktime',
    'video/webm'
  )),
  file_size_bytes bigint not null check (file_size_bytes between 1 and 104857600),
  status text not null default 'pending'
    check (status in ('pending', 'uploaded', 'missing')),
  storage_etag text check (storage_etag is null or char_length(storage_etag) <= 255),
  created_at timestamptz not null default now(),
  uploaded_at timestamptz,
  unique (response_id, storage_path)
);

create index if not exists cadence_beta_feedback_responses_ip_submitted_idx
  on public.cadence_beta_feedback_responses (ip_hash, submitted_at desc);
create index if not exists cadence_beta_feedback_responses_submitted_idx
  on public.cadence_beta_feedback_responses (submitted_at desc);
create index if not exists cadence_beta_feedback_responses_email_idx
  on public.cadence_beta_feedback_responses (lower(email));
create index if not exists cadence_beta_feedback_uploads_response_idx
  on public.cadence_beta_feedback_uploads (response_id, created_at);

create or replace function public.set_cadence_beta_feedback_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cadence_beta_feedback_updated_at
  on public.cadence_beta_feedback_responses;
create trigger cadence_beta_feedback_updated_at
before update on public.cadence_beta_feedback_responses
for each row execute function public.set_cadence_beta_feedback_updated_at();

alter table public.cadence_beta_feedback_responses enable row level security;
alter table public.cadence_beta_feedback_responses force row level security;
alter table public.cadence_beta_feedback_uploads enable row level security;
alter table public.cadence_beta_feedback_uploads force row level security;

revoke all on table public.cadence_beta_feedback_responses from anon, authenticated;
revoke all on table public.cadence_beta_feedback_uploads from anon, authenticated;
grant select, insert, update, delete on table public.cadence_beta_feedback_responses to service_role;
grant select, insert, update, delete on table public.cadence_beta_feedback_uploads to service_role;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'cadence-feedback-evidence',
  'cadence-feedback-evidence',
  false,
  104857600,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/heic',
    'image/heif',
    'video/mp4',
    'video/quicktime',
    'video/webm'
  ]::text[]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = 104857600,
  allowed_mime_types = excluded.allowed_mime_types;

commit;
