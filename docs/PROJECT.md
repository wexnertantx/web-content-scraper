# PROJECT.md

# Website Content Scraper MVP

Version: 1.0

---

# Project Vision

The objective is to ship Version 1
within 24 hrs.

Every feature should contribute directly
to validating the product.

Avoid unnecessary complexity.

Website Content Scraper is an AI-powered SaaS application that allows non-technical users to extract structured information from websites without writing code.

The goal is to make website scraping as simple as:

1. Paste a URL
2. AI analyzes the page
3. User selects what to extract
4. Firecrawl scrapes the data
5. Results are saved
6. User can export the results

This is an MVP focused on validating the product concept, not building a full Browse.ai competitor.

---

# Product Goals

The application should allow users to:

• Register and login
• Create scraping projects
• Paste any public website URL
• Analyze the website using AI
• Detect extractable content automatically
• Scrape website content using Firecrawl
• Save results
• View previous scraping history
• Re-run previous scrapes
• Export results

The entire experience should require no coding knowledge.

---

# MVP Scope

The MVP intentionally focuses on core functionality only.

Included:

✓ User Registration
✓ Login
✓ Dashboard
✓ Create New Scrape
✓ Website Analysis
✓ AI Suggestions
✓ Firecrawl Extraction
✓ Save Results
✓ Project History
✓ Re-run Scrape
✓ CSV Export
✓ JSON Export
✓ Markdown Export

Not Included:

✗ Browser Recording
✗ CSS Selector Builder
✗ XPath Support
✗ Chrome Extension
✗ Website Monitoring
✗ Scheduled Scraping
✗ Bulk URL Upload
✗ Team Accounts
✗ API Access
✗ Billing
✗ Usage Credits
✗ Webhooks
✗ Zapier
✗ Pagination
✗ Login Protected Websites

---

# Target Users

Primary users are:

• Business Owners
• Digital Marketers
• SEO Professionals
• Sales Teams
• Researchers
• Students
• Content Writers
• AI Automation Builders
• No-code Developers

The application must be usable by non-programmers.

---

# Core User Journey

Register

↓

Login

↓

Dashboard

↓

Create New Scrape

↓

Paste URL

↓

Analyze Website

↓

AI Suggests Data

↓

User Selects Data

↓

Firecrawl Scrapes Website

↓

Save Project

↓

View Results

↓

Export

---

# Tech Stack

Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router

State Management

- React Context API

Forms

- React Hook Form

Backend

- Supabase

Database

- Supabase PostgreSQL

Authentication

Simple MVP Authentication

Fields:

- Full Name
- Email
- Password

Passwords must always be securely hashed before storage.

AI

- OpenAI API

Scraping

- Firecrawl API

Deployment

- Vercel

Version Control

- Git
- GitHub

---

# UI Design Principles

The UI should feel:

Simple

Clean

Modern

Fast

Minimal

Avoid unnecessary animations.

Use whitespace generously.

Focus on usability over visual effects.

Every screen should have one clear primary action.

---

# Color Theme

Primary

Blue

Accent

Purple

Success

Green

Error

Red

Background

White

Cards

Light Gray

Rounded Corners

Medium

---

# Dashboard

Dashboard should display:

Total Projects

Total Scrapes

Successful Scrapes

Failed Scrapes

Recent Projects

Button:

New Scrape

---

# Project Workflow

Every scrape is treated as a Project.

A Project contains:

Project Name

Website URL

Date Created

Last Run

Status

Results

Summary

---

# Scraping Modes

Mode 1

Basic Content

Extract:

Title

Meta Description

Headings

Paragraphs

Links

Images

Mode 2

Structured Data

Detect repeating items such as:

Products

Articles

Jobs

Courses

Events

Extract structured fields automatically.

Mode 3

Custom Prompt

User writes instructions like:

Extract all faculty names.

Extract all product prices.

Extract all email addresses.

OpenAI converts the request into a Firecrawl extraction strategy.

---

# AI Responsibilities

OpenAI should:

Analyze page type

Summarize website

Suggest extraction fields

Process custom prompts

Generate user-friendly explanations

AI should never expose technical scraping details to users.

---

# Firecrawl Responsibilities

Firecrawl should:

Fetch pages

Return markdown

Extract structured data

Return metadata

Firecrawl is the only scraping engine.

Do not build a custom scraper.

---

# Database Tables

Users

id

full_name

email

password_hash

created_at

Projects

id

user_id

project_name

website_url

created_at

updated_at

ScrapeRuns

id

project_id

status

started_at

completed_at

summary

ScrapedResults

id

run_id

json_data

markdown_data

created_at

---

# Folder Structure

src/

components/

pages/

layouts/

contexts/

hooks/

services/

lib/

types/

utils/

assets/

---

# API Structure

/services

openai.ts

firecrawl.ts

supabase.ts

auth.ts

projects.ts

scraping.ts

Each service should have one responsibility.

Avoid mixing concerns.

---

# Coding Standards

Use TypeScript everywhere.

Avoid using "any".

Prefer reusable components.

Keep components under 250 lines whenever practical.

Extract reusable logic into hooks.

Keep pages clean.

Avoid duplicated code.

Prefer readability over clever code.

---

# Error Handling

Every API call must handle:

Loading

Success

Failure

Timeout

Empty Result

Show user-friendly messages.

Never expose raw API errors.

---

# Loading States

Every async action should show progress.

Example:

Analyzing website...

Detecting page type...

Extracting data...

Saving results...

Completed.

Never leave the user staring at a spinner without context.

---

# Security

Never expose API keys.

Use environment variables.

Hash passwords.

Validate inputs.

Sanitize outputs.

Never trust client-side validation.

---

# Performance Goals

Dashboard should load quickly.

Avoid unnecessary re-renders.

Lazy load pages where appropriate.

Keep bundle size small.

Cache recent project data when possible.

---

# Code Quality

Write production-quality code even for MVP.

Use descriptive variable names.

Write reusable functions.

Comment only where necessary.

Avoid overengineering.

Keep the codebase easy for future AI agents to understand.

---

# Future Roadmap

Version 2

Website Monitoring

Scheduled Scraping

Bulk URL Upload

Pagination

Google Sheets Integration

Webhooks

Zapier

Email Notifications

Version 3

Visual Robot Builder

AI Workflow Builder

Browser Recording

Advanced Crawling

API Access

Teams

Credits & Billing

Marketplace

---

# Success Criteria

The MVP is successful if a new user can:

Register

Login

Paste a website URL

Analyze the page

See AI suggestions

Extract website data

Save results

View previous projects

Re-run a scrape

Export the data

without requiring any coding knowledge.

---

# Development Philosophy

Build the simplest solution that delivers value.

Prioritize working software over perfect architecture.

Avoid unnecessary complexity.

Deliver features incrementally.

Every feature should improve the user experience.

The codebase should remain clean, maintainable, and easy for both humans and AI coding agents to understand.