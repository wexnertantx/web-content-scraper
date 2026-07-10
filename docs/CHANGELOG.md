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

Not yet done: verification against live Supabase/OpenAI/Firecrawl credentials,
Vercel deployment.
