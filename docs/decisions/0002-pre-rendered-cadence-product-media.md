# 0002: Pre-rendered Cadence product media

## Status

Accepted

## Context

The Cadence page needs premium spatial presentation and convincing feature evidence. A live 3D scene would add runtime dependencies, memory pressure and mobile-GPU variability. Generic mockups or generated interfaces would weaken trust because they cannot prove the current product.

## Decision

Use two complementary source layers in one presentation system:

1. approved, checksum-locked captures from the populated Cadence demo account as the only screen-content authority; and
2. controlled Blender renders of the approved physical handset for the hero, each workflow feature, themes and feedback intro.

Publish optimised H.264/WebP derivatives only. Every MP4 is silent yuv420p with faststart and a six-frame GOP. A small browser module leaves media paused and seeks the active clip from page-scroll progress, including reverse scrolling. It does not attach MP4 sources for reduced-motion or data-saving visitors. Keep text and calls to action in semantic HTML instead of baking them into video.

## Consequences

- The page gains authored 3D depth without shipping Blender, WebGL or a large scene to visitors.
- Product claims remain inspectable and accurate because every screen texture comes from the real app and is recorded in the capture manifest.
- The product always appears as a physical handset; raw floating screen recordings, generic device frames, random stages and invented interface graphics are rejected.
- Static posters preserve meaning and visual composition when motion is unavailable.
- Source scenes and master captures require separate provenance and archival discipline in the controlled asset library.
- Updating the interface requires regenerating affected derivatives on Clevo and rerunning checksum, media, accessibility and the 320–1440 responsive-browser matrix.
