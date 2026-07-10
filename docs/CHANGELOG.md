v0.1.0

Initial project scaffold: Vite + React + TypeScript + Tailwind CSS v4

Authentication (Supabase Auth): Register, Login, Logout, session handling

Dashboard: stat cards, recent projects, navigation

Firecrawl integration via Supabase Edge Functions (scrape + structured extract)

OpenAI integration via Supabase Edge Functions (website analysis, summary,
extraction suggestions, custom-prompt-to-fields)

New Scrape wizard: URL entry, AI analysis review, Basic/Structured/Custom
extraction modes

Project history, project details, re-run scrape, delete project

Export: CSV, JSON, Markdown

Database schema + Row Level Security policies (`supabase/migrations/0001_init.sql`)

Verified end-to-end against live Supabase, OpenAI, and Firecrawl credentials.

Not yet done: Vercel deployment.

---

v0.2.0

Site Crawl mode: follows a site's sitemap and applies the same extraction
fields to every page found, via an async Firecrawl crawl job

New edge functions: `firecrawl-crawl-start`, `firecrawl-crawl-status`

`scrape_runs.crawl_job_id` column + `crawling` status
(`supabase/migrations/0002_crawl.sql`)

ProjectDetails polls crawl progress ("Crawled X of Y pages...") and finalizes
the run automatically

Fixed: all Firecrawl edge functions were calling the deprecated v1 API shape
(`jsonOptions` sibling field); migrated to v2's `formats: [{ type: 'json',
schema, prompt }]` after live testing surfaced a "Unrecognized key in body"
error. See DECISIONS.md, Decision 5 amendment.
