# Studio redesign verification

26 October 2026. These checks verify technical behaviour; they do not establish Luke's creative acceptance. The screenshot set shows the redesigned compositions, including the replacement for the rejected plug model.

## Current checks

- Static studio generator and crawl audit: 84 sitemap URLs, no broken targets.
- Python suite: 107 passed. Node suite: 170 passed.
- Deno feedback, storage, measurement and enquiry suites: 47 passed; documented checks passed.
- Browser suite: 56 page/width combinations at 320, 375, 390, 430, 768, 1024 and 1440 px; no horizontal overflow.
- Homepage visibility: both hero actions have visible ancestor opacity and fit above the fold at four widths, with JavaScript enabled and disabled. This catches the legacy html.js opacity regression.
- Shared enquiry: native success redirect, enhanced validation/reset and preserved failed entries, using stubbed responses with no email delivery.
- Concepts: complete booking flows, Escape and focus return; clinic treatment presets; electrical service/estimate agreement; populated menu; both complete comparison endpoints and keyboard range control.
- Motion suite: visible rendered changes in all three concepts, no drawing off screen, and complete poster layouts with working dialogs for reduced-motion, save-data and unavailable-WebGL modes. Homepage motion starts on interaction. No uncaught page errors.
- Gitleaks: no leaks found in approximately 45 MB scanned. Slop-scan: 18 findings in existing Cadence/vendor code; no authored studio findings. No dependency distributions were edited to change the score.

Run the browser scripts through the installed Playwright runtime, as described in Development. `BROWSER-RESULTS.json` and `MOTION-RESULTS.json` hold their reports. Local videos and complete comparison endpoint screenshots are in ignored `.gstack/redesign-previews/`; selected responsive screenshots are checked in here.

## Mobile loading measurements

Lighthouse 13.5.0, local static preview, simulated mobile Chrome. Current observations are recorded in `LIGHTHOUSE-RESULTS.json`.

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | Whole-page bytes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 98 | 100 | 100 | 100 | 2.11 s | 0.0401 | 201,197 |
| Work with us | 97 | 100 | 100 | 100 | 1.68 s | 0.0014 | 257,935 |

Both meet the requested score, LCP under 2.5 seconds, CLS under 0.05 and first-view transfer budget. The homepage uses a responsive original image and starts shader compilation only on interaction. Its old anime/cursor/magnetic layer is bypassed while shared navigation remains active. The services heading is immediately readable, without a staggered opacity entrance. Concept pages are deliberately noindex.

## Production boundary

The enquiry backend was activated and independently verified earlier on 26 October: RLS/privileges, rollback-only five-attempt abuse limit, native/enhanced requests and actual Gmail inbox delivery. This presentation change does not modify the function, database, sender configuration or DNS. The browser acceptance above uses stubs and does not repeat real email delivery tests.

Static releases follow the existing reviewed master merge and GitHub Pages deployment. Business Profile Manager now confirms BNC Studio as Verified. The profile description was saved; category selection remains a separately tracked Google UI step. Bristol is the base and London a service area, without an invented London office.

## Local-service and identity follow-up

- Added Bristol and London service routes: 86 sitemap URLs; no crawl errors.
- 170 Node, 107 Python and 47 Deno tests pass. The sitemap integration expectation now includes the two real service pages.
- Expanded the browser grid to 56 page/width combinations and 16 selected screenshots, with working native/enhanced forms and circuit on/off restoration. Graphics/fallback checks continue to pass with no page errors.
- Lighthouse mobile, local preview: Bristol 100/100/100/100, LCP1.53s, CLS0.00015,158KB; London99/100/100/100, LCP1.68s, CLS0.00015,158KB. These are observed technical measurements, not indexing or lead results.
- Google Business Profile Manager independently showed the BNC Studio record as Verified. Its description was saved. The owner chose to keep the existing address and 24-hour weekday setting.
