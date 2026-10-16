# Public language tools and optional acquisition counts

Accepted implementation direction: 16 October 2026, following Luke's request to complete search growth tasks.

Preserve the existing static website and canonical product domain. Add useful browser dictionaries in native French/Spanish routes using independently licensed public sources; do not copy proprietary app packs whose release provenance gate remains unresolved. Keep source attribution, downloadable ShareAlike datasets, exact revisions and linguistic limitations visible. Native human acceptance remains pending, not inferred from automated tests.

Use workers for dictionary loading/matching, integrity and byte limits, and explicit no-result states. Static methods/examples remain crawlable. Equivalent dictionary pages have reciprocal language alternates; product introductions remain a separate intent cluster. The tradeoff is a first-search download, particularly Spanish (~9 MB uncompressed), rather than server-side query collection.

Add optional aggregate acquisition counts only after consent. The browser emits route, coarse source, event and store; no lyric/search text or visitor ID. Backend uses a separate strict collector, private RLS tables and hourly HMAC abuse buckets. This supports page/store reporting while deliberately preventing person-level query/install attribution. Counts are best effort and opt-in biased. See the measurement guide for retention and reporting constraints.

Keep the accepted fonts and animated mark, but self-host Latin fonts with upstream notices and serve correctly sized navigation/hero variants. Measure lab improvements after publishing; byte savings do not establish field Core Web Vitals.
