import type { Product, ProductAttribute, ProductTypeEntity } from '@/types/api'
import { kitNameFromQuantity } from '@/lib/product-utils'
import { normalizeHex } from '@/lib/theme-color'

export type ProductFormState = {
  name: string
  value: number
  productTypeId: string
  product_imgs: string[]
  freight: boolean
  customizableSlots: number
  description: string
  attributes: ProductAttribute[]
  pendingFiles: File[]
  pendingPreviews: string[]
}

export function productToFormState(product: Product): ProductFormState {
  return {
    name: product.name,
    value: Number(product.value),
    productTypeId: product.productType?.id ?? '',
    product_imgs: product.product_imgs ?? [],
    freight: Boolean(product.freight),
    customizableSlots: product.customizableSlots ?? 0,
    description: product.description ?? '',
    attributes: product.attributes ?? [],
    pendingFiles: [],
    pendingPreviews: [],
  }
}

export function emptyProductFormState(
  defaultType?: ProductTypeEntity,
): ProductFormState {
  return {
    name: defaultType?.isCustomizable ? kitNameFromQuantity(0) : '',
    value: 0,
    productTypeId: defaultType?.id ?? '',
    product_imgs: [],
    freight: false,
    customizableSlots: 0,
    description: '',
    attributes: [],
    pendingFiles: [],
    pendingPreviews: [],
  }
}

export function revokePreviews(urls: string[]) {
  urls.forEach((url) => URL.revokeObjectURL(url))
}

export function isLegacyAttribute(row: ProductAttribute) {
  return !row.fieldId || row.type === 'legacy' || row.type == null
}

export function sanitizeAttributes(attributes: ProductAttribute[]) {
  return attributes
    .map((row): ProductAttribute | null => {
      const label = row.label.trim()
      if (!label) return null

      if (isLegacyAttribute(row)) {
        const value = String(row.value ?? '').trim()
        if (!value) return null
        return {
          fieldId: null,
          type: 'legacy',
          label,
          value,
        }
      }

      switch (row.type) {
        case 'text': {
          const value = String(row.value ?? '').trim()
          if (!value) return null
          return { ...row, label, value }
        }
        case 'number': {
          const value =
            typeof row.value === 'number' ? row.value : Number(row.value)
          if (!Number.isFinite(value)) return null
          return { ...row, label, value }
        }
        case 'boolean': {
          return { ...row, label, value: Boolean(row.value) }
        }
        case 'color_list': {
          const colors = (Array.isArray(row.value) ? row.value : [])
            .map((item) => normalizeHex(String(item)))
            .filter((item): item is string => Boolean(item))
            .map((item) => item.toUpperCase())
          if (colors.length === 0) return null
          return { ...row, label, value: colors }
        }
        case 'select': {
          const selected = (Array.isArray(row.value) ? row.value : [])
            .map((item) => String(item).trim())
            .filter(Boolean)
          if (selected.length === 0) return null
          return { ...row, label, value: selected }
        }
        default:
          return null
      }
    })
    .filter((row): row is ProductAttribute => row !== null)
}
