import { CircleDollarSign, Layers } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { kitNameFromQuantity } from '@/lib/product-utils'
import { useActiveProductTypes } from '@/hooks/queries'
import type { ProductTypeEntity } from '@/types/api'
import { ProductImagesField } from './ProductImagesField'
import type { ProductFormState } from './product-form-utils'

type ProductFormProps = {
  value: ProductFormState
  onChange: (next: ProductFormState) => void
  disabled?: boolean
}

export function ProductForm({ value, onChange, disabled }: ProductFormProps) {
  const { data: types = [] } = useActiveProductTypes(true)
  const selectedType = types.find((t) => t.id === value.productTypeId)

  const patch = (partial: Partial<ProductFormState>) => onChange({ ...value, ...partial })

  const updateType = (productTypeId: string) => {
    const type = types.find((t) => t.id === productTypeId) as ProductTypeEntity | undefined
    if (!type) {
      patch({ productTypeId })
      return
    }
    if (type.isCustomizable) {
      const slots = value.customizableSlots || 0
      patch({
        productTypeId,
        customizableSlots: slots,
        name: value.name.trim() ? value.name : kitNameFromQuantity(slots),
      })
      return
    }
    patch({ productTypeId, customizableSlots: 0 })
  }

  const updateSlots = (raw: string) => {
    const customizableSlots = parseInt(raw, 10) || 0
    const previousSuggestion = kitNameFromQuantity(value.customizableSlots)
    const nameStillAuto = !value.name.trim() || value.name === previousSuggestion
    patch({
      customizableSlots,
      ...(nameStillAuto ? { name: kitNameFromQuantity(customizableSlots) } : {}),
    })
  }

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    const nextFiles = Array.from(files)
    const nextPreviews = nextFiles.map((f) => URL.createObjectURL(f))
    patch({
      pendingFiles: [...value.pendingFiles, ...nextFiles],
      pendingPreviews: [...value.pendingPreviews, ...nextPreviews],
    })
  }

  const removePending = (index: number) => {
    const preview = value.pendingPreviews[index]
    if (preview) URL.revokeObjectURL(preview)
    patch({
      pendingFiles: value.pendingFiles.filter((_, i) => i !== index),
      pendingPreviews: value.pendingPreviews.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Tipo</Label>
        <Select
          value={value.productTypeId}
          disabled={disabled}
          onChange={(e) => updateType(e.target.value)}
          className="rounded-xl h-12"
        >
          <option value="">Selecione o tipo</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Nome</Label>
        <Input
          value={value.name}
          disabled={disabled}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder={
            selectedType?.isCustomizable ? 'Ex: Kit 12 Ímãs Premium' : 'Nome do produto'
          }
          className="rounded-xl h-12 bg-muted/30"
        />
      </div>

      {selectedType?.isCustomizable ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-primary" />
            <Label className="text-sm text-muted-foreground">Quantidade de fotos</Label>
          </div>
          <Input
            type="number"
            min={1}
            disabled={disabled}
            value={value.customizableSlots || ''}
            onChange={(e) => updateSlots(e.target.value)}
            className="rounded-xl h-12 font-bold bg-muted/30"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CircleDollarSign size={14} className="text-emerald-500" />
          <Label className="text-sm text-muted-foreground">Preço</Label>
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            R$
          </span>
          <Input
            type="number"
            step="0.01"
            min={0}
            disabled={disabled}
            value={value.value}
            onChange={(e) => patch({ value: parseFloat(e.target.value) || 0 })}
            className="rounded-xl h-12 pl-12 font-bold bg-muted/30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value.freight}
            disabled={disabled}
            onChange={(e) => patch({ freight: e.target.checked })}
            className="rounded border-input"
          />
          <span className="text-sm text-muted-foreground">
            Frete grátis para o cliente
          </span>
        </label>
        <p className="text-xs text-muted-foreground pl-6">
          Ativo: o frete não é cobrado do cliente. Inativo: será cobrado produto + frete.
        </p>
      </div>

      <ProductImagesField
        images={value.product_imgs}
        pendingPreviews={value.pendingPreviews}
        disabled={disabled}
        onAddFiles={addFiles}
        onRemoveImage={(index) =>
          patch({ product_imgs: value.product_imgs.filter((_, i) => i !== index) })
        }
        onRemovePending={removePending}
      />
    </div>
  )
}
