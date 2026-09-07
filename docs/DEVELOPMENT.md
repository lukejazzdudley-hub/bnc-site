# Development

## Prerequisites

- Python 3.11 or newer;
- Node.js with the built-in test runner;
- Deno;
- Supabase CLI for deployment only.

No frontend package install or build step is required.

## Workflow

1. Preview with `python3 serve.py`.
2. Add or update a contract test before changing behavior.
3. Run the validation block in `README.md`.
4. Exercise affected pages at 375, 768 and 1440 pixels.
5. Stage only named files and inspect the staged diff.

## Feedback changes

Keep browser validation in `form-model.js`, transport behavior in `api-client.js` and DOM behavior in `feedback.js`. Mirror every browser constraint at the Edge Function boundary; client checks are user assistance, never authorization.

Schema changes require a new timestamped migration. Do not weaken RLS or add a public Storage policy to make uploads work—uploads use server-created signed tokens.

## Troubleshooting

- A clean URL returning 404 under `python3 -m http.server` is expected; use `serve.py`.
- If the form preserves answers but evidence fails, inspect TUS create/PATCH responses and then finalize status. Do not ask the tester to rewrite the response.
- If an import reports duplicates, compare only counts or hash prefixes in logs; never print participant rows during routine verification.
- If a price or plan changes, update the storefront. The website intentionally does not duplicate numerical pricing.
