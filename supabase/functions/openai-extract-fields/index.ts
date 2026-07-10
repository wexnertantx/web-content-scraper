import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const OPENAI_MODEL = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini'

const SYSTEM_PROMPT = `The user wants to extract information from a webpage. Convert their request into structured extraction fields.

Return only JSON with this exact shape, no markdown or commentary:
{
  "fields": [
    { "name": string, "type": "text" | "email" | "url" | "number" | "price" | "image" | "date" }
  ]
}`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    if (!OPENAI_API_KEY) {
      return jsonResponse({ error: 'AI analysis is not configured.' }, 500)
    }

    const { customPrompt } = await req.json()
    if (!customPrompt || typeof customPrompt !== 'string') {
      return jsonResponse({ error: 'A description of what to extract is required.' }, 400)
    }

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
          { role: 'user', content: customPrompt },
        ],
      }),
    })

    const payload = await response.json()

    if (!response.ok) {
      return jsonResponse({ error: payload.error?.message ?? 'Could not understand that request.' }, 502)
    }

    const content = payload.choices?.[0]?.message?.content
    if (!content) {
      return jsonResponse({ error: 'AI returned an empty response.' }, 502)
    }

    const parsed = JSON.parse(content)
    return jsonResponse({ fields: parsed.fields ?? [] })
  } catch (_err) {
    return jsonResponse({ error: 'Unexpected error while processing your request.' }, 500)
  }
})
