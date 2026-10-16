# Search Console indexing observations

## Current verification — 16 October 2026

Authenticated, verified domain property. Expanded sitemap reports **Success, 40 discovered URLs** after resubmission. This is discovery, not a count of indexed pages.

| Inspected URL | Google result |
|---|---|
| `/cadence/songwriting-app-android/` | URL is on Google; page indexed |
| `/cadence/type-beat-songwriting-app/` | URL is on Google; page indexed |
| `/cadence/fr/` | URL is on Google; page indexed |
| `/cadence/es/` | URL is on Google; page indexed |
| `/cadence/guide/` | URL is on Google; page indexed |
| `/cadence/fr/dictionnaire-rimes/` | URL is on Google; page indexed |
| `/cadence/es/diccionario-rimas/` | URL is on Google; page indexed |
| `/cadence/type-beat-walkthrough/` | Crawled — currently not indexed |

Watch-page detail: last crawl 16 October04:13:53, Googlebot smartphone; successful fetch, crawling and indexing allowed. Self canonical; Google-selected canonical is the inspected URL. Its inspection displayed a temporary sitemap processing error while the sitemap overview reported Success / 40. Do not recast this as a confirmed permanent technical error or repeatedly request indexing. Improve substantive evidence and revisit after another crawl.

The seven indexed results do not establish top positions, store visits or AI citations. See [query baseline](QUERY-IMPROVEMENTS.md) for actual search observations. Private inspection snapshots stay outside this repository.

## Earlier observations — superseded by the verification above


16 October 2026, authenticated verified domain property. Sitemap last read 16 October: Success, **36 discovered URLs** from the previous release. This is Google's reported fetched sitemap count, not proof that every page is indexed. New tools expand the local sitemap to 39; Google must fetch the new release before that count can change.

| Inspected URL | Google result at inspection |
|---|---|
| `/cadence/type-beat-songwriting-app/` | URL is on Google; page indexed; one valid Breadcrumb enhancement |
| `/cadence/songwriting-app-android/` | URL unknown to Google; not indexed |
| `/cadence/fr/` | URL unknown to Google; not indexed |
| `/cadence/es/` | Discovered — currently not indexed |

The type-beat page has progressed from the previously reported unknown state. No inference of query position, clicks or AI citation follows from indexing. Live tests, crawlable HTML and submission are separate from Google's index decision. Do not repeatedly submit near-identical pages or use an indexing API intended for other content types.

New language tools need post-publication live checks, sitemap reprocessing and URL inspection. Keep inspection exports/account details private. Check whether Google chose the declared canonical, whether the rendered page contains main content, and whether robots/snippet controls permit inclusion. Existing static methods, source attribution and examples are readable without running the tool.

Google's [AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says indexing and snippet eligibility remain prerequisites, and neither crawling nor inclusion is guaranteed. Structured data must describe visible content. Extra hidden AI text, special AI schema or duplicating country pages does not establish inclusion.

Search Console Core Web Vitals: insufficient mobile and desktop usage data for the last 90 days, report updated 14 October. Do not report a field pass/fail from the Lighthouse run.

## Live release

PR26 merged and GitHub Pages deployment succeeded at commit `11d289906318a816e10b0c2e88c0a3256a3f7d9f`. The public sitemap has 39 URLs; French/Spanish tools, watch page, collector module and optimized navigation asset returned HTTP 200. Resubmission returned **Sitemap submitted successfully**. Google still displayed 36 discovered pages before reprocessing; no claim that the three new URLs are already indexed.

New French dictionary inspection: **Discovered — currently not indexed**. Its live test returned **URL is available to Google / Page can be indexed**. This confirms live fetch eligibility, not index inclusion.

French tool indexing request was accepted: **Indexing requested**, added to a priority crawl queue. This is not yet an indexed result.
