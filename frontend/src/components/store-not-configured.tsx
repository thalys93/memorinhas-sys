import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { STORE_NAME_FALLBACK } from '@/constants/store-branding';

export function StoreNotConfigured() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-8 text-center">
      <Logo size={48} variant="store" label={STORE_NAME_FALLBACK} />
      <h2 className="text-section-title text-foreground">Loja não configurada</h2>
      <p className="text-body text-muted-foreground max-w-md">
        Ainda não encontramos uma loja ativa para este endereço. Se você é lojista, configure sua
        loja no painel de gestão.
      </p>
      <Link
        to="/lojista/login"
        className="inline-flex items-center justify-center h-9 px-6 rounded-full text-[14px] font-normal bg-primary text-primary-foreground hover:bg-primary-hover transition-all duration-300"
      >
        Acessar painel do lojista
      </Link>
    </div>
  );
}
