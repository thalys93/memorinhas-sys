import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-background">
      <Logo size={64} />
      <h1 className="text-section-title text-foreground">Página não encontrada</h1>
      <p className="text-body text-muted-foreground">O endereço que você acessou não existe.</p>
      <Link
        to="/"
        className="inline-flex items-center justify-center h-9 px-4 rounded-full text-[14px] font-normal bg-primary text-primary-foreground hover:bg-primary-hover transition-all duration-300"
      >
        Voltar ao início
      </Link>
    </div>
  );
}

export { NotFoundPage };
