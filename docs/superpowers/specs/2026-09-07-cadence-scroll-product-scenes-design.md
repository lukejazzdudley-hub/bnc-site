# Cadence Scroll-Driven Product Scenes

## Purpose

Rebuild the Cadence product media so it feels authored into the page rather
than placed inside decorative boxes. Product demonstrations must respond to the
visitor's scroll, every interface capture must match the current app, the
navigation must use the locked animated Cadence mark, and the private feedback
page must gain a compact 3D product moment that remains practical on phones.

The website must preserve product trust. A polished composition is not allowed
to conceal a stale screen, an invented control or inconsistent source material.

## Locked decisions

- The approved Blender handset is exported as an optimised live GLB and rendered
  in-browser. Only verified captures from the current app may drive its screen.
- Product demonstrations are scroll-scrubbed. They do not loop independently
  of the visitor or continue playing off-screen.
- Visible rectangular media-stage borders, rounded presentation panels and
  unrelated decorative backgrounds are removed.
- The theme comparison uses one handset and one canonical editor state. Only
  the theme changes.
- The three current theme images are rejected. They mix Library and editor
  screens, include operating-system chrome, use inconsistent crops and contain
  a stale or incorrect in-app triangular control.
- The correct in-app control is captured from the current production-candidate
  app build. It is never redrawn, patched, obscured or substituted in the web
  compositor.
- The square app icon is removed from Cadence navigation. The locked animated
  silver script mark is used instead.
- The feedback page receives a 3D scene, but the form remains its primary task.

## Source authority and capture contract

The current populated Cadence demo account and current production-candidate app
build are the only interface authorities. The source capture checklist is:

1. Open `Signal in the Gold` in the editor, using the same note, lyric text,
   rhyme state, scroll position and selected controls for every theme.
2. Capture the approved Arctic, Neon and Crimson themes without navigating to
   Library between takes.
3. Remove the simulator or operating-system status region at export. No clock,
   battery, signal, carrier or development chrome may remain.
4. Use one exact content rectangle and pixel size for all three captures.
5. Confirm the current in-app control visually against the running build before
   accepting any capture.
6. Preserve real app typography and pixels. Do not generate, repaint or
   reconstruct interface text.

Each capture receives a small manifest recording build, platform, viewport,
account, project, screen, theme, control state and source checksum. A capture
that differs in any field other than theme is rejected from the theme sequence.

## Main-page composition

### Hero

The Blender handset remains the spatial introduction, but its square render
boundary must disappear. The web render is composited against the exact hero
canvas colour and the surrounding layout supplies open space rather than a
framed figure. The existing overlaid `Springtime Showers` caption is removed;
it repeats visible product information and currently behaves like a floating
card.

### Product scenes

Each workflow article becomes a scroll scene with two semantic parts: product
copy and an unboxed handset. On wide screens the handset remains briefly sticky
while the copy crosses its active range. On narrow screens the handset occupies
a bounded area beneath the scene heading and never traps the visitor in a long
pin.

The rejected `.cadence-media-stage` wrappers are removed. One persistent live
handset remains sticky while semantic product chapters pass beside or beneath
it. Depth comes from the actual handset geometry, controlled light and the real
interface motion.

### Theme scene

The three-phone fan is replaced by one consistent 3D handset. Scroll progress
changes its screen from Arctic to Neon to Crimson while the `Signal in the
Gold` editor remains geometrically fixed. Transitions preserve text position so
the visitor reads the change as a theme change rather than navigation between
unrelated screens.

## Scroll-motion model

Every product chapter exposes a verified screen source and scroll range. The controller:

- waits for video metadata before seeking;
- calculates normalized progress from the scene's actual position;
- maps progress to `currentTime` inside `requestAnimationFrame`;
- supports forward and reverse scrolling;
- draws decoded frames into the handset's emissive screen material and never depends on autoplay permission;
- updates only the active or nearly active scene;
- leaves all other videos paused;
- uses a poster when reduced motion or data saving is enabled; and
- restores a stable poster or first frame if seeking fails.

The current capture videos are re-encoded as muted, web-optimised H.264 MP4s
with `faststart` and frequent keyframes suitable for Safari seeking. Encoding
must retain readable interface text. Scroll updates write only video time and
CSS custom properties; they do not force synchronous layout on every event.

Reduced-motion visitors receive the same content hierarchy and final product
state without scroll-linked transforms. Data-saving visitors do not download
motion merely because it is hidden by CSS.

## Animated Cadence mark

The web mark is derived from the locked native `CadenceLogo` source without
altering its paths or timing:

- the C draws on over 760 milliseconds with the locked easing and settles from
  negative 16 degrees;
- the note begins after 310 milliseconds and drops over 800 milliseconds with
  the locked overshoot; and
- the final mark uses the locked silver metallic stops.

The production website consumes a small transparent pre-rendered animation and
a static transparent fallback rather than duplicating the square app icon. The
animation plays once on entry, does not loop, and is replaced by the final
static mark for reduced-motion visitors. The accessible brand name remains
text, so the animation is decorative and ignored by assistive technology.

## Feedback-page 3D treatment

The flat editor screenshot is removed. The introduction uses a live, unboxed
GLB handset derived from the approved Blender source and a verified still screen.

On phones:

- the scene is visible rather than hidden;
- its reserved height uses `clamp(180px, 52vw, 220px)` so the first form step
  stays close behind the introduction;
- scrolling through the introduction advances the handset entrance once;
- it scrolls away before the visitor begins sustained form entry; and
- it has no overlay caption, floating control or persistent animation.

On wider screens the scene sits within the introduction column without turning
the sticky aside into a continuously moving distraction. After its scroll range
finishes, it holds on a stable product frame.

The feedback fields, autosave, validation, evidence upload and submission
contracts do not change.

## Responsive and accessibility requirements

- No horizontal overflow at 320, 375, 390, 430, 768, 1024 or 1440 pixels.
- No product copy or controls may be obscured by sticky media.
- Media space is reserved before load to prevent layout shift.
- Navigation, form controls and media fallbacks remain usable at 200% zoom.
- The mobile form keeps visible labels, at least 44 CSS-pixel primary touch
  targets and an unobstructed focus order.
- Scroll-linked motion is disabled under `prefers-reduced-motion: reduce`.
- Product images and posters preserve their intrinsic aspect ratios.

## Verification

### Automated

- Unit-test progress normalization, forward/reverse seeking, inactive-scene
  pausing, metadata readiness, reduced motion and data-saving fallbacks.
- Contract-test the animated mark and static fallback, the feedback 3D asset,
  local media paths and the absence of the rejected flat feedback image.
- Browser-test every target width, scroll through every scene, and prove that
  current time changes monotonically in both directions without concurrent
  playback, console errors, broken media, overflow or layout shift.
- Run the existing Python, Node and Deno suites plus lint, type and secret
  checks before deployment.

### Visual

Before acceptance, compare each rendered capture with the live app and reject
any mismatch in text, screen, crop, theme, control, status chrome or aspect
ratio. Review full-page captures at 390, 768, 1024 and 1440 pixels. The person
or pass performing final visual verification must use the stated checklist and
must not infer correctness from the implementation itself.

### Production

After merge, wait for the exact GitHub Pages deployment commit, then repeat the
mobile and desktop scroll checks on `https://brandnamechanges.com/cadence/` and
`https://brandnamechanges.com/cadence/feedback/`.

## Acceptance criteria

The rebuild is acceptable only when:

- no workflow demonstration appears inside a decorative box;
- scrolling directly controls visible product progress and reversing the scroll
  reverses the demonstration;
- the theme sequence contains one screen, one crop and one current control state;
- no theme frame contains time, battery, signal or simulator chrome;
- the handset content fills its intended display aperture;
- the animated Cadence mark replaces the square app icon and respects reduced
  motion;
- the feedback page contains an integrated 3D product scene on a 390-pixel-wide
  phone without materially delaying the form; and
- local and production verification pass with no stale-media exceptions.

## Out of scope

This change does not modify the Cadence app interface, invent new screenshots,
change storefront claims, change the website's beta CTA, publish feedback or
alter form questions.
