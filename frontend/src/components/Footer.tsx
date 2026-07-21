import { MapPin, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { Link } from 'react-router-dom';
import { useStoreBranding } from '@/hooks/use-store-branding';

const footerSectionTitleClass = 'text-label text-muted-foreground uppercase tracking-widest';

export const Footer = () => {
  const { name, logoVariant, bio, location } = useStoreBranding();

  return (
    <footer id="contato" className="bg-surface-alt pt-24 pb-12">
      <div className="viewport-content">
        <div className="grid md:grid-cols-3 gap-12 items-start text-muted-foreground border-t border-border pt-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Logo size={32} variant={logoVariant} framed={false} label={name} />
              <span className="text-body font-semibold text-foreground tracking-tight">
                {name}
              </span>
            </div>
            <p className="text-body max-w-xs">{bio}</p>
          </div>

          <div className="flex flex-col gap-4">
            <h5 className={footerSectionTitleClass}>Localização</h5>
            <div className="flex items-center gap-2 text-body">
              <MapPin size={16} className="text-primary" />
              {location}
            </div>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <h5 className={footerSectionTitleClass}>Navegação</h5>
            <div className="flex flex-wrap md:justify-end gap-x-6 gap-y-3 text-body">
              <Link to="/" className="hover:text-primary transition-colors duration-300">
                Início
              </Link>
              <Link to="/#sobre" className="hover:text-primary transition-colors duration-300">
                Sobre
              </Link>
              <Link to="/termos" className="hover:text-primary transition-colors duration-300">
                Termos de Uso
              </Link>
              <Link
                to="/privacidade"
                className="hover:text-primary transition-colors duration-300"
              >
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-20 text-label font-normal text-muted-foreground uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} {name}. Feito artesanalmente com{' '}
          <Heart size={10} className="inline mb-1 fill-[#ef4444] text-[#ef4444]" /> no RS.
        </div>
      </div>
    </footer>
  );
};
