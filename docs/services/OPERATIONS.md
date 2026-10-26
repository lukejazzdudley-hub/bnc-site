# Project enquiries — operator setup

Status: review branch only. No production functions, database, DNS or website have been deployed.

GitHub Pages serves the HTML. The existing Supabase project hosts the new `studio-enquiry` endpoint; Resend sends plain-text enquiries to `brandnamechanges@gmail.com`. The public project URL is already used by the existing feedback form. Public project references are not secrets.

## Before activation

1. Review the migration `20261026160000_studio_enquiry_attempts.sql` and apply it to the existing Supabase project through the normal migration workflow. It creates an abuse-counter table and service-role-only atomic RPC. No existing table is changed.
2. Set **server-side** secrets `STUDIO_ENQUIRY_RESEND_KEY`, `STUDIO_ENQUIRY_FROM` (an actual verified Resend sender), and `STUDIO_ENQUIRY_IP_SALT` (a separate high-entropy value). Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Never put these in HTML, Git or screenshots. TODO(Luke): add these values in the deployment environment.
3. Deploy `studio-enquiry` with JWT verification disabled, as declared in `supabase/config.toml`. It is deliberately a public intake endpoint: validation, bounded bodies, origin allowlist and rate limiting protect it. Production accepts only the two Brand Name Changes HTTPS origins. `STUDIO_ENQUIRY_ALLOW_LOCAL=true` is for local development only.
4. Verify that the edge gateway sets/sanitises `x-forwarded-for` from the real connection. A caller-controlled address header would weaken rate limiting. The function uses a domain-separated hourly HMAC rather than storing raw network addresses. Five sends per network/hour are allowed; fixed-window boundaries can allow adjacent-window bursts. Counters older than two hours are removed on the next claim.
5. After separate production approval, send one authorised operational test with JS enabled and one native submission without JS. Check the actual Gmail inbox, Reply-To, provider logs and spam folder. A provider acceptance receipt is not proof of inbox delivery. Remove test mail through the normal mailbox workflow if desired.
6. The studio must enforce its stated deletion period: review enquiries monthly and delete non-client correspondence within 12 months of last contact. The endpoint does not retain enquiry bodies; normal mail-provider retention/backups are separate. Project and accounting correspondence follows applicable project obligations.

Unconfigured or rejected delivery returns failure, never a success state. No API key placeholder is exposed to visitors. Until this endpoint is activated, direct email works but form delivery is unavailable; do not merge/publish the form ahead of its backend. No automatic receipt emails or marketing messages are sent to visitors.

## Local verification

Run `node scripts/build_studio_pages.mjs`, `node --test tests/services.test.mjs`, `deno test supabase/functions/studio-enquiry/handler.test.ts`, and `deno check supabase/functions/studio-enquiry/index.ts` in addition to the repository validation block. The endpoint tests inject a fake mail transport and abuse-counter dependency; they never send email.

`deno run --allow-net=127.0.0.1:54329 scripts/preview_studio_enquiry.ts` starts an explicitly local test transport on port 54329. Browser tests may route the public function URL to this local server. Only requests containing the test domain `example.test` are accepted. The preview transport does not send or store messages.

The timing field is optional for native no-JS forms. The server rejects implausible JS timestamps; honeypot and durable rate limiting cover all normal submissions. This is a spam-reduction mechanism, not a guarantee that a submission is human.

Run browser acceptance with an installed Playwright package (or set `BNC_PLAYWRIGHT_PATH` to its absolute package directory): `node scripts/verify_studio_browser.cjs`. Start both local preview servers first. The script launches its own headless Chrome, uses only `example.test` test identities and a local fake mail transport, verifies 42 responsive combinations, and writes screenshot/evidence files under this directory. It does not send production enquiries.
