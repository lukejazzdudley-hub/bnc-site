# Cadence search and guide design review

16 October 2026. Scope: public product, acquisition pages, resource hub/articles, six region guides, two product locales, three rhyme tools, type-beat walkthrough and feature guide. Preserve the accepted Onyx palette, authentic native UI, source-backed copy and static crawlable content.

## Findings and changes

1. The feature manual was a long unillustrated opening followed by a large contents list. Added a split hero with a complete handset, a direct Find a tool action, four workflow anchors, local contents lookup and a desktop sticky contents rail. Numbered steps, location callouts and contained screen figures create a consistent reading rhythm. On mobile the contents stays in normal page flow.
2. Older acquisition templates used flat screen crops. They now reuse the approved whole-handset editorial renders with accurate alternate text and version captions. Regional illustrations already used that treatment; corrected the library image’s reserved aspect ratio.
3. French and Spanish results had no matching English results-card styling. They now use the shared silver/onyx cards, readable pronunciation captions, a full-width submit action, 44px example buttons and narrow-screen form layout. Loading/error/empty messages remain the functional tool’s existing status announcements.
4. Guide discovery differed across templates. Product, resources/articles, acquisition, region/language, localised footers, tools, walkthrough and support now offer paths to the guide, with English identified where appropriate.
5. Optional 3D uses the existing optimised handset, pinned renderer and screen-texture initializer. It is explicitly loaded, keyboard-rotatable and resettable, with a Use still image action. Reduced motion and data saving retain the poster. No autoplay or background render loop was added. No custom font, remote vendor or new image payload was introduced.

## Browser evidence

- All 35 Cadence sitemap pages checked at 320px and 1440px: no horizontal overflow; one H1 each. No broken loaded images in the mobile pass. This is browser layout evidence, not user visual acceptance.
- Guide checked at 320/375/390/430/768/1024/1440: poster stays within its reserved height, mobile contents flows normally, desktop contents is sticky. Mobile hero, handset and French result cards visually reviewed.
- 3D actually loaded with screenBound/controllerReady. Keyboard ArrowRight, Reset view and Use still image exercised; closing removes the model and returns focus to Explore in 3D.
- A separate local fault server returned503 for the renderer. The guide retained its poster and all14chapters, displayed a retry message and allowed feature lookup. Test server stopped afterwards.
- Feature lookup: voice→one matching contents entry, nonsense→helpful empty state, clear→all entries; chapter prose remains available throughout. A unit regression covers network-quality notifications without a preference change, which must not close the view.
- French amour returned93cards, no overflow. Source/dictionary limitations unchanged. Keyboard controls and ordinary anchors remain native elements.
- Fixed two issues found during implementation: intrinsic poster size overflowed its aperture, and an unrelated connection-change event could reset the view. Rechecked after both fixes.

## Release gates and limits

93 Python +145 Node +42 Deno tests passed; guide/phone modules checked. Crawl audit:40URLs35Cadenceroutes0errors. Gitleaks: no leaks. Slop scan: same14findings as before, none in new guide code. Static manual remains complete without JavaScript; feature lookup and 3D are optional enhancements. Reduced-motion/data-save behavior has deterministic unit/source coverage, not a physical-device preference acceptance claim.

The existing product’s authored 3D scenes and app media are preserved. No app interface or recording behavior changed. Existing app imagery remains illustrative, not proof of current-store-binary controls. Performance after deployment must be checked independently; no new field Core Web Vitals result is claimed here.
