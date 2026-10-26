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

Use the existing profile in the Brand Name Changes Google account. Luke created the initial profile during this task. Do not create a duplicate profile or a separate London listing without a genuine eligible location. The primary category observed is Software company. Add only relevant additional categories and actual service offers. The website should lead to `/work-with-us/` for the complete offer and enquiry form.

A 523-character description was saved, covering Bristol/London, websites, bookings, online shops, payments, portals, custom software, CRM, automation and infrastructure. Luke explicitly chose to retain the current visible location and 24-hour weekday listing (weekends are closed in the saved schedule). Keep those owner-provided settings; do not describe them as 24/7. Bristol and London were already included in the saved service areas. Keep verification material and private screenshots outside this public repository.

Google's onboarding used a generic verification notice. A subsequent Business Profile Manager check confirmed one BNC Studio business with status Verified and 100% verified. The description save was also visible in the editor. Web Designer was selected and saved, and subsequently appeared as the current additional category. Eleven relevant services were saved: Application development, IT consulting, Mobile app development, Software consulting, Software development, Website design and development, Booking and ordering systems, E-commerce and payment integrations, CRM integrations and workflow automation, Customer portals and internal tools, and Software maintenance and infrastructure support. The follow-up check on 26 October confirmed all eleven services are current: the services editor no longer shows a pending-review notice. The existing studio mark is the logo and the genuine Cadence product image is the cover; both appear as current media without pending badges. The exact website destination `https://brandnamechanges.com/work-with-us/` was saved and confirmed as the current URL after reloading the editor. Skip paid ads and Workspace offers unless separately requested. Use actual studio/product assets; fictional businesses are not clients and their artwork is not a storefront photograph.

## Search Console

The Brand Name Changes Google account has access to the verified `sc-domain:brandnamechanges.com` property. PR50 was merged and GitHub Pages built commit `f76d6a58dfe05b9f7aabe2c11a03270faab72b2c`. The existing sitemap was resubmitted successfully on 26 October 2026; Google reported 86 discovered pages and two videos. The follow-up completed four URL Inspection requests successfully:

| URL | Observed status | Action confirmed |
| --- | --- | --- |
| `/` | URL is on Google; page is indexed | Refresh request accepted |
| `/work-with-us/` | Not yet indexed | Indexing request accepted |
| `/work-with-us/bristol/` | Not yet indexed; live test says URL is available to Google, page can be indexed, breadcrumb item valid | Indexing request accepted |
| `/work-with-us/london/` | Not yet indexed | Indexing request accepted |

Each request showed “Indexing requested” and confirmation that the URL was added to a priority crawl queue. The earlier reCAPTCHA connection failure is resolved for these submissions; no manual CAPTCHA or browser security changes were needed. Do not resubmit repeatedly: Google explicitly says this does not change queue position or priority. A submitted sitemap or indexing request is not evidence of indexing, rankings or enquiries.

## Validation

`tests/local-services.test.mjs` checks real provider identity, per-city service scope, complete forms, canonical/indexability and discovery links. The responsive browser suite includes both pages at seven widths and checks the shared native/enhanced enquiry flow with stubbed delivery. No routine test emails are sent.

## Sources checked 26 October 2026

- [Business representation and service-area eligibility](https://support.google.com/business/answer/3038177)
- [Service areas](https://support.google.com/business/answer/9157481)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google Search doorway policies](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse)

Production verification passed: 56 responsive page/width combinations, stubbed native/enhanced enquiry flows (no real email), concept controls, JS/no-JS homepage acquisition links, rendered motion/offscreen stopping and reduced-motion/no-WebGL/save-data fallbacks. Local city-page Lighthouse scores: Bristol 100/100/100/100; London 99/100/100/100.

Follow-up readiness checks: homepage, services and both city pages returned HTTP 200 with correct self-canonicals, Organization/Service data as appropriate, visible phone links and no noindex restriction. Robots allows crawling and names the sitemap. The live intake endpoint returned HTTP 204 with the correct production-origin CORS preflight. The fresh 56-case production browser suite passed; its enquiry delivery is stubbed, so this is not a new inbox-delivery claim. Actual native and enhanced inbox delivery was verified during activation (see OPERATIONS.md).
