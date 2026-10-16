# Beat-to-demo lesson

The existing `/cadence/resources/writing-rap-lyrics-over-a-beat/` guide now gives
readers a reproducible writing exercise and reusable worksheet. Keeping one
canonical guide avoids a second article competing for the same intent. Its
worked text, section map and listening questions remain complete in static HTML.

## Reader outcome

A writer or teacher can use any permitted instrumental and recorder to draft a
verse, shorten a crowded line, compare two actual takes and write a handoff note.
The 30-minute plan is an exercise, not a finished-song guarantee. The original
lyric and hook are authored examples, not claimed recordings. The separate
captured app walkthrough retains its own evidence limits. Arrangement/export
instructions link to the feature manual and clearly identify the Pro requirement.

## Worksheet

The calculator assumes constant tempo and four beats per bar. It accepts 40–240
BPM and four whole section lengths from 0–256 bars; zero skips a section and at
least one bar is required. It accumulates unrounded time before formatting the
display. It cannot detect a beat's structure, metre, pickup, offset or tempo map.
The blank download is generated from the same model as filled downloads.

Entries exist only in the current page. A UTF-8 text download preserves accents,
non-Latin scripts and line breaks. Printing mirrors textarea values as plain
wrapping text to prevent clipped lyrics. Download before navigating or reloading;
there is no autosave, account storage, upload or lyric analytics. No new route is
added to the sitemap or measurement service. Existing route analytics consent is
unchanged.

## Design and dependencies

Preserve the accepted Onyx resource layout, article navigation and current media.
The section strip communicates the example's real bar ranges; worksheet controls
use visible labels, native inputs, inline errors and 44px-or-larger controls.
Current Motion JavaScript, Kokonut UI and Bklit UI documentation/catalogues were
consulted on 16 October 2026. This bounded worksheet needs no animation or data
chart, and the existing static site does not require a React conversion for
native form controls. No new library is installed or described as installed.
Existing article motion keeps its reduced-motion fallback. The extra stylesheet
and two small modules load only on this guide.

## Evidence and release

Timing, invalid input and text export have Node tests. Python contracts check
static lesson anchors, downloadable content and absence of persistence/network
APIs in the worksheet controller. Browser acceptance must cover seven locked
widths, keyboard use, invalid input, actual file download and print preview.
Run the repository validation and crawl audit before release.

Release checks on 16 October 2026: 104 Python, 152 Node and 42 Deno tests passed;
Deno checks and the 78-URL crawl audit passed. Gitleaks found no leaks. Slop-scan
reported 14 findings (54.23 score), with no findings in the new worksheet files;
these existing repository findings are not represented as a clean lint result.
All seven widths passed actual viewport, overflow, label and 44px-control checks.
An actual UTF-8 download retained French/Japanese text, skipped intro timing and
take fields. Independent source/screenshot review found no concrete blocker.
The browser print action opened a system dialog that could not be inspected;
the owned test tab was closed to clear it. Print CSS and wrapping mirrors were
reviewed, but final paper/PDF pagination remains unverified.

This release addresses the need for a useful educational asset. It is not proof
of page-one ranking, independent endorsement or a hundreds-of-backlinks
Skyscraper target. Outreach receipts and contact details stay outside this public
repository; a sent request is distinct from an editorial reply or published link.
