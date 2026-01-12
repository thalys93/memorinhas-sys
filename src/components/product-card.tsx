import { Camera } from 'lucide-react'
import React from 'react'

interface ProductCardProps {
  quantity: number;
  price: number;
  onSelect: (q: number) => void;
}

function ProductCard({ quantity, price, onSelect }: ProductCardProps) {
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
    )
}

export default ProductCard