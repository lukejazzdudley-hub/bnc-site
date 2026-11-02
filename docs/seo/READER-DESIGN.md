# Cadence SEO reading design

The previous search and language templates treated long-form instruction as a
single dark column. The studio-handbook treatment separates a graphite product
opening from a cool silver reading surface, with an anchored contents rail,
visible reading position, deliberate list hierarchy and authentic product renders.
Existing copy, route names, schema, canonicals and authored anchors are preserved.

Palette: graphite #101720, silver #edf0f4, ink #202c3c, secondary #506074,
interaction blue #244a79. The existing locally hosted Geist font carries headings
and body; platform fonts cover scripts outside its subset. Paragraphs stay at
65ch maximum. Numbering is limited to authored ordered instructions. Mobile
contents are a native disclosure; tool heroes become compact so search controls
are reachable sooner. Arabic/Hebrew use logical direction and spacing.

`reader-layout.mjs` runs at generation time for search, international and Romance
tool pages. It inserts static navigation and preserves original sections. Complete
content, links and disclosure remain available without JavaScript. The browser
module adds reading-position feedback and loads the existing pinned Motion12.23.24
bundle (81,378bytes uncompressed) only after a contents click, and never for reduced
motion or saveData. No persistent state or additional analytics are introduced.

Kokonut Scroll Index is a navigation reference, not an installed component. Its
React registry is not introduced into the static site. Bklit was reviewed; these
pages have no data-chart requirement. Motion's JavaScript API is used directly.
No product imagery or native UI is fabricated. Existing renders retain their
version caveat. The main product experience and its 3D controls are unchanged.

Validate generated anchor graphs and content invariants with reader_layout.test.mjs
and the site suites. Check short/long guides, RTL, Japanese, mobile acquisition,
and actual browser-tool results at the seven documented widths. Keep screenshots
and acceptance observations private. A successful automated check does not mean
Luke has accepted the aesthetic.
