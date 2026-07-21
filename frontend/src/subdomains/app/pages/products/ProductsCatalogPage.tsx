import { useDeferredValue, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { StoreNotConfigured } from '@/components/store-not-configured';
import { useStoreBranding } from '@/hooks/use-store-branding';
import { useActiveProductTypes, usePublicProducts } from '@/hooks/queries';
import { useCartStore } from '@/store/use-cart-store';
import type { Product, PublicProductFilters } from '@/types/api';

export function ProductsCatalogPage() {
  const { store, isLoading, isConfigured } = useStoreBranding();
  const { data: types = [] } = useActiveProductTypes(false);
  const addItem = useCartStore((s) => s.addItem);
  const setStoreId = useCartStore((s) => s.setStoreId);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [productTypeId, setProductTypeId] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [freight, setFreight] = useState('');

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

  return (
    <div className="pt-16 min-h-screen bg-surface-alt pb-20">
      <div className="viewport-content py-10 md:py-14 space-y-10">
        <div className="text-center">
          <h1 className="text-section-title text-foreground mb-2">Produtos</h1>
          <p className="text-body text-muted-foreground">
            Filtre e adicione ao carrinho o que quiser pedir.
          </p>
        </div>

        <div className="space-y-4 bg-card border border-border/60 rounded-lg p-5">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Buscar</Label>
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
                className="rounded-xl h-11 pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tipo</Label>
              <Select
                value={productTypeId}
                onChange={(e) => {
                  setProductTypeId(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl h-11"
              >
                <option value="">Todos</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Valor mín.</Label>
              <Input
                type="number"
                min={0}
                value={minValue}
                onChange={(e) => {
                  setMinValue(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Valor máx.</Label>
              <Input
                type="number"
                min={0}
                value={maxValue}
                onChange={(e) => {
                  setMaxValue(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Frete</Label>
              <Select
                value={freight}
                onChange={(e) => {
                  setFreight(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl h-11"
              >
                <option value="">Todos</option>
                <option value="true">Frete grátis</option>
                <option value="false">Frete cobrado</option>
              </Select>
            </div>
          </div>
        </div>

        {loadingProducts ? (
          <p className="text-center text-muted-foreground text-sm">Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            Nenhum produto encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                typeName={product.productType?.name ?? ''}
                price={Number(product.value)}
                imageUrl={product.product_imgs?.[0]}
                slots={product.customizableSlots}
                freight={product.freight}
                onAdd={() => handleAdd(product)}
              />
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 ? (
          <div className="flex items-center justify-center gap-3">
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
  );
}
