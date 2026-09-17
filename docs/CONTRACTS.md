# Resource hub contracts

Locked 2026-09-17. Orchestrator owns changes to this contract.

## Scope
Approved: one /cadence/resources/ hub, ten new articles, five existing resources
retained at existing URLs. Static hosting, no new vendors/tracking. Onyx/silver,
transparent animated mark, authentic imagery, original examples and no invented
testing claims. Do not claim no AI; transcription uses ML. No ranking guarantees.

## Content interface
Content agents export a named array `articles` from their own index.mjs.
Each article: `{slug,title,description,heading,intro,category,sections,sources}`.
slug is a lowercase hyphenated leaf under /cadence/resources/.
category: `Choose your tools`, `Improve your writing`, or `Finish your ideas`.
sections: array of `{id,heading,html}`; HTML is trusted authored static content,
not user input. Unique IDs; substantial paragraphs, worked original examples,
lists/tables where useful. sources: array `{title,url,checked}` with checked
YYYY-MM-DD only for sources actually checked. No fake author/read/test badges.
Source links belong near supported claims in html as well as references.
Existing URLs may be linked directly. New article links use full resource path.
Title <=75 characters, description <=180. Aim 800–1500 useful words/article,
without padding; each covers a distinct intent and has practical limitations.

## Ownership
- resource-guides: content/resources/guides/** only; six guides.
- resource-compare: content/resources/comparisons/** only; four articles.
- resource-ui: scripts/build_resource_hub.mjs, cadence/resources/**,
  tests/resource_hub.test.mjs only. Exclude content directories.
- orchestrator: integration/nav/sitemap/docs, verification, evidence review.

## Content slugs
guides: writing-rap-lyrics-over-a-beat, perfect-slant-multisyllabic-rhymes,
internal-rhymes-and-rhyme-schemes, syllables-stress-and-flow,
organise-voice-memos-into-songs, lyric-draft-to-recorded-demo.
comparisons: choosing-a-songwriting-app, cadence-vs-bandlab,
cadence-vs-garageband, cadence-vs-song-cage.

## Build / verification
Existing: node scripts/build_search_pages.mjs; node --test tests/*.test.mjs;
python3 -m unittest discover -s tests -p '*test*.py' -q.
New builder imports both arrays; missing modules may temporarily use empty arrays
ONLY during parallel development, final build must reject missing/incorrect count.
New builder renders hub/articles and appends resource URLs to existing sitemap
idempotently. Run after existing page builder. Do not edit main product layout.
No Simulator/Metro, no heavy renders, no production app/database changes.
No other agents' edits reverted. Atomic local commits; orchestrator publishes.
