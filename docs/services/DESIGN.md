# Client services — design and implementation decisions

The supplied 26 October brief is the accepted implementation direction. It adds client services alongside the existing product studio, without changing Cadence's product journey. Brand Name Changes Ltd, company 17297548, is based in Bristol and serves Bristol, London and remote UK clients.

## Layout and visual contract

The studio homepage leads with the client-services offer, two visible enquiry links and a large selectable concept showcase. Products remain available in their existing catalogue. The services page presents the practical offer and process before a full-size comparison and distinct case studies.

Both sides of the wine comparison contain a complete rendered page: heading, photograph, supporting copy, booking action and footer. A labelled native range controls the reveal. It has no scroll-driven auto-reveal and never deliberately exposes an empty wireframe. The full concept remains a normal link.

The concepts have independent navigation, composition, typography and customer journeys:

- Harbour & Vine: a photographic opening, pointer-sensitive glass/heat refraction, a reversible desktop scroll chapter, a populated three-state menu and table-booking demo. Mobile uses normal flow for the chapter.
- Volt & Co: a warm architectural lighting study, native dimmer, service selection and matching example estimate. The rejected plug model and renderer have been removed.
- Still Room: an original sculptural image with a sampled particle field. Release, Align and Move change the field; appointment choices preselect the demo. The visual study makes no claim to simulate anatomy or treatment.

`work-with-us/effects/field.mjs` implements original bounded WebGL shaders without an added renderer dependency. Motion 12.23.24 remains pinned locally for restrained entrances. Motion, Kokonut and Bklit documentation was consulted; no React runtime or chart library is introduced. Meaningful content remains static HTML; all decorative graphics have complete original-image fallbacks. Renderers start near the viewport, cap resolution, run around 30 fps and stop off screen, when hidden or under reduced motion. Initial reduced-motion, save-data and unavailable-WebGL states do not create a visible canvas.

Original imagery and code are credited in CREDITS.md. Reference research informed media scale, pacing and input response; no reference studio's code, imagery or shaders were copied. Technical acceptance is distinct from Luke's assessment of creative quality.

## Architecture

- `content/studio.mjs`: approved services, process, FAQ and fictional concept records.
- `scripts/build_studio_pages.mjs`: reusable server-rendered form markup and complete static routes. Run after existing editorial generators.
- `work-with-us/`: presentation, progressive interactions and shared validation model.
- `contact/`: same form, plus fixed noindex native success/error pages.
- `services/`: canonical alias via HTML refresh, with a usable link fallback. GitHub Pages has no configurable server redirects.
- Supabase `studio-enquiry`: bounded native form POST or JSON response for enhanced submissions, Resend delivery and fixed native redirects.
- Abuse-counter migration: service-role-only atomic rate limiting; no enquiry-message storage.

## Reference inspection and rejected work

Luke explicitly rejected the initial illustrated widgets and the subsequent shared left-title/right-object layout. Neither is an accepted creative control. The final independent concept compositions replace those versions.

REA 6.8.0 was run locally against an isolated Chrome page at `https://lusion.co/projects`, using `list-browser-targets` then `inspect-web-page` with exact-origin scoping. Evidence ID: `ev_5ece3dc15813d3de56fffb0e45d11c08459731735eb49e7fad917d4bdf5e70aa`. It observed the page's DOM/accessibility, two scripts, ten resource records and capture limitations. A 1,251,702-character module was observed; script source capture was not selected. Browser captures separately informed the oversized editorial title, media scale and input response. These observations establish neither the complete renderer implementation nor a reproduction of it. No Lusion code, fonts, images or shaders were copied. The npm runtime reported a Node engine-version warning but both REA observation commands completed; no global agent configuration was changed.

## Deliberate boundaries

No framework migration, analytics addition, DNS change or business-listing change. Luke authorised live publication through the existing GitHub Pages deployment. Fictional concept pages are noindex and outside the sitemap. Their displayed quote figures are explicitly mock data, required for the requested interactive estimate; no studio prices are published.

Native scrolling is retained. Explicit anchor clicks use browser smooth scrolling; there is no wheel hijack. Exponential easing runs only while the comparison is moving and visible. Reduced motion leaves a static comparison and native interactions. Headline text and forms remain available without JS.

The client timestamp is an optional timing signal, not proof of humanity. Native no-JS submissions omit it and still receive honeypot, validation and durable per-network hourly rate limits. Treating an empty timestamp as an error would break the required native form. Tokens or CAPTCHA would require a different host-rendered form architecture. Native error redirects contain no personal data; enhanced failures retain the filled form. No successful result is shown until the email provider accepts delivery, except deliberate honeypot discards.

## Homepage correction after launch

Luke reported that the domain landing page still behaved as a product-only funnel. Inspection confirmed a Cadence-only hero and a services section roughly 2,400 pixels below the top on desktop. The hero now uses the approved business-services offer and directly links Work with us and Start a project; both actions are checked for actual ancestor opacity, rendered visibility and viewport placement at 320, 390, 768 and 1440 px with JavaScript enabled and disabled. The override must include html.js to beat the legacy animation selector. A regression contract prevents the rotating product-name hero from returning. The broader visual/motion redesign remains separate work.

## Volt identity correction

Luke preferred Volt's earlier lightning wordmark, lime-on-dark palette and oversized SWITCH ON heading. Restore that accepted direction without restoring the rejected plug. The architectural study is now paired with a separate electrical control panel: a real on/off switch, native dimmer, current graphic and the existing estimate journey. The service section reverses to lime. Its scoped identity stylesheet keeps it distinct from the studio. The clinic's earlier `( sr )` lockup and colour-matched credit return; each concept has its own favicon and sharing artwork rather than the BNC mark/card.
