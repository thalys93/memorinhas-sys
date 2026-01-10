
import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface ProductCardProps {
  quantity: number;
  price: number;
  onSelect: (q: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ quantity, price, onSelect }) => {
  return (
    <div className="group bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#b99778]/30 transition-all flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-[#b99778] mb-6 group-hover:scale-110 transition-transform">
        <Camera size={28} strokeWidth={1.5} />
      </div>
      <h4 className="text-2xl font-medium text-slate-900 mb-2">{quantity} fotos ímãs</h4>
      <p className="text-slate-400 text-sm mb-6 uppercase tracking-wider">Artesanato exclusivo</p>
      <div className="mt-auto w-full">
        <span className="text-3xl font-semibold text-[#b99778]">R$ {price.toFixed(2).replace('.', ',')}</span>
        <button 
          onClick={() => onSelect(quantity)}
          className="w-full mt-6 px-6 py-3 border border-[#b99778] text-[#b99778] rounded-full text-sm font-medium hover:bg-[#b99778] hover:text-white transition-all active:scale-95"
        >
          Selecionar fotos
        </button>
      </div>
    </div>
  );
};

interface ProductsProps {
  onSelectKit: (q: number) => void;
}

export const Products: React.FC<ProductsProps> = ({ onSelectKit }) => {
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
