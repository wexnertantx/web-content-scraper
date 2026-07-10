import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY')

interface FirecrawlScrapeResponse {
  success: boolean
  data?: {
    markdown?: string
    metadata?: { title?: string; description?: string }
  }
  error?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    if (!FIRECRAWL_API_KEY) {
      return jsonResponse({ error: 'Firecrawl is not configured.' }, 500)
    }

    const { url } = await req.json()
    if (!url || typeof url !== 'string') {
      return jsonResponse({ error: 'A website URL is required.' }, 400)
    }

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true }),
    })

    const payload: FirecrawlScrapeResponse = await response.json()

    if (!response.ok || !payload.success || !payload.data) {
      return jsonResponse(
        { error: payload.error ?? 'Could not load this website.' },
        response.status >= 400 ? response.status : 502,
      )
    }

    return jsonResponse({
      markdown: payload.data.markdown ?? '',
      title: payload.data.metadata?.title ?? '',
      description: payload.data.metadata?.description ?? '',
    })
  } catch (_err) {
    return jsonResponse({ error: 'Unexpected error while scraping the website.' }, 500)
  }
})
