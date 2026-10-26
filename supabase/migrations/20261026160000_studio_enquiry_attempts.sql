-- Abuse counters only. Enquiry content is sent by email, never stored here.
create table public.studio_enquiry_attempts (
 bucket text primary key check (bucket ~ '^[a-f0-9]{64}$'),
 attempts integer not null default 1,
 created_at timestamptz not null default now()
);
alter table public.studio_enquiry_attempts enable row level security;
revoke all on public.studio_enquiry_attempts from anon, authenticated;
create or replace function public.claim_studio_enquiry_attempt(p_bucket text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare attempt_count integer;
begin
 delete from public.studio_enquiry_attempts where created_at < now() - interval '2 hours';
 insert into public.studio_enquiry_attempts(bucket) values (p_bucket)
 on conflict (bucket) do update set attempts = public.studio_enquiry_attempts.attempts + 1
 returning attempts into attempt_count;
 return attempt_count <= 5;
end;
$$;
revoke all on function public.claim_studio_enquiry_attempt(text) from public, anon, authenticated;
grant execute on function public.claim_studio_enquiry_attempt(text) to service_role;
