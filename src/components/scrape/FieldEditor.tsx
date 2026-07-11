import { Plus, Trash2 } from 'lucide-react'
import type { ExtractionField, ExtractionFieldType } from '@/types/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

const FIELD_TYPES: ExtractionFieldType[] = ['text', 'email', 'url', 'number', 'price', 'image', 'date']

interface FieldEditorProps {
  fields: ExtractionField[]
  onChange: (fields: ExtractionField[]) => void
}

export function FieldEditor({ fields, onChange }: FieldEditorProps) {
  function updateField(index: number, patch: Partial<ExtractionField>) {
    onChange(fields.map((field, i) => (i === index ? { ...field, ...patch } : field)))
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index))
  }

  function addField() {
    onChange([...fields, { name: '', type: 'text' }])
  }

  return (
    <div className="flex flex-col gap-2.5">
      {fields.map((field, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={field.name}
            onChange={(e) => updateField(index, { name: e.target.value })}
            placeholder="Field name, e.g. Price"
            className="flex-1"
            aria-label={`Field ${index + 1} name`}
          />
          <Select
            value={field.type}
            onChange={(e) => updateField(index, { type: e.target.value as ExtractionFieldType })}
            className="w-28 shrink-0"
            aria-label={`Field ${index + 1} type`}
          >
            {FIELD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeField(index)}
            aria-label="Remove field"
            className="shrink-0 text-muted-foreground hover:text-error"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="rounded-[var(--radius-md)] border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">
          No fields yet. Add one below.
        </p>
      )}

      <Button type="button" variant="outline" size="sm" onClick={addField} className="self-start">
        <Plus className="h-4 w-4" />
        Add field
      </Button>
    </div>
  )
}
