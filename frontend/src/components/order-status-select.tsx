import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, PackageCheck, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUpdateOrderStatus } from '@/hooks/queries'
import {
  ORDER_STATUS_ICON,
  ORDER_STATUS_LABEL,
  ORDER_STATUSES,
  orderStatusBadgeClass,
} from '@/lib/order-status'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import type { FulfillmentMode, Order, OrderStatus } from '@/types/api'

export function OrderStatusSelect({
  order,
  className,
}: {
  order: Order
  className?: string
}) {
  const updateStatus = useUpdateOrderStatus()
  const [open, setOpen] = useState(false)
  const [fulfillmentOpen, setFulfillmentOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const CurrentIcon = ORDER_STATUS_ICON[order.status]

  const updateCoords = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    const menuWidth = 180
    const left = Math.min(rect.left, window.innerWidth - menuWidth - 8)
    setCoords({
      top: rect.bottom + 4,
      left: Math.max(8, left),
    })
  }

  useEffect(() => {
    if (!open) return
    updateCoords()
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }
    const onReposition = () => updateCoords()
    document.addEventListener('mousedown', onPointerDown)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  const applyStatus = async (
    status: OrderStatus,
    fulfillmentMode?: FulfillmentMode,
  ) => {
    try {
      await updateStatus.mutateAsync({
        id: order.id,
        payload: { status, fulfillmentMode },
      })
      toast('Status atualizado')
    } catch {
      toast('Não foi possível atualizar o status')
    }
  }

  const handleChange = async (status: OrderStatus) => {
    setOpen(false)
    if (status === order.status) return
    if (status === 'shipped') {
      setFulfillmentOpen(true)
      return
    }
    await applyStatus(status)
  }

  const handleFulfillment = async (mode: FulfillmentMode) => {
    setFulfillmentOpen(false)
    await applyStatus('shipped', mode)
  }

  return (
    <div className={cn('inline-flex', className)} onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        disabled={updateStatus.isPending}
        aria-label="Alterar status"
        className={cn(
          orderStatusBadgeClass(order.status),
          'h-8 gap-1.5 pr-1.5 text-xs disabled:opacity-60',
        )}
        onClick={() => {
          updateCoords()
          setOpen((v) => !v)
        }}
      >
        <CurrentIcon size={13} className="shrink-0" />
        {ORDER_STATUS_LABEL[order.status]}
        <ChevronDown size={12} className="shrink-0 opacity-70" />
      </button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              style={{ top: coords.top, left: coords.left }}
              className="fixed z-[100] w-[180px] rounded-lg border bg-background p-1 shadow-lg"
            >
              {ORDER_STATUSES.map((status) => {
                const Icon = ORDER_STATUS_ICON[status]
                const selected = status === order.status
                return (
                  <button
                    key={status}
                    type="button"
                    className={cn(
                      'flex w-full items-center rounded-md px-1.5 py-1.5 text-left hover:bg-muted',
                      selected && 'bg-muted/70',
                    )}
                    onClick={() => handleChange(status)}
                  >
                    <span className={orderStatusBadgeClass(status)}>
                      <Icon size={12} />
                      {ORDER_STATUS_LABEL[status]}
                    </span>
                  </button>
                )
              })}
            </div>,
            document.body,
          )
        : null}

      <Dialog open={fulfillmentOpen} onOpenChange={setFulfillmentOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Como o pedido será entregue?</DialogTitle>
            <DialogDescription>
              Isso define o e-mail enviado ao cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Button
              type="button"
              variant="outline"
              className="justify-start h-11"
              disabled={updateStatus.isPending}
              onClick={() => handleFulfillment('delivery')}
            >
              <Truck size={16} className="mr-2" />
              Enviado ao cliente
            </Button>
            <Button
              type="button"
              variant="outline"
              className="justify-start h-11"
              disabled={updateStatus.isPending}
              onClick={() => handleFulfillment('pickup')}
            >
              <PackageCheck size={16} className="mr-2" />
              Pronto para retirada
            </Button>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setFulfillmentOpen(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
