# WORKFLOW.md

# Website Content Scraper MVP

Version: 1.0

---

# Purpose

This document defines the standard workflow that Claude Code must follow throughout the development of this project.

The goal is to ensure every development session is consistent, predictable, well-documented, and aligned with the MVP scope.

---

# Core Principles

Always:

* Read the project documentation before making changes.
* Understand the current codebase before writing new code.
* Keep the implementation simple.
* Build only what has been requested.
* Avoid unnecessary complexity.
* Stop after completing the requested milestone.

---

# Documents to Read

At the beginning of every development session, read the following documents in this order:

1. PROJECT.md
2. CLAUDE.md
3. TASKS.md
4. PROMPTS.md
5. README.md
6. DATABASE.md (if applicable)
7. DECISIONS.md (if applicable)

Assume these documents are the source of truth.

If there is a conflict between documentation and code, explain the conflict before making changes.

---

# Development Workflow

For every milestone, follow these steps.

## Step 1 – Understand

* Read the project documentation.
* Review the existing code.
* Understand the current architecture.
* Identify dependencies.

Do not start coding immediately.

---

## Step 2 – Plan

Before writing code:

Provide a short implementation plan including:

* Files to be created
* Files to be modified
* Components involved
* Services involved
* Database changes (if any)
* API integrations (if any)
* Risks or assumptions

Wait for approval if the implementation changes architecture, database schema, or project structure.

---

## Step 3 – Implement

Implement only the requested milestone.

Do not implement future features.

Do not change unrelated files unless necessary.

Prefer reusable components.

Keep business logic separate from UI.

Follow all coding standards defined in CLAUDE.md.

---

## Step 4 – Validate

Before completing a milestone, verify:

* No TypeScript errors
* No linting errors
* No broken routes
* Responsive layout
* Error handling exists
* Loading states exist
* Application builds successfully

---

## Step 5 – Update Documentation

When a milestone is complete:

Update:

* TASKS.md
* README.md (if features or setup changed)
* CHANGELOG.md
* DATABASE.md (if schema changed)
* PROMPTS.md (if prompts changed)
* DECISIONS.md (if architectural decisions were made)

Do not leave documentation outdated.

---

## Step 6 – Report

After implementation, provide:

### Summary

What was implemented.

### Files Changed

List every file created, modified, or deleted.

### Technical Decisions

Explain important implementation decisions.

### Known Issues

List any limitations or unresolved issues.

### Suggested Git Commit

Provide a concise Git commit message.

Then stop and wait for approval.

Do not continue to the next milestone automatically.

---

# Architecture Rules

Never introduce new libraries unless there is a clear technical benefit.

Never replace an existing library without approval.

Keep services independent.

Keep components reusable.

Keep pages lightweight.

Prefer composition over duplication.

---

# Database Rules

Before changing the database:

Explain:

* Why the change is needed
* Tables affected
* Relationships affected
* Migration impact

Wait for approval before applying schema changes.

Update DATABASE.md after any approved changes.

---

# API Rules

All external API integrations must:

* Handle errors gracefully
* Validate responses
* Avoid duplicate requests
* Use reusable service modules
* Never expose API keys

---

# UI Rules

The application should feel:

* Simple
* Clean
* Fast
* Professional
* Easy for non-technical users

Every page should have one clear primary action.

Avoid unnecessary animations.

---

# Security Rules

Always:

* Hash passwords
* Validate user input
* Sanitize output
* Protect API keys
* Use environment variables
* Never expose sensitive information

---

# MVP Rules

The objective is to deliver a working MVP as quickly as possible.

If a requested feature is outside the MVP:

* Do not implement it.
* Add it to IDEAS.md instead.
* Explain why it was deferred.

---

# Communication Style

Communicate like a Senior Software Engineer.

Be concise.

Explain important decisions clearly.

Avoid unnecessary technical jargon.

Ask questions whenever requirements are unclear.

Never guess.

---

# Git Workflow

At the end of every completed milestone:

* Suggest a Git commit message.
* Summarize the changes.
* Confirm the application builds successfully.
* Wait for approval before starting the next milestone.

---

# Definition of Done

A milestone is complete only when:

✓ Requested functionality is implemented

✓ Code follows project standards

✓ Documentation is updated

✓ No build errors exist

✓ No TypeScript errors exist

✓ Error handling is implemented

✓ Loading states are implemented

✓ Git commit message is suggested

✓ A completion summary is provided

---

# Guiding Principle

Build the simplest solution that solves the problem.

Prioritize clarity over cleverness.

Prioritize maintainability over shortcuts.

Deliver working software incrementally.

Every milestone should leave the project in a deployable state.
