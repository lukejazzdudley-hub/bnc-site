# Cadence Beta Feedback Design

## Outcome

Replace the closed, externally owned Google Form with a first-party feedback flow at `https://brandnamechanges.com/cadence/feedback/`. Responses and optional evidence files are collected in Cadence's existing Supabase project, remain private, and can be exported without Google. The two existing Google Form responses are imported once with their original timestamps and complete raw payloads.

## Scope

This release includes:

- a mobile-first, four-stage feedback form using the existing BNC/Cadence editorial monochrome design language;
- client-side recovery for accidental reloads during the session;
- optional screenshot and screen-recording uploads;
- private database and Storage records with no anonymous read policy;
- server-side validation, origin checks, abuse throttling, and a honeypot;
- one-time import and repeatable export tooling;
- source and campaign attribution sufficient to distinguish legacy, organic, and future outreach responses;
- production deployment and a real end-to-end smoke test.

This release does not resend tester emails, publish feedback, build a public results dashboard, or use feedback files in marketing. Those actions require separate direction.

## Existing constraints

- The website is dependency-free static HTML, CSS, and JavaScript deployed from `lukejazzdudley-hub/bnc-site` to GitHub Pages.
- The live site matches `origin/master`; the existing local checkout contains unrelated uncommitted work and must not be modified or committed.
- Cadence already uses Supabase project `goupfxfloriqtucppmbx`.
- The public repository must contain no service-role keys, database passwords, access tokens, exports, or original response data.
- The general site design is already locked: near-black surfaces, warm ivory type, Instrument Serif display type, Geist body type, Geist Mono labels, quiet motion, and no decorative UI clutter.

## User experience

### Entry

The page leads with `Help shape Cadence.` and explains that the form takes roughly 8–12 minutes. It states that screenshots and recordings are optional, private, and used only to understand the submitted feedback.

### Stages

1. **You** — name, email, lifetime-access preference, platform, musical identity, and app language.
2. **Your workflow** — current creative process, frequency, location, constraints, and current tools.
3. **Your Cadence session** — what the tester did, workflow impact, friction, liked/disliked features, looping, rhyme assistance, missing capability, navigation score and reason, and bugs.
4. **Would it stick?** — return trigger, workflow replacement, recommendation triggers/blockers, fair pricing, evidence files, research consent, and optional follow-up consent.

The original questionnaire's meaning remains available so imported and new responses can be compared. Only the fields required to identify the tester and produce actionable feedback are mandatory. Long contextual questions remain visibly optional.

### Completion and recovery

- Each stage has a text label and progress meter; progress is never conveyed by colour alone.
- Native controls, visible labels, inline errors, a focusable error summary, and 44px minimum targets support keyboard, screen-reader, and mobile use.
- Non-file answers are saved to `sessionStorage` while the tab is open. Files are never cached by the page.
- The form stores the written response before uploading evidence, so an upload failure cannot discard the answers.
- Submit shows explicit saving, per-file upload progress, success, and recoverable error states.
- Reduced-motion preference disables nonessential transitions.

## Data model

### `cadence_beta_feedback_responses`

Stores one row per response:

- identity and segment fields: `name`, normalized `email`, `platform`, `musical_identity`, `language`, `wants_lifetime_access`;
- research values: `navigation_score` and an `answers` JSON object with stable snake-case keys for the remaining questions;
- provenance: `source`, `schema_version`, optional hashed invitation token, bounded UTM values, referrer, and user agent;
- privacy/security: research and follow-up consent, salted IP hash only, client start time, and server timestamps;
- import compatibility: `original_submitted_at`, `legacy_payload`, and unique `legacy_row_hash`;
- lifecycle: `received`, `awaiting_uploads`, `complete`, `complete_with_upload_errors`, or `imported`.

### `cadence_beta_feedback_uploads`

Stores expected evidence metadata and private object paths. Objects live in the private `cadence-feedback-evidence` bucket. The public roles have no table read/write grants and no Storage policies.

### Evidence limits

- at most 3 files;
- each file at most 100 MiB;
- total evidence at most 200 MiB;
- accepted types: PNG, JPEG, WebP, HEIC/HEIF, MP4, QuickTime, and WebM;
- the server chooses every object path and extension from the validated MIME type;
- uploads use Supabase's signed resumable TUS flow in 6 MiB chunks.

## API

One public Edge Function, `cadence-beta-feedback`, runs with JWT verification disabled but never trusts the client.

### `begin`

The browser sends answers and declared file metadata. The function:

1. validates the exact production/local origin allowlist;
2. rejects invalid JSON and field bounds;
3. silently absorbs obvious honeypot or impossibly fast bot submissions;
4. hashes the connecting IP with a server-only salt and applies a five-submissions-per-hour limit;
5. writes the response immediately;
6. creates upload metadata and single-path signed upload tokens;
7. returns a response ID, an in-memory completion token, and signed upload instructions.

### `finalize`

After uploads, the browser presents the response ID and completion token. The function checks private Storage metadata against each declared file. It marks the response complete or complete with upload errors, clears the completion-token hash after full success, and returns only safe status information.

### CORS and disclosure

Only `https://brandnamechanges.com`, `https://www.brandnamechanges.com`, the repository's GitHub Pages origin, and loopback development origins are accepted. Errors contain stable public codes, never database or provider details.

## Import and export

`scripts/import_cadence_feedback.py` reads the supplied Google CSV with Python's CSV parser, maps the 27 headers to the new schema, keeps the full source row in `legacy_payload`, interprets the sheet timestamps as America-style month/day values in the Europe/London timezone, and uses a SHA-256 row fingerprint for idempotency. It requires a service-role key from the operator environment and never copies the CSV into the repository.

`scripts/export_cadence_feedback.py` retrieves responses and attachment metadata using a service-role key, strips internal IP/invitation/completion hashes, and writes JSON or CSV to stdout or an explicit operator path. Export directories are ignored by Git.

## Privacy and retention

The form contains a concise, first-party privacy notice before consent:

- Brand Name Changes Ltd is the controller;
- feedback is used to improve Cadence and administer promised beta access;
- optional evidence is private and not used publicly or in advertising without separate permission;
- Supabase processes storage on BNC's behalf;
- identifiable research is retained while the beta and follow-up research are active, then deleted or de-identified;
- deletion or access requests go to `hello@brandnamechanges.com`.

## Verification

Completion requires all of the following:

- unit tests for payload bounds, conditional requirements, origin handling, bot absorption, rate limiting, safe errors, and finalize-token validation;
- unit tests for browser-side stage validation, answer serialization, file limits, and session recovery;
- import mapping tests covering multiline CSV and idempotency hashes;
- SQL checks for RLS, grants, constraints, indexes, private bucket status, and MIME/size limits;
- a local responsive and keyboard pass at 375px, 768px, 1024px, and 1440px, plus reduced motion;
- a live production submission with a small synthetic image, verified in both database and private Storage;
- removal of every synthetic test row and object;
- exactly two imported legacy rows and no CSV or secrets in Git;
- the production URL returns 200 and the live assets match the merged commit.
