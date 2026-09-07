# Brand Name Changes website

The public website for **Brand Name Changes Ltd** and **Cadence**. The frontend is plain HTML, CSS and JavaScript with no build step. Production is served from GitHub Pages at [brandnamechanges.com](https://brandnamechanges.com).

## What is here

```text
index.html                         Company landing page
cadence/index.html                 Cadence product page
cadence/cadence.css                Cadence product-page art direction and responsive layout
cadence/media-policy.js            Lazy loading and deterministic scroll-scrub policy
cadence/feedback/index.html        Four-step private beta feedback form
cadence/feedback/*.js              Validation, recovery and resumable upload client
cadence/feedback/feedback.css      Feedback-page presentation
privacy.html                       Privacy policy
terms.html                         Terms of service
support.html                       Support and FAQ
delete-account.html                Account-deletion instructions
supabase/migrations/               Private feedback schema and Storage bucket
supabase/functions/                Feedback intake and upload verification
scripts/                           Private import/export operator tools
assets/cadence/                    Verified capture manifest and web-ready Blender media
tests/                             Frontend, backend, schema and data-tool contracts
```

`cadence.html` is a compatibility redirect. The canonical product URL is `/cadence/`; this avoids a file/directory collision with `/cadence/feedback/`.
GitHub Pages also serves clean legal URLs (`privacy.html` → `/privacy`).

## Local preview

```bash
cd /path/to/bnc-site
python3 serve.py
```

Open `http://127.0.0.1:8000`. The development server supports the same clean routes used in production.

## Validation

```bash
python3 -m unittest discover -s tests -p '*test.py' -v
node --test tests/*.test.mjs
deno test supabase/functions/cadence-beta-feedback/handler.test.ts \
  supabase/functions/cadence-beta-feedback/store.test.ts
deno check cadence/feedback/feedback.js \
  cadence/media-policy.js \
  supabase/functions/cadence-beta-feedback/index.ts
```

## Deploy

Push a reviewed commit to `master`. GitHub Pages publishes the static files at
`brandnamechanges.com`; there is no package install or build command. Confirm the
custom-domain and HTTPS settings remain enabled in the repository's Pages
settings, then verify:

1. `https://brandnamechanges.com/cadence`
2. `https://brandnamechanges.com/privacy`
3. `https://brandnamechanges.com/terms`
4. `https://brandnamechanges.com/support`
5. `https://brandnamechanges.com/cadence/feedback/`

The live response should identify GitHub Pages and return HTTP 200 for each URL.

## Store-console URLs

Keep these exact URLs in both store consoles:

- https://brandnamechanges.com/privacy
- https://brandnamechanges.com/terms
- https://brandnamechanges.com/support  ← these are what App Store review needs.
- https://brandnamechanges.com/delete-account

The browser acceptance pass covers 320, 375, 390, 430, 768, 1024 and 1440 pixel viewports, forward and reverse scrubbing, the four-stage feedback journey, error-summary focus, broken media, internal links and horizontal overflow.

## Cadence media provenance

Feature media must resolve to the populated demo account and the capture metadata in `assets/cadence/source-capture-manifest.json`. Validate the locked Arctic, Neon and Crimson captures before rendering:

```bash
python3 scripts/cadence_capture_manifest.py validate \
  --manifest assets/cadence/source-capture-manifest.json \
  --source-root /path/to/locked-captures \
  --require-themes arctic neon crimson
```

The navigation mark is generated from the native component, not redrawn by eye:

```bash
node scripts/render_cadence_mark.mjs \
  /path/to/cadence/apps/mobile/src/components/CadenceLogo.tsx \
  assets/cadence
```

Every product video uses `data-src` plus `data-scrub-video`. The browser leaves the clip paused and maps scroll progress to `currentTime`; reduced-motion and data-saving visitors receive the poster without downloading the MP4.

## Feedback service deployment

The form writes only through the `cadence-beta-feedback` Edge Function. Browser roles have no direct table or bucket access.

Required operator environment:

```text
SUPABASE_PROJECT_REF
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ACCESS_TOKEN
SUPABASE_DB_PASSWORD
```

Link the intended Cadence project, apply the reviewed migration, set a new private salt, and deploy the public intake function:

```bash
supabase link --project-ref "$SUPABASE_PROJECT_REF"
supabase db push --linked
openssl rand -hex 32
supabase secrets set FEEDBACK_IP_SALT='<generated value>' --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy cadence-beta-feedback --project-ref "$SUPABASE_PROJECT_REF" --no-verify-jwt
```

The function itself enforces the production/local origin allowlist, field and file bounds, a timing trap, a honeypot and a salted per-IP rate limit. Optional evidence uses server-issued signed TUS paths in the private `cadence-feedback-evidence` bucket. Written answers are committed before an upload starts.

## Import the two original Google Form responses

Keep the source CSV outside this repository. The importer expects the original 27-column export, parses Google’s month/day timestamp in `Europe/London`, retains the complete legacy payload and ignores a row already imported with the same SHA-256 identity.

```bash
SUPABASE_URL='https://project.supabase.co' \
SUPABASE_SERVICE_ROLE_KEY='<private service key>' \
python3 scripts/import_cadence_feedback.py '/private/path/Form Responses 1.csv'
```

Run the same command a second time to prove idempotency: it should report zero inserted rows and two skipped duplicates.

## Export responses

Exports intentionally include participant answers and contact details. They exclude IP, invitation, completion and deduplication hashes plus request user-agent data. The tool refuses to put an export inside the Git repository.

```bash
SUPABASE_URL='https://project.supabase.co' \
SUPABASE_SERVICE_ROLE_KEY='<private service key>' \
python3 scripts/export_cadence_feedback.py --output '/private/path/cadence-feedback.json'
```

Use a `.csv` suffix for a spreadsheet-friendly export. Delete temporary verification exports when the check is complete.

## Privacy boundary

- Responses and optional evidence are private product-research data.
- They are not public testimonials or advertising assets without separate permission.
- Source CSV files, exports, local environment files and Supabase CLI state stay outside Git.
- Public `anon` and `authenticated` roles have no table or Storage policy granting feedback access.
- Access or deletion requests go to `hello@brandnamechanges.com`.

## Production release

GitHub Pages publishes the default branch and uses the checked-in `CNAME`. Before pushing, run the complete validation block, inspect the staged diff, scan for secrets and confirm that no response CSV or export is tracked. After deployment, verify:

- `https://brandnamechanges.com/cadence/`
- `https://brandnamechanges.com/cadence/feedback/`
- `https://brandnamechanges.com/support`
- `https://brandnamechanges.com/privacy`
- `https://brandnamechanges.com/terms`
- `https://brandnamechanges.com/delete-account`
