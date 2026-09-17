# Cadence organic search

## Scope and cost

Five static pages: songwriting app, rap writing app, voice memos to lyrics,
Springtime Showers walkthrough and free English rhyme finder. Existing GitHub
Pages hosting; no new subscription, database writes or paid inference API.
Search phrases are intent hypotheses, not verified volume estimates.

## Baseline — 17 September 2026

Authenticated Google Search Console domain property `brandnamechanges.com`:
three-month selector, chart 5 July–14 September: 2 clicks, 20 impressions,
10% CTR, average position 10.8. Four indexed / three not indexed pages.
No submitted sitemap. These are whole-domain search metrics, not app installs.
Small numbers are not evidence of a reliable acquisition rate.

## Publication and measurement

After deployment, submit `https://brandnamechanges.com/sitemap.xml` in Google
Search Console and Bing Webmaster Tools. Check fetch success separately from
indexing; submission does not guarantee indexing or rankings. Inspect each new
URL. Compare weekly page/query impressions and clicks, excluding branded terms
when assessing new demand. Review at 28 and 90 days, not after individual days.

Store visits, app installs, first opens, returning users and purchases are
different events. Search Console alone cannot establish install attribution or
revenue. Do not claim ROI from search clicks. No new tracking script or consent
change is included in this release. Add consent-respecting outbound measurement
only through the separately approved analytics implementation.

Use actual query data to revise relevant pages before producing more pages.
Do not generate mass thin keyword pages, fabricated comparisons or testimonials.
Keep beta links accurate; switch iOS to the public store only after verifying release.

## Maintenance and architecture

`scripts/build_search_pages.mjs` is the content source and generates committed
HTML plus sitemap. Edit it rather than the generated pages. Search engines and
visitors without JavaScript receive the complete explanatory content.

The rhyme tool lazy-loads a roughly 2.5 MB filtered English pack on the first search into a
module worker. Subsequent searches reuse the index; UI stays on the main thread.
It returns at most 150 results, ignores stale replies and allows retry after
load failure/timeout. No user query leaves the worker/browser and no query is
saved. Dictionary data may include uncommon words; matches use American English
sound tails and are not equivalent to the app's proprietary ranking engine.

Rebuild data: `node scripts/build_rhyme_dictionary.mjs /path/to/cmu-pronouncing-dictionary`.
Use the version in `dictionary-provenance.json`; retain both upstream licences.
Never bundle proprietary app files or private lyrics into the public repository.

Build frequency metadata with `uv run --with wordfreq==3.1.1 python scripts/build_web_frequencies.py /tmp/frequency-en.json`.
Then build the web subset with `node scripts/build_web_english_pack.mjs /path/to/word-list-4.1.0 /tmp/frequency-en.json /path/to/node_modules`.
Build-only modules: dictionary-en@4.0.0 and nspell@2.1.5 (no browser dependency).
The spelling dictionary rejects capitalized names and invalid word-game forms.
The editorial supplement currently contains only the common loanword `chai`.
Abbreviations without written vowels and single-letter names are not included.
Retain SPELLING-LICENSE.txt and THIRD-PARTY-NOTICES.txt including wordfreq attribution.
Usage data is CC BY-SA 4.0, credited to Robyn Speer and the upstream corpus authors.
Frequency values are historical estimates, not proof that a word is valid.
Candidate suggestions require Zipf >= 3.2; valid rare dictionary queries still work.
Ranking uses usage frequency minus twice the consonant-distance score, with
syllable count/alphabetic ordering only as tie-breakers. Unstressed function-word
pronunciations are not rhyme targets. Polysemy and accent variation remain limits.
The vocabulary filter is MIT-licensed word-list 4.1.0; retain WORD-LIST-LICENSE.txt.
The small phrase bank is original editorial text. Multi-word endings are ending
matches, not the app's full phrase rhyme engine. Slant uses equal vowel sequences
and a weighted consonant edit: voicing differences score closest, then stop
substitutions, cluster edits, other obstruents. Bare-vowel assonance is excluded.
Neither mode establishes native-language parity.

All 25 language choices are catalogued, but only English is released. Others
are visibly unavailable until provenance, redistribution terms, phoneme adapter
and native accuracy checks are recorded. A selectable label is not support.
No production app packs are copied, changed or published by this website work.
The current loader accepts same-origin assets only; reusing a remote pack host
requires an explicit allowlist and CORS verification after clearance.

Downloads are SHA-256 verified and capped at 16 MB. Cache storage is optional;
only three pack versions are retained. Switching languages terminates the old
worker and clears results. Failed/corrupt cache reads fall back to the network.
This implementation adds no vendor, database write or paid inference request.

Springtime clips are backed by `assets/cadence/workflow-capture-manifest.json`.
They document arrangement and effects UI, not original transcription or an
audio-quality comparison. No new customer content was imported.

## Validation

Run `node scripts/build_search_pages.mjs`, `node --test tests/*.test.mjs` and
`python3 -m unittest discover -s tests -p '*test*.py'`.
Manual browser checks: dictionary first load, motion/ocean, single-syllable
rejection in multi mode, invalid/unknown words, mobile layout, store links,
and videos remaining paused until requested. Do not play demo audio during QA
when the operator has requested silent operation.

Rollback: revert the search-foundation commit and redeploy; no database migration.
