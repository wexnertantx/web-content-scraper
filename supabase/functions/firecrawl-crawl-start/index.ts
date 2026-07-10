import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY')
const DEFAULT_LIMIT = 25
const MAX_LIMIT = 100
// Depth 0 is the entered URL (and sitemap URLs); each level adds one hop of
// discovered links.
const MAX_DISCOVERY_DEPTH = 3

interface ExtractionField {
  name: string
  type: 'text' | 'email' | 'url' | 'number' | 'price' | 'image' | 'date'
}

interface CrawlStartRequestBody {
  url: string
  limit?: number
  entityType?: string
  fields: ExtractionField[]
}

function fieldSchemaType(type: ExtractionField['type']): string {
  return type === 'number' || type === 'price' ? 'number' : 'string'
}

function buildJsonSchema({ entityType, fields }: CrawlStartRequestBody) {
  const properties = Object.fromEntries(
    fields.map((field) => [field.name, { type: fieldSchemaType(field.type) }]),
  )
  const itemSchema = {
    type: 'object',
    properties,
    required: fields.map((field) => field.name),
  }

  return entityType ? { type: 'array', items: itemSchema } : itemSchema
}

function buildPrompt({ entityType, fields }: CrawlStartRequestBody): string {
  const fieldList = fields.map((field) => field.name).join(', ')
  if (entityType) {
    return `Extract every "${entityType}" record from this page. For each record, extract: ${fieldList}.`
  }
  return `Extract the following information from this page: ${fieldList}.`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    if (!FIRECRAWL_API_KEY) {
      return jsonResponse({ error: 'Firecrawl is not configured.' }, 500)
    }

    const body: CrawlStartRequestBody = await req.json()
    if (!body?.url || !Array.isArray(body.fields) || body.fields.length === 0) {
      return jsonResponse({ error: 'A URL and at least one field are required.' }, 400)
    }

    const limit = Math.min(Math.max(body.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT)

    const response = await fetch('https://api.firecrawl.dev/v2/crawl', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: body.url,
        limit,
        sitemap: 'include',
        // Without this, Firecrawl only follows child URLs of the entered
        // path, so a crawl started on an inner page scrapes just that page.
        crawlEntireDomain: true,
        maxDiscoveryDepth: MAX_DISCOVERY_DEPTH,
        scrapeOptions: {
          onlyMainContent: true,
          // v2 embeds schema/prompt directly in the format entry; there is
          // no separate jsonOptions field like in v1.
          formats: [
            'markdown',
            {
              type: 'json',
              schema: buildJsonSchema(body),
              prompt: buildPrompt(body),
            },
          ],
        },
      }),
    })

    const payload = await response.json()

    if (!response.ok || !payload.success || !payload.id) {
      return jsonResponse(
        { error: payload.error ?? 'Could not start the site crawl.' },
        response.status >= 400 ? response.status : 502,
      )
    }

    return jsonResponse({ jobId: payload.id })
  } catch (_err) {
    return jsonResponse({ error: 'Unexpected error while starting the site crawl.' }, 500)
  }
})
