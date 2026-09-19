# Cadence link previews

The Cadence landing page uses `assets/cadence/share-card-v1.png`, a 1200 × 630
landscape composition with the existing Cadence mark, accepted campaign headline
and authentic neutral-metal phone render. The reproducible HTML composition is
`assets/cadence/share-card.html`; render its full 1200 × 630 viewport at DPR 1
after all images decode. No generated app interface is used.

Open Graph and Twitter metadata point to the versioned PNG. Change the filename
when changing artwork to avoid stale image caches. Existing message previews may
remain cached by their clients.

This controls shares of https://brandnamechanges.com/cadence/ only. Direct
apps.apple.com links use Apple's metadata. On 19 September 2026, the live Apple
iPad listing still contained three raw screenshots despite the newer iPhone pack.
The approved revised tablet pack is being staged separately in version 1.0.1.
It does not become live until an eligible app update is submitted and approved.

Validation: `python3 -m unittest tests.cadence_share_card_test -v` plus the full
website test suite. Inspect the rendered PNG at full size before publishing.
