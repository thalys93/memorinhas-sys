
import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/product-card';

interface ProductsProps {
  onSelectKit: (q: number) => void;
}

export const LandingProducts: React.FC<ProductsProps> = ({ onSelectKit }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [regions, setRegions] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('memorinhas_config');
    if (saved) {
      const config = JSON.parse(saved);
      setProducts(config.kits);
      setRegions(config.shipping.regions);
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <section id="produtos" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-medium text-[#b99778] uppercase tracking-widest mb-4">Nossas Opções</h2>
          <h3 className="text-4xl font-serif text-slate-900">Escolha o tamanho da sua saudade</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p, idx) => (
            <ProductCard key={idx} quantity={p.quantity} price={p.price} onSelect={onSelectKit} />
          ))}
        </div>

        <p className="text-center mt-12 text-slate-500 text-sm">
          * Atendendo com carinho em: {regions || 'Canoas e Região Metropolitanan'}.
        </p>
      </div>
    </section>
  );
};
