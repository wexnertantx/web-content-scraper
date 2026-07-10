# PROMPTS.md

# Website Content Scraper MVP

Version: 1.0

---

# Purpose

This document contains all AI prompts used by the Website Content Scraper.

Guidelines:

- Prompts should produce structured, deterministic outputs.
- Prefer JSON responses wherever possible.
- Avoid conversational responses.
- Keep prompts reusable.
- Every prompt should have a single responsibility.

---

# AI Model

Primary Model

GPT-5.5

Use Cases

- Website Analysis
- Page Classification
- Extraction Suggestions
- AI Summary
- Custom Extraction Understanding

---

# Prompt 1 – Website Analysis

## Purpose

Understand what type of website has been submitted.

## Input

Website URL

Markdown returned by Firecrawl

## Prompt

You are an expert web content analyst.

Analyze the provided webpage content.

Determine:

- Website category
- Primary purpose
- Target audience
- Whether the page appears to contain structured repeating data.

Return only JSON.

Example format:

{
  "pageType": "",
  "category": "",
  "purpose": "",
  "targetAudience": "",
  "containsStructuredData": true
}

---

# Prompt 2 – Page Type Detection

## Purpose

Identify the kind of page.

## Prompt

Classify this webpage into ONE of the following categories:

- Blog
- News
- Product Listing
- Ecommerce Product
- Documentation
- FAQ
- Course
- Directory
- Event
- Job Board
- Landing Page
- Company Website
- Portfolio
- Unknown

Return only JSON.

Example

{
  "pageType": "Product Listing"
}

---

# Prompt 3 – AI Summary

## Purpose

Generate a concise summary for the user.

## Prompt

Summarize this webpage in less than 120 words.

Focus on:

- What the page is about
- What type of information it contains
- What users may want to extract

Do not include opinions.

Return plain text only.

---

# Prompt 4 – Extraction Suggestions

## Purpose

Suggest what information the user may want to extract.

## Prompt

Based on the webpage content, identify useful information that can be extracted.

Possible suggestions include:

- Products
- Prices
- Articles
- Headings
- Images
- Links
- Contact Details
- FAQs
- Reviews
- Job Listings
- Events
- Courses
- Team Members

Return JSON.

Example

{
  "suggestions":[
    "Products",
    "Prices",
    "Images",
    "Links"
  ]
}

---

# Prompt 5 – Custom Extraction Request

## Purpose

Convert the user's natural language request into structured extraction instructions.

## User Input Example

Extract all faculty names and email addresses.

## Prompt

The user wants to extract information from a webpage.

Convert the request into structured extraction fields.

Return JSON only.

Example

{
  "fields":[
    {
      "name":"Faculty Name",
      "type":"text"
    },
    {
      "name":"Email",
      "type":"email"
    }
  ]
}

---

# Prompt 6 – Structured Data Detection

## Purpose

Determine whether the page contains repeating data blocks.

## Prompt

Analyze the webpage.

Determine whether it contains repeating records.

Examples include:

Products

Articles

Jobs

Courses

Events

Reviews

Directory Listings

Return JSON.

Example

{
  "structuredData": true,
  "entityType": "Products"
}

---

# Prompt 7 – Result Explanation

## Purpose

Explain the scraping results to non-technical users.

## Prompt

Explain the scraping results in simple English.

Do not use technical terms.

Limit to 100 words.

---

# Prompt 8 – Suggested Project Name

## Purpose

Automatically name projects.

## Prompt

Generate a short project name.

Format:

<Website Name> - <Content Type>

Examples

Amazon - Products

BBC - News

Coursera - Courses

Maximum 40 characters.

Return plain text only.

---

# Prompt 9 – Export Description

## Purpose

Generate metadata for exported files.

## Prompt

Generate a short description of this exported dataset.

Maximum 50 words.

---

# Prompt 10 – Scrape Quality Check

## Purpose

Determine whether the scrape appears successful.

## Prompt

Review the extracted data.

Determine:

- Is the extraction complete?
- Are important fields missing?
- Does the data appear usable?

Return JSON.

Example

{
  "quality":"Good",
  "confidence":95,
  "issues":[]
}

---

# Prompt Design Rules

All prompts must:

✓ Return JSON whenever possible

✓ Avoid Markdown

✓ Avoid explanations

✓ Avoid unnecessary wording

✓ Produce deterministic responses

✓ Be reusable

✓ Have one responsibility

---

# Prompt Versioning

Every prompt change should include:

Version

Date

Reason for change

Expected improvement

Example

Prompt 4

Version 1.2

Reason

Improved detection of ecommerce listings.

Expected Result

Higher accuracy for product pages.

---

# Future Prompts

Version 2

Website Change Detection

Monitor Summary

Schedule Recommendations

Google Sheets Mapping

Webhook Payload Generation

Pagination Detection

Duplicate Detection

Price Change Detection

Version 3

AI Data Cleaning

Automatic Categorization

Dataset Enrichment

Entity Linking

Knowledge Graph Generation

Natural Language Search

Semantic Dataset Tagging