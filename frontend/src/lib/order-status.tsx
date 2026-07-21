import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, Clock, PackageCheck, Truck, XCircle } from 'lucide-react'
import type { FulfillmentMode, OrderStatus } from '@/types/api'
import { cn } from '@/lib/utils'

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pendente',
  shipped: 'Enviado',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
}

export const ORDER_STATUS_ICON: Record<OrderStatus, LucideIcon> = {
  pending: Clock,
  shipped: Truck,
  completed: CheckCircle2,
  cancelled: XCircle,
}

export const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
  pending:
    'border-transparent bg-amber-500 text-white dark:bg-amber-500 dark:text-white',
  shipped:
    'border-transparent bg-sky-500 text-white dark:bg-sky-500 dark:text-white',
  completed:
    'border-transparent bg-emerald-500 text-white dark:bg-emerald-500 dark:text-white',
  cancelled:
    'border-transparent bg-rose-500 text-white dark:bg-rose-500 dark:text-white',
}

export const ORDER_STATUS_BADGE_SIZE =
  'h-8 min-h-8 px-2.5 text-xs gap-1.5 rounded-full'

export function orderStatusBadgeClass(status: OrderStatus) {
  return cn(
    'inline-flex items-center justify-center border font-medium whitespace-nowrap',
    ORDER_STATUS_BADGE_SIZE,
    ORDER_STATUS_CLASS[status],
  )
}

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus
  className?: string
}) {
  const Icon = ORDER_STATUS_ICON[status]
  return (
    <span className={cn(orderStatusBadgeClass(status), className)}>
      <Icon size={13} className="shrink-0" />
      {ORDER_STATUS_LABEL[status]}
    </span>
  )
}

export const FREIGHT_TYPE_LABEL = {
  free: 'Grátis',
  local: 'Local',
  standard: 'Estadual',
} as const

export const FULFILLMENT_MODE_LABEL: Record<FulfillmentMode, string> = {
  delivery: 'Envio',
  pickup: 'Retirada',
}

export const FULFILLMENT_MODE_ICON: Record<FulfillmentMode, LucideIcon> = {
  delivery: Truck,
  pickup: PackageCheck,
}

export const ORDER_STATUSES = Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]
