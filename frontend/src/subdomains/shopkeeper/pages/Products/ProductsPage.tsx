import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useProducts, useDeleteProduct, useStore } from '@/hooks/queries'
import { toast } from '@/lib/toast'
import type { Product } from '@/types/api'
import { ProductsDataTable } from './components/ProductsDataTable'

export const ProductsPage = () => {
  const { data: store, isLoading: storeLoading, isError: storeError } = useStore()
  const { data: productsData, isLoading } = useProducts()
  const deleteProduct = useDeleteProduct()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (product: Product) => {
    setDeletingId(product.id)
    try {
      await deleteProduct.mutateAsync(product.id)
      toast('Produto removido')
    } catch {
      toast('Não foi possível remover o produto')
    } finally {
      setDeletingId(null)
    }
  }

  if (storeLoading || isLoading) {
    return <p className="text-muted-foreground text-sm">Carregando produtos...</p>
  }

  if (storeError || !store) {
    return (
      <p className="text-muted-foreground text-sm">Nenhuma loja vinculada à sua conta.</p>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-section-title text-foreground mb-1">Produtos</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie kits, ímãs e acessórios da loja.
          </p>
        </div>
        <Link
          to="/lojista/produtos/novo"
          className="inline-flex h-8 items-center justify-center rounded-xl bg-primary px-3 text-[12px] font-normal text-primary-foreground transition-all hover:bg-primary-hover"
        >
          <Plus size={16} className="mr-2" /> Novo produto
        </Link>
      </div>

      <ProductsDataTable
        products={productsData?.items ?? []}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  )
}
