# Bristol and London enquiries

BNC Studio is the public service brand of Brand Name Changes Ltd (17297548). Bristol is the confirmed base. London is a service area with remote collaboration and meetings by arrangement, not a second office claim.

## Website

- `/work-with-us/bristol/`: Bristol-based delivery, local meetings, booking and day-to-day operations use cases.
- `/work-with-us/london/`: remote project reviews, client portals, integrations and work alongside existing teams.
- Each page has its own copy, self-canonical, visible FAQs and the complete shared enquiry form. They are usable service pages, rather than city-name redirects into a generic destination.
- Both are linked from the homepage and main services page and included in the sitemap seed. Studio generation adds a consistent Organization entity, a city-specific Service and visible breadcrumbs. The provider is the studio, never one of the fictional concepts.
- Structured data contains only the public city-level base. Do not add a private verification address, an invented London address, ratings or testimonials.
- The optional measurement endpoint's generated allowlist covers Cadence routes only. These new service pages do not load that collector; they do not require a backend deployment or add tracking.

Edit `content/studio-local.mjs` and `scripts/build_studio_pages.mjs`. The search generator's sitemap seed must preserve these URLs when regenerating the editorial site. Run all documented generators in order, ending with studio generation, then crawl and contract checks.

## Google Business Profile

Use the existing profile in the Brand Name Changes Google account. Luke created the initial profile during this task. Do not create a duplicate profile or a separate London listing without a genuine eligible location. The primary category observed is Software company. Add only relevant additional categories and the seven actual service offers. The website should lead to `/work-with-us/` for the complete offer and enquiry form.

A 523-character description was saved, covering Bristol/London, websites, bookings, online shops, payments, portals, custom software, CRM, automation and infrastructure. Luke explicitly chose to retain the current visible location and 24-hour weekday listing (weekends are closed in the saved schedule). Keep those owner-provided settings; do not describe them as 24/7. Bristol and London were already included in the saved service areas. Keep verification material and private screenshots outside this public repository.

Google's onboarding used a generic verification notice. A subsequent Business Profile Manager check confirmed one BNC Studio business with status Verified and 100% verified. The description save was also visible in the editor. Web Designer was offered as the relevant additional category; browser input repeatedly timed out and that category change was handed to Luke for selection/save. Do not claim an unsaved category edit succeeded. Skip paid ads and Workspace offers unless separately requested. Use actual studio/product assets; fictional businesses are not clients and their artwork is not a storefront photograph.

## Search Console

The Brand Name Changes Google account has access to the verified `sc-domain:brandnamechanges.com` property. After production release, resubmit the existing sitemap and use URL Inspection for the homepage, main services page and two new city pages. Record Google's actual response. A submitted sitemap or indexing request is not evidence of indexing, rankings or enquiries.

## Validation

`tests/local-services.test.mjs` checks real provider identity, per-city service scope, complete forms, canonical/indexability and discovery links. The responsive browser suite includes both pages at seven widths and checks the shared native/enhanced enquiry flow with stubbed delivery. No routine test emails are sent.

## Sources checked 26 October 2026

- [Business representation and service-area eligibility](https://support.google.com/business/answer/3038177)
- [Service areas](https://support.google.com/business/answer/9157481)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google Search doorway policies](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse)
