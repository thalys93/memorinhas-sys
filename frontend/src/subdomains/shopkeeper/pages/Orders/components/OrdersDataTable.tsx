import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  Eye,
  Mail,
  MessageCircle,
  MoreVertical,
  Trash2,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { OrderStatusSelect } from '@/components/order-status-select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDeleteOrder, useNotifyOrderEmail } from '@/hooks/queries'
import { formatCep, formatMoney } from '@/lib/freight'
import { ORDER_STATUS_LABEL } from '@/lib/order-status'
import { whatsappUrl } from '@/lib/store-contact'
import { toast } from '@/lib/toast'
import type { Order } from '@/types/api'

type OrdersDataTableProps = {
  orders: Order[]
}

function OrderActionsMenu({ order }: { order: Order }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const notifyEmail = useNotifyOrderEmail()
  const deleteOrder = useDeleteOrder()

  const updateCoords = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    const menuWidth = 192
    const left = Math.min(
      rect.right - menuWidth,
      window.innerWidth - menuWidth - 8,
    )
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

  const handleWhatsApp = () => {
    const message = [
      `Olá ${order.customerName}!`,
      `Sobre o pedido #${order.id.slice(0, 8)}:`,
      `Status: ${ORDER_STATUS_LABEL[order.status]}`,
      `Total: R$ ${formatMoney(Number(order.total))}`,
    ].join('\n')
    window.open(whatsappUrl(order.customerPhone, message), '_blank')
    setOpen(false)
  }

  const handleEmail = async () => {
    try {
      await notifyEmail.mutateAsync({ id: order.id })
      toast('E-mail enviado ao cliente')
    } catch {
      toast('Não foi possível enviar o e-mail')
    } finally {
      setOpen(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteOrder.mutateAsync(order.id)
      toast('Pedido excluído')
      setConfirmOpen(false)
    } catch {
      toast('Não foi possível excluir o pedido')
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-sm"
        aria-label="Ações do pedido"
        onClick={() => {
          updateCoords()
          setOpen((v) => !v)
        }}
      >
        <MoreVertical size={16} />
      </Button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              style={{ top: coords.top, left: coords.left }}
              className="fixed z-[100] w-48 rounded-lg border bg-background p-1 shadow-lg"
            >
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                onClick={() => {
                  setOpen(false)
                  navigate(`/lojista/pedidos/${order.id}`)
                }}
              >
                <Eye size={14} />
                Ver detalhes
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                onClick={handleWhatsApp}
              >
                <MessageCircle size={14} />
                WhatsApp
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                disabled={notifyEmail.isPending}
                onClick={handleEmail}
              >
                <Mail size={14} />
                {notifyEmail.isPending ? 'Enviando...' : 'Enviar e-mail'}
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
                onClick={() => {
                  setOpen(false)
                  setConfirmOpen(true)
                }}
              >
                <Trash2 size={14} />
                Excluir
              </button>
            </div>,
            document.body,
          )
        : null}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao excluir o pedido #{order.id.slice(0, 8)}, os dados associados
              podem se perder e esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteOrder.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteOrder.isPending}
              onClick={(event) => {
                event.preventDefault()
                void handleDelete()
              }}
            >
              {deleteOrder.isPending ? 'Excluindo...' : 'Excluir pedido'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function OrdersDataTable({ orders }: OrdersDataTableProps) {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'customerName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 rounded-sm text-sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Cliente
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="space-y-0.5 py-1">
            <p className="text-base font-medium leading-snug">
              {row.original.customerName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {row.original.customerEmail}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <OrderStatusSelect order={row.original} />,
      },
      {
        accessorKey: 'total',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 rounded-sm text-sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Total
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-base font-medium">
            R$ {formatMoney(Number(row.original.total))}
          </span>
        ),
      },
      {
        accessorKey: 'paymentMethod',
        header: 'Pagamento',
        cell: ({ row }) => (
          <span className="text-base">{row.original.paymentMethod}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 rounded-sm text-sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Data
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleString('pt-BR')}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Ações</span>,
        cell: ({ row }) => (
          <div
            className="flex justify-end gap-0.5"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-sm"
              aria-label="Ver pedido"
              onClick={() =>
                navigate(`/lojista/pedidos/${row.original.id}`)
              }
            >
              <Eye size={16} />
            </Button>
            <OrderActionsMenu order={row.original} />
          </div>
        ),
      },
    ],
    [navigate],
  )

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {orders.length ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="rounded-sm border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  type="button"
                  className="min-w-0 text-left"
                  onDoubleClick={() =>
                    navigate(`/lojista/pedidos/${order.id}`)
                  }
                >
                  <p className="text-base font-medium truncate">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.customerEmail}
                  </p>
                </button>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-sm"
                    aria-label="Ver pedido"
                    onClick={() => navigate(`/lojista/pedidos/${order.id}`)}
                  >
                    <Eye size={16} />
                  </Button>
                  <OrderActionsMenu order={order} />
                </div>
              </div>
              <OrderStatusSelect order={order} />
              <p className="text-sm font-medium">
                R$ {formatMoney(Number(order.total))}
              </p>
              <p className="text-xs text-muted-foreground">
                CEP {formatCep(order.cep)} · {order.paymentMethod}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-sm border bg-card p-8 text-center text-muted-foreground text-sm">
            Nenhum pedido ainda.
          </div>
        )}
      </div>

      <div className="hidden md:block rounded-sm border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="rounded-none text-sm h-12 px-3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-default"
                  onDoubleClick={() =>
                    navigate(`/lojista/pedidos/${row.original.id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum pedido ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
