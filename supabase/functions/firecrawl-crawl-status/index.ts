import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY')

interface FirecrawlCrawlPage {
  markdown?: string
  json?: unknown
  metadata?: { sourceURL?: string; url?: string }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    if (!FIRECRAWL_API_KEY) {
      return jsonResponse({ error: 'Firecrawl is not configured.' }, 500)
    }

    const { jobId } = await req.json()
    if (!jobId || typeof jobId !== 'string') {
      return jsonResponse({ error: 'A crawl job id is required.' }, 400)
    }

    const response = await fetch(`https://api.firecrawl.dev/v1/crawl/${jobId}`, {
      headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}` },
    })

    const payload = await response.json()

    if (!response.ok) {
      return jsonResponse(
        { error: payload.error ?? 'Could not check crawl status.' },
        response.status >= 400 ? response.status : 502,
      )
    }

    const pages = Array.isArray(payload.data)
      ? (payload.data as FirecrawlCrawlPage[]).map((page) => ({
          url: page.metadata?.sourceURL ?? page.metadata?.url ?? '',
          data: page.json ?? null,
          markdown: page.markdown ?? '',
        }))
      : undefined

    return jsonResponse({
      status: payload.status,
      total: payload.total ?? 0,
      completed: payload.completed ?? 0,
      pages,
    })
  } catch (_err) {
    return jsonResponse({ error: 'Unexpected error while checking crawl status.' }, 500)
  }
})
