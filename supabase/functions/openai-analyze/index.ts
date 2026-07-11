import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const OPENAI_MODEL = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini'
const MAX_CONTENT_CHARS = 12000

const SYSTEM_PROMPT = `You are an expert web content analyst. Analyze the provided webpage content.

Determine the website category, primary purpose, target audience, whether the page contains repeating structured records (e.g. products, articles, jobs, courses, events), a short user-friendly summary (under 120 words, no opinions), and a list of data types a user could reasonably extract from this page (e.g. Products, Prices, Articles, Headings, Images, Links, Contact Details, FAQs, Reviews, Job Listings, Events, Courses, Team Members).

Return only JSON with this exact shape, no markdown or commentary:
{
  "pageType": string,
  "category": string,
  "purpose": string,
  "targetAudience": string,
  "containsStructuredData": boolean,
  "entityType": string,
  "summary": string,
  "suggestions": string[]
}`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    if (!OPENAI_API_KEY) {
      return jsonResponse({ error: 'AI analysis is not configured.' }, 500)
    }

    const { url, markdown } = await req.json()
    if (!url || !markdown) {
      return jsonResponse({ error: 'A URL and page content are required.' }, 400)
    }

    const truncatedContent = String(markdown).slice(0, MAX_CONTENT_CHARS)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        response_format: { type: 'json_object' },
        temperature: 0.2,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Website URL: ${url}\n\nPage content:\n${truncatedContent}` },
        ],
      }),
    })

    const payload = await response.json()

    if (!response.ok) {
      return jsonResponse({ error: payload.error?.message ?? 'AI analysis failed.' }, 502)
    }

    const content = payload.choices?.[0]?.message?.content
    if (!content) {
      return jsonResponse({ error: 'AI analysis returned an empty response.' }, 502)
    }

    const analysis = JSON.parse(content)
    return jsonResponse(analysis)
  } catch (_err) {
    return jsonResponse({ error: 'Unexpected error during AI analysis.' }, 500)
  }
})
