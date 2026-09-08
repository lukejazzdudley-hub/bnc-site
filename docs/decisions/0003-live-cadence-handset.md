# 0003: Live Cadence handset with verified screen textures

## Status

Accepted

## Context

The pre-rendered handset clips remained recognisable as rectangular videos and could not provide continuous spatial motion across product chapters. Removing CSS borders did not make the product feel native to the page. The product still needs real, inspectable app pixels and safe fallbacks on constrained devices.

## Decision

Export the approved Blender handset as an optimised GLB and render it in the browser with a vendored, pinned `@google/model-viewer` runtime. The hero, workflow and feedback pages use separate GLB files so each renderer owns its material state. Real Cadence recordings drive the handset's emissive screen through a canvas texture; the feedback page uses a verified still texture. Scroll position selects the active chapter, seeks its screen recording and interpolates the camera orbit.

Only the active chapter may commit a decoded frame to the shared canvas. Late `loadeddata` or `seeked` events from preloaded chapters are ignored, preventing an earlier Library frame from overwriting the visible rhyme, arrangement or mix state. Public screen media replaces the captured 174-pixel operating-system status strip with the sampled app background while retaining the original 1206×2622 aperture ratio and native UI scale, so time, signal and battery indicators never appear and the interface remains aligned to the handset.

The exported handset contains a baked diagonal root pose, so the web experience applies a correcting model orientation before choreography. Model Viewer interprets `orientation` as roll, pitch, then yaw; the integration names and interpolates those axes explicitly. Smoothstep easing maps the complete story's scroll progress to one continuous physical pose while chapter-local progress still seeks the relevant product recording linearly. This prevents both a permanently tilted product and the chapter-by-chapter wobble caused by repeatedly restarting the pose.

The hero uses the approved seeded, unfiltered demo-library capture. Its web texture crops captured device chrome while preserving the app pixels and display aspect. A hero capture showing a search result or otherwise sparse library is not an acceptable substitute. The theme finale holds the central phone and reveals two additional real GLB instances with locked cyan and orange screen textures, making the three-theme comparison simultaneous rather than replaying a colour swap on one device.

The browser falls back to existing WebP posters when WebGL is unavailable, reduced motion is requested or data saving is enabled. Product text and calls to action remain semantic HTML. The GLBs are processed with glTF Transform using Draco geometry compression and WebP textures; Blender sources remain on Clevo.

## Consequences

- The handset is real browser-rendered geometry, not a floating screen recording or boxed pre-render.
- One persistent phone carries the workflow through capture, rhyme, arrangement and mix; the theme finale expands it into three coordinated phones without repeating a presentation frame.
- Current app footage remains the sole interface authority; generated UI is prohibited.
- The model-viewer runtime and GLB add initial transfer and GPU work, mitigated by lazy loading, sub-200 KB optimised models and static fallbacks.
- Screen material names are now a web integration contract. Blender exports must retain `MAT-F03V5-screen-b01-v8-library`.
