# Changelog

## Unreleased

### Added

- Cadence now has a conversion-led product experience built from real app captures, a purpose-rendered Blender handset, five connected workflow moments, 27-theme proof and direct iOS/Android beta entry points.
- Product demonstrations play only while visible, expose pause controls and fall back to composed posters for reduced-motion or data-saving visitors.
- Cadence testers can send structured private feedback directly at `/cadence/feedback/`, recover typed progress on the same device, and attach resumable screenshots or screen recordings.
- Existing Google Form responses can be imported once without duplicates and exported without internal security metadata.

### Fixed

- Replaced the sparse Cadence landing page with accurate product evidence for capture, Draft Demo, five rhyme families, arrangement, DAW, vocal effects and export—without unsupported testimonials, prices or trial promises.
- Cadence product and support pages now describe the current feature set, 27-theme catalogue, three-note free tier, platform support and storefront-controlled plan options accurately.
- Removed dead download links, visitor-facing TODO text, a false trial claim and hard-coded prices.
- Preserved `/cadence` while adding nested feedback routes by moving the canonical page to `/cadence/` and retaining a compatibility redirect.
- Prevented duplicate responses when optional evidence verification is interrupted, and documented beta-feedback handling in the privacy policy.
- Fixed the deployed feedback service's production identifier generation so valid submissions can be stored.
- Routed signed evidence transfers through Supabase's dedicated resumable-upload endpoint.
