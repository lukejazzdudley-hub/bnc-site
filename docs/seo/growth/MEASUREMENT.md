# Optional acquisition counts

The production `cadence-search-events` Supabase function and additive migration were deployed on 16 October 2026. A valid production-origin QA view returned HTTP 204; that proves request handling, not independent verification of an analytics report. One direct QA view was deliberately submitted against `/cadence/type-beat-walkthrough/` on this date; exclude that test from outcome reporting.

## Collection and privacy

No counts before explicit consent. Declining, Do Not Track or Global Privacy Control disables collection. Consent lives in local storage and can be changed through Privacy choices at the foot of each acquisition page. Session storage holds only the first consenting route and coarse source. There is no visitor identifier or cookie. No lyric, searched word, query string, full referrer, campaign value or email enters the payload. Pages and store clicks are separate events; store clicks use the first consenting landing route. Repeated store clicks on a page are suppressed in memory. These are best-effort counts, not unique users.

Source groups: Google, Bing, other search, referral, direct, campaign. Unknown referrers are discarded after grouping. No query-to-person join is possible. Public collection requires exact production Origin and strict route/dimension allowlists, streamed 1 KB input bounds and a rotating hourly HMAC abuse bucket. Origin is not authentication: clients can forge it. Counts can be inflated; do not use them for billing or fraud-sensitive decisions. Service-role credentials remain only in backend environment variables.

The tables have RLS, revoked anonymous/authenticated access and no public read endpoint. Abuse rows older than two hours and aggregates older than 180 days are cleaned on subsequent event collection; this is not a guaranteed scheduled deletion deadline. Hosting providers may retain their own security logs separately, as disclosed in the privacy policy.

## Reporting

Use the authenticated Supabase SQL editor; export only the aggregate table, never the feedback tables:

```sql
select day, route, source, event, store, count
from public.cadence_search_daily
where day >= current_date - 28
order by day, route, source, event, store;
```

Save the resulting CSV outside this public repository. Run:

```bash
python3 scripts/search_report.py /private/path/aggregate.csv --output /private/path/report.csv
```

The report groups page views and Apple/Google store clicks by route and source. A click-to-view ratio can exceed 100% when visitors opt in on a previous day or follow internal navigation; it is not an install conversion rate. Low counts and opt-in selection bias require caution.

Separately export Search Console pages, queries, countries and devices for the same completed date range. Compare branded/non-branded queries, inspect query+page filters in GSC, and flag anonymized-query gaps. Do not manufacture a visitor-level query→install join from separate aggregate exports.

Installs must come from supported App Store Connect/Play Console acquisition reports, with their own attribution windows and privacy thresholds. No campaign provider token or install SDK was fabricated, and no cross-store identity matching was introduced. Outbound store clicks are not installs, revenue or evidence of ranking improvement.

## Release procedure

Regenerate the route allowlist whenever a sitemap route changes, review the change, deploy the collector, and validate denied-origin, unknown-route, oversized and valid requests. No collector events should be sent by browser QA unless explicitly testing consent. Do not commit private exports or credentials.

Outbound Apple matching requires the exact Cadence app-ID path suffix; regression cases reject lookalike longer app IDs and appended paths. Store visits remain aggregate click events, never install assertions.

## Authenticated CLI reporting

If the browser dashboard is signed out, the linked Supabase CLI can read the
same aggregate table through the Management API without changing database
privileges. Verify `supabase/.temp/project-ref` names the existing Cadence
project, then use `supabase db query --linked --output json --file` with a
read-only SELECT of `cadence_search_daily`; redirect output to a private path.
No feedback-table dump or service credential export is needed. The17 October
check succeeded and returned only the known QA view from16 October. Exclude that
single documented test count from outcome reports, not all future direct views.
No non-QA observations yet is not evidence that nobody visited.
