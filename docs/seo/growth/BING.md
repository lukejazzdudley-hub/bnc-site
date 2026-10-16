# Bing discovery

16 October 2026: signed into Bing Webmaster Tools with the existing Brand Name Changes Google identity. Added `https://brandnamechanges.com/` manually and **verified ownership** after publishing the home-page `msvalidate.01` marker in PR32. No GSC permission import, advertising or new credentials were needed. This marker is intentionally public ownership metadata.

Submitted `https://brandnamechanges.com/sitemap.xml`. Initial receipt was Processing. Follow-up now confirms **Success, 40 URLs discovered**, with zero errors or warnings and a crawl date of 16 October 2026. This confirms sitemap processing, not individual index inclusion.

Inspected `/cadence/`: discovered6 July 2026, not yet crawled or indexed. Live test: **URL can be indexed by Bing**. A notice identifies three missing image descriptions; local HTML inspection found alt attributes on every image, including intentionally empty alternatives on decorative images. Retain accessible decorative semantics instead of adding redundant descriptions just to clear a scanner.

Requested indexing for the product page and submitted the eight priority Android, type-beat, guide, French/Spanish product/tool and watch URLs. The dashboard confirms **nine submitted URLs today, 91 quota remaining**. Receipt snapshots are private. Submission acceptance is not index inclusion.

## IndexNow decision

Reviewed the [official protocol](https://www.indexnow.org/documentation). It requires an ownership key file on the public host; HTTP 200 acknowledges receipt and 202 means key validation pending. It is useful for future publication notifications, but provides no ranking guarantee. This release uses the verified sitemap plus bounded manual submissions. No private API credential or ownership-key automation has been added to the public repository. Reconsider an explicit deployment integration when the publication pipeline is automated; do not repeatedly submit unchanged URLs.

Free Bing Keyword Research observations are separate from Google Keyword Planner or Cadence traffic. Geographic scope and time windows must accompany the figures; see [query findings](QUERY-IMPROVEMENTS.md).
