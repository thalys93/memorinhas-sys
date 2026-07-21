import React from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ArrowLeft, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { useStoreBranding } from '@/hooks/use-store-branding';
import {
  clearShopkeeperSitePreview,
  isShopkeeperSitePreview,
} from '@/lib/shopkeeper-preview';
import { useCartStore } from '@/store/use-cart-store';

const NAV_LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#produtos', label: 'Produtos' },
  { href: '#por-que-nos', label: 'Por que nós' },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { name, logoVariant } = useStoreBranding();
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.itemCount);

  const isCustomizer = location.pathname === '/customizar';
  const showBackToPanel =
    searchParams.get('from') === 'painel' || isShopkeeperSitePreview();

  const handleNavigateHome = () => {
    if (location.pathname !== '/') {
      navigate(showBackToPanel ? '/?from=painel' : '/');
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
      navigate(showBackToPanel ? '/?from=painel' : '/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToPanel = () => {
    clearShopkeeperSitePreview();
    navigate('/lojista');
  };

  const count = itemCount();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-11 bg-background/80 backdrop-blur-xl border-b border-border/60">
      <div className="viewport-content h-full flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleNavigateHome}
        >
          <Logo size={28} variant={logoVariant} framed={false} label={name} />
          <span className="text-[14px] font-semibold tracking-tight text-foreground hidden sm:block">
            {name}
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-5 text-[12px] font-normal text-foreground/80">
          {showBackToPanel ? (
            <Button
              onClick={handleBackToPanel}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Voltar ao painel</span>
              <span className="sm:hidden">Painel</span>
            </Button>
          ) : null}
          {!isCustomizer ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavigate(e, link.href)}
                    className="hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  to="/produtos"
                  className="hover:text-primary transition-colors duration-300"
                >
                  Catálogo
                </Link>
              </div>
              <ThemeToggle />
              <Button
                onClick={openCart}
                size="sm"
                variant="outline"
                className="relative gap-2"
              >
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Carrinho</span>
                {count > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                    {count}
                  </span>
                ) : null}
              </Button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button
                onClick={handleNavigateHome}
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
