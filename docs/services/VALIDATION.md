# Client-services review evidence

26 October 2026. Local branch only; no production deployment. These checks establish technical behaviour, not Luke's visual acceptance. The first two concept passes were rejected and replaced with independent compositions.

## Automated validation

- Four existing editorial generators, followed by `node scripts/build_studio_pages.mjs`: successful.
- `python3 -m unittest discover -s tests -p '*test*.py'`: 107 passed.
- `node --test tests/*.test.mjs`: 166 passed, including the new validation, shared-form and indexability contracts.
- Deno endpoint suites for feedback, storage, measurement and enquiries: 47 passed.
- Deno checks for existing feedback/media boundaries and the new enquiry entrypoint: passed.
- `python3 scripts/audit_crawl.py`: 84 sitemap URLs, no broken crawl targets.
- `git diff --check`: passed.
- Gitleaks directory scan with redaction: no leaks found in approximately 40 MB scanned.
- `npx slop-scan scan . --lint`: 18 findings across upstream vendored libraries and existing Cadence modules; no findings in the authored services implementation. New vendored anime.js and Motion carry upstream wrapper/catch findings. Their original distributions are retained with licences, rather than editing dependency internals to improve the score.

## Browser acceptance

`node scripts/verify_studio_browser.cjs` launches its own headless Chrome. See `BROWSER-RESULTS.json` for the run output. It checks home, services, contact and all three concepts at 320, 375, 390, 430, 768, 1024 and 1440 px: 42 combinations, no horizontal overflow. Twelve desktop/mobile WebP screenshots are under `screenshots/`.

Enhanced forms reject invalid fields, clear only after successful acceptance, and preserve entries on failure. Native no-JS forms POST successfully and follow the fixed success redirect. These requests are routed to the local fake mail transport with `example.test` identities. No real email is sent and no inbox delivery is claimed. Production function, database and sender setup remain prerequisites.

Wine/clinic demos complete their local booking flow, announce that nothing was booked, close with Escape and return focus. Electrical estimates match the visible mock table; the power switch updates its circuit state. The clinic's movement controls respond to keyboard focus. Reduced motion leaves no visible active canvas or running animation on the new primary pages. Skip links and the labelled native form controls remain keyboard-accessible.

## Lighthouse mobile

Lighthouse 13.5.0, local `serve.py`, default simulated mobile settings, Chrome headless. Results are observations of these runs, not guarantees for every device or production network. Full JSON is retained locally under `/tmp/bnc-lighthouse-*-final.json`; the checked-in summary is `LIGHTHOUSE-RESULTS.json`.

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | Whole-page transferred bytes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 96 | 100 | 100 | 100 | 1.90 s | 0.0013 | 196,516 |
| Work with us | 98 | 100 | 100 | 100 | 2.11 s | 0.0474 | 198,155 |

Both runs meet the requested score, LCP, CLS and first-view transfer budgets; their whole-page transfers are also below 1 MB. The electrical concept lazily imports the existing Three.js runtime after first paint, caps DPR and stops rendering off screen/when hidden. Save-data, unavailable WebGL and reduced motion retain a poster. Fictional pages deliberately have noindex, so an SEO score of 100 is not sought for those previews.

## Production backend verification — 26 October 2026

Luke authorised publication of the reviewed website. The additive migration and function are now deployed to the existing Supabase project; the verified-domain sender and three server-only secrets are configured. RLS and role privileges were checked live. A rollback-only SQL integration check confirmed the five-attempt limit and sixth-attempt rejection. Native and enhanced operational test messages both arrived in the studio Gmail inbox, confirmed through the connected Gmail account. Different caller-supplied forwarding headers did not split their server abuse bucket in this check.

Static publication and final live-page verification follow the master merge; see the deployment report for the outcome. No DNS change, application table change or business-listing change is part of this release.

## Review notes

The latest independently composed concepts remain available for visual review. Business Profile setup and owner verification remain separate work. Bristol is the confirmed base; London is a service area, and no additional office is claimed.
