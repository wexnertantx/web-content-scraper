import type { ExportFormat } from '@/types/types'

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function toRows(jsonData: unknown): Record<string, unknown>[] {
  if (Array.isArray(jsonData)) {
    return jsonData.filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null)
  }
  if (jsonData && typeof jsonData === 'object') {
    return [jsonData as Record<string, unknown>]
  }
  return []
}

function escapeCsvValue(value: unknown): string {
  const stringValue = value === null || value === undefined ? '' : String(value)
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function toCsv(jsonData: unknown): string {
  const rows = toRows(jsonData)
  if (rows.length === 0) return ''

  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))))
  const header = columns.map(escapeCsvValue).join(',')
  const body = rows
    .map((row) => columns.map((column) => escapeCsvValue(row[column])).join(','))
    .join('\n')

  return `${header}\n${body}`
}

export function exportResult(
  format: ExportFormat,
  { jsonData, markdownData, fileBaseName }: { jsonData: unknown; markdownData: string | null; fileBaseName: string },
) {
  if (format === 'json') {
    downloadFile(JSON.stringify(jsonData ?? {}, null, 2), `${fileBaseName}.json`, 'application/json')
    return
  }

  if (format === 'markdown') {
    downloadFile(markdownData ?? '', `${fileBaseName}.md`, 'text/markdown')
    return
  }

  const csv = toCsv(jsonData)
  if (!csv) {
    throw new Error('This result has no tabular data to export as CSV.')
  }
  downloadFile(csv, `${fileBaseName}.csv`, 'text/csv')
}
