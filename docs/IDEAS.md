# Product Ideas

Add new feature ideas here.

---

## Future Features

- Website Monitoring
- Bulk URL Upload
- Google Sheets Integration
- Webhooks
- Persist the extraction mode/fields used on each scrape run (e.g. a `config`
  jsonb column on `scrape_runs`) so "Re-run Scrape" can exactly repeat a
  Structured Data or Custom Prompt scrape instead of always falling back to
  Basic Content fields. See DECISIONS.md, Decision 7.
- Bring back the standalone AI prompts not wired into the MVP's two edge
  functions (auto project naming, result explanation in plain English, export
  description, scrape quality check) if user feedback asks for them. See
  DECISIONS.md, Decision 4.
- Persist Site Crawl config (limit/entityType/fields) so "Re-run Scrape" can
  repeat a crawl exactly, same as the existing gap for Structured/Custom
  single-page scrapes. See DECISIONS.md, Decision 8.
- Add a hard cap on total Firecrawl credit spend for Site Crawl, independent
  of the per-run page `limit` (e.g. a per-user monthly crawl budget).
- Investigate the production JS bundle jumping from ~333 KB to ~538 KB
  (minified) after the crawl feature was added, despite no new npm
  dependencies — likely a tree-shaking/chunking quirk worth profiling
  (`build.rolldownOptions.output.codeSplitting` or dynamic `import()` per
  CLAUDE.md's "keep bundle size small" goal), not a functional bug.