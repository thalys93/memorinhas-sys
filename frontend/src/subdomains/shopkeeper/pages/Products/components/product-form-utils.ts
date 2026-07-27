import type { Product, ProductAttribute, ProductTypeEntity } from '@/types/api'
import { kitNameFromQuantity } from '@/lib/product-utils'

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

export function sanitizeAttributes(attributes: ProductAttribute[]) {
  return attributes
    .map((row) => ({
      label: row.label.trim(),
      value: row.value.trim(),
    }))
    .filter((row) => row.label && row.value)
}
