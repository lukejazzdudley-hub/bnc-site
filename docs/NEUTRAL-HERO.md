# Cadence neutral hero refresh

Approved 19 September 2026: replace the purple-lit hero, tighten whitespace and
use the accepted Onyx white/silver typography. Preserve copy, real screen colours,
store links and the product demonstrations below the hero.

The hero now uses the existing Blender `resources/01-library-neutral.webp`,
instead of the V3 hero GLBs and their purple-lit posters. It is an eager,
high-priority image with intrinsic dimensions and does not require JavaScript or
WebGL. This trades the hero's floating-layer animation for a consistent neutral
render; the four scroll-driven workflow videos and live theme scene remain.
No native screen content was regenerated or recoloured.

The smaller desktop handset and tighter type scale keep downloads alongside the
product. Mobile puts downloads before the handset. Navigation collapses at 960px
to avoid crowded tablet labels; closed links are hidden from keyboard focus.
Reduced-motion navigation has no transition.

Verification: Python content contracts and Node media tests; browser checks at
320, 390, 768, 1024 and 1440px for overflow, image loading, menu open/close and
absence of obsolete hero GLB requests. Screenshots inspected at desktop/mobile.
