
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

const NAV_LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#produtos', label: 'Produtos' },
  { href: '#por-que-nos', label: 'Por que nós' },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCustomizer = location.pathname === '/customizar';

  const handleNavigateHome = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateCustomizer = () => {
    navigate('/customizar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={handleNavigateHome}
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
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavigate(e, link.href)}
                    className="hover:text-[#b99778] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <Button
                onClick={handleNavigateCustomizer}
                className="px-5 py-2.5 bg-[#b99778] text-white rounded-full hover:bg-[#a6866a] transition-all hover:shadow-lg hover:shadow-[#b99778]/20 active:scale-95"
              >
                Pedir agora
              </Button>
            </>
          ) : (
            <Button
              onClick={handleNavigateHome}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Voltar para o início</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
