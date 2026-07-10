import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY')

interface ExtractionField {
  name: string
  type: 'text' | 'email' | 'url' | 'number' | 'price' | 'image' | 'date'
}

interface ExtractRequestBody {
  url: string
  entityType?: string
  fields: ExtractionField[]
}

function fieldSchemaType(type: ExtractionField['type']): string {
  return type === 'number' || type === 'price' ? 'number' : 'string'
}

function buildJsonSchema({ entityType, fields }: ExtractRequestBody) {
  const properties = Object.fromEntries(
    fields.map((field) => [field.name, { type: fieldSchemaType(field.type) }]),
  )
  const itemSchema = {
    type: 'object',
    properties,
    required: fields.map((field) => field.name),
  }

  if (entityType) {
    return { type: 'array', items: itemSchema }
  }

  return itemSchema
}

function buildPrompt({ entityType, fields }: ExtractRequestBody): string {
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

    const body: ExtractRequestBody = await req.json()
    if (!body?.url || !Array.isArray(body.fields) || body.fields.length === 0) {
      return jsonResponse({ error: 'A URL and at least one field are required.' }, 400)
    }

    const response = await fetch('https://api.firecrawl.dev/v2/scrape', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: body.url,
        onlyMainContent: true,
        // v2 embeds schema/prompt directly in the format entry; there is no
        // separate jsonOptions field like in v1.
        formats: [
          {
            type: 'json',
            schema: buildJsonSchema(body),
            prompt: buildPrompt(body),
          },
        ],
      }),
    })

    const payload = await response.json()

    if (!response.ok || !payload.success) {
      return jsonResponse(
        { error: payload.error ?? 'Could not extract data from this website.' },
        response.status >= 400 ? response.status : 502,
      )
    }

    return jsonResponse({ jsonData: payload.data?.json ?? null })
  } catch (_err) {
    return jsonResponse({ error: 'Unexpected error while extracting data.' }, 500)
  }
})
