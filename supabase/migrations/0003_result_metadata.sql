-- Add typed title/summary columns to scraped_results so the UI can read
-- page metadata directly instead of unpacking json_data every render.
alter table public.scraped_results
  add column if not exists title text,
  add column if not exists summary text;
