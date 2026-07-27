import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ProductAttribute } from '@/types/api'

type ProductAttributesFieldProps = {
  value: ProductAttribute[]
  onChange: (next: ProductAttribute[]) => void
  disabled?: boolean
}

export function ProductAttributesField({
  value,
  onChange,
  disabled,
}: ProductAttributesFieldProps) {
  const updateRow = (index: number, partial: Partial<ProductAttribute>) => {
    onChange(value.map((row, i) => (i === index ? { ...row, ...partial } : row)))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm text-muted-foreground">Informações extras</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onChange([...value, { label: '', value: '' }])}
          className="rounded-sm h-8"
        >
          <Plus size={14} className="mr-1.5" />
          Adicionar
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Opcional. Ex.: Material, tamanho, prazo de produção.
        </p>
      ) : (
        <div className="space-y-2">
          {value.map((row, index) => (
            <div key={index} className="flex items-start gap-2">
              <Input
                value={row.label}
                disabled={disabled}
                placeholder="Rótulo"
                onChange={(e) => updateRow(index, { label: e.target.value })}
                className="rounded-xl h-11 bg-muted/30"
              />
              <Input
                value={row.value}
                disabled={disabled}
                placeholder="Valor"
                onChange={(e) => updateRow(index, { value: e.target.value })}
                className="rounded-xl h-11 bg-muted/30"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                aria-label="Remover atributo"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
