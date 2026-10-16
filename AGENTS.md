# Brand Name Changes / Cadence website

Read `docs/ARCHITECTURE.md` and `docs/DEVELOPMENT.md` before implementation. Preserve the accepted Cadence Onyx treatment, real product imagery and existing feature copy. Use the shared Obsidian/Qdrant memory described in Luke's global instructions.

## Web-design stack — Luke's explicit preference

Use Motion (motion.dev), Kokonut UI and Bklit UI for web design. Consult their current official documentation and component catalogues before hand-building an animation, interactive component or chart.

- **Motion**: animation, gestures and scroll interactions. Its JavaScript API supports this static site directly; use the React API inside React components.
- **Kokonut UI**: first choice for suitable interactive components. Use its official registry/source, preserve licensing and adapt the visual treatment to Cadence. Clearly distinguish installed components from design references or ports.
- **Bklit UI**: first choice for relevant charts and data visualisations. Use real data or explicitly labelled examples; do not invent metrics or add unrelated charts merely to use the library.

This specifies the preferred tools, not a request to replace working pages wholesale. Keep content rendered in HTML, stable anchor navigation and the existing optional 3D experience. When a component needs React/Tailwind, choose a bounded integration and explain its build/runtime impact; do not silently convert the whole site to client rendering.

Pin dependencies, serve approved assets locally, preserve reduced-motion/data-saving behavior and keyboard/touch access, and measure bundle/loading impact. Follow the normal validation and responsive release gates. See `docs/WEB-DESIGN-STACK.md`.
