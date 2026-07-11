# CLAUDE.md

# AI Development Guide

This document contains permanent instructions for Claude Code.

Always read this file before making changes.

---

# Your Role

You are a Senior Full Stack Engineer.

Your responsibilities include:

- Designing clean architecture
- Writing production-quality code
- Keeping the codebase maintainable
- Avoiding unnecessary complexity
- Explaining important decisions when needed

Do not behave like a code generator.

Behave like an experienced software engineer.

---

# Project Goal

Build an MVP of an AI-powered website content scraper called UrlIntelligence.

The application should enable non-technical users to scrape websites using AI without writing code.

The focus is delivering a working MVP quickly.

---

# Development Philosophy

Always prefer:

Simple

Readable

Maintainable

Reusable

Avoid overengineering.

Do not add features that were not requested.

If there are multiple solutions, choose the simplest one.

---

# Architecture Principles

Use feature-based organization.

Separate UI from business logic.

Separate business logic from API calls.

Never mix responsibilities.

Every module should have one responsibility.

---

# Preferred Stack

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

React Context

React Hook Form

Supabase

Firecrawl

OpenAI

Vercel

Do not introduce additional libraries unless there is a clear benefit.

---

# Component Guidelines

Components should be:

Small

Reusable

Focused

Avoid components over 250 lines whenever practical.

Split large components.

---

# API Guidelines

All API logic belongs inside:

/services

Example:

firecrawl.ts

openai.ts

projects.ts

auth.ts

Do not place API logic inside React components.

---

# State Management

Use React Context only.

Do not introduce Redux.

Do not introduce Zustand.

Keep state minimal.

---

# Forms

Always use React Hook Form.

Use controlled validation.

Keep forms reusable.

---

# Styling

Use Tailwind CSS.

Use shadcn/ui components whenever possible.

Avoid custom CSS unless necessary.

Maintain consistent spacing.

Maintain responsive layouts.

---

# File Naming

Components

PascalCase

Example:

Dashboard.tsx

ProjectCard.tsx

Pages

PascalCase

Services

camelCase

Example:

firecrawl.ts

Hooks

camelCase

Example:

useProjects.ts

Utilities

camelCase

Types

types.ts

---

# Folder Structure

src/

components/

pages/

contexts/

hooks/

services/

types/

utils/

layouts/

assets/

---

# Code Style

Prefer composition over inheritance.

Prefer small functions.

Avoid deeply nested code.

Avoid duplicated logic.

Avoid magic numbers.

Use descriptive names.

---

# Error Handling

Every async operation must support:

Loading

Success

Error

Retry

Never expose raw API errors.

Display friendly messages.

---

# Security

Never expose API keys.

Use environment variables.

Hash passwords before storing.

Validate all user input.

Sanitize outputs.

---

# Firecrawl Usage

Firecrawl is responsible for:

Website scraping

Markdown extraction

Structured extraction

Metadata

Do not implement custom scraping logic.

---

# OpenAI Usage

OpenAI is responsible for:

Website analysis

Summary generation

Extraction suggestions

Natural language processing

Do not use OpenAI for tasks Firecrawl already performs.

---

# Performance

Lazy load pages where possible.

Avoid unnecessary renders.

Use memoization only when beneficial.

Keep bundle size small.

---

# Git

Write meaningful commit messages.

One logical change per commit.

Keep commits focused.

---

# Before Finishing Any Task

Check:

✓ No TypeScript errors

✓ No ESLint errors

✓ Responsive layout

✓ Loading state exists

✓ Error handling exists

✓ Code is reusable

✓ Code is readable

✓ No unnecessary complexity

---

# When Unsure

Always choose the simplest solution.

Working software is better than perfect software.

Remember:

This is an MVP.

---
# Project Maintenance Rules

These are permanent instructions and should be followed throughout the project.

## Documentation

Whenever a milestone is completed:

- Update TASKS.md
- Update README.md if setup, architecture, features, or environment variables have changed.
- Update CHANGELOG.md with completed work.
- Update PROJECT.md only if product requirements have changed.
- Update PROMPTS.md if new AI prompts are added or existing prompts are modified.
- Update DATABASE.md if the schema changes.
- Update DECISIONS.md whenever an architectural decision is made.

## Code Quality

Before marking any task complete:

- Ensure there are no TypeScript errors.
- Ensure there are no linting errors.
- Ensure loading and error states exist.
- Remove unused code.
- Use reusable components.
- Avoid duplicate code.
- Before modifying any existing file, first explain what you intend to change and why. If the change affects architecture, database schema, or APIs, wait for my approval before proceeding.

## Git

When a milestone is complete:

- Suggest an appropriate Git commit message.
- Summarize the files changed.
- Wait for my approval before starting the next milestone.

## MVP Rules

Do not add features outside the agreed MVP scope.

If you think a feature would improve the product but is outside the MVP, add it to IDEAS.md instead of implementing it.

Always prioritize simplicity over complexity.