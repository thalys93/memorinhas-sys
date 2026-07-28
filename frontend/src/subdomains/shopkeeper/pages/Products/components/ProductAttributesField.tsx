import { useMemo, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ColorPicker, colorLabelFromHex } from '@/components/color-picker'
import { useActiveProductAttributeFields } from '@/hooks/queries'
import { DEFAULT_STORE_PRIMARY, normalizeHex } from '@/lib/theme-color'
import { cn } from '@/lib/utils'
import type { ProductAttribute, ProductAttributeField } from '@/types/api'
import { isLegacyAttribute } from './product-form-utils'

type ProductAttributesFieldProps = {
  value: ProductAttribute[]
  onChange: (next: ProductAttribute[]) => void
  disabled?: boolean
}

function defaultValueForField(field: ProductAttributeField): ProductAttribute['value'] {
  switch (field.type) {
    case 'text':
      return ''
    case 'number':
      return 0
    case 'boolean':
      return false
    case 'color_list':
    case 'select':
      return []
  }
}

function attributeFromField(field: ProductAttributeField): ProductAttribute {
  return {
    fieldId: field.id,
    type: field.type,
    label: field.name,
    value: defaultValueForField(field),
  }
}

export function ProductAttributesField({
  value,
  onChange,
  disabled,
}: ProductAttributesFieldProps) {
  const { data: catalog = [] } = useActiveProductAttributeFields()
  const [choosingField, setChoosingField] = useState(false)
  const [colorEditor, setColorEditor] = useState<{
    rowIndex: number
    colorIndex: number | null
    draft: string
  } | null>(null)

  const usedFieldIds = useMemo(
    () =>
      new Set(
        value
          .map((row) => row.fieldId)
          .filter((id): id is string => Boolean(id)),
      ),
    [value],
  )

  const availableFields = catalog.filter((field) => !usedFieldIds.has(field.id))

  const fieldById = useMemo(
    () => new Map(catalog.map((field) => [field.id, field])),
    [catalog],
  )

  const updateRow = (index: number, partial: Partial<ProductAttribute>) => {
    onChange(value.map((row, i) => (i === index ? { ...row, ...partial } : row)))
  }

  const chooseField = (fieldId: string) => {
    const field = catalog.find((item) => item.id === fieldId)
    if (!field || usedFieldIds.has(field.id)) return
    onChange([...value, attributeFromField(field)])
    setChoosingField(false)
  }

  const openColorEditor = (rowIndex: number, colorIndex: number | null) => {
    const row = value[rowIndex]
    const colors = Array.isArray(row.value) ? row.value.map(String) : []
    const draft =
      colorIndex != null
        ? (normalizeHex(colors[colorIndex]) ?? DEFAULT_STORE_PRIMARY)
        : DEFAULT_STORE_PRIMARY
    setColorEditor({ rowIndex, colorIndex, draft })
  }

  const applyColor = (hex: string) => {
    if (!colorEditor) return
    const nextHex = (normalizeHex(hex) ?? hex).toUpperCase()
    const row = value[colorEditor.rowIndex]
    const colors = Array.isArray(row.value) ? [...row.value.map(String)] : []
    if (colorEditor.colorIndex == null) {
      colors.push(nextHex)
    } else {
      colors[colorEditor.colorIndex] = nextHex
    }
    updateRow(colorEditor.rowIndex, { value: colors })
    setColorEditor(null)
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm text-muted-foreground">Informações extras</Label>

      {value.length === 0 && !choosingField ? (
        <p className="text-xs text-muted-foreground">
          Opcional. Adicione campos cadastrados pelo admin para detalhar o
          produto.
        </p>
      ) : null}

      <div className="space-y-3">
        {value.map((row, index) => {
          const legacy = isLegacyAttribute(row)
          const catalogField =
            row.fieldId != null ? fieldById.get(row.fieldId) : undefined
          const options = catalogField?.options ?? []

          return (
            <div
              key={`${row.fieldId ?? 'legacy'}-${index}`}
              className="rounded-xl border border-border/60 bg-muted/10 p-3 space-y-2"
            >
              <div className="flex items-start gap-2">
                {legacy ? (
                  <Input
                    value={row.label}
                    disabled={disabled}
                    placeholder="Rótulo"
                    onChange={(e) =>
                      updateRow(index, { label: e.target.value })
                    }
                    className="rounded-xl h-11 bg-muted/30"
                  />
                ) : (
                  <p className="grow text-sm font-medium text-foreground pt-2.5">
                    {row.label}
                  </p>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  aria-label="Remover atributo"
                  onClick={() =>
                    onChange(value.filter((_, i) => i !== index))
                  }
                  className="h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              {legacy || row.type === 'text' ? (
                <Input
                  value={String(row.value ?? '')}
                  disabled={disabled}
                  placeholder="Valor"
                  onChange={(e) =>
                    updateRow(index, { value: e.target.value })
                  }
                  className="rounded-xl h-11 bg-muted/30"
                />
              ) : null}

              {row.type === 'number' ? (
                <Input
                  type="number"
                  value={Number(row.value ?? 0)}
                  disabled={disabled}
                  onChange={(e) =>
                    updateRow(index, {
                      value:
                        e.target.value === '' ? 0 : Number(e.target.value),
                    })
                  }
                  className="rounded-xl h-11 bg-muted/30"
                />
              ) : null}

              {row.type === 'boolean' ? (
                <label className="flex items-center gap-3 h-11 cursor-pointer px-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(row.value)}
                    disabled={disabled}
                    onClick={() =>
                      updateRow(index, { value: !Boolean(row.value) })
                    }
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      row.value ? 'bg-primary' : 'bg-muted',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform',
                        row.value && 'translate-x-5',
                      )}
                    />
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {row.value ? 'Sim' : 'Não'}
                  </span>
                </label>
              ) : null}

              {row.type === 'select' ? (
                <div className="flex flex-wrap gap-3">
                  {[
                    ...new Set([
                      ...options,
                      ...(Array.isArray(row.value)
                        ? row.value.map(String)
                        : []),
                    ]),
                  ].map((option) => {
                    const selected = Array.isArray(row.value)
                      ? row.value.includes(option)
                      : false
                    return (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          disabled={disabled}
                          onChange={() => {
                            const current = Array.isArray(row.value)
                              ? row.value.map(String)
                              : []
                            const next = selected
                              ? current.filter((item) => item !== option)
                              : [...current, option]
                            updateRow(index, { value: next })
                          }}
                          className="rounded border-input"
                        />
                        {option}
                      </label>
                    )
                  })}
                  {options.length === 0 &&
                  (!Array.isArray(row.value) || row.value.length === 0) ? (
                    <p className="text-xs text-muted-foreground">
                      Nenhuma opção disponível para este campo.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {row.type === 'color_list' ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {(Array.isArray(row.value) ? row.value : []).map(
                      (color, colorIndex) => (
                        <div key={`${color}-${colorIndex}`} className="relative">
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => openColorEditor(index, colorIndex)}
                            className="h-9 w-9 rounded-full border border-border shadow-sm"
                            style={{ backgroundColor: String(color) }}
                            aria-label={`Editar cor ${colorLabelFromHex(String(color))}`}
                          />
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                              const colors = (
                                Array.isArray(row.value) ? row.value : []
                              ).filter((_, i) => i !== colorIndex)
                              updateRow(index, { value: colors.map(String) })
                            }}
                            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-background border border-border text-muted-foreground flex items-center justify-center"
                            aria-label="Remover cor"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ),
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      onClick={() => openColorEditor(index, null)}
                      className="rounded-sm h-9"
                    >
                      <Plus size={14} className="mr-1" />
                      Cor
                    </Button>
                  </div>
                  {Array.isArray(row.value) && row.value.length > 0 ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {(row.value as string[]).map((color, colorIndex) => (
                        <span
                          key={`${color}-${colorIndex}`}
                          className="text-sm text-foreground"
                        >
                          {colorLabelFromHex(String(color))}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          )
        })}

        {choosingField ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/10 p-3">
            <div className="flex items-start gap-2">
              <Select
                value=""
                disabled={disabled}
                autoFocus
                onChange={(e) => {
                  if (e.target.value) chooseField(e.target.value)
                }}
                className="rounded-xl h-11 bg-card grow"
              >
                <option value="">Escolher campo</option>
                {availableFields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                aria-label="Cancelar"
                onClick={() => setChoosingField(false)}
                className="h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {!choosingField ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || availableFields.length === 0}
          onClick={() => setChoosingField(true)}
          className="rounded-sm h-9"
        >
          <Plus size={14} className="mr-1.5" />
          {availableFields.length === 0
            ? 'Todos os campos já foram adicionados'
            : 'Adicionar informação'}
        </Button>
      ) : null}

      <Dialog
        open={colorEditor != null}
        onOpenChange={(open) => {
          if (!open) setColorEditor(null)
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {colorEditor?.colorIndex == null ? 'Adicionar cor' : 'Editar cor'}
            </DialogTitle>
          </DialogHeader>
          {colorEditor ? (
            <div className="space-y-4">
              <ColorPicker
                value={colorEditor.draft}
                onChange={(hex) =>
                  setColorEditor((prev) =>
                    prev ? { ...prev, draft: hex } : prev,
                  )
                }
                defaultColor={DEFAULT_STORE_PRIMARY}
                showAdvanced
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setColorEditor(null)}
                  className="rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => applyColor(colorEditor.draft)}
                  className="rounded-xl"
                >
                  Usar esta cor
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
