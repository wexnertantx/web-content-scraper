# TASKS.md

# Website Content Scraper MVP

Project Status

🟡 In Development — MVP verified end-to-end against live Supabase/OpenAI/Firecrawl, pending deployment

---

# Current Milestone

Milestone 3

Deploy to Vercel

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
- [x] Site Crawl mode (sitemap-based, async, progress polling) — post-MVP addition, see DECISIONS.md Decision 8

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

- Not yet deployed to Vercel.
- Site Crawl mode has no exact re-run (re-run always falls back to Basic
  Content, per Decision 7) and no hard ceiling on Firecrawl credit spend
  beyond the per-run page limit. See IDEAS.md.

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
- [x] Authentication working (verified against a live Supabase project)
- [x] Firecrawl working (verified against a live API key)
- [x] OpenAI working (verified against a live API key)
- [x] Projects saved
- [x] Export working
- [x] Error handling complete
- [x] Environment variables configured (local dev)
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
