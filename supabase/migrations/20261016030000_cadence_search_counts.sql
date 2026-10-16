-- Aggregate, optional website measurement. No lyrics, queries, visitor ids or raw IPs.
create table public.cadence_search_daily (
 day date not null default current_date,
 route text not null check (length(route)<=160 and route ~ '^/cadence/([a-z0-9-]+/){0,3}$'),
 source text not null check(source in ('google','bing','other_search','referral','direct','campaign')),
 event text not null check(event in ('view','store')),
 store text not null check(store in ('none','apple','google')),
 count bigint not null default 0 check(count>=0),
 primary key(day,route,source,event,store),
 check((event='view')=(store='none'))
);
create table public.cadence_search_abuse_buckets (
 hour timestamptz not null,
 bucket text not null check(bucket ~ '^[a-f0-9]{64}$'),
 count integer not null default 0,
 primary key(hour,bucket)
);
alter table public.cadence_search_daily enable row level security;
alter table public.cadence_search_abuse_buckets enable row level security;
revoke all on public.cadence_search_daily,public.cadence_search_abuse_buckets from anon,authenticated;
grant select,insert,update,delete on public.cadence_search_daily,public.cadence_search_abuse_buckets to service_role;
create function public.count_cadence_search_event(p_route text,p_source text,p_event text,p_store text,p_bucket text)
returns void language plpgsql security definer set search_path = public,pg_temp as $$
declare hits integer;
begin
 delete from public.cadence_search_abuse_buckets where hour < date_trunc('hour',now())-interval '2 hours';
 delete from public.cadence_search_daily where day < current_date-interval '180 days';
 insert into public.cadence_search_abuse_buckets(hour,bucket,count)
 values(date_trunc('hour',now()),p_bucket,1)
 on conflict(hour,bucket) do update set count=cadence_search_abuse_buckets.count+1
 returning count into hits;
 if hits>120 then return; end if;
 insert into public.cadence_search_daily(day,route,source,event,store,count)
 values(current_date,p_route,p_source,p_event,p_store,1)
 on conflict(day,route,source,event,store) do update set count=cadence_search_daily.count+1;
end;
$$;
revoke all on function public.count_cadence_search_event(text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.count_cadence_search_event(text,text,text,text,text) to service_role;
