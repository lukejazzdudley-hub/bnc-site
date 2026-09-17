# Cadence resource hub implementation plan

Approved content/design map is recorded in docs/CONTRACTS.md.
Architecture: authored ESM content rendered to static crawlable HTML; reuse
accepted brand assets and on-demand browser tool. No CMS/runtime vendor.

1. Guide agent writes six practical articles and validates unique slugs/sections,
   links, original examples, product assertions. Commit only owned directory.
2. Comparison agent researches official product documentation, writes four
   honest buyer resources with near-claim sources, dated evidence and limitations.
   No implied hands-on benchmark or manufactured pricing. Commit owned directory.
3. UI agent builds hub/renderer with topic filtering, accessible contents, strong
   product evidence, responsive layouts, no-JS content, metadata and schema.
   Tests enforce ten unique new routes and source references, original routes
   retained, article contents IDs, sitemap idempotence and no broken assets.
4. Orchestrator surveys all worktrees, reviews every article and diff, merges
   passing lanes, wires main/resource navigation and repeated builds, updates docs.
5. Run Node/Python suites, diff checks, mobile/desktop browser checks. Verify
   search still works, topic filters, links, keyboard/reduced-motion behavior.
6. Publish reviewed changes via PR to already-authorized public repository.
   Confirm successful Pages deployment and live routes before completion.
