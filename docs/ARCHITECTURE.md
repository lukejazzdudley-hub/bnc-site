# Architecture

## Boundaries

- **GitHub Pages:** immutable static marketing, legal, support and feedback-form assets.
- **Browser client:** staged validation, device-local draft recovery and direct signed TUS uploads.
- **Supabase Edge Function:** the only public write boundary; validates, rate-limits, creates private rows and verifies uploaded objects.
- **Postgres and Storage:** service-role-only response tables plus a private evidence bucket.
- **Operator tools:** standard-library Python scripts for idempotent legacy import and allowlisted export.

## Feedback flow

```text
browser
  -> begin request
  -> Edge Function validates and stores written answers
  -> Edge Function returns server-chosen signed evidence paths
  -> browser uploads each optional file with resumable TUS
  -> finalize request
  -> Edge Function verifies private object size/type and records completion
```

The response exists before evidence transfer. A failed or interrupted upload can therefore be reported without losing the written research.

## Trust model

The static site has no service credential. `anon` and `authenticated` receive no feedback-table privileges and no Storage access policy. Original names, file names and client metadata never determine object paths. Salted hashes support throttling and invitation correlation without storing raw IP addresses or invitation tokens.

## Operational constraints

- 3 evidence files maximum;
- 100 MiB maximum per file and 200 MiB per response;
- allowlisted image/video MIME types only;
- production Brand Name Changes origins plus explicit localhost development origins;
- no public response browser or admin dashboard;
- prices and availability remain storefront truth rather than hard-coded website data.
