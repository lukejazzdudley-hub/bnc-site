# Client services — design and implementation decisions

The supplied 26 October brief is the accepted implementation direction. It adds client services alongside the existing product studio, without changing Cadence's product journey. Brand Name Changes Ltd, company 17297548, is based in Bristol and serves Bristol, London and remote UK clients.

## Layout and visual contract

Ink #0a0a0a, panel #101111, ivory #f4f1ea, secondary #aaa9a4, quiet accent #c9d6d2. Geist carries the main services page and Geist Mono carries short labels. Services use a twelve-column layout, 2vw gaps (4vw mobile), and max(6vw,24px) outer margins. The single signature interaction is a cursor/scroll-controlled clip-path repaint from a generic small-business layout into an original fictional wine-bar design. Everything around it is restrained. The wine bar uses original generated photographic artwork, a centred masthead and circular booking action. The electrician uses an authored three-pin plug/cable scene, an input-driven circuit and graphic utility layout. The clinic uses original generated sculptural artwork, a responsive contour field and a separate appointment composition. No stock assets, client logos or invented results.

The reference sites informed restraint, input response and coherent art direction, not copied implementation or assets. Lusion's projects site and all seven reference URLs were consulted; some heavy client-rendered pages expose little readable content to the web reader. No claim of reproducing their WebGL or award-level quality is made. Motion, Kokonut and Bklit documentation was consulted as required by AGENTS.md. Pinned, locally hosted Motion 12.23.24 supplies concept entrances. The rest uses native clip-path, Web Animations, semantic details, form controls, authored Canvas2D and the existing Three.js runtime. No React integration or chart library is needed. Existing homepage anime.js 3.2.2 is self-hosted, retaining its MIT licence.

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

No framework migration, production deployment, analytics addition, DNS change or business-listing change. Fictional concept pages are noindex and outside the sitemap. Their displayed quote figures are explicitly mock data, required for the requested interactive estimate; no studio prices are published.

Native scrolling is retained. Explicit anchor clicks use browser smooth scrolling; there is no wheel hijack. Exponential easing runs only while the comparison is moving and visible. Reduced motion leaves a static comparison and native interactions. Headline text and forms remain available without JS.

The client timestamp is an optional timing signal, not proof of humanity. Native no-JS submissions omit it and still receive honeypot, validation and durable per-network hourly rate limits. Treating an empty timestamp as an error would break the required native form. Tokens or CAPTCHA would require a different host-rendered form architecture. Native error redirects contain no personal data; enhanced failures retain the filled form. No successful result is shown until the email provider accepts delivery, except deliberate honeypot discards.

## Homepage correction after launch

Luke reported that the domain landing page still behaved as a product-only funnel. Inspection confirmed a Cadence-only hero and a services section roughly 2,400 pixels below the top on desktop. The hero now uses the approved business-services offer and directly links Work with us and Start a project; both actions are visible without scrolling at 390 and 1440 px. A regression contract prevents the rotating product-name hero from returning. The broader visual/motion redesign remains separate work.
