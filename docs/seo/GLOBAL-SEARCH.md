# Cadence global search rollout

Checked 16 October 2026. Primary URL: https://brandnamechanges.com/cadence/.
Secondary name: **Flow by Cadence**. Luke confirmed that flowbycadence.com should
forward visitors to the existing product site, not become a competing website.

## Screenshot tasks and delivery

1. Google Ads account: an existing signed-in account already provides Keyword
   Planner. Reused it; no new account, campaign, billing or advertising spend.
2. Customer searches: expanded 110 seed phrases into 109 normalized historical-metric rows after an initial twelve-query pass. Measured in Keyword Planner for the UK
   and all locations, Google network, all languages, October 2025–September 2026.
3. Search map: `intent-traffic-map.csv` records the expanded observed ranges and intended destinations; `keyword-research-2026-10-16.csv` retains the initial pilot and
   `page-map.csv` assigns a primary intent to every public acquisition route.
4. Site structure: retain the five established search pages and ten resource articles; add type-beat songwriting, Android, song structure and freestyle practice; add French/Spanish product introductions and a language directory;
   add a country download directory and six English regional product editions.
5. Content system: version-controlled modules and static HTML generators serve
   the role of a CMS. No Webflow migration, subscription or client-rendered
   content is needed. Edit sources and regenerate; do not hand-edit outputs.
6. Templates: retain onyx/silver styling and real product imagery. Add visible
   native details/summary FAQs to the product page and nine search pages; local
   editions include storefront guidance, FAQs and distinct writing exercises.
7. Machine-readable content: reciprocal hreflang, self-canonicals, sitemap,
   WebPage/BreadcrumbList/FAQPage markup and the existing SoftwareApplication.
   Structured answers match visible copy. No invented reviews, prices, offices,
   LocalBusiness schema or hidden AI text.
8. Copy: preserve approved product positioning. Describe beat-first, lyric-first
   and freestyle-first entry, disclose browser/app rhyme-engine differences and
   language limits, keep public App Store and Google Play acquisition links.

## What the keyword data says

Worldwide monthly bands: songwriting app and rhyme finder 1k–10k; lyric writing
app 100–1k; rap writing, rap recording, slant rhyme finder and the two device
queries 10–100. Five queries have unavailable metrics, not proven zero demand.
UK bands are recorded separately. No band is an exact count or a regional
conversion forecast. Google Ads competition measures advertiser competition;
it is **not** organic SEO difficulty. A draft research plan was saved; it is not
an advertising campaign. No account identifiers belong in this public repo.

Keep "lyric writing app" on the songwriting page, and slant/multisyllabic tool
queries on the working rhyme finder. Creating near-identical pages for each
phrase would fragment intent. Resource articles teach the underlying task and
link to the tool/product; they should not copy a commercial landing page.

## Regional scope and evidence

First six editions: GB, US, CA, AU, IN and ZA, all in English. Apple lookup API
returned the same app ID 6778554520, title `Cadence: Lyrics & Rhymes`, English
interface declaration and local currencies GBP/USD/CAD/AUD/INR/ZAR for all six
on 16 October. Stable App Store URLs use each country code. Google Play links
use `hl=en&gl=XX` as a storefront hint: that is not proof of install eligibility,
which depends on the account/device and must be checked in the store.

Each page contains local purchase guidance and a distinct original writing
exercise. Canada, India and South Africa explicitly distinguish multilingual
writing from verified dictionary/interface support. UK/Australia discuss accent
checks; US covers stress and timing. No local office, translation, regional rhyme
engine or blanket language support is claimed. No city doorway pages are added.

The global product URL, French/Spanish introductions and six regional URLs are reciprocal alternatives:
`en`, `fr`, `es`, `en-GB`, `en-US`, `en-CA`, `en-AU`, `en-IN`, `en-ZA`, plus `x-default` on
the global URL. The directory itself is not an equivalent product edition and
is excluded from that alternate cluster. Every edition has a self-canonical.
Users choose their country; there are no IP or browser-language redirects.
Add future regions only with verified storefronts and useful local content.
Translation requires complete visible content and quality review, not relabeling
these English editions as another language.

## Domain redirect

Use Cloudflare's free Single Redirects with proxied A records for `@` and `www`
to `192.0.2.1` (Cloudflare's documented redirect-only placeholder). Match only
`flowbycadence.com` and `www.flowbycadence.com`, return 301 to
`https://brandnamechanges.com/cadence/`, preserve query strings, and cover HTTP
and HTTPS. This is a secondary brand entry point, not a migration: do not change
the existing CNAME, canonical product URL, legal URLs or mobile association.

Do not call the alias a second indexed website or claim it doubles rankings.
Test apex/www on HTTP/HTTPS and an arbitrary path after saving the redirect.
A future standalone-site migration would require a separate URL mapping and
change-of-address plan; that is not part of this rollout.

## Measurement after deployment

Use the already verified Search Console domain property, submit
`https://brandnamechanges.com/sitemap.xml`, inspect the country directory and a
regional URL, and review Page Indexing. Separate submitted, fetched, indexed and
ranking. Export queries and pages by country at 28 and 90 days; compare branded
queries separately from non-branded acquisition. Current keyword bands are not
current Search Console performance. The September baseline is historical.

Measure search impressions, clicks and outbound store visits separately from
installs and purchases. No new tracker or consent change is included. Prioritize
improving pages that earn impressions before generating more countries.

## Sources and limits

- [Google international sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google generative AI guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): no special AI files or schema required; normal crawlability and useful visible content matter.
- [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies): doorway and scaled low-value content risks.
- [Google documentation updates](https://developers.google.com/search/updates): FAQ rich results stopped appearing on 7 May 2026; their documentation was removed in June. Visible FAQs remain useful, with descriptive Schema.org markup, but no Google FAQ rich-result claim.
- [Cloudflare alias domains](https://developers.cloudflare.com/fundamentals/manage-domains/redirect-domain/)
- [Apple software lookup](https://itunes.apple.com/lookup?id=6778554520&country=gb), repeated with us/ca/au/in/za.

No ranking, indexing, AI citation or install outcome is guaranteed by deployment.


## Expansion executed after research review

Luke approved execution on 16 October and identified type-beat writing as a key
USP. The new type-beat landing page demonstrates the connected workflow, links
the detailed rap guide, includes an original exercise and distinguishes importing
permitted audio from acquiring a beat licence. No unsupported “best app” award,
review, rating or YouTube-download capability is claimed.

The Google Play description checked on 16 October supports on-device rhymes,
A/B loops, draft takes, arrangement, mobile DAW and offline writing. The local
app catalog contains French/Spanish packs; these pages describe catalog support,
not a new tested dictionary release. Native editorial review and device-specific
pack acceptance remain useful follow-ups. Do not represent local source review
as a fresh physical-device test.

Worldwide bands include Android songwriting 10–100, GarageBand alternative Android
100–1k, dictionnaire de rimes 1k–10k and diccionario de rimas 10k–100k. Native
web-dictionary demand is not fulfilled by the translated product pages. The web
finder remains English only. Do not add hidden French/Spanish dictionary claims.
The 955 discovery ideas were not fully exported or curated. Bands overlap, are
not unique users and are not organic traffic or install forecasts. Country-level
language demand and organic competitiveness remain unmeasured.

Run `python3 scripts/audit_crawl.py` after all generators. It checks sitemap
canonicals, noindex conflicts, anchor reachability, local assets and fragments.
The feedback form intentionally remains noindex and is excluded from the sitemap.
The 36 indexable sitemap destinations include 31 Cadence URLs. No private Search
Console exports or account identifiers belong in this public repository.

Check the Search Console generative-AI inclusion state and dedicated performance
report as well as Web results. Sitemaps, deployment, index requests, actual indexing
and AI citations are distinct states. No custom AI file guarantees any of them.

## Follow-up implementation

The historical 109-query map above is retained as a dated research snapshot.
French and Spanish dictionary intent now has independent functional browser tools
at `/cadence/fr/dictionnaire-rimes/` and `/cadence/es/diccionario-rimas/`.
See `growth/COMPETITIVE-ANALYSIS.md` for current intent decisions and remaining
country-metric gaps, `growth/LANGUAGE-REVIEW.md` for source/quality scope,
`growth/MEASUREMENT.md` for optional acquisition counts, and
`growth/INDEXING.md` for actual Google indexing states.
