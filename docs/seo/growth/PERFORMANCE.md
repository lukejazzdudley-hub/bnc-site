# Mobile performance audit

16 October 2026 production baseline, [PageSpeed report](https://pagespeed.web.dev/analysis/https-brandnamechanges-com-cadence/dzve0pw8se?form_factor=mobile): performance 82, accessibility 95, best practices 100, SEO 100. FCP 2.6 s, LCP 4.2 s, total blocking time 0 ms, CLS 0.001, speed index 2.6 s. This is a single lab run, not a field Core Web Vitals assessment. Search Console reported insufficient mobile and desktop usage in the last 90 days (report updated 14 October).

Observed opportunities: image delivery approximately 447 KiB; navigation animation 336.5 KiB despite a 60 px display; Google Fonts CSS plus local styles in the blocking chain; oversized hero source; themes poster requested before its section was near the viewport.

Changes preserve the accepted visual design:

- Added a 64×64 navigation animation retaining all 35 frames, timing and transparency: 344,556 → 58,130 bytes. Original full-resolution brand asset remains intact; reduced-motion users get a small static asset.
- Added a 480 px hero variant, responsive srcset/sizes and corrected intrinsic dimensions. The original 900 px source remains for higher-resolution use.
- Marked dynamically created scene posters lazy, so a far-offscreen themes poster need not compete with the hero.
- Self-hosted the existing Latin Geist, Geist Mono and Instrument Serif WOFF2 assets, with font-display swap and upstream OFL notices. Removed the external Google Fonts stylesheet chain; no new typeface/design change.

After-release lab results must be measured against the deployed URL, recording the new report link and run conditions. Do not infer a new Lighthouse score from byte savings. Field data may remain unavailable until sufficient real visits accumulate.
