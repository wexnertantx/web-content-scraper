# TASKS.md

# Website Content Scraper MVP

Project Status

🟡 In Development — MVP feature-complete, pending real API keys + deployment

---

# Current Milestone

Milestone 2

Configure real Supabase/OpenAI/Firecrawl credentials, verify end-to-end against
live APIs, deploy to Vercel

---

# Backlog

## Authentication

- [x] Registration Page
- [x] Login Page
- [x] Logout
- [x] Session Handling

---

## Dashboard

- [x] Dashboard Layout
- [x] Statistics Cards
- [x] Recent Projects
- [x] Navigation

---

## Scraping

- [x] New Scrape Page
- [x] URL Validation
- [x] Firecrawl Integration
- [x] Loading Indicator
- [x] Error Handling

---

## AI

- [x] OpenAI Integration
- [x] Website Summary
- [x] Page Type Detection
- [x] Extraction Suggestions

---

## Results

- [x] Results Table
- [x] JSON Viewer
- [x] Markdown Viewer
- [x] AI Summary

---

## Projects

- [x] Save Project
- [x] Project History
- [x] Project Details
- [x] Re-run Scrape

---

## Export

- [x] CSV Export
- [x] JSON Export
- [x] Markdown Export

---

## UI

- [x] Responsive Design
- [x] Empty States
- [x] Error States
- [x] Loading States

---

# In Progress

None

---

# Completed

Milestone 1 — Project Foundation + full MVP feature set implemented against
the documented architecture (React/Vite/TS/Tailwind frontend, Supabase Auth +
Postgres, Supabase Edge Functions wrapping OpenAI + Firecrawl). Not yet
verified against live API keys or deployed.

---

# Known Issues

- No real Supabase project, OpenAI key, or Firecrawl key has been wired up yet
  — the app has not been exercised against live APIs. Env vars are documented
  in `.env.example`; edge function secrets need to be set with
  `supabase secrets set` before anything works end-to-end.
- Not yet deployed to Vercel.

---

# Technical Debt

None

---

# Ideas

See IDEAS.md.

---

# Release Checklist

See RELEASE_CHECKLIST.md.

Before MVP Release

- [x] All pages responsive
- [x] Authentication working (pending live Supabase project to verify)
- [x] Firecrawl working (pending live API key to verify)
- [x] OpenAI working (pending live API key to verify)
- [x] Projects saved
- [x] Export working
- [x] Error handling complete
- [ ] Environment variables configured (real values, not placeholders)
- [ ] Deployment successful

---

# MVP Definition of Done

The MVP is complete when a user can:

Register

Login

Create a project

Paste a URL

Analyze a website

Scrape data

Save results

View previous projects

Export data

without any coding knowledge.
