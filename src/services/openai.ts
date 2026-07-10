import { supabase } from '@/services/supabase'
import type { ExtractionField, WebsiteAnalysis } from '@/types/types'

export async function analyzeWebsite(url: string, markdown: string): Promise<WebsiteAnalysis> {
  const { data, error } = await supabase.functions.invoke('openai-analyze', {
    body: { url, markdown },
  })

  if (error) {
    throw new Error('AI analysis failed. Please try again in a moment.')
  }

  return { ...(data as Omit<WebsiteAnalysis, 'markdown'>), markdown }
}

export async function convertPromptToFields(customPrompt: string): Promise<ExtractionField[]> {
  const { data, error } = await supabase.functions.invoke('openai-extract-fields', {
    body: { customPrompt },
  })

  if (error) {
    throw new Error('Could not understand that request. Please rephrase and try again.')
  }

  return (data as { fields: ExtractionField[] }).fields
}
