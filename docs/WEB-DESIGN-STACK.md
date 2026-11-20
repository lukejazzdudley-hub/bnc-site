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

## Buyer shortlist, 12 November 2026

The current Motion, Kokonut input/navigation catalogue and Bklit documentation
were reviewed for the device/workflow comparison. Native select and details
controls preserve complete static HTML, keyboard support and the no-JS fallback
without adding React/shadcn for three filters. This implementation is native;
it is not an installed Kokonut component or a source port. No chart or numerical
score is appropriate to this vendor-documentation shortlist. It adds only two
small browser modules and scoped CSS to the buyer page, with no animation or
framework dependency. The silver decision surface uses the existing reader
palette inside the accepted Onyx identity. Verify actual bundle bytes and
network behaviour with the release record.

## Spanish dictionary, 16 November 2026

Reviewed the current Motion quick-start, Kokonut input/navigation catalogue and
Bklit component catalogue. This correction retains native form/details controls
and the accepted graphite/silver reader materials: no new animation, chart or
React runtime is warranted for a word lookup. It is not a Kokonut/Bklit port.
The page-specific stylesheet and build-time word cards preserve static HTML,
keyboard access and the existing lazy worker.

## Studio preview controls

The product cards adapt the two-label vertical hover and focus transition from Kokonut UI Slide Text Button 1.0.0 (MIT, Kokonut Labs, https://kokonutui.com/r/slide-text-button.json). Native links provide navigation and touch activation. The selected gallery capture uses the existing pinned Motion 12.23.24 browser build, loaded on interaction. Reduced motion and data saving keep selection immediate. The dotted canvas is a CSS pattern; it represents no data.
