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

`content/acquisition.mjs` owns four added English workflows; `content/locales.mjs` preserves French/Spanish introductions. `content/language-packs.mjs` records all 20 verified downloadable packs, while `content/pack-locales.mjs` supplies the other 18 product introductions. `content/pack-writing-exercises.mjs` supplies original language-specific writing and bilingual exercises for 20 English pack guides, rendered by `scripts/build_pack_guides.mjs`. Existing generators render complete HTML and supported reciprocal language/region alternates. HTML language, URL route and Google hreflang identifiers are separate; Arabic/Hebrew are RTL and Nigerian Pidgin is outside the Google alternate cluster. See `seo/ALL-LANGUAGE-COVERAGE.md` for research and evidence limits. `scripts/audit_crawl.py` validates the static anchor graph, canonicals, local targets and sitemap indexability. Feedback stays noindex and outside the sitemap. No client routing or new tracking is added.

## Public language tools and optional measurement

French/Spanish public dictionaries load in a worker only when searched; size bounds, source hashes and separate licences preserve the app-source boundary. Static HTML owns methods, examples and internal discovery links. The optional measurement module collects only coarse aggregate route/source/store counts after consent. A dedicated Supabase function validates and rate-limits writes; RLS prevents public reads. See `seo/growth/MEASUREMENT.md`, `LANGUAGE-REVIEW.md` and `PERFORMANCE.md` in that directory for operational limits.

## Feature guide

The beat-writing resource additionally imports authored lesson sections from
`content/resources/beat-lesson.mjs`. Its optional worksheet uses a pure timing/text
model plus a page-scoped DOM controller; no form entries leave the browser or
persist after reload. The resource generator also emits a blank UTF-8 worksheet
for no-JavaScript readers. No new landing route, tracking dimension or server
allowlist is required. Print mirrors use textContent so entered lyrics wrap
without textarea clipping. See `seo/BEAT-TO-DEMO-LESSON.md`.

A separate ReportLab script emits a two-page A4 worksheet for reliable paper use.
It is a blank download, independent of browser entries. The fourth generator
also adds the watch-page video's sitemap extension from its existing VideoObject;
the same locally hosted media, title, description and publication date are reused.
This improves discovery metadata without asserting video index inclusion.

`content/feature-guide.mjs` stores the public app manual as workflow chapters with stable anchors. `scripts/build_feature_guide.mjs` renders static HTML through the fourth growth generator; reading and deep links require no JavaScript. The release source-label check reads a separately supplied app checkout and flags missing evidence strings; it does not validate device UI behavior. See `docs/seo/growth/FEATURE-GUIDE.md`.

The guide adds a progressive contents filter and current-section indicator. Its optional handset dynamically imports the existing model-viewer and shared screen-texture initializer only on explicit activation. A reserved aperture prevents layout shifts; reduced-motion/data-saving preferences retain the poster. Static chapters and workflow links remain the source for readers and crawlers.

## Client-services enquiries

Static client-services and contact pages are rendered by `scripts/build_studio_pages.mjs` from `content/studio.mjs` and one shared form template. Both native HTML submissions and enhanced requests POST URL-encoded data to the public `studio-enquiry` Supabase function. It validates bounded input, discards honeypot hits, checks optional timing and claims an atomic hourly abuse counter before using server-side Resend credentials. It sends only to the studio inbox, with the visitor as Reply-To. No enquiry body is stored in Supabase. Native requests receive fixed same-site result redirects; enhanced requests receive JSON without echoes of personal data. Fictional previews use no APIs. See `services/OPERATIONS.md` for activation and retention responsibilities.

## Studio presentation and motion

`content/concept-layouts.mjs` owns the three independent fictional sites; `content/studio-experience.mjs` owns the populated comparison and marked homepage showcase. `scripts/build_studio_pages.mjs` renders their static HTML. Concepts load their own `concepts.css` and page controller, without the studio-wide header/footer or services CSS. `experience.mjs` enhances the homepage selector and services range. Original WebGL fields in `work-with-us/effects/` are optional, lazy and bounded by viewport, visibility and user preferences. The shared enquiry transport and Supabase boundary are unchanged by presentation work.
