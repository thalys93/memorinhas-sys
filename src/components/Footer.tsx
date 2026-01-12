
import React from 'react';
import { MapPin, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { Link } from 'react-router-dom';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer id="contato" className="bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">        
        <div className="grid md:grid-cols-3 gap-12 items-start text-slate-600 border-t border-slate-200 pt-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Logo size={40} />
              <span className="text-xl font-semibold text-slate-900 uppercase tracking-tighter">Memorinhas</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-slate-500">
              Eternizando memórias que merecem ser vistas todos os dias. Ímãs artesanais feitos com alma e carinho em Canoas - RS.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h5 className="font-semibold text-slate-900 uppercase tracking-widest text-xs text-slate-400">Localização</h5>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-[#b99778]" />
              Canoas – RS, Brasil
            </div>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <h5 className="font-semibold text-slate-900 uppercase tracking-widest text-xs text-slate-400">Navegação</h5>
            <div className="flex flex-wrap md:flex-nowrap gap-6 text-sm">
              <Link to="/" className="hover:text-[#b99778] transition-colors">Início</Link>
              <Link to="/#sobre" className="hover:text-[#b99778] transition-colors">Sobre</Link>
              {/* <button onClick={onAdminClick} className="flex items-center gap-1 hover:text-[#b99778] transition-colors">
                <Settings size={14} /> Admin
              </button> */}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-20 text-xs text-slate-400 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Memorinhas. Feito artesanalmente com <Heart size={10} className="inline mb-1 fill-[#ef4444] text-[#ef4444]" /> no RS.
        </div>
      </div>
    </footer>
  );
};
