# Feature guide release review

Checked 16 October 2026. Public route: `/cadence/guide/`.

The manual covers 14 workflows: starting a song, voice memos, audio import, transcription, syllables, rhyme inspection, language order/mixing, beat loops/markers, draft sections, section takes, internal DAW building, DAW recording/mixing, external WAV export and settings/copies. Each has a location, ordered steps, result, practical limit and related link. Stable chapter anchors allow support links to survive copy updates.

Evidence: current app source paths and labels in `feature-guide-evidence.json`, plus four existing app captures. Source-label guard passes across nine files. This is source verification, not a fresh hands-on acceptance test of all Android/iOS store versions, Pro export or cloud backup. The visible guide states version differences.

Validation:

- All four generators completed; generated guide equals its source renderer.
- 93 Python, 142 Node and 42 Deno tests passed; four Deno entrypoints checked.
- Sitemap: 40 URLs; 35 reachable Cadence routes; zero crawl errors.
- Guide checked at 320, 375, 390, 430, 768, 1024 and 1440 CSS pixels: no horizontal overflow or broken loaded images. Mobile screenshot reviewed.
- Language anchor activated by click and section-recording anchor by keyboard Enter; both place the relevant heading at the viewport top. All guide prose and anchors are static HTML; reading does not depend on the optional measurement module.
- Product navigation checked at 320, 768, 1024 and 1440: no horizontal overflow; both guide entry links present.
- Gitleaks found no leaks. Slop scan reports 14 existing findings in vendor/other site code; no new guide renderer findings. No app code changed.

Maintenance: follow `FEATURE-GUIDE.md` with every app navigation change. Passing the narrow label check does not replace release UI review.
