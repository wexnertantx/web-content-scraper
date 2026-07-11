# Database Documentation

Postgres via Supabase. Schema lives in `supabase/migrations/0001_init.sql`.

Authentication uses Supabase Auth (`auth.users`) rather than a custom `users`
table — Supabase already hashes and stores passwords securely, so
reimplementing that would duplicate a solved problem. See DECISIONS.md.

## profiles

Extra profile data Supabase Auth doesn't track natively. Created automatically
by a trigger (`handle_new_user`) when a user signs up.

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid, PK | References `auth.users(id)` |
| full_name | text | From signup metadata |
| email | text | |
| created_at | timestamptz | |

## projects

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid, PK | |
| user_id | uuid | References `auth.users(id)` |
| project_name | text | |
| website_url | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | Auto-updated via trigger |

## scrape_runs

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid, PK | |
| project_id | uuid | References `projects(id)` |
| status | text | `pending` \| `running` \| `crawling` \| `success` \| `failed` |
| started_at | timestamptz | |
| completed_at | timestamptz | Nullable |
| summary | text | AI-generated or error summary |
| crawl_job_id | text | Nullable. Firecrawl's async crawl job id, set only for "Site Crawl" mode runs; polled via `firecrawl-crawl-status` until terminal (see `supabase/migrations/0002_crawl.sql`, DECISIONS.md Decision 8) |

## scraped_results

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid, PK | |
| run_id | uuid | References `scrape_runs(id)` |
| json_data | jsonb | Extracted structured data |
| markdown_data | text | Full page markdown from Firecrawl |
| title | text | Nullable. Page title from Firecrawl metadata (first page's title for crawl runs), added in `0003_result_metadata.sql` so the UI can read it without unpacking `json_data` |
| summary | text | Nullable. Page meta description from Firecrawl (single-page scrapes only; not set for crawl runs) |
| created_at | timestamptz | |

## Row Level Security

RLS is enabled on every table. Users can only read/write their own profile,
projects, scrape runs, and results (`scrape_runs`/`scraped_results` are
scoped via an `EXISTS` join back to `projects.user_id`).