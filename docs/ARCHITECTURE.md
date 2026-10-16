# Architecture

## Resource publishing

The resource hub is static HTML generated from authored ESM records in
`content/resources/`. Guides and comparisons are separate editorial collections;
`scripts/build_resource_hub.mjs` owns rendering and sitemap extension. Existing
search pages retain their URLs and link into `/cadence/resources/`.

Build order is search-page generator, resource-hub generator, then international-page generator. Committed HTML
is served directly by Pages; readers and crawlers do not need JavaScript for
article content. Optional browser enhancements must not fetch user queries,
gate reading or introduce analytics consent changes. Citations and checked dates
are editorial evidence, not claims of hands-on comparative testing.

## Boundaries

- **GitHub Pages:** immutable static marketing, legal, support and feedback-form assets.
- **Browser client:** staged validation, device-local draft recovery and direct signed TUS uploads.
- **Supabase Edge Function:** the only public write boundary; validates, rate-limits, creates private rows and verifies uploaded objects.
- **Postgres and Storage:** service-role-only response tables plus a private evidence bucket.
- **Operator tools:** standard-library Python scripts for idempotent legacy import and allowlisted export.

## Cadence product experience

The public product page remains a static deployment while presenting browser-rendered Blender scenes. The middle workflow and feedback handset use independently addressed Draco-compressed GLBs through a pinned local `@google/model-viewer` bundle. The source-locked V3 Library and Themes families use separately authored desktop/mobile GLBs, cameras and animation through a pinned local Three.js runtime. No production scene depends on a runtime CDN.

`cadence/phone-stage.js` binds verified Cadence captures to the workflow handset, chooses the chapter nearest the viewport centre, seeks the active recording and interpolates the camera orbit. `cadence/v3-scenes.js` drives each authored V3 clip from one reversible scroll value, preserves the exported camera and disposes its renderer off-screen so only one V3 WebGL scene is normally resident. `cadence/media-policy.js` continues to coordinate non-3D media. Reduced-motion, data-saving and unavailable-WebGL modes retain verified posters, so product meaning survives renderer or media failure.

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

Resource articles are generated static HTML. `content/resources/visuals.mjs`
maps topic-specific illustrations and reading routes. `reading.mjs` only marks
the current contents link using IntersectionObserver; it does not fetch data,
track readers or control scrolling. CSS scroll timelines enhance illustrations
when supported and motion is allowed, with a static fallback otherwise.

- 3 evidence files maximum;
- 100 MiB maximum per file and 200 MiB per response;
- allowlisted image/video MIME types only;
- production Brand Name Changes origins plus explicit localhost development origins;
- no public response browser or admin dashboard;
- prices and availability remain storefront truth rather than hard-coded website data.
- committed website media must be product-accurate, locally hosted and optimised for mobile delivery; source recordings and Blender working files remain in the controlled asset library rather than the public repository.

## International search and brand alias

`content/regions.mjs` holds six English regional storefront editions and shared
FAQ content. `scripts/build_international_pages.mjs` renders the region directory,
local product editions, product FAQ blocks and reciprocal hreflang, then extends
the sitemap. Marked product-page blocks are regenerated; approved landing copy
and media outside them stay directly authored. All editions have self-canonicals;
the existing global product URL is English and x-default. The directory is not an
alternate product edition. No locale detection or IP redirects are used.

Flow by Cadence is a secondary brand; its domain redirects through Cloudflare to
the BNC product URL. It is not a second content origin or a site migration. Keep
the existing CNAME, store review URLs and mobile association unchanged.

See [rollout and evidence](seo/GLOBAL-SEARCH.md) and
[domain decision](decisions/0001-regional-cadence-seo.md).

## Audience-intent expansion

`content/acquisition.mjs` owns four added English workflows; `content/locales.mjs` owns French/Spanish introductions. Existing generators render complete HTML and reciprocal language/region alternates. `scripts/audit_crawl.py` validates the static anchor graph, canonicals, local targets and sitemap indexability. Feedback stays noindex and outside the sitemap. No client routing or new tracking is added.
