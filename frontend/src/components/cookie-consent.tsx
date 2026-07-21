import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'cookie-consent';

function hasAcceptedConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'accepted';
  } catch {
    return false;
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(() => !hasAcceptedConsent());

  if (!visible) return null;

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      // ponytail: localStorage-only consent; private mode just hides the banner for this session
    }
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed bottom-4 left-4 right-4 z-90 md:left-auto md:right-4 md:max-w-md"
    >
      <div className="rounded-2xl border border-border bg-background px-5 py-4 shadow-lg">
        <p className="text-body text-muted-foreground mb-4">
          Usamos cookies essenciais para o funcionamento do site e para melhorar sua experiência.
          Saiba mais na{' '}
          <Link to="/privacidade" className="text-primary underline-offset-4 hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <Button type="button" size="sm" className="w-full sm:w-auto" onClick={accept}>
          Aceitar
        </Button>
      </div>
    </div>
  );
}
