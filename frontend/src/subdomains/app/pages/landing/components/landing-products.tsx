import { Link } from 'react-router-dom';
import ProductCard from '@/components/product-card';
import { useCartStore } from '@/store/use-cart-store';
import type { Product, Store } from '@/types/api';

interface ProductsProps {
  store: Store;
}

export const LandingProducts = ({ store }: ProductsProps) => {
  const products = (store.products ?? []).slice(0, 4);
  const regions = store.settings?.shipping?.regions ?? '';
  const addItem = useCartStore((s) => s.addItem);
  const setStoreId = useCartStore((s) => s.setStoreId);

  if (products.length === 0) return null;

  const handleAdd = (product: Product) => {
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

  return (
    <section id="produtos" className="section-pad bg-surface-alt">
      <div className="viewport-content">
        <div className="text-center mb-16">
          <p className="text-label text-primary uppercase tracking-widest mb-4">
            Nossas opções
          </p>
          <h2 className="text-section-title text-foreground mb-4">
            Escolha o tamanho da sua saudade
          </h2>
          <p className="text-body text-muted-foreground max-w-xl mx-auto">
            Kits e ímãs avulsos para personalizar com as fotos que importam.
          </p>
        </div>

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
              to={`/produtos/${product.id}`}
              onAdd={() => handleAdd(product)}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/produtos"
            className="inline-flex items-center justify-center h-9 px-4 text-[14px] rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all"
          >
            Ver catálogo completo
          </Link>
        </div>

        <p className="text-center mt-12 text-muted-foreground text-body">
          Entregamos com carinho em:{' '}
          {regions || 'Canoas e Região Metropolitana'}.
        </p>
      </div>
    </section>
  );
};
