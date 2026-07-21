import { Button } from '@/components/ui/button';
import { Instagram, Send } from 'lucide-react';
import type { Store } from '@/types/api';
import {
  instagramProfileUrl,
  normalizeInstagramHandle,
  whatsappUrl,
} from '@/lib/store-contact';

interface LandingFooterProps {
  store: Store;
}

function LandingFooter({ store }: LandingFooterProps) {
  const whatsapp = store.settings?.contact?.whatsapp;
  const whatsappMessage = store.settings?.contact?.whatsappMessage;
  const instagram = normalizeInstagramHandle(store.settings?.contact?.instagram);

  return (
    <div className="bg-surface-alt rounded-lg p-10 md:p-20 text-center mb-20 border border-border/60">
      <h2 className="text-section-title text-foreground mb-6 max-w-2xl mx-auto">
        Suas melhores lembranças merecem um lugar especial
      </h2>
      <p className="text-body text-muted-foreground mb-12">
        Pronta para eternizar seus momentos mais queridos?
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          disabled={!whatsapp}
          size="lg"
          onClick={() => {
            if (whatsapp) window.open(whatsappUrl(whatsapp, whatsappMessage), '_blank');
          }}
          className="w-full sm:w-auto gap-2"
        >
          Pedir pelo WhatsApp
          <Send size={18} />
        </Button>
        {instagram ? (
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.open(instagramProfileUrl(instagram), '_blank')}
            className="w-full sm:w-auto gap-2"
          >
            Ver mais no Instagram
            <Instagram size={18} />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default LandingFooter;
