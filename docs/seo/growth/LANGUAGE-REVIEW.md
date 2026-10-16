# French and Spanish public tool validation

The website tools use independent source-cleared public dictionaries, not the proprietary app packs. Pack/source hashes, exact revisions, changes and counts are recorded in `cadence/search/public-romance-provenance.json`; attribution and ShareAlike terms are in `cadence/search/licenses/ROMANCE-NOTICE.md`. Derived datasets remain downloadable. Source notices do not claim endorsement.

French: 44,403 retained entries from Lexique 4.10, frequency filtered. Match the final vowel and following consonants, preserving nasalization and vowel distinctions. Explicitly corrected peur from /pøʁ/ to /pœʁ/ against the Wiktionnaire. Coeur/soeur spelling is normalized to cœur/sœur. This is primarily France-oriented isolated-word pronunciation, not comprehensive Quebec/African/Belgian/Swiss or performed-verse coverage.

Spanish: 151,787 entries/variants derived from pinned WikiPron/Wiktionary sources. Broad IPA omits stress, so stress is inferred from orthography only when vowel nuclei align; ambiguous forms are omitted. Preserve Spain/Latin-American variant readings. Added two attested emociones readings and three missing stressed verb forms, each with pinned source revisions. Strengthened negative tests to require both words to exist; this exposed missing caminó, publicó and terminó rather than silently passing unknown-word comparisons. No general OOV guessing or fallback to English. Alphabetical/length ordering is not corpus-frequency ranking.

The 45 automated checks include 26 known-positive pairs, 14 negative pairs and invalid input, unsupported modes bounded source-reading results, and consonant-versus-assonant contrast. Initial failures exposed diphthong handling for bailar, hiatus in poesía, the French peur vowel and missing emociones. These were fixed against source evidence. Automated success is not native human acceptance.

## Independent review packet

Ask a qualified native songwriter/phonologist to record region/dialect and inspect:

- French positives: amour/jour, lumière/poussière, cœur/sœur, peur/fleur, main/pain, temps/blanc.
- French negatives: père/peur, vent/vin, bon/banc, roue/rue. Explain regional mergers rather than marking every variant universally wrong.
- Spanish positives: canción/corazón, canciones/emociones, cantar/bailar, alegría/poesía, sueño/dueño.
- Spanish negatives: camino/caminó, público/publicó, término/terminó, canto/cantó; evaluate consonant and assonant modes separately.
- Search absent/slang words and confirm an honest no-entry message rather than invented pronunciations.
- Review visible native copy, accent marks, ordering usefulness, potential offensive/rare suggestions, and mobile controls.
- Write two actual lines using a suggested pair; judge meaning and performed rhythm rather than isolated matching only.

Acceptance requires reviewed examples, explicit dialect scope, correction resolution and reviewer permission for any public attribution. No native reviewer has accepted this release yet; public copy states this. Do not turn an unanswered request into a testimonial or paid obligation.

## Browser checks

Real browser lookup returned French peur results including heure, cœur, docteur and sœur, with /œʁ/ endings. Spanish canción returned /on/ candidates. Full dictionaries load only on first search into a worker, with size bounds and SHA-256 integrity validation; failed loads expose a retry message. No query is transmitted to analytics. Native-page static methods, limits, sources and examples remain readable without JavaScript.

## Regional review requests, 16 October 2026

France and Mexico requests were followed by distinct Québec and Spain requests through verified songwriting-education contacts. The Québec request explicitly asks about France-derived pronunciation limits; the Spain request asks about stress, consonance/assonance and regional readings. Both include browser links and small concrete review exercises. No fee was agreed. Independent native editorial acceptance remains **pending**. A model-generated critique or automatic test result cannot close this gate.
