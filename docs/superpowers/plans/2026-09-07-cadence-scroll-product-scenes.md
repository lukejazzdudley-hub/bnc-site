# Cadence Scroll Product Scenes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the boxed, independently looping Cadence media with capture-locked, scroll-scrubbed handset scenes, the exact animated silver Cadence mark, and a compact mobile-first feedback-page product scene.

**Architecture:** The website remains build-free HTML, CSS and JavaScript. Current app pixels are captured once under a strict manifest, composited into pre-rendered handset media on Clevo with Blender, encoded into paused H.264 videos with frequent keyframes, and scrubbed by a small requestAnimationFrame controller; reduced-motion and data-saving visitors receive posters without downloading video. The feedback form and commerce contracts remain unchanged.

**Tech Stack:** HTML5, CSS, ES modules, Node test runner, Python `unittest`, FFmpeg/ffprobe, Blender 5.0.1 on `clevo`, Google Chrome headless for deterministic mark rasterisation, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-07-cadence-scroll-product-scenes-design.md`

## Global Constraints

- Use `/Users/lukedudley/Developer/bnc-site/.worktrees/cadence-3d-product-page` on branch `codex/cadence-scroll-scenes`; do not modify the dirty primary checkout.
- Run Blender and bulk FFmpeg work on `clevo`; transfer only scripts, locked source captures and optimised outputs.
- The current populated Cadence demo account and current production-candidate app build are the only interface authorities.
- Preserve real app pixels. Do not generate, repaint, redraw, conceal or substitute interface text or controls.
- Reject the existing `theme-arctic.webp`, `theme-neon.webp` and `theme-crimson.webp` as source material.
- Theme inputs may differ only in `theme`; build, platform, viewport, account, project, screen, crop, content state and control state must match.
- No clock, battery, signal, carrier, simulator chrome or development chrome may appear inside a final handset display.
- Scroll controls paused video time in both directions. Scrub media never autoplays, loops or continues off-screen.
- Under `prefers-reduced-motion: reduce` or `navigator.connection.saveData === true`, retain the hierarchy and final product frame without requesting motion sources.
- The native paths and timings in `/Users/lukedudley/Developer/cadence/apps/mobile/src/components/CadenceLogo.tsx` are authoritative: 760 ms C draw, -16° settle, 310 ms note delay, 800 ms note drop and locked silver stops.
- Preserve feedback fields, validation, autosave, evidence upload and submission behaviour.
- Preserve storefront-controlled pricing language and the existing beta CTAs.
- No WebGL, Three.js, client-side Blender runtime, invented testimonial, invented product state or decorative presentation box.
- Verify widths 320, 375, 390, 430, 768, 1024 and 1440 pixels; primary touch targets remain at least 44 CSS pixels.

---

## File Map

- `scripts/cadence_capture_manifest.py` — records SHA-256-backed app captures and rejects theme-set invariant drift.
- `scripts/render_cadence_mark.mjs` — extracts locked native mark constants, rasterises deterministic transparent frames and builds animated/static web assets.
- `scripts/render_cadence_theme_scene.py` — reproducible Blender theme scene update and render entry point executed on Clevo.
- `scripts/render_cadence_feedback_scene.py` — reproducible compact handset entrance render executed on Clevo.
- `scripts/encode_cadence_scrub_media.sh` — one FFmpeg policy for Safari-seekable H.264 scrub assets and WebP posters.
- `assets/cadence/source-capture-manifest.json` — committed provenance and invariant record for approved product pixels.
- `assets/cadence/cadence-mark.webp` and `assets/cadence/cadence-mark-static.webp` — transparent animated-once navigation mark and static fallback.
- `assets/cadence/theme-scroll.mp4` and `assets/cadence/theme-scroll.webp` — one handset, one editor state, three theme states.
- `assets/cadence/feedback-handset.mp4` and `assets/cadence/feedback-handset.webp` — compact intro scene derived from the approved handset.
- `cadence/media-policy.js` — pure scroll/time policy plus DOM scrub controller.
- `cadence/index.html` and `cadence/cadence.css` — unboxed main-page scene markup and responsive layout.
- `cadence/feedback/index.html` and `cadence/feedback/feedback.css` — compact feedback scene without form-contract changes.
- `tests/cadence_media_policy.test.mjs` — scroll policy unit tests.
- `tests/test_cadence_capture_manifest.py` — capture manifest unit tests.
- `tests/test_cadence_media_assets.py` — encoding, dimensions, duration and local-asset checks.
- `tests/site_content_contract_test.py` and `tests/feedback_page_contract_test.py` — semantic and fallback contracts.
- `README.md`, `docs/DEVELOPMENT.md`, `docs/decisions/0002-pre-rendered-cadence-product-media.md`, `CHANGELOG.md` — operator workflow and user-visible change.

---

### Task 1: Capture provenance and invariant gate

**Files:**
- Create: `scripts/cadence_capture_manifest.py`
- Create: `tests/test_cadence_capture_manifest.py`
- Create during capture: `assets/cadence/source-capture-manifest.json`

**Interfaces:**
- Produces CLI `python3 scripts/cadence_capture_manifest.py record --manifest PATH --file PATH --build SHA --platform ios --viewport 402x874 --account cadence-demo-seeded --project signal-in-the-gold --screen editor --theme THEME --control-state current-large-beat-play --crop 0,177,1206,2445`.
- Produces CLI `python3 scripts/cadence_capture_manifest.py validate --manifest PATH --require-themes arctic neon crimson`.
- Produces manifest entries with `source_basename`, `sha256`, `width`, `height`, `build`, `platform`, `viewport`, `account`, `project`, `screen`, `theme`, `control_state`, `crop`, and `status_chrome`; it never commits an operator-specific absolute path.
- Later tasks consume a validation exit code of zero and capture files whose manifest entries differ only by `theme`, `file` and `sha256`.

- [ ] **Step 1: Write the failing manifest tests**

```python
class CaptureManifestTest(unittest.TestCase):
    def test_theme_set_accepts_only_theme_file_and_checksum_differences(self):
        entries = [capture("arctic"), capture("neon"), capture("crimson")]
        validate_theme_set(entries, {"arctic", "neon", "crimson"})

    def test_theme_set_rejects_status_chrome_and_invariant_drift(self):
        entries = [capture("arctic"), capture("neon"), capture("crimson")]
        entries[1]["screen"] = "library"
        with self.assertRaisesRegex(ValueError, "screen"):
            validate_theme_set(entries, {"arctic", "neon", "crimson"})
        entries[1]["screen"] = "editor"
        entries[2]["status_chrome"] = True
        with self.assertRaisesRegex(ValueError, "status_chrome"):
            validate_theme_set(entries, {"arctic", "neon", "crimson"})

    def test_record_uses_real_dimensions_and_sha256(self):
        entry = build_entry(self.capture, metadata(theme="arctic"))
        self.assertEqual(entry["sha256"], hashlib.sha256(self.capture.read_bytes()).hexdigest())
        self.assertEqual((entry["width"], entry["height"]), (1206, 2445))
```

- [ ] **Step 2: Run the focused tests and prove RED**

Run: `python3 -m unittest tests.test_cadence_capture_manifest -v`

Expected: FAIL because `scripts.cadence_capture_manifest` does not exist.

- [ ] **Step 3: Implement manifest recording and validation**

```python
INVARIANTS = (
    "build", "platform", "viewport", "account", "project", "screen",
    "control_state", "crop", "width", "height", "status_chrome",
)

def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()

def validate_theme_set(
    entries: list[dict],
    required_themes: set[str],
    source_root: Path | None = None,
) -> None:
    by_theme = {entry["theme"]: entry for entry in entries}
    if set(by_theme) != required_themes:
        raise ValueError(f"themes: expected {sorted(required_themes)}, got {sorted(by_theme)}")
    baseline = entries[0]
    for entry in entries:
        if entry["status_chrome"] is not False:
            raise ValueError("status_chrome must be false")
        for field in INVARIANTS:
            if entry[field] != baseline[field]:
                raise ValueError(f"{field}: {entry[field]!r} != {baseline[field]!r}")
        if source_root is not None:
            path = source_root / entry["source_basename"]
            if not path.is_file() or sha256_file(path) != entry["sha256"]:
                raise ValueError(f"checksum: {path}")
```

Use `ffprobe` for width/height so the command works for PNG, WebP and video. The `record` command stores only the source basename; `validate --source-root DIR` resolves those basenames and rechecks bytes, while validation without a source root still checks metadata invariants. Write JSON with sorted keys and a trailing newline. Refuse duplicate themes, missing files at record time, malformed `WIDTHxHEIGHT`, any `status_chrome` value other than false, and checksum mismatch when a source root is supplied.

- [ ] **Step 4: Run the tests and prove GREEN**

Run: `python3 -m unittest tests.test_cadence_capture_manifest -v`

Expected: all capture-manifest tests PASS.

- [ ] **Step 5: Capture the canonical theme source set from the current app**

Boot the intended iPhone simulator, build/install the current production-candidate commit, sign into the populated demo account, open `Signal in the Gold`, and set the canonical editor state. Capture Arctic, Neon and Crimson without leaving the editor. Crop each with the same rectangle so the exported images contain app content only.

Record each source against the simulator-installed release-candidate commit verified by `src/build-info.ts` and the release checkpoint:

```bash
APP_BUILD=702219cb586dd155e558d8438698b8617b031e0f
python3 scripts/cadence_capture_manifest.py record --manifest assets/cadence/source-capture-manifest.json --file /Users/lukedudley/Developer/cadence-marketing-source/theme-arctic.png --build "$APP_BUILD" --platform ios --viewport 402x874 --account cadence-demo-seeded --project signal-in-the-gold --screen editor --theme arctic --control-state current-large-beat-play --crop 0,177,1206,2445
python3 scripts/cadence_capture_manifest.py record --manifest assets/cadence/source-capture-manifest.json --file /Users/lukedudley/Developer/cadence-marketing-source/theme-neon.png --build "$APP_BUILD" --platform ios --viewport 402x874 --account cadence-demo-seeded --project signal-in-the-gold --screen editor --theme neon --control-state current-large-beat-play --crop 0,177,1206,2445
python3 scripts/cadence_capture_manifest.py record --manifest assets/cadence/source-capture-manifest.json --file /Users/lukedudley/Developer/cadence-marketing-source/theme-crimson.png --build "$APP_BUILD" --platform ios --viewport 402x874 --account cadence-demo-seeded --project signal-in-the-gold --screen editor --theme crimson --control-state current-large-beat-play --crop 0,177,1206,2445
python3 scripts/cadence_capture_manifest.py validate --manifest assets/cadence/source-capture-manifest.json --source-root /Users/lukedudley/Developer/cadence-marketing-source --require-themes arctic neon crimson
```

Before recording, visually compare the in-app control with the running build at 200% zoom. Reject and recapture any file containing system chrome, mismatched crop, Library content, truncated text or the stale triangular control.

- [ ] **Step 6: Commit the capture gate and approved manifest**

```bash
git add scripts/cadence_capture_manifest.py tests/test_cadence_capture_manifest.py assets/cadence/source-capture-manifest.json
git commit -m "feat(cadence): lock product capture provenance"
```

Do not add the full-resolution source captures to the website repository; their basenames and checksums travel in the manifest and the controlled originals remain outside Git.

---

### Task 2: Scroll-scrub policy and controller

**Files:**
- Modify: `cadence/media-policy.js`
- Modify: `tests/cadence_media_policy.test.mjs`

**Interfaces:**
- Produces `scrollProgressForBounds({ top, height, viewportHeight }): number`.
- Produces `mediaTimeForProgress({ duration, progress }): number`.
- Produces `canScrubMedia({ documentVisible, reducedMotion, saveData, readyState }): boolean`.
- Produces `selectActiveScene(candidates): media | null`, where each candidate has `{ media, distance, intersecting }`.
- DOM consumes `[data-scroll-scene]`, `video[data-scrub-video]`, `data-src`, `poster`, and optional `data-static-progress`.

- [ ] **Step 1: Replace playback assertions with failing scrub assertions**

```javascript
test('scene bounds map the viewport crossing to zero through one', () => {
  assert.equal(scrollProgressForBounds({ top: 800, height: 1000, viewportHeight: 800 }), 0);
  assert.equal(scrollProgressForBounds({ top: -100, height: 1000, viewportHeight: 800 }), 0.5);
  assert.equal(scrollProgressForBounds({ top: -1000, height: 1000, viewportHeight: 800 }), 1);
});

test('forward and reverse progress map deterministically to media time', () => {
  assert.equal(mediaTimeForProgress({ duration: 8, progress: 0.75 }), 6);
  assert.equal(mediaTimeForProgress({ duration: 8, progress: 0.25 }), 2);
  assert.equal(mediaTimeForProgress({ duration: NaN, progress: 0.5 }), 0);
});

test('scrubbing requires metadata and honors visibility and preferences', () => {
  const ready = { documentVisible: true, reducedMotion: false, saveData: false, readyState: 1 };
  assert.equal(canScrubMedia(ready), true);
  assert.equal(canScrubMedia({ ...ready, documentVisible: false }), false);
  assert.equal(canScrubMedia({ ...ready, reducedMotion: true }), false);
  assert.equal(canScrubMedia({ ...ready, saveData: true }), false);
  assert.equal(canScrubMedia({ ...ready, readyState: 0 }), false);
});

test('the nearest intersecting scene wins and all others remain inactive', () => {
  const near = { id: 'near' };
  const far = { id: 'far' };
  assert.equal(selectActiveScene([
    { media: far, intersecting: true, distance: 500 },
    { media: near, intersecting: true, distance: 40 },
  ]), near);
});
```

- [ ] **Step 2: Run the Node test and prove RED**

Run: `node --test tests/cadence_media_policy.test.mjs`

Expected: FAIL because the new exports do not exist.

- [ ] **Step 3: Implement the pure scrub policy**

```javascript
export function scrollProgressForBounds({ top, height, viewportHeight }) {
  const travel = Math.max(1, height + viewportHeight);
  return Math.min(1, Math.max(0, (viewportHeight - top) / travel));
}

export function mediaTimeForProgress({ duration, progress }) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  return duration * Math.min(1, Math.max(0, progress));
}

export function canScrubMedia({ documentVisible, reducedMotion, saveData, readyState }) {
  return documentVisible && !reducedMotion && !saveData && readyState >= 1;
}

export function selectActiveScene(candidates) {
  return candidates
    .filter(({ intersecting }) => intersecting)
    .sort((left, right) => left.distance - right.distance)[0]?.media ?? null;
}
```

- [ ] **Step 4: Implement the DOM controller with paused lazy media**

For each scrub scene, cache the scene bounds once per animation frame, observe a generous near-viewport margin, assign `video.src = video.dataset.src` only in motion mode and only when near, wait for `loadedmetadata`, call `video.pause()`, and seek only the selected active scene. A single passive scroll/resize scheduler may queue one `requestAnimationFrame`; it must not call `play()`.

```javascript
const seek = (record, progress) => {
  const { video } = record;
  video.pause();
  if (!canScrubMedia({
    ...preferences,
    documentVisible: document.visibilityState === 'visible',
    readyState: video.readyState,
  })) return;
  const nextTime = mediaTimeForProgress({ duration: video.duration, progress });
  if (Math.abs(video.currentTime - nextTime) > 1 / 30) video.currentTime = nextTime;
};
```

Set `--scene-progress` for composition transforms. In static mode leave `data-src` untouched and add `is-static` to the body. On visibility loss, pause every video. On seek exception, remove the loaded source, call `load()`, and preserve the poster.

- [ ] **Step 5: Run Node tests and syntax check**

Run: `node --test tests/cadence_media_policy.test.mjs && deno check cadence/media-policy.js`

Expected: all media-policy tests PASS and Deno reports no errors.

- [ ] **Step 6: Commit the scrub engine**

```bash
git add cadence/media-policy.js tests/cadence_media_policy.test.mjs
git commit -m "feat(cadence): scrub product media with scroll"
```

---

### Task 3: Exact animated Cadence mark

**Files:**
- Create: `scripts/render_cadence_mark.mjs`
- Create: `assets/cadence/cadence-mark.webp`
- Create: `assets/cadence/cadence-mark-static.webp`
- Modify: `tests/site_content_contract_test.py`
- Modify: `cadence/index.html`
- Modify: `cadence/cadence.css`
- Modify: `cadence/media-policy.js`

**Interfaces:**
- Generator consumes `/Users/lukedudley/Developer/cadence/apps/mobile/src/components/CadenceLogo.tsx` and fails unless it extracts `SPINE`, `SPINE_LEN`, `C_PATH`, `NOTE_PATH`, `EASE_DRAW`, `EASE_DROP`, four `SILVER_STOPS` and the locked duration/delay values.
- Produces 256×256 transparent animated WebP and final-frame static WebP.
- HTML uses `<picture class="cadence-mark" aria-hidden="true">` with static fallback and no accessible duplication of “Cadence”.

- [ ] **Step 1: Add failing mark contracts**

```python
def test_cadence_navigation_uses_locked_mark_not_square_app_icon(self):
    html = (ROOT / "cadence" / "index.html").read_text(encoding="utf-8")
    self.assertIn('class="cadence-mark"', html)
    nav = html.split('<header class="nav cadence-nav">', 1)[1].split("</header>", 1)[0]
    self.assertNotIn("app-icon.webp", nav)
    self.assertIn("cadence-mark.webp", nav)
    self.assertIn("cadence-mark-static.webp", nav)

def test_mark_assets_are_local_and_transparent(self):
    for name in ("cadence-mark.webp", "cadence-mark-static.webp"):
        self.assertTrue((ROOT / "assets" / "cadence" / name).is_file())
```

- [ ] **Step 2: Run contract tests and prove RED**

Run: `python3 -m unittest tests.site_content_contract_test -v`

Expected: FAIL because the locked mark assets and markup do not exist.

- [ ] **Step 3: Implement the source-derived mark renderer**

The script must regex-extract constants from the native TSX rather than copy path strings. Generate 34 timestamps from 0 through 1.12 seconds at 30 fps. Evaluate the two cubic Bézier curves numerically, render SVG frames containing the native mask/path/gradient, and rasterise with:

```javascript
spawnSync(browserBin, [
  '--headless', '--hide-scrollbars', '--disable-gpu',
  '--default-background-color=00000000', '--window-size=256,256',
  `--screenshot=${pngPath}`, pathToFileURL(svgPath).href,
], { stdio: 'inherit' });
```

Encode with the WebP reference tools available in the local runtime:

```bash
img2webp -loop 0 -min_size $(for frame in cadence-mark-*.png; do printf -- '-d 33 -lossless -exact %q ' "$frame"; done) -o assets/cadence/cadence-mark.webp
cwebp -quiet -lossless -exact cadence-mark-034.png -o assets/cadence/cadence-mark-static.webp
```

Resolve Chrome from `BROWSER_BIN`, falling back to `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` on macOS and `/usr/bin/google-chrome` on Clevo. Assert the extracted native values equal 760, -16, 310 and 800 before rendering. The generated animation may contain a single animation cycle in the file; JavaScript swaps to the static image after 1.12 seconds so the visible mark never loops.

- [ ] **Step 4: Replace both navigation app icons with the mark picture**

```html
<picture class="cadence-mark" aria-hidden="true">
  <source media="(prefers-reduced-motion: reduce)" srcset="../assets/cadence/cadence-mark-static.webp" />
  <img src="../assets/cadence/cadence-mark.webp" data-animated-mark data-static-src="../assets/cadence/cadence-mark-static.webp" alt="" width="34" height="34" />
</picture>
```

Preserve the adjacent text brand and link label. Add `.cadence-mark` sizing with a transparent background, no radius, no shadow and `object-fit: contain`. Add a `markController()` to `media-policy.js` that replaces `src` with `data-static-src` 1,120 milliseconds after the animated image's `load` event; in static visitor mode it swaps immediately. Leave the feedback page's Brand Name Changes navigation identity unchanged; this task replaces only the square Cadence app icon in the Cadence product navigation.

- [ ] **Step 5: Run mark generation and contracts**

Run:

```bash
node scripts/render_cadence_mark.mjs /Users/lukedudley/Developer/cadence/apps/mobile/src/components/CadenceLogo.tsx assets/cadence
python3 -m unittest tests.site_content_contract_test -v
ffprobe -v error -show_entries stream=width,height,pix_fmt -of json assets/cadence/cadence-mark.webp
```

Expected: contracts PASS; dimensions are 256×256 and pixel format contains alpha.

- [ ] **Step 6: Commit the locked mark**

```bash
git add scripts/render_cadence_mark.mjs assets/cadence/cadence-mark.webp assets/cadence/cadence-mark-static.webp cadence/index.html cadence/cadence.css cadence/media-policy.js tests/site_content_contract_test.py
git commit -m "feat(cadence): use the locked animated brand mark"
```

---

### Task 4: Unbox hero and workflow demonstrations

**Files:**
- Modify: `cadence/index.html`
- Modify: `cadence/cadence.css`
- Modify: `tests/site_content_contract_test.py`
- Create: `scripts/encode_cadence_scrub_media.sh`
- Create: `scripts/inspect_cadence_blender_scene.py`
- Create: `scripts/render_cadence_phone_diagnostic.py`
- Create: `scripts/render_cadence_phone_video.py`
- Create: `scripts/render_cadence_phone_batch.sh`
- Create: `tests/test_cadence_media_assets.py`
- Replace encodes: `assets/cadence/hero-device.mp4`, `transcribe.mp4`, `rhyme-families.mp4`, `arrange-to-daw.mp4`, `dry-wet.mp4`
- Replace posters: matching `.webp` files.

**Interfaces:**
- Each motion element is `<video data-scrub-video data-src="…" poster="…" preload="none" muted playsinline>` inside a parent `[data-scroll-scene]`.
- `scripts/encode_cadence_scrub_media.sh INPUT OUTPUT_MP4 OUTPUT_POSTER` emits H.264 yuv420p, faststart, GOP 6, no audio, plus a WebP final-frame poster.
- Asset test consumes ffprobe JSON and enforces codec, pixel format, dimensions, no audio and maximum keyframe interval.

- [ ] **Step 1: Add failing unboxed/scrub contracts**

```python
def test_cadence_product_videos_are_scroll_scrubbed_not_looped(self):
    parser = CadenceExperienceParser()
    parser.feed((ROOT / "cadence" / "index.html").read_text(encoding="utf-8"))
    for video in parser.videos:
        self.assertIn("data-scrub-video", video)
        self.assertIn("data-src", video)
        self.assertNotIn("src", video)
        self.assertNotIn("loop", video)
        self.assertEqual(video.get("preload"), "none")

def test_product_media_has_no_fake_controls_or_overlay_caption(self):
    html = (ROOT / "cadence" / "index.html").read_text(encoding="utf-8")
    self.assertNotIn("data-media-toggle", html)
    self.assertNotIn("Springtime Showers</strong><span>13 songs", html)
```

Add a CSS contract that the `.cadence-media-stage` block contains `border: 0`, `border-radius: 0`, and `background: transparent`, and that stage pseudo-elements are absent.

- [ ] **Step 2: Run focused contracts and prove RED**

Run: `python3 -m unittest tests.site_content_contract_test -v`

Expected: FAIL on loop/src/preload, media toggle and boxed stage rules.

- [ ] **Step 3: Add the exact scrub encode policy and its asset tests**

```bash
#!/usr/bin/env bash
set -euo pipefail
input=$1
output=$2
poster=$3
ffmpeg -y -i "$input" -an -vf "fps=30,scale='min(1280,iw)':-2:flags=lanczos" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart \
  -g 6 -keyint_min 6 -sc_threshold 0 "$output"
ffmpeg -y -sseof -0.04 -i "$output" -frames:v 1 -c:v libwebp -q:v 88 "$poster"
```

The Python asset test must call `ffprobe -show_streams -show_format -of json` and `ffprobe -skip_frame nokey -show_frames`; assert `codec_name == "h264"`, `pix_fmt == "yuv420p"`, no audio stream, dimensions no larger than 1280, duration positive and maximum adjacent keyframe distance no greater than 0.21 seconds.

- [ ] **Step 4: Render all approved product demonstrations inside the verified handset on Clevo**

Use `inspect_cadence_blender_scene.py` to lock the existing `CTRL-F03V5-b01-v8-library` handset, `GEO-Cadence-real-screen-F03V5-b01-v8-library` display and `MAT-F03V5-screen-b01-v8-library` material. Render one diagnostic first and reject it if any floor, plinth, random stage or square render boundary remains. Crop simulator status chrome from the approved recordings, then run `render_cadence_phone_batch.sh` sequentially with distinct `hero`, `capture`, `rhyme`, `arrange` and `finish` motion profiles. Blender writes bounded RGBA frame sequences; Clevo FFmpeg composites them onto the exact page background and emits the H.264/WebP pairs. Copy only the final derivatives back to `assets/cadence/`.

The hero uses the populated library capture from the same controlled product library. A raw or floating screen recording is a failed output even when its pixels are accurate.

Run locally: `python3 -m unittest tests.test_cadence_media_assets -v`

Expected: all five pairs PASS encoding checks.

- [ ] **Step 5: Convert hero and four workflow articles to scrub markup**

Remove `src`, `loop`, every `data-autoplay`, every `data-media-toggle`, the hero `figcaption`, `.cadence-studio-word`, `.rhyme-key`, `.waveform-legend` decoration inside media, and `.mix-annotation`. Put `data-scroll-scene` on each hero/article scene wrapper, use `data-src` for motion, preserve real accessible labels and keep every poster.

- [ ] **Step 6: Replace box styling with integrated responsive composition**

```css
.cadence-media-stage {
  position: relative;
  min-height: clamp(520px, 70vw, 820px);
  overflow: visible;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.cadence-media-stage::before,
.cadence-media-stage::after { content: none; }

.cadence-phone {
  position: sticky;
  top: clamp(88px, 12vh, 136px);
  width: min(100%, 430px);
  margin-inline: auto;
  transform: translate3d(0, calc((.5 - var(--scene-progress, .5)) * 22px), 0);
}
```

At `max-width: 860px`, make the phone `position: relative; top: auto`, constrain the scene to `min-height: clamp(440px, 132vw, 640px)`, and remove long pinning. Set hero video blend/background rules so its square source edge disappears into the exact hero canvas colour. Reserve aspect ratio before metadata load.

- [ ] **Step 7: Run focused and full local tests**

Run:

```bash
python3 -m unittest tests.site_content_contract_test tests.test_cadence_media_assets -v
node --test tests/cadence_media_policy.test.mjs
deno check cadence/media-policy.js
```

Expected: all PASS.

- [ ] **Step 8: Commit the unboxed demonstrations**

```bash
git add scripts/encode_cadence_scrub_media.sh scripts/inspect_cadence_blender_scene.py scripts/render_cadence_phone_diagnostic.py scripts/render_cadence_phone_video.py scripts/render_cadence_phone_batch.sh tests/test_cadence_media_assets.py tests/site_content_contract_test.py cadence/index.html cadence/cadence.css cadence/media-policy.js assets/cadence/hero-device.mp4 assets/cadence/hero-device.webp assets/cadence/transcribe.mp4 assets/cadence/transcribe.webp assets/cadence/rhyme-families.mp4 assets/cadence/rhyme-families.webp assets/cadence/arrange-to-daw.mp4 assets/cadence/arrange-to-daw.webp assets/cadence/dry-wet.mp4 assets/cadence/dry-wet.webp
git commit -m "feat(cadence): integrate unboxed scroll product scenes"
```

---

### Task 5: One-handset theme transition rendered on Clevo

**Files:**
- Create: `scripts/render_cadence_theme_scene.py`
- Create: `assets/cadence/theme-scroll.mp4`
- Create: `assets/cadence/theme-scroll.webp`
- Modify: `cadence/index.html`
- Modify: `cadence/cadence.css`
- Modify: `tests/site_content_contract_test.py`
- Modify: `tests/test_cadence_media_assets.py`
- Delete after replacement: `assets/cadence/theme-arctic.webp`, `assets/cadence/theme-neon.webp`, `assets/cadence/theme-crimson.webp`

**Interfaces:**
- Blender script runs inside the opened base `.blend` and consumes `--manifest`, `--source-root`, `--arctic`, `--neon`, `--crimson`, and `--output-dir` after validating the committed capture manifest.
- Produces a 120-frame transparent-or-page-matched scene: Arctic holds frames 1–24, crossfades to Neon 25–48, Neon holds 49–72, crossfades to Crimson 73–96, Crimson holds 97–120.
- Website consumes the output with the same `data-scrub-video` contract as Task 2.

- [ ] **Step 1: Add failing single-theme-scene contracts**

```python
def test_theme_story_uses_one_scrubbed_handset_and_no_rejected_cards(self):
    html = (ROOT / "cadence" / "index.html").read_text(encoding="utf-8")
    section = html.split('<section class="cadence-themes"', 1)[1].split("</section>", 1)[0]
    self.assertEqual(section.count("<video"), 1)
    self.assertIn("theme-scroll.mp4", section)
    self.assertNotIn("theme-card", section)
    for rejected in ("theme-arctic.webp", "theme-neon.webp", "theme-crimson.webp"):
        self.assertNotIn(rejected, html)
```

- [ ] **Step 2: Run the contract and prove RED**

Run: `python3 -m unittest tests.site_content_contract_test.SiteContentContractTest.test_theme_story_uses_one_scrubbed_handset_and_no_rejected_cards -v`

Expected: FAIL because the page still contains the three-card fan.

- [ ] **Step 3: Implement the Blender render script**

Open `/home/luke/blender-cad-motion/cadence-performance-factory/renders/web-hero-v1/cadence-web-hero-v1.blend`, identify the existing screen material by image texture node, and make the script fail if exactly one screen image node is not found. Load the three checksum-verified textures, assign them to three duplicate screen planes in the same display aperture, and keyframe only their alpha. Do not move, scale or rotate the handset or content planes between theme states.

```python
THEME_KEYS = {
    "arctic": ((1, 1.0), (24, 1.0), (48, 0.0)),
    "neon": ((1, 0.0), (24, 0.0), (48, 1.0), (72, 1.0), (96, 0.0)),
    "crimson": ((1, 0.0), (72, 0.0), (96, 1.0), (120, 1.0)),
}

for theme, keyframes in THEME_KEYS.items():
    material = theme_materials[theme]
    for frame, alpha in keyframes:
        material.diffuse_color[3] = alpha
        material.keyframe_insert(data_path="diffuse_color", frame=frame, index=3)
```

Set 1080×1350 render resolution, transparent film or the exact section background, 30 fps, frames 1–120. Save a derived `.blend` beside Clevo outputs for reproducibility.

- [ ] **Step 4: Render and encode on Clevo**

```bash
rsync -av scripts/render_cadence_theme_scene.py scripts/encode_cadence_scrub_media.sh clevo:/home/luke/blender-cad-motion/cadence-website-v2/
rsync -av /Users/lukedudley/Developer/cadence-marketing-source/theme-{arctic,neon,crimson}.png clevo:/home/luke/blender-cad-motion/cadence-website-v2/input/
rsync -av assets/cadence/source-capture-manifest.json clevo:/home/luke/blender-cad-motion/cadence-website-v2/input/
ssh clevo '/usr/bin/blender -b /home/luke/blender-cad-motion/cadence-performance-factory/renders/web-hero-v1/cadence-web-hero-v1.blend -P /home/luke/blender-cad-motion/cadence-website-v2/render_cadence_theme_scene.py -- --manifest /home/luke/blender-cad-motion/cadence-website-v2/input/source-capture-manifest.json --source-root /home/luke/blender-cad-motion/cadence-website-v2/input --arctic /home/luke/blender-cad-motion/cadence-website-v2/input/theme-arctic.png --neon /home/luke/blender-cad-motion/cadence-website-v2/input/theme-neon.png --crimson /home/luke/blender-cad-motion/cadence-website-v2/input/theme-crimson.png --output-dir /home/luke/blender-cad-motion/cadence-website-v2/theme-render'
ssh clevo '/home/luke/blender-cad-motion/cadence-website-v2/encode_cadence_scrub_media.sh /home/luke/blender-cad-motion/cadence-website-v2/theme-render/theme-scroll-source.mov /home/luke/blender-cad-motion/cadence-website-v2/theme-scroll.mp4 /home/luke/blender-cad-motion/cadence-website-v2/theme-scroll.webp'
rsync -av clevo:/home/luke/blender-cad-motion/cadence-website-v2/theme-scroll.{mp4,webp} assets/cadence/
```

- [ ] **Step 5: Visually gate the render before page integration**

Extract frames 1, 24, 48, 72, 96 and 120. Compare at 200% with the running app and manifest. Confirm one handset pose, one `Signal in the Gold` editor state, one crop, identical text/control positions, no OS chrome, no black bars, no triangular stale control, readable text and only the theme changing. If any item fails, fix the source or screen-plane mapping and rerender; do not patch rendered frames.

- [ ] **Step 6: Replace the three-card fan with the scrub scene**

```html
<figure class="theme-handset" data-scroll-scene>
  <video data-scrub-video data-src="../assets/cadence/theme-scroll.mp4" poster="../assets/cadence/theme-scroll.webp" width="1080" height="1350" muted playsinline preload="none" aria-label="The same Signal in the Gold editor changes from Arctic to Neon to Crimson"></video>
</figure>
```

Remove all `.theme-fan`, `.theme-card` and per-theme positioning CSS. Integrate the handset on the section background with no border or container radius.

- [ ] **Step 7: Run media and page contracts**

Run: `python3 -m unittest tests.site_content_contract_test tests.test_cadence_media_assets -v`

Expected: PASS, including the theme clip encoding and rejected-asset absence.

- [ ] **Step 8: Commit the verified theme scene**

```bash
git add scripts/render_cadence_theme_scene.py tests/site_content_contract_test.py tests/test_cadence_media_assets.py cadence/index.html cadence/cadence.css assets/cadence/theme-scroll.mp4 assets/cadence/theme-scroll.webp
git rm assets/cadence/theme-arctic.webp assets/cadence/theme-neon.webp assets/cadence/theme-crimson.webp
git commit -m "feat(cadence): show themes on one verified handset"
```

---

### Task 6: Compact feedback-page 3D scene

**Files:**
- Create: `assets/cadence/feedback-handset.mp4`
- Create: `assets/cadence/feedback-handset.webp`
- Create: `scripts/render_cadence_feedback_scene.py`
- Modify: `cadence/feedback/index.html`
- Modify: `cadence/feedback/feedback.css`
- Modify: `tests/feedback_page_contract_test.py`
- Modify: `tests/test_cadence_media_assets.py`

**Interfaces:**
- Reuses the Task 2 `data-scroll-scene`/`data-scrub-video` contract.
- Mobile scene reserves `height: clamp(180px, 52vw, 220px)` and holds the final frame after its introduction range.
- Form DOM IDs, fieldsets, scripts, actions and input names remain byte-for-byte unchanged.

- [ ] **Step 1: Add failing feedback scene contracts**

```python
def test_feedback_intro_uses_mobile_visible_scrubbed_3d_scene(self):
    self.assertIn('class="feedback-product"', self.html)
    self.assertIn("feedback-handset.mp4", self.html)
    self.assertIn("feedback-handset.webp", self.html)
    self.assertIn("data-scrub-video", self.html)
    self.assertNotIn("assets/cadence-editor.png", self.html)

def test_feedback_mobile_css_reserves_compact_scene_space(self):
    css = (ROOT / "cadence" / "feedback" / "feedback.css").read_text(encoding="utf-8")
    self.assertIn("height: clamp(180px, 52vw, 220px)", css)
    self.assertNotRegex(css, r"\.feedback-product\s*\{[^}]*display:\s*none")
```

- [ ] **Step 2: Run the feedback contracts and prove RED**

Run: `python3 -m unittest tests.feedback_page_contract_test -v`

Expected: FAIL because the current flat editor image is hidden on mobile.

- [ ] **Step 3: Implement and render the compact handset clip on Clevo**

The render script opens inside the approved hero Blender scene, resolves exactly one handset root collection, preserves the approved screen material, and animates only the handset parent from `(x + 0.12 m, z - 0.18 m, y_rotation - 7°)` at frame 1 to its original transform at frame 48, then holds frames 49–72. Use cubic Bézier handles with zero end velocity. Fail if a text object, platform label or more than one screen plane is visible. Set 1080×1350, 30 fps and frames 1–72.

```bash
rsync -av scripts/render_cadence_feedback_scene.py scripts/encode_cadence_scrub_media.sh clevo:/home/luke/blender-cad-motion/cadence-website-v2/
ssh clevo '/usr/bin/blender -b /home/luke/blender-cad-motion/cadence-performance-factory/renders/web-hero-v1/cadence-web-hero-v1.blend -P /home/luke/blender-cad-motion/cadence-website-v2/render_cadence_feedback_scene.py -- --output-dir /home/luke/blender-cad-motion/cadence-website-v2/feedback-render'
ssh clevo '/home/luke/blender-cad-motion/cadence-website-v2/encode_cadence_scrub_media.sh /home/luke/blender-cad-motion/cadence-website-v2/feedback-render/feedback-handset-source.mov /home/luke/blender-cad-motion/cadence-website-v2/feedback-handset.mp4 /home/luke/blender-cad-motion/cadence-website-v2/feedback-handset.webp'
rsync -av clevo:/home/luke/blender-cad-motion/cadence-website-v2/feedback-handset.{mp4,webp} assets/cadence/
python3 -m unittest tests.test_cadence_media_assets -v
```

Visually inspect frames 1, 24, 48 and 72. Reject any floating label, square render boundary, clipped handset, unreadable screen or motion after the final pose.

- [ ] **Step 4: Replace the flat feedback image with semantic scrub media**

```html
<figure class="feedback-product" data-scroll-scene>
  <video data-scrub-video data-src="../../assets/cadence/feedback-handset.mp4" poster="../../assets/cadence/feedback-handset.webp" width="1080" height="1350" muted playsinline preload="none" aria-label="A three-dimensional handset showing the populated Cadence workspace"></video>
</figure>
```

Load `../media-policy.js` as a module after `feedback.js`. Keep the existing meaningful alternative available through the video label and poster; do not introduce a decorative button.

- [ ] **Step 5: Implement mobile-first scene sizing**

```css
.feedback-product {
  position: relative;
  width: min(100%, 310px);
  margin: 28px auto 0;
  overflow: visible;
}

.feedback-product video {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

@media (max-width: 640px) {
  .feedback-product {
    display: grid;
    width: 100%;
    height: clamp(180px, 52vw, 220px);
    margin-top: 18px;
    place-items: center;
  }
  .feedback-product video { width: min(72vw, 230px); max-height: 100%; }
}
```

At wider widths keep the intro sticky but do not keep motion active once the form column becomes primary. Under reduced motion show only the final poster.

- [ ] **Step 6: Run feedback and asset tests**

Run:

```bash
python3 -m unittest tests.feedback_page_contract_test tests.test_cadence_media_assets -v
node --test tests/feedback_form_model.test.mjs tests/feedback_api_client.test.mjs
```

Expected: all PASS; form behaviour is unchanged.

- [ ] **Step 7: Commit the feedback product scene**

```bash
git add scripts/render_cadence_feedback_scene.py assets/cadence/feedback-handset.mp4 assets/cadence/feedback-handset.webp cadence/feedback/index.html cadence/feedback/feedback.css tests/feedback_page_contract_test.py tests/test_cadence_media_assets.py
git commit -m "feat(cadence): integrate 3d product proof into feedback"
```

---

### Task 7: Responsive, accessibility and browser verification

**Files:**
- Modify if defects are found: `cadence/index.html`, `cadence/cadence.css`, `cadence/media-policy.js`, `cadence/feedback/index.html`, `cadence/feedback/feedback.css`
- Modify alongside each defect: relevant test under `tests/`

**Interfaces:**
- No new production interface. This task accepts or rejects the previous tasks against the signed spec.

- [ ] **Step 1: Start the production-like local server**

Run: `python3 serve.py`

Open `http://127.0.0.1:8000/cadence/` and `http://127.0.0.1:8000/cadence/feedback/` in Chrome.

- [ ] **Step 2: Verify scroll behaviour at every locked width**

At 320, 375, 390, 430, 768, 1024 and 1440 pixels, scroll forward and backward through hero, Capture, Write, Shape, Finish, Themes and feedback intro. For each scene verify:

- current time increases while scrolling forward and decreases while scrolling backward;
- every video remains paused;
- only the active/near-active clip receives a source;
- no concurrent playback, horizontal overflow, layout shift, trapped sticky section or covered copy;
- no rectangular stage border, radius, random grid, waveform stripe, overlay caption or fake media control;
- handset content fills its display aperture and no status chrome appears;
- theme text, crop and in-app control stay fixed while only colour changes.

Record full-page screenshots at 390, 768, 1024 and 1440 pixels plus contact sheets showing each scene at progress 0, 0.5 and 1.

- [ ] **Step 3: Verify fallback and accessibility modes**

Emulate `prefers-reduced-motion: reduce`, reload both pages and confirm every `data-src` remains unloaded while posters communicate the final state. Emulate `navigator.connection.saveData === true` and repeat. At 200% zoom verify navigation, form labels, focus order, error summary and 44-pixel primary touch targets. Keyboard through the entire feedback form and ensure the intro scene never captures focus.

- [ ] **Step 4: Turn every discovered defect into a regression test before fixing it**

For any failure, add the smallest failing Node/Python contract, run it to prove RED, make the surgical HTML/CSS/JS correction, rerun to GREEN, then repeat the affected browser width. Do not approve visual correctness from code inspection alone.

- [ ] **Step 5: Run the complete repository gate**

```bash
python3 -m unittest discover -s tests -p '*test.py' -v
node --test tests/*.test.mjs
deno test supabase/functions/cadence-beta-feedback/handler.test.ts supabase/functions/cadence-beta-feedback/store.test.ts
deno check cadence/feedback/feedback.js cadence/media-policy.js supabase/functions/cadence-beta-feedback/index.ts
npx slop-scan scan .
git diff --check
```

Expected: all tests/checks PASS; review slop-scan findings and fix genuine regressions rather than suppressing them.

- [ ] **Step 6: Independent visual acceptance**

Have a verifier who did not author the scene compare the contact sheets and extracted media frames with the live production-candidate app using the spec checklist. The verifier must explicitly mark PASS for text, screen, crop, theme, control, status chrome and aspect ratio. Any failed row returns to the producing task.

- [ ] **Step 7: Commit browser-found corrections**

Stage only files actually changed and use one or more scoped commits, for example:

```bash
git add cadence/cadence.css tests/site_content_contract_test.py
git commit -m "fix(cadence): prevent mobile scene overflow"
```

Skip this commit if no corrections were required.

---

### Task 8: Documentation, review and production canary

**Files:**
- Modify: `README.md`
- Modify: `docs/DEVELOPMENT.md`
- Modify: `docs/decisions/0002-pre-rendered-cadence-product-media.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Documents the capture-manifest, Clevo render, scrub encoding, reduced-motion and deployment verification commands implemented above.

- [ ] **Step 1: Update operator and architecture documentation**

Document:

- source-authority and manifest commands;
- native mark regeneration command and authoritative TSX path;
- Clevo Blender/FFmpeg workflow and output locations;
- `data-scrub-video`/`data-src` markup contract;
- H.264 GOP 6/faststart/yuv420p encoding requirement;
- reduced-motion/save-data no-download rule;
- 320–1440 browser matrix and independent visual checklist.

Replace README/DEVELOPMENT statements that say product videos autoplay, loop or expose pause controls.

- [ ] **Step 2: Write the user-facing changelog entry**

```markdown
### Changed

- Cadence product demonstrations now move with the page as you scroll, reverse when you scroll back, and sit directly in the layout without presentation boxes or unrelated decoration.
- The theme demonstration now keeps one real `Signal in the Gold` editor state on one handset while Arctic, Neon and Crimson change around it.
- The Cadence navigation now uses the animated silver script mark, and the private feedback page keeps a compact 3D product view visible on phones.
```

- [ ] **Step 3: Rerun the complete gate and inspect repository safety**

```bash
python3 -m unittest discover -s tests -p '*test.py' -v
node --test tests/*.test.mjs
deno test supabase/functions/cadence-beta-feedback/handler.test.ts supabase/functions/cadence-beta-feedback/store.test.ts
deno check cadence/feedback/feedback.js cadence/media-policy.js supabase/functions/cadence-beta-feedback/index.ts
git diff --check
git status --short
git diff --cached --stat
git diff --cached
```

Confirm no full-resolution source capture, demo-account data, credentials, exports, Blender caches or temporary frames are tracked.

- [ ] **Step 4: Commit documentation**

```bash
git add README.md docs/DEVELOPMENT.md docs/decisions/0002-pre-rendered-cadence-product-media.md CHANGELOG.md
git commit -m "docs(cadence): document verified scroll media workflow"
```

- [ ] **Step 5: Push, open review and deploy only after approval**

```bash
git push origin codex/cadence-scroll-scenes
gh pr create --base master --head codex/cadence-scroll-scenes --title "feat(cadence): integrate scroll-driven product scenes" --body-file /tmp/cadence-scroll-pr.md
```

The PR body must list the source manifest validation, app-vs-render visual gate, all test counts, media sizes, browser widths, reduced-motion/save-data results and independent verifier result. Merge only after review passes.

- [ ] **Step 6: Canary the exact deployed commit**

Wait until GitHub Pages reports the merged commit, then verify `https://brandnamechanges.com/cadence/` and `https://brandnamechanges.com/cadence/feedback/` at 390 and 1440 pixels. Confirm the deployed asset response headers, reverse scrubbing, fallback posters, animated-once mark, feedback form entry and no console/network errors. Record the deployed SHA and canary result in the existing deploy-report format under `.gstack/deploy-reports/`.

---

## Plan Self-Review

- Spec coverage: source authority, invariant capture, correct current in-app control, OS-chrome removal, unboxed hero/workflow scenes, forward/reverse scrub, inactive pause, lazy no-download fallbacks, exact mark timing, single-handset themes, compact feedback scene, all target widths, independent visual verification and production canary each map to a task above.
- Scope preservation: no app UI changes, pricing changes, feedback contract changes, invented screenshots, publishing action or client-side 3D runtime are introduced.
- Interface consistency: every page uses `[data-scroll-scene]` plus `video[data-scrub-video][data-src]`; every scrub encode uses the same H.264 policy; the feedback and theme clips enter the same asset test.
- Placeholder scan: the plan contains no deferred implementation markers; dynamic values such as the app commit are derived by commands at execution time.
- Destructive safety: only the three explicitly rejected theme WebPs are removed, after the replacement scene passes contracts and visual review.
