# Maintaining the Cadence feature walkthrough

Route: `/cadence/guide/`. This is a single static user manual, with one primary workflow per anchor, not a collection of duplicate keyword pages. Source: `content/feature-guide.mjs`. Renderer: `scripts/build_feature_guide.mjs`, called by the fourth generator `scripts/build_growth_pages.mjs`.

The initial guide was checked on 16 October 2026 against current app source and existing verified captures. It is not a claim that every current store binary has the same UI. Existing screenshot captions identify version differences; the prose distinguishes current Settings categories from older Profile navigation. It does not claim that a Pro export was performed during this review.

## Update with an app release

1. Check the actual menu entry, label, prerequisites, gesture, result and failure/missing-control state for every changed workflow. Review both Android and iOS where their controls differ.
2. Edit the relevant chapter’s `where`, `steps`, `result`, `tip` and related links together. Keep existing chapter IDs stable so saved help links continue working. Add a redirect or retained anchor if a section must be renamed.
3. Update `checked` only after reviewing the paths again. The date is used in visible HTML and structured metadata; editing unrelated copy does not establish a new UI review.
4. Run `python3 scripts/check_feature_guide_sources.py --app-root /path/to/cadence` for a narrow label-drift check. Update the evidence file after verifying intentional UI changes. This catches renamed/missing source labels, not visual usability or complete behavior.
5. Regenerate all four site generators, run the normal validation, check mobile/keyboard/no-JS reading and deep links, then publish. The collector’s route allowlist must include the guide; it collects only optional aggregate page/store counts, never guide searches or app content.
6. Replace a screenshot only with verified app evidence. Keep the whole device/content legible, preserve reduced-motion behavior, and do not imply an old capture is the new build. Update its caption and provenance when the source changes.

## Important distinctions retained

- Rhymes on/off toggles highlighting; Song actions → Rhymes opens the inspector.
- Live line syllable count differs from song totals and syllable-level highlighting.
- Language pack priority differs from interface translation; mixing mode differs from order.
- Record a memo differs from recording into a focused arranger section or an armed DAW track.
- Build in DAW updates draft-generated clips inside Cadence; an existing build requires the update confirmation described in the guide.
- A one-WAV mix differs from aligned silence-padded stems. Stems are audio, not a native third-party DAW project or editable plugin settings.
- Lyric/cloud/text copies differ from local recordings, beats and arrangements.
