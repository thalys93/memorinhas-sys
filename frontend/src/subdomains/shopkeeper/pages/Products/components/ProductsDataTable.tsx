import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, ImageIcon, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { productTypeLabel } from '@/lib/product-utils'
import type { Product } from '@/types/api'

type ProductsDataTableProps = {
  products: Product[]
  onDelete: (product: Product) => void
  deletingId?: string | null
}

function ProductThumb({ urls }: { urls?: string[] }) {
  const src = urls?.[0]
  if (!src) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border bg-muted text-muted-foreground">
        <ImageIcon size={20} />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt=""
      className="h-12 w-12 shrink-0 rounded-sm border object-cover"
    />
  )
}

export function ProductsDataTable({ products, onDelete, deletingId }: ProductsDataTableProps) {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'product',
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 rounded-sm text-sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Produto
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3 py-1">
            <ProductThumb urls={row.original.product_imgs} />
            <span className="text-base font-medium leading-snug">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'productType',
        sortingFn: (a, b) =>
          (a.original.productType?.name ?? '').localeCompare(
            b.original.productType?.name ?? '',
          ),
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 rounded-sm text-sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tipo
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-base">{productTypeLabel(row.original.productType?.name)}</span>
        ),
      },
      {
        accessorKey: 'value',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 rounded-sm text-sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Preço
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-base">
            {`R$ ${Number(row.original.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </span>
        ),
      },
      {
        accessorKey: 'freight',
        header: 'Frete grátis',
        cell: ({ row }) => (
          <span className="text-base">{row.original.freight ? 'Sim' : 'Não'}</span>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Ações</span>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-sm"
              onClick={() => navigate(`/lojista/produtos/${row.original.id}`)}
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-sm text-muted-foreground hover:text-destructive"
              disabled={deletingId === row.original.id}
              onClick={() => onDelete(row.original)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [navigate, onDelete, deletingId],
  )

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {products.length ? (
          products.map((product) => (
            <div
              key={product.id}
              className="rounded-sm border bg-card p-4 flex gap-3"
            >
              <ProductThumb urls={product.product_imgs} />
              <div className="grow min-w-0 space-y-1">
                <p className="text-base font-medium leading-snug truncate">
                  {product.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {productTypeLabel(product.productType?.name)}
                </p>
                <p className="text-sm font-medium">
                  {`R$ ${Number(product.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Frete grátis: {product.freight ? 'Sim' : 'Não'}
                </p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-sm"
                  onClick={() => navigate(`/lojista/produtos/${product.id}`)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-sm text-muted-foreground hover:text-destructive"
                  disabled={deletingId === product.id}
                  onClick={() => onDelete(product)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-sm border bg-card p-8 text-center text-muted-foreground text-sm">
            Nenhum produto cadastrado.
          </div>
        )}
      </div>

      <div className="hidden md:block rounded-sm border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="rounded-none text-sm h-12 px-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Nenhum produto cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
