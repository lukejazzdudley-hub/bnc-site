# Changelog

## Unreleased

### Added

- Cadence’s buying-guide recommendation now covers beat-first, lyric-first and freestyle-first songwriting, including beat import, rehearsal, transcription, takes and arrangement—not only lyric writing.

- The buying guide now compares 11 songwriting tools with linked primary sources, clear buying caveats and workflow-specific recommendations. Quick-pick cards and a mobile-scrollable table make the shortlist easier to use; Cadence’s ownership and recommendation criteria are explicit.

- Resource articles now open with descriptive titles, reading-time estimates and direct reading links. Related guides connect the next step; comparison tables remain readable and keyboard-scrollable on phones. More compact headers, silver controls and clearer copy bring the hub closer to the main Cadence experience.

- A songwriting resource hub connects six practical writing/demo guides, four sourced app-buying comparisons and the five existing tools and walkthroughs. Articles include worked examples, contents navigation and contextual links back to the Cadence workflow.

- Songwriting guides and the rhyme finder now share Cadence’s onyx-and-silver visual identity, with responsive background lighting, authentic product imagery and a comparison of writing workflows. Artist-first messaging emphasises your authorship rather than generated lyrics.

- Multi-word rhyme searches now compare sounds across word boundaries, including “ice cream” / “I scream”. A separate Phrase endings option retains final-word matches, and the small curated bank's coverage is clearly stated.

- The browser rhyme finder adds conservative slant matches and curated multi-word endings, filters English name noise, and downloads a smaller verified dictionary only when searched. Other language choices clearly show their pending availability.

- Visitors can find English perfect and multisyllabic rhymes privately in their browser, without an account.
- New guides cover songwriting, rap writing, voice-memo transcription and the Springtime Showers arrangement workflow, with real app footage.
- Search engines can discover the website through a sitemap, canonical pages and structured metadata.

- Cadence now opens on the source-locked V3 populated Library scene and closes its product story with a separately authored three-theme composition, both driven directly by scroll with desktop/mobile camera work preserved.
- The V3.2 visual repair lifts the Library capture into its correct handset registration and replaces the theme trio's coloured edge halos with restrained neutral reflections.

- Cadence now renders its approved Blender handset as live 3D in the browser, with real product footage changing on the device as visitors move through the workflow.
- The feedback page now uses the same live, scroll-responsive handset with a verified product screen on phone layouts.
- Cadence now has a conversion-led product experience built from real app captures, a purpose-rendered Blender handset, five connected workflow moments, 27-theme proof and direct iOS/Android beta entry points.
- Product demonstrations now move with the page as visitors scroll, reverse when they scroll back and fall back to composed posters without downloading video for reduced-motion or data-saving visitors.
- Cadence testers can send structured private feedback directly at `/cadence/feedback/`, recover typed progress on the same device, and attach resumable screenshots or screen recordings.
- Existing Google Form responses can be imported once without duplicates and exported without internal security metadata.

### Fixed

- The English rhyme finder no longer puts obscure word-game entries such as “ais” ahead of useful words. Suggestions now use spelling checks, common-usage filtering and closer-sound ranking, while valid rare words remain searchable.

- Search pages now use Cadence’s established transparent animated mark, with its reduced-motion fallback, instead of the boxed app icon.

- The Cadence privacy policy now matches the app's explicit analytics consent: product analytics and Crashlytics stay off until the user enables Help improve Cadence.
- Cadence links now open the canonical `/cadence/` page directly, removing the visible white compatibility redirect during navigation; legacy links retain their query string and anchor on a dark fallback.
- V3 scenes release their WebGL context after leaving view and create a fresh canvas when revisited, preventing off-screen GPU memory accumulation without breaking reverse scroll.

- Replaced the empty, filtered hero screen with the approved populated demo library, registered it to the handset aperture and removed the captured status bar.
- Replaced the handset's permanent diagonal pose and chapter-by-chapter wobble with one upright, continuous 3D path that reverses with the page.
- The theme finale now reveals three real handsets together in cyan, magenta and orange instead of changing one phone's screen in place.
- Locked the handset to the active product chapter so delayed media events cannot restore an earlier screen, and removed captured time, network and battery chrome from every screen texture.
- Removed the remaining boxed-video presentation and stale operating-system status chrome from the live product experience.
- Prevented hero, workflow and feedback handsets from sharing screen-material state, and reduced each web model from 3.46 MB to under 200 KB.
- Integrated the Cadence product demonstrations directly into the page without presentation boxes, random backgrounds, fake media controls or unrelated decoration.
- Rebuilt every workflow demonstration inside the verified Blender handset using status-free captures from the populated demo account.
- Kept one real `Signal in the Gold` editor state on one handset while Arctic, Neon and Crimson change around it.
- Replaced the square navigation icon with the animated silver Cadence mark and kept a compact 3D product view visible on the mobile feedback page.
- Increased the persistent mobile beta action to the required 44-pixel touch target.

- Cadence theme previews now preserve their source proportions across desktop widths instead of stretching, overlapping copy or clipping below the viewport.
- Replaced the sparse Cadence landing page with accurate product evidence for capture, Draft Demo, five rhyme families, arrangement, DAW, vocal effects and export—without unsupported testimonials, prices or trial promises.
- Cadence product and support pages now describe the current feature set, 27-theme catalogue, three-note free tier, platform support and storefront-controlled plan options accurately.
- Removed dead download links, visitor-facing TODO text, a false trial claim and hard-coded prices.
- Preserved `/cadence` while adding nested feedback routes by moving the canonical page to `/cadence/` and retaining a compatibility redirect.
- Prevented duplicate responses when optional evidence verification is interrupted, and documented beta-feedback handling in the privacy policy.
- Fixed the deployed feedback service's production identifier generation so valid submissions can be stored.
- Routed signed evidence transfers through Supabase's dedicated resumable-upload endpoint.
