
import React from 'react';
import { Instagram, Send, MapPin, Heart, Settings } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer id="contato" className="bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-10 md:p-20 text-center shadow-sm mb-20 border border-slate-100">
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 max-w-2xl mx-auto">
            Suas melhores lembranças merecem um lugar especial
          </h2>
          <p className="text-slate-500 mb-12 text-lg">Pronta para eternizar seus momentos mais queridos?</p>

          {/* CTA Buttons - Cleaned up version */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/5551999999999" 
              className="w-full sm:w-auto px-10 py-4 bg-[#b99778] text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#a6866a] transition-all hover:shadow-lg hover:shadow-[#b99778]/20 active:scale-95"
            >
              Pedir pelo WhatsApp
              <Send size={18} />
            </a>
            <a 
              href="https://instagram.com/memorinha__" 
              className="w-full sm:w-auto px-10 py-4 bg-transparent border border-slate-200 text-slate-700 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
            >
              Ver mais no Instagram
              <Instagram size={18} />
            </a>
          </div>
        </div>

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
              <a href="#" className="hover:text-[#b99778] transition-colors">Início</a>
              <a href="#sobre" className="hover:text-[#b99778] transition-colors">Sobre</a>
              <button onClick={onAdminClick} className="flex items-center gap-1 hover:text-[#b99778] transition-colors">
                <Settings size={14} /> Admin
              </button>
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
