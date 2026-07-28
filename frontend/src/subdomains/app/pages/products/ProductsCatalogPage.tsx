import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StoreNotConfigured } from '@/components/store-not-configured';
import { useStoreBranding } from '@/hooks/use-store-branding';
import { usePublicProducts } from '@/hooks/queries';
import { productTypeLabel } from '@/lib/product-utils';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/use-cart-store';
import type { Product, ProductTypeEntity, PublicProductFilters } from '@/types/api';

type FilterValues = {
  productTypeId: string;
  minValue: string;
  maxValue: string;
  freight: string;
};

type FilterHandlers = {
  onProductTypeId: (value: string) => void;
  onMinValue: (value: string) => void;
  onMaxValue: (value: string) => void;
  onFreight: (value: string) => void;
};

function ProductFiltersPanel({
  types,
  values,
  handlers,
  groupId,
}: {
  types: ProductTypeEntity[];
  values: FilterValues;
  handlers: FilterHandlers;
  groupId: string;
}) {
  return (
    <div className="space-y-6">
      {types.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Categorias</h3>
          <div className="space-y-1">
            <label className="flex items-center gap-2.5 cursor-pointer py-1 text-sm text-muted-foreground hover:text-foreground">
              <input
                type="radio"
                name={`${groupId}-product-type`}
                checked={values.productTypeId === ''}
                onChange={() => handlers.onProductTypeId('')}
                className="accent-primary"
              />
              Todos
            </label>
            {types.map((type) => (
              <label
                key={type.id}
                className="flex items-center gap-2.5 cursor-pointer py-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <input
                  type="radio"
                  name={`${groupId}-product-type`}
                  checked={values.productTypeId === type.id}
                  onChange={() => handlers.onProductTypeId(type.id)}
                  className="accent-primary"
                />
                {productTypeLabel(type.name)}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Faixa de preço</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Mín.</Label>
            <Input
              type="number"
              min={0}
              value={values.minValue}
              onChange={(e) => handlers.onMinValue(e.target.value)}
              placeholder="0"
              className="rounded-xl h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Máx.</Label>
            <Input
              type="number"
              min={0}
              value={values.maxValue}
              onChange={(e) => handlers.onMaxValue(e.target.value)}
              placeholder="—"
              className="rounded-xl h-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Frete</h3>
        <div className="space-y-1">
          {(
            [
              { value: '', label: 'Todos' },
              { value: 'true', label: 'Frete grátis' },
              { value: 'false', label: 'Frete cobrado' },
            ] as const
          ).map((option) => (
            <label
              key={option.value || 'all'}
              className="flex items-center gap-2.5 cursor-pointer py-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <input
                type="radio"
                name={`${groupId}-freight`}
                checked={values.freight === option.value}
                onChange={() => handlers.onFreight(option.value)}
                className="accent-primary"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductsCatalogPage() {
  const { store, isLoading, isConfigured } = useStoreBranding();
  const addItem = useCartStore((s) => s.addItem);
  const setStoreId = useCartStore((s) => s.setStoreId);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [productTypeId, setProductTypeId] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [freight, setFreight] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const types = useMemo(() => {
    const byId = new Map<string, ProductTypeEntity>();
    for (const product of store?.products ?? []) {
      const type = product.productType;
      if (type?.id) byId.set(type.id, type);
    }
    return Array.from(byId.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR'),
    );
  }, [store?.products]);

  useEffect(() => {
    if (productTypeId && !types.some((t) => t.id === productTypeId)) {
      setProductTypeId('');
    }
  }, [productTypeId, types]);

  const resetPage = () => setPage(1);

  const filterValues: FilterValues = {
    productTypeId,
    minValue,
    maxValue,
    freight,
  };

  const filterHandlers: FilterHandlers = {
    onProductTypeId: (value) => {
      setProductTypeId(value);
      resetPage();
    },
    onMinValue: (value) => {
      setMinValue(value);
      resetPage();
    },
    onMaxValue: (value) => {
      setMaxValue(value);
      resetPage();
    },
    onFreight: (value) => {
      setFreight(value);
      resetPage();
    },
  };

  const filters: PublicProductFilters = useMemo(
    () => ({
      page,
      limit: 12,
      search: deferredSearch.trim() || undefined,
      productTypeId: productTypeId || undefined,
      minValue: minValue ? Number(minValue) : undefined,
      maxValue: maxValue ? Number(maxValue) : undefined,
      freight: freight === '' ? undefined : freight === 'true',
    }),
    [page, deferredSearch, productTypeId, minValue, maxValue, freight],
  );

  const { data, isLoading: loadingProducts } = usePublicProducts(filters);

  const clearFilters = () => {
    setProductTypeId('');
    setMinValue('');
    setMaxValue('');
    setFreight('');
    setPage(1);
  };

  const selectedType = types.find((t) => t.id === productTypeId);
  const activeChips = [
    selectedType
      ? {
          key: 'type',
          label: productTypeLabel(selectedType.name),
          clear: () => {
            setProductTypeId('');
            resetPage();
          },
        }
      : null,
    minValue || maxValue
      ? {
          key: 'price',
          label: `R$ ${minValue || '0'} – ${maxValue || '∞'}`,
          clear: () => {
            setMinValue('');
            setMaxValue('');
            resetPage();
          },
        }
      : null,
    freight === 'true'
      ? {
          key: 'freight-free',
          label: 'Frete grátis',
          clear: () => {
            setFreight('');
            resetPage();
          },
        }
      : freight === 'false'
        ? {
            key: 'freight-paid',
            label: 'Frete cobrado',
            clear: () => {
              setFreight('');
              resetPage();
            },
          }
        : null,
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const handleAdd = (product: Product) => {
    if (!store) return;
    setStoreId(store.id);
    addItem({
      productId: product.id,
      name: product.name,
      value: Number(product.value),
      freight: product.freight,
      isCustomizable: Boolean(product.productType?.isCustomizable),
      customizableSlots: product.customizableSlots,
      imageUrl: product.product_imgs?.[0],
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground text-sm pt-24">
        Carregando...
      </div>
    );
  }

  if (!isConfigured || !store) {
    return (
      <div className="pt-24">
        <StoreNotConfigured />
      </div>
    );
  }

  const meta = data?.meta;
  const products = data?.items ?? [];
  const rangeStart =
    meta && meta.totalItems > 0
      ? (meta.currentPage - 1) * meta.itemsPerPage + 1
      : 0;
  const rangeEnd = meta
    ? Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)
    : 0;

  return (
    <div className="pt-16 min-h-screen bg-surface-alt pb-28 lg:pb-20">
      <div className="viewport-content py-10 md:py-14 space-y-8">
        <div className="text-center">
          <h1 className="text-section-title text-foreground mb-2">
            Ímãs e kits personalizados
          </h1>
          <p className="text-body text-muted-foreground max-w-lg mx-auto">
            Escolha o produto, adicione ao carrinho e personalize com suas fotos.
          </p>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nome..."
            className="rounded-xl h-11 pl-10 bg-card"
            aria-label="Buscar produtos"
          />
        </div>

        <div className="flex gap-8 items-start">
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <div className="bg-card border border-border/60 rounded-lg p-5">
              <h2 className="text-card-title text-foreground mb-5">Filtros</h2>
              <ProductFiltersPanel
                groupId="desktop"
                types={types}
                values={filterValues}
                handlers={filterHandlers}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {meta && meta.totalItems > 0
                  ? `Mostrando ${rangeStart}–${rangeEnd} de ${meta.totalItems}`
                  : loadingProducts
                    ? 'Carregando...'
                    : 'Nenhum resultado'}
              </p>
            </div>

            {activeChips.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.clear}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs text-foreground hover:bg-muted transition-colors"
                  >
                    {chip.label}
                    <X size={12} className="text-muted-foreground" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-primary hover:underline px-1"
                >
                  Limpar tudo
                </button>
              </div>
            ) : null}

            {loadingProducts ? (
              <p className="text-center text-muted-foreground text-sm py-12">
                Carregando produtos...
              </p>
            ) : products.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-12">
                Nenhum produto encontrado.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    typeName={product.productType?.name ?? ''}
                    price={Number(product.value)}
                    imageUrl={product.product_imgs?.[0]}
                    slots={product.customizableSlots}
                    freight={product.freight}
                    to={`/produtos/${product.id}`}
                    onAdd={() => handleAdd(product)}
                  />
                ))}
              </div>
            )}

            {meta && meta.totalPages > 1 ? (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  {meta.currentPage} / {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {!filtersOpen ? (
        <div className="fixed bottom-5 inset-x-0 z-50 flex justify-center pointer-events-none lg:hidden pb-[env(safe-area-inset-bottom)]">
          <Button
            variant="outline"
            size="sm"
            className="pointer-events-auto gap-2 shadow-lg bg-card border-border/60 h-11 px-5 rounded-full"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeChips.length > 0 ? (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] px-1.5">
                {activeChips.length}
              </span>
            ) : null}
          </Button>
        </div>
      ) : null}

      <div
        className={cn(
          'fixed inset-0 z-60 bg-black/40 transition-opacity lg:hidden',
          filtersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setFiltersOpen(false)}
        aria-hidden={!filtersOpen}
      />
      <aside
        className={cn(
          'fixed top-0 left-0 z-70 h-full w-full max-w-sm bg-background border-r border-border shadow-xl flex flex-col transition-transform duration-300 lg:hidden',
          filtersOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-hidden={!filtersOpen}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b shrink-0">
          <h2 className="font-semibold text-sm">Filtros</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFiltersOpen(false)}
            aria-label="Fechar filtros"
          >
            <X size={18} />
          </Button>
        </div>
        <div className="grow overflow-y-auto p-5">
          <ProductFiltersPanel
            groupId="mobile"
            types={types}
            values={filterValues}
            handlers={filterHandlers}
          />
        </div>
        <div className="p-5 border-t shrink-0">
          <Button className="w-full" onClick={() => setFiltersOpen(false)}>
            Ver resultados
          </Button>
        </div>
      </aside>
    </div>
  );
}
