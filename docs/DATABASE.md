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
| status | text | `pending` \| `running` \| `success` \| `failed` |
| started_at | timestamptz | |
| completed_at | timestamptz | Nullable |
| summary | text | AI-generated or error summary |

## scraped_results

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid, PK | |
| run_id | uuid | References `scrape_runs(id)` |
| json_data | jsonb | Extracted structured data |
| markdown_data | text | Full page markdown from Firecrawl |
| created_at | timestamptz | |

## Row Level Security

RLS is enabled on every table. Users can only read/write their own profile,
projects, scrape runs, and results (`scrape_runs`/`scraped_results` are
scoped via an `EXISTS` join back to `projects.user_id`).