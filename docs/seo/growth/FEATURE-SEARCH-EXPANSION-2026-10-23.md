# Feature-led search coverage

Four distinct workflows now have static, indexable landing pages. They reuse the
accepted search-page design, store links, reduced-motion behavior and FAQ renderer.
No new client dependencies, fabricated app screenshots or app changes.

| Intent cluster | Canonical page | Differentiating content |
| --- | --- | --- |
| Production notebook, personal sample library, capture audio from video, export sample to DAW | `/cadence/production-notes-sample-library/` | Actual Production note and sound actions; original caption example; original-versus-range export |
| Offline music player, listen to unreleased music, own demos and beats, screen-locked playback | `/cadence/offline-music-player/` | Listen entry point, Add music, playlists, source selection, local-file prerequisite and a listening exercise |
| Songwriting habit tracker, writing frequency, creative calendar, writing statistics | `/cadence/songwriting-habit-tracker/` | Usage navigation, daily breakdown, creative versus app-open time, routine review and pause control |
| Mobile songwriting DAW, record over beats, export aligned WAV stems | `/cadence/mobile-daw-songwriting/` | Draft/Arrange handoff, mix-versus-stems explanation, timeline-zero import and existing captured evidence |

## Evidence and limits

Feature labels checked against app source `6dc43a1e` on 23 October 2026:
`production-note.ts`, `screens/LibraryScreen.tsx`, `screens/SongScreen.tsx`,
`components/LibraryListeningToggle.tsx`, `components/ListeningRoom.tsx`,
`listening-runtime.ts`, `listening-audio-focus.test.ts`,
`activity/ActivityScreen.tsx`, `components/settings-hub.ts`.
The Google Play listing also describes the DAW and export workflow:
https://play.google.com/store/apps/details?id=io.cadenceapp.mobile

Source inspection is not a new device demonstration or evidence that every
storefront build already contains these controls. New feature pages and manual
chapters disclose version dependence. The existing recorded Springtime Showers
walkthrough supplies actual DAW/export evidence. No fresh device launch occurred.
The guide retains its base navigation date and gives new chapters their own date.

## Search-result observation

Web searches on 23 October 2026 show distinct product categories. These are
qualitative intent observations, not measured query volumes or country rankings.

- Songfarmer explicitly offers a daily songwriting habit tracker:
  https://songfarmer.com/
- Notch targets completed-song goals rather than in-session activity:
  https://www.usenotch.app/goals/songs-written/
- bMusic describes offline playback of owned local files:
  https://bmusic.app/
- Baton’s own listing addresses unreleased music and offline listening:
  https://apps.apple.com/us/app/baton-unreleased-music/id6476163926
- Upcycle describes sample organisation and DAW export on macOS:
  https://arialabs.io/sample-organizer-app
- Tracklib describes sample discovery, beatmaking and a licensed catalogue:
  https://www.tracklib.com/mobile-app

Cadence’s pages answer its narrower supported jobs. They do not claim universal
format compatibility, a licensed sample catalogue, desktop plugin parity,
automatic cloud audio backup or a quality score for songwriting. These are four
intent clusters rather than near-identical pages for every synonym/platform.
No new translated or regional pages are asserted by this release; the existing
all-pack directory remains available from each footer.

## Discovery and measurement

The search generator links all four pages from existing search landing pages.
The manual includes three new searchable chapters and links back to each workflow.
The sitemap grows from 78 to 82 URLs; the optional event route allowlist is updated.
No event dimensions, consent behavior or privacy settings change.

Treat this as a separate release from the earlier 23 October refinement. Keep the
actual deployment timestamp in the private delivery report. Future comparisons
must use completed equal-duration periods around releases, excluding deployment
days and separating existing query/page cohorts from newly appearing searches.
Do not infer that newly written content has already improved rankings. Private
Search Console observations stay outside this public repository.

## Validation

Contract tests check canonical URLs, rendered FAQ/schema parity, all body-link
paths and anchor targets, sitemap membership, incoming links and event allowlist.
Run the repository’s Python, Node and Deno suites, crawl audit and responsive
checks before publishing. New UI uses existing templates; no new motion dependency.
