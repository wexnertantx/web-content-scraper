-- Adds support for full-site crawls (async Firecrawl crawl jobs) alongside
-- the existing single-page scrape flow.

alter table public.scrape_runs
  add column if not exists crawl_job_id text;

alter table public.scrape_runs
  drop constraint if exists scrape_runs_status_check;

alter table public.scrape_runs
  add constraint scrape_runs_status_check
  check (status in ('pending', 'running', 'crawling', 'success', 'failed'));
