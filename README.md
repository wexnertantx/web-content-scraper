# Website Content Scraper

An AI-powered web application that enables non-technical users to extract structured information from websites without writing code.

The application combines modern web scraping with AI to analyze webpages, identify useful content, extract structured data, and save the results for future use.

This project is currently being developed as a Minimum Viable Product (MVP).

---

## Project Vision

The goal of this project is to make website scraping simple for everyone.

Instead of requiring CSS selectors, XPath, or programming knowledge, users should be able to:

1. Paste a website URL
2. Let AI analyze the page
3. Select what they want to extract
4. Scrape the website
5. Save the results
6. Export the data

The application is designed for business users, marketers, researchers, students, SEO professionals, and anyone who needs structured information from websites.

---

## MVP Features

The first release focuses only on validating the core product idea.

### Authentication

* User Registration
* User Login
* Logout

### Dashboard

* View Projects
* View Scraping History
* Recent Activity

### Website Scraping

* Analyze Website
* AI Website Summary
* AI Extraction Suggestions
* Firecrawl Integration
* Save Scraped Results
* Site Crawl (sitemap-based, extracts the same fields across every page found, runs asynchronously)

### Project Management

* Create Projects
* View Previous Projects
* Re-run Scrapes
* Delete Projects

### Export

* CSV
* JSON
* Markdown

---

## Technology Stack

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Router
* React Context API
* React Hook Form

### Backend

* Supabase

### Database

* Supabase PostgreSQL

### Artificial Intelligence

* OpenAI API

### Website Scraping

* Firecrawl API

### Deployment

* Vercel

---

## Development Approach

This project is being built using an AI-assisted development workflow.

### AI Development

* Claude Code (Primary AI Development Agent)
* ChatGPT (Product Planning, Architecture, Documentation & Prompt Engineering)

Development follows milestone-based implementation with documentation updated after every completed milestone.

---

## Repository Documentation

The following documents define the project and should be treated as the source of truth.

| Document             | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| PROJECT.md           | Product vision, requirements and roadmap        |
| CLAUDE.md            | Coding standards and permanent AI instructions  |
| WORKFLOW.md          | Development workflow and implementation process |
| TASKS.md             | Current backlog and project progress            |
| PROMPTS.md           | AI prompt library                               |
| RELEASE_CHECKLIST.md | Definition of Done for the MVP                  |
| DATABASE.md          | Database documentation and schema               |
| DECISIONS.md         | Architecture decisions and rationale            |
| TEST_PLAN.md         | Testing strategy and test cases                 |
| CHANGELOG.md         | Release history                                 |
| IDEAS.md             | Future enhancements and product ideas           |

---

## Current Status

**Version:** 0.1.0

**Phase:** MVP feature-complete, pending live API keys and deployment

All MVP features described above are implemented against the documented
architecture. The app has not yet been exercised against real Supabase,
OpenAI, or Firecrawl credentials, and has not been deployed. See
`docs/TASKS.md` for the current checklist.

---

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` from your Supabase project.
3. Apply the database schema: run the migrations in `supabase/migrations/`
   (`0001_init.sql`, then `0002_crawl.sql`) against your Supabase project
   (via `supabase db push` or the SQL editor).
4. Deploy the Supabase Edge Functions in `supabase/functions/` (`firecrawl-scrape`,
   `firecrawl-extract`, `firecrawl-crawl-start`, `firecrawl-crawl-status`,
   `openai-analyze`, `openai-extract-fields`), and set their secrets —
   `OPENAI_API_KEY`, `OPENAI_MODEL`, `FIRECRAWL_API_KEY` — with
   `supabase secrets set`. These must **not** be prefixed with `VITE_`; that
   prefix is what tells Vite to inline a variable into the client bundle, and
   these two keys must stay server-side. See `docs/DECISIONS.md`, Decision 3.
5. Run the dev server: `npm run dev`

---

## Project Principles

This project follows a few simple principles throughout development:

* Build the simplest solution that delivers value.
* Keep the codebase clean and maintainable.
* Prefer reusable components over duplicated code.
* Build incrementally using clearly defined milestones.
* Keep documentation synchronized with implementation.
* Avoid unnecessary complexity.
* Prioritize user experience for non-technical users.

---

## Environment Variables

The application will require the following environment variables:

* VITE_SUPABASE_URL
* VITE_SUPABASE_ANON_KEY
* OPENAI_API_KEY
* FIRECRAWL_API_KEY

Refer to `.env.example` for the latest list.

---

## Project Roadmap

### Version 1 – MVP

* User Authentication
* AI Website Analysis
* Website Scraping
* Project History
* Export Functionality

### Version 2

* Website Monitoring
* Scheduled Scraping
* Bulk URL Processing
* Google Sheets Integration
* Webhooks

### Version 3

* Visual Robot Builder
* Browser Recording
* API Access
* Team Workspaces
* Billing & Usage Management

---

## Contributing

This project is currently under active development.

During the MVP phase, all architecture decisions, feature implementation, and documentation updates are managed through the project workflow defined in the repository documentation.

---

## License

License information will be added before the first public release.

---

## Project Owner

**Yogesh Lohar**

Built using Claude Code with product planning, architecture, and documentation support from ChatGPT.
