# 0002: Pre-rendered Cadence product media

## Status

Accepted

## Context

The Cadence page needs premium spatial presentation and convincing feature evidence. A live 3D scene would add runtime dependencies, memory pressure and mobile-GPU variability. Generic mockups or generated interfaces would weaken trust because they cannot prove the current product.

## Decision

Use two complementary media sources:

1. a controlled Blender render of a physical handset for the hero; and
2. approved captures from the populated Cadence demo account for every feature claim.

Publish optimised H.264/WebP derivatives only. Coordinate playback in one small browser module, pause media outside the viewport or hidden document, and default to posters when reduced motion or data saving is requested. Keep text and calls to action in semantic HTML instead of baking them into video.

## Consequences

- The page gains authored 3D depth without shipping Blender, WebGL or a large scene to visitors.
- Product claims remain inspectable and accurate because feature footage comes from the real app.
- Static posters preserve meaning and visual composition when motion is unavailable.
- Source scenes and master captures require separate provenance and archival discipline in the controlled asset library.
- Updating the interface requires regenerating affected derivatives and rerunning media, accessibility and responsive-browser checks.
