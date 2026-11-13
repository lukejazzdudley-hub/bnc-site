# Homepage CSS and immutable entry assets

Status: accepted for source delivery, 13 November 2026.

## Problem

The homepage waits for four small stylesheets. Two initially visible font faces
are discovered from CSS, adding a dependent request step. All initial public
assets receive the origin's ten-minute HTTP cache lifetime.

## Decision

Embed the complete existing homepage CSS cascade at build time. Its approximately
65 KB source compresses to about 14 KB, preserves every responsive/focus/no-JS
state and removes four blocking requests. This avoids a JavaScript CSS loader,
flash of unstyled content or a fragile viewport-specific critical-style subset.
The source stylesheets remain shared by other pages. Preload the three font faces
actually used initially, preserving their existing font-display behavior.

Content-hash homepage script and responsive showcase-image copies. Keep scripts
deferred, the original source modules shared, and interactive effects lazy. The
experience source uses its original absolute effect route because its entry copy
now lives under assets/immutable. Hashes and source-byte equality are tested.

Do not introduce a bundler, runtime CDN, service worker or hosted service for
this change. The studio generator invokes the small Node built-in-only authoring
helper. Inline CSS duplicates a bounded payload in the homepage document and must
be rebuilt when shared CSS changes; tests prevent source/generated drift.

## Cache deployment boundary

Hashing prepares assets for long caching but does not configure HTTP headers.
Only a scoped rule in the actual domain's CDN/hosting zone can do that. The
available Cloudflare account does not contain this zone; cache activation is
blocked on access, not represented as complete. See the static cache runbook.
HTML, API traffic, lookup dictionaries and mutable shared assets are outside the
long-lived allowlist. Published immutable files must remain available for cached
HTML. No changes to app code, artwork, product claims or analytics consent.

## Validation

Compare the initial layout/typography with the current live page at seven widths,
with and without JavaScript. Verify menu/project switching, reduced-motion
fallbacks, source byte hashes and no external stylesheet request. Run the full
project suite, crawl audit and Lighthouse with matching settings. Record actual
live asset bytes, response headers and release times. Lab scores vary; reduced
request count is not a ranking guarantee.
