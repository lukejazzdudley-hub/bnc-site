# Private listening-link fallback

`/cadence/listen/` resolves a high-entropy fragment token against the Cadence
listening-share Edge Function. It offers an explicit browser preview and app
open action. Installing the app does not silently accept a song; the user
returns to their link and confirms Add in Cadence.

The page intentionally has no analytics, external fonts, artwork requests or
third-party scripts. `noindex`, `noarchive` and `no-referrer` are deliberate for
this private surface, not an SEO defect. Tokens stay in the URL fragment and
are sent only in the body of the resolver request. Titles use `textContent`.
Playback URLs are accepted only from the expected private Supabase bucket.

Validation: `node --test tests/listening-link.test.mjs` (3 tests).

## Deployment gates

- Deploy and test the listening-share backend with two disposable accounts.
- Verify current storage limits and configure quota before enabling uploads.
- Publish this page only with that backend. Revoked/unavailable links show an
  honest failure state rather than a fake player.
- AASA app identifier comes from the mobile Xcode signing team F2LVM7U837 and
  bundle io.cadenceapp.mobile. Verify the deployed extensionless AASA response
  has HTTP 200, JSON content type and no redirect. GitHub Pages may need an
  edge header rule if it does not provide the correct content type.
- Android `assetlinks.json` still needs the **Google Play app-signing SHA-256**,
  not the upload-key certificate. Do not invent it or use the old SHA-1.
- The next native build must include associated domains / Android intent
  filters. Test HTTPS opening on installed iOS/Android builds. Until then the
  explicit `cadence://listen/` button is the fallback, not verified App Links.

No backend deployment, public publish or store build is asserted by these files.
