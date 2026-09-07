# Cadence Beta Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a private, first-party Cadence beta feedback form at `brandnamechanges.com/cadence/feedback/`, import the two historical responses, and prove the complete submission/upload/export flow.

**Architecture:** A dependency-free static page calls a narrowly scoped Supabase Edge Function. The function validates and persists answers before issuing signed, resumable Storage upload tokens; database RLS and a private bucket prevent public reads. Standard-library Python tools provide idempotent legacy import and owner-controlled export.

**Tech Stack:** Semantic HTML5, CSS, browser ES modules, Node test runner, Deno Edge Functions, PostgreSQL, Supabase Storage/TUS, Python 3 standard library, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-07-cadence-beta-feedback-design.md`

## Global Constraints

- Preserve the existing BNC/Cadence editorial monochrome design; do not introduce a second visual language.
- Never commit response data, exports, service keys, database passwords, or access tokens.
- Do not modify or include the unrelated dirty files in `/Users/lukedudley/Developer/bnc-site`.
- Store answers before attempting evidence uploads.
- Allow at most 3 evidence files, 100 MiB each, and 200 MiB total.
- Public roles receive no read access to feedback tables or private evidence.
- The two supplied legacy rows must import idempotently as `google_forms_import_v1`.

---

### Task 1: Isolated delivery branch and repository safety

**Files:**
- Modify: `.gitignore`
- Modify: `README.md`
- Create: `docs/superpowers/specs/2026-09-07-cadence-beta-feedback-design.md`
- Create: `docs/superpowers/plans/2026-09-07-cadence-beta-feedback.md`

**Interfaces:**
- Consumes: clean `origin/master` from `lukejazzdudley-hub/bnc-site`
- Produces: isolated `codex/cadence-beta-feedback` worktree and documented operator boundaries

- [ ] **Step 1: Commit the approved spec and this plan without staging unrelated work**

Run:

```bash
git add docs/superpowers/specs/2026-09-07-cadence-beta-feedback-design.md docs/superpowers/plans/2026-09-07-cadence-beta-feedback.md
git commit -m "docs(feedback): specify first-party beta intake"
```

- [ ] **Step 2: Create the isolated implementation worktree**

Run the `superpowers:using-git-worktrees` workflow and create branch `codex/cadence-beta-feedback` from the spec commit.

- [ ] **Step 3: Add repository exclusions**

Add `.env`, `.env.*`, `!.env.example`, `feedback-exports/`, `supabase/.temp/`, and `.supabase/` to `.gitignore`.

- [ ] **Step 4: Verify the safety boundary**

Run `git status --short` in both worktrees. Expected: the implementation worktree contains only intentional changes; the original checkout still contains the pre-existing unrelated modifications.

### Task 2: Database and private Storage contract

**Files:**
- Create: `supabase/config.toml`
- Create: `supabase/migrations/20260907140000_cadence_beta_feedback.sql`
- Create: `tests/feedback_schema_contract_test.py`

**Interfaces:**
- Consumes: project ref supplied at deploy time
- Produces: `cadence_beta_feedback_responses`, `cadence_beta_feedback_uploads`, and private bucket `cadence-feedback-evidence`

- [ ] **Step 1: Write a failing schema contract test**

The test must assert the migration contains RLS enablement for both tables, revocations from `anon` and `authenticated`, response status and navigation-score checks, a unique legacy hash, a private bucket, `104857600` per-file bytes, and the exact allowed MIME list.

- [ ] **Step 2: Run the test and confirm failure**

Run: `python3 -m unittest tests.feedback_schema_contract_test -v`

Expected: failure because the migration does not exist.

- [ ] **Step 3: Implement the migration and function configuration**

Use `gen_random_uuid()` IDs, JSONB answers, salted hashes only, timestamp indexes for throttling/export, cascading upload rows, and an idempotent private-bucket insert/update. Configure `cadence-beta-feedback` with `verify_jwt = false`.

- [ ] **Step 4: Run the schema test**

Run: `python3 -m unittest tests.feedback_schema_contract_test -v`

Expected: pass.

- [ ] **Step 5: Commit the contract**

```bash
git add supabase/config.toml supabase/migrations/20260907140000_cadence_beta_feedback.sql tests/feedback_schema_contract_test.py
git commit -m "feat(feedback): add private response storage"
```

### Task 3: Tested Edge Function intake

**Files:**
- Create: `supabase/functions/cadence-beta-feedback/handler.ts`
- Create: `supabase/functions/cadence-beta-feedback/handler.test.ts`
- Create: `supabase/functions/cadence-beta-feedback/index.ts`

**Interfaces:**
- Consumes: `POST { action: "begin", payload, files }` and `POST { action: "finalize", submissionId, completionToken }`
- Produces: safe JSON responses plus narrow upload tokens; writes through injected persistence/storage dependencies

- [ ] **Step 1: Write failing handler tests**

Cover production/local origin allowlists, OPTIONS, method rejection, malformed JSON, required fields, conditional email validity, score bounds, text/file limits, honeypot absorption, elapsed-time absorption, hourly throttling, safe dependency failures, successful `begin`, invalid finalize token, missing objects, and successful finalize.

- [ ] **Step 2: Confirm the tests fail**

Run: `deno test supabase/functions/cadence-beta-feedback/handler.test.ts`

Expected: failure because the handler module is absent.

- [ ] **Step 3: Implement pure validation and HTTP orchestration**

Expose `validateBeginPayload`, `validateFiles`, `createCorsHeaders`, `constantTimeEqual`, and `createFeedbackHandler`. Return stable codes such as `invalid_submission`, `rate_limited`, `temporarily_unavailable`, and `upload_incomplete`; never return provider text.

- [ ] **Step 4: Implement production dependencies**

Create the service-role Supabase client, hash IP/invitation/completion values with SHA-256, normalize bounded provenance, insert responses before uploads, create signed upload URLs, inspect private Storage on finalize, and update lifecycle status.

- [ ] **Step 5: Run tests and type-check**

Run:

```bash
deno test supabase/functions/cadence-beta-feedback/handler.test.ts
deno check supabase/functions/cadence-beta-feedback/index.ts
```

Expected: all tests pass and no type errors.

- [ ] **Step 6: Commit the function**

```bash
git add supabase/functions/cadence-beta-feedback/handler.ts supabase/functions/cadence-beta-feedback/handler.test.ts supabase/functions/cadence-beta-feedback/index.ts
git commit -m "feat(feedback): accept and verify beta submissions"
```

### Task 4: Accessible staged website form

**Files:**
- Create: `cadence/feedback/index.html`
- Create: `cadence/feedback/feedback.css`
- Create: `cadence/feedback/form-model.js`
- Create: `cadence/feedback/feedback.js`
- Create: `tests/feedback_form_model.test.mjs`
- Create: `tests/feedback_page_contract_test.py`

**Interfaces:**
- Consumes: `cadence-beta-feedback` begin/finalize API and signed TUS upload instructions
- Produces: normalized `website_v1` submissions with stable answer keys and optional private evidence

- [ ] **Step 1: Write failing model and page-contract tests**

Test stage requirements, email/score handling, answer key serialization, file count/per-file/total limits, MIME allowlist, and safe session recovery. The page contract must assert landmarks, real labels, progress semantics, error-summary focus target, privacy/consent text, a non-JavaScript fallback, and no third-party form action.

- [ ] **Step 2: Confirm failure**

Run:

```bash
node --test tests/feedback_form_model.test.mjs
python3 -m unittest tests.feedback_page_contract_test -v
```

Expected: failure because page modules do not exist.

- [ ] **Step 3: Implement the semantic page and existing-brand styles**

Use four fieldset-backed stages, a text progress indicator, 44px controls, visible focus, readable measures, responsive 375–1440px layout, reduced motion, and the first-party privacy notice. Use only the existing site fonts, colours, and screenshot assets.

- [ ] **Step 4: Implement form behavior and resumable upload**

Validate on blur and on next/submit, focus the linked summary on multi-error submit, retain answers in `sessionStorage`, call `begin`, upload each file to the signed Supabase TUS endpoint in 6 MiB chunks with bounded retries/progress, call `finalize`, and clear local state only after the response is stored.

- [ ] **Step 5: Run UI tests**

Run:

```bash
node --test tests/feedback_form_model.test.mjs
python3 -m unittest tests.feedback_page_contract_test -v
```

Expected: all pass.

- [ ] **Step 6: Commit the form**

```bash
git add cadence/feedback/index.html cadence/feedback/feedback.css cadence/feedback/form-model.js cadence/feedback/feedback.js tests/feedback_form_model.test.mjs tests/feedback_page_contract_test.py
git commit -m "feat(feedback): add accessible Cadence beta form"
```

### Task 5: Legacy import and controlled export

**Files:**
- Create: `scripts/import_cadence_feedback.py`
- Create: `scripts/export_cadence_feedback.py`
- Create: `tests/test_feedback_data_tools.py`
- Modify: `README.md`

**Interfaces:**
- Consumes: a Google Forms CSV path and environment-provided `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`
- Produces: idempotent `google_forms_import_v1` rows and owner-controlled redacted exports

- [ ] **Step 1: Write failing data-tool tests**

Use a multiline, quoted 27-column fixture created in-memory. Assert month/day timestamp parsing in `Europe/London`, stable row hashes, preservation of the raw payload, platform/score/language mapping, name/email extraction, and removal of internal hashes from exports.

- [ ] **Step 2: Confirm failure**

Run: `python3 -m unittest tests.test_feedback_data_tools -v`

Expected: failure because the tools do not exist.

- [ ] **Step 3: Implement the standard-library tools**

Use `csv`, `hashlib`, `json`, `urllib.request`, and `zoneinfo` only. Require the service key via environment, use `legacy_row_hash` conflict-ignore behavior, and never print response bodies containing personal data unless explicitly exporting.

- [ ] **Step 4: Document operator commands and privacy boundary**

Add commands for tests, migration, function deploy, import, export, and cleanup. State that exports and source CSV files must remain outside Git.

- [ ] **Step 5: Run tests and commit**

```bash
python3 -m unittest tests.test_feedback_data_tools -v
git add scripts/import_cadence_feedback.py scripts/export_cadence_feedback.py tests/test_feedback_data_tools.py README.md .gitignore
git commit -m "feat(feedback): add private import and export tools"
```

### Task 6: Deploy, import, and verify production

**Files:**
- Modify: no tracked files unless verification finds a defect

**Interfaces:**
- Consumes: tested migration/function/site branch and the user-supplied CSV outside Git
- Produces: live form, exactly two imported rows, and no synthetic test artefacts

- [ ] **Step 1: Run the complete local gate**

Run all Node, Python, and Deno tests; `deno check`; HTML contract checks; `npx slop-scan scan .`; `git diff --check`; and a filename/secret/large-file inspection.

- [ ] **Step 2: Apply database migration and configure the function**

Use `supabase db query --linked --file ...`, generate a server-only `FEEDBACK_IP_SALT`, set it with `supabase secrets set`, deploy `cadence-beta-feedback --no-verify-jwt`, and query the database contract.

- [ ] **Step 3: Run live API and upload integration tests**

Submit a clearly tagged synthetic response from an allowed origin, upload a small generated PNG through the returned signed TUS token, finalize, and verify private database/Storage metadata. Then remove only that synthetic response and its object and verify both are gone.

- [ ] **Step 4: Import the supplied two-row CSV**

Run the import twice. Expected: first run creates two rows; second run creates zero. Query counts and original timestamps without printing names, emails, or free text.

- [ ] **Step 5: Push, review, and merge**

Push `codex/cadence-beta-feedback`, open a pull request to `master`, inspect the diff, merge after checks pass, and wait for GitHub Pages deployment.

- [ ] **Step 6: Test the public page**

Verify `https://brandnamechanges.com/cadence/feedback/` returns 200, exercise keyboard navigation and 375/768/1024/1440 layouts, confirm reduced motion, and complete one final synthetic no-file submission before removing it.

- [ ] **Step 7: Prove owner export**

Run the export tool to a temporary directory, confirm it contains exactly two non-test imported responses and no internal hashes, then delete the temporary export.
