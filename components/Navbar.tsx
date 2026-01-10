
import React from 'react';
import { Logo } from './Logo';
import { ArrowLeft } from 'lucide-react';

interface NavbarProps {
  onNavigateHome: () => void;
  isCustomizer: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome, isCustomizer }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={onNavigateHome}
        >
          <Logo size={40} />
          <span className="text-xl md:text-2xl font-semibold tracking-tighter text-slate-900 hidden sm:block">
            Memorinhas
          </span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8 text-sm font-medium text-slate-500 tracking-wide uppercase">
          {!isCustomizer ? (
            <>
              <div className="hidden md:flex items-center gap-8">
                <a href="#sobre" className="hover:text-[#b99778] transition-colors">Sobre</a>
                <a href="#produtos" className="hover:text-[#b99778] transition-colors">Produtos</a>
                <a href="#por-que-nos" className="hover:text-[#b99778] transition-colors">Por que nós</a>
              </div>
              <a 
                href="#produtos" 
                className="px-5 py-2.5 bg-[#b99778] text-white rounded-full hover:bg-[#a6866a] transition-all hover:shadow-lg hover:shadow-[#b99778]/20 active:scale-95"
              >
                Pedir agora
              </a>
            </>
          ) : (
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Voltar para o início</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
