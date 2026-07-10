# Architecture Decisions

## Decision 1

Initial MVP stack approved.

React

Supabase

OpenAI

Firecrawl

Vercel

---

## Decision 2 — Supabase Auth instead of a custom Users table

PROJECT.md describes a `Users` table with `password_hash`. Instead of hand-rolling
password hashing, authentication uses Supabase Auth (`auth.users`), which already
hashes and stores passwords securely and provides session handling out of the box.
A `profiles` table (id, full_name, email, created_at) stores the one field
Supabase Auth doesn't track natively (`full_name`), populated via a Postgres
trigger on signup. This satisfies "passwords must be hashed" without
reimplementing something Supabase already solves.

## Decision 3 — OpenAI and Firecrawl calls run in Supabase Edge Functions, not the browser

`.env.example` (and README.md) already distinguish `VITE_`-prefixed vars (safe
to ship in the client bundle) from `OPENAI_API_KEY` / `FIRECRAWL_API_KEY` (no
`VITE_` prefix). Vite only inlines `VITE_`-prefixed vars into client code, so
calling OpenAI/Firecrawl directly from React would require exposing those
secret keys in the bundle — violating "Never expose API keys." Instead, four
Supabase Edge Functions (`supabase/functions/`) hold the secrets server-side:

- `firecrawl-scrape` — fetches a page and returns markdown + metadata
- `firecrawl-extract` — runs Firecrawl's schema-based structured extraction
- `openai-analyze` — analyzes a page (category, summary, extraction suggestions)
- `openai-extract-fields` — converts a custom-prompt request into extraction fields

`src/services/firecrawl.ts` and `src/services/openai.ts` are thin clients that
call `supabase.functions.invoke(...)`, keeping the "each service has one
responsibility" rule from CLAUDE.md while never shipping a provider key to the
browser.

## Decision 4 — AI prompts consolidated from PROMPTS.md's 10 prompts into 2 edge functions

`openai-analyze` combines Prompts 1, 3, 4, and 6 (page analysis, summary,
extraction suggestions, structured-data detection) into a single JSON call
instead of four round trips, since they all analyze the same page content —
fewer OpenAI calls, lower latency, same output shape described in PROMPTS.md.
`openai-extract-fields` implements Prompt 5 (custom extraction → fields)
as-is. Prompts 2, 7, 8, 9, 10 (standalone page-type classification, result
explanation, project naming, export description, quality check) were not
needed for MVP scope and were left out — the info they'd add (project name
suggestion, export description, quality score) is not in RELEASE_CHECKLIST.md's
definition of done. Revisit if product feedback asks for them.

Also note: PROMPTS.md lists "GPT-5.5" as the model, which is not a real OpenAI
model id. Edge functions default to `gpt-4o-mini` via a configurable
`OPENAI_MODEL` secret — update PROMPTS.md and the secret once a target model
is confirmed.

## Decision 5 — Firecrawl v1 `/scrape` with `formats: ["json"]` + `jsonOptions`, not a separate `/extract` endpoint

Verified against Firecrawl's current API surface (not just training data):
structured extraction uses `POST /v1/scrape` with `formats: ["json"]` and
`jsonOptions: { prompt, schema }`, not the older `extract` format/field some
docs describe. `firecrawl-extract` builds a JSON Schema from the user's
selected fields (array schema when `entityType` is set, for repeating
records; object schema otherwise).

## Decision 6 — Tailwind CSS v4 via the Vite plugin, no shadcn CLI

Used `@tailwindcss/vite` (Tailwind v4's native Vite integration) plus a small
set of hand-written, shadcn-styled primitives in `src/components/ui`
(Button, Input, Textarea, Select, Card, Badge, Alert, Label, Spinner) built
with `class-variance-authority` + `tailwind-merge`, instead of running the
`shadcn` CLI. This avoids a network-dependent interactive scaffolding step
while keeping the same ownership model (components live in-repo, easy to
customize) and Tailwind class conventions shadcn/ui uses.

## Decision 7 — "Re-run Scrape" always uses Mode 1 (Basic Content) fields

`scrape_runs` doesn't persist which extraction fields/mode produced a given
result (PROJECT.md's documented schema doesn't include this either). Rather
than adding a config column pre-launch, one-click re-run always uses the
fixed `BASIC_CONTENT_FIELDS` set (title, meta description, headings,
paragraphs, links, images). Re-running a Structured Data or Custom Prompt
scrape with its original configuration requires going through New Scrape
again for now. Persisting the original run config for exact re-runs is
tracked in IDEAS.md.