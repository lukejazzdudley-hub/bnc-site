# Static client services and email intake

Status: accepted for publication by Luke on 26 October 2026. Backend activation and inbox receipt checks completed before the website merge.

## Context

Brand Name Changes is adding client work alongside its products. Outreach recipients need a clear service offer, persuasive fictional design examples and one-step contact. The existing website is static HTML on GitHub Pages, with Supabase functions for write operations.

## Decision

Retain the framework-free site. Generate services, contact and fictional concept routes from authored records, sharing only the enquiry form and semantic demo controls. Give the wine bar, electrician and clinic independent markup, layouts and motion systems. Use locally hosted Motion 12.23.24, existing Three.js for the electrical scene, and authored Canvas/CSS interactions. Ship original generated imagery as compressed WebP, never copied studio assets.

Use a public Supabase function to validate native form POSTs and send plain-text enquiries with Resend to the requested studio inbox. Use a separate service-role-only abuse-counter RPC; do not persist enquiry text. Origin checks, a 16 KiB request limit, field limits, a honeypot and atomic per-hour rate limits apply server-side. The optional client timestamp is a heuristic for enhanced submissions and cannot authenticate a person. Static no-JS forms remain functional without it.

Native requests get fixed success/error redirects, enhanced requests get JSON. Keep concept previews and result pages noindex and outside the sitemap. Publish two indexable routes and a canonical `/services/` alias. Add no analytics.

## Consequences

No framework migration or host change is needed. A separate reviewed migration, server-secret setup, function deployment and inbox receipt test are prerequisites for activation. Provider acceptance alone does not establish inbox delivery. Static HTML refresh is used for the alias because GitHub Pages cannot configure a route-specific server 301. Native errors retain no submission data on the server; returning with the browser's Back action may recover entries. The operator must enforce the documented 12-month enquiry retention policy in the mailbox.

## Validation

See `../services/VALIDATION.md` for fresh test, browser and performance evidence. Production remains unchanged until a separate deployment decision.
