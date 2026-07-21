import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useOrders } from '@/hooks/queries'
import { OrdersDataTable } from './components/OrdersDataTable'

export const OrdersPage = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useOrders(page)

  if (isLoading) {
    return (
      <p className="text-muted-foreground text-sm">Carregando pedidos...</p>
    )
  }

  if (isError) {
    return (
      <p className="text-muted-foreground text-sm">
        Não foi possível carregar os pedidos.
      </p>
    )
  }

  const orders = data?.items ?? []
  const meta = data?.meta

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-section-title text-foreground mb-1">Pedidos</h1>
        <p className="text-muted-foreground text-sm">
          Acompanhe e gerencie os pedidos da loja.
        </p>
      </div>

      <OrdersDataTable orders={orders} />

      {meta && meta.totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="text-xs text-muted-foreground">
            {meta.currentPage} / {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </Button>
        </div>
      ) : null}
    </div>
  )
}
