# 0003: Live Cadence handset with verified screen textures

## Status

Accepted

## Context

The pre-rendered handset clips remained recognisable as rectangular videos and could not provide continuous spatial motion across product chapters. Removing CSS borders did not make the product feel native to the page. The product still needs real, inspectable app pixels and safe fallbacks on constrained devices.

## Decision

Export the approved Blender handset as an optimised GLB and render it in the browser with a vendored, pinned `@google/model-viewer` runtime. The hero, workflow and feedback pages use separate GLB files so each renderer owns its material state. Real Cadence recordings drive the handset's emissive screen through a canvas texture; the feedback page uses a verified still texture. Scroll position selects the active chapter, seeks its screen recording and interpolates the camera orbit.

The browser falls back to existing WebP posters when WebGL is unavailable, reduced motion is requested or data saving is enabled. Product text and calls to action remain semantic HTML. The GLBs are processed with glTF Transform using Draco geometry compression and WebP textures; Blender sources remain on Clevo.

## Consequences

- The handset is real browser-rendered geometry, not a floating screen recording or boxed pre-render.
- One persistent phone can carry a song through capture, rhyme, arrangement, mix and themes without repeating a presentation frame.
- Current app footage remains the sole interface authority; generated UI is prohibited.
- The model-viewer runtime and GLB add initial transfer and GPU work, mitigated by lazy loading, sub-200 KB optimised models and static fallbacks.
- Screen material names are now a web integration contract. Blender exports must retain `MAT-F03V5-screen-b01-v8-library`.
