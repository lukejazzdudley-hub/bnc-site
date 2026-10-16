# Preferred web-design stack

Luke explicitly selected Motion, Bklit UI and Kokonut UI on 16 October 2026. These are the preferred sources for subsequent website design work, alongside the accepted Cadence Onyx visual identity.

| Tool | Role | Official reference |
| --- | --- | --- |
| Motion | Animation, gestures, scroll-linked interactions; JavaScript or React as appropriate | https://motion.dev/docs/quick-start |
| Kokonut UI | Interactive UI components, chosen for the actual visitor task | https://kokonutui.com/docs |
| Bklit UI | Charts and data visualisation when a page has relevant data to explain | https://bklit.com/docs |

The current website remains plain HTML/CSS/JavaScript. No runtime from these libraries is installed by this documentation change. Existing 3D uses the already pinned model-viewer/Three.js setup; the preference does not replace it.

Motion supports a direct JavaScript integration. Kokonut UI documents React, Tailwind CSS and its shadcn registry; Bklit UI also documents React/shadcn components. A future implementation must identify a suitable component, verify its current source/licence/dependencies, then choose an integration that preserves complete static HTML and ordinary links. Do not describe adapted styling as an installed library component.

Do not add unrelated animated decoration or fabricated chart data. Keep primary actions readable, focus visible, touch targets usable and reduced-motion/data-saving fallbacks complete. Record the selected component, dependency revision, bundle impact and browser/performance evidence with its actual implementation.

This establishes a design preference. It does not claim the current pages have been rebuilt with these libraries or make new performance claims.
