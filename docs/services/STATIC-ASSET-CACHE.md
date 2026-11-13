# Static asset cache deployment

Status: prepared; **not applied**. The source website currently serves through
GitHub Pages with Cache-Control: max-age=600. Its Cloudflare nameservers are
scott.ns.cloudflare.com and walk.ns.cloudflare.com, but the available Cloudflare
account does not contain the brandnamechanges.com zone. No account, nameserver,
DNS, SSL or cache rule was changed during the source optimisation.

## Scope to apply in the existing zone

Use content/home-assets.json to review the eight current immutable files. Their
filenames include SHA256 content prefixes; the build checks the source bytes.
Apply long-lived caching only to /assets/immutable/ and hashed .woff2 files under
/assets/fonts/. Keep HTML, sitemap.xml, robots.txt, dictionaries/manifests,
service endpoints and mutable shared source filenames on their current policy.
Do not apply a global Cache Everything or global year-long Browser TTL.

For successful immutable responses, the intended browser lifetime is one year
(31536000 seconds), with an edge lifetime of one month (2592000 seconds). Never
cache errors for these durations. Merge a scoped rule with the existing zone
rules after inspecting their precedence; do not replace the zone ruleset.
If the rule editor cannot restrict successful responses, use the verified exact
URL allowlist from the current manifest, check every URL returns 200 before
activation, and keep previously published versioned files available. Updating an
exact allowlist is part of publishing newly versioned paths.

Cloudflare documents browser_ttl/edge_ttl mode as override_origin. Review the
current editor/API rather than guessing settings. The zone must proxy the web
records for CDN HTTP rules to apply; DNS-only records bypass them. Verify the
existing records and Full (strict) TLS before any proxy change, preserve GitHub
Pages origin targets, and check apex/www redirects, range media and forms after.
Do not change email/verification records or the Flow by Cadence redirect.

## Acceptance

- Every current manifest URL returns 200 with the expected MIME and bytes.
- Its HTTP cache lifetime reflects the intended long-lived rule.
- A changed asset produces a different URL; old versioned URLs still work.
- HTML and sitemap freshness remain bounded by the existing origin policy.
- Lighthouse cache-insight no longer flags the manifest resources; render-blocking
  CSS remains zero and the font discovery chain stays flat.
- Main page, Cadence product, dictionaries, media ranges and enquiry flow remain
  functional. Record actual deployment time and header evidence privately.

Disable only the added scoped cache rule (and restore captured proxy settings if
changed) to roll back. Keep published asset URLs available. Do not weaken TLS,
cache private responses or add a service worker merely to mask an HTTP-header audit.

References checked 13 November 2026:
- https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl
- https://developers.cloudflare.com/cache/how-to/cache-rules/settings/
- https://developers.cloudflare.com/dns/proxy-status/
